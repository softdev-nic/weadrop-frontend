"use client";

import React from "react";
import Link from "next/link";
import "./utilities/animations/titleTextAnimation.css"
import { getSettings } from "./utilities/userSettings";
import Card from "./components/Card";
import ProductList from "./components/ProductList";

const defaultSettings = {
  notifications: true,
  language: "en",
  theme: "light",
};

const themeLabels = {
  light: "Light",
  dark: "Dark",
};

const homeCards = [
  {
    title: "Ready for rain",
    description: "Raincoats, umbrellas and waterproof footwear for wet days.",
    image: "/weather/rain.svg",
    link: { label: "Shop rainwear", path: "/orders/create-order" },
  },
  {
    title: "Warm in the cold",
    description: "Sweaters, jackets and thermals for chilly mornings.",
    image: "/weather/cold.svg",
    link: { label: "Shop warm layers", path: "/orders/create-order" },
  },
  {
    title: "Cool in the heat",
    description: "Caps, hats and accessories for days in the sun.",
    image: "/weather/heat.svg",
    link: { label: "Shop sun gear", path: "/orders/create-order" },
  },
  {
    title: "Built for wind",
    description: "Jackets and outer layers for blustery days.",
    image: "/weather/wind.svg",
    link: { label: "Shop windwear", path: "/orders/create-order" },
  },
  {
    title: "Set for snow",
    description: "Thermals, footwear and heavy jackets for snowy days.",
    image: "/weather/snow.svg",
    link: { label: "Shop snow gear", path: "/orders/create-order" },
  },
  {
    title: "Sell on WeaDrop",
    description: "Register your company as a vendor and list your products.",
    image: "/weather/sell.svg",
    link: { label: "Register your company", path: "/organization/register" },
  },
];

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
  );
}
