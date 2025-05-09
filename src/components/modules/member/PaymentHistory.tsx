"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle } from "lucide-react";
import { TMeta, TPaidIdeaPurchase } from "@/types";
import { ManagementTable } from "@/components/shared/ManagementTable";
import { getAllPayments } from "@/services/PaymentService";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const PaymentHistory = ({ query }: { query: Record<string, unknown> }) => {
  const [payments, setPayments] = useState<TPaidIdeaPurchase[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getAllPayments(query);
        setPayments(res?.data);
        setMeta(res?.meta);
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast.error("Failed to load payment history");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPayments();
  }, [query]);

  // Format date to readable string
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get status badge variant
  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">{status}</Badge>;
      case "PENDING":
      default:
        return <Badge variant="secondary">{status || "PENDING"}</Badge>;
    }
  };

  // Column definition
  const columns: ColumnDef<TPaidIdeaPurchase>[] = [
    {
      accessorKey: "idea.title",
      header: "Idea",
      cell: ({ row }) => {
        const idea = row.original.idea;
        return (
          <div className="max-w-[200px]">
            <p className="font-medium truncate">{idea?.title || "N/A"}</p>
            <p className="text-xs text-muted-foreground truncate">
              ID: {row.original.ideaId}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return <span>{formatCurrency(amount)}</span>;
      },
    },
    {
      accessorKey: "method",
      header: "Payment Method",
    },
    {
      accessorKey: "transactionStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("transactionStatus") as string;
        return getStatusBadge(status);
      },
    },
    {
      accessorKey: "paidAt",
      header: "Payment Date",
      cell: ({ row }) => {
        const date = row.original.paidAt;
        return <span>{formatDate(date)}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const payment = row.original;
        const status = payment.transactionStatus;

        if (status === "PAID") {
          return (
            <Link href={payment.paymentUrl as string}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Check Payment</span>
              </Button>
            </Link>
          );
        } else if (status === "PENDING") {
          return (
            <Link href={payment.paymentUrl as string}>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                <span>Verify</span>
              </Button>
            </Link>
          );
        } else {
          return (
            <Link href={payment.paymentUrl as string}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </Button>
            </Link>
          );
        }
      },
    },
  ];

  if (isFetching) return <LoadingData />;

  return (
    <div className="space-y-7">
      <h1 className="text-center font-bold text-3xl">Payment History</h1>

      {payments.length === 0 ? (
        <div className="text-center p-10 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No payment records found</p>
        </div>
      ) : (
        <>
          <ManagementTable data={payments} columns={columns} />
          <PaginationComponent meta={meta} />
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
