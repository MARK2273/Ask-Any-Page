# AskAnyPage Chrome Extension

Analyze and ask questions about any webpage using Google Gemini AI.

## Installation

1. **Build the Extension**:

   ```bash
   npm install
   npm run build
   ```

   This will create a `dist` directory.

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions`.
   - Enable "Developer mode" (top right toggle).
   - Click "Load unpacked".
   - Select the `dist` directory inside the project folder.

## Usage

1. **Setup API Key**:

   - Get your API Key from [Google AI Studio](https://aistudio.google.com/).
   - Click the extension icon.
   - Enter your API Key and click "Save Key".

2. **Analyze Page**:

   - Navigate to any text-heavy webpage (news, blog, documentation).
   - Click "Analyze Page" in the extension popup.
   - Wait for the "Page Analyzed" status.

3. **Ask Questions**:
   - Type your question in the chat box (e.g., "Summarize this article").
   - Click "Ask" or press Enter.

## Privacy

- Your API Key is stored locally on your device (`chrome.storage.local`).
- Page content is sent ONLY to Google's Gemini API for analysis.
- No data is collected by the extension developer.
