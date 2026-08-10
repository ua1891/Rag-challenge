from fastapi import APIRouter, HTTPException, UploadFile
from Schema import AskRequest, AskResponse
from Generate_Answer import generate_answer
from Store import Store_Chunks
from Chunking import chunk_document
router = APIRouter(prefix="/ask", tags=["Ask"])

@router.post("/", response_model=AskResponse)
def ask_question(request: AskRequest):
    try:
        answer, sources = generate_answer(request.question, request.top_k)
        return AskResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rag error: {str(e)}")

@router.get("/", response_model=AskResponse)
def ask_question_get(question: str, top_k: int = 3):
    try:
        answer, sources = generate_answer(question, top_k)
        return AskResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rag error: {str(e)}")
    
Router=APIRouter(prefix="/Upload", tags=["Upload"])
@Router.post("/upload")
def upload_file(file: UploadFile):
    if file.content_type != "text/plain" and not file.filename.lower().endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt (text/plain) files are allowed.")
        
    try:
        raw_contents = file.file.read()
        try:
            contents = raw_contents.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="File must be a valid UTF-8 encoded text file.")
            
        Chunk_Size = 500
        Overlap = 50
        Chunks = chunk_document(contents, Chunk_Size, Overlap)
        Store_Chunks(Chunks, filename=file.filename)
        return {"message": f"File '{file.filename}' uploaded and processed successfully."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload error: {str(e)}")