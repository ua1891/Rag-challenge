def load_document(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

if __name__ == "__main__":
    text = load_document("data/sample_notes.txt")
    print(f"Loaded {len(text)} characters")
    print("---")
    print(text[:500])  # print first 500 characters as a preview