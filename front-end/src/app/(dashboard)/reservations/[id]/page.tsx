import { cookies } from "next/headers";

import { ReservationUpdate } from "@/components/entities/reservation/ReservationUpdate";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

type ReservationPageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: ReservationPageParams) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const reservationId = parseInt(params.id);

  const [reservation, relations, rooms, invoiceExtraTemplates] =
    await Promise.all([
      trpc.reservation.get.query(reservationId),
      trpc.relation.list.query(),
      trpc.room.list.query(),
      trpc.invoiceExtra.list.query(),
    ]);

  return (
    <ReservationUpdate
      reservation={reservation}
      rooms={rooms}
      relations={relations}
      invoiceExtraTemplates={invoiceExtraTemplates}
    />
  );
}
