import { cookies } from "next/headers";

import { PropertyDetail } from "@/components/entities/property/PropertyDetail";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

type PropertyPageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PropertyPageParams) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const property = await trpc.property.get.query(parseInt(params.id));

  return <PropertyDetail property={property} />;
}
