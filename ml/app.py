# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib

# app = Flask(__name__)
# CORS(app)

# model = joblib.load("expense_model.pkl")

# @app.route("/predict", methods=["POST"])
# def predict():
#     data = request.json
#     text = data["text"]

#     prediction = model.predict([text])[0]

#     return jsonify({
#         "category": prediction
#     })

# if __name__ == "__main__":
#     app.run(port=8000)





# version2



from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# 🔥 Safe model path (IMPORTANT for Render)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "expense_model.pkl")

model = joblib.load(model_path)

@app.route("/")
def home():
    return jsonify({"message": "ML Service Running 🚀"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({"error": "Missing 'text' field"}), 400

        text = data["text"]

        prediction = model.predict([text])[0]

        return jsonify({
            "category": prediction
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# 🔥 IMPORTANT: Render uses PORT env variable
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)