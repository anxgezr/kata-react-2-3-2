import { useEffect } from 'react';
import { Center, Container, Loader, Text } from '@mantine/core';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { useAppDispatch, useAppSelector, } from './store/hooks';
import { addToCart, clearCart, fetchProducts, removeOneFromCart, setQuantity, } from './store/productsSlice';

function App() {
  const dispatch = useAppDispatch();

  const {
    products,
    quantities,
    cart,
    status,
    error,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <>
      <Header
        cartItems={cart}
        onRemoveItem={(id) =>
          dispatch(removeOneFromCart(id))
        }
        onClearCart={() =>
          dispatch(clearCart())
        }
      />

      <main className="main-content">
        <Container size="xl">
          <section className="hero">
            <Text component="h1" className="hero-title">
              Catalog
            </Text>

            <Text className="hero-description">
              Choose fresh products for your everyday meals
            </Text>
          </section>

          {status === 'loading' && (
            <Center py={100}>
              <div role="status" aria-label="Loading products">
                <Loader size="lg" />
              </div>
            </Center>
          )}

          {status === 'failed' && (
            <Center py={100}>
              <Text c="red">
                {error}
              </Text>
            </Center>
          )}

          {status === 'succeeded' && products.length === 0 && (
            <Center py={100}>
              <Text c="dimmed">
                Товары не найдены.
              </Text>
            </Center>
          )}

          {status === 'succeeded' && products.length > 0 && (
            <ProductList
              products={products}
              quantities={quantities}
              onQuantityChange={(productId, quantity) =>
                dispatch(
                  setQuantity({
                    productId,
                    quantity,
                  })
                )
              }
              onAddToCart={(product) =>
                dispatch(addToCart(product))
              }
            />
          )}
        </Container>
      </main>
    </>
  );
}

export default App;