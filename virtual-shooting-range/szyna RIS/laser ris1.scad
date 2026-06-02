// ==========================================
// SYSTEM TRENINGOWY LASER V13.2 - POPRAWIONY OTWÓR PRZYCISKU
// ==========================================

$fn = 100; 

dlugosc = 70; szerokosc_dolu = 36; wysokosc_pudelka = 26;
ris_w = 21.2; ris_h = 10; grubosc_scianki = 2.5;
dia_lasera = 6.2; dia_wkladki = 10; dlugosc_wkladki = 28;

module obudowa_v13_2() {
    difference() {
        union() {
            translate([-szerokosc_dolu/2, 0, 0]) cube([szerokosc_dolu, dlugosc, wysokosc_pudelka - 5]);
            hull() {
                translate([-szerokosc_dolu/2, 0, wysokosc_pudelka - 5.1]) cube([szerokosc_dolu, dlugosc, 0.1]);
                translate([-28/2, 0, wysokosc_pudelka + 2]) cube([28, dlugosc, 0.1]);
            }
            translate([-30/2, 0, wysokosc_pudelka]) cube([30, dlugosc, ris_h]);
        }

        // A. Wycięcia techniczne (Stozek i Kanal)
        translate([0, -1, 12]) rotate([-90, 0, 0]) cylinder(d1=7, d2=11, h=4);
        translate([0, 3, 12]) rotate([-90, 0, 0]) cylinder(d=16, h=35); 

        // B. OTWORY REGULACJI
        translate([0, 22, -1]) cylinder(d=3.2, h=15); // Pion
        translate([szerokosc_dolu/2 - 5, 22, 12]) rotate([0, 90, 0]) cylinder(d=3.2, h=10); // Poziom

        // C. KOMORA ELEKTRONIKI
        translate([-szerokosc_dolu/2 + grubosc_scianki, 35, -1])
            cube([szerokosc_dolu - 2*grubosc_scianki, dlugosc - 35 - grubosc_scianki, wysokosc_pudelka - 5]);

        // D. POPRAWIONY OTWÓR NA PRZYCISK (Na wylot, przesunięty)
        // Umieszczony na Y=42 (Zatrzask jest na Y=40, więc są obok siebie)
        translate([szerokosc_dolu/2 - 5, 42, 8]) 
            cube([10, 4.5, 6.2]); // Wycięcie przelotowe przez ściankę

        // E. GNIAZDA ZATRZASKÓW (Zostawione bez zmian)
        for(y = [40, dlugosc - 10]) {
            translate([-szerokosc_dolu/2 + grubosc_scianki - 1, y, 1.5]) cube([1.5, 6, 1.5]);
            translate([szerokosc_dolu/2 - grubosc_scianki - 0.5, y, 1.5]) cube([1.5, 6, 1.5]);
        }

        // F. Szyna RIS (Standard Picatinny 21.2mm, kąt 45 stopni)
        translate([0, -1, wysokosc_pudelka + ris_h]) rotate([-90, 0, 0]) linear_extrude(height = dlugosc + 2) polygon(points=[
            [-7.9, -0.1], [7.9, -0.1],
            [10.7, 2.7],
            [10.7, 3.3],
            [7.9, 6.1],
            [-7.9, 6.1],
            [-10.7, 3.3],
            [-10.7, 2.7]
        ]);
        translate([-20, 15, wysokosc_pudelka + ris_h/2 - 0.5]) rotate([0, 90, 0]) cylinder(d=4.2, h=40);
    }
}

// Reszta komponentów (Tulejka i Wieczko) pozostaje bez zmian
module tulejka_v13() { translate([szerokosc_dolu/2 + 15, 25, 0]) difference() { union() { cylinder(d=dia_wkladki, h=dlugosc_wkladki); translate([0,0,0]) cylinder(d1=7, d2=dia_wkladki+1, h=4); translate([-2, -dia_wkladki/2 - 3, 18]) cube([4, 4, 5]); translate([dia_wkladki/2 - 1, -2, 18]) cube([4, 5, 4]); } translate([0,0,-1]) cylinder(d=dia_lasera, h=dlugosc_wkladki + 5); translate([0, -10, 20.5]) rotate([-90,0,0]) cylinder(d=2.8, h=20); translate([0, 0, 20.5]) rotate([0,90,0]) cylinder(d=2.8, h=20); } }
module wieczko_v13() { w_sz = szerokosc_dolu - 2*grubosc_scianki - 0.4; w_dl = dlugosc - 35 - grubosc_scianki - 0.4; translate([-w_sz/2, -w_dl - 10, 0]) union() { cube([w_sz, w_dl, 2]); for(y = [4, w_dl - 10]) { translate([0, y, 2]) { cube([1.2, 6, 3]); translate([-0.8, 0, 1.5]) cube([1.2, 6, 1]); } translate([w_sz - 1.2, y, 2]) { cube([1.2, 6, 3]); translate([0.8, 0, 1.5]) cube([1.2, 6, 1]); } } } }

obudowa_v13_2();
tulejka_v13();
wieczko_v13();