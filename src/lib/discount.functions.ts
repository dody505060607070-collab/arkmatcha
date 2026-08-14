import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const codeSchema = z.object({
  code: z.string().trim().min(1).max(60),
});

/** Validate a discount code for the storefront (public, read-only). */
export const validateDiscountCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => codeSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const code = data.code.trim().toUpperCase();
    const { data: row, error } = await supabaseAdmin
      .from("discount_codes")
      .select("id, code, percent_off, active, expires_at, usage_limit, used_count")
      .ilike("code", code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row || !row.active) return { valid: false as const, reason: "Invalid discount code" };
    if (row.expires_at && new Date(row.expires_at).getTime() < Date.now())
      return { valid: false as const, reason: "This code has expired" };
    if (row.usage_limit != null && (row.used_count ?? 0) >= row.usage_limit)
      return { valid: false as const, reason: "This code has reached its usage limit" };
    return { valid: true as const, code: row.code, percent_off: Number(row.percent_off) };
  });

/** Increment usage after an order is placed. */
export const redeemDiscountCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => codeSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const code = data.code.trim();
    const { data: row } = await supabaseAdmin
      .from("discount_codes")
      .select("id, used_count")
      .ilike("code", code)
      .maybeSingle();
    if (!row) return { ok: false };
    await supabaseAdmin
      .from("discount_codes")
      .update({ used_count: (row.used_count ?? 0) + 1 })
      .eq("id", row.id);
    return { ok: true };
  });
