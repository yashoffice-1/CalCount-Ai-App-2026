import * as React from 'react'

export function AuthLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 -top-40 h-[420px] w-[420px] rounded-full bg-[hsl(var(--accent))]/20 blur-[120px]" />
        <div className="absolute -bottom-48 -left-24 h-[480px] w-[480px] rounded-full bg-violet-500/15 blur-[120px] dark:bg-violet-400/12" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-400/10 blur-[100px] dark:bg-sky-400/8" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">{children}</div>

      <p className="relative z-10 mt-10 text-center text-[11px] tracking-wide text-[hsl(var(--muted))]">
        CalCount AI · secure admin access
      </p>
    </div>
  )
}
