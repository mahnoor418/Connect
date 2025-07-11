from flask import Blueprint
from app.controllers import userController

user_bp = Blueprint("user_bp", __name__)

# --- User routes ---
user_bp.route("/<string:user_id>", methods=["GET"])(userController.get_user)
user_bp.route("/<string:user_id>", methods=["PUT"])(userController.update_user)
user_bp.route("/<string:user_id>", methods=["DELETE"])(userController.delete_user)

# --- Post routes ---
user_bp.route("/<string:user_id>/posts", methods=["POST"])(userController.create_post)
user_bp.route("/<string:user_id>/posts/<string:post_id>", methods=["GET"])(userController.get_post)
user_bp.route("/<string:user_id>/feed/posts", methods=["GET"])(userController.get_feed_posts)
user_bp.route("/<string:user_id>/posts/<string:post_id>/update", methods=["PUT"])(userController.update_post)
user_bp.route("/<string:user_id>/posts/<string:post_id>/delete", methods=["DELETE"])(userController.delete_post)
user_bp.route("/<string:user_id>/posts/<string:post_id>/like", methods=["POST"])(userController.like_post)
user_bp.route("/<string:user_id>/posts/<string:post_id>/unlike", methods=["POST"])(userController.unlike_post)
user_bp.route("/<string:user_id>/posts/<string:post_id>/comment", methods=["POST"])(userController.comment_on_post)
user_bp.route("/<string:user_id>/posts/<string:post_ids>", methods=["GET"])(userController.get_multiple_posts)


# --- Follow routes ---
user_bp.route("/<string:user_id>/follow", methods=["PUT"])(userController.follow_user)
user_bp.route("/<string:user_id>/unfollow", methods=["PUT"])(userController.unfollow_user)

# --- Search route ---
user_bp.route("/search/query", methods=["GET"])(userController.search_users)
