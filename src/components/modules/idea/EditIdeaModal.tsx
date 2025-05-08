/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {  TCategory, TIdea } from "@/types";

type Category = {
  id: string;
  name: string;
};

type EditIdeaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  idea: TIdea | null;
  onUpdate: (id: string, data: any) => Promise<void>;
};

const EditIdeaModal: React.FC<EditIdeaModalProps> = ({
  isOpen,
  onClose,
  categories,
  idea,
  onUpdate,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (idea) {
      reset({
        title: idea.title,
        problem: idea.problem,
        solution: idea.solution,
        description: idea.description,
        images: idea.images.join(", "),
        price: idea.price,
        categories: idea.categories.map((c: TCategory) => c.id),
      });
      setIsPaid(idea.isPaid);
    }
  }, [idea, reset]);

  const handleFormSubmit = async (data: any) => {
    if (!idea) return;

    const finalData = {
      ...data,
      isPaid,
      price: isPaid ? parseFloat(data.price) : 0,
      images: data.images.split(",").map((url: string) => url.trim()),
      categories: Array.isArray(data.categories)
        ? data.categories
        : [data.categories],
    };

    try {
      await onUpdate(idea.id, finalData);
      reset();
      onClose();
    } catch (err: any) {
      toast.error("Failed to update idea");
      console.error(err.message);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Panel className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <X />
        </button>
        <Dialog.Title className="text-xl font-semibold mb-4">
          Update Idea
        </Dialog.Title>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <input
            {...register("title", { required: true })}
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            {...register("problem", { required: true })}
            placeholder="Problem"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            {...register("solution", { required: true })}
            placeholder="Solution"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            {...register("description", { required: true })}
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            {...register("images", { required: true })}
            placeholder="Image URLs (comma separated)"
            className="w-full p-2 border border-gray-300 rounded"
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
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          <select
            {...register("categories", { required: true })}
            multiple
            className="w-full p-2 border border-gray-300 rounded"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update Idea
          </button>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default EditIdeaModal;
