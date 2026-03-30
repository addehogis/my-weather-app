import { useState, type FormEvent } from 'react'
import { WeatherPage } from '@/components/WeatherPage'
import { searchWeather } from '@/api/weather'
import { CityNotFoundError } from '@/types/weather'
import type { WeatherResult } from '@/types/weather'

// ── Idle / search page ─────────────────────────────────────────────────────────

function SearchScreen({
  onSearch,
  isLoading,
  error,
}: {
  onSearch: (city: string) => void
  isLoading: boolean
  error?: string
}) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const t = value.trim()
    if (t && !isLoading) onSearch(t)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/40 mb-4 3xl:text-lg 3xl:mb-8">
          Sunbuddy
        </p>
        <h1 className="text-4xl sm:text-5xl xl:text-6xl 3xl:text-8xl font-thin text-center">
          What's the weather?
        </h1>

        <form
          onSubmit={handleSubmit}
          role="search"
          className="w-full max-w-sm mt-12 space-y-3 3xl:max-w-lg 3xl:mt-20 3xl:space-y-5"
        >
          <label htmlFor="city-search" className="sr-only">City name</label>
          <input
            id="city-search"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a city…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={isLoading}
            autoFocus
            className="w-full bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl px-5 py-4 text-lg text-white placeholder:text-white/30 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-colors disabled:opacity-50 3xl:text-3xl 3xl:py-6 3xl:px-8 3xl:rounded-3xl"
          />
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="w-full bg-white/20 hover:bg-white/30 border border-white/20 rounded-2xl py-4 text-base font-medium text-white transition-colors disabled:opacity-50 3xl:text-2xl 3xl:py-6 3xl:rounded-3xl"
          >
            {isLoading ? 'Searching…' : 'Get Weather'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-300 text-center max-w-sm 3xl:text-xl 3xl:mt-8">
            {error}
          </p>
        )}
      </div>

      <footer className="py-4 text-center">
        <p className="text-xs text-white/20 3xl:text-sm">Sunbuddy — OpenWeatherMap</p>
      </footer>
    </div>
  )
}

// ── App root ───────────────────────────────────────────────────────────────────

type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: WeatherResult }
  | { status: 'error'; message: string }

function App() {
  const [state, setState] = useState<AppState>({ status: 'idle' })
  const [lastResult, setLastResult] = useState<WeatherResult | null>(null)

  async function handleSearch(city: string) {
    setState({ status: 'loading' })
    try {
      const data = await searchWeather(city)
      setLastResult(data)
      setState({ status: 'success', data })
    } catch (err) {
      const message =
        err instanceof CityNotFoundError
          ? err.message
          : 'Something went wrong. Please try again.'
      setState({ status: 'error', message })
    }
  }

  const currentResult = state.status === 'success' ? state.data : lastResult
  const isLoading = state.status === 'loading'
  const error = state.status === 'error' ? state.message : undefined

  // No weather data yet → show search screen
  if (!currentResult) {
    return <SearchScreen onSearch={handleSearch} isLoading={isLoading} error={error} />
  }

  // We have data → show weather (even while loading a new city or after error)
  return (
    <WeatherPage
      result={currentResult}
      isLoading={isLoading}
      error={error}
      onSearch={handleSearch}
    />
  )
}

export default App
