import os
import chromadb
from dotenv import load_dotenv
from embeddings import generate_embeddings
from Run_Docs import load_document
from Chunking import chunk_document

load_dotenv()

# Module-level cache — populated on first call to get_collection().
# Nothing is created at import time.
_client = None
_collection = None


def get_collection():
    """Return the shared ChromaDB collection, initializing it on first call."""
    global _client, _collection
    if _collection is None:
        db_path = os.environ.get("CHROMA_DB_PATH", "./chroma_db")
        _client = chromadb.PersistentClient(path=db_path)
        _collection = _client.get_or_create_collection("notes_collection")
    return _collection


def Store_Chunks(Chunks, filename: str):
    collection = get_collection()
    documents = []
    embeddings = []
    ids = []

    for i, chunk in enumerate(Chunks, start=1):
        embedding = generate_embeddings(chunk)
        documents.append(chunk)
        embeddings.append(embedding)
        ids.append(f"{filename}_chunk_{i}")
        print(f"Embedded chunk {i}/{len(Chunks)}")

    collection.add(
        documents=documents,
        embeddings=embeddings,
        ids=ids
    )
    print(f"Stored {len(Chunks)} chunks in Chroma.")


if __name__ == "__main__":
    Text = load_document("data/sample_notes.txt")
    Chunk_Size = 500
    Overlap = 50
    Chunks = chunk_document(Text, Chunk_Size, Overlap)
    Store_Chunks(Chunks, filename="sample_notes")
    # get_collection() has already been called inside Store_Chunks above,
    # so the cached instance is reused here.
    print(f"Collection count: {get_collection().count()}")

       

        
         


