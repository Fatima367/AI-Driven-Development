
# Role: Senior Software Engineer

**Objective:** Build a "Personal Chatbot with Memory" using Chainlit and the `openai-agents` SDK.

## 1. Project Overview
📚 Study Agent: Notes Summarizer & Quiz Generator

**Project Goal:** To create an **educational agent** that assists students by transforming lengthy PDF study notes into **concise summaries** and **interactive quizzes** (MCQ and mixed-style).

**Target User:** Students seeking efficient study tools and self-assessment methods.

* **UI:** HTML, CSS & JS
* **Model:** Google Gemini model named `gemini-2.5-flash` (via OpenAI Agents SDK).

## 2. Critical Technical Constraints
**You must adhere to the following strict configuration rules:**

1.  **Zero-Bloat Protocol (CRITICAL):**
    * **Do NOT write extra code.** Do not add bells, whistles (unless specified).
    * **No "Hallucinated" Features:** If it's not in the SDK docs, do not invent it.
2.  **API Configuration:**
    * Use the **OpenAI Agents SDK** Python Library configured for Gemini.
    * **Base URL:** `https://generativelanguage.googleapis.com/v1beta/openai/`
    * **API Key:** Load `GEMINI_API_KEY` from environment variables.
    * **Model:** Use `OpenaiChatCompletionModel` adapted for Gemini.
3.  **SDK Specificity:** You are using `openai-agents` SDK. This is **NOT** the standard `openai` library. You must use the specific syntax provided by the `openai-agents` SDK.
4.  **Error Recovery Protocol:**
    * If you encounter a `SyntaxError`, `ImportError`, or `AttributeError` related to `openai-agents` during development, **STOP**.
    * Do not guess the fix. **You MUST call the `get-library-docs` tool again** to re-read the documentation and verify the correct syntax before rewriting the code.
5.  **Dependency Management:** Use `uv` for package management.











## 🛠️ Technical Requirements & Dependencies

This stack requires specific configuration to bridge the OpenAI Agents SDK and the Gemini API.

* **Agent Development Platform:** **OpenAI Agents SDK**
    * *Model Integration:* The agent must be configured to use the **OpenAI-compatible endpoint** for the Gemini API.
* **LLM Model:** **`gemini-2.5-flash`**
    * **Configuration Method (Crucial):** The `openai.OpenAI` client (used within the Agents SDK) must be instantiated with two specific parameters to point it to the Gemini endpoint:
        1.  `api_key`: Must be set to the **Gemini API Key**.
        2.  `base_url`: Must be set to Google's OpenAI-compatible base URL (typically `https://generativelanguage.googleapis.com/v1beta/openai/`).
*   **Front-End (User Interface):** **HTML/CSS/JavaScript**
    * *Requirement:* The UI must be visually appealing, responsive, and provide an excellent user experience. It should feature a modern design with a thoughtful color palette, clear typography, and intuitive interactions. Proper sections for PDF upload, summary display, and quiz generation must be implemented with conditional visibility, ensuring a guided and uncluttered user flow (e.g., quiz section only appears after summary generation).
* **PDF Handling:** **PyPDF** (for better stability)
    *Usage:* Mandatory for reliable text extraction from uploaded PDF files.
* **Required Prompts:** Must include specific **system instructions** to ensure academic quality, conciseness for summaries, and JSON format adherence for quizzes.
---

## 3. Architecture & File Structure
*Note: The current directory is the root*

```text
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
````

## 4\. Implementation Steps

**Follow this exact logical flow. Do not skip steps.**

### Step 1: Documentation & Pattern Analysis

**Before writing any code, you must verify the SDK syntax.**

1.  **Action:** Use the MCP tool `get-library-docs` (or `resolve-library-id`) to fetch the official documentation for the **`openai-agents` SDK**.
2.  **Analysis:** Deeply analyze the returned documentation. Look specifically for:
      * How to define tools (decorators vs classes).
      * How to initialize the `Agent`.
      * How to pass the `OpenaiChatCompletionModel` to the agent.
      * **Check:** If you are unsure, query the docs again.

### Step 2: Tool Implementation (`tools.py`)

Create the memory functions **using the strict format found in Step 1**.

  * **Functions:**
      * `read_user_profile()`: Returns dict from `user_profile.json`. Handle `FileNotFoundError` (return empty dict).
      * `update_user_profile(key: str, value: str)`: Updates a specific key in JSON and saves.
  * **Format:** Ensure these are defined as tools recognizable by the `openai-agents` SDK (e.g., using the correct `@tool` decorator or `FunctionTool` wrapper).

### Step 3: Agent Configuration (`agent.py`)

Configure the LLM and Agent using the patterns found in Step 1.

  * Initialize the Gemini client using the Base URL.
  * Initialize the `OpenaiChatCompletionModel` with `gemini-2.5-flash`.
  * **Bind Tools:** Import tools from `tools.py` and register them to the agent instance exactly as the docs prescribe.


### Step 4: Environment & Dependencies

  * Create a `.env` template.
  * List necessary packages in `pyproject.toml` (ensure `openai-agents` is included).
  * **Smart Install:** Check `pyproject.toml` and the current environment. **If the dependencies are already installed, DO NOT run the installation commands again.**


## 💡 Core Agent Functionality & User Flow

The agent performs two primary, sequential functions.

### A. PDF Summarizer Module

1.  **Input Handling:**
    * The user uploads a PDF file (via a standard file input in the UI).
    * **Error Handling:** Agent must implement robust error handling for non-PDF files, corrupted documents, or file size limitations.
2.  **Text Extraction:**
    * **PyPDF** extracts all readable text content from the uploaded document.
3.  **Summary Generation:**
    * The extracted text is sent to our created Agent with a prompt engineered to generate a **clean, meaningful, and factually accurate summary**.
    * *Target Length:* Summary should target approximately **10-15%** of the original text length.
4.  **UI Display:**
    * The summary is rendered in the UI, supporting user/developer choice for display style (e.g., `card`, `block`, `container`).

### B. Quiz Generator Module

1.  **Trigger:**
    * A dedicated **"Create Quiz"** button/action becomes available after a successful summary generation.
2.  **Source Material:**
    * **Crucial:** The agent must use the **original, full extracted PDF text** (not the generated summary) as the source material for quiz question generation.
3.  **Quiz Generation Logic:**
    * The Agent is prompted to generate a set number of questions (e.g., minimum **10 questions** by default).
    * The output **must be structured in JSON** (Pydantic models are recommended within the OpenAI Agents SDK framework) for reliable UI parsing and answer checking.
4.  **Quiz Styles (User Choice):**
    * **Multiple-Choice Questions (MCQs):** Each question must include 4 options and clearly specify the correct answer in the output structure.
    * **Mixed-Style Quizzes:** Includes a combination of MCQs, **True/False**, and **Fill-in-the-Blank** or short answer prompts.


## ✅ Success Criteria & Future Scope

### Success Criteria (MVP)

* The agent successfully processes a **multi-page PDF** (e.g., 20+ pages) and generates a summary and quiz in a timely manner (e.g., **under 45 seconds** total).
* The generated summary is judged by a human reviewer to be **accurate and cohesive**.
* Generated quizzes are directly relevant to the source text and include a **valid, machine-readable JSON answer key**.

### Future Scope (V2)

* User login/storage for saving generated summaries and quizzes.
* Ability to export quizzes to popular formats (e.g., CSV, flashcards).
* Integration of an interactive study timer.