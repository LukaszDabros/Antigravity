# Rysunek Techniczny i Gabaryty Zegara

Wizualny rysunek techniczny (blueprint) przedstawiający rzuty konstrukcyjne, wymiary oraz kąty frezowania komór LED w płycie MDF:

![Rysunek techniczny - Blueprint Zegara LED](C:\Users\dabro\.gemini\antigravity\brain\452313a3-fbeb-4282-9a3a-5c8adb1e4b4e\technical_drawing_1783955084517.png)

---

## 1. Specyfikacja Wymiarów Konstrukcyjnych

Poniższa tabela zawiera zestawienie wszystkich kluczowych wymiarów niezbędnych do docięcia płyty i konfiguracji frezarki:

| Parametr | Rząd Górny (Zegar) | Rząd Dolny (Wyniki) | Obudowa / Płyta MDF |
| :--- | :--- | :--- | :--- |
| **Wymiary Cyfry** | 80 mm (szer.) x 144 mm (wys.) | 110 mm (szer.) x 200 mm (wys.) | **860 mm (szer.) x 630 mm (wys.)** |
| **Szerokość Segmentu** | 18 mm (front) | 25 mm (front) | Grubość rdzenia MDF: **18 mm** |
| **Głębokość Frezowania** | 12 - 15 mm | 12 - 15 mm | Plecy obudowy (HDF): **3 mm** |
| **Kąt Ścianek Komory** | 45 stopni | 45 stopni | Ramka zewnętrzna (szerokość): **40 mm** |
| **Szerokość Dna Slotu** | 10 mm (pod taśmę LED) | 11 mm (pod taśmę LED) | Mostki między segmentami: **5 - 7 mm** |
| **Długość Segmentu** | 58 mm | 50 mm | Średnica otworów na kable: **5 mm** |

---

## 2. Rozmieszczenie Elementów na Płycie (Siatka Osiowa)

```
+----------------------------------- 860 mm -----------------------------------+
|                                                                              |
|    [ Margines Górny: 60 mm ]                                                 |
|                                                                              |
|      (CYFRA 1)     (CYFRA 2)        [ : ]        (CYFRA 3)     (CYFRA 4)     |
|      80x144 mm     80x144 mm      Dwukropek      80x144 mm     80x144 mm     |
|                                                                              |
|    [ Odstęp Międzyrzędowy: 70 mm ]                                           |
|                                                                              |
|      (CYFRA 1)     (CYFRA 2)                     (CYFRA 3)     (CYFRA 4)     |
|     110x200 mm    110x200 mm                    110x200 mm    110x200 mm     |
|                                                                              |
|    [ Margines Dolny: 60 mm ]                                                 |
|                                                                              |
+------------------------------------------------------------------------------+
```

### Odległości i pozycjonowanie (od lewej do prawej krawędzi):
*   **Marginesy boczne:** 50 mm z lewej i prawej strony.
*   **Odstępy między cyframi w sekcjach:** 25 mm.
*   **Środkowy odstęp (sekcja wyników / dwukropek):** 80 mm wolnej przestrzeni na środku tablicy.
*   **Pozycjonowanie pionowe:** Górny rząd jest wycentrowany w osi optycznej z dolnymi parami cyfr, co zapewnia pełną symetrię całej konstrukcji.
