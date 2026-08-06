import os
import time
from google.genai import types
from dotenv import load_dotenv
from Run_Docs import load_document
from Chunking import chunk_document
from google import genai
load_dotenv()
client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
def generate_embeddings(text, retries=3):
    for attempt in range(retries):
        try:
            response = client.models.embed_content(
                model="gemini-embedding-001",
                contents=text,
                config=types.EmbedContentConfig(output_dimensionality=768),
            )
            return response.embeddings[0].values
        except Exception as e:
            print(f"Attempt {attempt+1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(2)
            else:
                raise

if __name__ == "__main__":
    Text = load_document("data/sample_notes.txt")
    Chunk_Size = 500
    Overlap = 50
    Chunks = chunk_document(Text, Chunk_Size, Overlap)

    for i, chunk in enumerate(Chunks, start=1):
        embedding = generate_embeddings(chunk)
        print(f"Chunk {i} Embedding Length: {len(embedding)}")
