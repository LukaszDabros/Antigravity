// =========================================================================
// Wielkoformatowy Zegar Cyfrowy LED - Szablon Frezarski Dużej Cyfry (150x270 mm)
// =========================================================================
// Kompletny szablon do frezowania wszystkich 7 segmentów dużej cyfry w MDF 18mm
// przy użyciu pierścienia kopiującego (Ø 17 mm) oraz frezu palcowego (Ø 8 mm).
// Offset wbudowany = (17 - 8) / 2 = 4.5 mm na stronę.
// =========================================================================

/* [Parametry Narzędzia] */
guide_bush_d = 17; // Średnica pierścienia kopiującego (mm)
cutter_d = 8;      // Średnica frezu palcowego (mm)
tool_offset = (guide_bush_d - cutter_d) / 2; // Offset (4.5 mm)

/* [Wymiary Cyfry] */
digit_w = 150;      // Szerokość cyfry na froncie (mm)
digit_h = 270;      // Wysokość cyfry na froncie (mm)
seg_thickness = 32; // Zwiększona szerokość segmentu na froncie (mm) (było 30)

/* [Wymiary Szablonu] */
margin = 40;        // Margines zewnętrzny wokół cyfry (mm)
thickness = 8;      // Grubość szablonu (mm)

// Obliczenie wymiarów otworów pilotujących w MDF (szerokość slotu w MDF = 14mm, długość = 68mm)
pilot_w = seg_thickness - 18; // 14 mm
pilot_l = 68;                 // Skrócona długość (było 72 mm)

// Wymiary otworów roboczych w szablonie (pod pierścień kopiujący)
slot_w = pilot_w + 2 * tool_offset; // 14 + 9 = 23 mm
slot_l = pilot_l + 2 * tool_offset; // 68 + 9 = 77 mm

// Rozmiar płyty szablonu
outer_w = digit_w + 2 * margin; // 150 + 80 = 230 mm
outer_h = digit_h + 2 * margin; // 270 + 80 = 350 mm

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
        
        // --- 7 SEGMENTÓW CYFRY ---
        // A (Górny)
        translate([0, 124, 0]) segment_slot(true);
        // G (Środkowy)
        translate([0, 0, 0]) segment_slot(true);
        // D (Dolny)
        translate([0, -124, 0]) segment_slot(true);
        
        // F (Górny lewy)
        translate([-62, 62, 0]) segment_slot(false);
        // B (Górny prawy)
        translate([62, 62, 0]) segment_slot(false);
        
        // E (Dolny lewy)
        translate([-62, -62, 0]) segment_slot(false);
        // C (Dolny prawy)
        translate([62, -62, 0]) segment_slot(false);
        
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
        translate([0, 150, thickness/2 - 0.5])
            linear_extrude(1.0)
                text("DUZA CYFRA 150x270mm", size=10, halign="center", valign="center");
    }
}

template();
