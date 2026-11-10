"use client";

import React from "react";
import Menu from "../components/Menu";
import menuItems from "../utilities/menuItems";
import { applyTheme, getSettings, setSettings } from "../utilities/userSettings";

const initialSettings = {
  notifications: true,
  language: "en",
  theme: "light",
};

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

const themes = [
  { value: "light", label: "Light", description: "A bright, clean appearance." },
  { value: "dark", label: "Dark", description: "A softer appearance for low light." },
];

const Settings = () => {

  const [settings, setSettingsState] = React.useState(initialSettings);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    try {
      const savedSettings = { ...initialSettings, ...getSettings() };
      setSettingsState(savedSettings);
      applyTheme(savedSettings.theme);
    } catch {
      setError("Could not load your saved settings.");
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettingsState((current) => ({ ...current, [key]: value }));
    if (key === "theme") {
      applyTheme(value);
    }
    setMessage("");
  };

  const saveSettings = () => {
    try {
      setSettings(settings);
      setError("");
      setMessage("Your settings have been saved.");
    } catch {
      setMessage("");
      setError("Could not save your settings. Please try again.");
    }
  };

  const isDark = settings.theme === "dark";
  const panelClass = isDark
    ? "border-gray-700 bg-gray-900 text-white"
    : "border-gray-200 bg-white text-gray-900";
  const mutedTextClass = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <main
      className={`min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8 ${
        isDark ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        <aside className="w-full shrink-0 md:w-64">
          <Menu items={menuItems} />
        </aside>

        <section className="min-w-0 flex-1 space-y-6">
          <header className={`rounded-xl border p-6 shadow-sm ${panelClass}`}>
            <p className="text-sm font-medium text-blue-600">Preferences</p>
            <h1 className="mt-1 text-2xl font-semibold">Settings</h1>
            <p className={`mt-2 text-sm ${mutedTextClass}`}>
              Personalize notifications, language, and appearance.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className={`rounded-xl border p-6 shadow-sm ${panelClass}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold">Notifications</h2>
                  <p className={`mt-1 text-sm ${mutedTextClass}`}>
                    Receive updates about your account and activity.
                  </p>
                </div>
                <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(event) =>
                      updateSetting("notifications", event.target.checked)
                    }
                    className="peer sr-only"
                    aria-label="Enable notifications"
                  />
                  <span className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-blue-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
                </label>
              </div>
              <p className={`mt-5 text-sm font-medium ${mutedTextClass}`}>
                Notifications are {settings.notifications ? "on" : "off"}.
              </p>
            </section>

            <section className={`rounded-xl border p-6 shadow-sm ${panelClass}`}>
              <label htmlFor="language" className="text-base font-semibold">
                Language
              </label>
              <p className={`mt-1 text-sm ${mutedTextClass}`}>
                Choose the language used for your experience.
              </p>
              <select
                id="language"
                value={settings.language}
                onChange={(event) => updateSetting("language", event.target.value)}
                className={`mt-5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "border-gray-600 bg-gray-800 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                {languages.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </section>

            <section className={`rounded-xl border p-6 shadow-sm lg:col-span-2 ${panelClass}`}>
              <h2 className="text-base font-semibold">Theme</h2>
              <p className={`mt-1 text-sm ${mutedTextClass}`}>
                Select how the app looks on this device.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {themes.map((theme) => (
                  <label
                    key={theme.value}
                    className={`cursor-pointer rounded-lg border p-4 transition ${
                      settings.theme === theme.value
                        ? isDark
                          ? "border-blue-500 bg-blue-950 ring-2 ring-blue-500"
                          : "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                        : isDark
                          ? "border-gray-700 hover:border-gray-500"
                          : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="theme"
                        value={theme.value}
                        checked={settings.theme === theme.value}
                        onChange={() => updateSetting("theme", theme.value)}
                        className="accent-blue-600"
                      />
                      <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {theme.label}
                      </span>
                    </span>
                    <span className={`mt-2 block text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {theme.description}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <footer className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite">
              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-700">{message}</p>}
            </div>
            <button
              type="button"
              onClick={saveSettings}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save settings
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default Settings;
