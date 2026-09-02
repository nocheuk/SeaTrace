export const SAFETY_CATEGORIES = new Set([
  'stranded_animal',
  'injured_animal',
  'marine_mammal',
  'hazardous_object',
  'oil',
  'chemical',
  'suspected_sewage',
  'unknown_pollution',
  'landslip',
  'erosion',
]);

export const SENSITIVE_WILDLIFE_SUBCATEGORIES = new Set([
  'marine_mammal',
  'stranded_animal',
  'injured_animal',
  'unusual_species',
]);

/** Degrees of coordinate rounding for sensitive locations (~111m per 0.001°). */
export const SENSITIVE_LOCATION_PRECISION = 2;
