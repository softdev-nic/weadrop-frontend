"use client";

import React from "react";
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
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your saved notification, language, and theme preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold">Notifications</h2>
            <p className="mt-2 text-sm text-gray-600">
              {settings.notifications ? "On" : "Off"}
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold">Language</h2>
            <p className="mt-2 text-sm text-gray-600">{settings.language}</p>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold">Theme</h2>
            <p className="mt-2 text-sm text-gray-600">
              {themeLabels[settings.theme] ?? themeLabels.light}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
