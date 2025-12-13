export const formatDate = (date: Date | string): string => {
  if (!date) return "N/A";

  let parsedDate: Date;

  if (typeof date === "string") {
    // Try parsing string directly
    parsedDate = new Date(date);

    // If parsing fails, try common fallback (MM/DD/YYYY)
    if (isNaN(parsedDate.getTime())) {
      const match = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (match) {
        const [_, mm, dd, yyyy] = match;
        parsedDate = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
      }
    }
  } else {
    parsedDate = date;
  }

  // Final validation
  if (isNaN(parsedDate.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

export function roundTo2DP(value: number): number {
  return Math.round(value * 100) / 100;
}

export function parseAmount(
  amount: string | number | null | undefined
): number | null {
  if (amount == null) return null; // handles null and undefined

  // Convert numbers to string for regex cleaning
  let amountStr = typeof amount === "number" ? amount.toString() : amount;

  // Remove currency symbols, commas, and whitespace
  const cleanAmount = amountStr.replace(/[^0-9.-]/g, "");

  // Guard against invalid strings
  if (cleanAmount.trim() === "" || cleanAmount === "-" || cleanAmount === ".")
    return null;

  const parsed = parseFloat(cleanAmount);
  if (isNaN(parsed)) return null;

  return roundTo2DP(parsed);
}


export function normalizeGender(gender: string): "Male" | "Female" | "Other" {
  if (!gender) return "Other"; // handles null,undefined and empty string

  const vlaue = gender.trim().toLocaleLowerCase();
  if (["m", "male"].includes(vlaue)) return "Male";
  if (["f", "female"].includes(vlaue)) return "Female";

  return "Other"; // this is anyhting else like "non binary"
}
