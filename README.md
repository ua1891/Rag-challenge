# RAG Challenge

A Retrieval-Augmented Generation (RAG) API built with **FastAPI**, **ChromaDB**, and **Google Gemini**. It lets you upload plain-text documents, which are chunked, embedded, and stored in a local vector database. You can then ask questions in natural language and receive answers grounded strictly in the uploaded content — the model will not hallucinate answers outside the provided notes.

---

## Architecture

```
Upload                Chunking             Embedding
POST /Upload/upload ──► chunk_document() ──► generate_embeddings()
                                                    │
                                                    ▼
                                           ChromaDB (persistent)
                                                    │
Ask                   Retrieval            Generation
POST /ask/ ──────────► retrieve_similar_chunks() ──► Gemini generate_content()
                       (vector similarity search)         │
                                                          ▼
                                                     JSON response
```

1. **Upload** — A `.txt` file is POST-ed to `/Upload/upload`.
2. **Chunking** — The text is split into overlapping fixed-size chunks (500 chars, 50-char overlap).
3. **Embedding** — Each chunk is embedded via `gemini-embedding-001` (768 dimensions).
4. **Storage** — Embeddings + documents are stored in a local ChromaDB collection (`notes_collection`).
5. **Retrieval** — At query time the question is embedded and the top-k most similar chunks are fetched.
6. **Generation** — The retrieved chunks are injected into a prompt sent to `gemini-3.5-flash-lite`, which answers using only that context.

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/rag-challenge.git
cd rag-challenge
```

### 2. Create and activate a virtual environment

```bash
python -m venv backend/venv

# Windows
backend\venv\Scripts\activate

# macOS / Linux
source backend/venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in your values:

```env
GOOGLE_API_KEY=your-gemini-api-key-here
# Optional overrides (defaults shown):
# PORT=8000
# ENV=production          # set to "development" to enable uvicorn auto-reload
# CHROMA_DB_PATH=./chroma_db
```

---

## Running the server

```bash
cd backend

# Development (auto-reload on file changes)
ENV=development python main.py

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

The interactive API docs are available at **http://localhost:8000/docs**.

---

## API Reference

### `POST /ask/`

Ask a question against the uploaded documents.

**Request body:**
```json
{
  "question": "What is overfitting?",
  "top_k": 3
}
```

| Field      | Type    | Default | Description                              |
|------------|---------|---------|------------------------------------------|
| `question` | string  | —       | The natural-language question to answer  |
| `top_k`    | integer | `3`     | Number of chunks to retrieve             |

**Response:**
```json
{
  "answer": "Overfitting occurs when a model learns the training data too well...",
  "sources": [
    "...relevant chunk text 1...",
    "...relevant chunk text 2..."
  ]
}
```

---

### `POST /Upload/upload`

Upload a plain-text document to be chunked, embedded, and stored.

**Request:** `multipart/form-data` with a single `file` field (`.txt` files only).

```bash
curl -X POST http://localhost:8000/Upload/upload \
     -F "file=@data/sample_notes.txt"
```

**Response:**
```json
{
  "message": "File '\''sample_notes.txt'\'' uploaded and processed successfully."
}
```

---

## Known Limitations

- **Local persistence only** — ChromaDB stores data in `./chroma_db` on disk. There is no remote or cloud-backed vector store; data is lost if that directory is deleted.
- **No authentication** — All endpoints are publicly accessible. Do not expose this API on the public internet without adding an auth layer.
- **No tests** — There are currently no automated unit or integration tests.
- **Plain-text files only** — The upload endpoint reads raw UTF-8 text. PDF, DOCX, or other formats are not supported.
- **Single collection** — All uploaded documents are stored in one shared ChromaDB collection (`notes_collection`). There is no per-user or per-document isolation.
