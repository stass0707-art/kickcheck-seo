import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase
    .from("seo_models")
    .select("slug")
    .eq("enabled", true);
  return (data || []).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase
    .from("seo_models")
    .select("meta_title_ru, meta_description_ru")
    .eq("slug", slug)
    .single();

  return {
    title: data?.meta_title_ru || "Проверка на оригинальность — KickCheck",
    description: data?.meta_description_ru || "Проверьте подлинность брендовой вещи с помощью ИИ",
  };
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: model } = await supabase
    .from("seo_models")
    .select("*")
    .eq("slug", slug)
    .eq("enabled", true)
    .single();

  if (!model) notFound();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ marginBottom: 32 }}>
        <Link href="/" style={{ color: "#2563eb", textDecoration: "none" }}>
          ← Каталог моделей
        </Link>
      </nav>

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Проверка {model.brand} {model.model_name} на оригинальность
      </h1>

      <p style={{ color: "#666", marginBottom: 24 }}>
        Категория: {model.category === "sneakers" ? "Кроссовки" : model.category === "bags" ? "Сумки" : model.category}
      </p>

      {model.description_ru && (
        <section style={{ lineHeight: 1.7, marginBottom: 32, fontSize: 16 }}>
          {model.description_ru}
        </section>
      )}

      <a
        href="https://kickcheck.ru/check"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          background: "#2563eb",
          color: "#fff",
          padding: "14px 32px",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        Проверить {model.brand} {model.model_name} →
      </a>
    </main>
  );
}
