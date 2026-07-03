// =========================================================================
// Wielkoformatowy Zegar LED - Obudowa na Elektronikę Sterującą (ESP32 / ESP8266)
// =========================================================================
// Model parametryczny 3D (OpenSCAD) obudowy chroniącej moduł mikrokontrolera,
// kondensator filtrujący 1000uF oraz rezystory ochronne 330 Ohm.
// Zasilacz montowany jest poza obudową, aby uniknąć zakłóceń elektromagnetycznych.
// Pokrywa jest przykręcana w 4 rogach śrubami M3 (średnica otworu 3.2 mm).
// =========================================================================

/* [Wymiary Wewnętrzne] */
box_w = 75;         // Zwiększona szerokość wewnętrzna, aby pomieścić narożne słupki śrub (mm)
box_l = 90;         // Zwiększona długość wewnętrzna (mm)
box_h = 30;         // Wysokość wewnętrzna obudowy (mm)
wall_t = 2.0;       // Grubość ścianek obudowy (mm)

/* [Otwory i Wentylacja] */
cable_gland_d = 8;  // Średnica otworów na przepusty kablowe
vent_w = 2.5;       // Szerokość szczelin wentylacyjnych (mm)

/* [Słupki Montażowe PCB] */
pcb_screw_d = 2.5;  // Średnica otworu pod wkręt montażowy PCB (mm)
pillar_h = 5;       // Wysokość słupka montażowego PCB (mm)
pillar_d = 6;       // Zewnętrzna średnica słupka (mm)

/* [Śruby pokrywy] */
lid_screw_d = 2.8;  // Średnica otworu pilotującego pod śrubę M3 w bazie (mm)
lid_through_d = 3.4;// Średnica otworu przelotowego w pokrywie pod śrubę M3 (mm)

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
            
        // Przepust kablowy 1 (Zasilanie 5V)
        translate([box_w/2 + wall_t, -1, box_h/2 + wall_t])
            rotate([-90, 0, 0])
                cylinder(d = cable_gland_d, h = wall_t + 2);
                
        // Przepust kablowy 2 (Wyjście LED)
        translate([box_w/2 + wall_t, box_l + wall_t - 1, box_h/2 + wall_t])
            rotate([-90, 0, 0])
                cylinder(d = cable_gland_d + 2, h = wall_t + 2);

        // Otwory w słupkach narożnych na śruby pokrywy (M3)
        translate([wall_t + 5, wall_t + 5, wall_t]) cylinder(d = lid_screw_d, h = box_h + 2);
        translate([wall_t + box_w - 5, wall_t + 5, wall_t]) cylinder(d = lid_screw_d, h = box_h + 2);
        translate([wall_t + 5, wall_t + box_l - 5, wall_t]) cylinder(d = lid_screw_d, h = box_h + 2);
        translate([wall_t + box_w - 5, wall_t + box_l - 5, wall_t]) cylinder(d = lid_screw_d, h = box_h + 2);
    }
    
    // Dodanie słupków narożnych pod gwint/śruby pokrywy (wewnętrzne wzmocnienia w narożnikach)
    intersection() {
        translate([wall_t, wall_t, wall_t]) rounded_cube(box_w, box_l, box_h, 2);
        union() {
            translate([wall_t, wall_t, wall_t]) cylinder(r = 8, h = box_h);
            translate([wall_t + box_w, wall_t, wall_t]) cylinder(r = 8, h = box_h);
            translate([wall_t, wall_t + box_l, wall_t]) cylinder(r = 8, h = box_h);
            translate([wall_t + box_w, wall_t + box_l, wall_t]) cylinder(r = 8, h = box_h);
        }
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
    // Przesunięte lekko do środka, aby nie kolidować ze śrubami wieczka
    translate([wall_t + 12.5, wall_t + 10, wall_t]) pcb_pillar();
    translate([wall_t + box_w - 12.5, wall_t + 10, wall_t]) pcb_pillar();
    translate([wall_t + 12.5, wall_t + box_l - 10, wall_t]) pcb_pillar();
    translate([wall_t + box_w - 12.5, wall_t + box_l - 10, wall_t]) pcb_pillar();
    
    // Podpórki na kondensator filtrujący
    translate([wall_t + box_w/2 - 10, wall_t + 32, wall_t])
        cube([20, 4, 3]);
    translate([wall_t + box_w/2 - 10, wall_t + 48, wall_t])
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
    // Odsuwamy pokrywę w wizualizacji
    translate([box_w + 30, 0, 0]) {
        difference() {
            // Zewnętrzny obrys pokrywy z kołnierzem
            union() {
                rounded_cube(box_w + 2*wall_t, box_l + 2*wall_t, wall_t, 4);
                // Wewnętrzny kołnierz pozycjonujący wchodzący do pudełka
                translate([wall_t + 0.2, wall_t + 0.2, wall_t])
                    rounded_cube(box_w - 0.4, box_l - 0.4, 3, 2);
            }
            
            // Wycięcie środka kołnierza pokrywy
            translate([wall_t + 2, wall_t + 2, wall_t])
                rounded_cube(box_w - 4, box_l - 4, 4, 2);
                
            // Otwory wentylacyjne na pokrywie (żebrowanie)
            for (i = [22 : 8 : box_l - 22]) {
                translate([wall_t + 12, wall_t + i, -1])
                    cube([box_w - 24, vent_w, wall_t + 2]);
            }
            
            // Otwory przelotowe na śruby mocujące wieczko do bazy (M3)
            translate([wall_t + 5, wall_t + 5, -1]) cylinder(d = lid_through_d, h = wall_t + 5);
            translate([wall_t + box_w - 5, wall_t + 5, -1]) cylinder(d = lid_through_d, h = wall_t + 5);
            translate([wall_t + 5, wall_t + box_l - 5, -1]) cylinder(d = lid_through_d, h = wall_t + 5);
            translate([wall_t + box_w - 5, wall_t + box_l - 5, -1]) cylinder(d = lid_through_d, h = wall_t + 5);
        }
    }
}

// Uruchomienie generowania obu części
box_base();
box_cover();
