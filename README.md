# SpectroDraw

SpectroDraw is an experimental audio visualization and sonification tool that converts hand-drawn images into sound and generates a real audio spectrogram preview.

The project allows users to draw directly in a web browser, transform the drawing data into audio frequencies, export the result as a WAV file, and visualize the generated audio using FFT-based spectrogram analysis.

## Features

- Draw directly using mouse or touchscreen
- Convert drawings into audio signals
- Generate WAV audio files
- Real spectrogram preview generated from the output audio
- FFT-based audio analysis
- Automatic drawing processing and normalization
- Works on desktop and Android environments using Node.js and Termux

## How It Works

1. The user creates a drawing on the canvas.
2. The drawing is converted into pixel data.
3. Pixel positions are mapped into audio frequencies.
4. The generated frequencies are converted into a WAV audio signal.
5. The WAV file is analyzed using FFT.
6. A real spectrogram visualization is generated from the audio data.

## Installation

Clone the repository:

```bash
git clone https://github.com/yonukwasim520-cyber/Initial-release-of-SpectroDraw.git

Enter the project folder:

cd Initial-release-of-SpectroDraw

Install dependencies:

npm install

Running

Start the server:

node server.js

Open your browser:

http://localhost:3000

Project Structure

SpectroDraw/
│
├── engine/
│   ├── sound.js
│   └── spectrogram.js
│
├── public/
│   └── index.html
│
├── output/
│
├── server.js
├── package.json
└── package-lock.json

Technologies

Node.js

Express.js

JavaScript

Web Canvas API

FFT Audio Analysis

WAV Audio Processing


Use Cases

SpectroDraw can be used for:

Experimental sound design

Audio visualization

Learning relationships between images and frequencies

Creative coding projects

Digital art and sonification experiments


License

This project is released as an open-source project. You are free to explore, modify, and improve the code
