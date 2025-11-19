export const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export async function apiGet(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPost(path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiDelete(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: token } : {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPatch(path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
