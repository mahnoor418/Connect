# --- FILE: app/routes/user_routes.py ----------------------------------------
from flask import Blueprint, jsonify, abort, request
from datetime import datetime
from bson import ObjectId, errors as bson_errors

from app.utils.activityUtils import log_activity
from app.utils.upload        import save_file
from app.database            import connect_to_mongo, get_db

# --------------------------------------------------------------------------- #
#  DB setup
# --------------------------------------------------------------------------- #
connect_to_mongo()
db     = get_db()
users  = db["users"]
posts  = db["posts"]

user_bp = Blueprint("users", __name__, url_prefix="/users")

# --------------------------------------------------------------------------- #
#  Helpers
# --------------------------------------------------------------------------- #
def _iso(dt: datetime | None) -> str | None:
    """Return ISO-8601 string or None."""
    return dt.isoformat() if isinstance(dt, datetime) else None


def serialize_post(post: dict) -> dict:
    """Convert a MongoDB post document into JSON-ready dict."""
    return {
        "_id"        : str(post["_id"]),
        "user"       : str(post.get("user")),
        "description": post.get("description", ""),
        "media"      : post.get("media", ""),
        "mentions"   : post.get("mentions", []),
        "likes"      : [str(uid) for uid in post.get("likes", [])],
        "comments"   : post.get("comments", []),
        "location"   : post.get("location", {}),
        "created_at" : _iso(post.get("created_at")),
        "updated_at" : _iso(post.get("updated_at")),
    }


def serialize_user(user_doc: dict, posts_data: list[dict] | None = None) -> dict:
    """User core fields plus—optionally—full post data."""
    user_json = {
        "_id"           : str(user_doc["_id"]),
        "name"          : user_doc.get("name", ""),
        "username"      : user_doc.get("username", ""),
        "email"         : user_doc.get("email", ""),
        "profilePicture": user_doc.get("profilePicture", "/default.jpg"),
        "bio"           : user_doc.get("bio", ""),
        "followers"     : [str(uid) for uid in user_doc.get("followers", [])],
        "following"     : [str(uid) for uid in user_doc.get("following", [])],
        "posts"         : [str(pid) for pid in user_doc.get("posts", [])],
    }
    if posts_data is not None:
        user_json["postsData"] = posts_data
    return user_json

# --------------------------------------------------------------------------- #
#  Routes
# --------------------------------------------------------------------------- #
@user_bp.route("/<user_id>", methods=["GET"])
def get_user(user_id: str):
    """Return the user profile *with every post they’ve created*."""
    try:
        user_oid = ObjectId(user_id)
    except bson_errors.InvalidId:
        abort(400, description="Invalid user ID")

    user_doc = users.find_one({"_id": user_oid})
    if not user_doc:
        abort(404, description="User not found")

    post_filter  = {"$or": [{"user": user_id}, {"user": user_oid}]}
    posts_cursor = posts.find(post_filter).sort("created_at", -1)
    posts_data   = [serialize_post(p) for p in posts_cursor]

    log_activity(user_id, "getUser",
                 f"User {user_id} with {len(posts_data)} posts retrieved.")
    return jsonify(serialize_user(user_doc, posts_data)), 200


@user_bp.route("/<user_id>/posts/<post_ids>", methods=["GET"])
def get_multiple_posts(user_id: str, post_ids: str):
    """Return a specific list of posts for a given user."""
    try:
        ObjectId(user_id)                     # quick sanity check
    except bson_errors.InvalidId:
        abort(400, description="Invalid user ID")

    raw_ids = [pid.strip() for pid in post_ids.split(",") if pid.strip()]
    try:
        obj_ids = [ObjectId(pid) for pid in raw_ids]
    except bson_errors.InvalidId:
        abort(400, description="One or more post IDs are invalid")

    posts_cursor = posts.find({"_id": {"$in": obj_ids}}).sort("created_at", -1)
    posts_data   = [serialize_post(p) for p in posts_cursor]

    log_activity(user_id, "getMultiplePosts", f"Fetched posts: {raw_ids}")
    return jsonify({"posts": posts_data}), 200


