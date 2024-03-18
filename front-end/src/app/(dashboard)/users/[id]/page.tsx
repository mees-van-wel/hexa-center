import { UserDetail } from "@/components/entities/user/UserDetail";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

type PageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageParams) {
  const trpc = getTrpcClientOnServer();

  const user = await trpc.user.get.query(parseInt(params.id));

  return <UserDetail user={user} />;
}
