import { RoomUpdate } from "@/components/entities/room/RoomUpdate";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

type RoomPageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: RoomPageParams) {
  const trpc = getTrpcClientOnServer();

  const room = await trpc.room.get.query(parseInt(params.id));

  return <RoomUpdate room={room} />;
}
