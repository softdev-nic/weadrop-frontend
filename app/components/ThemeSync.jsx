"use client";

import React from "react";
import { applyTheme, getSettings } from "../utilities/userSettings";

const ThemeSync = () => {
  React.useEffect(() => {
    try {
      applyTheme(getSettings().theme);
    } catch (error) {
      console.error("Could not apply saved theme.", error);
    }
  }, []);

  return null;
};

export default ThemeSync;
