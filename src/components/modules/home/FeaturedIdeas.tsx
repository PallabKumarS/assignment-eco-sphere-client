import Link from "next/link";
import { TIdea } from "@/types";
import ImageSlider from "@/components/shared/ImageSlider";

interface IdeaCardProps {
  idea: TIdea;
}

interface IdeasSectionProps {
  ideas: TIdea[];
}

const FeaturedIdeas = ({ ideas }: IdeasSectionProps) => {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Ideas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas?.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href="/ideas"
          className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          View All Ideas
        </a>
      </div>
    </section>
  );
};

export default FeaturedIdeas;

const IdeaCard = ({ idea }: IdeaCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48 w-full">
        <ImageSlider variant="card" images={idea.images} />
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {idea.categories.map((category) => category.name).join(", ")}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">
          {idea.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{idea.description}</p>
        <Link href={`/ideas/${idea.id}`}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors">
            View Idea
          </button>
        </Link>
      </div>
    </div>
  );
};
