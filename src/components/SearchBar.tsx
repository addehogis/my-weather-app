import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  onSearch: (city: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  return (
    <section aria-label="City search">
      <form role="search" onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="city-input"
          className="mb-2 block font-display text-sm font-semibold uppercase tracking-widest text-warm-ink"
        >
          Search for a city
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="city-input"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Stockholm, Tokyo, New York…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-required="true"
            aria-describedby="search-hint"
            className="flex-1"
          />
          <Button
            type="submit"
            size="default"
            className="w-full sm:w-auto"
            aria-label="Search weather for this city"
          >
            <Search className="mr-2 h-4 w-4" aria-hidden="true" />
            Search
          </Button>
        </div>
        <p id="search-hint" className="sr-only">
          Type a city name and press Enter or click Search to look up the weather.
        </p>
      </form>
    </section>
  )
}
