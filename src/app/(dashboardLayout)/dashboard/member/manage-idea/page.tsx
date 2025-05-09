import IdeaManagement from "@/components/modules/member/IdeaManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Manage Ideas",
  description: "Manage Ideas in the Dashboard for Member",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = await searchParams;

  return <IdeaManagement query={query} />;
};

export default page;