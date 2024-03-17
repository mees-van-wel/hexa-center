import { cookies } from "next/headers";

import { UserDetail } from "@/components/entities/user/UserDetail";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

type PageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageParams) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const user = await trpc.user.get.query(parseInt(params.id));

  return <UserDetail user={user} />;
}
