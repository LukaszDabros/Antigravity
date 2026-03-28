export interface User {
    id: string;
    email: string;
    role: 'admin' | 'staff';
}

export interface Appointment {
    id: string;
    clientName: string;
    phone: string;
    carModel: string;
    issueDescription: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    status: 'pending' | 'confirmed' | 'rejected';
    createdAt: string;
}

export interface WorkshopSettings {
    id: string;
    blockedDates: string[]; // ['2026-03-05']
    blockedTimeSlots: { date: string; time: string }[];
    workingHours: {
        start: string;
        end: string;
        slotDurationMinutes: number;
    };
}
