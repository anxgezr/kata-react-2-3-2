import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';

import App from './App';
import { createAppStore } from './store/store';

vi.mock('./services/productsApi', () => ({
  getProducts: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: 'Apple',
      price: 2,
      image: 'apple.jpg',
      category: 'Fruits',
    },
    {
      id: 2,
      name: 'Banana',
      price: 3,
      image: 'banana.jpg',
      category: 'Fruits',
    },
  ]),
}));

function renderApp() {
  const store = createAppStore();

  return {
    store,
    ...render(
      <Provider store={store}>
        <MantineProvider>
          <App />
        </MantineProvider>
      </Provider>
    ),
  };
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the catalog title', async () => {
    renderApp();

    expect(
      screen.getByRole('heading', { name: /catalog/i })
    ).toBeInTheDocument();
  });

  it('loads and displays products', async () => {
    renderApp();

    expect(
      await screen.findByText('Apple')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Banana')
    ).toBeInTheDocument();
  });

  it('displays the loading indicator', () => {
    renderApp();

    expect(
      screen.getByRole('status')
    ).toBeInTheDocument();
  });

  it('adds a product to the cart', async () => {
  const user = userEvent.setup();

  renderApp();

  await screen.findByText('Apple');

  const addButtons = screen.getAllByRole('button', {
    name: /add to cart/i,
  });

  await user.click(addButtons[0]);

  const cartButton = screen.getByRole('button', {
    name: /^Cart\d*$/,
  });

  expect(cartButton).toHaveTextContent('1');

  await user.click(cartButton);

  expect(
    screen.getByRole('dialog', { name: /your cart/i })
  ).toBeVisible();
});

  it('stores products in Redux', async () => {
    const { store } = renderApp();

    await waitFor(() => {
      expect(store.getState().products.status).toBe('succeeded');
    });

    expect(store.getState().products.products).toHaveLength(2);
  });
});