import Hero from "../components/Hero";
import ClientMarquee from "../components/ClientMarquee";
import FeaturedWork from "../components/FeaturedWork";
import AboutIntro from "../components/AboutIntro";
import SupportingWork from "../components/SupportingWork";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main style={{ background: "#080808" }}>
      <Hero />
      <ClientMarquee />
      <FeaturedWork />
      <AboutIntro />
      <SupportingWork />
      <CTA />
      <Footer />
    </main>
  );
}
