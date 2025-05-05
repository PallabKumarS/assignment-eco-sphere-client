import Image from "next/image";
import Container from "@/components/shared/Container";
import Link from "next/link";

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
      <Image
        src="/assets/hero-banner.webp"
        alt="Eco Sphere Hero Banner"
        fill
        className="object-cover brightness-75"
        priority
      />
      <div className="absolute inset-0 bg-black/40 flex items-center">
        <Container>
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Innovate for a Sustainable Future
            </h1>
            <p className="text-xl md:text-2xl">
              Join our community to share, discover, and vote on eco-friendly
              ideas that can change the world.
            </p>
            <Link href="/ideas">
              <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                Explore Ideas
              </button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HeroBanner;
