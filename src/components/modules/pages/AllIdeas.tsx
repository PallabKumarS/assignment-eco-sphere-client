"use client";
import { TIdea, TMeta } from "@/types";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import { getAllIdeas } from "@/services/IdeaService";
import IdeaCardM from "@/components/modules/member/IdeaCardM";
import { Input } from "@/components/ui/input";
import Container from "@/components/shared/Container";
import FilterComponent from "@/components/shared/Filter";
import { Button } from "@/components/ui/button";
import NoData from "@/components/shared/NoData";

const AllIdeas = ({ query }: { query: Record<string, unknown> }) => {
  const [ideas, setIdeas] = useState<TIdea[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      setIsFetching(true);
      const res = await getAllIdeas({
        ...query,
        status: "APPROVED",
        searchTerm: searchTerm,
      });
      setIdeas(res?.data);
      setMeta(res?.meta);
      setIsFetching(false);
    };

    fetchIdeas();
  }, [query, searchTerm]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get("searchTerm");
    setSearchTerm(searchTerm ? searchTerm.toString() : "");
  };

  return (
    <Container className="">
      <div className="w-full md:flex gap-2 justify-center space-y-4 md:space-y-0 items-center">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 flex-1"
        >
          <Input
            name="searchTerm"
            placeholder="Search ideas..."
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        <FilterComponent />
      </div>

      {isFetching && <LoadingData />}

      {ideas?.length === 0 ? (
        <NoData />
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-6 mb-16 p-6">
            {ideas?.map((idea) => (
              <IdeaCardM key={idea.id} idea={idea} />
            ))}
          </div>

          {meta?.totalPage && meta?.totalPage > 0 && (
            <PaginationComponent meta={meta} />
          )}
        </>
      )}
    </Container>
  );
};

export default AllIdeas;
