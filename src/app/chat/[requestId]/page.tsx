import { redirect } from "next/navigation";

export default function ChatPage({
  params,
}: {
  params: { requestId: string };
}) {
  redirect("/messages");
}