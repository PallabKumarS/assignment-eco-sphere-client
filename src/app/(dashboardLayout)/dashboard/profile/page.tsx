import Profile from "@/components/modules/pages/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eco Sphere | Profile",
  description: "Profile page",
};

const page = async () => {
  return <Profile />;
};

export default page;
