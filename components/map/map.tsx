"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/app/context/ThemeContext";

const TILE_URLS = {
    light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
};

const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];

interface MapProps {
    onLocationSelect?: (coords: { lat: number; lng: number }) => void;
    coords: { lat: number; lng: number } | null;
}

export default function Map({ onLocationSelect, coords }: MapProps) {
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const tileRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    // Store the callback in a ref so the Leaflet click handler always sees the latest version
    const onLocationSelectRef = useRef(onLocationSelect);
    useEffect(() => {
        onLocationSelectRef.current = onLocationSelect;
    }, [onLocationSelect]);

    // Updating the coordinates dynamically only when the coords change 
    useEffect(() => {
        if (coords) {
            updateCoordinates(coords);
        }
    }, [coords]);

    // Updating the coordinates dynamically only when the coords change
    const updateCoordinates = (coords: { lat: number; lng: number }) => {
        // If the map is already initialized, then add some smooth scroll animation to visible the coords
        if (mapRef.current) {
            mapRef.current.setView([coords.lat, coords.lng], 10, {
                animate: true,
                duration: 5,
            });
        }
        markerRef.current?.setLatLng([coords.lat, coords.lng]);
        markerRef.current?.setPopupContent(
            `<span style="letter-spacing:0.04em">LAT ${coords.lat.toFixed(4)}, LON ${coords.lng.toFixed(4)}</span>`
        );
        markerRef.current?.openPopup();
    };

    // Initialize map once on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        let cancelled = false;
        let resizeObserver: ResizeObserver | null = null;

        const init = async () => {
            if (cancelled || !containerRef.current || mapRef.current) return;

            const L = (await import("leaflet")).default;

            if (cancelled || !containerRef.current) return;

            const map = L.map(containerRef.current, {
                center: DEFAULT_CENTER,
                zoom: 5,
                minZoom: 2,
                maxZoom: 18,
                zoomControl: true,
                attributionControl: false,
                maxBounds: [[-85, -180], [85, 180]],
                maxBoundsViscosity: 1.0,
            });

            // Tile layer — read current theme from DOM to avoid stale closure
            const isDark = document.documentElement.classList.contains("dark");
            const tile = L.tileLayer(isDark ? TILE_URLS.dark : TILE_URLS.light, {
                maxZoom: 18,
                noWrap: true,
                bounds: [[-85, -180], [85, 180]],
            }).addTo(map);

            // Pulsing pin icon
            const icon = L.divIcon({
                className: "leaflet-pulsing-pin",
                iconSize: [18, 18],
                iconAnchor: [9, 9],
            });

            // Create marker at default location
            const marker = L.marker(DEFAULT_CENTER, { icon }).addTo(map);
            marker
                .bindPopup(
                    `<span style="letter-spacing:0.04em">LAT ${DEFAULT_CENTER[0].toFixed(4)}, LON ${DEFAULT_CENTER[1].toFixed(4)}</span>`,
                    {
                        closeButton: false,
                        autoClose: false,
                        closeOnClick: false,
                        className: "leaflet-coord-popup",
                        offset: [0, -12] as [number, number],
                    }
                )
                .openPopup();

            markerRef.current = marker;

            // --- Click handler: move pin and return coordinates ---
            map.on("click", (e: any) => {
                const { lat, lng } = e.latlng;

                // Move existing marker to clicked position
                marker.setLatLng([lat, lng]);
                marker
                    .setPopupContent(
                        `<span style="letter-spacing:0.04em">LAT ${lat.toFixed(4)}, LON ${lng.toFixed(4)}</span>`
                    )
                    .openPopup();

                // Call the parent callback with coordinates
                if (onLocationSelectRef.current) {
                    onLocationSelectRef.current({ lat, lng });
                }
            });

            mapRef.current = map;
            tileRef.current = tile;

            // Force Leaflet to recalculate container size after layout settles
            requestAnimationFrame(() => {
                map.invalidateSize();
            });

            // Also watch for any future container resizes
            resizeObserver = new ResizeObserver(() => {
                map.invalidateSize();
            });
            resizeObserver.observe(containerRef.current);
        };

        // Wait for next frame so the container has its final CSS-computed dimensions
        requestAnimationFrame(() => {
            init();
        });

        return () => {
            cancelled = true;
            if (resizeObserver) resizeObserver.disconnect();
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                tileRef.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    // Switch tile layer when theme changes
    useEffect(() => {
        if (!tileRef.current) return;
        tileRef.current.setUrl(theme === "dark" ? TILE_URLS.dark : TILE_URLS.light);
    }, [theme]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "99%",
                height: "98%"
            }}
            className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        />
    );
}