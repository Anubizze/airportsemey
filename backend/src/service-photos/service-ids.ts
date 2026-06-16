export const SERVICE_IDS = [
  'cafe-lido',
  'medical',
  'prayer-room',
  'info-desk',
  'ticket-office',
  'vip-lounge',
  'mother-child',
  'left-luggage',
  'mobility',
  'police',
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

export function isValidServiceId(value: string): value is ServiceId {
  return (SERVICE_IDS as readonly string[]).includes(value);
}
