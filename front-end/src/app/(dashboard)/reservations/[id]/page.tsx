import { cookies } from "next/headers";

import { Reservation } from "@/components/pages/reservations/reservation";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

type ReservationPageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: ReservationPageParams) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const users = await trpc.user.list.query();
  const rooms = await trpc.room.list.query();
  const reservation = await trpc.reservation.get.query(parseInt(params.id));

  return <Reservation reservation={reservation} rooms={rooms} users={users} />;
}
