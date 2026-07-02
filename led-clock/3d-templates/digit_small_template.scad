// =========================================================================
// Wielkoformatowy Zegar Cyfrowy LED - Szablon Frezarski Małej Cyfry (100x180 mm)
// =========================================================================
// Kompletny szablon do frezowania wszystkich 7 segmentów małej cyfry w MDF 18mm
// przy użyciu pierścienia kopiującego (Ø 17 mm) oraz frezu palcowego (Ø 8 mm).
// Offset wbudowany = (17 - 8) / 2 = 4.5 mm na stronę.
// =========================================================================

/* [Parametry Narzędzia] */
guide_bush_d = 17; // Średnica pierścienia kopiującego (mm)
cutter_d = 8;      // Średnica frezu palcowego (mm)
tool_offset = (guide_bush_d - cutter_d) / 2; // Offset (4.5 mm)

/* [Wymiary Cyfry] */
digit_w = 100;      // Szerokość cyfry na froncie (mm)
digit_h = 180;      // Wysokość cyfry na froncie (mm)
seg_thickness = 26; // Grubość segmentu na froncie (mm)

/* [Wymiary Szablonu] */
margin = 40;        // Margines zewnętrzny wokół cyfry (mm)
thickness = 8;      // Grubość szablonu (mm)

// Obliczenie wymiarów otworów pilotujących w MDF (szerokość slotu w MDF = 8mm)
pilot_w = seg_thickness - 18; // 8 mm
pilot_l_h = 34; // Wydłużona długość dla segmentów poziomych A, G, D (mm) (było 30)
pilot_l_v = 37; // Wydłużona długość dla segmentów pionowych F, B, E, C (mm) (było 33)

// Wymiary otworów roboczych w szablonie (pod pierścień kopiujący)
slot_w = pilot_w + 2 * tool_offset; // 8 + 9 = 17 mm
slot_l_h = pilot_l_h + 2 * tool_offset; // 30 + 9 = 39 mm
slot_l_v = pilot_l_v + 2 * tool_offset; // 33 + 9 = 42 mm

// Rozmiar płyty szablonu
outer_w = digit_w + 2 * margin; // 100 + 80 = 180 mm
outer_h = digit_h + 2 * margin; // 180 + 80 = 260 mm

// Wymiary nacięć celowniczych
cross_depth = 1.0;   // Głębokość linii centrujących (mm)
cross_width = 1.2;   // Szerokość linii (mm)

module segment_slot(horizontal = true) {
    if (horizontal) {
        w = slot_w;
        l = slot_l_h;
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
        w = slot_w;
        l = slot_l_v;
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
        translate([0, 77, 0]) segment_slot(true);
        // G (Środkowy)
        translate([0, 0, 0]) segment_slot(true);
        // D (Dolny)
        translate([0, -77, 0]) segment_slot(true);
        
        // F (Górny lewy)
        translate([-37, 38.5, 0]) segment_slot(false);
        // B (Górny prawy)
        translate([37, 38.5, 0]) segment_slot(false);
        
        // E (Dolny lewy)
        translate([-37, -38.5, 0]) segment_slot(false);
        // C (Dolny prawy)
        translate([37, -38.5, 0]) segment_slot(false);
        
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
        translate([0, 105, thickness/2 - 0.5])
            linear_extrude(1.0)
                text("MALA CYFRA 100x180mm", size=8, halign="center", valign="center");
    }
}

template();
