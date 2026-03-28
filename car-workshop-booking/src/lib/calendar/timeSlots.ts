import { addMinutes, isBefore, isEqual, parse, format, isValid } from 'date-fns';

/**
 * Generuje dostępne sloty czasowe (co 30 minut) od 8:00 do 16:30 na dany dzień,
 * z wykluczeniem już zarezerwowanych godzin oraz całkowicie zablokowanych dni.
 * 
 * @param date - Data w formacie 'YYYY-MM-DD'
 * @param bookedSlots - Tablica zajętych godzin, np. ['08:30', '10:00', '14:30']
 * @param blockedDates - Tablica dat, w których warsztat jest całkowicie zamknięty, np. ['2026-03-05']
 * @returns Tablica dostępnych godzin, np. ['08:00', '09:00', '09:30', ...]
 */
export function getAvailableTimeSlots(
    date: string,
    bookedSlots: string[],
    blockedDates: string[]
): string[] {
    // Jeśli cały dzień jest zablokowany (np. urlop, weekend), zwracamy pustą listę
    if (blockedDates.includes(date)) {
        return [];
    }

    // Definiujemy godziny pracy: Start 8:00, Koniec 16:30.
    // Używamy przykładowej daty (dzisiejszej) tylko jako podkładu do operacji na czasie, 
    // ponieważ interesuje nas wyłącznie sam czas (godziny i minuty).
    const referenceDate = new Date();

    const startTime = parse('08:00', 'HH:mm', referenceDate);
    // Ostatni możliwy slot to 16:00, aby wizyta 30-minutowa zakończyła się o 16:30.
    const endTime = parse('16:00', 'HH:mm', referenceDate);

    const slotDuration = 30; // 30 minut

    if (!isValid(startTime) || !isValid(endTime)) {
        console.error("Invalid time format setup.");
        return [];
    }

    const availableSlots: string[] = [];
    let currentTime = startTime;

    // Dopóki obecny czas jest przed lub równy 16:00
    while (isBefore(currentTime, endTime) || isEqual(currentTime, endTime)) {
        const timeString = format(currentTime, 'HH:mm');

        // Jeśli slot NIE znajduje się na liście zajętych (`bookedSlots`), dodajemy go
        if (!bookedSlots.includes(timeString)) {
            availableSlots.push(timeString);
        }

        // Dodajemy 30 minut dla kolejnego obrotu pętli
        currentTime = addMinutes(currentTime, slotDuration);
    }

    return availableSlots;
}
