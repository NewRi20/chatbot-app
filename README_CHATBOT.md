# Valley High Academy Chatbot

This is a chatbot application for Valley High Academy, built with React, Vite, and Google AI Studio API (Gemini).

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure API Key:**
    -   Open the `.env` file in the root directory.
    -   Replace `YOUR_API_KEY_HERE` with your actual Google AI Studio API key.
    -   You can get an API key from [Google AI Studio](https://aistudio.google.com/).

3.  **Run the Application:**
    ```bash
    npm run dev
    ```

## Project Structure

-   `src/Chatbot.tsx`: Main chatbot component containing the logic and UI.
-   `src/Chatbot.css`: Styles for the chatbot.
-   `src/ChatApp.tsx`: Main application wrapper.
-   `src/chat-global.css`: Global styles including the color palette.

## Customization

You can modify the `SYSTEM_INSTRUCTION` constant in `src/Chatbot.tsx` to update the information the chatbot knows about the school.
