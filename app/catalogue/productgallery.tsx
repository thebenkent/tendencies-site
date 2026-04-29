<style jsx>{`
  .product-gallery {
    display: grid;
    grid-template-columns: 1.15fr 0.8fr 0.8fr;
    grid-template-rows: 360px 360px;
    gap: 8px;
    margin-top: 72px;
  }

  .product-gallery__item {
    position: relative;
    margin: 0;
    overflow: hidden;
    background: #111;
    min-height: 0;
  }

  .product-gallery__item--hero {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
  }

  .product-gallery__item--scale {
    grid-column: auto;
    grid-row: auto;
  }

  .product-gallery__item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s ease;
  }

  .product-gallery__item:hover img {
    transform: scale(1.035);
  }

  @media (max-width: 900px) {
    .product-gallery {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;
      margin-top: 56px;
    }

    .product-gallery__item,
    .product-gallery__item--hero,
    .product-gallery__item--scale {
      grid-column: auto;
      grid-row: auto;
      aspect-ratio: 4 / 5;
    }
  }

  @media (max-width: 600px) {
    .product-gallery {
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 48px;
    }
  }
`}</style>