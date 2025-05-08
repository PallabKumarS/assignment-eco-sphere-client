"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
  images: string[];
  variant: "card" | "detail";
}

const isValidImageUrl = (url: string) => {
  const pattern = new RegExp(
    "^https?:\\/\\/.+\\.(jpg|jpeg|png|webp|gif|bmp)$",
    "i"
  );
  return pattern.test(url);
};

const ImageSlider = ({ images, variant }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fallbackImage, setFallbackImage] = useState(
    "https://res.cloudinary.com/dchqfpvjb/image/upload/v1746446661/pngtree-light-bulb-with-brain-inside-the-concept-of-the-business-idea-image_15657372_s8io0l.jpg"
  );

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-t-lg",
        variant === "card" ? "h-48" : "h-[50vh]"
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="relative h-full w-full"
        >
          <Image
            src={
              isValidImageUrl(images[currentIndex])
                ? images[currentIndex]
                : fallbackImage
            }
            alt={`Idea image ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes={
              variant === "card"
                ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                : "100vw"
            }
            priority={variant === "detail"}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
          >
            <ChevronLeft
              className={cn(variant === "card" ? "h-4 w-4" : "h-6 w-6")}
            />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
          >
            <ChevronRight
              className={cn(variant === "card" ? "h-4 w-4" : "h-6 w-6")}
            />
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(index);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  variant === "card" ? "w-4" : "w-6",
                  currentIndex === index ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
