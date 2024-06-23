import { wrap } from "@typeschema/valibot";
import { eq } from "drizzle-orm";
import { custom, number, object, optional } from "valibot";

import { formElements, forms, formSections } from "~/db/schema";
import { procedure, router } from "~/trpc";
import { FormElementConfig } from "~/types/formElementConfig";

const defaultValues = {
  textDisplay: { content: "" },
};

export const formRouter = router({
  get: procedure.input(wrap(number())).query(async ({ input, ctx }) => {
    const response = await ctx.db.query.forms.findFirst({
      where: eq(forms.id, input),
      with: {
        sections: {
          with: {
            elements: {
              with: {
                values: true,
              },
            },
          },
        },
      },
    });

    return response!;
  }),
  createElement: procedure
    .input(
      wrap(
        object({
          formId: number(),
          sectionId: optional(number()),
          position: number(),
          type: custom<FormElementConfig["type"]>(
            (input) => typeof input === "string",
          ),
          // config: custom<FormElementConfig>(
          //   (input) => typeof input === "object" && !!input.type,
          // ),
        }),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      let sectionId = input.sectionId;
      if (!sectionId) {
        const result = await ctx.db
          .insert(formSections)
          .values({
            formId: input.formId,
            position: 0,
          })
          .returning({
            id: formSections.id,
          });

        sectionId = result[0].id;
      }

      // TODO Update other elements position

      const elementResponse = await ctx.db
        .insert(formElements)
        .values({
          sectionId,
          position: input.position,
          config: {
            type: input.type,
            ...defaultValues[input.type],
          },
        })
        .returning({
          $kind: formElements.$kind,
          id: formElements.id,
          sectionId: formElements.sectionId,
          position: formElements.position,
          config: formElements.config,
        });

      const formResponse = await ctx.db.query.forms.findFirst({
        where: eq(forms.id, input.formId),
        with: {
          sections: {
            with: {
              elements: {
                with: {
                  values: true,
                },
              },
            },
          },
        },
      });

      return { element: elementResponse[0], form: formResponse! };
    }),
});
