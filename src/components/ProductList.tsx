import { SimpleGrid } from '@mantine/core';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  quantities: Record<number, number>;
  onQuantityChange: (productId: number, quantity: number) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, quantities, onQuantityChange, onAddToCart }: ProductListProps) {
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, lg: 4 }} spacing="lg" verticalSpacing="lg">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={quantities[product.id] ?? 1}
          onQuantityChange={(quantity) => onQuantityChange(product.id, quantity)}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </SimpleGrid>
  );
}
