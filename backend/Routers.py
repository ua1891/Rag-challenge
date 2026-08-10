from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
import json
from Schema import AskRequest, AskResponse
from Generate_Answer import generate_answer
from Store import Store_Chunks, Store_Chunks_Stream, list_stored_notes, delete_note_by_filename
from Chunking import chunk_document
router = APIRouter(prefix="/ask", tags=["Ask"])

@router.post("/", response_model=AskResponse)
def ask_question(request: AskRequest):
    try:
        answer, sources = generate_answer(request.question, request.top_k)
        return AskResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rag error: {str(e)}")
    
Router=APIRouter(prefix="/Upload", tags=["Upload"])
@Router.post("/upload")
def upload_file(file: UploadFile):
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

    if file.content_type != "text/plain" and not file.filename.lower().endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt (text/plain) files are allowed.")
        
    if getattr(file, 'size', 0) and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum allowed size is 5MB.")

    try:
        raw_contents = file.file.read()
        if len(raw_contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File too large. Maximum allowed size is 5MB.")

        try:
            contents = raw_contents.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="File must be a valid UTF-8 encoded text file.")

        Chunk_Size = 500
        Overlap = 50
        Chunks = chunk_document(contents, Chunk_Size, Overlap)
        
        def process_and_stream():
            try:
                for current, total in Store_Chunks_Stream(Chunks, filename=file.filename):
                    progress = int((current / total) * 100)
                    yield json.dumps({"status": "processing", "progress": progress}) + "\n"
                yield json.dumps({"status": "success", "message": f"File '{file.filename}' uploaded and processed successfully."}) + "\n"
            except Exception as e:
                yield json.dumps({"status": "error", "message": str(e)}) + "\n"
                
        return StreamingResponse(process_and_stream(), media_type="application/x-ndjson")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload error: {str(e)}")


@Router.get("/notes")
def get_stored_notes():
    try:
        notes = list_stored_notes()
        return {"notes": notes, "total_files": len(notes)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list notes: {str(e)}")


@Router.delete("/notes/{filename}")
def delete_note(filename: str):
    try:
        delete_note_by_filename(filename)
        return {"message": f"Successfully deleted {filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete note: {str(e)}")