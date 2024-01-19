import { cookies } from "next/headers";

import { RelationDetail } from "@/components/entities/relation/RelationDetail";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

type PageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageParams) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const relation = await trpc.relation.get.query(parseInt(params.id));

  return <RelationDetail relation={relation} />;
}
