import { BusinessDetail } from "@/components/entities/business/BusinessDetail";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

type BusinessPageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: BusinessPageParams) {
  const trpc = getTrpcClientOnServer();

  const business = await trpc.business.list.query();

  return <BusinessDetail business={business} />;
}
