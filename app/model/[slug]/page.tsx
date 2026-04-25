import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600;

const SITE_URL = "https://seo.kickcheck.ru";

export async function generateStaticParams() {
  // Возвращаем пустой массив — страницы будут генерироваться по запросу (ISR)
  // Это критично: при 4000+ моделях статическая прегенерация всех на билде слишком долгая.
  return [];
}

function categoryRu(category: string): string {
  if (category === "sneakers") return "Кроссовки";
  if (category === "bags") return "Сумки";
  if (category === "clothing") return "Одежда";
  return category;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from("seo_models")
    .select("meta_title_ru, meta_description_ru, brand, model_name, image_url")
    .eq("slug", slug)
    .single();

  const title =
    data?.meta_title_ru ||
    (data ? `Проверка ${data.brand} ${data.model_name} на оригинальность` : "Проверка на оригинальность — KickCheck");
  const description =
    data?.meta_description_ru ||
    (data
      ? `Как отличить оригинал ${data.brand} ${data.model_name} от подделки. Проверьте подлинность с помощью ИИ за 30 секунд.`
      : "Проверьте подлинность брендовой вещи с помощью ИИ.");

  return {
    title,
    description,
    alternates: {
      canonical: `/model/${slug}`,
    },
    openGraph: {
      type: "article",
      locale: "ru_RU",
      url: `${SITE_URL}/model/${slug}`,
      siteName: "KickCheck",
      title,
      description,
      images: data?.image_url ? [{ url: data.image_url }] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  };
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: model } = await supabase
    .from("seo_models")
    .select("*")
    .eq("slug", slug)
    .eq("enabled", true)
    .single();

  if (!model) notFound();

  const categoryLabel = categoryRu(model.category);
  const pageUrl = `${SITE_URL}/model/${slug}`;

  // JSON-LD: Product schema для расширенного сниппета
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${model.brand} ${model.model_name}`,
    brand: {
      "@type": "Brand",
      name: model.brand,
    },
    category: categoryLabel,
    description:
      model.description_ru ||
      `Проверка подлинности ${model.brand} ${model.model_name} с помощью ИИ.`,
    ...(model.image_url ? { image: model.image_url } : {}),
    url: pageUrl,
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel,
        item: `${SITE_URL}/#${model.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${model.brand} ${model.model_name}`,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "40px 20px",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        }}
      >
        {/* Хлебные крошки */}
        <nav aria-label="Хлебные крошки" style={{ marginBottom: 24, fontSize: 14, color: "#666" }}>
          <Link href="/" style={{ color: "#0066ff", textDecoration: "none" }}>Главная</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span>{categoryLabel}</span>
          <span style={{ margin: "0 8px" }}>/</span>
          <span>{model.brand} {model.model_name}</span>
        </nav>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
          Проверка {model.brand} {model.model_name} на оригинальность
        </h1>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Категория: {categoryLabel}
        </p>

        {model.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={model.image_url}
            alt={`${model.brand} ${model.model_name}`}
            style={{ maxWidth: "100%", height: "auto", borderRadius: 8, marginBottom: 24 }}
          />
        )}

        {model.description_ru && (
          <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 32, whiteSpace: "pre-wrap" }}>
            {model.description_ru}
          </div>
        )}

        <a
          href="https://kickcheck.ru/check"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            background: "#0066ff",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Проверить {model.brand} {model.model_name} →
        </a>
      </main>
    </>
  );
}
