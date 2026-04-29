type GalleryImage = {
  src: string;
  alt: string;
  label?: string;
};

type ProductGalleryProps = {
  images?: GalleryImage[];
};

export default function ProductGallery({ images = [] }: ProductGalleryProps) {
  if (!images.length) return null;

  const padded = [...images].slice(0, 6);

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1.15fr 0.8fr 0.8fr",
        gridTemplateRows: "360px 360px",
        gap: "6px",
        marginTop: "72px",
      }}
    >
      {padded.map((image, index) => {
        const isHero = index === 0;
        const isScale = index === 3;

        return (
          <figure
            key={`${image.src}-${index}`}
            style={{
              position: "relative",
              margin: 0,
              overflow: "hidden",
              background: "#111",
              gridColumn: isHero || isScale ? "1 / 2" : "auto",
              gridRow: isHero ? "1 / 2" : isScale ? "2 / 3" : "auto",
              minHeight: 0,
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {image.label && (
              <figcaption
                style={{
                  position: "absolute",
                  left: 16,
                  bottom: 14,
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  textShadow: "0 1px 10px rgba(0,0,0,0.45)",
                }}
              >
                {image.label}
              </figcaption>
            )}
          </figure>
        );
      })}
    </section>
  );
}
