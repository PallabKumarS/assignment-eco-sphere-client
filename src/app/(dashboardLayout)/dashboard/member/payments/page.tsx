import PaymentHistory from "@/components/modules/member/PaymentHistory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Payments History",
  description: "View Payments History in the Dashboard for Member",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, unknown>>;
}) => {
  const query = await searchParams;

  return <PaymentHistory query={query} />;
};

export default page;
