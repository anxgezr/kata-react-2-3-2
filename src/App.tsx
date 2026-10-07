import { useEffect, useState } from 'react';
import { Center, Container, Loader, Text } from '@mantine/core';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { getProducts } from './services/productsApi';
import type { CartItem, Product } from './types/product';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setError('Не удалось загрузить каталог. Проверьте подключение к интернету и попробуйте обновить страницу.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadProducts();
    return () => { cancelled = true; };
  }, []);

  const changeQuantity = (productId: number, quantity: number) => {
    setQuantities((current) => ({ ...current, [productId]: Math.max(1, quantity) }));
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] ?? 1;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item);
      }
      return [...current, { ...product, quantity }];
    });
  };

  const removeOneFromCart = (productId: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== productId) return [item];
      if (item.quantity <= 1) return [];
      return [{ ...item, quantity: item.quantity - 1 }];
    }));
  };



  return (
    <>
      <Header
        cartItems={cart}
        onRemoveItem={removeOneFromCart}
        onClearCart={() => setCart([])}
      />
      <main className="main-content">
        <Container size="xl">
          <section className="hero">
            <Text component="h1" className="hero-title">Catalog</Text>
            <Text className="hero-description">Choose fresh products for your everyday meals</Text>
          </section>

          {loading && (
            <Center py={100}>
              <div role="status" aria-label="Loading products">
                <Loader size="lg" />
              </div>
            </Center>
          )}
          {error && !loading && <Center py={100}><Text c="red">{error}</Text></Center>}
          {!loading && !error && products.length === 0 && (
            <Center py={100}><Text c="dimmed">Товары не найдены.</Text></Center>
          )}
          {!loading && !error && products.length > 0 && (
            <ProductList
              products={products}
              quantities={quantities}
              onQuantityChange={changeQuantity}
              onAddToCart={addToCart}
            />
          )}
        </Container>
      </main>
    </>
  );
}

export default App;
