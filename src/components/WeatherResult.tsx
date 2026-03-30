import { MapPin, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import type { SearchResult } from '@/types/weather'

interface WeatherResultProps {
  result: SearchResult
}

export function WeatherResult({ result }: WeatherResultProps) {
  const formattedTime = new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
    dateStyle: 'medium',
  }).format(result.searchedAt)

  return (
    <section aria-label="Weather result" aria-live="polite" aria-atomic="true">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin
              className="h-6 w-6 text-ember-500"
              aria-hidden="true"
            />
            {result.city}
          </CardTitle>
          <CardDescription>
            Weather data coming soon — stay tuned!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-warm-border bg-sun-50 p-4">
            <p className="font-display text-sm font-semibold text-warm-muted">
              PLACEHOLDER
            </p>
            <p className="mt-1 text-sm text-warm-muted">
              Real weather data will appear here once the API is connected.
            </p>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-warm-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Searched at {formattedTime}
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