# --------------------------------------------------------------------------- #
#  User CRUD
# --------------------------------------------------------------------------- #
def update_user(user_id):
    try:
        obj_id = ObjectId(user_id)
    except bson_errors.InvalidId:
        abort(400, description="Invalid user ID")

    user = users.find_one({"_id": obj_id})
    if not user:
        abort(404, description="User not found")

    update_fields: dict = {}
    if "username" in request.form:
        update_fields["username"] = request.form["username"]
    if "email" in request.form:
        update_fields["email"] = request.form["email"]

    # File upload
    if "profilePicture" in request.files:
        saved_path = save_file(request.files["profilePicture"])
        if saved_path:
            update_fields["profilePicture"] = saved_path

    if update_fields:
        users.update_one({"_id": obj_id}, {"$set": update_fields})

    log_activity(user_id, "updateUser", f"User {user_id} updated.")
    return jsonify(serialize_user(users.find_one({"_id": obj_id}))), 200


def delete_user(user_id):
    try:
        obj_id = ObjectId(user_id)
    except bson_errors.InvalidId:
        abort(400, description="Invalid user ID")

    if not users.find_one({"_id": obj_id}):
        abort(404, description="User not found")

    users.delete_one({"_id": obj_id})
    posts.delete_many({"user": user_id})

    log_activity(user_id, "deleteUser", f"User {user_id} deleted.")
    return jsonify({"message": "User deleted successfully"}), 200

# --------------------------------------------------------------------------- #
#  Post CRUD
# --------------------------------------------------------------------------- #
def create_post(user_id):
    """
    Example use-site that calls ``save_file``; unchanged apart from import tweaks.
    """
    description  = request.form.get("description", "")
    mentions_raw = request.form.get("mentions", "")
    media_path   = save_file(request.files["media"]) if "media" in request.files else ""

    post = {
        "user"       : user_id,
        "description": description,
        "media"      : media_path,
        "mentions"   : mentions_raw,
        "likes"      : [],
        "comments"   : [],
        "created_at" : datetime.utcnow(),
        "updated_at" : datetime.utcnow()
    }

    result = posts.insert_one(post)
    users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"posts": str(result.inserted_id)}}
    )

    log_activity(user_id, "createPost", f"User {user_id} created a post.")
    post["_id"] = result.inserted_id
    return jsonify(serialize_post(post)), 201

def get_feed_posts(user_id):
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        abort(404, description="User not found")

    following_ids = user.get("following", [])
    feed_cursor   = posts.find({"user": {"$in": following_ids}}).sort("created_at", -1)
    log_activity(user_id, "getFeedPosts", f"User {user_id} retrieved feed.")
    return jsonify([serialize_post(p) for p in feed_cursor]), 200


def get_post(user_id, post_id):
    post = posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        abort(404, description="Post not found")

    # Ensure likes / mentions are always lists
    like_ids    = post.get("likes") or []
    mention_ids = post.get("mentions") or []
    if not isinstance(like_ids, list):
        like_ids = [like_ids]
    if not isinstance(mention_ids, list):
        mention_ids = [mention_ids]

    # Populate objects
    post["user_obj"]    = users.find_one({"_id": ObjectId(post["user"])})
    post["like_objs"]   = list(users.find({"_id": {"$in": like_ids}})) if like_ids else []
    post["mention_objs"] = list(users.find({"_id": {"$in": mention_ids}})) if mention_ids else []

    # Comments: attach user objects
    populated_comments = []
    for comment in post.get("comments", []):
        comment_user = users.find_one({"_id": ObjectId(comment["user"])})
        comment["user_obj"] = comment_user
        populated_comments.append(comment)
    post["comments"] = populated_comments

    return jsonify(serialize_post(post)), 200


def update_post(user_id, post_id):
    try:
        post_obj_id = ObjectId(post_id)
    except bson_errors.InvalidId:
        abort(400, description="Invalid post ID")

    post = posts.find_one({"_id": post_obj_id})
    if not post:
        abort(404, description="Post not found")

    new_description = request.json.get("description")
    if new_description is None:
        abort(400, description="Missing description in request body")

    posts.update_one({"_id": post_obj_id}, {"$set": {"description": new_description}})
    
    return jsonify({"message": "Post updated successfully", "description": new_description}), 200

