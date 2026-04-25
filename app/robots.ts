import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Yandex",
        allow: "/",
        crawlDelay: 2,
      },
    ],
    sitemap: "https://seo.kickcheck.ru/sitemap.xml",
  };
}
