"use client";

import { useEffect, useState } from "react";
import { getAllIdeas } from "@/services/IdeaService";
import { TIdea, TMeta } from "@/types";
import LoadingData from "@/components/shared/LoadingData";
import IdeaCard from "./IdeaCard";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/shared/Pagination";
import NoData from "@/components/shared/NoData";

const IdeaManagement = ({ query }: { query: Record<string, unknown> }) => {
  const [ideas, setIdeas] = useState<TIdea[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchIdeas = async () => {
      setIsFetching(true);
      try {
        const res = await getAllIdeas({
          ...query,
          limit: 12,
          status: statusFilter === "all" ? "" : statusFilter,
          searchTerm: searchTerm ? searchTerm : "",
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
  }, [query, statusFilter, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Idea Management</h1>
      </div>

      <div className="bg-base-300 rounded-lg shadow p-6 mb-6">
        {/* search bar here  */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2">
            <Input
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

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
        </div>

        {isFetching && <LoadingData />}

        {ideas.length === 0 ? (
          <NoData message="  No ideas found. Try adjusting your filters." />
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(275px,100%),1fr))] gap-6 mb-16">
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
