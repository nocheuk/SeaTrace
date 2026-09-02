import { SENSITIVE_WILDLIFE_SUBCATEGORIES } from '@/constants/safety';
import { getGroupForSubcategory } from '@/constants/categories';
import type { CreateReportInput } from '@/validation/auth';

export function isSensitiveSubcategory(subcategoryId: string): boolean {
  return SENSITIVE_WILDLIFE_SUBCATEGORIES.has(subcategoryId);
}

export function buildReportPayload(input: CreateReportInput, userId: string) {
  const category = getGroupForSubcategory(input.subcategory);
  if (!category) {
    throw new Error('Invalid subcategory');
  }

  const sensitive = isSensitiveSubcategory(input.subcategory);

  return {
    user_id: userId,
    category,
    subcategory: input.subcategory,
    title: input.title ?? null,
    description: input.description ?? null,
    latitude: input.latitude,
    longitude: input.longitude,
    display_latitude: input.latitude,
    display_longitude: input.longitude,
    location_accuracy: input.locationAccuracy,
    observed_at: input.observedAt,
    severity: input.severity ?? null,
    species_name: input.speciesName ?? null,
    quantity_estimate: input.quantityEstimate ?? null,
    alive_status: input.aliveStatus ?? null,
    sensitive_location: sensitive,
    source: 'mobile_app',
    metadata: {},
  };
}

export function canConfirmReport(reportUserId: string, currentUserId: string | undefined): boolean {
  if (!currentUserId) return false;
  return reportUserId !== currentUserId;
}
