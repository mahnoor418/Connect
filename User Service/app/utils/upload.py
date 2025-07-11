from flask import current_app
from datetime import datetime
from werkzeug.utils import secure_filename
from pathlib import Path
import os
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'txt'}  # Add or modify as needed

def _allowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file):
    if not (file and _allowed(file.filename)):
        return None
        return None

    clean = secure_filename(file.filename)
    stem, ext = os.path.splitext(clean)
    timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%S")
    final_name = f"{stem}_{timestamp}{ext}"

    upload_path = Path(current_app.config['UPLOAD_FOLDER'])
    upload_path.mkdir(parents=True, exist_ok=True)

    print(f"[DEBUG] Upload folder from config: {upload_path}")  # <--- THIS

    full_path = upload_path / final_name
    file.save(str(full_path))
    print(f"[SAVE] File saved to: {full_path}")

    return final_name
