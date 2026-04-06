import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-lg font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-[hsl(var(--muted))]">
        The page you requested does not exist or was moved.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-[hsl(var(--accent))] underline underline-offset-4"
      >
        Go home
      </Link>
    </div>
  )
}
