import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { z } from "astro/zod";

const version = z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: z.object({
      beta: z.boolean().default(false),
      // Minimum supported releases, only when established by source/release evidence.
      requires: z.object({
        server: version.optional(),
        apple: version.optional(),
        android: version.optional(),
      }).strict().refine(value => Object.values(value).some(Boolean),
        'Provide at least one version requirement').optional(),
    }) }),
  }),
};
