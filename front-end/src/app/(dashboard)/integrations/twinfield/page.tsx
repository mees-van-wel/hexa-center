import { cookies } from "next/headers";

import { TwinfieldDetail } from "@/components/pages/integrations/TwinfieldDetail";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const integration = await trpc.integration.get.query("twinfield");

  return <TwinfieldDetail integration={integration} />;
}
