import { cookies } from "next/headers";

import { ReservationDetail } from "@/components/entities/reservation/reservationDetail";
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

  const [reservation, relations, rooms, productTemplates, ledgerAccounts] =
    await Promise.all([
      trpc.reservation.get.query(reservationId),
      trpc.relation.list.query(),
      trpc.room.list.query(),
      trpc.product.list.query(),
      trpc.ledgerAccount.list.query(),
    ]);

  return (
    <ReservationDetail
      reservation={reservation}
      rooms={rooms}
      relations={relations}
      productTemplates={productTemplates}
      ledgerAccounts={ledgerAccounts}
    />
  );
}
