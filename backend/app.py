from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from config import get_db_connection

app = Flask(__name__)
from flask import send_from_directory
import os
UPLOAD_PHOTO_FOLDER = "uploads/photos"
UPLOAD_LAB_FOLDER = "uploads/lab_reports"

ALLOWED_PHOTO_EXTENSIONS = {"png", "jpg", "jpeg"}
ALLOWED_LAB_EXTENSIONS = {"pdf"}

def allowed_file(filename, allowed_extensions):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions
CORS(app)

@app.route("/")
def home():
    return "Marine Pollution Backend Running"

@app.route("/register", methods=["POST"])
def register():

    data = request.json

    fullname = data["fullname"]
    email = data["email"]
    phone = data["phone"]
    password = data["password"]

    sql = """
    INSERT INTO users(fullname, email, phone, password)
    VALUES(%s,%s,%s,%s)
    """

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(sql, (fullname, email, phone, password))

    db.commit()

    cursor.close()
    db.close()

    return jsonify({
        "message": "Registration Successful"
    })
@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]
    role = data["role"]

    sql = """
        SELECT * FROM users
        WHERE email=%s AND password=%s AND role=%s
    """

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(sql, (email, password, role))

    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user:
        return jsonify({
            "success": True,
            "message": "Login Successful",
            "role": role
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid Email, Password or Role"
        })

@app.route("/report", methods=["POST"])
def report():

    reporter_name = request.form["reporter_name"]
    reporter_email = request.form["reporter_email"]
    pollution_type = request.form["pollution_type"]
    severity = request.form["severity"]
    report_date = request.form["report_date"]
    location = request.form["location"]
    description = request.form["description"]
    latitude = request.form.get("latitude")
    longitude = request.form.get("longitude")

    photo = request.files.get("photo")
    lab_report = request.files.get("lab_report")

    photo_filename = None
    lab_report_filename = None

    if photo and photo.filename:
        if not allowed_file(photo.filename, ALLOWED_PHOTO_EXTENSIONS):
            return jsonify({
                "message": "Invalid photo file type."
            }), 400

        photo_filename = secure_filename(photo.filename)
        photo.save(os.path.join(UPLOAD_PHOTO_FOLDER, photo_filename))

    if lab_report and lab_report.filename:
        if not allowed_file(lab_report.filename, ALLOWED_LAB_EXTENSIONS):
            return jsonify({
                "message": "Only PDF files are allowed for lab reports."
            }), 400

        lab_report_filename = secure_filename(lab_report.filename)
        lab_report.save(os.path.join(UPLOAD_LAB_FOLDER, lab_report_filename))

    db = get_db_connection()
    cursor = db.cursor()

    sql = """
   INSERT INTO pollution_reports
(reporter_name, reporter_email, pollution_type, severity, report_date, location, description, photo, lab_report, latitude, longitude)
VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
"""

    cursor.execute(sql, (
    reporter_name,
    reporter_email,
    pollution_type,
    severity,
    report_date,
    location,
    description,
    photo_filename,
    lab_report_filename,
    latitude,
    longitude
))

    db.commit()

    cursor.close()
    db.close()

    return jsonify({
        "message": "Pollution Report Submitted Successfully!"
    })

@app.route("/reports", methods=["GET"])
def get_reports():

    sql = """
SELECT id, pollution_type, severity, report_date,
       location, description, reporter_name, reporter_email,
       status, photo, lab_report, latitude, longitude
FROM pollution_reports
ORDER BY id DESC
"""
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(sql)
    reports = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(reports)

@app.route("/users/count", methods=["GET"])
def get_user_count():

    sql = "SELECT COUNT(*) FROM users"

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(sql)
    result = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify({"count": result[0]})

@app.route("/high-risk-areas", methods=["GET"])
def get_high_risk_areas():

    sql = """
    SELECT COUNT(DISTINCT location)
    FROM pollution_reports
    WHERE severity = 'High'
    """
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(sql)
    result = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify({"count": result[0]})

@app.route("/pending-reports", methods=["GET"])
def get_pending_reports():

    sql = """
    SELECT COUNT(*)
    FROM pollution_reports
    WHERE status = 'Pending'
    """

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(sql)
    result = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify({"count": result[0]})

@app.route("/severity-count", methods=["GET"])
def get_severity_count():
    sql = """
    SELECT severity, COUNT(*)
    FROM pollution_reports
    GROUP BY severity
    """
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(sql)
    results = cursor.fetchall()

    cursor.close()
    db.close()

    data = {}
    for row in results:
        data[row[0]] = row[1]

    return jsonify(data)

@app.route("/pollution-type-count", methods=["GET"])
def get_pollution_type_count():

    sql = """
    SELECT pollution_type, COUNT(*)
    FROM pollution_reports
    GROUP BY pollution_type
    """

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(sql)
    results = cursor.fetchall()

    cursor.close()
    db.close()

    data = {}
    for row in results:
        data[row[0]] = row[1]

    return jsonify(data)

@app.route("/update-status", methods=["POST"])
def update_status():

    data = request.json

    report_id = data["id"]
    status = data["status"]

    db = get_db_connection()
    cursor = db.cursor()

    sql = """
    UPDATE pollution_reports
    SET status = %s
    WHERE id = %s
    """

    cursor.execute(sql, (status, report_id))

    db.commit()

    cursor.close()
    db.close()

    return jsonify({
        "message": "Report status updated successfully!"
    })

@app.route("/uploads/photos/<filename>")
def uploaded_photo(filename):
    return send_from_directory(
        UPLOAD_PHOTO_FOLDER,
        filename
    )
@app.route("/uploads/lab_reports/<filename>")
def uploaded_lab_report(filename):
    return send_from_directory(
        UPLOAD_LAB_FOLDER,
        filename
    )

if __name__ == "__main__":
    app.run(debug=True)