# 📚 Personal Chatbot with Memory: Study Agent

This project implements an AI-driven "Study Agent" designed to assist students by transforming lengthy PDF study notes into concise summaries and interactive quizzes. Leveraging the OpenAI Agents SDK with the Google Gemini model, this agent provides an efficient tool for learning and self-assessment.

## 🎯 Project Goal

To create an **educational agent** that assists students by transforming lengthy PDF study notes into **concise summaries** and **interactive quizzes** (MCQ and mixed-style).

**Target User:** Students seeking efficient study tools and self-assessment methods.

## 🛠️ Technical Stack

*   **UI:** HTML, CSS & JavaScript for a responsive and intuitive user interface.
*   **LLM Model:** Google Gemini model (`gemini-2.5-flash`) via OpenAI Agents SDK.
*   **Backend:** FastAPI (Python) for serving the frontend and API endpoints.
*   **PDF Handling:** `PyPDF` for reliable text extraction from PDF files.
*   **Package Management:** `uv`
*   **Agent Development Platform:** OpenAI Agents SDK, configured to use the OpenAI-compatible endpoint for the Gemini API.

## ✨ Core Features

The agent provides two primary functionalities:

### A. PDF Summarizer Module

1.  **Input Handling:** Users upload PDF files via the UI. The agent includes robust error handling for various file issues.
2.  **Text Extraction:** `PyPDF` extracts all readable text content from the uploaded document.
3.  **Summary Generation:** The extracted text is processed by the agent to generate a clean, meaningful, and factually accurate summary, typically targeting 10-15% of the original text length.
4.  **UI Display:** The generated summary is rendered in the UI for easy consumption.

### B. Quiz Generator Module

1.  **Trigger:** A "Create Quiz" action becomes available after a successful summary generation.
2.  **Source Material:** The agent uses the **original, full extracted PDF text** (not the summary) as the source for quiz question generation.
3.  **Quiz Generation Logic:** The agent generates a minimum of 10 questions. The output is structured in JSON for reliable UI parsing and answer checking.
4.  **Quiz Styles:** Supports both Multiple-Choice Questions (MCQs) with 4 options and a clear correct answer, and Mixed-Style Quizzes (combining MCQs, True/False, and Fill-in-the-Blank/short answer prompts).

## 🚀 Getting Started

*(Further instructions on setting up the environment, installing dependencies, and running the application will be provided here in detail.)*

## 📁 Project Structure

```
.
├── .env                  # Environment variables
├── .venv/                # Python Virtual Environment (managed by uv)
├── /frontend
|       ├── index.html    # Root HTML file for responsive frontend
|       ├── style.css     # CSS for styling, colors, and motions for UI
|       └── main.js       # Javascript for handling frontend functionality
|
├── main.py               # FastAPI application entry point, serves frontend and API endpoints
├── tools.py              # Memory management functions (SDK Specific Format)
├── agent.py              # Agent configuration & tool binding
├── user_profile.json     # JSON Storage (Auto-created if missing)
└── pyproject.toml        # UV Config
```
