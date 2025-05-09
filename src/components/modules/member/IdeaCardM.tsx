"use client";

import { FC, useEffect, useState } from "react";
import { TIdea, TIdeaStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Lock } from "lucide-react";
import Link from "next/link";
import { useAppContext } from "@/providers/ContextProvider";
import { Modal } from "@/components/shared/Modal";
import { toast } from "sonner";
import { createPayment } from "@/services/PaymentService";

interface IdeaCardMProps {
  idea: TIdea;
}

const IdeaCardM: FC<IdeaCardMProps> = ({ idea }) => {
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const { user } = useAppContext();

  const {
    id,
    title,
    status,
    isPaid,
    price,
    categories,
    users,
    createdAt,
    solution,
    description,
    paidIdeaPurchase,
  } = idea;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (user) {
        // Check if current user has purchased this idea
        if (idea?.authorId === user.id) {
          setHasPurchased(true);
          return;
        } else if (isPaid && paidIdeaPurchase && paidIdeaPurchase.length > 0) {
          const purchased = paidIdeaPurchase.some(
            (purchase) => purchase.userId === user.id
          );
          setHasPurchased(purchased);
        }
      }
    };

    fetchCurrentUser();
  }, [isPaid, paidIdeaPurchase, user, idea?.authorId]);

  const getStatusColor = (status: TIdeaStatus) => {
    switch (status) {
      case TIdeaStatus.APPROVED:
        return "bg-green-100 text-green-800";
      case TIdeaStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case TIdeaStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case TIdeaStatus.UNDER_REVIEW:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isContentBlocked = isPaid && !hasPurchased;

  const handlePayment = async () => {
    const toastId = toast.loading("Starting payment process...");

    const data = {
      userId: user?.id,
      ideaId: idea?.id,
      amount: idea?.price,
    };

    try {
      const res = await createPayment(data);

      if (res.success) {
        toast.success("Payment started successfully", { id: toastId });
        setTimeout(() => {
          window.open(res?.data?.paymentUrl, "make your payment");
        }, 500);
      } else {
        toast.error(res.message || "Error starting payment process", {
          id: toastId,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Error starting payment process", {
        id: toastId,
      });
    }
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge className={getStatusColor(status as TIdeaStatus)}>
            {status}
          </Badge>
        </div>

        {description && (
          <div className="mb-3">
            <p className="text-sm font-medium">Description:</p>
            {isContentBlocked ? (
              <div className="relative">
                <p className="text-sm line-clamp-2 blur-sm select-none">
                  {description}
                </p>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            ) : (
              <p className="text-sm line-clamp-2">{description}</p>
            )}
          </div>
        )}

        {solution && (
          <div className="mb-3">
            <p className="text-sm font-medium">Solution:</p>
            {isContentBlocked ? (
              <div className="relative">
                <p className="text-sm line-clamp-2 blur-sm select-none">
                  {solution}
                </p>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            ) : (
              <p className="text-sm line-clamp-2">{solution}</p>
            )}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>By {users?.name || "Unknown"}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {categories?.slice(0, 3).map((category) => (
            <Badge key={category.id} variant="outline" className="text-xs">
              {category.name}
            </Badge>
          ))}
          {categories?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{categories.length - 3} more
            </Badge>
          )}
        </div>

        {isPaid && (
          <div className="text-sm font-medium text-green-600">
            Price: ${price?.toFixed(2)}
          </div>
        )}

        <div className="text-xs text-gray-400 mt-2">
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-end items-center">
        {isContentBlocked ? (
          <Modal
            trigger={
              <Button
                size="sm"
                variant="default"
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
              >
                <span>Pay ${price?.toFixed(2)}</span>
              </Button>
            }
            content={
              <div className="flex flex-col gap-4">
                <p className="text-sm">
                  This idea is paid. Please pay to view the content.
                </p>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handlePayment()}
                  >
                    Pay ${price?.toFixed(2)}
                  </Button>
                </div>
              </div>
            }
            title={`Payment For Idea ${title}`}
          />
        ) : (
          <Link href={`/ideas/${id}`}>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Details</span>
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default IdeaCardM;
