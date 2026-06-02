const questions = [
  // ==========================================
  // HISTORIA POLSKIEGO I ŚWIATOWEGO SPORTU (1-20)
  // ==========================================
  {
    id: 1,
    category: "historia",
    difficulty: "latwe",
    question: "W którym roku reprezentacja Polski w piłce nożnej prowadzona przez Kazimierza Górskiego zdobyła złoty medal olimpijski w Monachium?",
    options: ["1970", "1972", "1974", "1976"],
    correct: 1,
    explanation: "Reprezentacja Polski pod wodzą Kazimierza Górskiego zdobyła złoty medal na Igrzyskach Olimpijskich w Monachium w 1972 roku, pokonując w finale Węgry 2:1."
  },
  {
    id: 2,
    category: "historia",
    difficulty: "srednie",
    question: "Kto był trenerem polskiej reprezentacji siatkarzy, która zdobyła złoty medal olimpijski w Montrealu w 1976 roku?",
    options: ["Hubert Jerzy Wagner", "Andrzej Niemczyk", "Raul Lozano", "Ireneusz Mazur"],
    correct: 0,
    explanation: "Hubert Jerzy Wagner, zwany 'Katem', poprowadził reprezentację Polski siatkarzy do mistrzostwa olimpijskiego w Montrealu w 1976 roku."
  },
  {
    id: 3,
    category: "historia",
    difficulty: "srednie",
    question: "Jak nazywa się legendarny polski lekkoatleta, mistrz olimpijski z Los Angeles (1932) w biegu na 10 000 m, rozstrzelany przez Niemców w Palmirach?",
    options: ["Bronisław Malinowski", "Zdzisław Krzyszkowiak", "Janusz Kusociński", "Wacław Kuźmicki"],
    correct: 2,
    explanation: "Janusz Kusociński zdobył złoto w 1932 r. Podczas II wojny światowej działał w konspiracji i został aresztowany przez gestapo, a następnie rozstrzelany w Palmirach w 1940 r."
  },
  {
    id: 4,
    category: "historia",
    difficulty: "latwe",
    question: "Który polski skoczek narciarski jako pierwszy zdobył Puchar Świata (Kryształową Kulę)?",
    options: ["Wojciech Fortuna", "Kamil Stoch", "Piotr Żyła", "Adam Małysz"],
    correct: 3,
    explanation: "Adam Małysz jako pierwszy Polak zdobył Kryształową Kulę w sezonie 2000/2001. Łącznie wygrał ten cykl cztery razy."
  },
  {
    id: 5,
    category: "historia",
    difficulty: "srednie",
    question: "W którym roku odbyły się pierwsze w historii zimowe igrzyska olimpijskie?",
    options: ["1896", "1908", "1924", "1932"],
    correct: 2,
    explanation: "Pierwsze Zimowe Igrzyska Olimpijskie odbyły się w 1924 roku we francuskim Chamonix."
  },
  {
    id: 6,
    category: "historia",
    difficulty: "trudne",
    question: "Który klub piłkarski jako jedyny z Polski grał w finale europejskiego pucharu (Pucharu Zdobywców Pucharów) w 1970 roku?",
    options: ["Legia Warszawa", "Górnik Zabrze", "Ruch Chorzów", "Wisła Kraków"],
    correct: 1,
    explanation: "Górnik Zabrze zagrał w finale Pucharu Zdobywców Pucharów w 1970 roku w Wiedniu, gdzie przegrał z Manchesterem City 1:2."
  },
  {
    id: 7,
    category: "historia",
    difficulty: "srednie",
    question: "Z kim reprezentacja Polski w piłce nożnej wygrała mecz o 3. miejsce na Mistrzostwach Świata w 1974 roku w RFN?",
    options: ["Brazylia", "Włochy", "RFN", "Jugosławia"],
    correct: 0,
    explanation: "Polska pokonała Brazylię 1:0 po bramce Grzegorza Laty, zdobywając trzecie miejsce na świecie."
  },
  {
    id: 8,
    category: "historia",
    difficulty: "trudne",
    question: "Która polska sportsmenka została uznana za najlepszą lekkoatletkę świata w 1974 roku po pobiciu rekordów świata na 200 m i 400 m?",
    options: ["Halina Konopacka", "Irena Szewińska", "Elżbieta Duńska-Krzesińska", "Ewa Kłobukowska"],
    correct: 1,
    explanation: "Irena Szewińska dominowała na bieżniach świata w 1974 roku, bijąc rekordy globu i zdobywając prestiżowe nagrody sportowe."
  },
  {
    id: 9,
    category: "historia",
    difficulty: "srednie",
    question: "Gdzie odbyły się Igrzyska Olimpijskie w 1980 roku, które zostały zbojkotowane przez większość państw zachodnich pod przewodnictwem USA?",
    options: ["Monachium", "Montreal", "Moskwa", "Los Angeles"],
    correct: 2,
    explanation: "Igrzyska Olimpijskie w 1980 roku odbyły się w Moskwie (ZSRR) i zostały zbojkotowane z powodu sowieckiej inwazji na Afganistan."
  },
  {
    id: 10,
    category: "historia",
    difficulty: "srednie",
    question: "W którym roku Robert Kubica odniósł swoje jedyne zwycięstwo w wyścigu Formuły 1 (GP Kanady)?",
    options: ["2006", "2007", "2008", "2010"],
    correct: 2,
    explanation: "Robert Kubica wygrał Grand Prix Kanady na torze w Montrealu 8 czerwca 2008 roku w barwach zespołu BMW Sauber."
  },
  {
    id: 11,
    category: "historia",
    difficulty: "latwe",
    question: "Który legendarny polski kolarz szosowy zdobył wicemistrzostwo olimpijskie w 1980 roku i wygrał wyścig pokoju cztery razy?",
    options: ["Ryszard Szurkowski", "Zenon Jaskuła", "Czesław Lang", "Joachim Halupczok"],
    correct: 0,
    explanation: "Ryszard Szurkowski to jeden z najwybitniejszych polskich kolarzy, mistrz świata i czterokrotny zwycięzca Wyścigu Pokoju."
  },
  {
    id: 12,
    category: "historia",
    difficulty: "trudne",
    question: "W którym roku powstał Polski Związek Piłki Nożnej (PZPN)?",
    options: ["1918", "1919", "1921", "1923"],
    correct: 1,
    explanation: "PZPN został założony w dniach 20–21 grudnia 1919 roku w Warszawie podczas zjazdu założycielskiego."
  },
  {
    id: 13,
    category: "historia",
    difficulty: "trudne",
    question: "Jak nazywał się pierwszy Polak, który wystartował w rajdzie Dakar (wówczas Paryż-Dakar) na motocyklu w 1988 roku?",
    options: ["Jacek Czachor", "Marek Dąbrowski", "Rafał Sonik", "Krzysztof Spyra"],
    correct: 3,
    explanation: "Krzysztof Spyra był pionierem, który w 1988 roku wystartował na motocyklu w tym najtrudniejszym rajdzie świata."
  },
  {
    id: 14,
    category: "historia",
    difficulty: "srednie",
    question: "Który polski lekkoatleta zszokował świat gestem wykonanym w stronę radzieckiej publiczności po zdobyciu złota na IO w Moskwie w 1980 r.?",
    options: ["Władysław Kozakiewicz", "Tadeusz Ślusarski", "Jacek Wszoła", "Bronisław Malinowski"],
    correct: 0,
    explanation: "Władysław Kozakiewicz po zdobyciu złota w skoku o tyczce pokazał wygwizdującej go widowni słynny gest ('gest Kozakiewicza')."
  },
  {
    id: 15,
    category: "historia",
    difficulty: "latwe",
    question: "W którym roku odbyły się Mistrzostwa Europy w Piłce Nożnej (Euro), których współgospodarzem była Polska?",
    options: ["2008", "2012", "2016", "2020"],
    correct: 1,
    explanation: "Euro 2012 było organizowane wspólnie przez Polskę i Ukrainę. Mecze w Polsce rozgrywano w Warszawie, Gdańsku, Poznaniu i Wrocławiu."
  },
  {
    id: 16,
    category: "historia",
    difficulty: "trudne",
    question: "W którym roku rozegrano pierwsze nowożytne letnie igrzyska olimpijskie w Atenach?",
    options: ["1890", "1896", "1900", "1904"],
    correct: 1,
    explanation: "Pierwsze nowożytne igrzyska olimpijskie zorganizowano w Atenach w 1896 roku z inicjatywy barona Pierre'a de Coubertina."
  },
  {
    id: 17,
    category: "historia",
    difficulty: "srednie",
    question: "Który polski bokser jako jedyny w historii zdobył dwa złote medale olimpijskie (Tokio 1964, Meksyk 1968)?",
    options: ["Zbigniew Pietrzykowski", "Jerzy Kulej", "Leszek Drogosz", "Jan Szczepański"],
    correct: 1,
    explanation: "Jerzy Kulej to legendarny polski pięściarz, dwukrotny mistrz olimpijski w wadze lekkopółśredniej."
  },
  {
    id: 18,
    category: "historia",
    difficulty: "trudne",
    question: "Kto strzelił słynną bramkę dla Polski na Wembley w meczu z Anglią w 1973 roku (1:1), która dała nam awans na mundial?",
    options: ["Grzegorz Lato", "Włodzimierz Lubański", "Jan Domarski", "Andrzej Szarmach"],
    correct: 2,
    explanation: "Jan Domarski strzelił gola w 57. minucie meczu, pokonując Petera Shiltona, co stało się jednym z najważniejszych momentów w historii polskiej piłki."
  },
  {
    id: 19,
    category: "historia",
    difficulty: "srednie",
    question: "Który polski klub koszykarski jako pierwszy awansował do prestiżowych rozgrywek Euroligi w XXI wieku i odnosił tam sukcesy?",
    options: ["Śląsk Wrocław", "Prokom Trefl Sopot", "Anwil Włocławek", "Stelmet Zielona Góra"],
    correct: 1,
    explanation: "Prokom Trefl Sopot (później Asseco Prokom Gdynia) regularnie grał w Eurolidze, docierając nawet do fazy Top 8 w 2010 roku."
  },
  {
    id: 20,
    category: "historia",
    difficulty: "trudne",
    question: "Kto zdobył pierwszy w historii medal zimowych igrzysk olimpijskich dla Polski?",
    options: ["Franciszek Gąsienica Groń", "Wojciech Fortuna", "Elwira Seroczyńska", "Helena Pilejczyk"],
    correct: 0,
    explanation: "Franciszek Gąsienica Groń zdobył brązowy medal w kombinacji norweskiej na ZIO w Cortina d'Ampezzo w 1956 roku."
  },

  // ==========================================
  // PRZEPISY GRY I REGUŁY (21-40)
  // ==========================================
  {
    id: 21,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ile sekund ma drużyna koszykarska na oddanie rzutu na kosz rywala od momentu wejścia w posiadanie piłki?",
    options: ["14 sekund", "24 sekundy", "30 sekund", "8 sekund"],
    correct: 1,
    explanation: "Zgodnie z przepisami FIBA i NBA, czas na rozegranie akcji i oddanie rzutu wynosi 24 sekundy."
  },
  {
    id: 22,
    category: "przepisy",
    difficulty: "latwe",
    question: "Na jakiej wysokości zawieszona jest siatka w meczach siatkówki mężczyzn?",
    options: ["2,24 m", "2,35 m", "2,43 m", "2,50 m"],
    correct: 2,
    explanation: "Wymiar siatki dla mężczyzn to dokładnie 2,43 m. Dla kobiet wysokość ta wynosi 2,24 m."
  },
  {
    id: 23,
    category: "przepisy",
    difficulty: "srednie",
    question: "Co oznacza pojęcie 'spalony' (offside) w piłce nożnej?",
    options: [
      "Piłkarz dotyka piłki ręką w polu karnym",
      "Piłkarz w momencie podania znajduje się bliżej linii bramkowej rywala niż piłka i przedostatni zawodnik drużyny przeciwnej",
      "Zawodnik fauluje bramkarza w polu bramkowym",
      "Piłka opuszcza boisko za linią końcową"
    ],
    correct: 1,
    explanation: "Spalony ma miejsce wtedy, gdy w momencie podania zawodnik jest na połowie przeciwnika i jest bliżej linii bramkowej niż piłka oraz przedostatni gracz rywala (zazwyczaj ostatni obrońca)."
  },
  {
    id: 24,
    category: "przepisy",
    difficulty: "srednie",
    question: "Ile kroków bez kozłowania może maksymalnie wykonać piłkarz ręczny trzymający piłkę?",
    options: ["2 kroki", "3 kroki", "4 kroki", "5 kroków"],
    correct: 1,
    explanation: "Zawodnik w piłce ręcznej może zrobić maksymalnie 3 kroki z piłką w dłoniach, po czym musi ją podać, kozłować lub oddać strzał."
  },
  {
    id: 25,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ile punktów otrzymuje koszykarz za celny rzut z linii rzutów wolnych?",
    options: ["1 punkt", "2 punkty", "3 punkty", "Brak punktów"],
    correct: 0,
    explanation: "Każdy celny rzut wolny (podyktowany np. po faulu) daje drużynie dokładnie 1 punkt."
  },
  {
    id: 26,
    category: "przepisy",
    difficulty: "srednie",
    question: "W tenisie ziemnym, jaki wynik punktowy w gemie następuje po zdobyciu trzeciego punktu przez jednego z graczy (przy braku równowagi)?",
    options: ["30", "40", "50", "Gem"],
    correct: 1,
    explanation: "Kolejne punkty w tenisie to: 15, 30, 40. Następny zdobyty punkt (jeśli nie ma równowagi 40:40) oznacza wygranego gema."
  },
  {
    id: 27,
    category: "przepisy",
    difficulty: "srednie",
    question: "Jak nazywa się pozycja w siatkówce, na której gra zawodnik ubrany w koszulkę innego koloru, grający tylko w obronie, który nie może atakować ani zagrywać?",
    options: ["Rozgrywający", "Libero", "Przyjmujący", "Atakujący"],
    correct: 1,
    explanation: "Libero to wyspecjalizowany zawodnik defensywny. Obowiązują go szczególne zasady (nie zagrywa, nie blokuje, nie atakuje powyżej siatki)."
  },
  {
    id: 28,
    category: "przepisy",
    difficulty: "trudne",
    question: "Ile wynosi standardowa waga kuli w pchnięciu kulą dla mężczyzn w kategorii seniorów?",
    options: ["5,00 kg", "6,00 kg", "7,26 kg", "8,00 kg"],
    correct: 2,
    explanation: "Kula dla mężczyzn waży dokładnie 7,26 kg (16 funtów). Waga kuli dla kobiet to 4 kg."
  },
  {
    id: 29,
    category: "przepisy",
    difficulty: "srednie",
    question: "Jak długa jest jedna runda w boksie zawodowym mężczyzn?",
    options: ["2 minuty", "3 minuty", "4 minuty", "5 minut"],
    correct: 1,
    explanation: "Standardowa runda w boksie zawodowym mężczyzn trwa 3 minuty. Przerwy między rundami trwają 1 minutę."
  },
  {
    id: 30,
    category: "przepisy",
    difficulty: "trudne",
    question: "W hokeju na lodzie, ile minut kary otrzymuje zawodnik za tzw. większą karę (major penalty)?",
    options: ["2 minuty", "4 minuty", "5 minut", "10 minut"],
    correct: 2,
    explanation: "Kara większa (major penalty) trwa 5 minut. W przeciwieństwie do kary mniejszej (2 minuty), drużyna ukarana nie może wprowadzić gracza na lód nawet po stracie bramki."
  },
  {
    id: 31,
    category: "przepisy",
    difficulty: "srednie",
    question: "W żużlu, ile punktów otrzymuje zawodnik, który wygrywa pojedynczy bieg (przyjeżdża na 1. miejscu)?",
    options: ["1 punkt", "2 punkty", "3 punkty", "4 punkty"],
    correct: 2,
    explanation: "Punktacja w biegu żużlowym wynosi: 3 punkty za pierwsze miejsce, 2 punkty za drugie, 1 punkt za trzecie i 0 za czwarte (lub wykluczenie/defekt)."
  },
  {
    id: 32,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ile wynosi maksymalny czas, jaki bramkarz w piłce nożnej może trzymać piłkę w rękach we własnym polu karnym?",
    options: ["6 sekund", "10 sekund", "15 sekund", "Brak limitu"],
    correct: 0,
    explanation: "Zgodnie z przepisami FIFA, bramkarz może kontrolować piłkę rękami przez maksymalnie 6 sekund."
  },
  {
    id: 33,
    category: "przepisy",
    difficulty: "srednie",
    question: "W gimnastyce sportowej, jaka jest maksymalna wyjściowa ocena za wykonanie (Execution) ćwiczenia, od której sędziowie odejmują punkty za błędy?",
    options: ["8,00 pkt", "10,00 pkt", "15,00 pkt", "20,00 pkt"],
    correct: 1,
    explanation: "Ocena za wykonanie (E) zaczyna się od 10,00 punktów, a sędziowie odejmują punkty za błędy techniczne i postawę."
  },
  {
    id: 34,
    category: "przepisy",
    difficulty: "trudne",
    question: "W snookerze, ile punktów warta jest różowa bila?",
    options: ["4 punkty", "5 punktów", "6 punktów", "7 punktów"],
    correct: 2,
    explanation: "Wartość bil kolorowych w snookerze: żółta (2), zielona (3), brązowa (4), niebieska (5), różowa (6), czarna (7)."
  },
  {
    id: 35,
    category: "przepisy",
    difficulty: "trudne",
    question: "Jak długo może trwać maksymalnie dogrywka (overtime) w fazie pucharowej meczu piłki wodnej (water polo) przed rzutami karnymi?",
    options: ["2 x 3 minuty", "2 x 5 minut", "1 x 5 minut", "Nie ma dogrywek (od razu karne)"],
    correct: 3,
    explanation: "W nowoczesnych przepisach piłki wodnej (FINA) nie ma dogrywek. W przypadku remisu od razu przechodzi się do serii rzutów karnych."
  },
  {
    id: 36,
    category: "przepisy",
    difficulty: "srednie",
    question: "W badmintonie, do ilu punktów gra się pojedynczego seta w oficjalnych meczach seniorskich?",
    options: ["15 punktów", "21 punktów", "25 punktów", "11 punktów"],
    correct: 1,
    explanation: "Set w badmintonie jest rozgrywany do 21 punktów. W przypadku wyniku 20:20 gra się do dwóch punktów przewagi (maksymalnie do 30)."
  },
  {
    id: 37,
    category: "przepisy",
    difficulty: "srednie",
    question: "Jaka jest standardowa szerokość bramki do piłki nożnej (między słupkami)?",
    options: ["7,12 m", "7,32 m", "7,50 m", "8,00 m"],
    correct: 1,
    explanation: "Wymiary bramki piłkarskiej to 7,32 m szerokości oraz 2,44 m wysokości."
  },
  {
    id: 38,
    category: "przepisy",
    difficulty: "latwe",
    question: "Co dzieje się w koszykówce po popełnieniu przez zawodnika 5 fauli osobistych (lub 6 w NBA)?",
    options: [
      "Przeciwnik otrzymuje rzut karny",
      "Zawodnik musi opuścić boisko i nie może w tym meczu już zagrać",
      "Drużyna gra w osłabieniu do końca kwarty",
      "Zawodnik otrzymuje żółtą kartkę"
    ],
    correct: 1,
    explanation: "Zawodnik, który przekroczy limit fauli (5 w rozgrywkach FIBA, 6 w NBA), zostaje wykluczony z gry w danym meczu, ale może zostać zastąpiony przez rezerwowego."
  },
  {
    id: 39,
    category: "przepisy",
    difficulty: "trudne",
    question: "Jak nazywa się błąd w lekkoatletycznym biegu płotkarskim polegający na celowym przewróceniu płotka nogą lub ominięciu go obok?",
    options: ["Falstart", "Dyskfalifikacja płotkowa", "Przejście poza płotkiem / Złe pokonanie", "Brak błędu (płotki można przewracać)"],
    correct: 2,
    explanation: "Zawodnik nie może biec obok płotka ani celowo przewracać go stopą/nogą. Przypadkowe potrącenie i przewrócenie płotka nie jest jednak karane."
  },
  {
    id: 40,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ile wynosi dystans maratonu?",
    options: ["40,000 km", "42,195 km", "45,500 km", "50,000 km"],
    correct: 1,
    explanation: "Dystans biegu maratońskiego to dokładnie 42 kilometry i 195 metrów."
  },

  // ==========================================
  // WYNIKI, REKORDY I OSIĄGNIĘCIA (41-60)
  // ==========================================
  {
    id: 41,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile bramek zdobył Robert Lewandowski w słynnym meczu przeciwko VfL Wolfsburg w 2015 roku, wchodząc z ławki rezerwowych w 9 minut?",
    options: ["3 bramki", "4 bramki", "5 bramek", "6 bramek"],
    correct: 2,
    explanation: "Robert Lewandowski zdobył historyczne 5 bramek w zaledwie 8 minut i 59 sekund (od 51. do 60. minuty meczu)."
  },
  {
    id: 42,
    category: "wyniki",
    difficulty: "srednie",
    question: "Jaki jest aktualny rekord świata w biegu na 100 m mężczyzn ustanowiony przez Usaina Bolta w 2009 roku w Berlinie?",
    options: ["9,58 s", "9,69 s", "9,72 s", "9,55 s"],
    correct: 0,
    explanation: "Usain Bolt przebiegł 100 metrów w rekordowym czasie 9,58 sekundy podczas Mistrzostw Świata w Berlinie w sierpniu 2009 roku."
  },
  {
    id: 43,
    category: "wyniki",
    difficulty: "latwe",
    question: "Kto jest jedynym polskim skoczkiem narciarskim, który zdobył złoty medal olimpijski na skoczni normalnej i dużej podczas jednych igrzysk (Soczi 2014)?",
    options: ["Kamil Stoch", "Adam Małysz", "Dawid Kubacki", "Wojciech Fortuna"],
    correct: 0,
    explanation: "Kamil Stoch dokonał tego wyczynu na ZIO w Soczi w 2014 roku, dominując na obu skoczniach."
  },
  {
    id: 44,
    category: "wyniki",
    difficulty: "srednie",
    question: "Która polska lekkoatletka jest wielokrotną mistrzynią olimpijską i rekordzistką świata w rzucie młotem, dominującą przez ponad dekadę?",
    options: ["Kamila Skolimowska", "Anita Włodarczyk", "Malwina Kopron", "Joanna Fiodorow"],
    correct: 1,
    explanation: "Anita Włodarczyk to trzykrotna mistrzyni olimpijska i rekordzistka świata (rekord 82,98 m ustanowiony w Warszawie w 2016 r.)."
  },
  {
    id: 45,
    category: "wyniki",
    difficulty: "trudne",
    question: "Który polski himalaista jako pierwszy człowiek w historii zdobył zimą najwyższy szczyt Ziemi - Mount Everest (wraz z Leszkiem Cichym)?",
    options: ["Jerzy Kukuczka", "Wojciech Kurtyka", "Krzysztof Wielicki", "Wanda Rutkiewicz"],
    correct: 2,
    explanation: "Krzysztof Wielicki i Leszek Cichy zdobyli Mount Everest zimą 17 lutego 1980 roku, otwierając erę polskiego himalaizmu zimowego."
  },
  {
    id: 46,
    category: "wyniki",
    difficulty: "srednie",
    question: "Jaki kraj zdobył tytuł Mistrza Świata w Piłce Nożnej w 2022 roku podczas turnieju w Katarze?",
    options: ["Francja", "Argentyna", "Chorwacja", "Brazylia"],
    correct: 1,
    explanation: "Argentyna zdobyła mistrzostwo świata pokonując w dramatycznym finale Francję po rzutach karnych."
  },
  {
    id: 47,
    category: "wyniki",
    difficulty: "trudne",
    question: "Ile goli zdobył Grzegorz Lato na Mistrzostwach Świata w 1974 roku, zostając królem strzelców tego turnieju?",
    options: ["5 goli", "7 goli", "9 goli", "10 goli"],
    correct: 1,
    explanation: "Grzegorz Lato strzelił 7 bramek, co zapewniło mu prestiżowy tytuł Króla Strzelców turnieju w RFN."
  },
  {
    id: 48,
    category: "wyniki",
    difficulty: "latwe",
    question: "Która polska tenisistka jako pierwsza w historii polskiego tenisa wygrała wielkoszlemowy turniej Roland Garros w grze pojedynczej?",
    options: ["Agnieszka Radwańska", "Iga Świątek", "Magda Linette", "Jadwiga Jędrzejowska"],
    correct: 1,
    explanation: "Iga Świątek wygrała Roland Garros po raz pierwszy w październiku 2020 roku jako 19-latka, nie tracąc w turnieju żadnego seta."
  },
  {
    id: 49,
    category: "wyniki",
    difficulty: "trudne",
    question: "Ile tytułów mistrza świata Formuły 1 zdobył legendarny niemiecki kierowca Michael Schumacher?",
    options: ["5", "6", "7", "8"],
    correct: 2,
    explanation: "Michael Schumacher zdobył w swojej karierze 7 tytułów mistrzowskich (dwa z Benettonem i pięć z Ferrari)."
  },
  {
    id: 50,
    category: "wyniki",
    difficulty: "srednie",
    question: "Kto zdobył złoty medal olimpijski dla Polski w chodzie sportowym na 50 km na trzech igrzyskach z rzędu (1996, 2000, 2004)?",
    options: ["Robert Korzeniowski", "Dawid Tomala", "Grzegorz Sudoł", "Tomasz Lipiec"],
    correct: 0,
    explanation: "Robert Korzeniowski to najwybitniejszy polski chodziarz, 4-krotny mistrz olimpijski (w Sydney zdobył złoto na 20 km i 50 km)."
  },
  {
    id: 51,
    category: "wyniki",
    difficulty: "srednie",
    question: "Który polski lekkoatleta zdobył brązowy medal olimpijski w biegu na 800 metrów w Tokio w 2021 roku?",
    options: ["Patryk Dobek", "Adam Kszczot", "Marcin Lewandowski", "Kajetan Duszyński"],
    correct: 0,
    explanation: "Patryk Dobek odniósł niesamowity sukces, zdobywając brąz na IO w Tokio po zaledwie kilku miesiącach treningu na tym dystansie."
  },
  {
    id: 52,
    category: "wyniki",
    difficulty: "srednie",
    question: "Jak nazywa się szwedzki tyczkarz, który wielokrotnie śrubował rekord świata w skoku o tyczce, przekraczając barierę 6.20 m?",
    options: ["Renaud Lavillenie", "Armand Duplantis", "Piotr Lisek", "Sam Kendricks"],
    correct: 1,
    explanation: "Armand 'Mondo' Duplantis to dominator skoku o tyczce, który regularnie bije rekordy świata w tej konkurencji."
  },
  {
    id: 53,
    category: "wyniki",
    difficulty: "trudne",
    question: "Który polski pięściarz jako jedyny walczył o mistrzostwo świata wagi ciężkiej federacji WBC w 2011 roku z Witalijem Kliczko we Wrocławiu?",
    options: ["Andrzej Gołota", "Tomasz Adamek", "Mariusz Wach", "Artur Szpilka"],
    correct: 1,
    explanation: "Tomasz Adamek zmierzył się z Witalijem Kliczko o pas WBC we wrześniu 2011 r. na Stadionie Miejskim we Wrocławiu, przegrywając przez TKO w 10. rundzie."
  },
  {
    id: 54,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile razy reprezentacja Polski in siatkówce mężczyzn zdobywała tytuł Mistrza Świata w historii (do 2023 r.)?",
    options: ["1 raz", "2 razy", "3 razy", "4 razy"],
    correct: 2,
    explanation: "Polska reprezentacja siatkarzy zdobyła mistrzostwo świata 3 razy: w 1974 r. pod wodzą H. Wagnera oraz w 2014 r. i 2018 r."
  },
  {
    id: 55,
    category: "wyniki",
    difficulty: "srednie",
    question: "Który piłkarz zdobył najwięcej nagród Złotej Piłki (Ballon d'Or) w historii futbolu?",
    options: ["Cristiano Ronaldo", "Pele", "Diego Maradona", "Lionel Messi"],
    correct: 3,
    explanation: "Lionel Messi zdobył rekordową liczbę 8 Złotych Piłek w swojej karierze."
  },
  {
    id: 56,
    category: "wyniki",
    difficulty: "trudne",
    question: "Jaki był najlepszy wynik reprezentacji Polski koszykarzy na Mistrzostwach Świata w Chinach w 2019 roku?",
    options: ["Złoty medal", "4. miejsce", "8. miejsce", "12. miejsce"],
    correct: 2,
    explanation: "Reprezentacja Polski pod wodzą Mike'a Taylora odniosła wielki sukces, zajmując 8. miejsce na Mistrzostwach Świata w 2019 roku."
  },
  {
    id: 57,
    category: "wyniki",
    difficulty: "srednie",
    question: "Która polska biegaczka narciarska czterokrotnie z rzędu wygrała prestiżowy cykl Tour de Ski?",
    options: ["Justyna Kowalczyk", "Sylwia Jaśkowiec", "Izabela Marcisz", "Monika Skinder"],
    correct: 0,
    explanation: "Justyna Kowalczyk wygrała Tour de Ski cztery razy z rzędu (w latach 2010-2013), co stanowi niesamowity rekord w biegach narciarskich."
  },
  {
    id: 58,
    category: "wyniki",
    difficulty: "trudne",
    question: "Ile goli strzelił w reprezentacji Polski Włodzimierz Lubański, zajmujący drugie miejsce na liście strzelców wszech czasów kadry?",
    options: ["38 goli", "48 goli", "50 goli", "55 goli"],
    correct: 1,
    explanation: "Włodzimierz Lubański zdobył dla biało-czerwonych 48 bramek w 75 oficjalnych meczach."
  },
  {
    id: 59,
    category: "wyniki",
    difficulty: "latwe",
    question: "Który polski lekkoatleta specjalizujący się w rzucie dyskiem zdobył dwa srebrne medale olimpijskie (Pekin 2008, Rio 2016)?",
    options: ["Piotr Małachowski", "Robert Urbanek", "Konrad Bukowiecki", "Michał Haratyk"],
    correct: 0,
    explanation: "Piotr Małachowski to dwukrotny wicemistrz olimpijski i mistrz świata w rzucie dyskiem."
  },
  {
    id: 60,
    category: "wyniki",
    difficulty: "srednie",
    question: "Z jakim klubem piłkarskim Robert Lewandowski zdobył Ligę Mistrzów UEFA w 2020 roku?",
    options: ["Borussia Dortmund", "Bayern Monachium", "FC Barcelona", "Chelsea FC"],
    correct: 1,
    explanation: "Lewandowski wygrał Ligę Mistrzów w sezonie 2019/2020 z Bayernem Monachium, wygrywając w finale z PSG 1:0."
  },

  // ==========================================
  // IGRZYSKA OLIMPIJSKIE I SŁAWNI SPORTOWCY (61-80)
  // ==========================================
  {
    id: 61,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Kto zdobył pierwszy złoty medal olimpijski dla Polski w historii (Amsterdam 1928)?",
    options: ["Janusz Kusociński", "Halina Konopacka", "Stanisława Walasiewicz", "Władysław Kozakiewicz"],
    correct: 1,
    explanation: "Halina Konopacka zdobyła pierwsze polskie złoto olimpijskie w rzucie dyskiem na Igrzyskach w Amsterdamie w 1928 roku."
  },
  {
    id: 62,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Ile złotych medali olimpijskich zdobyła w swojej karierze Irena Szewińska?",
    options: ["2 złote medale", "3 złote medale", "5 złotych medali", "7 złotych medali"],
    correct: 1,
    explanation: "Irena Szewińska zdobyła 7 medali olimpijskich w sumie, w tym 3 złote (sztafeta 4x100m w Tokio 1964, bieg na 200m w Meksyku 1968, bieg na 400m w Montrealu 1976)."
  },
  {
    id: 63,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "W jakiej dyscyplinie sportowej mistrzem olimpijskim w Atlancie (1996) został Paweł Nastula?",
    options: ["Zapasy", "Boks", "Judo", "Podnoszenie ciężarów"],
    correct: 2,
    explanation: "Paweł Nastula wywalczył złoto w judo w kategorii do 95 kg, będąc wówczas niepokonanym przez kilkadziesiąt walk z rzędu."
  },
  {
    id: 64,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Otylia Jędrzejczak zdobyła trzy medale na Igrzyskach Olimpijskich w Atenach w 2004 roku. Jaka to była dyscyplina?",
    options: ["Wioślarstwo", "Kajakarstwo", "Pływanie", "Lekkoatletyka"],
    correct: 2,
    explanation: "Otylia Jędrzejczak zdobyła złoto na 200 m stylem motylkowym oraz dwa srebra na dystansach 100 m stylem motylkowym i 400 m stylem dowolnym."
  },
  {
    id: 65,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Który polski sztangista wywalczył złoty medal na IO w Londynie (2012) w kategorii do 85 kg?",
    options: ["Szymon Kołecki", "Marcin Dołęga", "Adrian Zieliński", "Bartłomiej Bonk"],
    correct: 2,
    explanation: "Adrian Zieliński zdobył złoty medal olimpijski w podnoszeniu ciężarów w Londynie (2012) w kategorii wagowej do 85 kg."
  },
  {
    id: 66,
    category: "olimpijczycy",
    difficulty: "trudne",
    question: "Kto zdobył jedyny złoty medal dla Polski na Zimowych Igrzyskach Olimpijskich w Sapporo w 1972 roku?",
    options: ["Wojciech Fortuna", "Adam Małysz", "Józef Łuszczek", "Stanisław Marusarz"],
    correct: 0,
    explanation: "Wojciech Fortuna sprawił wielką sensację, wygrywając konkurs skoków narciarskich na dużej skoczni Okurayama w Sapporo."
  },
  {
    id: 67,
    category: "olimpijczycy",
    difficulty: "trudne",
    question: "Który z polskich wioślarzy startował pięć razy na Igrzyskach Olimpijskich i zdobył cztery medale, w tym złoto w 2008 roku?",
    options: ["Robert Sycz", "Tomasz Kucharski", "Michał Jeliński", "Adam Korol"],
    correct: 3,
    explanation: "Adam Korol to pięciokrotny olimpijczyk, mistrz olimpijski z Pekinu w czwórce podwójnej (wraz z M. Kolbowiczem, K. Wasielewskim i M. Jelińskim)."
  },
  {
    id: 68,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "W jakim sporcie złoty medal olimpijski w Barcelonie (1992) zdobył Arkadiusz Skrzypaszek?",
    options: ["Szermierka", "Strzelectwo", "Pięciobój nowoczesny", "Kajakarstwo"],
    correct: 2,
    explanation: "Arkadiusz Skrzypaszek zdobył dwa złote medale w Barcelonie: indywidualnie oraz drużynowo w pięcioboju nowoczesnym."
  },
  {
    id: 69,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Który polski lekkoatleta niespodziewanie wywalczył złoty medal w chodzie na 50 km podczas Igrzysk Olimpijskich w Tokio w 2021 roku?",
    options: ["Robert Korzeniowski", "Dawid Tomala", "Łukasz Nowak", "Artur Brzozowski"],
    correct: 1,
    explanation: "Dawid Tomala sensacyjnie wygrał chód na dystansie 50 km w Sapporo (gdzie odbywały się konkurencje chodzarskie IO Tokio 2020)."
  },
  {
    id: 70,
    category: "olimpijczycy",
    difficulty: "trudne",
    question: "Która polska kajakarka jest najbardziej utytułowaną sportsmenką w historii polskich igrzysk pod względem ogólnej liczby medali (zdobyła ich aż 4)?",
    options: ["Aneta Konieczna", "Karolina Naja", "Beata Mikołajczyk", "Marta Walczykiewicz"],
    correct: 1,
    explanation: "Karolina Naja ma na koncie 4 medale olimpijskie (3 brązowe i 1 srebrny) zdobyte w Londynie, Rio i Tokio, co czyni ją jedną z najbardziej utytułowanych Polek."
  },
  {
    id: 71,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Która polska lekkoatletka zdobyła złoty medal w rzucie młotem podczas Igrzysk Olimpijskich w Sydney w 2000 roku jako niespełna 18-latka?",
    options: ["Anita Włodarczyk", "Kamila Skolimowska", "Malwina Kopron", "Joanna Fiodorow"],
    correct: 1,
    explanation: "Kamila Skolimowska przeszła do historii zdobywając złoto w rzucie młotem w Sydney jako najmłodsza polska mistrzyni olimpijska."
  },
  {
    id: 72,
    category: "olimpijczycy",
    difficulty: "trudne",
    question: "Kto był chorążym polskiej ekipy olimpijskiej podczas ceremonii otwarcia Igrzysk w Barcelonie w 1992 roku?",
    options: ["Arkadiusz Skrzypaszek", "Waldemar Legień", "Andrzej Wroński", "Rafał Szukała"],
    correct: 1,
    explanation: "Waldemar Legień, wybitny judoka (dwukrotny złoty medalista olimpijski), był chorążym polskiej reprezentacji w Barcelonie."
  },
  {
    id: 73,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Który polski skoczek narciarski zdobył brązowy medal na Zimowych Igrzyskach Olimpijskich w Pekinie (2022) na skoczni normalnej?",
    options: ["Kamil Stoch", "Dawid Kubacki", "Stefan Hula", "Piotr Żyła"],
    correct: 1,
    explanation: "Dawid Kubacki wywalczył brązowy medal na skoczni normalnej podczas ZIO w Pekinie w 2022 roku."
  },
  {
    id: 74,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Jak nazywa się polski zapaśnik w stylu klasycznym, dwukrotny mistrz olimpijski z Seulu (1988) i Atlanty (1996)?",
    options: ["Andrzej Wroński", "Włodzimierz Zawadzki", "Józef Tracz", "Ryszard Wolny"],
    correct: 0,
    explanation: "Andrzej Wroński to legendarny zapaśnik, mistrz olimpijski w kategorii do 100 kg z Seulu i Atlanty."
  },
  {
    id: 75,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "W którym roku polska sztafeta mieszana 4x400 m zdobyła złoty medal olimpijski w Tokio?",
    options: ["2018", "2019", "2020 (rozegrane w 2021)", "2022"],
    correct: 2,
    explanation: "Polska sztafeta mieszana w składzie z K. Zalewskim, N. Kaczmarek, J. Święty-Ersetic i K. Duszyńskim zdobyła złoto na IO w Tokio w 2021 roku."
  },
  {
    id: 76,
    category: "olimpijczycy",
    difficulty: "trudne",
    question: "Który z polskich szermierzy zdobył indywidualne złoto olimpijskie w szabli w Meksyku w 1968 roku?",
    options: ["Jerzy Pawłowski", "Wojciech Zabłocki", "Ryszard Zub", "Władysław Pawłowski"],
    correct: 0,
    explanation: "Jerzy Pawłowski, uznawany za jednego z szablistów wszech czasów, zdobył indywidualne złoto w Meksyku."
  },
  {
    id: 77,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "W jakiej lekkoatletycznej konkurencji mistrzem olimpijskim z Sydney (2000) został Szymon Ziółkowski?",
    options: ["Pchnięcie kulą", "Rzut oszczepem", "Rzut młotem", "Rzut dyskiem"],
    correct: 2,
    explanation: "Szymon Ziółkowski zdobył złoty medal olimpijski w rzucie młotem w Sydney z wynikiem 80,02 m."
  },
  {
    id: 78,
    category: "olimpijczycy",
    difficulty: "trudne",
    question: "Który polski biathlonista zdobył srebrny medal na IO w Turynie w 2006 roku w biegu masowym na 15 km?",
    options: ["Tomasz Sikora", "Wojciech Kozub", "Grzegorz Bodziana", "Łukasz Szczurek"],
    correct: 0,
    explanation: "Tomasz Sikora to najbardziej utytułowany polski biathlonista, wicemistrz olimpijski z Turynu i mistrz świata."
  },
  {
    id: 79,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Jak nazywa się polska lekkoatletka, która zdobyła złoty medal w biegu na 100 m na IO w Los Angeles w 1932 r., a po jej tragicznej śmierci w 1980 r. odkryto, że była osobą interseksualną?",
    options: ["Halina Konopacka", "Stanisława Walasiewicz", "Maria Kwaśniewska", "Jadwiga Wajsówna"],
    correct: 1,
    explanation: "Stanisława Walasiewicz (Stella Walsh) reprezentowała Polskę i USA. Badania autopsyjne wykazały u niej obecność zarówno żeńskich, jak i męskich narządów płciowych."
  },
  {
    id: 80,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Ile razy polska reprezentacja piłkarzy ręcznych mężczyzn stawała na podium Igrzysk Olimpijskich (zdobywając brąz w Montrealu 1976)?",
    options: ["1 raz", "2 razy", "3 razy", "Nigdy"],
    correct: 0,
    explanation: "Tylko raz w historii nasi piłkarze ręczni zdobyli medal olimpijski – był to brąz w Montrealu w 1976 r. pod wodzą Janusza Czerwińskiego."
  },

  // ==========================================
  // OGÓLNA WIEDZA SPORTOWA (81-100)
  // ==========================================
  {
    id: 81,
    category: "ogolne",
    difficulty: "latwe",
    question: "Ile minut trwa standardowy mecz piłki nożnej (bez dogrywki i przerw)?",
    options: ["80 minut", "90 minut", "100 minut", "120 minut"],
    correct: 1,
    explanation: "Mecz piłki nożnej składa się z dwóch połówek trwających po 45 minut każda, czyli łącznie 90 minut."
  },
  {
    id: 82,
    category: "ogolne",
    difficulty: "latwe",
    question: "W jakim sporcie zawodnicy rywalizują o puchar 'Stanley Cup'?",
    options: ["Koszykówka", "Hokej na lodzie", "Futbol amerykański", "Baseball"],
    correct: 1,
    explanation: "Stanley Cup to najstarsze i najcenniejsze trofeum w profesjonalnym sporcie w Ameryce Północnej, przyznawane zwycięzcy ligi NHL (hokej)."
  },
  {
    id: 83,
    category: "ogolne",
    difficulty: "srednie",
    question: "Z ilu graczy składa się na boisku jedna drużyna w meczu klasycznej odmiany rugby (Rugby Union)?",
    options: ["11", "13", "15", "7"],
    correct: 2,
    explanation: "W klasycznym Rugby Union na boisku rywalizują drużyny liczące po 15 zawodników. Istnieje też popularna odmiana Rugby 7."
  },
  {
    id: 84,
    category: "ogolne",
    difficulty: "srednie",
    question: "Który wielki szlem tenisowy jest rozgrywany na kortach trawiastych jako jedyny?",
    options: ["Australian Open", "Roland Garros", "Wimbledon", "US Open"],
    correct: 2,
    explanation: "Wimbledon, rozgrywany w Londynie, to najstarszy turniej tenisowy na świecie i jedyny turniej wielkoszlemowy na trawie."
  },
  {
    id: 85,
    category: "ogolne",
    difficulty: "latwe",
    question: "Jak nazywa się najwyższa liga rozgrywkowa męskiej piłki nożnej w Polsce?",
    options: ["I Liga", "Ekstraklasa", "Superliga", "Puchar Polski"],
    correct: 1,
    explanation: "Oficjalna nazwa najwyższej klasy rozgrywek piłkarskich w Polsce to Ekstraklasa."
  },
  {
    id: 86,
    category: "ogolne",
    difficulty: "srednie",
    question: "W którym sporcie używa się określeń takich jak 'strike', 'spare' oraz 'turkey'?",
    options: ["Golf", "Kręgle (Bowling)", "Rzutki (Darts)", "Snooker"],
    correct: 1,
    explanation: "Są to terminy z kręgli. Strike to strącenie wszystkich kręgli w 1. rzucie, spare w 2., a turkey to trzy strike'i z rzędu."
  },
  {
    id: 87,
    category: "ogolne",
    difficulty: "latwe",
    question: "Co oznaczają splecione ze sobą kolorowe koła na flagi olimpijskiej?",
    options: [
      "Liczbę dyscyplin sportowych na pierwszych igrzyskach",
      "Pięć kontynentów połączonych ideą sportu",
      "Pięć starożytnych bóstw",
      "Liczbę medali do zdobycia"
    ],
    correct: 1,
    explanation: "Pięć kół symbolizuje pięć kontynentów: Europę, Azję, Afrykę, Amerykę i Australię z Oceanią, zjednoczone w duchu sportowej rywalizacji."
  },
  {
    id: 88,
    category: "ogolne",
    difficulty: "srednie",
    question: "Który z podanych sportów walki pochodzi z Korei i opiera się głównie na dynamicznych kopnięciach?",
    options: ["Karate", "Taekwondo", "Judo", "Muay Thai"],
    correct: 1,
    explanation: "Taekwondo to tradycyjna koreańska sztuka walki, a od 2000 roku także pełnoprawny sport olimpijski."
  },
  {
    id: 89,
    category: "ogolne",
    difficulty: "trudne",
    question: "Ile waży oficjalna piłka do gry w koszykówkę w rozmiarze 7 (męska)?",
    options: ["400-450 g", "500-550 g", "567-650 g", "700-750 g"],
    correct: 2,
    explanation: "Waga męskiej piłki do koszykówki (rozmiar 7) powinna mieścić się w przedziale od 567 do 650 gramów."
  },
  {
    id: 90,
    category: "ogolne",
    difficulty: "srednie",
    question: "Z jakiego kraju pochodzi słynny kierowca rajdowy Sébastien Loeb, 9-krotny mistrz świata WRC?",
    options: ["Francja", "Belgia", "Finlandia", "Hiszpania"],
    correct: 0,
    explanation: "Sébastien Loeb pochodzi z Francji i jest uważany za jednego z najwybitniejszych kierowców rajdowych w historii."
  },
  {
    id: 91,
    category: "ogolne",
    difficulty: "srednie",
    question: "Jak długo trwa jedna tercja w meczu hokeja na lodzie?",
    options: ["15 minut", "20 minut", "30 minut", "35 minut"],
    correct: 1,
    explanation: "Mecz hokeja na lodzie składa się z trzech tercji po 20 minut czystego czasu gry (czas jest zatrzymywany podczas przerw w grze)."
  },
  {
    id: 92,
    category: "ogolne",
    difficulty: "trudne",
    question: "W którym roku odbył się pierwszy wyścig kolarski Tour de France?",
    options: ["1896", "1903", "1910", "1914"],
    correct: 1,
    explanation: "Pierwszy Tour de France został zorganizowany w 1903 roku przez gazetę 'L'Auto', aby zwiększyć jej sprzedaż."
  },
  {
    id: 93,
    category: "ogolne",
    difficulty: "latwe",
    question: "Który sport uprawia się na welodromie?",
    options: ["Kolarstwo torowe", "Lekkoatletykę halową", "Jeździectwo", "Wioślarstwo halowe"],
    correct: 0,
    explanation: "Welodrom to specjalny tor przeznaczony do rozgrywania zawodów w kolarstwie torowym."
  },
  {
    id: 94,
    category: "ogolne",
    difficulty: "srednie",
    question: "Ile wynosi standardowa długość basenu olimpijskiego do zawodów pływackich?",
    options: ["25 metrów", "50 metrów", "100 metrów", "75 metrów"],
    correct: 1,
    explanation: "Basen olimpijski ma długość dokładnie 50 metrów. Baseny o długości 25 metrów są nazywane basenami krótkimi."
  },
  {
    id: 95,
    category: "ogolne",
    difficulty: "latwe",
    question: "W którym amerykańskim mieście ma swoją siedzibę słynny zespół koszykówki NBA 'Lakers'?",
    options: ["Nowy Jork", "Chicago", "Los Angeles", "Miami"],
    correct: 2,
    explanation: "Pełna nazwa zespołu to Los Angeles Lakers. Klub ten wywalczył 17 tytułów mistrzowskich NBA."
  },
  {
    id: 96,
    category: "ogolne",
    difficulty: "trudne",
    question: "W którym państwie powstała gra w golfa w jej nowoczesnej formie (w XV wieku)?",
    options: ["Anglia", "Szkocja", "Irlandia", "Holandia"],
    correct: 1,
    explanation: "Nowoczesny golf narodził się w Szkocji, gdzie w 1457 r. król Jakub II zakazał gry, bo odciągała młodzież od łucznictwa."
  },
  {
    id: 97,
    category: "ogolne",
    difficulty: "latwe",
    question: "Która z tych dyscyplin sportowych polega na ślizganiu się na lodzie w lodowej rynnie na specjalnych sankach w pozycji leżącej na brzuchu głową w dół?",
    options: ["Bobsleje", "Skeleton", "Saneczkarstwo", "Curling"],
    correct: 1,
    explanation: "Skeleton polega na zjeździe głową w dół na płaskich sankach. Saneczkarstwo klasyczne odbywa się nogami w dół na plecach."
  },
  {
    id: 98,
    category: "ogolne",
    difficulty: "srednie",
    question: "Ile pionków ma łącznie na szachownicy jeden gracz na początku partii szachów?",
    options: ["8", "12", "16", "20"],
    correct: 2,
    explanation: "Każdy gracz zaczyna z 16 bierkami: 8 pionkami i 8 figurami (król, hetman, 2 wieże, 2 gońce, 2 skoczki)."
  },
  {
    id: 99,
    category: "ogolne",
    difficulty: "trudne",
    question: "W którym roku badminton stał się oficjalnym sportem medalowym na Igrzyskach Olimpijskich (w Barcelonie)?",
    options: ["1988", "1992", "1996", "2000"],
    correct: 1,
    explanation: "Badminton zadebiutował jako pełnoprawna dyscyplina olimpijska w Barcelonie w 1992 roku, po wcześniejszym pokazie w 1988."
  },
  {
    id: 100,
    category: "ogolne",
    difficulty: "srednie",
    question: "Jak nazywa się najwyższe trofeum w męskich drużynowych rozgrywkach tenisowych (odpowiednik mistrzostw świata reprezentacji)?",
    options: ["Puchar Davisa (Davis Cup)", "Puchar Hopmana", "Laver Cup", "Puchar Billie Jean King"],
    correct: 0,
    explanation: "Puchar Davisa to najważniejsze międzynarodowe drużynowe trofeum w męskim tenisie. Wśród kobiet odpowiednikiem jest Puchar Billie Jean King."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = questions;
}
