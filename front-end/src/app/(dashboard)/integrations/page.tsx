import { Overview } from "@/components/pages/integrations/Overview";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();

  const integrations = await trpc.integration.list.query();

  return <Overview integrations={integrations} />;
}
