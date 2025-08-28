import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPage from '@/components/CategoryPage';
import categories from '@/category.json';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories.find(cat => cat.tagNamespace === params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found - Game Hub',
      description: 'The requested game category could not be found.',
    };
  }

  return {
    title: `${category.title} Games - Play Free Online | Game Hub`,
    description: `Play the best free ${category.title} games online. Hundreds of ${category.title} games to choose from, no downloads required!`,
    keywords: `${category.title} games, free ${category.title} games, online ${category.title} games, browser games`,
    openGraph: {
      title: `${category.title} Games - Play Free Online`,
      description: `Play the best free ${category.title} games online. Hundreds of ${category.title} games to choose from, no downloads required!`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.title} Games - Play Free Online`,
      description: `Play the best free ${category.title} games online. Hundreds of ${category.title} games to choose from, no downloads required!`,
    },
    alternates: {
      canonical: `https://game-hub.site/category/${category.tagNamespace}`,
    },
  };
}

export default async function CategoryPageRoute({ params }: Props) {
  const category = categories.find(cat => cat.tagNamespace === params.slug);
  
  if (!category) {
    notFound();
  }

  return <CategoryPage category={category} />;
}

// Generate static paths for popular categories
export async function generateStaticParams() {
  const popularCategories = [
    'action', 'puzzle', 'racing', 'sports', 'adventure', 'arcade',
    'shooter', 'strategy', 'casual', 'educational'
  ];
  
  return popularCategories.map(slug => ({ slug }));
}



