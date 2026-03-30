export function Header() {
  return (
    <header className="border-b-2 border-warm-ink bg-gradient-to-b from-sun-100 to-warm-white py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="flex items-center gap-3">
          <span
            className="text-4xl"
            role="img"
            aria-label="Sun"
          >
            ☀️
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-none tracking-tight text-warm-ink sm:text-5xl">
            Sunbuddy
          </h1>
        </div>
        <p className="mt-2 font-sans text-base text-warm-muted">
          Your personal weather companion
        </p>
      </div>
    </header>
  )
}
