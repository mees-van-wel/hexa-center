import { AppointmentTypeDetail } from "@/components/entities/appointmentType/appointmentTypeDetail";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

type AppointmentTypePageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: AppointmentTypePageParams) {
  const trpc = getTrpcClientOnServer();

  const appointmentType = await trpc.appointmentType.get.query(
    parseInt(params.id),
  );

  return <AppointmentTypeDetail appointmentType={appointmentType} />;
}
