"use client";

import { useEffect, useState } from "react";
import { getAllIdeas } from "@/services/IdeaService";
import { TIdea, TMeta } from "@/types";
import LoadingData from "@/components/shared/LoadingData";
import IdeaCard from "./IdeaCard";
import { Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import NoData from "@/components/shared/NoData";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

const IdeaManagement = ({ query }: { query: Record<string, unknown> }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [ideas, setIdeas] = useState<TIdea[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchIdeas = async () => {
      setIsFetching(true);
      try {
        const res = await getAllIdeas({
          ...query,
          limit: 12,
          status: statusFilter === "all" ? "" : statusFilter,
        });
        setIdeas(res?.data || []);
        setMeta(res?.meta);
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchIdeas();
  }, [query, statusFilter]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get("searchTerm");
    if (!searchTerm) return;

    router.push(`${pathname}?searchTerm=${searchTerm}`);
  };

  const handleClearFilter = async () => {
    router.push(pathname);
  };

  const clearSearch = () => {
    router.push(
      `${pathname}?status=${statusFilter === "all" ? "" : statusFilter}`
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Idea Management</h1>
      </div>

      <div className="bg-base-300 rounded-lg shadow px-2 py-6 mb-6">
        {/* search bar here  */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 flex-1 relative"
          >
            <Input
              name="searchTerm"
              placeholder="Search ideas..."
              className="flex-1"
            />
            <Button type="submit">Search</Button>
            <Button
              className="flex gap-2 absolute right-20 top-0"
              type="reset"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>

          {/* status filter here */}
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="flex gap-2"
            type="reset"
            onClick={handleClearFilter}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isFetching && <LoadingData />}

        {ideas.length === 0 ? (
          <NoData message="  No ideas found. Try adjusting your filters." />
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-6 mb-16">
              {ideas?.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>

            {meta && meta?.totalPage > 0 && <PaginationComponent meta={meta} />}
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaManagement;
