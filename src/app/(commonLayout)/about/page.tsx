import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eco Sphere | About Us",
  description: "Learn more about Eco Sphere",
};

const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Banner Section */}
      {/* <div className="relative w-full h-64 bg-gray-800">
          <div className="absolute inset-0 flex items-center justify-center text-white">
              <h1 className="text-[35px] md:text-[38px] lg:text-[50px] xl:text-[6xl] 2xl:text-[65px] text-white font-bold">
              About Us
              </h1>
          </div>
      </div> */}
      <h1 className="text-4xl font-bold text-gray-800 mt-10 text-center">
        About US
      </h1>

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Introduction */}
          <section className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Welcome to the Sustainability Idea Hub!
            </h2>
            <p className="text-lg text-gray-600">
              The Sustainability Idea Hub is a platform designed to empower
              individuals, communities, and organizations to share, explore, and
              implement innovative ideas that promote environmental
              sustainability. We believe that change starts with collaboration,
              and our mission is to create a space where sustainability-driven
              solutions can thrive.
            </p>
          </section>

          {/* Our Vision */}
          <section className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Our Vision
            </h2>
            <p className="text-lg text-gray-600">
              Our vision is to revolutionize the rental experience by providing
              a seamless platform that connects renters with the best available
              properties. We strive to simplify the process, offer unparalleled
              customer support, and ensure that every individual finds their
              dream home.
            </p>
          </section>

          {/* Our Mission */}
          <section className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              What we offer
            </h2>
            <p className="text-lg text-gray-600">
              <span className="text-xl font-bold">Idea Sharing:</span> Submit
              and discover projects focused on renewable energy, waste
              reduction, sustainable agriculture, eco-friendly design, and more.
            </p>
            <p className="text-lg text-gray-600">
              <span className="text-xl font-bold">Collaboration Tools:</span>{" "}
              Connect with like-minded people, experts, and local communities to
              bring your ideas to life.
            </p>
            <p className="text-lg text-gray-600">
              <span className="text-xl font-bold">Learning Resources:</span>{" "}
              Explore articles, toolkits, and guides that help you turn ideas
              into impact.
            </p>
            <p className="text-lg text-gray-600">
              <span className="text-xl font-bold">Impact Tracking:</span> See
              how ideas evolve and the positive environmental change they
              create.
            </p>
          </section>

          {/* Who is it for */}
          <section className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Who is it for
            </h2>
            <ul className="text-lg text-gray-600 list-disc list-inside">
              <li>
                Students & Researchers with sustainable concepts to explore
              </li>
              <li>
                Startups & Entrepreneurs looking for validation and
                collaboration
              </li>
              <li>
                Local Communities & NGOs wanting to solve real-world
                environmental challenges
              </li>
              <li>
                Individuals who care about the planet and want to contribute
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
