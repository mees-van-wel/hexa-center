import { cookies } from "next/headers";

import { InvoicesOverview } from "@/components/entities/invoice/InvoicesOverview";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const invoices = await trpc.invoice.list.query();

  return <InvoicesOverview invoices={invoices} />;
}
