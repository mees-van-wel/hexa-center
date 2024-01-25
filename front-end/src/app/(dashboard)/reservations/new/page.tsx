import { cookies } from "next/headers";

import { ReservationNew } from "@/components/entities/reservation/ReservationNew";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const users = await trpc.user.list.query();
  const rooms = await trpc.room.list.query();

  return <ReservationNew rooms={rooms} users={users} />;
}
