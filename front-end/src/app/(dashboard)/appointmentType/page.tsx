import { cookies } from "next/headers";

import { AppointmentTypesOverview } from "@/components/entities/appointmentType/appointmentTypesOverview";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const appointmentTypes = await trpc.appointmentType.list.query();

  return <AppointmentTypesOverview appointmentTypes={appointmentTypes} />;
}
