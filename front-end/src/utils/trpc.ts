import { trpcTransformer } from "@/utils/trpcTransformer";
import type {
  AppRouter as AR,
  RouterInput as RI,
  RouterOutput as RO,
} from "@back-end/routes/_app";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export type AppRouter = AR;
export type RouterInput = RI;
export type RouterOutput = RO;

let TRPCRefreshToken: string | undefined;

export function setTRPCRefreshToken(newToken: string) {
  /**
   * You can also save the token to cookies, and initialize from
   * cookies above.
   */
  TRPCRefreshToken = newToken;
}

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: trpcTransformer,
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
      headers() {
        return {
          Authorization: TRPCRefreshToken
            ? `Bearer ${TRPCRefreshToken}`
            : undefined,
        };
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

// export const getTrpcClientOnServer = () => {
//   const refreshToken = cookies().get("refreshToken")?.value;
//   const headersList = headers();

//   console.log(headersList);

//   return createTRPCProxyClient<AppRouter>({
//     transformer: trpcTransformer,
//     links: [
//       httpBatchLink({
//         url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
//         headers() {
//           return {
//             Authorization: `Bearer ${refreshToken}`,
//             // "X-Subdomain": ,
//           };
//         },
//         fetch(url, options) {
//           return fetch(url, {
//             ...options,
//             credentials: "include",
//           });
//         },
//       }),
//     ],
//   });
// };

// export const getTrpcClientOnClient = () => {
//   return createTRPCProxyClient<AppRouter>({
//     transformer: trpcTransformer,
//     links: [
//       httpBatchLink({
//         url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
//         headers() {
//           return {
//             Authorization: undefined,
//             "X-Subdomain": window.location.hostname.split(".")[0],
//           };
//         },
//         fetch(url, options) {
//           return fetch(url, {
//             ...options,
//             credentials: "include",
//           });
//         },
//       }),
//     ],
//   });
// };
