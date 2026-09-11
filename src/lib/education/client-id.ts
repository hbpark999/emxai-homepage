const STORAGE_KEY = "emxai_education_client_id";

export function getEducationClientId() {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const id = window.crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, id);
  return id;
}
