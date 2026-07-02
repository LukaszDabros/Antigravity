// =========================================================================
// Wielkoformatowy Zegar Cyfrowy LED - Szablon Frezarski Cyfry (V27)
// =========================================================================
// Parametryczny szablon do frezowania otworów pilotujących w płycie MDF 18mm
// przy użyciu pierścienia kopiującego (Ø 17 mm) oraz frezu palcowego (Ø 8 mm).
// Offset wbudowany = (17 - 8) / 2 = 4.5 mm na stronę.
// =========================================================================

/* [Wybór Szablonu] */
// Typ szablonu do wyrenderowania: "large" (tablica wyników) lub "small" (zegar)
template_type = "large"; // [large, small]

/* [Parametry Narzędzia] */
guide_bush_d = 17; // Średnica pierścienia kopiującego (mm)
cutter_d = 8;      // Średnica frezu palcowego (mm)
tool_offset = (guide_bush_d - cutter_d) / 2; // Offset jednostronny (4.5 mm)

/* [Wymiary Bazy (MDF)] */
// Wymiary otworu docelowego w płycie MDF (bez offsetu)
pilot_w = (template_type == "large") ? 82 : 42;
pilot_h = (template_type == "large") ? 17 : 8;

/* [Wymiary Szablonu] */
margin = 20;        // Margines wokół otworu roboczego (mm)
thickness = 8;      // Grubość szablonu (mm)

// Obliczenie otworu wewnętrznego w szablonie (w którym porusza się pierścień)
inner_w = pilot_w + 2 * tool_offset; // Dla dużego: 91 mm, dla małego: 51 mm
inner_h = pilot_h + 2 * tool_offset; // Dla dużego: 26 mm, dla małego: 17 mm

// Bounding box szablonu
outer_w = inner_w + 2 * margin;
outer_h = inner_h + 2 * margin;

// Wymiary nacięć celowniczych (krzyży pomocniczych)
cross_depth = 0.5;   // Głębokość nacięcia (mm)
cross_width = 1.0;   // Szerokość linii nacięcia (mm)
cross_length = 15;   // Długość linii od krawędzi zewnętrznej (mm)

module template_body() {
    difference() {
        // Główna płyta szablonu
        cube([outer_w, outer_h, thickness], center = true);
        
        // Otwór roboczy pod pierścień kopiujący
        cube([inner_w, inner_h, thickness + 2], center = true);
        
        // Krzyże celownicze na dolnej powierzchni (z = -thickness/2)
        // Lewy krzyż celowniczy (oś X, strona lewa)
        translate([-outer_w/2 + cross_length/2, 0, -thickness/2 + cross_depth/2])
            cube([cross_length + 0.1, cross_width, cross_depth + 0.1], center = true);
            
        // Prawy krzyż celowniczy (oś X, strona prawa)
        translate([outer_w/2 - cross_length/2, 0, -thickness/2 + cross_depth/2])
            cube([cross_length + 0.1, cross_width, cross_depth + 0.1], center = true);
            
        // Dolny krzyż celowniczy (oś Y, strona dolna)
        translate([0, -outer_h/2 + cross_length/2, -thickness/2 + cross_depth/2])
            cube([cross_width, cross_length + 0.1, cross_depth + 0.1], center = true);
            
        // Górny krzyż celowniczy (oś Y, strona górna)
        translate([0, outer_h/2 - cross_length/2, -thickness/2 + cross_depth/2])
            cube([cross_width, cross_length + 0.1, cross_depth + 0.1], center = true);
    }
}

// Renderowanie szablonu
template_body();

// Informacje pomocnicze w konsoli OpenSCAD
echo("=================================================");
echo("ROZMIAR SZABLONU:", template_type);
echo("Wymiar zewnętrzny płyty:", outer_w, "x", outer_h, "mm");
echo("Otwór wewnętrzny (roboczy):", inner_w, "x", inner_h, "mm");
echo("Docelowy otwór pilotujący w MDF:", pilot_w, "x", pilot_h, "mm");
echo("Oczekiwany wymiar na froncie po fazowaniu 45° na głębokość 9mm:", pilot_w + 18, "x", pilot_h + 18, "mm");
echo("=================================================");
