import { redirect } from "next/navigation";

export default function MachinesDetailRedirect({ params }: { params: { id: string } }) {
  redirect("/machinery/" + params.id);
}
