import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600;

const BASE_URL = "https://seo.kickcheck.ru";

async function fetchAllSlugs(): Promise<{ slug: string; created_at: string | null }[]> {
  const all: { slug: string; created_at: string | null }[] = [];
  let from = 0;
  const step = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("seo_models")
      .select("slug, created_at")
      .eq("enabled", true)
      .order("slug")
      .range(from, from + step - 1);

    if (error) {
      console.error("[sitemap] supabase error:", error);
      break;
    }
    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < step) break;
    from += step;
  }

  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const models = await fetchAllSlugs();

  const modelUrls: MetadataRoute.Sitemap = models.map((m) => ({
    url: `${BASE_URL}/model/${m.slug}`,
    lastModified: m.created_at ? new Date(m.created_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...modelUrls,
  ];
}
