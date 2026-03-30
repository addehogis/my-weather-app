import type { WeatherData, HourlySlot, ForecastDay, WeatherResult } from '@/types/weather'
import { CityNotFoundError } from '@/types/weather'

const BASE = 'https://api.openweathermap.org'

function key(): string {
  return import.meta.env.VITE_WEATHER_API_KEY
}

// ── OWM response shapes ────────────────────────────────────────────────────────

interface OWMGeoItem {
  name: string
  lat: number
  lon: number
  country: string
}

interface OWMWeatherResponse {
  name: string
  sys: { country: string }
  main: { temp: number; feels_like: number; humidity: number }
  weather: Array<{ main: string; description: string; icon: string }>
  wind: { speed: number }
}

interface OWMForecastItem {
  dt: number
  dt_txt: string
  main: { temp: number; temp_min: number; temp_max: number }
  weather: Array<{ main: string; description: string; icon: string }>
}

interface OWMForecastResponse {
  list: OWMForecastItem[]
}

// ── Geocoding ──────────────────────────────────────────────────────────────────

async function geocode(city: string): Promise<OWMGeoItem> {
  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${key()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`)
  const data: OWMGeoItem[] = await res.json()
  if (data.length === 0) throw new CityNotFoundError(city)
  return data[0]
}

// ── Current weather ────────────────────────────────────────────────────────────

async function fetchCurrent(lat: number, lon: number): Promise<Omit<WeatherData, 'high' | 'low'>> {
  const url = `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`)
  const d: OWMWeatherResponse = await res.json()
  return {
    city: d.name,
    country: d.sys.country,
    temperature: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    condition: d.weather[0].main,
    description: d.weather[0].description,
    humidity: d.main.humidity,
    windSpeed: Math.round(d.wind.speed * 3.6), // m/s → km/h
    iconCode: d.weather[0].icon,
  }
}

// ── 3-hour forecast → daily aggregates + hourly slots ─────────────────────────

interface ForecastResult {
  hourly: HourlySlot[]
  forecast: ForecastDay[]
  todayHigh: number
  todayLow: number
}

async function fetchForecast(lat: number, lon: number): Promise<ForecastResult> {
  const url = `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Forecast request failed (${res.status})`)
  const d: OWMForecastResponse = await res.json()

  // Next 8 slots (~24 h) as hourly strip
  const hourly: HourlySlot[] = d.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000),
    temperature: Math.round(item.main.temp),
    iconCode: item.weather[0].icon,
  }))

  // Group slots by calendar date for daily forecast
  const groups = new Map<string, OWMForecastItem[]>()
  for (const item of d.list) {
    const dateKey = item.dt_txt.split(' ')[0]
    if (!groups.has(dateKey)) groups.set(dateKey, [])
    groups.get(dateKey)!.push(item)
  }

  // Today's high/low from today's forecast slots
  const todayKey = new Date().toISOString().split('T')[0]
  const todayItems = groups.get(todayKey) ?? []
  const todayHigh = todayItems.length
    ? Math.round(Math.max(...todayItems.map((i) => i.main.temp_max)))
    : Math.round(d.list[0]?.main.temp_max ?? 0)
  const todayLow = todayItems.length
    ? Math.round(Math.min(...todayItems.map((i) => i.main.temp_min)))
    : Math.round(d.list[0]?.main.temp_min ?? 0)

  // Build daily forecast (up to 5 days)
  const forecast: ForecastDay[] = []
  for (const [dateKey, items] of groups) {
    const rep =
      items.find((i) => i.dt_txt.includes('12:00:00')) ??
      items.find((i) => i.weather[0].icon.endsWith('d')) ??
      items[0]

    forecast.push({
      date: new Date(`${dateKey}T12:00:00`),
      high: Math.round(Math.max(...items.map((i) => i.main.temp_max))),
      low:  Math.round(Math.min(...items.map((i) => i.main.temp_min))),
      condition: rep.weather[0].main,
      description: rep.weather[0].description,
      iconCode: rep.weather[0].icon.replace(/n$/, 'd'),
    })

    if (forecast.length === 5) break
  }

  return { hourly, forecast, todayHigh, todayLow }
}

// ── Public entry point ─────────────────────────────────────────────────────────

export async function searchWeather(city: string): Promise<WeatherResult> {
  const geo = await geocode(city)
  const [current, { hourly, forecast, todayHigh, todayLow }] = await Promise.all([
    fetchCurrent(geo.lat, geo.lon),
    fetchForecast(geo.lat, geo.lon),
  ])
  return {
    weather: { ...current, high: todayHigh, low: todayLow },
    hourly,
    forecast,
  }
}
