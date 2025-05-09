import SingleIdea from "@/components/modules/pages/SingleIdea";
import Container from "@/components/shared/Container";
import { getSingleIdea } from "@/services/IdeaService";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ideaId?: string }>;
}): Promise<Metadata> {
  const ideaId = (await params).ideaId as string;
  const res = await getSingleIdea(ideaId);

  return {
    title: `${res?.data?.title} Details` || "Idea Details",
    description:
      res?.data?.description ||
      "This is idea details Page used by member only.",
  };
}

const page = () => {
  return (
    <Container>
      <SingleIdea />
    </Container>
  );
};

export default page;
