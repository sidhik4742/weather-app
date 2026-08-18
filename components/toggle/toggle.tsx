"use client";

import { useTheme } from "@/app/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  // Prevent layout shifts / hydration errors by showing a placeholder structure
  // until the theme preference has been loaded on the client.
  if (!mounted) {
    return (
      <div className="relative flex items-center bg-glass-panel border border-panel-border rounded-full p-1 w-44 h-9 animate-pulse">
        <div className="flex-1 h-full rounded-full bg-app-bg/50"></div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center bg-glass-panel border border-panel-border rounded-full p-1 w-44 h-9 select-none">
      {/* Sliding Active Indicator */}
      <div
        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-app-bg border border-panel-border shadow-xs transition-transform duration-300 ease-out ${
          theme === "dark" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* Light Mode Button */}
      <button
        onClick={() => setTheme("light")}
        className={`relative z-10 flex-1 h-full flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 focus:outline-hidden ${
          theme === "light"
            ? "text-text-primary"
            : "text-text-secondary hover:text-text-primary"
        }`}
        aria-label="Switch to light theme"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            theme === "light" ? "rotate-45 text-accent-sunny scale-110" : ""
          }`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <span>Light</span>
      </button>

      {/* Dark Mode Button */}
      <button
        onClick={() => setTheme("dark")}
        className={`relative z-10 flex-1 h-full flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 focus:outline-hidden ${
          theme === "dark"
            ? "text-text-primary"
            : "text-text-secondary hover:text-text-primary"
        }`}
        aria-label="Switch to dark theme"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            theme === "dark" ? "-rotate-12 text-accent-rainy scale-110" : ""
          }`}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        <span>Dark</span>
      </button>
    </div>
  );
}
