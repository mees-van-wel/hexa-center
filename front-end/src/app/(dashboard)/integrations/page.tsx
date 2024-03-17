import { cookies } from "next/headers";

import { Overview } from "@/components/pages/integrations/Overview";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const integrations = await trpc.integration.list.query();

  return <Overview integrations={integrations} />;
}
