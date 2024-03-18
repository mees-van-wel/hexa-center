import { PropertiesOverview } from "@/components/entities/property/PropertiesOverview";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();

  const properties = await trpc.property.list.query();

  return <PropertiesOverview properties={properties} />;
}
