from flask import Flask, jsonify, request, render_template
import json
import requests
rasa_api = "http://localhost:5005/webhooks/rest/webhook"

app = Flask(__name__)
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/webhook',methods=['POST'])
def webhook():
    userMessage = json.loads(request.data)['message']
    print(f'python received: {userMessage}')
    response = requests.post(rasa_api , json={'message': userMessage})
    print(f'Rasa1: {response}')
    response = response.json()
    print(f'Rasa2: {response}')
    response = ", ".join([obj['text'] for obj in response])
    print(f'After the else {response}')
    return jsonify({"response": response}), 201

if __name__ == '__main__':
    app.run(debug=True, port=3000)