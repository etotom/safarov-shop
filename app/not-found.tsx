import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-custom py-24 text-center">
      <h1 className="font-serif text-8xl mb-6 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
        404
      </h1>
      <h2 className="font-serif text-4xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg font-light">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn-primary inline-block">
        Go Home
      </Link>
    </div>
  )
}
