import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600;

export default async function Home() {
  const { data: models } = await supabase
    .from("seo_models")
    .select("slug, brand, model_name, category")
    .eq("enabled", true);

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Проверка подлинности брендовых вещей — KickCheck
      </h1>
      <p className="text-gray-600 mb-8">
        Выберите модель для проверки оригинальности
      </p>

      {models && models.length > 0 ? (
        <ul className="space-y-3">
          {models.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/model/${m.slug}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <span className="font-semibold">{m.brand}</span> {m.model_name}
                <span className="text-sm text-gray-500 ml-2">({m.category})</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Модели пока не добавлены.</p>
      )}
    </main>
  );
}
