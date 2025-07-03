import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
from preprocess import preprocess_text

# Load Data
with open('conversations.txt', 'r', encoding='utf-8') as file:
    data = file.read().split('\n')

cleaned_data = [preprocess_text(sentence) for sentence in data if sentence.strip()]

# Tokenization
tokenizer = Tokenizer()
tokenizer.fit_on_texts(cleaned_data)

sequences = tokenizer.texts_to_sequences(cleaned_data)
max_len = max(len(seq) for seq in sequences)
sequences = pad_sequences(sequences, maxlen=max_len, padding='post')

# Label Encoding
encoder = LabelEncoder()
labels = encoder.fit_transform(data)

# Model Building
model = Sequential([
    Embedding(len(tokenizer.word_index) + 1, 100, input_length=max_len),
    LSTM(64),
    Dense(64, activation='relu'),
    Dense(len(set(data)), activation='softmax')
])

model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
print(model.summary())

# Train Model
model.fit(sequences, labels, epochs=20, batch_size=32)
model.save('chatbot_model.h5')
print("Model saved as chatbot_model.h5")
