import { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard.jsx';

const productsUrl = 'http://localhost:3001/products';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(productsUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Не удалось загрузить товары. Проверьте, запущен ли json-server на порту 3001.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  function handleAddToCart() {
    setCartCount((currentCount) => currentCount + 1);
  }

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('ru-RU');
  const filteredProducts = products.filter((product) =>
    product.name.toLocaleLowerCase('ru-RU').includes(normalizedSearch),
  );

  return (
    <>
      <header>
        <div className="header-container">
          <a className="brand" href="/" aria-label="AgroMarket, на главную">
            <span className="brand-mark" aria-hidden="true">A</span>
            <span>AgroMarket</span>
          </a>
          <div className="cart-widget" aria-live="polite">
            <span className="cart-icon" aria-hidden="true">🛒</span>
            <span className="cart-label">Корзина:</span>
            <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </header>

      <main>
        <section className="catalog" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <div>
              <p className="eyebrow">Фермерские продукты</p>
              <h1 id="catalog-title">Каталог</h1>
            </div>
            <p className="product-count">
              {loading ? 'Загрузка...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'товар' : 'товара'}`}
            </p>
          </div>

          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Поиск товара</span>
            <input
              type="search"
              placeholder="Поиск товара..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          {loading && <p className="status-message">Загрузка товаров...</p>}
          {!loading && error && <p className="error-message">{error}</p>}
          {!loading && !error && filteredProducts.length === 0 && (
            <p className="status-message">По вашему запросу ничего не найдено.</p>
          )}
          {!loading && !error && filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
          ))}
        </section>
      </main>
    </>
  );
}

export default App;
