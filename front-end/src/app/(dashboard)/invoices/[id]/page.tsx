import { cookies } from "next/headers";

import { InvoiceDetail } from "@/components/entities/invoice/InvoiceDetail";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

type PageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageParams) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const invoice = await trpc.invoice.get.query(parseInt(params.id));

  return <InvoiceDetail invoice={invoice} />;
}
