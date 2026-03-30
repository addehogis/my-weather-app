import { useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'
import type { WeatherResult, WeatherData, HourlySlot, ForecastDay } from '@/types/weather'

// ── Weather emoji map ──────────────────────────────────────────────────────────

const EMOJI: Record<string, string> = {
  '01d': '☀️', '01n': '🌙',
  '02d': '🌤️', '02n': '🌤️',
  '03d': '⛅',  '03n': '⛅',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
}

function emo(code: string) {
  return EMOJI[code] ?? '🌡️'
}

// ── Gradient map — each weather condition gets its own sky ─────────────────────

const GRADIENT: Record<string, string> = {
  '01d': 'from-sky-400 via-blue-500 to-blue-700',
  '01n': 'from-indigo-950 via-slate-900 to-slate-950',
  '02d': 'from-sky-400 via-slate-400 to-slate-600',
  '02n': 'from-slate-800 via-indigo-900 to-slate-950',
  '03d': 'from-slate-400 via-slate-500 to-slate-600',
  '03n': 'from-slate-700 via-slate-800 to-slate-900',
  '04d': 'from-slate-500 via-slate-600 to-slate-700',
  '04n': 'from-slate-700 via-gray-800 to-slate-900',
  '09d': 'from-slate-500 via-slate-600 to-slate-800',
  '09n': 'from-slate-700 via-slate-800 to-gray-950',
  '10d': 'from-slate-500 via-slate-700 to-slate-800',
  '10n': 'from-slate-700 via-slate-900 to-gray-950',
  '11d': 'from-gray-700 via-slate-800 to-gray-900',
  '11n': 'from-gray-900 via-slate-950 to-black',
  '13d': 'from-slate-400 via-slate-500 to-blue-800',
  '13n': 'from-slate-700 via-indigo-900 to-slate-900',
  '50d': 'from-gray-400 via-slate-500 to-gray-700',
  '50n': 'from-gray-700 via-slate-800 to-gray-950',
}

function gradient(code: string) {
  return GRADIENT[code] ?? 'from-sky-400 via-blue-500 to-blue-700'
}

// ── Primitive: glass card ─────────────────────────────────────────────────────

function Glass({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 3xl:rounded-3xl',
        className
      )}
    >
      {children}
    </div>
  )
}

// ── Time helpers ───────────────────────────────────────────────────────────────

function fmtHour(d: Date) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', hour12: true }).format(d)
}

function fmtDay(d: Date) {
  const today = new Date().toDateString()
  return d.toDateString() === today
    ? 'Today'
    : new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(d)
}

// ── Top search bar ─────────────────────────────────────────────────────────────

interface TopBarProps {
  city: string
  isLoading: boolean
  error?: string
  onSearch: (city: string) => void
}

function TopBar({ city, isLoading, error, onSearch }: TopBarProps) {
  const [q, setQ] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const t = q.trim()
    if (t && !isLoading) onSearch(t)
  }

  return (
    <div className="sticky top-0 z-50 bg-black/10 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 mx-auto max-w-screen-3xl"
        role="search"
      >
        <label htmlFor="top-search" className="sr-only">Search for a city</label>
        <input
          id="top-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={city}
          autoComplete="off"
          spellCheck={false}
          disabled={isLoading}
          className="flex-1 min-w-0 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:bg-white/25 transition-colors disabled:opacity-60 3xl:text-xl 3xl:py-3 3xl:px-6"
        />
        <button
          type="submit"
          disabled={isLoading || !q.trim()}
          className="shrink-0 bg-white/20 hover:bg-white/30 border border-white/20 rounded-full px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 3xl:text-xl 3xl:py-3 3xl:px-8"
          aria-label="Search"
        >
          {isLoading ? '···' : 'Go'}
        </button>
      </form>
      {error && (
        <p className="px-5 pb-2 text-sm text-red-300 3xl:text-base">{error}</p>
      )}
    </div>
  )
}

// ── Hero: city + giant temp + condition ───────────────────────────────────────

