export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Yandex",
        allow: "/",
        crawlDelay: 2,
      },
    ],
    sitemap: "https://seo.kickcheck.ru/sitemap.xml",
    host: "https://seo.kickcheck.ru",
  };
}
