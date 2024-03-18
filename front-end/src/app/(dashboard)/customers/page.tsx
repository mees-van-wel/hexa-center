import { cookies } from "next/headers";

import { CustomersOverview } from "@/components/entities/customer/CustomersOverview";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const customers = await trpc.customer.list.query();

  return <CustomersOverview customers={customers} />;
}
