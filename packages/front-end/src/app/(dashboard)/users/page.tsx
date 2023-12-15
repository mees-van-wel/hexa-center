import { Users } from "@/components/pages/Users";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";
import { cookies } from "next/headers";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const users = await trpc.user.list.query();

  return <Users users={users} />;
}
