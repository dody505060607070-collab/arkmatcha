import { supabase } from "@/integrations/supabase/client";

export type DiscountResult =
  | { valid: true; code: string; percent_off: number }
  | { valid: false; reason: string };

/** Validate a discount code via a public, read-only backend function. */
export async function validateDiscountCode(rawCode: string): Promise<DiscountResult> {
  const code = rawCode.trim();
  const { data, error } = await supabase.rpc("validate_discount_code", { _code: code });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || !row.valid) {
    return { valid: false, reason: row?.reason ?? "Invalid discount code" };
  }
  return { valid: true, code: row.code as string, percent_off: Number(row.percent_off) };
}

/** Increment usage after an order is placed. */
export async function redeemDiscountCode(code: string) {
  await supabase.rpc("redeem_discount_code", { _code: code.trim() });
}
