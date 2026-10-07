import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import App from './App';

const mockProducts = [
  {
    id: 1,
    name: 'Carrot - 1 Kg',
    price: 56,
    image: 'carrot.jpg',
    category: 'vegetables',
  },
  {
    id: 2,
    name: 'Tomato - 1 Kg',
    price: 16,
    image: 'tomato.jpg',
    category: 'vegetables',
  },
];

function renderApp() {
  return render(
    <MantineProvider>
      <App />
    </MantineProvider>,
  );
}

function mockSuccessfulFetch() {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => mockProducts,
  } as Response);
}

async function loadProducts() {
  expect(await screen.findByText('Carrot - 1 Kg')).toBeInTheDocument();
  expect(screen.getByText('Tomato - 1 Kg')).toBeInTheDocument();
}

function getIncreaseButton(productName: string) {
  return screen.getByRole('button', {
    name: `Increase ${productName}`,
  });
}

function getDecreaseButton(productName: string) {
  return screen.getByRole('button', {
    name: `Decrease ${productName}`,
  });
}

function getAddButtons() {
  return screen.getAllByRole('button', {
    name: /add to cart/i,
  });
}

function openCart() {
  // Badge number is included in the button's accessible name in Mantine.
  fireEvent.click(screen.getByRole('button', { name: /^Cart\d*$/i }));
}

describe('Vegetable Store', () => {
  beforeEach(() => {
    mockSuccessfulFetch();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a loader while products are loading and hides it afterwards', async () => {
    let resolveRequest!: (value: Response | PromiseLike<Response>) => void;

    vi.mocked(fetch).mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveRequest = resolve;
      }),
    );

    renderApp();

    expect(screen.getByRole('status', { name: /loading products/i })).toBeInTheDocument();

    resolveRequest({
      ok: true,
      json: async () => mockProducts,
    } as Response);

    await loadProducts();

    await waitFor(() => {
      expect(
        screen.queryByRole('status', { name: /loading products/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('loads and displays products', async () => {
    renderApp();
    await loadProducts();
  });

  it('increases product quantity', async () => {
    renderApp();
    await loadProducts();

    fireEvent.click(getIncreaseButton('Carrot - 1 Kg'));

    expect(
      screen.getByRole('textbox', {
        name: 'Quantity of Carrot - 1 Kg',
      }),
    ).toHaveValue('2');
  });

  it('decreases product quantity but never below one', async () => {
    renderApp();
    await loadProducts();

    const increaseButton = getIncreaseButton('Carrot - 1 Kg');
    const decreaseButton = getDecreaseButton('Carrot - 1 Kg');
    const quantityInput = screen.getByRole('textbox', {
      name: 'Quantity of Carrot - 1 Kg',
    });

    fireEvent.click(increaseButton);
    expect(quantityInput).toHaveValue('2');

    fireEvent.click(decreaseButton);
    expect(quantityInput).toHaveValue('1');

    fireEvent.click(decreaseButton);
    expect(quantityInput).toHaveValue('1');
  });

  it('adds a product to the cart', async () => {
    renderApp();
    await loadProducts();

    fireEvent.click(getAddButtons()[0]);
    openCart();

    expect(await screen.findByText('1 × $56.00')).toBeInTheDocument();
  });

  it('calculates the cart total using the selected quantity', async () => {
    renderApp();
    await loadProducts();

    fireEvent.click(getIncreaseButton('Carrot - 1 Kg'));
    fireEvent.click(getAddButtons()[0]);
    openCart();

    expect(await screen.findByText('$112.00')).toBeInTheDocument();
  });

  it('removes a product from the cart and shows the empty-cart illustration', async () => {
    const { container } = renderApp();
    await loadProducts();

    fireEvent.click(getAddButtons()[0]);
    openCart();

    expect(await screen.findByText('1 × $56.00')).toBeInTheDocument();

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Remove Carrot - 1 Kg',
      }),
    );

    expect(await screen.findByText('You cart is empty!')).toBeInTheDocument();
    expect(container.querySelector('.cart-empty-image')).toHaveAttribute(
      'src',
      expect.stringContaining('cart_empty.svg'),
    );
  });

  it('clears all products from the cart', async () => {
    renderApp();
    await loadProducts();

    fireEvent.click(getAddButtons()[0]);
    fireEvent.click(getAddButtons()[1]);
    openCart();

    expect(await screen.findByText('1 × $56.00')).toBeInTheDocument();
    expect(screen.getByText('1 × $16.00')).toBeInTheDocument();

    fireEvent.click(await screen.findByRole('button', { name: 'Clear cart' }));

    expect(await screen.findByText('You cart is empty!')).toBeInTheDocument();
  });

  it('shows an error when the network request fails', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    renderApp();

    expect(
      await screen.findByText(/Не удалось загрузить каталог/i),
    ).toBeInTheDocument();
  });

  it('shows an error when the API responds with an unsuccessful status', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    renderApp();

    expect(
      await screen.findByText(/Не удалось загрузить каталог/i),
    ).toBeInTheDocument();
  });
});
