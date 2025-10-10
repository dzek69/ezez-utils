/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ensureDate } from "./ensureDate.js";

/**
 * PHP's `strftime`-like date formatter.
 * IMPORTANT: Use Intl.DateTimeFormat everywhere possible. Use this only if you are 100% sure you want to have given
 * date format, not depending on any locale standards.
 *
 * Important: this is work in progress. All locale-based values are not supported yet. Formats that heavily depend on
 * locale won't ever be supported.
 *
 * @example
 * ```typescript
 * formatDate(Date.now(), "%Y-%m-%d %H:%M:%S"); // ie: "2024-06-26 14:23:45"
 * ```
 */
const formatDate = (date: Date | number, format: string, locale = "en-US"): string => { // eslint-disable-line max-lines-per-function
    const d = ensureDate(date);
    return format.replace(/%([%a-zA-Z])/gu, (_, c: string) => {
        switch (c) {
            case "%": return "%";
            // Day
            case "a": throw new Error("`%a` is not supported yet");
            case "A": throw new Error("`%A` is not supported yet");
            case "d": return String(d.getDate()).padStart(2, "0");
            case "e": return String(d.getDate()).padStart(2, " ");
            case "j": return String(
                Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000),
            ).padStart(3, "0");
            case "u": return String(d.getDay() || 7);
            case "w": return String(d.getDay());
            // Week
            case "U": throw new Error("`%U` is not supported yet");
            case "V": throw new Error("`%V` is not supported yet");
            case "W": throw new Error("`%W` is not supported yet");
            // Month
            case "b": throw new Error("`%b` is not supported yet");
            case "B": throw new Error("`%B` is not supported yet");
            case "h": throw new Error("`%h` is not supported yet");
            case "m": return String(d.getMonth() + 1).padStart(2, "0");
            // Year
            case "C": throw new Error("`%C` is not supported yet");
            case "g": throw new Error("`%g` is not supported yet");
            case "G": throw new Error("`%G` is not supported yet");
            case "y": return String(d.getFullYear()).substring(2);
            case "Y": return String(d.getFullYear());
            // Time
            case "H": return String(d.getHours()).padStart(2, "0");
            case "k": return String(d.getHours()).padStart(2, " ");
            case "I": return String(d.getHours() % 12 || 12).padStart(2, "0");
            case "l": return String(d.getHours() % 12 || 12).padStart(2, " ");
            case "M": return String(d.getMinutes()).padStart(2, "0");
            case "p": return d.getHours() >= 12 ? "PM" : "AM";
            case "P": return d.getHours() >= 12 ? "pm" : "am";
            case "r": return formatDate(d, "%I:%M:%S %p", locale);
            case "R": return formatDate(d, "%H:%M", locale);
            case "S": return String(d.getSeconds()).padStart(2, "0");
            case "T": return formatDate(d, "%H:%M:%S", locale);
            case "X": throw new Error("`%X` is not supported and it will never be, use Intl.DateTimeFormat instead");
            case "z": throw new Error("`%z` is not supported yet");
            case "Z": throw new Error("`%Z` is not supported yet");
            // Time and Date stamps
            case "c": throw new Error("`%c` is not supported and it will never be, use Intl.DateTimeFormat instead");
            case "D": throw new Error("`%D` is not supported and it will never be, use Intl.DateTimeFormat instead");
            case "x": throw new Error("`%x` is not supported and it will never be, use Intl.DateTimeFormat instead");
            case "F": return formatDate(d, "%Y-%m-%d", locale);
            case "s": return String(Math.floor(d.getTime() / 1000));
            // Misc
            case "n": return "\n";
            case "t": return "\t";
        }
        return c;
    });
};

export {
    formatDate,
};
