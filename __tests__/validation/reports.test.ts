import { buildReportPayload, canConfirmReport, isSensitiveSubcategory } from '@/domain/reports';
import { signUpSchema, createReportSchema } from '@/validation/auth';

describe('signUpSchema', () => {
  it('validates correct signup input', () => {
    const result = signUpSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Coastal Observer',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short passwords', () => {
    const result = signUpSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
      displayName: 'Observer',
    });
    expect(result.success).toBe(false);
  });
});

describe('createReportSchema', () => {
  it('validates report payload', () => {
    const result = createReportSchema.safeParse({
      latitude: 50.7192,
      longitude: -1.8808,
      locationAccuracy: 10,
      observedAt: new Date().toISOString(),
      subcategory: 'jellyfish',
    });
    expect(result.success).toBe(true);
  });
});

describe('buildReportPayload', () => {
  it('maps subcategory to category group', () => {
    const payload = buildReportPayload(
      {
        latitude: 50.7,
        longitude: -1.88,
        locationAccuracy: 5,
        observedAt: new Date().toISOString(),
        subcategory: 'jellyfish',
      },
      'user-123',
    );
    expect(payload.category).toBe('wildlife');
    expect(payload.subcategory).toBe('jellyfish');
    expect(payload.user_id).toBe('user-123');
  });

  it('flags sensitive wildlife subcategories', () => {
    const payload = buildReportPayload(
      {
        latitude: 50.7,
        longitude: -1.88,
        locationAccuracy: 5,
        observedAt: new Date().toISOString(),
        subcategory: 'marine_mammal',
      },
      'user-123',
    );
    expect(payload.sensitive_location).toBe(true);
  });
});

describe('canConfirmReport', () => {
  it('prevents self-confirmation', () => {
    expect(canConfirmReport('user-a', 'user-a')).toBe(false);
  });

  it('allows confirmation by other users', () => {
    expect(canConfirmReport('user-a', 'user-b')).toBe(true);
  });

  it('requires authentication', () => {
    expect(canConfirmReport('user-a', undefined)).toBe(false);
  });
});

describe('isSensitiveSubcategory', () => {
  it('identifies marine mammal as sensitive', () => {
    expect(isSensitiveSubcategory('marine_mammal')).toBe(true);
  });

  it('does not flag litter as sensitive', () => {
    expect(isSensitiveSubcategory('litter_accumulation')).toBe(false);
  });
});
