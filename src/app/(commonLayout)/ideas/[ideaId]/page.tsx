import { getSingleIdea } from "@/services/IdeaService";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}): Promise<Metadata> {
  const idea = await getSingleIdea((await params).ideaId);

  return {
    title: `ES || ${idea?.data?.title}`,
    description: idea?.data?.description,
  };
}

const page = () => {
  return (
    <div>
      <h1>This is page Component</h1>
    </div>
  );
};

export default page;
