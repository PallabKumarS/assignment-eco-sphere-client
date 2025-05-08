import { FC } from "react";
import { TIdea, TIdeaStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

interface IdeaCardMProps {
  idea: TIdea;
}

const IdeaCardM: FC<IdeaCardMProps> = ({ idea }) => {
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
            <p className="text-sm line-clamp-2">{description}</p>
          </div>
        )}

        {solution && (
          <div className="mb-3">
            <p className="text-sm font-medium">Solution:</p>
            <p className="text-sm line-clamp-2">{solution}</p>
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
      </CardFooter>
    </Card>
  );
};

export default IdeaCardM;
