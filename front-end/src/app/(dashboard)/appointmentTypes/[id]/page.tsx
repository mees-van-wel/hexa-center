import { cookies } from "next/headers";

import { AppointmentTypeDetail } from "@/components/entities/appointmentType/appointmentTypeDetail";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

type AppointmentTypePageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: AppointmentTypePageParams) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const appointmentType = await trpc.appointmentType.get.query(
    parseInt(params.id),
  );

  return <AppointmentTypeDetail appointmentType={appointmentType} />;
}
