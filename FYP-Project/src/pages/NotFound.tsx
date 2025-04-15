import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex items-center justify-center mt-24 text-white">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! The page you're looking for doesn't exist.</p>
      <p className="text-lg text-gray-400 mb-8">It might have been moved or deleted.</p>
      <Link to="/">
            <button className="px-6 py-3 bg-red-700 rounded-lg text-white text-lg font-semibold hover:bg-red-800 transition-colors duration-300">
            Back to Home
            </button>
        </Link>
    </div>
  </div>
  )
}

export default NotFound