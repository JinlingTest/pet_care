export const planPrices: Record<string, number> = {
  "清爽基础洗": 88,
  "全套护理洗": 138,
  "造型精修": 228
};

export const sizePrices: Record<string, number> = {
  small: 0,
  medium: 40,
  large: 90
};

export function estimateAppointmentPrice(plan: string, size: string, petType: string) {
  return (planPrices[plan] ?? planPrices["全套护理洗"]) + (sizePrices[size] ?? 0) + (petType === "cat" ? 20 : 0);
}

export function serializeAppointment(appointment: {
  id: string;
  ownerName: string;
  phone: string;
  petType: string;
  size: string;
  plan: string;
  note: string | null;
  estimatedPrice: number;
  status: string;
  staffNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer?: { name: string; phone: string } | null;
}) {
  return {
    ...appointment,
    status: appointment.status.toLowerCase(),
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString()
  };
}
