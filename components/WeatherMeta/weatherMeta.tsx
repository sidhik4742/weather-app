"use client";

import { useState } from "react";
import {
    Search,
    Sun,
    Cloud,
    CloudSun,
    CloudRain,
    Droplets,
    Wind,
    Gauge,
} from "lucide-react";
import { WeatherFor5days } from "@/interfaces/weather.interface";
import { getWindDirection } from "@/utils/utils";

// ---- Types -----------------------------------------------------------

type ForecastCondition = "sun" | "cloud" | "clouds" | "cloud-sun" | "rain";

export interface ForecastDay {
    day: string;
    condition: ForecastCondition;
    high: number;
    low: number;
}

export interface WeatherMetaProps {
    // city?: string;
    temperature?: number;
    condition?: string;
    coordinates?: { lat: number; lon: number };
    humidity?: number;
    windSpeed?: number;
    windDirection?: string;
    uvIndex?: number;
    pressure?: number;
    // forecast?: ForecastDay[];
    weatherMetaData: WeatherFor5days | null;
    onSearch?: (query: string) => void;
    darkMode?: boolean;
    onToggleDarkMode?: (value: boolean) => void;
}

// ---- Small building blocks --------------------------------------------

function ConditionIcon({
    condition,
    size = 24,
    className = "",
}: {
    condition: ForecastCondition;
    size?: number;
    className?: string;
}) {
    const props = { size, strokeWidth: 1.75, className };
    switch (condition) {
        case "sun":
            return <Sun {...props} className={`${className} text-accent-sunny`} />;
        case "cloud":
        case "clouds":
            return <Cloud {...props} className={`${className} text-accent-cloudy`} />;
        case "rain":
            return (
                <CloudRain {...props} className={`${className} text-accent-rainy`} />
            );
        case "cloud-sun":
        default:
            return (
                <CloudSun {...props} className={`${className} text-accent-sunny`} />
            );
    }
}

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex-1 rounded-xl border border-panel-border bg-panel-border/30 px-5 py-5">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
                {label}
                <span className="text-text-secondary">{icon}</span>
            </div>
            <div className="mt-2 text-xl font-medium text-text-primary">{value}</div>
        </div>
    );
}

// ---- Main component -----------------------------------------------------

export default function WeatherMeta({
    weatherMetaData,
    onSearch,
}: WeatherMetaProps) {
    const [query, setQuery] = useState("");

    const { city, coord: coordinates, country, forecast, id } = weatherMetaData || {}
    const currentWeather = forecast?.[0];
    const { temp: temperature, humidity, pressure, windSpeed, windDeg, seaLevel, weatherDescription: condition } = currentWeather || {};

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(query);
    };


    return (
        <div className="flex h-full w-full flex-col rounded-2xl border border-panel-border p-10 text-text-primary shadow-xl backdrop-blur-xl">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="mb-8 shrink-0">
                <div className="flex items-center gap-3 rounded-xl border border-panel-border bg-panel-border/30 px-5 py-4 mt-6">
                    <Search size={20} className="shrink-0 text-text-secondary" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search locations..."
                        className="w-full bg-transparent text-base text-text-primary placeholder:text-text-secondary focus:outline-none"
                    />
                </div>
            </form>

            {/* Header: city */}
            <div className="mb-2 flex shrink-0 items-center justify-between">
                <h2 className="text-4xl font-semibold tracking-tight text-text-primary">
                    {city}
                </h2>
            </div>

            {coordinates && (
                <p className="mb-6 shrink-0 font-mono text-sm tracking-wide text-text-secondary">
                    LAT {coordinates.lat.toFixed(4)}, LON {coordinates.lon.toFixed(4)}
                </p>
            )}

            {/* Current condition — grows to fill available space */}
            <div className="flex flex-1 items-center gap-8">
                <ConditionIcon
                    size={120}
                    condition={(currentWeather?.weather || "sun").toLowerCase() as ForecastCondition}
                />
                <div>
                    <div className="text-8xl font-semibold leading-none text-text-primary">
                        {Math.round(temperature || 0)}°C
                    </div>
                    <div className="mt-4 text-xl text-text-secondary">{condition}</div>
                </div>
            </div>

            {/* Stat grid */}
            <div className="mb-8 flex shrink-0 gap-4">
                <StatCard
                    icon={<Droplets size={16} />}
                    label="Humidity"
                    value={`${humidity}%`}
                />
                <StatCard
                    icon={<Wind size={16} />}
                    label="Wind"
                    value={`${windSpeed} km/h ${windDeg ? getWindDirection(windDeg) : ''}`}
                />
                <StatCard icon={null} label="Sea Level" value={`${seaLevel}`} />
                <StatCard
                    icon={<Gauge size={16} />}
                    label="Pressure"
                    value={`${pressure} hPa`}
                />
            </div>

            {/* 5-day forecast */}
            <div className="shrink-0">
                <h3 className="mb-4 text-lg font-medium text-text-primary">
                    5-Day Forecast
                </h3>
                <div className="grid grid-cols-5 gap-3">
                    {(forecast || []).map((d) => (
                        <div
                            key={d.dt}
                            className="flex flex-col items-center gap-2.5 rounded-xl border border-panel-border bg-panel-border/30 py-6"
                        >
                            <span className="text-sm text-text-secondary">{new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <ConditionIcon condition={d.weather.toLocaleLowerCase() as ForecastCondition} size={28} />
                            <span className="text-base font-medium text-text-primary">
                                {d.tempMax}°
                            </span>
                            <span className="text-sm text-text-secondary">{d.tempMin}°</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}