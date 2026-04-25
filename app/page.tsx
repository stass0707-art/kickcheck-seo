import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600;

const SITE_URL = "https://seo.kickcheck.ru";

export const metadata: Metadata = {
  title: "Проверка кроссовок и сумок на оригинальность — KickCheck",
  description:
    "Каталог из 4000+ моделей для проверки подлинности. Узнайте, как отличить оригинал от подделки кроссовок Nike, Adidas, сумок Louis Vuitton, Gucci и других брендов.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "KickCheck",
    title: "Проверка кроссовок и сумок на оригинальность — KickCheck",
    description:
      "Каталог из 4000+ моделей для проверки подлинности с помощью ИИ за 30 секунд.",
  },
};

async function fetchAllModels() {
  const all: Array<{ slug: string; brand: string; model_name: string; category: string }> = [];
  let from = 0;
  const step = 1000;
  while (true) {
    const { data } = await supabase
      .from("seo_models")
      .select("slug, brand, model_name, category")
      .eq("enabled", true)
      .order("brand")
      .range(from, from + step - 1);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < step) break;
    from += step;
  }
  return all;
}

export default async function HomePage() {
  const models = await fetchAllModels();

  const grouped: Record<string, Record<string, typeof models>> = {};
  for (const m of models) {
    const cat =
      m.category === "sneakers"
        ? "Кроссовки"
        : m.category === "bags"
        ? "Сумки"
        : m.category;
    if (!grouped[cat]) grouped[cat] = {};
    if (!grouped[cat][m.brand]) grouped[cat][m.brand] = [];
    grouped[cat][m.brand].push(m);
  }

  // JSON-LD: WebSite + SearchAction для расширенного сниппета в Яндексе
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KickCheck",
    url: SITE_URL,
    inLanguage: "ru-RU",
    description:
      "Каталог моделей кроссовок и брендовых товаров для проверки подлинности с помощью ИИ.",
    publisher: {
      "@type": "Organization",
      name: "KickCheck",
      url: "https://kickcheck.ru",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
          Проверка на оригинальность — KickCheck
        </h1>
        <p style={{ color: "#666", marginBottom: 32 }}>
          {models.length} моделей для проверки подлинности
        </p>

        {Object.entries(grouped).map(([category, brands]) => (
          <section key={category} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
              {category} (
              {Object.values(brands).reduce((sum, arr) => sum + arr.length, 0)})
            </h2>
            {Object.entries(brands).map(([brand, items]) => (
              <div key={brand} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
                  {brand} ({items.length})
                </h3>
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                  {items.map((m) => (
                    <li key={m.slug}>
                      <Link href={`/model/${m.slug}`} style={{ color: "#0066ff", textDecoration: "none" }}>
                        {m.model_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}
