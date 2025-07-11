from pathlib import Path
import os

from flask import Flask, send_from_directory
from flask_cors import CORS

from app.routes.userRoutes import user_bp
from app.database import connect_to_mongo

# ───────────────────────────────────────── Flask setup
app = Flask(__name__)
CORS(app)  # allow all origins, methods, and headers


app.config['UPLOAD_FOLDER'] = Path(r"C:/Users/mamuj/OneDrive/Desktop/Connect/User Service/app/uploads")

# ───────────────────────────────────────── static route
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    """
    Serve files from app/uploads/ so React (or any client) can hit:
      http://127.0.0.1:5000/uploads/<filename>
    """
    full_path = Path(app.config['UPLOAD_FOLDER']) / filename
    print(f"[UPLOADS] Serving file from: {full_path}")
    if not full_path.exists():
        return f"File not found: {full_path}", 404
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

EXTERNAL_UPLOAD_DIR = Path(f"C:/Users/mamuj/OneDrive/Desktop/Connect/User Service/uploads")

@app.route("/external-uploads/<path:filename>")
def serve_external_upload(filename):
    EXTERNAL_UPLOAD_DIR = Path(r"C:/Users/mamuj/OneDrive/Desktop/Connect/User Service/uploads")
    full_path = EXTERNAL_UPLOAD_DIR / filename

    print(f"[DEBUG] Looking for: {full_path}")
    print(f"[DEBUG] File exists: {full_path.exists()}")

    if not full_path.exists():
        return f"File not found: {full_path}", 404
    return send_from_directory(EXTERNAL_UPLOAD_DIR, filename)

# ───────────────────────────────────────── blueprints & DB
connect_to_mongo()
app.register_blueprint(user_bp, url_prefix="/api/users")

# ───────────────────────────────────────── main
if __name__ == "__main__":
    app.run(debug=True, port=5000)
