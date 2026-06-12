from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("expense_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data["text"]

    prediction = model.predict([text])[0]

    return jsonify({
        "category": prediction
    })

if __name__ == "__main__":
    app.run(port=8000)