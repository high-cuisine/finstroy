export function phoneToTelHref(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length < 10) return `tel:${phone}`;
  let n = d;
  if (n.startsWith("8")) n = `7${n.slice(1)}`;
  if (!n.startsWith("7")) n = `7${n}`;
  return `tel:+${n}`;
}
