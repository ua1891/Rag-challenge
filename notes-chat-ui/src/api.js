const BASE_URL = "http://localhost:8000";

export async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/Upload/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let lastMessage = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(l => l.trim() !== '');
    
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.status === 'processing') {
          if (onProgress) onProgress(data.progress);
        } else if (data.status === 'success') {
          lastMessage = data;
        } else if (data.status === 'error') {
          throw new Error(data.message);
        }
      } catch (e) {
        if (e.message !== "Unexpected end of JSON input" && !e.message.startsWith("Unexpected token")) {
            throw e;
        }
      }
    }
  }
  
  if (!lastMessage) throw new Error("Upload stream ended without success message");
  return lastMessage;
}

export async function askQuestion(question, topK = 3) {
  const res = await fetch(`${BASE_URL}/ask/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, top_k: topK }),
  });
  if (!res.ok) throw new Error(`Ask failed: ${res.status}`);
  return res.json();
}

export async function getStoredNotes() {
  const res = await fetch(`${BASE_URL}/Upload/notes`);
  if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);
  return res.json();
}

export async function deleteNote(filename) {
  const res = await fetch(`${BASE_URL}/Upload/notes/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete note: ${res.status}`);
  return res.json();
}