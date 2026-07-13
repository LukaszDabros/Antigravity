// =========================================================================
// Wielkoformatowy Zegar LED - Przeprojektowana Obudowa Sterownika z Wkładem TPU
// =========================================================================
// Model parametryczny 3D (OpenSCAD) składający się z 3 części:
// 1. Sztywnej obudowy dolnej (Base) z uszami montażowymi do MDF.
// 2. Elastycznego wkładu organizera (TPU Insert) z dedykowanymi kieszeniami
//    na WeMosa, przekaźnik, RTC DS3231, kondensator, buzzer i czujnik temp.
//    Wkład posiada nóżki unoszące moduły i rynienki na kable pod nimi.
// 3. Wentylowanej pokrywy (Cover) przykręcanej w 4 rogach śrubami M3.
// =========================================================================

/* [Wymiary Pudełka Wewnętrzne] */
box_w = 85;         // Szerokość wewnętrzna pudełka (mm)
box_l = 95;         // Długość wewnętrzna pudełka (mm)
box_h = 35;         // Wysokość wewnętrzna pudełka (mm)
wall_t = 2.0;       // Grubość ścianek (mm)

/* [Śruby i Tolerancje] */
lid_screw_d = 2.8;  // Średnica otworu pilotującego pod śrubę M3 w bazie (mm)
lid_through_d = 3.4;// Średnica otworu przelotowego w pokrywie pod śrubę M3 (mm)
tol = 0.4;          // Tolerancja pasowania (luz) dla części drukowanych (mm)

/* [Wypusty Kablowe] */
cable_gland_w = 12; // Szerokość wycięć na przepusty kablowe (mm)
cable_gland_h = 8;  // Wysokość wycięć na przepusty kablowe (mm)

$fn = 32;

// Funkcja pomocnicza: zaokrąglony prostopadłościan
module rounded_cube(x, y, z, r) {
    translate([r, r, 0])
    minkowski() {
        cube([x - 2*r, y - 2*r, z - 1]);
        cylinder(r = r, h = 1);
    }
}

// 1. DOLNA CZĘŚĆ OBUDOWY (BASE - Druk z PLA/PETG)
module box_base() {
    difference() {
        // Zewnętrzny korpus
        rounded_cube(box_w + 2*wall_t, box_l + 2*wall_t, box_h + wall_t, 4);
        
        // Wewnętrzne wybranie
        translate([wall_t, wall_t, wall_t])
            rounded_cube(box_w, box_l, box_h + 5, 2);
            
        // Przepust kablowy 1 (Wejście zasilania z boku)
        translate([box_w/2 + wall_t - cable_gland_w/2, -1, box_h - cable_gland_h + wall_t])
            cube([cable_gland_w, wall_t + 2, cable_gland_h + 2]);
            
        // Przepust kablowy 2 (Wyjście LED po przeciwnej stronie)
        translate([box_w/2 + wall_t - cable_gland_w/2, box_l + wall_t - 1, box_h - cable_gland_h + wall_t])
            cube([cable_gland_w, wall_t + 2, cable_gland_h + 2]);

        // Otwory w narożnych słupkach na śruby M3 pokrywy
        translate([wall_t + 5, wall_t + 5, wall_t]) cylinder(d = lid_screw_d, h = box_h + 2);
        translate([wall_t + box_w - 5, wall_t + 5, wall_t]) cylinder(d = lid_screw_d, h = box_h + 2);
        translate([wall_t + 5, wall_t + box_l - 5, wall_t]) cylinder(d = lid_screw_d, h = box_h + 2);
        translate([wall_t + box_w - 5, wall_t + box_l - 5, wall_t]) cylinder(d = lid_screw_d, h = box_h + 2);
    }
    
    // Narożne słupki pod śruby wieczka (wewnętrzne)
    intersection() {
        translate([wall_t, wall_t, wall_t]) rounded_cube(box_w, box_l, box_h, 2);
        union() {
            translate([wall_t, wall_t, wall_t]) cylinder(r = 8, h = box_h);
            translate([wall_t + box_w, wall_t, wall_t]) cylinder(r = 8, h = box_h);
            translate([wall_t, wall_t + box_l, wall_t]) cylinder(r = 8, h = box_h);
            translate([wall_t + box_w, wall_t + box_l, wall_t]) cylinder(r = 8, h = box_h);
        }
    }
    
    // Zewnętrzne uszy montażowe (do przykręcenia obudowy wkrętami do płyty MDF zegara)
    difference() {
        union() {
            translate([-12, box_l/2 - 10, 0]) cube([12, 20, 3]);
            translate([box_w + 2*wall_t, box_l/2 - 10, 0]) cube([12, 20, 3]);
        }
        translate([-6, box_l/2, -1]) cylinder(d = 4.2, h = 5);
        translate([box_w + 2*wall_t + 6, box_l/2, -1]) cylinder(d = 4.2, h = 5);
    }
}

