import { redirect } from "next/navigation";

export default function PaymentPage({
  params,
}: {
  params: { requestId: string };
}) {
  redirect("/payments");
}