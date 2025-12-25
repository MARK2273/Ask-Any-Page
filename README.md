# AskAnyPage 🤖📄

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=google&logoColor=white)

**AskAnyPage** is a powerful Chrome Extension that transforms your browsing experience. With a single click, you can unlock the knowledge hidden in any webpage using Google's state-of-the-art **Gemini AI**.

> **"It's like having a smart assistant reading over your shoulder, ready to answer anything."**

---

## ✨ Features

- **🔍 Smart Content Extraction**: Automatically identifies the "meat" of a page (articles, documentation, blogs), ignoring ads and sidebar noise.
- **💬 Context-Aware Chat**: Ask questions like _"Summarize this"_, _"What are the key points?"_, or specific technical details, and get answers based _only_ on the current page.
- **🎨 Premium UI**: A beautiful, modern interface featuring glassmorphism, smooth animations, and a distraction-free design.
- **🔒 Privacy First**: Your API Key and data never leave your browser (except to go directly to Google). No middleman servers.

## 🚀 Getting Started

### 1. Prerequisites

You need a **Google Gemini API Key**. It's free!

- Go to [Google AI Studio](https://aistudio.google.com/).
- Click **"Get API Key"**.

### 2. Installation (Developer Mode)

Since this is a developer build, you'll load it manually:

1. **Download/Clone** this repository.
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
3. Open Chrome and go to `chrome://extensions`.
4. Enable **Developer mode** (top right).
5. Click **Load unpacked**.
6. Select the `dist` folder generated in your project.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Custom Variables & Flexbox), TypeScript.
- **Build Tool**: [Vite](https://vitejs.dev/) + [@crxjs/vite-plugin](https://crxjs.dev/).
- **AI Model**: Google Gemini 1.5 Flash (via `@google/generative-ai`).
- **Browser API**: Manifest V3 (Service Workers, Scripting, Storage).

## 📖 Usage Guide

1. **Activate**: Click the AskAnyPage extension icon in your toolbar.
2. **Setup**: Paste your Gemini API key (one-time setup).
3. **Analyze**: Click the big **"Analyze Page"** button. The extension will confirm when it has "read" the site.
4. **Chat**: Type questions like:
   - _"Summarize the pricing section."_
   - _"What is the main argument of this author?"_
   - _"Extract all code examples into a list."_

## 🔒 Privacy Policy

We take privacy seriously.

- **Local Storage**: Your API Key is stored encrypted in your browser's local storage.
- **Direct Communication**: Content extraction happens on your device. Requests are sent directly from your browser to Google's API servers.
- **No Tracking**: We do not track your history, clicks, or question data.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

_Built with ❤️ by [Your Name]_
