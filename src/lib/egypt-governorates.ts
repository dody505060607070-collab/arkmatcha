export type Governorate = { value: string; label: string; shipping: number };

export const GOVERNORATES: Governorate[] = [
  { value: "Cairo", label: "Cairo — القاهرة", shipping: 75 },
  { value: "Giza", label: "Giza — الجيزة", shipping: 75 },
  { value: "Alexandria", label: "Alexandria — الإسكندرية", shipping: 55 },
  { value: "Qalyubia", label: "Qalyubia — القليوبية", shipping: 85 },
  { value: "Beheira", label: "Beheira — البحيرة", shipping: 85 },
  { value: "Kafr El Sheikh", label: "Kafr El Sheikh — كفر الشيخ", shipping: 85 },
  { value: "Gharbia", label: "Gharbia — الغربية", shipping: 85 },
  { value: "Dakahlia", label: "Dakahlia — الدقهلية", shipping: 85 },
  { value: "Damietta", label: "Damietta — دمياط", shipping: 85 },
  { value: "Monufia", label: "Monufia — المنوفية", shipping: 85 },
  { value: "Sharqia", label: "Sharqia — الشرقية", shipping: 85 },
  { value: "Port Said", label: "Port Said — بورسعيد", shipping: 85 },
  { value: "Ismailia", label: "Ismailia — الإسماعيلية", shipping: 85 },
  { value: "Suez", label: "Suez — السويس", shipping: 85 },
  { value: "Fayoum", label: "Fayoum — الفيوم", shipping: 95 },
  { value: "Beni Suef", label: "Beni Suef — بني سويف", shipping: 95 },
  { value: "Minya", label: "Minya — المنيا", shipping: 95 },
  { value: "Assiut", label: "Assiut — أسيوط", shipping: 95 },
  { value: "Sohag", label: "Sohag — سوهاج", shipping: 95 },
  { value: "Qena", label: "Qena — قنا", shipping: 95 },
  { value: "Luxor", label: "Luxor — الأقصر", shipping: 95 },
  { value: "Aswan", label: "Aswan — أسوان", shipping: 95 },
  { value: "Red Sea", label: "Red Sea — البحر الأحمر", shipping: 120 },
  { value: "New Valley", label: "New Valley — الوادي الجديد", shipping: 110 },
  { value: "Sinai", label: "Sinai — سيناء", shipping: 170 },
  { value: "Matrouh", label: "Matrouh — مطروح", shipping: 120 },
];

export function shippingFor(value: string): number {
  return GOVERNORATES.find((g) => g.value === value)?.shipping ?? 0;
}

/** Merge admin-managed overrides (site_settings.shipping_rates) with defaults. */
export function governoratesWithRates(
  rates?: Record<string, number> | null,
): Governorate[] {
  return GOVERNORATES.map((g) => {
    const v = rates?.[g.value];
    return typeof v === "number" && !isNaN(v) ? { ...g, shipping: v } : g;
  });
}

export function shippingForWithRates(
  value: string,
  rates?: Record<string, number> | null,
): number {
  const v = rates?.[value];
  if (typeof v === "number" && !isNaN(v)) return v;
  return shippingFor(value);
}
