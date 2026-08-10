const BASE_URL = "http://localhost:8000";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/Upload/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
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