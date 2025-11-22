import os
import uvicorn
import json
import logging # Import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pypdf import PdfReader
from io import BytesIO
from agent import study_agent # Import the study agent
from agents import Runner # Import Runner
from pydantic import BaseModel, Field, ValidationError # Import ValidationError
from typing import List, Literal, Union

# --- Pydantic Models for Quiz Structure ---
class MCQOption(BaseModel):
    id: str = Field(..., description="Unique identifier for the option (e.g., 'a', 'b', 'c', 'd')")
    text: str = Field(..., description="The text content of the option")

class MCQQuestion(BaseModel):
    type: Literal["mcq"] = "mcq"
    question: str = Field(..., description="The multiple-choice question")
    options: List[MCQOption] = Field(..., description="List of possible answer options")
    correct_answer_id: str = Field(..., description="The ID of the correct option")

class TrueFalseQuestion(BaseModel):
    type: Literal["true_false"] = "true_false"
    question: str = Field(..., description="The true/false question")
    correct_answer: bool = Field(..., description="The correct answer (true or false)")

class FillInTheBlankQuestion(BaseModel):
    type: Literal["fill_in_the_blank"] = "fill_in_the_blank"
    question_with_blank: str = Field(..., description="The question with a blank indicated by '______'")
    correct_answer: str = Field(..., description="The correct word or phrase to fill the blank")

# Union for mixed-style quizzes
QuizQuestion = Union[MCQQuestion, TrueFalseQuestion, FillInTheBlankQuestion]

class Quiz(BaseModel):
    title: str = Field(..., description="Title of the quiz")
    questions: List[QuizQuestion] = Field(..., description="List of quiz questions")


app = FastAPI()

# Mount static files for the frontend
app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """
    Serves the main HTML page of the application.
    """
    with open("frontend/index.html", "r") as f:
        return HTMLResponse(content=f.read())

@app.post("/upload_pdf")
async def upload_pdf(pdf_file: UploadFile = File(...)):
    """
    Handles PDF file uploads, extracts text, and returns the extracted text and a summary.
    """
    if not pdf_file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    try:
        # Read PDF content
        content = await pdf_file.read()
        reader = PdfReader(BytesIO(content))
        
        full_text = ""
        for page in reader.pages:
            full_text += page.extract_text() + "\n"

        if not full_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. The PDF might be image-based or corrupted.")

        # Call the generate_summary endpoint to get the summary
        summary_response = await generate_summary({"text": full_text})
        summary = summary_response.get("summary", "No summary generated.")

        return {"full_text": full_text, "summary": summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {e}")

@app.post("/generate_summary")
async def generate_summary(text: dict):
    """
    Generates a summary of the provided text using the study agent.
    """
    full_text = text.get("text", "")
    if not full_text:
        raise HTTPException(status_code=400, detail="No text provided for summarization.")

    try:
        summary_prompt = f"Please provide a concise summary of the following text. The summary should be approximately 10-15% of the original text length:\n\n{full_text}"
        result = await Runner.run(study_agent, summary_prompt)
        summary = result.final_output
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {e}")

@app.post("/generate_quiz")
async def generate_quiz(request_body: dict):
    """
    Generates a quiz from the provided text using the study agent.
    """
    full_text = request_body.get("text", "")
    if not full_text:
        raise HTTPException(status_code=400, detail="No text provided for quiz generation.")

    try:
        quiz_prompt = f"""
        Your task is to generate a comprehensive quiz based on the provided text.
        The quiz must contain at least 10 questions and should include a mix of Multiple-Choice Questions (MCQ), True/False, and Fill-in-the-Blank questions.

        For MCQs:
        - Provide 4 distinct options.
        - Clearly specify the 'correct_answer_id' corresponding to one of the options.

        For True/False questions:
        - Provide a clear statement and indicate if it's true or false.

        For Fill-in-the-Blank questions:
        - Use '______' to indicate the blank.
        - Provide the 'correct_answer' to fill the blank.

        IMPORTANT: Your entire response MUST be a single JSON object, and ONLY the JSON object. Do NOT include any preamble text, explanations, markdown outside the JSON block, or any other extraneous characters.
        The JSON object MUST strictly adhere to the following Pydantic schema. Pay close attention to types, field names, and nested structures:

        ```json
        {json.dumps(Quiz.model_json_schema(), indent=2)}
        ```

        Here is the text to generate the quiz from:
        {full_text}
        """
        logger.info(f"Quiz prompt length: {len(quiz_prompt)} characters.")

        result = await Runner.run(study_agent, quiz_prompt)
        # Clean the agent's output by stripping markdown code block delimiters
        cleaned_output = result.final_output.strip()
        if cleaned_output.startswith("```json"):
            cleaned_output = cleaned_output[len("```json"):].strip()
        if cleaned_output.endswith("```"):
            cleaned_output = cleaned_output[:-len("```")].strip()

        # Attempt to parse the JSON output from the agent
        quiz_data = json.loads(cleaned_output)
        
        # Validate the quiz data against the Pydantic model
        validated_quiz = Quiz.model_validate(quiz_data)
        
        return {"quiz": validated_quiz.model_dump()}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Agent returned invalid JSON for quiz: {e}. Raw output: {result.final_output}")
    except ValidationError as e: # Catch Pydantic validation errors
        raise HTTPException(status_code=500, detail=f"Agent returned quiz data that does not match schema: {e}. Raw output: {result.final_output}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {e}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)