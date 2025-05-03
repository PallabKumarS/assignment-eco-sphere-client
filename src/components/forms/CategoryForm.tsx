"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TCategory } from "@/types";
import { createCategory, updateCategory } from "@/services/CategoryService";
import ButtonLoader from "../shared/ButtonLoader";

const formSchema = z.object({
  name: z.string().min(1),
});

export default function CategoryForm({
  edit = false,
  category,
}: {
  category?: TCategory;
  edit?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const toastId = toast.loading(
      edit ? "Updating category..." : "Adding category..."
    );
    try {
      const res = edit
        ? await updateCategory(category!.id, values)
        : await createCategory(values);

      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
        setIsLoading(false);
      } else {
        toast.error(res.message, {
          id: toastId,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl py-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the category name"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {isLoading ? <ButtonLoader /> : edit ? "Update" : "Add"}
        </Button>
      </form>
    </Form>
  );
}
