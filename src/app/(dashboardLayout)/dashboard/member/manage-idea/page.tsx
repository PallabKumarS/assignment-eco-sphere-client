"use client";

import CreateIdeaModal from "@/components/modules/idea/CreateIdeaModal";
import LoadingData from "@/components/shared/LoadingData";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import { getAllCategories } from "@/services/CategoryService";
import {
  deleteIdea,
  getPersonalIdeas,
  updateIdea,
} from "@/services/IdeaService";
import { IIdea, TIdeaStatus, TMeta } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import EditIdeaModal from "@/components/modules/idea/EditIdeaModal";

type Category = {
  id: string;
  name: string;
};

const IdeaPage = () => {
  const [ideas, setIdeas] = useState<IIdea[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isFetching, setIsFetching] = useState(true);
  const [meta, setMeta] = useState<TMeta>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<IIdea | null>(null);

  useEffect(() => {
    const fetchIdea = async () => {
      const res = await getPersonalIdeas();
      const catRes = await getAllCategories();

      setIdeas(res?.data);
      setMeta(res?.meta);
      setCategories(catRes?.data);
    };

    fetchIdea();
    setIsFetching(false);
  }, []);

  const getCategoryNamesFromIdea = (ids: Category[]) => {
    return ids?.map((cat) => cat.name).join(", ");
  };

  const handleEdit = (id: string) => {
    const ideaToEdit = ideas.find((idea) => idea.id === id);
    if (ideaToEdit) {
      setEditingIdea(ideaToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdate = async (id: string, updatedData: any) => {
    try {
      const res = await updateIdea(id, updatedData);

      setIdeas((prev) =>
        prev.map((idea) => (idea.id === id ? res.data : idea))
      );
      setEditingIdea(null);
      setIsEditModalOpen(false);

      toast.success("Idea updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this idea?"
    );
    if (!confirmDelete) return;
    try {
      await deleteIdea(id);
      setIdeas((prev) => prev.filter((idea) => idea.id !== id)); // remove from state
      toast.success("Idea deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete idea");
      console.error("Delete Error:", error);
    }
  };

  const handleStatusChange = async (newStatus: TIdeaStatus, ideaId: string) => {
    try {
      await updateIdea(ideaId, { status: newStatus });
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) =>
          idea.id === ideaId ? { ...idea, status: newStatus } : idea
        )
      );
      toast.success("Idea status updated successfully");
      // window.location.reload();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (isFetching) return <LoadingData />;

  return (
    <div className="p-6 overflow-x-auto">
      <button
        className="px-3 py-1 mb-8 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        Create An Idea
      </button>

      <CreateIdeaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onCreate={(newIdea) => setIdeas((prev) => [newIdea, ...prev])}
      />
      <EditIdeaModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingIdea(null);
        }}
        categories={categories}
        idea={editingIdea}
        onUpdate={handleUpdate}
      />
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4">Categories</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ideas?.map((idea) => (
            <tr key={idea.id} className="border-t">
              <td className="py-2 px-4">{idea.title}</td>
              <td className="py-2 px-4 line-clamp-2">{idea.description}</td>
              <td className="py-2 px-4">
                {getCategoryNamesFromIdea(idea.categories)}
              </td>
              <td className="py-2 px-4">
                <select
                  className="border border-gray-300 rounded px-2 py-1"
                  value={idea.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as TIdeaStatus, idea.id)
                  }
                >
                  <option value={idea.status}>{idea.status}</option>
                  {idea.status !== "PENDING" && (
                    <option value="PENDING">PENDING</option>
                  )}
                </select>
              </td>
              <td className="py-2 px-4">
                <Image
                  src={idea.images[0]}
                  alt={idea.title}
                  className="w-20 h-20 object-cover rounded"
                  width={300}
                  height={300}
                />
              </td>
              <td className="py-2 px-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(idea.id)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8">
        <PaginationComponent meta={meta} />
      </div>
    </div>
  );
};

export default IdeaPage;
