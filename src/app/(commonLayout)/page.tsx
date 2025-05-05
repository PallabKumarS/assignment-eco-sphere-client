import HomePage from "@/components/modules/home/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Eco Sphere",
  description: "Home page of Eco Sphere",
};

const page = async () => {
  return <HomePage />;
};

export default page;
