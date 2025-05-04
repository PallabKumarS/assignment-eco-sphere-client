import Homepage from "@/components/modules/pages/Homepage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage | Manage Ideas",
  description: "Manage Ideas in the Idea Hub",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = await searchParams;

  return <Homepage query={query} />;
};

export default page;