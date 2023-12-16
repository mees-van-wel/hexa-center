import { cookies } from "next/headers";

import { Users } from "@/components/pages/Users";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const users = await trpc.user.list.query();

  return <Users users={users} />;
}
