"use client";

import Container from "@/components/shared/Container";
import HeroBanner from "./HeroBanner";
import FeaturedIdeas from "./FeaturedIdeas";
import TestimonialsSection from "./Testimonial";
import { useEffect, useState } from "react";
import { TIdea } from "@/types";
import { getAllIdeas } from "@/services/IdeaService";
import ButtonLoader from "@/components/shared/ButtonLoader";

const HomePage = () => {
  const [ideas, setIdeas] = useState<TIdea[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      const res = await getAllIdeas();
      setIdeas(res?.data);
    };

    fetchIdeas();
    setIsFetching(false);
  }, []);

  console.log(ideas);

  return (
    <Container>
      <HeroBanner />
      {isFetching ? (
        <div>
          <ButtonLoader />
        </div>
      ) : (
        <FeaturedIdeas ideas={ideas} />
      )}
      <TestimonialsSection topIdeas={ideas} />
    </Container>
  );
};

export default HomePage;
