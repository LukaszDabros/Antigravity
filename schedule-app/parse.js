const fs = require('fs');

const csv = fs.readFileSync('C:\\Users\\dabro\\.gemini\\antigravity\\scratch\\schedule-app\\schedule.csv', 'utf8');
const lines = csv.split('\n');

const schedule = {};
let currentDay = '';
const daysMap = { 'pon.': 'monday', 'wt.': 'tuesday', 'śr.': 'wednesday', 'cz.': 'thursday', 'piątek': 'friday' };

for (let i = 0; i < lines.length; i++) {
    const row = lines[i].split(',').map(s => s ? s.trim() : '');

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
            const gA = wA[t] || '';
            const gB = wB[t] || '';

            if (gA || gB) {
                let rota = [];
                if (gA === gB) {
                    rota = [gA];
                } else {
                    // Detect 3-week specific
                    if (currentDay === 'wednesday' && lesson.includes('7-8')) {
                        if (gA.includes('2A dz. siłownia')) rota = ["2A dz. siłownia", "2A dz. sala", "2A dz. Loretańska"];
                        if (gA.includes('2B dz. Loretańska')) rota = ["2B dz. Loretańska", "2B dz. siłownia", "2B dz. sala"];
                        if (gA.includes('2A/B ch. sala')) rota = ["2A/B ch. sala", "2A/B ch. Loretańska", "2A/B ch. siłownia"];
                    } else {
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
fs.writeFileSync('C:\\Users\\dabro\\.gemini\\antigravity\\scratch\\schedule-app\\schedule_data.js', jsContent);
console.log('Zapisano pomyślnie!');
