// app/catalogue/[slug]/page.tsx
// Server component. Statically generates every product page at build time.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllSlugs,
  getProduct,
  getRelated,
} from "@/lib/products";
import { ProductPageView } from "@/components/catalogue/ProductPageView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product · Tendencies" };

  return {
    title: `${product.title} · Tendencies`,
    description: product.descriptor,
    openGraph: {
      title: `${product.title} · Tendencies`,
      description: product.descriptor,
      images: product.hero.src ? [product.hero.src] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelated(product.relatedSlugs ?? []);

  return <ProductPageView product={product} related={related} />;
}
