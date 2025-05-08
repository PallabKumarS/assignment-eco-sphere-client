"use client";

import { useEffect, useState } from "react";
import { deleteCategory, getAllCategories } from "@/services/CategoryService";
import { TCategory, TMeta } from "@/types";
import LoadingData from "@/components/shared/LoadingData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import CategoryForm from "@/components/forms/CategoryForm";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";

const CategoryManagement = ({ query }: { query: Record<string, unknown> }) => {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories(query);
      console.log(res);

      setCategories(res?.data);
      setMeta(res?.meta);
      setIsFetching(false);
    };

    fetchCategories();
  }, [query]);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting category...");

    try {
      const res = await deleteCategory(id);

      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    }
  };

  if (isFetching) return <LoadingData />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center ">
        <h1 className="text-xl font-semibold">Category Management</h1>
      </div>

      <Modal
        content={<CategoryForm edit={false} />}
        trigger={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        }
        title="Add Category"
        open={isOpen}
        onOpenChange={setIsOpen}
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(275px,100%),1fr))] gap-4 mb-7">
        {categories.map((category) => (
          <Card key={category.id} className="rounded-2xl shadow-md">
            <CardHeader className="text-lg font-medium">
              {category.name}
            </CardHeader>
            <CardContent>{/* Placeholder for future details */}</CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Modal
                content={<CategoryForm category={category} edit={true} />}
                trigger={
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                }
                title="Edit Category"
                open={isEditing}
                onOpenChange={setIsEditing}
              />

              <ConfirmationBox
                trigger={
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                }
                onConfirm={() => handleDelete(category.id)}
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      <PaginationComponent meta={meta} />
    </div>
  );
};

export default CategoryManagement;
