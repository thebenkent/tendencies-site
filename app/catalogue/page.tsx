"use client";

// -----------------------------------------------------------------------------
// Catalogue page — curated product showcase.
// File path in repo: app/catalogue/page.tsx
//
// Image mapping — all tiles use /public/cat-*.jpg (swap later).
//   Featured (Shortlist):
//     • /cat-tee-heavy.jpg       → Heavyweight Tee
//     • /cat-keychain.jpg        → Resin Keychains
//     • /cat-bottle.jpg          → Insulated Bottle
//   Apparel:
//     • /cat-hoodie.jpg          → Premium Hoodie
//     • /cat-overshirt.jpg       → Overshirt
//     • /cat-cap.jpg             → Structured Cap
//   Giveaways:
//     • /cat-ball.jpg            → Promo Ball
//     • /cat-pin.jpg             → Enamel Pin
//     • /cat-notebook.jpg        → Hardcover Notebook
//   Teamwear & Custom:
//     • /cat-jersey.jpg          → Performance Jersey
//     • /cat-jacket.jpg          → Training Shell
//     • /cat-resin.jpg           → Moulded Resin
// -----------------------------------------------------------------------------

type Product = {
  name: string;
  type: string;
  line: string;
  image: string;
  href: string;
};

const FEATURED: Product[] = [
  {
    name: "Heavyweight Tee",
    type: "Apparel",
    line: "Built to last. Cut to fit.",
    image: "/cat-tee-heavy.jpg",
    href: "/catalogue/heavyweight-tee",
  },
  {
    name: "Resin Keychains",
    type: "Custom Product",
    line: "Small format, high impact.",
    image: "/cat-keychain.jpg",
    href: "/catalogue/resin-keychains",
  },
  {
    name: "Insulated Bottle",
    type: "Everyday Carry",
    line: "Premium steel, daily use.",
    image: "/cat-bottle.jpg",
    href: "/catalogue/insulated-bottle",
  },
];

const APPAREL: Product[] = [
  {
    name: "Premium Hoodie",
    type: "Apparel",
    line: "Weighted fleece, considered cut.",
    image: "/cat-hoodie.jpg",
    href: "/catalogue/premium-hoodie",
  },
  {
    name: "Overshirt",
    type: "Apparel",
    line: "Midweight layer, finished properly.",
    image: "/cat-overshirt.jpg",
    href: "/catalogue/overshirt",
  },
  {
    name: "Structured Cap",
    type: "Headwear",
    line: "Low profile. Clean finish.",
    image: "/cat-cap.jpg",
    href: "/catalogue/structured-cap",
  },
];

const GIVEAWAYS: Product[] = [
  {
    name: "Promo Ball",
    type: "Giveaway",
    line: "Simple, useful, memorable.",
    image: "/cat-ball.jpg",
    href: "/catalogue/promo-ball",
  },
  {
    name: "Enamel Pin",
    type: "Giveaway",
    line: "Hard enamel. Keepable.",
    image: "/cat-pin.jpg",
    href: "/catalogue/enamel-pin",
  },
  {
    name: "Hardcover Notebook",
    type: "Stationery",
    line: "Thick stock, brand-debossed.",
    image: "/cat-notebook.jpg",
    href: "/catalogue/hardcover-notebook",
  },
];

const TEAMWEAR_CUSTOM: Product[] = [
  {
    name: "Performance Jersey",
    type: "Teamwear",
    line: "Technical fabric, team-ready.",
    image: "/cat-jersey.jpg",
    href: "/catalogue/performance-jersey",
  },
  {
    name: "Training Shell",
    type: "Teamwear",
    line: "Weatherproof, sideline-proof.",
    image: "/cat-jacket.jpg",
    href: "/catalogue/training-shell",
  },
  {
    name: "Moulded Resin",
    type: "Custom Product",
    line: "Mould to hand, one-off or run.",
    image: "/cat-resin.jpg",
    href: "/catalogue/moulded-resin",
  },
];

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48px",
        padding: "0 26px",
        borderRadius: "999px",
        background: "#b8f400",
        color: "#080808",
        textDecoration: "none",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        transition: "opacity 0.2s ease",
      }}
       >
      {children}
    </a>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48px",
        padding: "0 24px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "#ffffff",
        textDecoration: "none",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: "transparent",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </a>
  );
}

function FeaturedCard({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  return (
    <a
      href={product.href}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: large ? "5 / 6" : "4 / 5",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0f0f0f",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.filter = "brightness(0.82)";
      }}
      onMouseLeave={(e) => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.filter = "brightness(0.7)";
      }}
    >
      <img
        src={product.image}
        alt={`${product.name} — branded merchandise`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.7)",
          transition: "filter 0.35s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.32) 55%, transparent 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          background: "rgba(8,8,8,0.82)",
          color: "#b8f400",
          border: "1px solid rgba(255,255,255,0.12)",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "7px 10px",
        }}
      >
        {product.type}
      </div>

      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "14px",
        }}
      >
        ↗
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: large ? "28px" : "22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: large
              ? "clamp(32px, 3vw, 44px)"
              : "clamp(24px, 2vw, 32px)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.95,
            marginBottom: "8px",
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.45,
          }}
        >
          {product.line}
        </div>
      </div>
    </a>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.href}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: "#0f0f0f",
        textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "transform 0.35s ease, border-color 0.35s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";

        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) {
          img.style.transform = "scale(1.04)";
          img.style.filter = "brightness(0.85)";
        }

        const arrow = e.currentTarget.querySelector(".arrow");
        if (arrow) (arrow as HTMLElement).style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";

        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) {
          img.style.transform = "scale(1)";
          img.style.filter = "brightness(0.7)";
        }

        const arrow = e.currentTarget.querySelector(".arrow");
        if (arrow) (arrow as HTMLElement).style.transform = "translateX(0)";
      }}
    >
      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.7)",
          transform: "scale(1)",
          transition: "all 0.45s ease",
        }}
      />

      {/* GRADIENT */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.35) 60%, transparent 100%)",
        }}
      />

      {/* TYPE TAG */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#b8f400",
          background: "rgba(8,8,8,0.8)",
          padding: "6px 10px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {product.type}
      </div>

      {/* CTA ARROW */}
      <div
        className="arrow"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "13px",
          transition: "all 0.3s ease",
        }}
      >
        →
      </div>

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "20px",
        }}
      >
        <div
          style={{
            fontSize: "clamp(20px, 1.6vw, 26px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.95,
            marginBottom: "4px",
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.5,
          }}
        >
          {product.line}
        </div>
      </div>
    </a>
  );
}

