import dayjs, { Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  description: string;
  icon: string;

  constructor (
    city: string,
    date: Dayjs,
    tempF: number,
    humidity: number,
    windSpeed: number,
    visibility: number,
    description: string,
    icon: string,
  ) { console.log(city);
    this.city = city;
    this.date = date.format('MM/DD/YYYY');
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.visibility = visibility;
    this.description = description;
    this.icon = icon;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = process.env.API_BASE_URL || '';
  private apiKey: string = process.env.OPENWEATHER_API_KEY || '';
  
  // TODO: Create fetchLocationData method
  private async fetchFromWeatherService(query: string): Promise<any> {
    const response = await fetch(query);
    return response.json();
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      latitude: locationData.coord.lat,
      longitude: locationData.coord.lon,
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildWeatherQuery(city: string): string {
    return `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const query = this.buildWeatherQuery(city);
    const locationData = await this.fetchFromWeatherService(query);
    //console.log(locationData)
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const query = this.buildForecastQuery(coordinates);
   // console.log(query);
    const response = await fetch(query);
    return await response.json();
  }

  private async fetchWeatherData(city: string): Promise<any> {
    const query = this.buildWeatherQuery(city);
   // console.log(query);
    const response = await fetch(query);
    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.name,
      dayjs.unix(response.dt),
      response.main.temp,
      response.main.humidity,
      response.wind.speed,
      response.visibility,
      response.weather[0].description,
      response.weather[0].icon
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Array<Weather> {
    const forecastArray = [currentWeather];
    for (const item of weatherData) {
      //If we shouldn't include this item, skip it 
      if (!(item.dt_txt as string).includes('12:00:00')) {
        continue;
      }

      const info = new Weather(
        item.city,
        dayjs.unix(item.dt),
        item.main.temp,
        item.main.humidity,
        item.wind.speed,
        item.visibility,
        item.weather[0].description,
        item.weather[0].icon
      );
      forecastArray.push(info);
    }
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(city);
    const currentWeather = this.parseCurrentWeather(weatherData);

    const forecastData = await this.fetchForecastData(coordinates);
    const forecastArray = this.buildForecastArray(currentWeather, forecastData.list);
    return forecastArray;
  }
}

export default new WeatherService();
