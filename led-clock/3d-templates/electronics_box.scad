// =========================================================================
// Wielkoformatowy Zegar LED - Obudowa na Elektronikę Sterującą (ESP32 / ESP8266)
// =========================================================================
// Model parametryczny 3D (OpenSCAD) obudowy chroniącej moduł mikrokontrolera,
// kondensator filtrujący 1000uF oraz rezystory ochronne 330 Ohm.
// Zasilacz montowany jest poza obudową, aby uniknąć zakłóceń elektromagnetycznych.
// =========================================================================

/* [Wymiary Wewnętrzne] */
box_w = 70;         // Szerokość wewnętrzna obudowy (mm)
box_l = 85;         // Długość wewnętrzna obudowy (mm)
box_h = 30;         // Wysokość wewnętrzna obudowy (mm)
wall_t = 2.0;       // Grubość ścianek obudowy (mm)

/* [Otwory i Wentylacja] */
cable_gland_d = 8;  // Średnica otworów na przepusty kablowe (zasilanie i dane LED)
vent_w = 2.5;       // Szerokość szczelin wentylacyjnych (mm)

/* [Słupki Montażowe PCB] */
pcb_screw_d = 2.5;  // Średnica otworu pod wkręt montażowy PCB (mm)
pillar_h = 5;       // Wysokość słupka montażowego PCB (mm)
pillar_d = 6;       // Zewnętrzna średnica słupka (mm)

$fn = 32;

module rounded_cube(x, y, z, r) {
    translate([r, r, 0])
    minkowski() {
        cube([x - 2*r, y - 2*r, z - 1]);
        cylinder(r = r, h = 1);
    }
}

// 1. DOLNA CZĘŚĆ OBUDOWY (BASE)
module box_base() {
    difference() {
        // Zewnętrzna bryła obudowy z zaokrąglonymi narożnikami
        rounded_cube(box_w + 2*wall_t, box_l + 2*wall_t, box_h + wall_t, 4);
        
        // Wycięcie przestrzeni wewnętrznej
        translate([wall_t, wall_t, wall_t])
            rounded_cube(box_w, box_l, box_h + 5, 2);
            
        // Przepust kablowy 1 (Zasilanie 5V wejściowe z zasilacza zewnętrznego)
        translate([box_w/2 + wall_t, -1, box_h/2 + wall_t])
            rotate([-90, 0, 0])
                cylinder(d = cable_gland_d, h = wall_t + 2);
                
        // Przepust kablowy 2 (Wyjście zasilania i danych LED: Góra + Dół)
        translate([box_w/2 + wall_t, box_l + wall_t - 1, box_h/2 + wall_t])
            rotate([-90, 0, 0])
                cylinder(d = cable_gland_d + 2, h = wall_t + 2);

        // Otwory na wkręty montażowe do ściany/obudowy zegara (w uszach montażowych)
        // Dwa uszy montażowe po bokach
    }
    
    // Dodanie zewnętrznych uszu montażowych do przykręcenia obudowy do pleców zegara
    difference() {
        union() {
            translate([-12, box_l/2 - 10, 0])
                cube([12, 20, 3]);
            translate([box_w + 2*wall_t, box_l/2 - 10, 0])
                cube([12, 20, 3]);
        }
        // Otwory w uszach montażowych
        translate([-6, box_l/2, -1])
            cylinder(d = 4.2, h = 5);
        translate([box_w + 2*wall_t + 6, box_l/2, -1])
            cylinder(d = 4.2, h = 5);
    }
    
    // Słupki montażowe dla uniwersalnej płytki PCB (rozstaw dopasowany do standardowych płytek prototypowych 50x70mm)
    // Lewy-dół
    translate([wall_t + 10, wall_t + 10, wall_t]) pcb_pillar();
    // Prawy-dół
    translate([wall_t + box_w - 10, wall_t + 10, wall_t]) pcb_pillar();
    // Lewy-góra
    translate([wall_t + 10, wall_t + box_l - 10, wall_t]) pcb_pillar();
    // Prawy-góra
    translate([wall_t + box_w - 10, wall_t + box_l - 10, wall_t]) pcb_pillar();
    
    // Podpórki na kondensator filtrujący (1000uF leżący poziomo na dnie)
    translate([wall_t + box_w/2 - 10, wall_t + 30, wall_t])
        cube([20, 4, 3]);
    translate([wall_t + box_w/2 - 10, wall_t + 45, wall_t])
        cube([20, 4, 3]);
}

module pcb_pillar() {
    difference() {
        cylinder(d = pillar_d, h = pillar_h);
        translate([0, 0, -0.5])
            cylinder(d = pcb_screw_d, h = pillar_h + 1);
    }
}

// 2. POKRYWA OBUDOWY (COVER)
module box_cover() {
    // Odsuwamy pokrywę w wizualizacji, aby nie nachodziła bezpośrednio na spód
    translate([box_w + 30, 0, 0]) {
        difference() {
            // Zewnętrzny obrys pokrywy z kołnierzem
            union() {
                rounded_cube(box_w + 2*wall_t, box_l + 2*wall_t, wall_t, 4);
                // Wewnętrzny kołnierz pozycjonujący wchodzący do pudełka
                translate([wall_t + 0.2, wall_t + 0.2, wall_t])
                    rounded_cube(box_w - 0.4, box_l - 0.4, 3, 2);
            }
            
            // Wycięcie środka kołnierza pokrywy (oszczędność materiału)
            translate([wall_t + 2, wall_t + 2, wall_t])
                rounded_cube(box_w - 4, box_l - 4, 4, 2);
                
            // Otwory wentylacyjne na pokrywie (żebrowanie)
            for (i = [15 : 8 : box_l - 15]) {
                translate([wall_t + 10, wall_t + i, -1])
                    cube([box_w - 20, vent_w, wall_t + 2]);
            }
        }
    }
}

// Uruchomienie generowania obu części
box_base();
box_cover();
