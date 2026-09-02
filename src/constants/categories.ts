export type ReportCategoryGroup =
  | 'wildlife'
  | 'pollution'
  | 'debris'
  | 'coastal'
  | 'water'
  | 'other';

export type ReportSubcategory = {
  id: string;
  label: string;
  group: ReportCategoryGroup;
  icon: string;
};

export const CATEGORY_GROUPS: Record<
  ReportCategoryGroup,
  { label: string; filterKey: string }
> = {
  wildlife: { label: 'Wildlife', filterKey: 'wildlife' },
  pollution: { label: 'Pollution', filterKey: 'pollution' },
  debris: { label: 'Debris', filterKey: 'debris' },
  coastal: { label: 'Coastal', filterKey: 'coastal' },
  water: { label: 'Water', filterKey: 'water' },
  other: { label: 'Other', filterKey: 'other' },
};

export const REPORT_SUBCATEGORIES: ReportSubcategory[] = [
  { id: 'stranded_animal', label: 'Stranded animal', group: 'wildlife', icon: 'paw' },
  { id: 'dead_animal', label: 'Dead animal', group: 'wildlife', icon: 'skull' },
  { id: 'injured_animal', label: 'Injured animal', group: 'wildlife', icon: 'medkit' },
  { id: 'unusual_species', label: 'Unusual species', group: 'wildlife', icon: 'eye' },
  { id: 'jellyfish', label: 'Jellyfish', group: 'wildlife', icon: 'water' },
  { id: 'fish', label: 'Fish', group: 'wildlife', icon: 'fish' },
  { id: 'bird', label: 'Bird', group: 'wildlife', icon: 'leaf' },
  { id: 'marine_mammal', label: 'Marine mammal', group: 'wildlife', icon: 'happy' },
  { id: 'invasive_species', label: 'Invasive species', group: 'wildlife', icon: 'warning' },
  { id: 'other_wildlife', label: 'Other wildlife', group: 'wildlife', icon: 'ellipsis-horizontal' },
  { id: 'suspected_sewage', label: 'Suspected sewage', group: 'pollution', icon: 'alert-circle' },
  { id: 'oil', label: 'Oil', group: 'pollution', icon: 'water' },
  { id: 'chemical', label: 'Chemical', group: 'pollution', icon: 'flask' },
  { id: 'plastic', label: 'Plastic', group: 'pollution', icon: 'trash' },
  { id: 'unusual_foam', label: 'Unusual foam', group: 'pollution', icon: 'cloud' },
  { id: 'water_discolouration', label: 'Water discolouration', group: 'pollution', icon: 'color-palette' },
  { id: 'unknown_pollution', label: 'Unknown pollution', group: 'pollution', icon: 'help-circle' },
  { id: 'fishing_gear', label: 'Fishing gear', group: 'debris', icon: 'git-network' },
  { id: 'nets', label: 'Nets', group: 'debris', icon: 'grid' },
  { id: 'large_debris', label: 'Large debris', group: 'debris', icon: 'cube' },
  { id: 'hazardous_object', label: 'Hazardous object', group: 'debris', icon: 'nuclear' },
  { id: 'litter_accumulation', label: 'Litter accumulation', group: 'debris', icon: 'trash-bin' },
  { id: 'erosion', label: 'Erosion', group: 'coastal', icon: 'trending-down' },
  { id: 'landslip', label: 'Landslip', group: 'coastal', icon: 'arrow-down' },
  { id: 'flooding', label: 'Flooding', group: 'coastal', icon: 'rainy' },
  { id: 'damaged_infrastructure', label: 'Damaged infrastructure', group: 'coastal', icon: 'construct' },
  { id: 'algal_bloom', label: 'Algal bloom', group: 'water', icon: 'flower' },
  { id: 'unusual_water_colour', label: 'Unusual water colour', group: 'water', icon: 'color-fill' },
  { id: 'unusual_smell', label: 'Unusual smell', group: 'water', icon: 'nose' },
  { id: 'dead_fish', label: 'Dead fish', group: 'water', icon: 'fish' },
  { id: 'other_water_condition', label: 'Other water condition', group: 'water', icon: 'water' },
  { id: 'something_unusual', label: 'Something unusual', group: 'other', icon: 'sparkles' },
  { id: 'unsure', label: 'Unsure', group: 'other', icon: 'help' },
];

export const MAP_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'pollution', label: 'Pollution' },
  { id: 'water', label: 'Water' },
  { id: 'debris', label: 'Debris' },
  { id: 'coastal', label: 'Coastal' },
  { id: 'other', label: 'Other' },
] as const;

export type MapFilterId = (typeof MAP_FILTERS)[number]['id'];

export function getSubcategory(id: string): ReportSubcategory | undefined {
  return REPORT_SUBCATEGORIES.find((s) => s.id === id);
}

export function getSubcategoriesForGroup(group: ReportCategoryGroup): ReportSubcategory[] {
  return REPORT_SUBCATEGORIES.filter((s) => s.group === group);
}

export function getGroupForSubcategory(subcategoryId: string): ReportCategoryGroup | undefined {
  return getSubcategory(subcategoryId)?.group;
}