// 2. ELASTYCZNY WKŁAD ORGANIZERA (TPU INSERT - Druk z elastycznego gumowego TPU)
// Wkład wchodzi ciasno na dno pudełka. Zabezpiecza elementy przed wstrząsami i ruchem.
module tpu_insert() {
    // Odsuwamy wkład w wizualizacji na bok
    translate([0, box_l + 30, 0]) {
        difference() {
            // Zewnętrzny obrys wkładu (pomniejszony o tolerancję luzu, aby wszedł do pudełka)
            rounded_cube(box_w - tol, box_l - tol, 12, 2);
            
            // A. Kieszeń na WeMos D1 Mini (szer: 26.0 mm, dł: 34.5 mm, głębokość kieszeni: 8 mm)
            translate([5, 5, 3])
                cube([26.0, 34.5, 10]);
                
            // B. Kieszeń na Przekaźnik 1-kanałowy (szer: 26.5 mm, dł: 50.5 mm, głębokość: 8 mm)
            translate([36, 5, 3])
                cube([26.5, 50.5, 10]);
                
            // C. Kieszeń na Zegar RTC DS3231 (szer: 38.5 mm, dł: 22.5 mm, głębokość: 8 mm)
            translate([5, 45, 3])
                cube([38.5, 22.5, 10]);
                
            // D. Okrągłe gniazdo na Buzzer Piezo (średnica: 12.5 mm, głębokość: 8 mm)
            translate([11, 78, 3])
                cylinder(d = 12.5, h = 10);
                
            // E. Kieszeń na Kondensator 1000uF (szer: 11 mm, dł: 21 mm, głębokość: 8 mm)
            translate([25, 73, 3])
                cube([11, 21, 10]);
                
            // F. Kieszeń na czujnik DS18B20 (szer: 16 mm, dł: 21 mm, głębokość: 8 mm)
            translate([44, 63, 3])
                cube([16, 21, 10]);

            // GANAŁY KABLOWE NA DNIE WKŁADU (nacięcia o głębokości 3 mm na ułożenie kabli pod elementami)
            // Kanał główny wzdłuż osi Y
            translate([31.5, 2, 0]) cube([4, box_l - 6, 3.5]);
            // Kanały poprzeczne łączące kieszenie
            translate([2, 20, 0]) cube([box_w - 6, 4, 3.5]);
            translate([2, 55, 0]) cube([box_w - 6, 4, 3.5]);
            
            // Wycięcia na narożne słupki śrubowe bazy
            translate([0, 0, -0.5]) cylinder(r = 8.5, h = 14);
            translate([box_w - tol, 0, -0.5]) cylinder(r = 8.5, h = 14);
            translate([0, box_l - tol, -0.5]) cylinder(r = 8.5, h = 14);
            translate([box_w - tol, box_l - tol, -0.5]) cylinder(r = 8.5, h = 14);
        }
    }
}

// 3. POKRYWA OBUDOWY (COVER - Druk z PLA/PETG)
module box_cover() {
    // Odsuwamy pokrywę w wizualizacji
    translate([box_w + 30, 0, 0]) {
        difference() {
            // Zewnętrzny obrys pokrywy z kołnierzem pozycjonującym
            union() {
                // Płaska góra pokrywy
                rounded_cube(box_w + 2*wall_t, box_l + 2*wall_t, wall_t, 4);
                
                // Wewnętrzny kołnierz pozycjonujący z luzem 0.4 mm na stronę
                difference() {
                    translate([wall_t + 0.4, wall_t + 0.4, wall_t])
                        rounded_cube(box_w - 0.8, box_l - 0.8, 3, 2);
                    
                    // Wycięcia w kołnierzu omijające narożne słupki śrub bazy
                    translate([wall_t, wall_t, wall_t - 0.5]) cylinder(r = 9.0, h = 4);
                    translate([wall_t + box_w, wall_t, wall_t - 0.5]) cylinder(r = 9.0, h = 4);
                    translate([wall_t, wall_t + box_l, wall_t - 0.5]) cylinder(r = 9.0, h = 4);
                    translate([wall_t + box_w, wall_t + box_l, wall_t - 0.5]) cylinder(r = 9.0, h = 4);
                }
            }
            
            // Wycięcie środka kołnierza pokrywy (redukcja masy)
            translate([wall_t + 2, wall_t + 2, wall_t])
                rounded_cube(box_w - 4, box_l - 4, 4, 2);
                
            // Otwory wentylacyjne na pokrywie (żebrowanie chłodzące ESP)
            for (i = [22 : 8 : box_l - 22]) {
                translate([wall_t + 12, wall_t + i, -1])
                    cube([box_w - 24, 2.5, wall_t + 2]);
            }
            
            // Otwory przelotowe na śruby M3 wieczka
            translate([wall_t + 5, wall_t + 5, -1]) cylinder(d = lid_through_d, h = wall_t + 5);
            translate([wall_t + box_w - 5, wall_t + 5, -1]) cylinder(d = lid_through_d, h = wall_t + 5);
            translate([wall_t + 5, wall_t + box_l - 5, -1]) cylinder(d = lid_through_d, h = wall_t + 5);
            translate([wall_t + box_w - 5, wall_t + box_l - 5, -1]) cylinder(d = lid_through_d, h = wall_t + 5);
        }
        
        // Dodatkowe słupki dociskowe wewnątrz pokrywy (dociskają wkład TPU i moduły po zamknięciu)
        translate([wall_t + 15, wall_t + 20, wall_t]) cylinder(d = 4, h = 4);
        translate([wall_t + box_w - 15, wall_t + 20, wall_t]) cylinder(d = 4, h = 4);
        translate([wall_t + 15, wall_t + box_l - 20, wall_t]) cylinder(d = 4, h = 4);
        translate([wall_t + box_w - 15, wall_t + box_l - 20, wall_t]) cylinder(d = 4, h = 4);
    }
}

// Uruchomienie generowania części w wizualizacji OpenSCAD
box_base();
tpu_insert();
box_cover();
