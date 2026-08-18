import { WeatherFor5days, WeatherData, Coordinates } from "@/interfaces/weather.interface";


function getDailyForecast(weatherList: any, now = new Date()): WeatherFor5days {
    const { city, list } = weatherList;
    const payload: WeatherFor5days = {
        city: city.name,
        id: city.id,
        country: city.country,
        coord: city.coord,
        forecast: []
    };
    const future = list.filter((item: any) => new Date(item.dt * 1000) >= now);
    const nowHour = now.getHours();

    const grouped = future.reduce((acc: any, item: any) => {
        const date = new Date(item.dt * 1000);
        const day = date.toDateString(); // e.g. "Tue Jul 14 2026" - reliable grouping key
        (acc[day] = acc[day] || []).push(item);
        return acc;
    }, {});

    payload["forecast"] = Object.keys(grouped).slice(0, 5).map((day, i) => {
        const weatherData = i === 0
            ? grouped[day][0]
            : grouped[day].reduce((closest: any, item: any) =>
                Math.abs(new Date(item.dt * 1000).getHours() - nowHour) <
                    Math.abs(new Date(closest.dt * 1000).getHours() - nowHour)
                    ? item
                    : closest
            );
        return {
            dt: weatherData.dt,
            dtText: weatherData.dt_txt,
            humidity: weatherData.main.humidity || 0,
            pressure: weatherData.main.pressure || 0,
            seaLevel: weatherData.main.sea_level || 0,
            grndLevel: weatherData.main.grnd_level || 0,
            temp: Math.round(weatherData.main.temp),
            tempMax: Math.round(weatherData.main.temp_max),
            tempMin: Math.round(weatherData.main.temp_min),
            weather: weatherData.weather?.[0]?.main || "",
            weatherDescription: weatherData.weather?.[0]?.description || "",
            windSpeed: weatherData.wind?.speed || 0,
            windDeg: weatherData.wind?.deg || 0,
        }
    });
    return payload;
}

function getWindDirection(deg: number): string {
    const directions = [
        'N', 'NNE', 'NE', 'ENE',
        'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW',
        'W', 'WNW', 'NW', 'NNW'
    ];

    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
}


async function getGeoLocation(): Promise<Coordinates> {
    try {
        const coords = await new Promise<Coordinates>((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true, // more accurate but slower/more battery
                    timeout: 10000,           // give up after 10s
                    maximumAge: 0,            // don't use a cached position
                }
            );
        });

        return coords;

    } catch (error: any) {
        console.warn('Browser geolocation failed, falling back to IP lookup:', error);

        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();

        return { latitude: data.latitude, longitude: data.longitude };
    }
}

export { getDailyForecast, getWindDirection, getGeoLocation }