import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata = {
  title: "Проверка кроссовок и сумок на оригинальность — KickCheck",
  description: "Каталог моделей для проверки на подлинность. Узнайте, как отличить оригинал от подделки.",
};

export const revalidate = 3600;

export default async function HomePage() {
  const { data: models } = await supabase
    .from("seo_models")
    .select("slug, brand, model_name, category, meta_description_ru")
    .eq("enabled", true)
    .order("brand");

  const brands = [...new Set(models?.map((m) => m.brand) || [])];

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        Проверка на оригинальность — KickCheck
      </h1>
      <p style={{ color: "#666", marginBottom: 40 }}>
        Выберите модель, чтобы узнать, как отличить оригинал от подделки.
      </p>

      {brands.map((brand) => (
        <section key={brand} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>{brand}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {models
              ?.filter((m) => m.brand === brand)
              .map((m) => (
                <Link
                  key={m.slug}
                  href={`/model/${m.slug}`}
                  style={{
                    display: "block",
                    padding: 20,
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    textDecoration: "none",
                    color: "inherit",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{m.model_name}</h3>
                  <p style={{ fontSize: 13, color: "#888" }}>{m.category === "sneakers" ? "Кроссовки" : "Сумки"}</p>
                </Link>
              ))}
          </div>
        </section>
      ))}

      <p style={{ marginTop: 40, textAlign: "center" }}>
        <a href="https://kickcheck.ru" style={{ color: "#2563eb", fontWeight: 600 }}>
          Проверить свою вещь на KickCheck →
        </a>
      </p>
    </main>
  );
}
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
