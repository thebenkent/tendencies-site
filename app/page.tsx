import Hero from "../components/Hero";
import Statement from "../components/Statement";
import ClientMarquee from "../components/ClientMarquee";
import FeaturedWork from "../components/FeaturedWork";
import CTA from "../components/CTA";

export default function Home() {
  return (
    <main style={{ background: "#080808", paddingTop: "64px" }}>
      <Hero />
      <Statement />
      <ClientMarquee />
      <FeaturedWork />
      <CTA />
    </main>
  );
}