import { ImageCarouselHero } from "@/components/ui/image-carousel-hero";

const heroImages = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1684369176170-463e84248b70?auto=format&fit=crop&q=60&w=900",
    alt: "Abstract neural connections",
    rotation: -15,
  },
  {
    id: "2",
    src: "https://plus.unsplash.com/premium_photo-1677269465314-d5d2247a0b0c?auto=format&fit=crop&q=60&w=900",
    alt: "Creative patterns",
    rotation: -8,
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1524673360092-e07b7ae58845?auto=format&fit=crop&q=60&w=900",
    alt: "Diverse perspectives",
    rotation: 5,
  },
  {
    id: "4",
    src: "https://plus.unsplash.com/premium_photo-1680610653084-6e4886519caf?auto=format&fit=crop&q=60&w=900",
    alt: "Natural calm",
    rotation: 12,
  },
  {
    id: "5",
    src: "https://plus.unsplash.com/premium_photo-1680608979589-e9349ed066d5?auto=format&fit=crop&q=60&w=900",
    alt: "Digital art",
    rotation: -12,
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1562575214-da9fcf59b907?auto=format&fit=crop&q=60&w=900",
    alt: "Organic forms",
    rotation: 8,
  },
  {
    id: "7",
    src: "https://plus.unsplash.com/premium_photo-1676637656210-390da73f4951?auto=format&fit=crop&q=60&w=900",
    alt: "Flowing colors",
    rotation: -5,
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1664448003794-2d446c53dcae?auto=format&fit=crop&q=60&w=900",
    alt: "Light and shadow",
    rotation: 10,
  },
];

const heroFeatures = [
  {
    title: "Transparent",
    description: "Every recommendation is rule based and explainable no blackbox algorithms.",
  },
  {
    title: "Deterministic",
    description: "Same input, same results. Reproducible and trustworthy every time.",
  },
  {
    title: "Private",
    description: "No data collection, no tracking. Your information stays with you.",
  },
];

export default function Home() {
  return (
    <ImageCarouselHero
      title="Find the Right Tools for Your Neurodivergent Brain"
      subtitle="Bridgy"
      description="No algorithms. No data collection. Just transparent, honest recommendations powered by rules you can see."
      ctaText="Help me choose"
      href="/flow"
      images={heroImages}
      features={heroFeatures}
    />
  );
}
