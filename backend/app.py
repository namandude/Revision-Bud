

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os, uuid, json

from whisper_utils import transcribe_audio
from gpt_utils import analyze_lecture, chat_with_transcript, generate_flashcards_from_transcript
from pdf_utils import extract_pdf_text
from redis_client import redis_client

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

print("🔥 USING REDIS CLIENT:", redis_client)

# ----------------------------
# REDIS TEST
# ----------------------------
@app.route("/redis-test")
def redis_test():
    redis_client.set("REDIS_TEST_KEY", "WORKING")
    return {"status": "ok"}

# ----------------------------
# LIST EXAMS
# ----------------------------
@app.route("/list-exams")
def list_exams():
    keys = redis_client.keys("exam:*")
    return {"exam_keys": keys}

# ----------------------------
# UPLOAD
# ----------------------------
@app.route("/upload", methods=["POST"])
def upload():
    try:
        audio = request.files.get("file")
        exam_name = request.form.get("exam_name")
        pdf = request.files.get("question_pdf")

        if not audio or not exam_name:
            return {"error": "Audio + exam name required"}, 400

        exam_id = str(uuid.uuid4())

        filepath = os.path.join(
            UPLOAD_FOLDER,
            f"{exam_id}_{secure_filename(audio.filename)}"
        )
        audio.save(filepath)
        print("✅ Audio saved")

        transcript = transcribe_audio(filepath)
        print("✅ Transcript generated")

        question_text = extract_pdf_text(pdf) if pdf else ""
        if pdf:
            print("✅ PDF extracted")

        exam_data = {
            "exam_id": exam_id,
            "exam_name": exam_name,
            "transcript": transcript,
            "question_bank": question_text,
            "summary": "",
            "flashcards": []
        }

        redis_client.set(
            f"exam:{exam_id}",
            json.dumps(exam_data)
        )

        redis_client.expire(f"exam:{exam_id}", 6 * 60 * 60)

        return {
            "exam_id": exam_id,
            "message": "Upload successful"
        }

    except Exception as e:
        print("❌ ERROR:", e)
        return {"error": str(e)}, 500

# ----------------------------
# GET EXAM
# ----------------------------
@app.route("/exam/<exam_id>")
def get_exam(exam_id):
    raw = redis_client.get(f"exam:{exam_id}")
    if not raw:
        return {"error": "Invalid exam_id"}, 400

    return json.loads(raw)

# ----------------------------
# GENERATE SUMMARY
# ----------------------------
@app.route("/generate-summary", methods=["POST"])
def generate_summary():
    exam_id = request.json.get("exam_id")
    raw = redis_client.get(f"exam:{exam_id}")

    if not raw:
        return {"error": "Invalid exam_id"}, 400

    data = json.loads(raw)

    if data["summary"]:
        return {"summary": data["summary"]}

    summary = analyze_lecture(data["transcript"])
    data["summary"] = summary

    redis_client.set(f"exam:{exam_id}", json.dumps(data))
    return {"summary": summary}

# ----------------------------
# CHAT
# ----------------------------
@app.route("/ask", methods=["POST"])
def ask():
    exam_id = request.json.get("exam_id")
    question = request.json.get("question")

    raw = redis_client.get(f"exam:{exam_id}")
    if not raw:
        return {"error": "Invalid exam_id"}, 400

    data = json.loads(raw)

    answer = chat_with_transcript(
        data["transcript"],
        [{"role": "user", "content": question}]
    )

    return {"answer": answer}

# ----------------------------
# FLASHCARDS
# ----------------------------
@app.route("/generate-flashcards", methods=["POST"])
def generate_flashcards():
    exam_id = request.json.get("exam_id")
    raw = redis_client.get(f"exam:{exam_id}")

    if not raw:
        return {"error": "Invalid exam_id"}, 400

    data = json.loads(raw)

    if data["flashcards"]:
        return {"flashcards": data["flashcards"]}

    combined = data["transcript"]
    flashcards = generate_flashcards_from_transcript(combined)

    data["flashcards"] = flashcards
    redis_client.set(f"exam:{exam_id}", json.dumps(data))

    return {"flashcards": flashcards}

if __name__ == "__main__":
    app.run(debug=True)
