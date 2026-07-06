/**
 * Categorical series palette, checked for colour-blind separation and contrast on white cards.
 * Order matters: charts assign colours by series index.
 */
export const SERIES = ["#4a5bd4", "#12a38a", "#e3a02f", "#d9594c", "#8b5cc7"] as const;

export const [INDIGO, TEAL, AMBER, CORAL, VIOLET] = SERIES;

/** Comparison-period colour (dashed lines, prior ticks, secondary tooltip rows). */
export const PRIOR = "#a4aac0";

/** Brand colours used by the logo mark and lineage diagram. */
export const BRAND = {
  ink: "#0e1330",
  amber: "#f2b544",
  indigoSoft: "#7d8cf0",
  indigoPale: "#b3bcf7",
} as const;
