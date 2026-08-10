from fastapi import FastAPI, HTTPException
from Routers import router, Router
import os
import uvicorn

app = FastAPI(
    title="RAG API",
    description="This is a RAG API that provides information about courses and allows users to manage their courses.",
    version="1.0.0"
)
app.include_router(router)
app.include_router(Router)

@app.get("/")
async def root():
    return {"message": "Welcome to the RAG API!"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    is_dev = os.environ.get("ENV", "production").lower() == "development"
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=is_dev)


