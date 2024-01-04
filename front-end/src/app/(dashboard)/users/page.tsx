import { cookies } from "next/headers";

import { UsersOverview } from "@/components/pages/user/UsersOverview";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const users = await trpc.user.list.query();

  return <UsersOverview users={users} />;
}
