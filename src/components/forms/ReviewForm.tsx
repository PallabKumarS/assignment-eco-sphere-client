"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hook";
import { userSelector } from "@/redux/features/authSlice";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "@/redux/api/reviewApi";
import { TReview, TMongoose } from "@/types";
import { cn } from "@/lib/utils";
import ButtonLoader from "../shared/ButtonLoader";
import { Star } from "lucide-react";

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type ReviewFormProps = {
  listingId?: string;
  review?: (TReview & TMongoose) | null;
  edit?: boolean;
};

export default function ReviewForm({
  listingId,
  review,
  edit = false,
}: ReviewFormProps) {
  const user = useAppSelector(userSelector);
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const isLoading = edit ? isUpdating : isCreating;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: review?.rating || 1,
      comment: review?.comment || "",
    },
  });

  const { setValue, watch, control, handleSubmit } = form;

  const rating = watch("rating");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.loading(
      edit ? "Updating review..." : "Submitting review..."
    );

    const data = {
      ...values,
      userId: user?.userId as string,
      listingId:
        (listingId as string) || (review?.listingId.listingId as string),
    };

    try {
      const res = edit
        ? await updateReview({ reviewId: review?._id as string, data }).unwrap()
        : await createReview(data).unwrap();

      if (res.success) {
        toast.success(res.message, { id: toastId });
        form.reset();
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (err:any) {
      toast.error(err.data.message, { id: toastId });
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-6 max-w-xl py-10 ${edit ? "" : "mx-auto"}`}
      >
        {/* Star Rating */}
        <FormField
          control={control}
          name="rating"
          render={() => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      onClick={() => setValue("rating", i)}
                      className={cn(
                        "w-6 h-6 cursor-pointer transition-colors",
                        i <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comment Field */}
        <FormField
          control={control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write your comment here (optional)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button variant={"outline"} type="submit">
          {edit ? (
            isLoading ? (
              <ButtonLoader />
            ) : (
              "Update Review"
            )
          ) : isLoading ? (
            <ButtonLoader />
          ) : (
            "Create Review"
          )}
        </Button>
      </form>
    </Form>
  );
}
