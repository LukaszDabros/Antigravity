// =========================================================================
// Wielkoformatowy Zegar Cyfrowy LED - Szablon Frezarski Dużej Cyfry (110x200 mm)
// =========================================================================
// Szablon dopasowany do mniejszego wariantu 110x200 mm (pod 3 diody LED / 5.0 cm na segment).
// Zoptymalizowany pod kątem druku na Ender 3 (szerokość zewnętrzna 210 mm).
// Offset wbudowany = (17 - 8) / 2 = 4.5 mm na stronę.
// =========================================================================

/* [Parametry Narzędzia] */
guide_bush_d = 17; // Średnica pierścienia kopiującego (mm)
cutter_d = 8;      // Średnica frezu palcowego (mm)
tool_offset = (guide_bush_d - cutter_d) / 2; // Offset (4.5 mm)

/* [Wymiary Cyfry] */
digit_w = 110;      // Szerokość cyfry na froncie (mm) (było 150)
digit_h = 200;      // Wysokość cyfry na froncie (mm) (było 270)
seg_thickness = 25; // Szerokość segmentu na froncie (mm) (było 32)

/* [Wymiary Szablonu] */
margin = 50;        // Margines zewnętrzny wokół cyfry (mm) (zwiększony, aby zachować sztywność ramy)
thickness = 8;      // Grubość szablonu (mm)

// Obliczenie wymiarów otworów pilotujących w MDF (szerokość slotu w MDF = 11mm, długość = 50mm pod 3 diody)
pilot_w = seg_thickness - 14; // 11 mm
pilot_l = 50;                 // Długość (50 mm - odpowiada 3 diodom LED)

// Wymiary otworów roboczych w szablonie (pod pierścień kopiujący)
slot_w = pilot_w + 2 * tool_offset; // 11 + 9 = 20 mm
slot_l = pilot_l + 2 * tool_offset; // 50 + 9 = 59 mm

// Rozmiar płyty szablonu (Szerokość zewnętrzna wynosi 110 + 100 = 210 mm, idealnie mieści się na stole Ender 3)
outer_w = digit_w + 2 * margin; // 210 mm
outer_h = digit_h + 2 * margin; // 300 mm (długość podzielisz na pół lub wydrukujesz pod kątem)

// Wymiary nacięć celowniczych
cross_depth = 1.0;   // Głębokość linii centrujących (mm)
cross_width = 1.2;   // Szerokość linii (mm)

module segment_slot(horizontal = true) {
    w = slot_w;
    l = slot_l;
    if (horizontal) {
        linear_extrude(height = thickness + 2, center = true) {
            polygon(points = [
                [-l/2, 0],
                [-l/2 + w/2, w/2],
                [l/2 - w/2, w/2],
                [l/2, 0],
                [l/2 - w/2, -w/2],
                [-l/2 + w/2, -w/2]
            ]);
        }
    } else {
        linear_extrude(height = thickness + 2, center = true) {
            polygon(points = [
                [0, -l/2],
                [-w/2, -l/2 + w/2],
                [-w/2, l/2 - w/2],
                [0, l/2],
                [w/2, l/2 - w/2],
                [w/2, -l/2 + w/2]
            ]);
        }
    }
}

module template() {
    difference() {
        // Płyta główna szablonu
        cube([outer_w, outer_h, thickness], center = true);
        
        // --- 7 SEGMENTÓW CYFRY (NOWE PRZESUNIĘCIA DLA 110x200mm) ---
        // A (Środkowy)
        translate([0, 0, 0]) segment_slot(true);
        // C (Górny)
        translate([0, 92, 0]) segment_slot(true);
        // F (Dolny)
        translate([0, -92, 0]) segment_slot(true);
        
        // B (Górny lewy)
        translate([-46, 46, 0]) segment_slot(false);
        // D (Górny prawy)
        translate([46, 46, 0]) segment_slot(false);
        
        // G (Dolny lewy)
        translate([-46, -46, 0]) segment_slot(false);
        // E (Dolny prawy)
        translate([46, -46, 0]) segment_slot(false);
        
        // --- LINIE CENTRUJĄCE (KRZYŻE POMOCNICZE) ---
        // Wycięte z góry i z dołu dla łatwego ustawiania pionowego i poziomego
        // Linia pionowa (oś Y)
        translate([0, 0, thickness/2 - cross_depth/2])
            cube([cross_width, outer_h + 1, cross_depth + 0.1], center = true);
        translate([0, 0, -thickness/2 + cross_depth/2])
            cube([cross_width, outer_h + 1, cross_depth + 0.1], center = true);
            
        // Linia pozioma (oś X)
        translate([0, 0, thickness/2 - cross_depth/2])
            cube([outer_w + 1, cross_width, cross_depth + 0.1], center = true);
        translate([0, 0, -thickness/2 + cross_depth/2])
            cube([outer_w + 1, cross_width, cross_depth + 0.1], center = true);

        // --- NAPIS ID ---
        translate([0, 115, thickness/2 - 0.5])
            linear_extrude(1.0)
                text("DUZA CYFRA 110x200mm", size=10, halign="center", valign="center");
    }
}

template();
