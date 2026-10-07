import { useState } from 'react';
import { ActionIcon, Badge, Button, Group, Text } from '@mantine/core';
import { IconShoppingCart, IconTrash, IconX } from '@tabler/icons-react';
import type { CartItem } from '../types/product';

interface HeaderProps {
  cartItems: CartItem[];
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

export function Header({ cartItems, onRemoveItem, onClearCart }: HeaderProps) {
  const [cartOpened, setCartOpened] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="logo" href="./" aria-label="Vegetable Shop — главная">
          <span className="logo-name">Vegetable</span>
          <span className="logo-badge">SHOP</span>
        </a>
        <div className="cart-popover-anchor">
          <Button
            aria-label={`Cart${totalItems}`}
            aria-expanded={cartOpened}
            aria-controls="cart-dropdown"
            className="cart-summary"
            leftSection={<IconShoppingCart size={18} />}
            rightSection={<Badge className="cart-badge" size="sm" circle>{totalItems}</Badge>}
            onClick={() => setCartOpened((opened) => !opened)}
          >
            <span className="cart-label">Cart</span>
          </Button>
          <div
            id="cart-dropdown"
            className="cart-dropdown"
            role="dialog"
            aria-label="Your cart"
            hidden={!cartOpened}
          >
            <Group justify="space-between" mb="md">
              <Text fw={700} size="lg">Your cart</Text>
              {cartItems.length > 0 && (
                <ActionIcon variant="subtle" color="gray" aria-label="Clear cart" onClick={onClearCart}>
                  <IconTrash size={18} />
                </ActionIcon>
              )}
            </Group>
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <img
                  className="cart-empty-image"
                  src={`${import.meta.env.BASE_URL}cart_empty.svg`}
                  alt=""
                  aria-hidden="true"
                />
                <Text c="dimmed" size="sm" mt={0}>
                  You cart is empty!
                </Text>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img className="cart-item-image" src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <Text fw={600} size="sm" lineClamp={2}>{item.name}</Text>
                        <Text size="xs" c="dimmed">{item.quantity} × ${item.price.toFixed(2)}</Text>
                      </div>
                      <ActionIcon variant="subtle" color="gray" size="sm" aria-label={`Remove ${item.name}`} onClick={() => onRemoveItem(item.id)}>
                        <IconX size={16} />
                      </ActionIcon>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <Text fw={600}>Total</Text>
                  <Text fw={700} size="lg">${totalPrice.toFixed(2)}</Text>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
