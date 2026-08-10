import chromadb
from embeddings import generate_embeddings
from Run_Docs import load_document
from Chunking import chunk_document

client=chromadb.PersistentClient(path="./chroma_db")

collection=client.get_or_create_collection("notes_collection")

def Store_Chunks(Chunks, filename:str):
    documents=[]
    embeddings=[]
    ids=[]  

    for i, chunk in enumerate(Chunks, start=1):
        embedding=generate_embeddings(chunk)
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
    print(f"Collection count: {collection.count()}")
       

        
         


