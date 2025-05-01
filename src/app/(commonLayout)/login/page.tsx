import LoginPage from "@/components/modules/pages/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eco Sphere | Login",
  description: "Login to your account",
};

const page = () => {
  return <LoginPage />;
};

export default page;
