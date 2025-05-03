import CategoryManagement from "@/components/modules/admin/CategoryManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Manage Categories",
  description: "Manage Categories in the Dashboard for Admin",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, unknown>>;
}) => {
  const query = await searchParams;

  return <CategoryManagement query={query} />;
};

export default page;
