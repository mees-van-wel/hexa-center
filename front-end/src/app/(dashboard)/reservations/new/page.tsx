import { cookies } from "next/headers";

import { ReservationNew } from "@/components/pages/reservations/ReservationNew";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const users = await trpc.user.list.query();

  return <ReservationNew users={users} />;
}
