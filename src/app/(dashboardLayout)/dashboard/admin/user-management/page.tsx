import UserManagement from "@/components/modules/admin/UserManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Manage Users",
  description: "Manage Users in the Dashboard for Admin",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = await searchParams;

  return <UserManagement query={query} />;
};

export default page;
