import { Overview } from "@/components/pages/integrations/Overview";
import { trpc } from "@/utils/trpc";

export default async function Page() {
  const integrations = await trpc.integration.list.query();

  return <Overview integrations={integrations} />;
}
