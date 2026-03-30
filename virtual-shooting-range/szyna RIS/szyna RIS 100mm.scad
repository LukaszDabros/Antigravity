// ==========================================
// SZYN AM-LOK TYPU MAGPUL (MAG592) - V15 FINAL
// MODYFIKACJA: PŁASKI SPÓD (BEZ WYPUSTEK)
// ==========================================

$fn = 100;

dlugosc = 103; 
szer_dol = 21.2; 
szer_gora = 15.6; 
wys_calkowita = 9.5;
wys_pionowa = 5.0; 

module szyna_v15_flat() {
    difference() {
        // --- 1. KORPUS GŁÓWNY (GŁADKI SPÓD) ---
        union() {
            // Główny "kadłub" szyny z zaokrąglonymi rogami
            hull() {
                // Zaokrąglenie TYŁ
                translate([0, 6, 0]) cylinder(d=szer_dol, h=wys_pionowa);
                // Środek i przód
                translate([0, dlugosc-6, 0]) cylinder(d=szer_dol, h=wys_pionowa);
                
                // Część górna (trapez)
                translate([0, 8, wys_calkowita-0.5]) cylinder(d=szer_gora, h=0.5);
                translate([0, dlugosc-8, wys_calkowita-0.5]) cylinder(d=szer_gora, h=0.5);
            }
        }

        // --- 2. 9 REGULARNYCH SLOTÓW (BRAMEK) ---
        for (i = [0 : 8]) {
            translate([-15, 11.75 + i*10 - 2.6, wys_calkowita - 3]) 
                cube([30, 5.2, 5]);
        }

        // --- 3. TRZY OTWORY MONTAŻOWE (M5) ---
        for (y_pos = [11.5, 51.5, 91.5]) {
            // Przelot na śrubę
            translate([0, y_pos, -5]) cylinder(d=5.5, h=20);
            
            // Gniazdo na łeb śruby (Counterbore)
            // Średnica 10.4mm pasuje do większości śrub M-LOK
            translate([0, y_pos, 3.5]) cylinder(d=10.4, h=10);
        }
    }
}

// WYWOŁANIE
szyna_v15_flat();