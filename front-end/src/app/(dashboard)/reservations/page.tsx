import { cookies } from "next/headers";

import { ReservationsOverview } from "@/components/entities/reservation/reservationsOverview";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const reservations = await trpc.reservation.list.query();
  const rooms = await trpc.room.list.query();

  return (
    <ReservationsOverview reservations={reservations} rooms={rooms} showAll />
  );
}
