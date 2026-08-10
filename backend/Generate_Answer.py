import os
from Retrieval import retrieve_similar_chunks
from google import genai
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

def generate_answer(query, top_k=3,distance_threshold=0.30):
    similar_chunks, distances = retrieve_similar_chunks(query, top_k)
    if min(distances) > distance_threshold:
        return "I don't know based on the provided notes. (No sufficiently relevant content found.)",[]
    Context_Block = "\n\n".join(similar_chunks)
    prompt = f"""Answer the question using ONLY the context below. If the answer is not contained in the context, say "I don't know based on the provided notes."

    Context:
    {Context_Block}
    Question: {query}
    """
    response=client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )
    return response.text,similar_chunks
    
