// ==========================================
// SYSTEM TRENINGOWY LASER V13.3 - PRZEŁĄCZNIK BISTABILNY 7x7
// ==========================================

$fn = 100; 
dlugosc = 70; szerokosc_dolu = 36; wysokosc_pudelka = 26;
grubosc_scianki = 2.5;

module obudowa_v13_3() {
    difference() {
        // Główna bryła (identyczna jak V13.2)
        union() {
            translate([-szerokosc_dolu/2, 0, 0]) cube([szerokosc_dolu, dlugosc, wysokosc_pudelka - 5]);
            hull() {
                translate([-szerokosc_dolu/2, 0, wysokosc_pudelka - 5.1]) cube([szerokosc_dolu, dlugosc, 0.1]);
                translate([-28/2, 0, wysokosc_pudelka + 2]) cube([28, dlugosc, 0.1]);
            }
            translate([-30/2, 0, wysokosc_pudelka]) cube([30, dlugosc, 10]);
        }

        // Wycięcia standardowe (kanał lasera, regulacja, komora)
        translate([0, -1, 12]) rotate([-90, 0, 0]) cylinder(d1=7, d2=11, h=4);
        translate([0, 3, 12]) rotate([-90, 0, 0]) cylinder(d=16, h=35); 
        translate([0, 22, -1]) cylinder(d=3.2, h=15); 
        translate([szerokosc_dolu/2 - 5, 22, 12]) rotate([0, 90, 0]) cylinder(d=3.2, h=10);
        translate([-szerokosc_dolu/2 + grubosc_scianki, 35, -1])
            cube([szerokosc_dolu - 2*grubosc_scianki, dlugosc - 35 - grubosc_scianki, wysokosc_pudelka - 5]);

        // NOWY OTWÓR NA PRZEŁĄCZNIK 7x7 (BOK)
        // Otwór 7.5x7.5mm na wylot
        translate([szerokosc_dolu/2 - 5, 45, 8]) 
            cube([10, 7.5, 7.5]); 

        // Zatrzaski wieczka
        for(y = [40, dlugosc - 10]) {
            translate([-szerokosc_dolu/2 + grubosc_scianki - 1, y, 1.5]) cube([1.5, 6, 1.5]);
            translate([szerokosc_dolu/2 - grubosc_scianki - 0.5, y, 1.5]) cube([1.5, 6, 1.5]);
        }
        // Szyna RIS (Standard Picatinny 21.2mm, kąt 45 stopni)
        translate([0, -1, wysokosc_pudelka + 10]) rotate([-90, 0, 0]) linear_extrude(height = dlugosc + 2) polygon(points=[
            [-7.9, -0.1], [7.9, -0.1],                   // Początek szyjki (15.8mm)
            [10.7, 2.7],                                 // Skos 45 stopni do 21.4mm
            [10.7, 3.3],                                 // Mały płaski odcinek (szczyt)
            [7.9, 6.1],                                  // Powrót 45 stopni
            [-7.9, 6.1],                                 // Góra domknięcia
            [-10.7, 3.3],                                // Lewy szczyt
            [-10.7, 2.7]                                 // Lewy skos
        ]);
        translate([-20, 15, wysokosc_pudelka + 4.5]) rotate([0, 90, 0]) cylinder(d=4.2, h=40);
    }
}
// Wywołanie pozostałych modułów (tulejka i wieczko bez zmian)
obudowa_v13_3();