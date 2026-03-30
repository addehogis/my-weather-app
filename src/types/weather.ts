export interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  iconCode: string
}

export interface ForecastDay {
  date: Date
  high: number
  low: number
  condition: string
  description: string
  iconCode: string
}

export interface WeatherResult {
  weather: WeatherData
  forecast: ForecastDay[]
}

export class CityNotFoundError extends Error {
  constructor(city: string) {
    super(`City "${city}" not found. Please check the spelling and try again.`)
    this.name = 'CityNotFoundError'
  }
}
