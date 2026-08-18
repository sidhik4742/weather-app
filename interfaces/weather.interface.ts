export interface WeatherData {
    dtText: string;
    dt: number;
    humidity: number;
    pressure: number;
    seaLevel: number;
    grndLevel: number;
    temp: number;
    tempMax: number;
    tempMin: number;
    weather: string;
    weatherDescription: string;
    windSpeed: number;
    windDeg: number;
}

export interface WeatherFor5days {
    id: number;
    country: string;
    city: string;
    coord: {
        lat: number;
        lon: number;
    };
    forecast: Array<WeatherData>
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}