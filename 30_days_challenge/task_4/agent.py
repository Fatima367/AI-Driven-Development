import os
from dotenv import load_dotenv
from agents import AsyncOpenAI, Agent, OpenAIChatCompletionsModel
from tools import read_user_profile, update_user_profile # Import the tools

# Load environment variables from .env file
load_dotenv()

# Initialize the Gemini client
# The GEMINI_API_KEY will be used as api_key for the OpenAI-compatible endpoint
gemini_client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# Initialize the OpenAIChatCompletionsModel for Gemini
gemini_model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash",
    openai_client=gemini_client
)

# Define the Study Agent
study_agent = Agent(
    name="Study Agent",
    instructions="You are an educational agent that assists students by transforming lengthy PDF study notes into brief and concise summaries and interactive quizzes (MCQ and mixed-style).",
    model=gemini_model,
    tools=[read_user_profile, update_user_profile] # Bind the tools
)


