import AllIdeas from "@/components/modules/pages/AllIdeas";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage | Manage Ideas",
  description: "Explore Ideas in the Eco Sphere",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = await searchParams;

  return <AllIdeas query={query} />;
};

export default page;
