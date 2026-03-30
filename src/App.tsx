import { useState } from 'react'
import { Header } from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { WeatherResult } from '@/components/WeatherResult'
import type { SearchResult } from '@/types/weather'

function App() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)

  function handleSearch(city: string) {
    setSearchResult({ city, searchedAt: new Date() })
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border-2 focus:border-warm-ink focus:bg-sun-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-warm-ink focus:shadow-brutal focus:outline-none"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">
        <div className="space-y-8">
          <SearchBar onSearch={handleSearch} />
          {searchResult && <WeatherResult result={searchResult} />}
        </div>
      </main>

      <footer className="mt-16 border-t-2 border-warm-border py-6 text-center">
        <p className="text-xs text-warm-muted">
          Sunbuddy &mdash; built with React &amp; Vite
        </p>
      </footer>
    </div>
  )
}

export default App
