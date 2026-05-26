/**
 * Parse a duration string like "15m", "7d", "30s", "1h" into milliseconds.
 * Returns 0 for invalid input or undefined.
 */
export function parseDurationToMs(s?: string): number {
    if (!s) return 0;
    const match = s.match(/^(\d+)(s|m|h|d)$/i);
    if (!match) return 0;
    const n = Number(match[1]);
    const unit = match[2].toLowerCase();
    switch (unit) {
        case 's':
            return n * 1000;
        case 'm':
            return n * 60 * 1000;
        case 'h':
            return n * 60 * 60 * 1000;
        case 'd':
            return n * 24 * 60 * 60 * 1000;
        default:
            return 0;
    }
}
