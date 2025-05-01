import Profile from "@/components/modules/pages/Profile";
import LoadingData from "@/components/shared/LoadingData";
import { getMe } from "@/services/UserService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eco Sphere | Profile",
  description: "Profile page",
};

const page = async () => {
  const user = await getMe();

  if (!user?.data) return <LoadingData />;

  return <Profile user={user?.data} />;
};

export default page;
