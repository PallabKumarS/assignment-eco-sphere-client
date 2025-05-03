import { Suspense } from "react";
import LoadingData from "./LoadingData";

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

const SuspenseWrapper = ({ children }: SuspenseWrapperProps) => {
  return <Suspense fallback={<LoadingData />}>{children}</Suspense>;
};

export default SuspenseWrapper;
