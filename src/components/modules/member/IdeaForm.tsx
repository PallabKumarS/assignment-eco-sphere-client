/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TCategory, TIdea } from "@/types";
import { createIdea, updateIdea } from "@/services/IdeaService";
import { MinusCircle, Plus } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1),
  problem: z.string(),
  solution: z.string(),
  description: z.string(),
  isPaid: z.boolean().optional(),
  price: z.number().optional(),
  images: z.array(z.object({ value: z.string().min(1) })),
  categories: z.array(
    z.object({
      value: z.string(),
      name: z.string(),
    })
  ),
});

export default function IdeaForm({
  idea,
  edit = false,
  categories,
}: {
  idea?: TIdea;
  edit?: boolean;
  categories: TCategory[];
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: idea?.title || "",
      problem: idea?.problem || "",
      solution: idea?.solution || "",
      description: idea?.description || "",
      isPaid: idea?.isPaid || false,
      price: idea?.price || 0,
      images: idea?.images?.map((image) => ({ value: image })) || [
        { value: "" },
      ],
      categories: idea?.categories?.map((cat) => {
        return {
          value: cat?.id as string,
          name: cat?.name as string,
        };
      }) || [{ name: "", value: "" }],
    },
  });

  const { watch } = form;
  const isPaid = watch("isPaid");

  const {
    append: appendImage,
    fields: imageFields,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const addImage = () => {
    appendImage({ value: "" });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const toastId = toast.loading("Submitting...");

    const images = values.images.map((image) => image.value);
    const categories = values.categories
      .filter((cat) => cat.value !== "")
      .map((cat) => cat.value);
    const valuesToSubmit = {
      ...values,
      images,
      categories,
      isPaid,
      price: isPaid ? values.price : 0,
    };

    try {
      const res = edit
        ? await updateIdea(idea!.id, valuesToSubmit)
        : await createIdea(valuesToSubmit);

      if (res.success) {
        toast.success(res.message, { id: toastId });
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-10">
        {/* title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter title of the idea..."
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* problem field */}
        <FormField
          control={form.control}
          name="problem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the problem..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* solution field */}
        <FormField
          control={form.control}
          name="solution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solution</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter solution..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* is paid field */}
        <FormField
          control={form.control}
          name="isPaid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Paid</FormLabel>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* price field */}
        {isPaid && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter price of idea..."
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* images field  */}
        <div>
          <div className="flex justify-between items-center border-t border-b py-3 my-5">
            <p className="text-primary font-bold text-xl">
              Add Appropriate Images
            </p>
            <Button
              variant="outline"
              className="size-10"
              onClick={addImage}
              type="button"
            >
              <Plus className="text-primary" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {imageFields.map((imageField, index) => (
              <div key={imageField.id} className="relative">
                <FormField
                  control={form.control}
                  name={`images.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image {index + 1}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Paste image URL"
                          value={field.value || ""}
                          className="pr-7"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {imageField.value && (
                  <Button
                    variant="ghost"
                    className="absolute bottom-0 -right-2 hover:bg-base cursor-pointer"
                    onClick={() => removeImage(index)}
                    type="button"
                  >
                    <MinusCircle className="text-red-500 size-5 z-10" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* categories field */}
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value.some(
                        (item: any) => item.value === cat.id
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([
                            ...field.value,
                            { value: cat.id, name: cat.name },
                          ]);
                        } else {
                          field.onChange(
                            field.value.filter(
                              (item: any) => item.value !== cat.id
                            )
                          );
                        }
                      }}
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {cat.name}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
