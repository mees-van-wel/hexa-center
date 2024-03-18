import { PropertyDetail } from "@/components/entities/property/PropertyDetail";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

type PropertyPageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PropertyPageParams) {
  const trpc = getTrpcClientOnServer();

  const property = await trpc.property.get.query(parseInt(params.id));

  return <PropertyDetail property={property} />;
}
