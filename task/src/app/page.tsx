
import Link from 'next/link'

export default async function ArticlesPage() {
  const res = await fetch("http://localhost:3000/api/articles", {
    cache: "no-store", // biar selalu fresh
  })
  const articles = await res.json()
  console.log(`apakah article ini ada?`, articles)

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Register
        </Link>
      </div>
      <div className="space-y-4">
        {/* {articles.map((article: any) => ())} */}
      </div>
    </main>
  )
}
