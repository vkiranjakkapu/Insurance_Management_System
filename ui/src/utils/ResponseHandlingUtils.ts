// utils/durationHelper.ts


// Regex matches standard ISO-8601 durations (e.g., P2Y, P1M3D, PT4H)
const ISO_DURATION_REGEX =
    /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

/**
 * Type Guard to check if a string is a valid ISO-8601 Duration
 */
export const isIsoDuration = (value: unknown): value is string => {
    if (typeof value !== "string") return false;
    // Prevent matching empty duration 'P' or 'PT'
    if (value === "P" || value === "PT") return false;
    return ISO_DURATION_REGEX.test(value);
};

/**
 * Converts valid ISO durations into human-readable text
 */
export const formatIsoDuration = (duration: string): string => {
    const matches = duration.match(ISO_DURATION_REGEX);
    if (!matches) return duration;

    const [_, years, months, days] = matches;
    const parts: string[] = [];
    console.log(_);

    if (years) parts.push(`${years} ${Number(years) === 1 ? "Year" : "Years"}`);
    if (months)
        parts.push(`${months} ${Number(months) === 1 ? "Month" : "Months"}`);
    if (days) parts.push(`${days} ${Number(days) === 1 ? "Day" : "Days"}`);

    return parts.join(", ") || "0 Days";
};

export const isNumericString = (value: string | null | undefined): boolean => {
  if (!value || value.trim() === "") return false;
  
  // Number(value) converts strings to numbers, returns NaN if it fails
  return !Number.isNaN(Number(value));
};