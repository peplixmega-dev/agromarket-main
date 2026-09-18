function ProductCard({ product, onAdd }) {
  return (
    <article className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price.toLocaleString('ru-RU')} тг</p>
      <button type="button" onClick={() => onAdd(product)}>
        В корзину
      </button>
    </article>
  );
}

export default ProductCard;
