export interface GuestRSVP {
  id: string;
  fullName: string;
  attendance: 'yes' | 'yes_partner' | 'no';
  drinks: string[];
  comment?: string;
  createdAt: string;
}

export interface WeddingSettings {
  names: string;
  groom: string;
  bride: string;
  dateStr: string; // e.g. "14.06.2026"
  timeStr: string; // e.g. "17:00"
  targetDateTime: string; // ISO format string or parsable date for the countdown
  venueName: string; // e.g. "Банкетный зал «РИО»"
  venueAddress: string; // e.g. "ул. Сарьяна, 3, Ленинаван"
  contactPhone: string;
  musicUrl: string;
}
