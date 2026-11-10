const defaultSettings = {
  theme: "light",
  notifications: true,
  language: "en",
};

export const getSettings = () => {
  const storedSettings = localStorage.getItem("userSettings");
  return storedSettings
    ? { ...defaultSettings, ...JSON.parse(storedSettings) }
    : defaultSettings;
};

export const applyTheme = (theme) => {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  document.documentElement.classList.toggle("dark", isDark);
};

export const setSettings = (settings) => {
  localStorage.setItem("userSettings", JSON.stringify(settings));
  applyTheme(settings.theme);
};
