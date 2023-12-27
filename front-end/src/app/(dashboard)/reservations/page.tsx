import { cookies } from "next/headers";

import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const reservations = await trpc.reservation.list.query();

  return <div></div>;
}
