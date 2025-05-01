"use client";

import { ScaleLoader } from "react-spinners";

const ButtonLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <ScaleLoader
        height={16}
        width={2}
        radius={1}
        margin={1}
        color="var(--accent)"
      />
    </div>
  );
};

export default ButtonLoader;
