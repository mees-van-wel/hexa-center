import { CustomersOverview } from "@/components/entities/customer/CustomersOverview";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();
  const customers = await trpc.customer.list.query();

  return (
    <CustomersOverview
      customers={customers.sort((a, b) => a.name.localeCompare(b.name))}
    />
  );
}
