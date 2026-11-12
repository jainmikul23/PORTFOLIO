import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mikul Jain — Product-Minded Full Stack Developer",
    short_name: "Mikul Jain",
    description:
      "Personal portfolio and technical systems case studies of Mikul Jain - Full Stack Developer.",
    start_url: "/",
    display: "standalone",
    background_color: "#090A0E",
    theme_color: "#FF633D",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

