import { collection, doc, getDocs, updateDoc, addDoc, query, where, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { Appointment, WorkshopSettings } from '@/types';

// ==========================================
// WIZYTY (APPOINTMENTS)
// ==========================================

export async function fetchAppointments(): Promise<Appointment[]> {
    const q = query(collection(db, 'appointments'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment))
        .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
}

export async function createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const newApp = {
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'appointments'), newApp);
    return docRef.id;
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']) {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { status });
}

export async function fetchBookedSlotsForDate(date: string): Promise<string[]> {
    // Zwraca zapytanie dla wizyt, które są pending LUB confirmed na dany dzień
    // Ponieważ Firebase ma ograniczenia co do zapytania OR w tablicach,
    // łatwiej pobrać wszystkie dla danej daty i przefiltrować po stronie klienta/funkcji.
    const q = query(collection(db, 'appointments'), where('date', '==', date));
    const snapshot = await getDocs(q);

    const booked: string[] = [];
    snapshot.docs.forEach(docSnap => {
        const data = docSnap.data() as Appointment;
        if (data.status === 'pending' || data.status === 'confirmed') {
            booked.push(data.time);
        }
    });
    return booked;
}

// ==========================================
// USTAWIENIA (SETTINGS)
// ==========================================

const SETTINGS_ID = 'workshop_settings';

export async function fetchWorkshopSettings(): Promise<WorkshopSettings | null> {
    const docRef = doc(db, 'settings', SETTINGS_ID);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        return snapshot.data() as WorkshopSettings;
    }
    return null;
}

export async function saveWorkshopSettings(settings: WorkshopSettings) {
    const docRef = doc(db, 'settings', SETTINGS_ID);
    // Jeśli nie istnieje, utworzy (z merge: true aktualizuje tylko przesłane pola)
    await setDoc(docRef, settings, { merge: true });
}

export async function addBlockedDate(dateStr: string) {
    const settings = await fetchWorkshopSettings();
    if (settings) {
        const dates = new Set(settings.blockedDates);
        dates.add(dateStr);
        await updateDoc(doc(db, 'settings', SETTINGS_ID), {
            blockedDates: Array.from(dates)
        });
    }
}

export async function removeBlockedDate(dateStr: string) {
    const settings = await fetchWorkshopSettings();
    if (settings) {
        const dates = settings.blockedDates.filter(d => d !== dateStr);
        await updateDoc(doc(db, 'settings', SETTINGS_ID), {
            blockedDates: dates
        });
    }
}
