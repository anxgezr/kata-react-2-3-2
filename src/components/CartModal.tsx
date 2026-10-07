import {
  ActionIcon,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconMinus,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import type { CartItem } from '../types/product';

interface CartModalProps {
  opened: boolean;
  onClose: () => void;
  items: CartItem[];
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  total: number;
}

export function CartModal({
  opened,
  onClose,
  items,
  onQuantityChange,
  onRemove,
  total,
}: CartModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Shopping cart"
      centered
      size="lg"
    >
      {items.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Your cart is empty
        </Text>
      ) : (
        <Stack gap="md">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <Text fw={600}>{item.name}</Text>

                <Text size="sm" c="dimmed">
                  ₹{item.price} × {item.quantity}
                </Text>

                <Group gap="xs" mt="xs">
                  <ActionIcon
                    variant="default"
                    aria-label={`Decrease ${item.name}`}
                    onClick={() =>
                      onQuantityChange(
                        item.id,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                  >
                    <IconMinus size={14} />
                  </ActionIcon>

                  <Text>{item.quantity}</Text>

                  <ActionIcon
                    variant="default"
                    aria-label={`Increase ${item.name}`}
                    onClick={() =>
                      onQuantityChange(
                        item.id,
                        item.quantity + 1,
                      )
                    }
                  >
                    <IconPlus size={14} />
                  </ActionIcon>
                </Group>
              </div>

              <div className="cart-item-right">
                <Text fw={700}>
                  ₹{item.price * item.quantity}
                </Text>

                <ActionIcon
                  color="red"
                  variant="subtle"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => onRemove(item.id)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </div>
            </div>
          ))}

          <Divider />

          <Group justify="space-between">
            <Text fw={700}>Total</Text>
            <Text fw={800} size="lg">
              ₹{total}
            </Text>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}