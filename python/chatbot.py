from tensorflow.keras.models import load_model
import numpy as np
from preprocess import preprocess_text
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
import pandas as pd

# Load Data and Model
with open('conversations.txt', 'r', encoding='utf-8') as file:
    data = file.read().split('\n')

model = load_model('chatbot_model.h5')
tokenizer = Tokenizer()
tokenizer.fit_on_texts(data)
max_len = max(len(sentence.split()) for sentence in data)

def chatbot_response(user_input):
    user_input = preprocess_text(user_input)
    sequence = tokenizer.texts_to_sequences([user_input])
    sequence = pad_sequences(sequence, maxlen=max_len, padding='post')
    prediction = model.predict(sequence)
    response_index = np.argmax(prediction)
    return data[response_index]

# Chat Loop
print("Chatbot is ready! Type 'exit' to quit.")
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        break
    print("Bot:", chatbot_response(user_input))
