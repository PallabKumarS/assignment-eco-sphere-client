"use client";
import { TIdea, TMeta } from "@/types";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { PaginationComponent } from "@/components/shared/Pagination";
import { getAllIdeas } from "@/services/IdeaService";
import IdeaCardM from "@/components/modules/member/IdeaCardM";
import { Input } from "@/components/ui/input";
import Container from "@/components/shared/Container";
import FilterComponent from "@/components/shared/Filter";

const AllIdeas = ({ query }: { query: Record<string, unknown> }) => {
  const [ideas, setIdeas] = useState<TIdea[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      setIsFetching(true);
      const res = await getAllIdeas({
        ...query,
        status: "APPROVED",
        searchTerm: searchTerm ? searchTerm : "",
      });
      setIdeas(res?.data);
      setMeta(res?.meta);
      setIsFetching(false);
    };

    fetchIdeas();
  }, [query, searchTerm]);

  return (
    <Container className="">
      <div className="w-full flex items-center gap-2 justify-center">
        <Input
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=""
        />

        <FilterComponent />
      </div>

      {isFetching && <LoadingData />}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-6 mb-16 p-6">
        {ideas?.map((idea) => (
          <IdeaCardM key={idea.id} idea={idea} />
        ))}
      </div>

      {ideas?.length === 0 && (
        <div className="text-center py-10">
          <p className="">No ideas found</p>
        </div>
      )}

      {meta?.totalPage && meta.totalPage > 0 && (
        <PaginationComponent meta={meta} />
      )}
    </Container>
  );
};

export default AllIdeas;
