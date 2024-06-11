import { wrap } from "@typeschema/valibot";
import { eq } from "drizzle-orm";
import { minLength, number, object, partial, picklist, string } from "valibot";

import { settings } from "~/db/schema";
import { procedure, router } from "~/trpc";

// type Setting<T> = {
//   $kind: "setting";
//   id: number;
//   uuid: string;
//   updatedAt: Date;
//   updatedById: number;
//   name: string;
//   value: T;
// };

type Setting<T> = T;

type Settings = {
  companyLogoSrc: Setting<string>;
  invoiceEmailTitle: Setting<string>;
  invoiceEmailContent: Setting<string>;
  invoiceHeaderImageSrc: Setting<string>;
  invoiceFooterImageSrc: Setting<string>;
  priceEntryMode: Setting<"net" | "gross">;
  reservationRevenueAccountId: Setting<number>;
  defaultCustomerCustomFields: Setting<number>;
};

export const settingRouter = router({
  list: procedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(settings);

    const a = result.reduce<Record<string, any>>((acc, current) => {
      acc[current.name] = current.value;

      return acc;
    }, {});

    return a as Settings;
  }),
  update: procedure
    .input(
      wrap(
        partial(
          object({
            companyLogoSrc: string([minLength(2)]),
            invoiceEmailTitle: string([minLength(2)]),
            invoiceEmailContent: string([minLength(2)]),
            invoiceHeaderImageSrc: string([minLength(2)]),
            invoiceFooterImageSrc: string([minLength(2)]),
            priceEntryMode: picklist(["net", "gross"]),
            reservationRevenueAccountId: number(),
          }),
        ),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedAt = new Date();
      await Promise.all(
        Object.entries(input).map(([key, value]) =>
          ctx.db
            .update(settings)
            .set({ value, updatedAt, updatedById: ctx.user.id })
            .where(eq(settings.name, key as keyof Settings)),
        ),
      );

      const result = await ctx.db.select().from(settings);

      const a = result.reduce<Record<string, any>>((acc, current) => {
        acc[current.name] = current.value;

        return acc;
      }, {});

      return a as Settings;
    }),
});
