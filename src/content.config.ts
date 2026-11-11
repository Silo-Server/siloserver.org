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
      // Words and phrases readers search for that the page doesn't use itself,
      // such as product names, symptoms, and everyday wording. Search indexes
      // them with the page; they aren't shown.
      keywords: z.array(z.string().trim().min(1)).optional(),
      // Questions this page answers, in a reader's own words ("How do I watch
      // away from home?"). Search-only, like keywords: they aren't shown.
      questions: z.array(z.string().trim().min(1)).max(6).optional(),
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
