import { InvoicesOverview } from "@/components/entities/invoice/InvoicesOverview";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();

  const invoices = await trpc.invoice.list.query();

  return (
    <InvoicesOverview
      invoices={invoices.sort(
        (a, b) => b.createdAt?.getTime() - a.createdAt?.getTime(),
      )}
    />
  );
}
