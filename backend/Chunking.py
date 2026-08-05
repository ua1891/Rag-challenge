from Run_Docs import load_document

def chunk_document(Text, chunk_size, overlap):
    Chunks = []
    Start = 0
    while Start < len(Text):
        End=Start + chunk_size
        Chunk = Text[Start:End]
        Chunks.append(Chunk)
        Start = End - overlap
    return Chunks

if __name__ == "__main__":
    Text = load_document("data/sample_notes.txt")
    Chunk_Size = 1000
    Overlap = 100
    Chunks = chunk_document(Text, Chunk_Size, Overlap)
    print(f"Total Chunks: {len(Chunks)}")

    for i, chunk in enumerate(Chunks, start=1):
        print(f"Chunk {i} ({len(chunk)} chars):")
        print(chunk)
        print("---")