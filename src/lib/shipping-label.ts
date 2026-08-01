export type ShippingLabelOrder = {
  order_number: number;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  email?: string | null;
  city: string;
  governorate: string | null;
  address: string;
  building: string | null;
  notes: string | null;
  items: Array<{ name: string; size: string; quantity: number; price: number | null }>;
  subtotal: number;
  shipping_fee: number;
  total: number;
  created_at: string;
};

const SENDER = {
  name: "Ark Matcha",
  phone: "+20 106 828 4664",
  site: "arkmatchaa.shop",
};

function itemsLine(o: ShippingLabelOrder) {
  return o.items.map((i) => `${i.name}${i.size ? ` (${i.size})` : ""} × ${i.quantity}`).join(" + ");
}

/** Plain text ready to paste into any courier form / WhatsApp. */
export function buildLabelText(o: ShippingLabelOrder) {
  return [
    `Order #${o.order_number} — ${SENDER.name}`,
    `Date: ${new Date(o.created_at).toLocaleString()}`,
    ``,
    `Recipient: ${o.full_name}`,
    `Phone: ${o.phone}`,
    o.whatsapp ? `WhatsApp: ${o.whatsapp}` : null,
    `Governorate: ${o.governorate ?? "-"}`,
    `City / Area: ${o.city}`,
    `Address: ${o.address}${o.building ? `, ${o.building}` : ""}`,
    ``,
    `Contents: ${itemsLine(o)}`,
    `Payment: Cash on Delivery`,
    `COD amount: EGP ${Number(o.total).toFixed(2)} (goods ${Number(o.subtotal).toFixed(2)} + shipping ${Number(o.shipping_fee).toFixed(2)})`,
    o.notes ? `Notes: ${o.notes}` : null,
    ``,
    `Sender: ${SENDER.name} — ${SENDER.phone} — ${SENDER.site}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Opens a print-ready A6 shipping label (user can Save as PDF). */
export function buildLabelHtml(o: ShippingLabelOrder) {
  const row = (label: string, value: string) =>
    `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`;
  return `<!doctype html><html><head><meta charset="utf-8">
<title>Shipping label #${o.order_number} — Ark Matcha</title>
<style>
  @page { size: A6; margin: 6mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#1b2118; margin:0; padding:10px; }
  .label { border:1.5px solid #3D4837; border-radius:10px; padding:12px; }
  .top { display:flex; justify-content:space-between; align-items:baseline; border-bottom:1.5px solid #3D4837; padding-bottom:6px; margin-bottom:8px; }
  .brand { font-size:16px; font-weight:700; letter-spacing:.04em; color:#3D4837; }
  .num { font-size:15px; font-weight:700; }
  table { width:100%; border-collapse:collapse; font-size:11.5px; }
  th { text-align:left; width:34%; padding:3px 6px 3px 0; color:#5a6552; font-weight:600; vertical-align:top; white-space:nowrap; }
  td { padding:3px 0; vertical-align:top; }
  .cod { margin-top:10px; border:1.5px solid #3D4837; border-radius:8px; padding:8px; text-align:center; }
  .cod b { display:block; font-size:19px; }
  .cod span { font-size:10px; text-transform:uppercase; letter-spacing:.14em; color:#5a6552; }
  .foot { margin-top:8px; font-size:9.5px; color:#5a6552; text-align:center; }
  @media print { .noprint { display:none; } }
  .noprint { text-align:center; margin-top:14px; }
  .noprint button { font:inherit; padding:8px 16px; border-radius:8px; border:0; background:#3D4837; color:#fff; cursor:pointer; }
</style></head><body>
<div class="label">
  <div class="top"><span class="brand">ARK MATCHA</span><span class="num">#${o.order_number}</span></div>
  <table>
    ${row("Recipient", o.full_name)}
    ${row("Phone", o.phone)}
    ${o.whatsapp ? row("WhatsApp", o.whatsapp) : ""}
    ${row("Governorate", o.governorate ?? "-")}
    ${row("City / Area", o.city)}
    ${row("Address", `${o.address}${o.building ? `, ${o.building}` : ""}`)}
    ${row("Contents", itemsLine(o))}
    ${o.notes ? row("Notes", o.notes) : ""}
    ${row("Date", new Date(o.created_at).toLocaleString())}
  </table>
  <div class="cod"><span>Cash on Delivery</span><b>EGP ${Number(o.total).toFixed(2)}</b></div>
  <div class="foot">Sender: ${SENDER.name} · ${SENDER.phone} · ${SENDER.site}</div>
</div>
<div class="noprint"><button onclick="window.print()">Print / Save as PDF</button></div>
</body></html>`;
}

export function printLabel(o: ShippingLabelOrder) {
  const html = buildLabelHtml(o);
  const w = window.open("", "_blank", "width=520,height=760");
  if (!w) return false;
  w.document.write(html);
  w.document.close();
  setTimeout(() => { try { w.focus(); w.print(); } catch { /* ignore */ } }, 350);
  return true;
}

export function downloadLabel(o: ShippingLabelOrder) {
  const blob = new Blob([buildLabelHtml(o)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ark-matcha-label-${o.order_number}.html`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
