import VerifyPayment from "@/components/modules/pages/VerifyPayment";
import Container from "@/components/shared/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Payments History",
  description: "View Payments History in the Dashboard for Member",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) => {
  const paymentId = (await searchParams).order_id as string;

  return (
    <Container>
      <VerifyPayment paymentId={paymentId} />
    </Container>
  );
};

export default page;
