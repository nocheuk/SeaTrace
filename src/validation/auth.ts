import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50),
});

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const magicLinkSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export const reportDetailsSchema = z.object({
  title: z.string().max(120).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  severity: z.enum(['low', 'moderate', 'high']).optional().nullable(),
  speciesName: z.string().max(120).optional().nullable(),
  quantityEstimate: z.string().max(100).optional().nullable(),
  aliveStatus: z.enum(['alive', 'dead', 'unknown']).optional().nullable(),
});

export const reportLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationAccuracy: z.number().nullable(),
  observedAt: z.string().datetime(),
});

export const reportCategorySchema = z.object({
  subcategory: z.string().min(1, 'Select a category'),
});

export const createReportSchema = reportLocationSchema.merge(reportCategorySchema).merge(reportDetailsSchema);

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
