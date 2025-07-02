export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-blue-50 to-purple-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500 mx-auto mb-4"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-purple-300 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
        <p className="text-gray-600">Please wait while we prepare your content</p>
      </div>
    </div>
  )
}
