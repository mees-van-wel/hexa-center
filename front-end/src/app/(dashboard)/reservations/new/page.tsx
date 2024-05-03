import { ReservationCreate } from "@/components/entities/reservation/ReservationCreate";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();

  const customers = await trpc.customer.list.query();
  const rooms = await trpc.room.list.query();
  const reservations = await trpc.reservation.list.query();

  return (
    <ReservationCreate
      rooms={rooms}
      customers={customers}
      reservations={reservations}
    />
  );
}
