from embeddings import generate_embeddings
from Store import collection

def retrieve_similar_chunks(query, top_k):
    query_embedding = generate_embeddings(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results["documents"][0], results["distances"][0]

if __name__ == "__main__":
    query = "Why does a model do badly on new data even though it did well during training?"
    top_k = 3
    similar_chunks, distances = retrieve_similar_chunks(query, top_k)

    print(f"Top {top_k} similar chunks for the query '{query}':")
    for i, (chunk, distance) in enumerate(zip(similar_chunks, distances), start=1):
        print(f"Chunk {i}:")
        print(chunk)
        print(f"Distance: {distance}")
        print("---")
