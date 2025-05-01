"use client";

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
import { MinusCircle, Plus } from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import { userSelector } from "@/redux/features/authSlice";
import { TCategory, TListing, TMongoose } from "@/types";
import {
  useCreateListingMutation,
  useUpdateListingMutation,
} from "@/redux/api/listingApi";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DragDropUploader } from "../shared/DragDropUploader";
import ButtonLoader from "../shared/ButtonLoader";

const formSchema = z.object({
  title: z.string().min(1),
  price: z.number(),
  description: z.string().min(1),
  category: z.string().min(1),
  images: z.array(z.object({ value: z.string().min(1) })),
  videoLink: z.string().min(1),
});

type listingFormProps = {
  listing?: TListing & TMongoose;
  edit?: boolean;
};

export default function ListingForm({
  listing,
  edit = false,
}: listingFormProps) {
  const user = useAppSelector(userSelector);

  const { data: categories, isFetching } = useGetAllCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const [createListing, { isLoading: isCreating }] = useCreateListingMutation();
  const [updateListing, { isLoading: isUpdating }] = useUpdateListingMutation();

  const isLoading = edit ? isUpdating : isCreating;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: listing?.title || "",
      price: listing?.price || 0,
      category: listing?.category._id || "",
      description: listing?.description || "",
      images: listing?.images.map((img) => {
        return { value: img };
      }) || [{ value: "" }],
      videoLink: listing?.videoLink || "",
    },
  });

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
    const toastId = toast.loading(
      edit ? "Updating listing..." : "Creating listing..."
    );
    const images = values.images.map((image) => image.value);

    const data = {
      ...values,
      images,
      sellerId: user?.userId as string,
    };

    if (edit) {
      const editData = {
        ...values,
        images,
        sellerId: listing?.sellerId.userId as string,
      };

      try {
        const res = await updateListing({
          listingId: listing?.listingId as string,
          data: editData,
        }).unwrap();
        if (res.success) {
          toast.success(res.message, {
            id: toastId,
          });
          form.reset();
        } else {
          toast.error(res.message, {
            id: toastId,
          });
        }
      } catch (error: any) {
        console.error("Form submission error", error);
        toast.error(error.data.message, { id: toastId });
      }
    } else {
      try {
        const res = await createListing(data).unwrap();
        if (res.success) {
          toast.success(res.message, {
            id: toastId,
          });
          form.reset();
        } else {
          toast.error(res.message, {
            id: toastId,
          });
        }
      } catch (error: any) {
        console.error("Form submission error", error);
        toast.error(error.data.message, { id: toastId });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl py-10 overflow-y-auto px-2"
      >
        {/* title field  */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Title of the listing"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* price field  */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the price"
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* drag and drop field  */}
        <DragDropUploader
          name="images"
          label="Upload your image(s)"
          multiple={true}
        />

        {/* description field  */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter detailed description of the house"
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* category field  */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isFetching}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.data?.map((cat: TCategory & TMongoose) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* video link field  */}
        <FormField
          control={form.control}
          name="videoLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Link</FormLabel>
              <FormControl>
                <Input placeholder="add a video link" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant={"outline"}
          type="submit"
          disabled={imageFields.length === 0}
        >
          {edit ? (
            isLoading ? (
              <ButtonLoader />
            ) : (
              "Update Listing"
            )
          ) : isLoading ? (
            <ButtonLoader />
          ) : (
            "Create Listing"
          )}
        </Button>
      </form>
    </Form>
  );
}
