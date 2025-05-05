"use client";

import LoadingData from "@/components/shared/LoadingData";
import { getAllIdeas } from "@/services/IdeaService";
import { TIdea, TMeta } from "@/types";
import { useEffect, useState } from "react";

const IdeaManagement = ({ query }: { query: Record<string, unknown> }) => {
  const [ideas, setIdeas] = useState<TIdea[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      const res = await getAllIdeas(query);
      setIdeas(res?.data);
      setMeta(res?.meta);
    };

    fetchIdeas();
    setIsFetching(false);
  }, [query]);

  if (isFetching) return <LoadingData />;

  return (
    <div>
      <h1>This is IdeaManagement Component</h1>
    </div>
  );
};

export default IdeaManagement;
