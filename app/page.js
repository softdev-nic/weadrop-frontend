"use client";

import React from "react";
import "./utilities/animations/titleTextAnimation.css"
import { getSettings } from "./utilities/userSettings";

const defaultSettings = {
  notifications: true,
  language: "en",
  theme: "light",
};

const themeLabels = {
  light: "Light",
  dark: "Dark",
};

export default function Home() {
  const [settings, setSettings] = React.useState(defaultSettings);

  React.useEffect(() => {
    try {
      setSettings({ ...defaultSettings, ...getSettings() });
    } catch (error) {
      console.error("Could not load saved settings.", error);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 text-gray-900 sm:px-6 lg:px-8">
  <div className="flex text-4xl text-red-500 scale-[1.2] w-[50%] h-20 justify-center item-center">

  <div>
    Wea
  </div>
   <div className="animate-title">
    Drops
  </div>
  </div>
    </main>
  );
}
