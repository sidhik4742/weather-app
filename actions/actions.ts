"use server";

import { cacheLife, cacheTag } from "next/cache";

const searchWeather = async (lat: number, lon: number) => {
    "use cache";
    cacheLife('days');
    cacheTag('weather');
    if (!lat || !lon) return;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`);
    const data = await response.json();
    return data;
};

export { searchWeather };