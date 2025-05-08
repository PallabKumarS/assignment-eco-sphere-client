/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import { TIdea, IdeaStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteIdea, updateIdeaStatus } from "@/services/IdeaService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";

interface IdeaCardProps {
  idea: TIdea;
}

const IdeaCard: FC<IdeaCardProps> = ({ idea }) => {
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
  } = idea;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting idea...");

    try {
      const res = await deleteIdea(id);

      if (res.success) {
        toast.success(res.message, { id: toastId });
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error("Failed to delete idea.", { id: toastId });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const toastId = toast.loading("Updating idea status...");

    try {
      const res = await updateIdeaStatus(id, newStatus);

      if (res.success) {
        toast.success(res.message, { id: toastId });
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error("Failed to update idea status.", { id: toastId });
    }
  };

  const getStatusColor = (status: IdeaStatus) => {
    switch (status) {
      case IdeaStatus.APPROVED:
        return "bg-green-100 text-green-800";
      case IdeaStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case IdeaStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case IdeaStatus.UNDER_REVIEW:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>

        {description && (
          <div className="mb-3">
            <p className="text-sm  font-medium">Description:</p>
            <p className="text-sm  line-clamp-2">{description}</p>
          </div>
        )}

        {solution && (
          <div className="mb-3">
            <p className="text-sm font-medium">Solution:</p>
            <p className="text-sm line-clamp-2">{solution}</p>
          </div>
        )}

        <div className="flex items-center text-sm mb-2">
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

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Select defaultValue={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue>
              <Badge className={getStatusColor(status as IdeaStatus)}>
                {status}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background/80">
            <SelectItem value={IdeaStatus.DRAFT}>Draft</SelectItem>
            <SelectItem value={IdeaStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={IdeaStatus.UNDER_REVIEW}>
              Under Review
            </SelectItem>
            <SelectItem value={IdeaStatus.APPROVED}>Approved</SelectItem>
            <SelectItem value={IdeaStatus.REJECTED}>Rejected</SelectItem>
          </SelectContent>
        </Select>

        <ConfirmationBox
          trigger={
            <Button size="icon" variant="destructive" aria-label="Delete idea">
              <Trash2 className="h-4 w-4" />
            </Button>
          }
          onConfirm={() => handleDelete(id)}
        />
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
