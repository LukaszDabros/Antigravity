const fs = require('fs');
const path = require('path');

function parseCSVLine(line) {
    const res = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
            inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
            res.push(current.trim());
            current = '';
        } else {
            current += c;
        }
    }
    res.push(current.trim());
    return res;
}

const csvPath = path.join(__dirname, 'schedule.csv');
const csv = fs.readFileSync(csvPath, 'utf8');
const lines = csv.split('\n');

const schedule = {};
let currentDay = '';
const daysMap = { 'pon.': 'monday', 'wt.': 'tuesday', 'śr.': 'wednesday', 'cz.': 'thursday', 'piątek': 'friday' };

for (let i = 0; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < 13) continue;

    const dayStr = row[2];
    if (dayStr && daysMap[dayStr]) {
        currentDay = daysMap[dayStr];
        schedule[currentDay] = [];
        continue;
    }

    const lesson = row[2];
    if (lesson && (lesson.startsWith('l.') || lesson.startsWith('l '))) {
        const wA = [row[3], row[4], row[5], row[6]];
        const wB = [row[9], row[10], row[11], row[12]];

        const teachers = ['G.Grabowska', 'M. Księżna - Michalska', 'A.Krynicka-Ślusarek', 'Ł. Dąbroś'];
        const tData = [];

        for (let t = 0; t < 4; t++) {
            const gA = (wA[t] || '').replace(/\s+/g, ' ').trim();
            const gB = (wB[t] || '').replace(/\s+/g, ' ').trim();

            if (gA || gB) {
                let rota = [];
                if (gA === gB) {
                    rota = [gA];
                } else {
                    // Detect 3-week specific rotation on Wednesday 7-8 for 3A dz., 3B dz., 3A/B ch.
                    if (currentDay === 'wednesday' && (lesson.includes('7-8') || lesson.includes('7') || lesson.includes('8'))) {
                        if (gA.includes('3A dz.')) rota = ["3A dz. sala", "3A dz. Loretańska", "3A dz. siłownia"];
                        if (gA.includes('3B dz.')) rota = ["3B dz. siłownia", "3B dz. sala", "3B dz. Loretańska"];
                        if (gA.includes('3A/B ch.')) rota = ["3A/B ch. Loretańska", "3A/B ch. siłownia", "3A/B ch. sala"];
                    }
                    if (rota.length === 0) {
                        rota = [gA, gB];
                    }
                }
                tData.push({
                    teacher: teachers[t],
                    groups: rota
                });
            }
        }
        schedule[currentDay].push({ lesson, teachers: tData });
    }
}

const jsContent = 'const scheduleData = ' + JSON.stringify(schedule, null, 2) + ';';
fs.writeFileSync(path.join(__dirname, 'schedule_data.js'), jsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'schedule_data.json'), JSON.stringify(schedule, null, 2), 'utf8');
console.log('Zapisano pomyślnie schedule_data.js i schedule_data.json!');

