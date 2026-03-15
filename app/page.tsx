import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600;

export const metadata = {
  title: "Проверка кроссовок и сумок на оригинальность — KickCheck",
  description: "Каталог моделей для проверки подлинности. Узнайте, как отличить оригинал от подделки.",
};

async function fetchAllModels() {
  const all: any[] = [];
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
    const cat = m.category === "sneakers" ? "Кроссовки" : m.category === "bags" ? "Сумки" : m.category;
    if (!grouped[cat]) grouped[cat] = {};
    if (!grouped[cat][m.brand]) grouped[cat][m.brand] = [];
    grouped[cat][m.brand].push(m);
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        Проверка на оригинальность — KickCheck
      </h1>
      <p style={{ color: "#666", marginBottom: 40 }}>
        {models.length} моделей для проверки подлинности
      </p>

      {Object.entries(grouped).map(([category, brands]) => (
        <section key={category} style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            {category} ({Object.values(brands).reduce((sum, arr) => sum + arr.length, 0)})
          </h2>

          {Object.entries(brands).map(([brand, items]) => (
            <details key={brand} style={{ marginBottom: 12 }}>
              <summary style={{ cursor: "pointer", fontSize: 18, fontWeight: 600, padding: "8px 0" }}>
                {brand} ({items.length})
              </summary>
              <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 16px" }}>
                {items.map((m) => (
                  <li key={m.slug} style={{ marginBottom: 4 }}>
                    <Link
                      href={`/model/${m.slug}`}
                      style={{ color: "#2563eb", textDecoration: "none" }}
                    >
                      {m.model_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </section>
      ))}
    </main>
  );
}
