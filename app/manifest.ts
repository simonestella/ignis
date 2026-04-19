import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ignis — Interactive Volcano Map",
    short_name: "Ignis",
    description: "Explore active volcanoes worldwide on an interactive map powered by USGS data.",
    start_url: basePath || "/",
    display: "standalone",
    background_color: "#FFF5ED",
    theme_color: "#E8650A",
    icons: [
      { src: `${basePath}/icon.png`, sizes: "32x32", type: "image/png" },
      { src: `${basePath}/apple-icon.png`, sizes: "180x180", type: "image/png", purpose: "any" },
      { src: `${basePath}/apple-icon.png`, sizes: "180x180", type: "image/png", purpose: "maskable" },
    ],
  };
}
