export function formatValueCurrency(
  value: number,
  formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
) {
  const options: Intl.NumberFormatOptions = { ...formatOptions };
  const formatter = new Intl.NumberFormat("es-CO", options);
  return formatter.format(value);
}
