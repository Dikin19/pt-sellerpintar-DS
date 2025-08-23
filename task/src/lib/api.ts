import api from "./axios"

export async function getArticles() {
  const res = await api.get("/articles")
  return res.data
}