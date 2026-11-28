"use client";

import React from "react";
import Link from "next/link";
import { getSettings } from "./utilities/userSettings";
import Navbar from "./components/Navbar";
import Title from "./components/Title";
import Card from "./components/Card";
import ProductList from "./components/ProductList";
import { homeCards } from "./utilities/dataArrays";
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
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-12 text-gray-900 sm:px-6 lg:px-8">
        <Title tagline="Be weather ready"/>
        <section
          aria-label="Shop by weather"
          className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {homeCards.map(({ link, ...data }) => (
            <Card
              key={data.title}
              data={data}
              classes={["transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"]}
            >
              <Link
                href={link.path}
                className="inline-block rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {link.label}
              </Link>
            </Card>
          ))}
        </section>

        <ProductList />
      </main>
    </>
  );
}
