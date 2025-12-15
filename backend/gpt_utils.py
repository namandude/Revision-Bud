from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_lecture(transcript):
    response = client.chat.completions.create(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        messages=[
            {"role": "system", "content": "You are an expert summarization assistant who can create clear, concise, and structured notes from any transcript."},
            {"role": "user", "content": f"""Here is a transcript:
{transcript}

Your task:
- Summarize the transcript into easy-to-read notes.
- Organize the content under clear headings and subheadings.
- Highlight important points, concepts, and examples where applicable.
- Use '-' for bullet points (avoid using '*' or '+').
- Use '**' for bold only for key terms, not every bullet.
- Keep it concise, clean, and visually appealing.
- Suitable for someone wanting a quick but complete understanding.

Generate the summary notes accordingly."""}
        ]
    )

    return response.choices[0].message.content
def chat_with_transcript(transcript, history):
    """Chatbot that answers based on transcript + conversation history"""
    response = client.chat.completions.create(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        messages=[
            {"role": "system", "content": "You are a helpful teaching assistant. Use only the transcript to answer. Maintain conversation flow."},
            {"role": "system", "content": f"Transcript:\n{transcript}"}
        ] + history
    )

    return response.choices[0].message.content
 


import json
import re

def generate_flashcards_from_transcript(transcript):

    prompt = f"""
    You are an expert in creating flashcards for top-level competitive exams like JEE and NEET.
    
    Generate **flashcards** from the following transcript with these rules:

    1. **Complete Coverage**: Every single concept, definition, formula, fact, date, example, and explanation must be turned into at least one question.
    2. **Progressive Difficulty**: Start with easy/basic questions, then medium, then very hard/challenging questions.
    3. **Diverse Question Types**: Include multiple-choice, true/false, fill-in-the-blank, short answer, calculation-based, reasoning, and tricky questions.
    4. **Tricky/Analytical Questions**: Include questions that test application, conceptual understanding, and deep reasoning, not just rote memorization.
    5. **Exam-Oriented**: Questions should be similar to JEE/NEET style, focusing on understanding, application, and problem-solving.
    6. **Structured JSON Output**: Return ONLY valid JSON list like this:
       [
         {{ "question": "...", "answer": "..." }},
         {{ "question": "...", "answer": "..." }}
       ]
    7. **Optional Categorization**: You may group questions by topics or subtopics if transcript has multiple concepts.

    **Instructions for Model**:
    - Start from the beginning of transcript to the end, cover everything sequentially.
    - Include 2-3 questions of each type if possible.
    - Ensure difficulty progression: Easy → Medium → Hard.
    - Include some tricky and analytical questions to test deep understanding.
    - Keep answers concise but complete.

    Transcript:
    {transcript}
    """
    response = client.chat.completions.create(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        messages=[
            {"role": "system", "content": "You output ONLY valid JSON. No extra text."},
            {"role": "user", "content": prompt}
        ]
    )

    content = response.choices[0].message.content.strip()

    try:
        # 🔥 Extract JSON even if model adds text
        match = re.search(r"\[.*\]", content, re.S)
        if not match:
            raise ValueError("No JSON array found")

        json_text = match.group(0)
        flashcards = json.loads(json_text)

        if not isinstance(flashcards, list):
            raise ValueError("Flashcards is not a list")

        return flashcards

    except Exception as e:
        return [{
            "question": "Flashcards parsing failed",
            "answer": content
        }]
