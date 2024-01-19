import { cookies } from "next/headers";

import { RelationsOverview } from "@/components/entities/relation/RelationsOverview";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const relations = await trpc.relation.list.query();

  return <RelationsOverview relations={relations} />;
}
