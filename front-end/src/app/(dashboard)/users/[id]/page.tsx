import { cookies } from "next/headers";

import { User } from "@/components/pages/users/User";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

type UserPageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: UserPageParams) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const user = await trpc.user.get.query(parseInt(params.id));

  return <User user={user} />;
}