function CategoryBlock({
  index,
  title,
  items,
  viewAllHref,
  columns = 3,
}: {
  index: string;
  title: string;
  items: Product[];
  viewAllHref: string;
  columns?: number;
}) {
  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          gap: "32px",
          marginBottom: "22px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b8f400",
              marginBottom: "10px",
            }}
          >
            {index}
          </div>

          <h2
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            {title}
            <span style={{ color: "#b8f400" }}>.</span>
          </h2>
        </div>

        <a
          href={viewAllHref}
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            paddingBottom: "3px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.2)";
          }}
        >
          View all →
        </a>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "14px",
        }}
      >
        {items.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function CataloguePage() {
  return (
    <section
      style={{
        background: "#080808",
        color: "#f5f5f0",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "96px 48px 0",
        }}
      >
        {/* HERO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "start",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginBottom: "4px",
              }}
            >
              Since · 2009
            </div>

            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.56)",
              }}
            >
              Auckland · Melbourne · Shenzhen
            </div>
          </div>

          <div
            style={{
              justifySelf: "end",
              textAlign: "right",
              maxWidth: "360px",
            }}
          >
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.5,
              }}
            >
              An edited selection
              <br />
              not an endless feed
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b8f400",
              marginBottom: "12px",
            }}
          >
            Catalogue
          </div>

          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "clamp(72px, 10vw, 152px)",
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            MERCH
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            WORTH KEEPING
            <span style={{ color: "#b8f400" }}>.</span>
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "32px",
            alignItems: "center",
            paddingTop: "18px",
            paddingBottom: "48px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: "580px" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.48)",
                margin: 0,
              }}
            >
              An edited selection of apparel, giveaways, and branded product
              worth putting your name on.
              <br />
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                Curated, not dumped. Custom always available.
              </span>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <PrimaryButton href="/start-a-project">Start a Project</PrimaryButton>
            <SecondaryButton href="/work">See Our Work</SecondaryButton>
          </div>
        </div>

        {/* FEATURED — THE SHORTLIST */}
        <section
          style={{
            paddingTop: "28px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ marginBottom: "22px" }}>
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#b8f400",
                marginBottom: "10px",
              }}
            >
              Featured
            </div>

            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "clamp(40px, 5vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
                textTransform: "uppercase",
                color: "#f5f5f0",
                margin: 0,
              }}
            >
              The Shortlist
              <span style={{ color: "#b8f400" }}>.</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr",
              gap: "14px",
            }}
          >
            <FeaturedCard product={FEATURED[0]} large />
            <FeaturedCard product={FEATURED[1]} />
            <FeaturedCard product={FEATURED[2]} />
          </div>
        </section>

        {/* CATEGORY BLOCKS */}
        <div style={{ paddingTop: "40px" }}>
          <CategoryBlock
            index="01"
            title="Apparel"
            items={APPAREL}
            viewAllHref="/catalogue/apparel"
            columns={3}
          />
        </div>

        <div style={{ paddingTop: "40px" }}>
          <CategoryBlock
            index="02"
            title="Giveaways"
            items={GIVEAWAYS}
            viewAllHref="/catalogue/giveaways"
            columns={3}
          />
        </div>

        <div style={{ paddingTop: "40px", paddingBottom: "64px" }}>
          <CategoryBlock
            index="03"
            title="Teamwear & Custom"
            items={TEAMWEAR_CUSTOM}
            viewAllHref="/catalogue/custom"
            columns={3}
          />
        </div>
      </div>

      {/* CTA BAND */}
      <section
        style={{
          background: "#b8f400",
          color: "#080808",
          padding: "80px 48px",
          marginTop: "12px",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "32px",
            alignItems: "end",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "clamp(72px, 10vw, 140px)",
                fontWeight: 900,
                letterSpacing: "-0.065em",
                lineHeight: 0.84,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              LET’S
              <br />
              BUILD
              <br />
              SOMETHING.
            </h2>
          </div>

          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.55,
                color: "rgba(8,8,8,0.7)",
                maxWidth: "240px",
                margin: "0 0 18px auto",
              }}
            >
              Big enough to deliver. Small enough to care.
            </p>

            <a
              href="/start-a-project"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 26px",
                borderRadius: "999px",
                border: "1px solid rgba(8,8,8,0.6)",
                color: "#080808",
                textDecoration: "none",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#080808";
                e.currentTarget.style.color = "#b8f400";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#080808";
              }}
            >
              Start a Project
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
