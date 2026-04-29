type StyleData = {
  id: string;
  sport: string;
  name: string;
  desc: string;
  image: string;
};

export default function StyleCard({ styleData }: { styleData: StyleData }) {
  return (
    <a className="style-card" href={`/teamwear/brief?style=${styleData.id}`}>
      <div className="style-card__image">
        <img src={styleData.image} alt={styleData.name} />
      </div>

      <div className="style-card__content">
        <div className="style-card__sport">{styleData.sport}</div>
        <div className="style-card__name">
          {styleData.name}
          <span>.</span>
        </div>
        <p className="style-card__desc">{styleData.desc}</p>
      </div>

      <style jsx>{`
    .style-card {
    display: block;
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #f5f5f0;
    text-decoration: none;
    overflow: hidden;
    transition: all 0.2s ease;
  }
    .style-card:hover {
    border-color: rgba(255, 255, 255, 0.18);
    transform: translateY(-2px);
  }

  /* IMAGE — CLEAN VERSION */

  .style-card__image {
    aspect-ratio: 4 / 5; /* 👈 controls height properly */
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow: hidden;

  }
  .style-card__image img {
    width: 100%;
    height: 100%;
    object-fit: contain; /* 👈 KEY FIX */
    transform: scale(1.05);
    display: block;

  }
    .style-card__content {
    background: #0f0f0f;
    padding: 18px 20px 22px;
  }
  .style-card__sport {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(245, 245, 240, 0.45);
    margin-bottom: 6px;

  }
  .style-card__name {
    font-size: 15px;
    font-weight: 900;
    text-transform: uppercase;
    color: #f5f5f0;

  }
  .style-card__name span {
    color: #b8f400;

  }
  .style-card__desc {
    font-size: 13px;
    line-height: 1.4;
    color: rgba(245, 245, 240, 0.6);
    margin-top: 8px;
    margin-bottom: 0;

  }
  @media (max-width: 900px) {
    .style-card__image {
      padding: 18px;
    }
  }

      `}</style>
    </a>
  );
}