function Hero({ weather }: { weather: WeatherData }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center text-white px-6 py-16 xl:py-0 xl:h-full"
      aria-label={`Current weather in ${weather.city}`}
    >
      <p className="text-lg sm:text-xl xl:text-2xl 3xl:text-4xl font-light tracking-widest opacity-80 uppercase">
        {weather.city}
        <span className="ml-2 opacity-50">{weather.country}</span>
      </p>

      <p
        className="font-thin leading-none mt-2 text-[8rem] sm:text-[10rem] xl:text-[12rem] 3xl:text-[20rem]"
        aria-label={`${weather.temperature} degrees Celsius`}
      >
        {weather.temperature}°
      </p>

      <p className="text-xl sm:text-2xl xl:text-3xl 3xl:text-5xl font-light opacity-80 capitalize mt-1">
        {weather.description}
      </p>

      <p className="text-base sm:text-lg xl:text-xl 3xl:text-3xl font-light opacity-60 mt-1">
        H:{weather.high}° &nbsp; L:{weather.low}°
      </p>
    </div>
  )
}

// ── Hourly forecast strip ──────────────────────────────────────────────────────

function HourlyStrip({ now, hourly }: { now: WeatherData; hourly: HourlySlot[] }) {
  return (
    <Glass>
      <div className="px-4 pt-4 pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 3xl:text-sm">
          Hourly Forecast
        </p>
      </div>
      <div className="flex overflow-x-auto scrollbar-none px-2 pb-4 gap-1">
        {/* Current conditions as "Now" */}
        <HourlyItem label="Now" temp={now.temperature} iconCode={now.iconCode} isNow />
        {hourly.map((slot, i) => (
          <HourlyItem
            key={i}
            label={fmtHour(slot.time)}
            temp={slot.temperature}
            iconCode={slot.iconCode}
          />
        ))}
      </div>
    </Glass>
  )
}

function HourlyItem({
  label,
  temp,
  iconCode,
  isNow = false,
}: {
  label: string
  temp: number
  iconCode: string
  isNow?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[64px] 3xl:min-w-[100px] py-2 px-1 rounded-xl hover:bg-white/10 transition-colors">
      <span className={cn('text-xs font-semibold 3xl:text-base', isNow ? 'text-white' : 'text-white/60')}>
        {label}
      </span>
      <span className="text-2xl 3xl:text-4xl" aria-hidden="true">{emo(iconCode)}</span>
      <span className="text-sm font-semibold text-white 3xl:text-xl">{temp}°</span>
    </div>
  )
}

// ── 5-day forecast ─────────────────────────────────────────────────────────────

function ForecastList({ forecast }: { forecast: ForecastDay[] }) {
  const weekMin = Math.min(...forecast.map((d) => d.low))
  const weekMax = Math.max(...forecast.map((d) => d.high))
  const range = weekMax - weekMin || 1

  return (
    <Glass>
      <div className="px-4 pt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 3xl:text-sm">
          {forecast.length}-Day Forecast
        </p>
      </div>
      <ul className="mt-2">
        {forecast.map((day, i) => (
          <ForecastRow
            key={day.date.toISOString()}
            day={day}
            isLast={i === forecast.length - 1}
            weekMin={weekMin}
            range={range}
          />
        ))}
      </ul>
    </Glass>
  )
}

function ForecastRow({
  day,
  isLast,
  weekMin,
  range,
}: {
  day: ForecastDay
  isLast: boolean
  weekMin: number
  range: number
}) {
  const barLeft  = ((day.low  - weekMin) / range) * 100
  const barWidth = ((day.high - day.low) / range) * 100

  return (
    <li
      className={cn(
        'flex items-center gap-3 px-4 py-3 3xl:py-5',
        !isLast && 'border-b border-white/10'
      )}
      aria-label={`${fmtDay(day.date)}: high ${day.high}°, low ${day.low}°, ${day.description}`}
    >
      {/* Day name */}
      <span className="text-sm font-medium text-white w-20 shrink-0 3xl:text-xl 3xl:w-32">
        {fmtDay(day.date)}
      </span>

      {/* Emoji */}
      <span className="text-xl 3xl:text-3xl shrink-0" aria-hidden="true">
        {emo(day.iconCode)}
      </span>

      {/* Low temp */}
      <span className="text-sm text-white/50 w-8 text-right shrink-0 3xl:text-xl 3xl:w-12">
        {day.low}°
      </span>

      {/* Temperature range bar */}
      <div className="flex-1 relative h-1 3xl:h-1.5 bg-white/20 rounded-full mx-1">
        <div
          className="absolute top-0 h-full rounded-full bg-gradient-to-r from-blue-300 to-amber-300"
          style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
          aria-hidden="true"
        />
      </div>

      {/* High temp */}
      <span className="text-sm font-semibold text-white w-8 shrink-0 3xl:text-xl 3xl:w-12">
        {day.high}°
      </span>
    </li>
  )
}

