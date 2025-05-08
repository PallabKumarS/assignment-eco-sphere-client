import { TIdea } from "@/types";

interface TestimonialsSectionProps {
  topIdeas: TIdea[];
}

const TestimonialsSection = ({ topIdeas }: TestimonialsSectionProps) => {
  return (
    <section className="py-12 bg-gray-50 rounded-lg my-8">
      <h2 className="text-3xl font-bold mb-2 text-center">Top Rated Ideas</h2>
      <p className="text-center text-gray-600 mb-8">
        Most popular ideas based on community votes
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topIdeas?.slice(0, 3).map((idea) => (
          <TestimonialCard key={idea.id} idea={idea} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;

import Image from "next/image";
import Link from "next/link";

interface TestimonialCardProps {
  idea: TIdea;
}

const isValidImageUrl = (url: string) => {
  const pattern = new RegExp(
    "^https?:\\/\\/.+\\.(jpg|jpeg|png|webp|gif|bmp)$",
    "i"
  );
  return pattern.test(url);
};

const TestimonialCard = ({ idea }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
          <Image
            src={
              isValidImageUrl(idea.images[0])
                ? idea.images[0]
                : "https://res.cloudinary.com/dchqfpvjb/image/upload/v1746446661/pngtree-light-bulb-with-brain-inside-the-concept-of-the-business-idea-image_15657372_s8io0l.jpg"
            }
            alt={idea.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{idea.title}</h3>
          <p className="text-sm text-gray-500">
            {idea.categories.map((category) => (
              <span key={category.id}>{category.name}</span>
            ))}
          </p>
        </div>
      </div>
      <p className="text-gray-600 mb-4 flex-grow">
        {idea.description?.substring(0, 150)}
        {idea.description?.length > 150 ? "..." : ""}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-green-600 font-semibold">
            {idea.votes?.length || 0} votes
          </span>
        </div>
        <Link href={`/ideas/${idea.id}`}>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};
