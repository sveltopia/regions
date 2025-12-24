import * as v from "valibot";
import { valibot } from "@sveltopia/regions";

const _footerSchema = v.pipe(
  v.object({
    prev: v.optional(
      v.object({
        label: v.string(),
        href: v.string(),
      })
    ),
    next: v.optional(
      v.object({
        label: v.string(),
        href: v.string(),
      })
    ),
  })
);

export type FooterData = v.InferOutput<typeof _footerSchema>;

export const footerSchema = valibot<FooterData>(_footerSchema, v.parse);
