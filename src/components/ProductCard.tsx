import { ActionIcon, Button, Card, Group, NumberInput, Text } from '@mantine/core';
import { IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, quantity, onQuantityChange, onAddToCart }: ProductCardProps) {
  const decrease = () => onQuantityChange(Math.max(1, quantity - 1));
  const increase = () => onQuantityChange(quantity + 1);

  return (
    <Card className="product-card" padding="md" radius="xl" withBorder={false}>
      <div className="product-image-wrapper">
        <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
      </div>
      <Group className="product-details" justify="space-between" align="center" wrap="nowrap" gap="xs">
        <div className="product-title-wrapper">
          <Text className="product-name" fw={600} lineClamp={2}>{product.name}</Text>
        </div>
        <Group className="quantity-control" gap={4} wrap="nowrap">
          <ActionIcon variant="light" color="green" size="sm" radius="md" aria-label={`Decrease ${product.name}`} onClick={decrease}>
            <IconMinus size={14} />
          </ActionIcon>
          <NumberInput
            className="quantity-input"
            aria-label={`Quantity of ${product.name}`}
            value={quantity}
            onChange={(value) => onQuantityChange(Math.max(1, Number(value) || 1))}
            min={1}
            max={99}
            hideControls
            size="xs"
            w={34}
          />
          <ActionIcon variant="light" color="green" size="sm" radius="md" aria-label={`Increase ${product.name}`} onClick={increase}>
            <IconPlus size={14} />
          </ActionIcon>
        </Group>
      </Group>
      <Group className="product-actions" justify="space-between" align="center" mt="md" wrap="nowrap">
        <Text className="product-price" fw={700}>${product.price.toFixed(2)}</Text>
        <Button className="add-button" color="green" variant="light" leftSection={<IconShoppingCart size={16} />} onClick={onAddToCart}>
          Add to cart
        </Button>
      </Group>
    </Card>
  );
}