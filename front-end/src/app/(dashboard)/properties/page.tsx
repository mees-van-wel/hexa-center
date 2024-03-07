import { cookies } from "next/headers";

import { PropertiesOverview } from "@/components/entities/property/PropertiesOverview";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const properties = await trpc.property.list.query();

  return <PropertiesOverview properties={properties} />;
}
