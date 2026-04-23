// lib/products/index.ts
// Single point of access. If/when we swap static data for a CMS,
// we only change this file.

import { PRODUCTS } from "./data";
import type { Product } from "./types";

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelated(slugs: string[] = []): Product[] {
  return slugs
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));
}

export function getAllSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}

export * from "./types";
