import { TwinfieldDetail } from "@/components/pages/integrations/TwinfieldDetail";
import { trpc } from "@/utils/trpc";

export default async function Page() {
  const integration = await trpc.integration.get.query("twinfield");

  return <TwinfieldDetail integration={integration} />;
}
