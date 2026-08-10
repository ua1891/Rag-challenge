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
    metadatas = []

    for i, chunk in enumerate(Chunks, start=1):
        embedding = generate_embeddings(chunk)
        documents.append(chunk)
        embeddings.append(embedding)
        ids.append(f"{filename}_chunk_{i}")
        metadatas.append({"filename": filename, "chunk_index": i})
        print(f"Embedded chunk {i}/{len(Chunks)}")

    collection.add(
        documents=documents,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas,
    )
    print(f"Stored {len(Chunks)} chunks in Chroma.")


def list_stored_notes():
    results = get_collection().get(include=["metadatas"])
    summary = {}
    if results.get("metadatas"):
        for meta in results["metadatas"]:
            fname = meta.get("filename", "unknown") if meta else "unknown"
            summary[fname] = summary.get(fname, 0) + 1

    return [
        {"filename": fname, "chunk_count": count}
        for fname, count in summary.items()
    ]


def delete_note_by_filename(filename: str):
    collection = get_collection()
    collection.delete(where={"filename": filename})


if __name__ == "__main__":
    Text = load_document("data/sample_notes.txt")
    Chunk_Size = 500
    Overlap = 50
    Chunks = chunk_document(Text, Chunk_Size, Overlap)
    Store_Chunks(Chunks, filename="sample_notes")
    # get_collection() has already been called inside Store_Chunks above,
    # so the cached instance is reused here.
    print(f"Collection count: {get_collection().count()}")

       

        
         


