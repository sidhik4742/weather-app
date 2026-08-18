"use client";

import Map from "@/components/map/map";
import ThemeToggle from "@/components/toggle/toggle";
import WeatherMeta from "@/components/WeatherMeta/weatherMeta";
import { useEffect, useState } from "react";
import { searchWeather } from "@/actions/actions";
import { getGeoLocation, getDailyForecast } from "@/utils/utils";
import { WeatherFor5days } from "@/interfaces/weather.interface";


export default function Home() {
  const [weatherFor5days, setWeatherFor5days] = useState<WeatherFor5days | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const getWeatherByCoordinates = async (location: { lat: number; lng: number }) => {
    const weather = await searchWeather(location.lat, location.lng);
    const weatherPayload: WeatherFor5days | null = getDailyForecast(weather);
    setWeatherFor5days(weatherPayload);
    console.log(weatherPayload);
  };

  const handleLocationSelect = async (location: { lat: number; lng: number }) => {
    await getWeatherByCoordinates(location);
  };

  useEffect(() => {
    async function getCurrentLocation() {
      const { latitude, longitude } = await getGeoLocation();
      setCoords({ lat: latitude, lng: longitude });
      console.log("data", latitude, longitude)
      await getWeatherByCoordinates({ lat: latitude, lng: longitude });
    }

    getCurrentLocation();
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", }}>
      {/* Fullscreen Map */}
      <Map onLocationSelect={handleLocationSelect} coords={coords} />

      {/* Floating Theme Toggle */}
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 1001 }}>
        <ThemeToggle />
      </div>

      <div style={{
        position:
          "absolute",
        top: "50%",
        right: "0.5%",
        transform: "translate(0.5%, -50%)",
        zIndex: 1000,
        height: "98%"
      }}
        className="w-full sm:w-1/3 bg-transparent backdrop-blur-md rounded-2xl overflow-hidden"
      >
        <WeatherMeta weatherMetaData={weatherFor5days} />
      </div>
    </div>
  );
}
