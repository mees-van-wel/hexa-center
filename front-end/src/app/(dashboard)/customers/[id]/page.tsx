import { CustomerDetail } from "@/components/entities/customer/CustomerDetail";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

type PageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageParams) {
  const trpc = getTrpcClientOnServer();

  const customer = await trpc.customer.get.query(parseInt(params.id));

  return <CustomerDetail customer={customer} />;
}
