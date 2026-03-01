"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCard {
  id: string;
  src: string;
  alt: string;
  rotation: number;
}

interface ImageCarouselHeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  href?: string;
  onCtaClick?: () => void;
  images: ImageCard[];
  features?: Array<{
    title: string;
    description: string;
  }>;
}

export function ImageCarouselHero({
  title,
  subtitle,
  description,
  ctaText,
  href,
  onCtaClick,
  images,
  features = [],
}: ImageCarouselHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [rotatingCards, setRotatingCards] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingCards((prev) => prev.map((v) => (v + 0.5) % 360));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRotatingCards(images.map((_, i) => i * (360 / images.length)));
  }, [images.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const ctaClassName = cn(
    "inline-flex items-center gap-2 px-8 py-3.5 rounded-full",
    "bg-accent text-white font-semibold text-lg",
    "transition-all duration-300",
    "hover:bg-accent-light hover:-translate-y-0.5 hover:scale-105",
    "active:scale-95 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base",
    "group",
  );

  return (
    <div className="relative w-full min-h-screen bg-base overflow-hidden">
      {/* Soft background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/6 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Carousel Container */}
        <div
          className="relative w-full max-w-6xl h-96 sm:h-[500px] mb-12 sm:mb-16"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
            {images.map((image, index) => {
              const angle = (rotatingCards[index] || 0) * (Math.PI / 180);
              const radius = 180;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              const perspectiveX = isHovering ? (mousePosition.x - 0.5) * 20 : 0;
              const perspectiveY = isHovering ? (mousePosition.y - 0.5) * 20 : 0;

              return (
                <div
                  key={image.id}
                  className="absolute w-32 h-40 sm:w-40 sm:h-48 transition-all duration-300"
                  style={{
                    transform: `
                      translate(${x}px, ${y}px)
                      rotateX(${perspectiveY}deg)
                      rotateY(${perspectiveX}deg)
                      rotateZ(${image.rotation}deg)
                    `,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className={cn(
                      "relative w-full h-full rounded-2xl overflow-hidden",
                      "transition-all duration-300 hover:scale-110",
                      "cursor-pointer group",
                      "border border-edge",
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-20 text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-bright mb-4 sm:mb-6 text-balance leading-tight">
            {title}
          </h1>

          <p className="text-lg sm:text-xl text-soft mb-10 text-balance leading-relaxed">
            {description}
          </p>

          {href ? (
            <Link href={href} className={ctaClassName}>
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button type="button" onClick={onCtaClick} className={ctaClassName}>
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Features Section */}
        {features.length > 0 && (
          <div className="relative z-20 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "text-center p-6 rounded-2xl",
                  "bg-card border border-edge",
                  "hover:border-accent/30 transition-all duration-300",
                  "group",
                )}
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-bright mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base" style={{ color: "#111111" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
