import { BusinessesOverview } from "@/components/entities/business/BusinessesOverview";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();

  const businesses = await trpc.business.list.query();

  return <BusinessesOverview businesses={businesses} />;
}
