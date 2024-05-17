import { AppointmentTypesOverview } from "@/components/entities/appointmentType/appointmentTypesOverview";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();

  const appointmentTypes = await trpc.appointmentType.list.query();

  return <AppointmentTypesOverview appointmentTypes={appointmentTypes} />;
}