// ── Stat tiles ─────────────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  sub,
  className,
}: {
  label: string
  value: string
  sub?: string
  className?: string
}) {
  return (
    <Glass className={cn('p-4 3xl:p-8', className)}>
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 3xl:text-sm">
        {label}
      </p>
      <p className="text-4xl font-light text-white mt-2 3xl:text-7xl">{value}</p>
      {sub && (
        <p className="text-sm text-white/50 mt-1 3xl:text-base">{sub}</p>
      )}
    </Glass>
  )
}

// ── Main exported component ────────────────────────────────────────────────────

interface WeatherPageProps {
  result: WeatherResult
  isLoading: boolean
  error?: string
  onSearch: (city: string) => void
}

export function WeatherPage({ result, isLoading, error, onSearch }: WeatherPageProps) {
  const { weather, hourly, forecast } = result
  const bg = gradient(weather.iconCode)

  return (
    <div className={cn('min-h-screen bg-gradient-to-b text-white', bg)}>
      <TopBar
        city={weather.city}
        isLoading={isLoading}
        error={error}
        onSearch={onSearch}
      />

      {/*
        Layout:
          • Mobile / tablet  → single column, hero above, cards below (scroll)
          • xl+ (desktop)    → two columns: hero sticky left, cards scroll right
          • 3xl (TV)         → same two-column but everything scales up
      */}
      <div className="xl:flex xl:h-[calc(100vh-52px)] 3xl:h-[calc(100vh-60px)]">

        {/* ── Left / top: hero ───────────────────────────────────────────── */}
        <div className="xl:flex-1 xl:sticky xl:top-[52px] xl:h-[calc(100vh-52px)] 3xl:top-[60px] 3xl:h-[calc(100vh-60px)] xl:overflow-hidden">
          <Hero weather={weather} />
        </div>

        {/* ── Right / bottom: scrollable cards ───────────────────────────── */}
        <div
          className="
            px-4 pb-12 space-y-3
            xl:w-[45%] xl:max-w-lg xl:min-w-[360px]
            xl:overflow-y-auto xl:h-[calc(100vh-52px)] xl:py-6
            2xl:max-w-xl
            3xl:max-w-2xl 3xl:min-w-[560px] 3xl:h-[calc(100vh-60px)] 3xl:py-10 3xl:space-y-5
          "
          aria-label="Weather details"
        >
          {hourly.length > 0 && <HourlyStrip now={weather} hourly={hourly} />}

          {forecast.length > 0 && <ForecastList forecast={forecast} />}

          {/* Stat tiles */}
          <div className="grid grid-cols-2 gap-3 3xl:gap-5">
            <StatTile
              label="Humidity"
              value={`${weather.humidity}%`}
              sub={weather.humidity > 70 ? 'High' : weather.humidity < 30 ? 'Low' : 'Comfortable'}
            />
            <StatTile
              label="Wind"
              value={`${weather.windSpeed}`}
              sub="km/h"
            />
            <StatTile
              label="Feels Like"
              value={`${weather.feelsLike}°`}
              sub={
                weather.feelsLike < weather.temperature
                  ? 'Feels colder'
                  : weather.feelsLike > weather.temperature
                  ? 'Feels warmer'
                  : 'Accurate'
              }
              className="col-span-2"
            />
          </div>

          {/* Bottom breathing room */}
          <div className="h-4 3xl:h-8" />
        </div>
      </div>
    </div>
  )
}
