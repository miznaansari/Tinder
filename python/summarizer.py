from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    chat_text = data.get('chat_text')

    if not chat_text:
        return jsonify({'error': 'No chat text provided'}), 400

    # Summarize using BART
    summary = summarizer(chat_text, max_length=150, min_length=30, do_sample=False)
    return jsonify({'summary': summary[0]['summary_text']})

if __name__ == '__main__':
    app.run(port=5001)
