"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  CreditCard,
  User,
  Mail,
  DollarSign,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import LoadingData from "@/components/shared/LoadingData";
import { useEffect, useState } from "react";
import { TPaidIdeaPurchase } from "@/types";
import { verifyPayment } from "@/services/PaymentService";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/providers/ContextProvider";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "PAID":
      return (
        <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-300" />
      );
    case "CANCELLED":
      return <XCircle className="w-12 h-12 text-red-500 dark:text-red-300" />;
    default:
      return <AlertCircle className="w-12 h-12 text-muted-foreground" />;
  }
};

export default function VerifyPayment({ paymentId }: { paymentId: string }) {
  const [paymentData, setPaymentData] = useState<TPaidIdeaPurchase>();
  const [isFetching, setIsFetching] = useState(true);
  const { user } = useAppContext();

  useEffect(() => {
    const toastId = toast.loading("Verifying payment, please wait...");

    const verifyPaymentData = async () => {
      try {
        const res = await verifyPayment(paymentId, {
          userId: user?.id as string,
        });
        if (res.success) {
          toast.success(res.message, { id: toastId });
          setPaymentData(res.data as TPaidIdeaPurchase);
        } else {
          toast.error(res.message || "Error verifying payment", {
            id: toastId,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Failed to verify payment", { id: toastId });
      } finally {
        setIsFetching(false);
      }
    };

    verifyPaymentData();
  }, [paymentId, user?.id]);

  const getStatusVariant = () => {
    switch (paymentData?.transactionStatus) {
      case "PAID":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">
          Payment Verification
        </h1>
        <p className="text-muted-foreground mt-2">
          Verify and track your payment status
        </p>
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingData />
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-6">
          {/* Payment Status Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Payment Status</CardTitle>
                <StatusIcon
                  status={paymentData?.transactionStatus || "PENDING"}
                />
              </div>
              <Separator className="my-2" />
            </CardHeader>
            <CardContent>
              <div className="rounded-lg p-6 bg-muted/30 border border-border">
                <h2
                  className={`text-2xl font-bold mb-6 text-center ${
                    paymentData?.transactionStatus === "PAID"
                      ? "text-green-600 dark:text-green-300"
                      : paymentData?.transactionStatus === "CANCELLED"
                      ? "text-red-600 dark:text-red-300"
                      : "text-foreground"
                  }`}
                >
                  {paymentData?.transactionStatus || "Processing"}
                </h2>

                <div className="space-y-4">
                  <DetailRow
                    icon={<Clock className="w-5 h-5 text-primary" />}
                    label="Transaction Date"
                    value={formatDate(paymentData?.paidAt)}
                  />

                  <DetailRow
                    icon={<DollarSign className="w-5 h-5 text-primary" />}
                    label="Amount"
                    value={
                      paymentData?.amount ? `$${paymentData.amount}` : "N/A"
                    }
                  />

                  <DetailRow
                    icon={<CreditCard className="w-5 h-5 text-primary" />}
                    label="Payment Method"
                    value={paymentData?.method || "N/A"}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {paymentData?.paymentUrl && (
                <Link href={`/dashboard/member/payments`} className="w-full">
                  <Button
                    size="lg"
                    variant={getStatusVariant()}
                    className="w-full"
                  >
                    Go To Payment History{" "}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>

          {/* Transaction Details Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border-border">
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <Separator className="my-2" />
            </CardHeader>
            <CardContent>
              <div className="rounded-lg p-6 bg-muted/30 border border-border">
                {/* User Information */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <DetailRow
                      icon={<User className="w-5 h-5 text-primary" />}
                      label="Customer"
                      value={paymentData?.user?.name || "N/A"}
                    />

                    <DetailRow
                      icon={<Mail className="w-5 h-5 text-primary" />}
                      label="Email"
                      value={paymentData?.user?.email || "N/A"}
                    />
                  </div>
                </div>

                {/* Transaction Information */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Transaction Information
                  </h3>
                  <div className="space-y-3">
                    <DetailRow
                      label="Transaction ID"
                      value={paymentData?.id || "N/A"}
                    />

                    <DetailRow
                      label="Payment ID"
                      value={paymentData?.paymentId || "N/A"}
                    />
                  </div>
                </div>

                {/* Purchased Idea */}
                {paymentData?.idea && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Purchased Idea
                    </h3>
                    <div className="p-4 rounded-lg bg-background border border-border">
                      <h4 className="font-medium break-words">
                        {paymentData.idea.title}
                      </h4>
                      {paymentData.idea.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {paymentData.idea.description}
                        </p>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Badge
                          variant="outline"
                          className="font-medium whitespace-pre-wrap"
                        >
                          ID: {paymentData.ideaId}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

const DetailRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-md bg-background border border-border/50">
    {icon && <div className="flex-shrink-0">{icon}</div>}
    <div className="flex-1 min-w-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium break-words overflow-hidden text-ellipsis">
        {value}
      </p>
    </div>
  </div>
);
