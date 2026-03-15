import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap() {
  const { data: models } = await supabase
    .from("seo_models")
    .select("slug")
    .eq("enabled", true);

  const baseUrl = "https://seo.kickcheck.ru";

  const modelUrls = (models || []).map((m) => ({
    url: `${baseUrl}/model/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...modelUrls,
  ];
}
