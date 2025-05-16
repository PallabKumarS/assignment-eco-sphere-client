/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LucideArrowDownSquare, Pencil, Trash2 } from "lucide-react";
import { TIdea, TIdeaStatus, TMeta } from "@/types";
import { ManagementTable } from "@/components/shared/ManagementTable";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import {
  deleteIdea,
  getPersonalIdeas,
  updateIdea,
} from "@/services/IdeaService";
import { getAllCategories } from "@/services/CategoryService";
import CreateIdeaModal from "@/components/modules/idea/CreateIdeaModal";
import EditIdeaModal from "@/components/modules/idea/EditIdeaModal";
import Image from "next/image";
import { Modal } from "@/components/shared/Modal";
import IdeaForm from "./IdeaForm";

type Category = {
  id: string;
  name: string;
};

const isValidImageUrl = (url: string) => {
  const pattern = new RegExp(
    "^https?:\\/\\/.+\\.(jpg|jpeg|png|webp|gif|bmp)$",
    "i"
  );
  return pattern.test(url);
};

const IdeaManagement = ({ query }: { query: Record<string, unknown> }) => {
  const [ideas, setIdeas] = useState<TIdea[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<TIdea | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await getPersonalIdeas(query);
        const catRes = await getAllCategories();

        setIdeas(res?.data);
        setMeta(res?.meta);
        setCategories(catRes?.data);
      } catch (error) {
        console.error("Error fetching ideas:", error);
        toast.error("Failed to load ideas");
      } finally {
        setIsFetching(false);
      }
    };

    fetchIdeas();
  }, [query]);

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
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update idea");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIdea(id);
      setIdeas((prev) => prev.filter((idea) => idea.id !== id));
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
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update idea status");
    }
  };

  const getCategoryNamesFromIdea = (categories: Category[]) => {
    return categories?.map((cat) => cat.name).join(", ");
  };

  if (isFetching) return <LoadingData />;

  // column definition
  const columns: ColumnDef<TIdea>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-xs whitespace-normal break-words">
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: ({ row }) => {
        const categories = row.original.categories;
        return getCategoryNamesFromIdea(categories);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as TIdeaStatus;
        const idea = row.original;

        return (
          <div className="space-y-2">
            <h3 className="rounded px-2 py-1">{status}</h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="capitalize">
                  Change Status{" "}
                  <LucideArrowDownSquare className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                {status !== "DRAFT" && (
                  <DropdownMenuItem
                    onSelect={() =>
                      handleStatusChange("DRAFT" as TIdeaStatus, idea.id)
                    }
                  >
                    DRAFT
                  </DropdownMenuItem>
                )}
                {status !== "PENDING" && (
                  <DropdownMenuItem
                    onSelect={() =>
                      handleStatusChange("PENDING" as TIdeaStatus, idea.id)
                    }
                  >
                    PENDING
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const images = row.original.images;
        return images && images.length > 0 ? (
          <Image
            src={
              isValidImageUrl(images[0])
                ? images[0]
                : "https://res.cloudinary.com/dchqfpvjb/image/upload/v1746446661/pngtree-light-bulb-with-brain-inside-the-concept-of-the-business-idea-image_15657372_s8io0l.jpg"
            }
            alt={row.original.title}
            className="w-20 h-20 object-cover rounded"
            width={300}
            height={300}
          />
        ) : (
          <div>No image</div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const idea = row.original;
        const isEditable = idea.status === "DRAFT";

        return (
          <div className="flex items-center justify-center gap-2">
            <>
              <Modal
                title="Edit Idea"
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(idea.id)}
                    disabled={!isEditable}
                    className={
                      !isEditable ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <Pencil size={18} />
                  </Button>
                }
                content={
                  <IdeaForm idea={idea} categories={categories} edit={true} />
                }
              />
              <ConfirmationBox
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!isEditable}
                    className={
                      !isEditable ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
                onConfirm={() => handleDelete(idea.id)}
              />
            </>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-7 p-6">
      <h1 className="text-center bold text-3xl">Manage Your Ideas</h1>

      {/* <Button
        className="px-3 py-1 mb-8 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        Create An Idea
      </Button> */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Idea"
        trigger={
          <Button className="px-3 py-1 mb-8 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create An Idea
          </Button>
        }
        content={<IdeaForm categories={categories} />}
      />

      {/* <CreateIdeaModal
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
      /> */}

      <ManagementTable data={ideas} columns={columns} />

      <PaginationComponent meta={meta} />
    </div>
  );
};

export default IdeaManagement;
