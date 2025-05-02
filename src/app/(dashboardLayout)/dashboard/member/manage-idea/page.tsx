import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Manage Idea",
  description: "Manage your ideas here and track their progress.",
};

const page = () => {
  return (
    <div>
      <h1>This is page Component</h1>
    </div>
  );
};

export default page;
