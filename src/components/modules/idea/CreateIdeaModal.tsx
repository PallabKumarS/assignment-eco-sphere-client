/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

import { useForm } from "react-hook-form";
import { createIdea } from "@/services/IdeaService";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
};

type CreateIdeaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreate: (data: any) => void;
};

const CreateIdeaModal: React.FC<CreateIdeaModalProps> = ({
  isOpen,
  onClose,
  categories,
  onCreate,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [isPaid, setIsPaid] = useState(false);

  const handleCreate = async (data: any) => {
    try {
      const finalData = {
        ...data,
        isPaid,
        price: isPaid ? parseFloat(data.price) : 0,
        images: data.images.split(",").map((url: string) => url.trim()),
        categories: Array.isArray(data.categories)
          ? data.categories
          : [data.categories], // ensures array
      };
      const newIdea = await createIdea(finalData); // API call
      onCreate(newIdea.data); // pass to parent
      reset();
      onClose();
      toast.success("Idea created successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Error creating idea:", error.message);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-opacity-50" aria-hidden="true" />
      <Dialog.Panel className="relative  p-6 rounded-lg shadow-xl w-full max-w-xl">
        <button onClick={onClose} className="absolute top-2 right-2">
          <X />
        </button>
        <Dialog.Title className="text-xl font-semibold mb-4">
          Create New Idea
        </Dialog.Title>
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <input
            {...register("title", { required: true })}
            placeholder="Title"
            className="w-full p-2 border rounded"
          />
          <textarea
            {...register("problem", { required: true })}
            placeholder="Problem"
            className="w-full p-2 border rounded"
          />
          <textarea
            {...register("solution", { required: true })}
            placeholder="Solution"
            className="w-full p-2 border rounded"
          />
          <textarea
            {...register("description", { required: true })}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            {...register("images", { required: true })}
            placeholder="Image URLs (comma separated)"
            className="w-full p-2 border rounded"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={() => setIsPaid(!isPaid)}
              className="w-4 h-4"
            />
            <label className="text-sm">Is Paid</label>
          </div>
          {isPaid && (
            <input
              {...register("price", { required: true })}
              type="number"
              step="0.01"
              placeholder="Price"
              className="w-full p-2 border rounded"
            />
          )}
          <select
            {...register("categories", { required: true })}
            multiple
            className="w-full p-2 border rounded"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Idea
          </button>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CreateIdeaModal;
