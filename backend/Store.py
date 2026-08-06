import chromadb
from embeddings import generate_embeddings
from Run_Docs import load_document
from Chunking import chunk_document

client=chromadb.PersistentClient(path="./chroma_db")

collection=client.get_or_create_collection("notes_collection")

def Store_Chunks(Chunks):
    documents=[]
    embeddings=[]
    ids=[]  

    for i, chunk in enumerate(Chunks, start=1):
        embedding=generate_embeddings(chunk)
        documents.append(chunk)
        embeddings.append(embedding)
        ids.append(f"chunk_{i}")   
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
    Store_Chunks(Chunks)
    print(f"Collection count: {collection.count()}")
       

        
         


