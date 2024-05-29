import { TwinfieldDetail } from "@/components/pages/integrations/TwinfieldDetail";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = await getTrpcClientOnServer();

  const integration = await trpc.integration.get.query("twinfield");

  return <TwinfieldDetail integration={integration} />;
}
