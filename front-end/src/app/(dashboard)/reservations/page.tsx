import { cookies } from "next/headers";

import { Reservations } from "@/components/pages/reservations/reservationsOverview";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const reservations = await trpc.reservation.list.query();
  const rooms = await trpc.room.list.query();

  return <Reservations reservations={reservations} rooms={rooms} showAll />;
}