def delete_post(user_id, post_id):
    post = posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        abort(404, description="Post not found")
    if post["user"] != user_id:
        abort(403, description="Unauthorized")

    posts.delete_one({"_id": ObjectId(post_id)})
    users.update_one({"_id": ObjectId(user_id)}, {"$pull": {"posts": post_id}})

    log_activity(user_id, "deletePost", f"Post {post_id} deleted.")
    return jsonify({"message": "Post deleted successfully"}), 200


def like_post(user_id, post_id):
    post = posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        abort(404, description="Post not found")

    if user_id not in post.get("likes", []):
        posts.update_one({"_id": ObjectId(post_id)},
                         {"$addToSet": {"likes": user_id}})
        log_activity(user_id, "likedPost", f"{user_id} liked post {post_id}")

    return jsonify(serialize_post(posts.find_one({"_id": ObjectId(post_id)}))), 200


def unlike_post(user_id, post_id):
    post = posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        abort(404, description="Post not found")

    if user_id in post.get("likes", []):
        posts.update_one({"_id": ObjectId(post_id)},
                         {"$pull": {"likes": user_id}})
        log_activity(user_id, "unlikedPost", f"{user_id} unliked post {post_id}")

    return jsonify(serialize_post(posts.find_one({"_id": ObjectId(post_id)}))), 200


def comment_on_post(user_id, post_id):
    # Try JSON first…
    data = request.get_json(silent=True) or {}
    # …then fall back to form-data for safety
    text = data.get("text") or request.form.get("text")

    if not text or not text.strip():
        # Optional: log what you actually received
        app.logger.warning("Empty comment payload: %s", request.data)
        abort(400, description="Comment text required")

    comment = {
        "user": user_id,
        "text": text.strip(),
        "createdAt": datetime.utcnow()
    }

    result = posts.update_one(
        {"_id": ObjectId(post_id)},
        {
            "$push": {"comments": comment},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    if result.modified_count == 0:
        abort(404, description="Post not found")

    log_activity(user_id, "commentOnPost", f"{user_id} commented on {post_id}")

    updated_post = posts.find_one({"_id": ObjectId(post_id)})
    return jsonify(serialize_post(updated_post)), 201
# --------------------------------------------------------------------------- #
#  Follow / Unfollow
# --------------------------------------------------------------------------- #
def follow_user(user_id):
    follow_id = request.get_json(silent=True, force=True).get("follow_id")
    if not follow_id:
        return jsonify({"error": "follow_id is required"}), 400

    users.update_one({"_id": ObjectId(user_id)},   {"$addToSet": {"following": follow_id}})
    users.update_one({"_id": ObjectId(follow_id)}, {"$addToSet": {"followers": user_id}})
    return jsonify({"message": f"{user_id} followed {follow_id}"}), 200


def unfollow_user(user_id):
    unfollow_id = request.get_json(silent=True, force=True).get("unfollow_id")
    if not unfollow_id:
        return jsonify({"error": "unfollow_id is required"}), 400

    users.update_one({"_id": ObjectId(user_id)},     {"$pull": {"following": unfollow_id}})
    users.update_one({"_id": ObjectId(unfollow_id)}, {"$pull": {"followers": user_id}})
    return jsonify({"message": f"{user_id} unfollowed {unfollow_id}"}), 200

# --------------------------------------------------------------------------- #
#  Search
# --------------------------------------------------------------------------- #
def search_users():
    query = request.args.get("q")
    if not query:
        return jsonify({"error": "Missing search query"}), 400

    found_cursor = users.find({
        "$or": [
            {"username": {"$regex": query, "$options": "i"}},
            {"email"   : {"$regex": query, "$options": "i"}}
        ]
    })

    response = []
    for user in found_cursor:
        uid = str(user["_id"])
        response.append({
            "_id"          : uid,
            "username"     : user.get("username", ""),
            "email"        : user.get("email", ""),
            "profilePicture": user.get("profilePicture", "/default.jpg"),
            "postCount"    : posts.count_documents({"user": uid}),
            "followerCount": len(user.get("followers", []))
        })

    return jsonify(response), 200
