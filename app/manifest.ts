import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ótica Hikari",
    short_name: "Hikari",
    description: "Óculos solares e receituários no Centro de Araguaína.",
    start_url: "/",
    display: "standalone",
    background_color: "#080806",
    theme_color: "#080806",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
