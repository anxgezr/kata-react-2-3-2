import type { Product } from '../types/product';

const API_URL = 'https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json';

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`Failed to load products: ${response.status}`);
  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error('Unexpected products API response');
  return data.filter((item): item is Product =>
    typeof item === 'object' && item !== null &&
    'id' in item && 'name' in item && 'price' in item &&
    'image' in item && 'category' in item
  );
}
