import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from('seo_models')
    .select('meta_title_ru, meta_description_ru')
    .eq('slug', slug)
    .eq('enabled', true)
    .single();

  if (!data) return { title: 'Модель не найдена' };

  return {
    title: data.meta_title_ru,
    description: data.meta_description_ru,
  };
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('seo_models')
    .select('slug')
    .eq('enabled', true);

  return (data || []).map((model) => ({
    slug: model.slug,
  }));
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const { data: model } = await supabase
    .from('seo_models')
    .select('*')
    .eq('slug', slug)
    .eq('enabled', true)
    .single();

  if (!model) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">
        Проверка {model.brand} {model.model_name} на оригинальность
      </h1>
      <p className="text-gray-600 mb-6">
        Категория: {model.category === 'sneakers' ? 'Кроссовки' : 'Сумки'}
      </p>
      <div className="prose prose-lg">
        <p>{model.description_ru}</p>
      </div>
      <div className="mt-8 p-6 bg-blue-50 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-3">
          Хотите проверить {model.brand} {model.model_name}?
        </h2>
        <a
          href="https://kick-check.lovable.app/check"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Проверить сейчас
        </a>
      </div>
    </main>
  );
}
