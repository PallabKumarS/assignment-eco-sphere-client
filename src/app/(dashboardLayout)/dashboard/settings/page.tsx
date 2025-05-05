import Settings from "@/components/modules/pages/Settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eco Sphere | Profile Settings",
  description: "Manage your profile settings",
};

const page = () => {
  return (
    <div>
      <Settings />
    </div>
  );
};

export default page;
