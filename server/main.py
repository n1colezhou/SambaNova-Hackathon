from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# SambaNova API configuration
SAMBA_API_URL = "https://api.sambanova.ai/v1/chat/completions"
SAMBA_API_KEY = os.getenv("SAMBA_API_KEY")
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {SAMBA_API_KEY}"
}

# System prompt configuration
SYSTEM_PROMPT = (
    "Given a block of text, output results in JSON format:\n\n"
    "Extract Events and Dates: Identify events and their dates. Format dates as 'YYYY-MM-DD'. "
    "Group events by date as follows:\n"
    "{\n    \"date\": {\n        \"event\": [\n            {\n                \"description\": "
    "\"Event description\",\n                \"details\": \"Additional details (if any)\"\n            }\n        ]\n    }\n}\n"
    "If multiple events share a date, group them together. If no date is specified, leave the date field blank.\n\n"
    "Example Structure:\n{\n    \"2024-01-01\": {\n        \"event\": [\n            {\n                "
    "\"description\": \"New Year's celebration\",\n                \"details\": \"Celebrations included fireworks.\"\n            }\n        ]\n    },\n    \"2023\": {\n        \"event\": [\n            {\n                \"description\": \"Major scientific discovery announced\",\n                \"details\": \"Details revealed in June.\"\n            }\n        ]\n    }\n}\n"
    "Time-Blocking Suggestions: Analyze the text for tasks. For each task, suggest how to split work into manageable time blocks, including a reasonable duration and ideal start date. Use the following structure:\n"
    "{\n    \"task\": {\n        \"description\": \"Task description\",\n        \"suggestions\": [\n            {\n                \"time_block\": \"Duration\",\n                \"start_time\": \"YYYY-MM-DDTHH:MM:SS\",\n                \"end_time\": \"YYYY-MM-DDTHH:MM:SS\",\n                \"details\": \"Focus on specific sections.\"\n            }\n        ]\n    }\n}\n"
    "Output: Provide the final output strictly in JSON format, including both extracted events and time-blocking suggestions. No other format or explanation is allowed outside the JSON."
)

# Define request body model
class Message(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    messages: list[Message]

@app.post("/generate-chat-completion")
async def generate_chat_completion(request: ChatCompletionRequest):
    # Append system message to the request
    messages = request.messages + [{"role": "system", "content": SYSTEM_PROMPT}]

    # Send request to SambaNova API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                SAMBA_API_URL,
                headers=HEADERS,
                json={
                    "stream": False,
                    "model": "Meta-Llama-3.1-8B-Instruct",
                    "messages": messages
                }
            )
            response.raise_for_status()  # Raise HTTPError for bad responses
            return response.json()  # Return the JSON response from SambaNova

        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error from SambaNova API: {exc.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
