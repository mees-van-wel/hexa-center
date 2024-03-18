import { ReservationsOverview } from "@/components/entities/reservation/ReservationsOverview";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();

  const reservations = await trpc.reservation.list.query();
  const rooms = await trpc.room.list.query();

  return (
    <ReservationsOverview reservations={reservations} rooms={rooms} showAll />
  );
}
