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
  },
  // ==========================================
  // NOWE PYTANIA (101-150)
  // ==========================================
  {
    id: 101,
    category: "historia",
    difficulty: "srednie",
    question: "Który polski piłkarz zdobył 4 bramki w jednym meczu na Mistrzostwach Świata w 1938 roku przeciwko Brazylii?",
    options: ["Ernest Wilimowski", "Gerard Cieślik", "Włodzimierz Lubański", "Teodor Peterek"],
    correct: 0,
    explanation: "Ernest Wilimowski strzelił 4 gole w legendarnym meczu z Brazylią (5:6 po dogrywce) w Strasburgu w 1938 roku."
  },
  {
    id: 102,
    category: "historia",
    difficulty: "srednie",
    question: "Kto strzelił dwie bramki dla Polski w meczu z ZSRR na Stadionie Śląskim w 1957 roku (2:1), który stał się symbolem narodowym?",
    options: ["Gerard Cieślik", "Lucjan Brychczy", "Ernest Pol", "Edward Szymkowiak"],
    correct: 0,
    explanation: "Gerard Cieślik zdobył obie bramki głową w wygranym 2:1 meczu z ZSRR w Chorzowie w 1957 roku."
  },
  {
    id: 103,
    category: "historia",
    difficulty: "trudne",
    question: "Który polski ciężarowiec zdobył dwa złote medale olimpijskie (Tokio 1964, Meksyk 1968) i pobił 24 rekordy świata?",
    options: ["Waldemar Baszanowski", "Ireneusz Paliński", "Marian Zieliński", "Mieczysław Nowak"],
    correct: 0,
    explanation: "Waldemar Baszanowski to legenda światowych ciężarów, mistrz olimpijski i pięciokrotny mistrz świata."
  },
  {
    id: 104,
    category: "historia",
    difficulty: "latwe",
    question: "W którym roku polskie koszykarki odniosły swój największy sukces, zdobywając złoty medal Mistrzostw Europy?",
    options: ["1991", "1995", "1999", "2003"],
    correct: 2,
    explanation: "Reprezentacja Polski koszykarek wywalczyła złoto na Mistrzostwach Europy w Katowicach w 1999 roku."
  },
  {
    id: 105,
    category: "historia",
    difficulty: "srednie",
    question: "Kto był pierwszym Polakiem grającym w lidze angielskiej w barwach klubu Manchester City w latach 1978–1981?",
    options: ["Kazimierz Deyna", "Grzegorz Lato", "Zbigniew Boniek", "Andrzej Szarmach"],
    correct: 0,
    explanation: "Kazimierz Deyna przeniósł się z Legii Warszawa do Manchesteru City w 1978 roku, stając się pionierem polskich transferów do Anglii."
  },
  {
    id: 106,
    category: "historia",
    difficulty: "trudne",
    question: "Która polska panczenistka zdobyła pierwszy medal zimowych igrzysk olimpijskich dla Polski w konkurencjach kobiecych (Squaw Valley 1960)?",
    options: ["Elwira Seroczyńska", "Helena Pilejczyk", "Erwina Ryś-Ferens", "Luiza Złotkowska"],
    correct: 0,
    explanation: "Elwira Seroczyńska zdobyła srebrny medal w biegu na 1500 m w 1960 r. Brąz w tym samym wyścigu zdobyła Helena Pilejczyk."
  },
  {
    id: 107,
    category: "historia",
    difficulty: "srednie",
    question: "Jak nazywa się słynny polski kierowca rajdowy, 3-krotny mistrz Europy, który w latach 60. i 70. prowadził legendarne auta marki Fiat?",
    options: ["Sobiesław Zasada", "Krzysztof Hołowczyc", "Marian Bublewicz", "Janusz Kulig"],
    correct: 0,
    explanation: "Sobiesław Zasada to najbardziej utytułowany polski kierowca rajdowy, mistrz Europy z lat 1966, 1967 i 1971."
  },
  {
    id: 108,
    category: "historia",
    difficulty: "trudne",
    question: "Która polska oszczepniczka zdobyła brązowy medal olimpijski w Berlinie w 1936 roku i wsławiła się odważną ripostą wobec Adolfa Hitlera?",
    options: ["Maria Kwaśniewska", "Halina Konopacka", "Jadwiga Wajsówna", "Stanisława Walasiewicz"],
    correct: 0,
    explanation: "Maria Kwaśniewska na gratulacje Hitlera, że 'gratuluje małej Polce', odpowiedziała: 'Pan też nie jest zbyt wysoki'. Uratowała też wielu ludzi podczas wojny."
  },
  {
    id: 109,
    category: "historia",
    difficulty: "srednie",
    question: "Który polski klub piłkarski jako pierwszy i jedyny w historii awansował do półfinału Pucharu Europy (poprzednika Ligi Mistrzów) w 1970 roku?",
    options: ["Legia Warszawa", "Górnik Zabrze", "Ruch Chorzów", "Widzew Łódź"],
    correct: 0,
    explanation: "Legia Warszawa dotarła do półfinału Pucharu Europy w sezonie 1969/1970, gdzie odpadła z Feyenoordem Rotterdam."
  },
  {
    id: 110,
    category: "historia",
    difficulty: "trudne",
    question: "W którym roku reprezentacja Polski w piłce nożnej rozegrała swój pierwszy oficjalny mecz międzypaństwowy (przegrany 0:1 z Węgrami)?",
    options: ["1919", "1920", "1921", "1922"],
    correct: 2,
    explanation: "Pierwszy oficjalny mecz reprezentacji Polski odbył się 18 grudnia 1921 roku w Budapeszcie przeciwko Węgrom."
  },
  {
    id: 111,
    category: "przepisy",
    difficulty: "latwe",
    question: "Jakie są standardowe wymiary boiska do piłki ręcznej (handball)?",
    options: ["40 x 20 m", "30 x 15 m", "50 x 25 m", "44 x 22 m"],
    correct: 0,
    explanation: "Boisko do piłki ręcznej ma kształt prostokąta o wymiarach 40 metrów długości i 20 metrów szerokości."
  },
  {
    id: 112,
    category: "przepisy",
    difficulty: "srednie",
    question: "W koszykówce, w ciągu ilu sekund drużyna musi wyprowadzić piłkę z własnej połowy boiska na połowę przeciwnika?",
    options: ["5 sekund", "8 sekund", "10 sekund", "12 sekund"],
    correct: 1,
    explanation: "Zgodnie z przepisami FIBA i NBA, drużyna ma 8 sekund na przeprowadzenie piłki przez linię środkową boiska."
  },
  {
    id: 113,
    category: "przepisy",
    difficulty: "srednie",
    question: "Ilu zawodników jednej drużyny znajduje się jednocześnie na boisku w grze polo na koniach?",
    options: ["3", "4", "5", "6"],
    correct: 1,
    explanation: "W tradycyjnym polo na otwartym trawiastym boisku każda drużyna składa się z 4 zawodników."
  },
  {
    id: 114,
    category: "przepisy",
    difficulty: "srednie",
    question: "Ile punktów w meczu rugby (Rugby Union) otrzymuje drużyna za celne kopnięcie piłki z rzutu karnego?",
    options: ["1 punkt", "2 punkty", "3 punkty", "5 punktów"],
    correct: 2,
    explanation: "Rzut karny (penalty kick) trafiony w światło bramki nad poprzeczką daje drużynie 3 punkty. Przyłożenie daje 5 punktów."
  },
  {
    id: 115,
    category: "przepisy",
    difficulty: "latwe",
    question: "Co w tenisie stołowym oznacza pojęcie 'let' (net)?",
    options: [
      "Punkt zdobyty bezpośrednio z zagrywki",
      "Konieczność powtórzenia serwisu, ponieważ piłka dotknęła siatki i spadła na pole odbiorcy",
      "Przekroczenie limitu czasu na zagranie",
      "Uszkodzenie rakietki przez zawodnika"
    ],
    correct: 1,
    explanation: "Jeśli piłka przy serwisie dotknie siatki, a potem spadnie poprawnie na pole rywala, sędzia ogłasza 'let' i serwis jest powtarzany bez straty punktu."
  },
  {
    id: 116,
    category: "przepisy",
    difficulty: "srednie",
    question: "Z jakiej odległości (linii) wykonuje się rzuty karne w piłce ręcznej?",
    options: ["6 metrów", "7 metrów", "9 metrów", "10 metrów"],
    correct: 1,
    explanation: "Rzuty karne w piłce ręcznej są wykonywane z linii rzutów karnych oddalonej o 7 metrów od bramki."
  },
  {
    id: 117,
    category: "przepisy",
    difficulty: "trudne",
    question: "Ilu sędziów na boisku (nie licząc technicznych i VAR) sędziuje oficjalny mecz futbolu amerykańskiego w lidze NFL?",
    options: ["3 sędziów", "5 sędziów", "7 sędziów", "9 sędziów"],
    correct: 2,
    explanation: "Oficjalny mecz NFL jest sędziowany przez 7 sędziów boiskowych, z których każdy odpowiada za inne strefy i aspekty gry."
  },
  {
    id: 118,
    category: "przepisy",
    difficulty: "srednie",
    question: "Ile setów musi wygrać zawodnik, aby wygrać mecz w siatkówce plażowej?",
    options: ["2 sety", "3 sety", "5 setów", "1 set"],
    correct: 0,
    explanation: "Mecz siatkówki plażowej gra się do 2 wygranych setów (best of 3). Pierwsze dwa sety gra się do 21 punktów, ewentualny tie-break do 15."
  },
  {
    id: 119,
    category: "przepisy",
    difficulty: "trudne",
    question: "W baseballu, ile autów (outs) musi zaliczyć drużyna broniąca w jednej połowie inningu, aby nastąpiła zmiana stron?",
    options: ["2 auty", "3 auty", "4 auty", "6 autów"],
    correct: 1,
    explanation: "Aby zakończyć połowę inningu, drużyna broniąca musi wyautować 3 zawodników drużyny atakującej."
  },
  {
    id: 120,
    category: "przepisy",
    difficulty: "trudne",
    question: "Jakie wymiary (długość i szerokość) ma oficjalny stół do gry w snookera (wymiar 12-stopowy)?",
    options: ["3,57 x 1,78 m", "3,82 x 1,91 m", "3,20 x 1,60 m", "3,00 x 1,50 m"],
    correct: 0,
    explanation: "Standardowy stół snookerowy o rozmiarze 12 stóp ma pole gry o wymiarach dokładnie 3569 mm długości na 1778 mm szerokości."
  },
  {
    id: 121,
    category: "wyniki",
    difficulty: "latwe",
    question: "Jaki rekord bramek w jednym sezonie niemiecznej Bundesligi ustanowił Robert Lewandowski w sezonie 2020/2021?",
    options: ["38 bramek", "40 bramek", "41 bramek", "42 bramki"],
    correct: 2,
    explanation: "Robert Lewandowski zdobył 41 bramek w sezonie 2020/2021, bijąc 49-letni rekord Gerda Müllera (40 bramek)."
  },
  {
    id: 122,
    category: "wyniki",
    difficulty: "trudne",
    question: "Jaki jest aktualny rekord świata kobiet w skoku o tyczce na otwartym stadionie, należący do Jeleny Isinbajewej od 2009 roku?",
    options: ["5,00 m", "5,06 m", "5,12 m", "5,15 m"],
    correct: 1,
    explanation: "Rosjanka Jelena Isinbajewa skoczyła 5,06 m podczas mityngu w Zurychu w 2009 roku. Rekord halted pozostaje niepobity."
  },
  {
    id: 123,
    category: "wyniki",
    difficulty: "trudne",
    question: "Który maratończyk jako jedyny w oficjalnym biegu (ale nie w warunkach otwartego rekordu) złamał barierę 2 godzin w Wiedniu w 2019 roku (czas 1:59:40)?",
    options: ["Eliud Kipchoge", "Kelvin Kiptum", "Kenenisa Bekele", "Haile Gebrselassie"],
    correct: 0,
    explanation: "Kenijczyk Eliud Kipchoge przebiegł dystans maratonu w 1:59:40 w ramach projektu INEOS 1:59 Challenge, jednak wynik nie został uznany za oficjalny rekord świata ze względu na brak otwartej rywalizacji i rotacyjnych pacemakerów."
  },
  {
    id: 124,
    category: "wyniki",
    difficulty: "srednie",
    question: "Ile złotych medali olimpijskich zdobył amerykański pływak Michael Phelps podczas igrzysk w Pekinie w 2008 roku, bijąc rekord Marka Spitza?",
    options: ["6 złotych medali", "7 złotych medali", "8 złotych medali", "9 złotych medali"],
    correct: 2,
    explanation: "Michael Phelps zdobył w Pekinie historyczne 8 złotych medali, wygrywając wszystkie konkurencje, w których startował."
  },
  {
    id: 125,
    category: "wyniki",
    difficulty: "srednie",
    question: "Jaki jest oficjalny rekord pod względem liczby występów w reprezentacji Polski w piłce nożnej mężczyzn (należący do Roberta Lewandowskiego)?",
    options: ["110 meczów", "125 meczów", "ponad 140 meczów", "102 mecze"],
    correct: 2,
    explanation: "Robert Lewandowski rozegrał ponad 140 meczów w barwach narodowych, znacznie wyprzedzając drugiego Jakuba Błaszczykowskiego (109 meczów)."
  },
  {
    id: 126,
    category: "wyniki",
    difficulty: "trudne",
    question: "Polska sztafeta 4x400 m mężczyzn odniosła historyczny sukces na halowych mistrzostwach świata w Maebashi w 1999 r., zdobywając złoto. Kto biegł na ostatniej zmianie?",
    options: ["Robert Maćkowiak", "Piotr Rysiukiewicz", "Tomasz Czubak", "Jacek Bocian"],
    correct: 0,
    explanation: "Robert Maćkowiak przyprowadził polską sztafetę na 1. miejscu, pokonując na finiszu sztafetę USA."
  },
  {
    id: 127,
    category: "wyniki",
    difficulty: "latwe",
    question: "Kto strzelił najwięcej bramek w historii finałów Mistrzostw Świata w piłce nożnej ogółem (16 goli)?",
    options: ["Miroslav Klose", "Ronaldo (Brazylijczyk)", "Pele", "Just Fontaine"],
    correct: 0,
    explanation: "Miroslav Klose strzelił 16 bramek w czterech turniejach (2002-2014), wyprzedzając Brazylijczyka Ronaldo (15 bramek)."
  },
  {
    id: 128,
    category: "wyniki",
    difficulty: "srednie",
    question: "Jakim wynikiem zakończył się słynny mecz 'na wodzie' pomiędzy Polską a RFN we Frankfurcie podczas mundialu w 1974 roku?",
    options: ["0:0", "1:0 dla RFN", "2:1 dla Polski", "2:0 dla RFN"],
    correct: 1,
    explanation: "Niemcy wygrali 1:0 po bramce Gerda Müllera w 76. minucie na zalanym wodą boisku, co zablokowało Polsce awans do finału."
  },
  {
    id: 129,
    category: "wyniki",
    difficulty: "trudne",
    question: "Który kolarz szosowy jako jedyny oficjalnie wygrał wyścig Tour de France 5 razy z rzędu w latach 1991–1995?",
    options: ["Miguel Indurain", "Eddy Merckx", "Bernard Hinault", "Lance Armstrong"],
    correct: 0,
    explanation: "Hiszpan Miguel Indurain zdominował Tour de France, wygrywając go 5 razy z rzędu. Lance Armstrong został wykreślony z tabel z powodu dopingu."
  },
  {
    id: 130,
    category: "wyniki",
    difficulty: "trudne",
    question: "Ile wynosi oficjalny rekord świata w skoku wzwyż mężczyzn (2.45 m), należący do Kubańczyka Javiera Sotomayora od 1993 roku?",
    options: ["2,40 m", "2,43 m", "2,45 m", "2,48 m"],
    correct: 2,
    explanation: "Javier Sotomayor skoczył 2,45 m w hiszpańskiej Salamance w lipcu 1993 roku, co do dziś pozostaje rekordem świata."
  },
  {
    id: 131,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "W jakiej dyscyplinie sportowej złoty medal olimpijski w Atlancie (1996) wywalczyła Renata Mauer-Różańska?",
    options: ["Strzelectwo (karabin pneumatyczny)", "Łucznictwo", "Szermierka (floret)", "Gimnastyka"],
    correct: 0,
    explanation: "Renata Mauer-Różańska zdobyła złoto w karabinie pneumatycznym oraz brąz w karabinie w trzech postawach w Atlancie."
  },
  {
    id: 132,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Który polski skoczek wzwyż zdobył trzy medale olimpijskie (srebro w Moskwie 1980 i Atlancie 1996, brąz w Seulu 1988)?",
    options: ["Artur Partyka", "Jacek Wszoła", "Edward Sarul", "Robert Wolski"],
    correct: 0,
    explanation: "Artur Partyka to jeden z najwybitniejszych polskich lekkoatletów, wielokrotny medalista IO i mistrzostw świata."
  },
  {
    id: 133,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Szymon Kołecki zdobył dwa medale olimpijskie w podnoszeniu ciężarów (srebro w Sydney 2000, złoto w Pekinie 2008). W jakiej kategorii wagowej startował?",
    options: ["do 94 kg", "do 85 kg", "do 105 kg", "ponad 105 kg"],
    correct: 0,
    explanation: "Szymon Kołecki odnosił sukcesy w kategorii lekkociężkiej do 94 kg."
  },
  {
    id: 134,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Który polski panczenista zdobył złoty medal olimpijski na dystansie 1500 m podczas ZIO w Soczi w 2014 roku, wygrywając o 0.003 sekundy?",
    options: ["Zbibiew Bródka", "Konrad Niedźwiedzki", "Jan Szymański", "Sebastian Kłosiński"],
    correct: 0,
    explanation: "Zbigniew Bródka, zawodowy strażak, wygrał z Holendrem Koenem Verweijem o minimalne 3 tysięczne sekundy."
  },
  {
    id: 135,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "Jak nazywają się polskie wioślarki, które wywalczyły złoty medal w dwójce podwójnej podczas igrzysk w Rio de Janeiro w 2016 roku?",
    options: [
      "Magdalena Fularczyk-Kozłowska i Natalia Madaj",
      "Agnieszka Kobus-Zawojska i Maria Sajdak",
      "Marta Wieliczko i Katarzyna Zillmann",
      "Joanna Hentka i Karolina Naja"
    ],
    correct: 0,
    explanation: "Magdalena Fularczyk-Kozłowska oraz Natalia Madaj popłynęły po złoty medal olimpijski na torze w Rio."
  },
  {
    id: 136,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Który polski młociarz zdobył złoty medal olimpijski w Tokio w 2021 roku z wynikiem 82.52 m?",
    options: ["Wojciech Nowicki", "Paweł Fajdek", "Szymon Ziółkowski", "Piotr Małachowski"],
    correct: 0,
    explanation: "Wojciech Nowicki zdominował konkurs olimpijski w Tokio, zdobywając upragniony złoty medal (Paweł Fajdek zdobył brąz)."
  },
  {
    id: 137,
    category: "olimpijczycy",
    difficulty: "trudne",
    question: "Jak nazywa się polski gimnastyk sportowy, mistrz olimpijski z Pekinu (2008) w skoku?",
    options: ["Leszek Blanik", "Piotr Sawicki", "Roman Kulesza", "krajowy mistrz gimnastyki"],
    correct: 0,
    explanation: "Leszek Blanik zdobył złoty medal olimpijski w skoku w Pekinie w 2008 roku (oraz brąz w Sydney w 2000 r.)."
  },
  {
    id: 138,
    category: "olimpijczycy",
    difficulty: "srednie",
    question: "W jakiej dyscyplinie sportowej brązowy medal olimpijski w Londynie (2012) wywalczyła Zofia Klepacka?",
    options: ["Windsurfing (klasa RS:X)", "Żeglarstwo (klasa Laser)", "Kajakarstwo", "Pływanie długodystansowe"],
    correct: 0,
    explanation: "Zofia Noceti-Klepacka zdobyła brązowy medal w klasie windsurfingowej RS:X na igrzyskach w Londynie."
  },
  {
    id: 139,
    category: "olimpijczycy",
    difficulty: "trudne",
    question: "Który lekkoatleta jako jedyny Polak obronił tytuł mistrza olimpijskiego w trójskoku, zdobywając złoto w Rzymie (1960) i Tokio (1964)?",
    options: ["Józef Szmidt", "Zdzisław Krzyszkowiak", "Edward Sarul", "Michał Joachimowski"],
    correct: 0,
    explanation: "Józef Szmidt, zwany 'śląskim kangurem', był dwukrotnym mistrzem olimpijskim i pierwszym człowiekiem, który skoczył ponad 17 metrów."
  },
  {
    id: 140,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Która polska lekkoatletka zdobyła złoty medal w rzucie młotem podczas igrzysk w Sydney, Rio oraz Tokio (trzy złota olimpijskie)?",
    options: ["Anita Włodarczyk", "Kamila Skolimowska", "Malwina Kopron", "Maria Andrejczyk"],
    correct: 0,
    explanation: "Anita Włodarczyk jest trzykrotną mistrzynią olimpijską, zdobywając złote medale w Londynie (2012), Rio (2016) i Tokio (2020)."
  },
  {
    id: 141,
    category: "ogolne",
    difficulty: "latwe",
    question: "Jak nazywa się międzynarodowa organizacja powołana do walki z dopingiem w sporcie (założona w 1999 roku)?",
    options: ["WADA", "FIFA", "IOC", "IAAF"],
    correct: 0,
    explanation: "WADA (World Anti-Doping Agency) to Światowa Agencja Antydopingowa odpowiedzialna za kontrole i kodeks antydopingowy."
  },
  {
    id: 142,
    category: "ogolne",
    difficulty: "latwe",
    question: "Jaka jest standardowa długość jednego okrążenia na lekkoatletycznym stadionie olimpijskim?",
    options: ["300 metrów", "400 metrów", "500 metrów", "600 metrów"],
    correct: 1,
    explanation: "Standardowa bieżnia stadionu lekkoatletycznego ma długość dokładnie 400 metrów."
  },
  {
    id: 143,
    category: "ogolne",
    difficulty: "srednie",
    question: "W którym kraju narodziła się sztuka walki judo (stworzona przez Jigoro Kano pod koniec XIX wieku)?",
    options: ["Chiny", "Japonia", "Korea", "Tajlandia"],
    correct: 1,
    explanation: "Judo wywodzi się bezpośrednio z Japonii i opiera na chwytach, rzutach i dźwigniach."
  },
  {
    id: 144,
    category: "ogolne",
    difficulty: "latwe",
    question: "Ilu zawodników jednej drużyny przebywa na boisku podczas meczu siatkówki plażowej?",
    options: ["2 zawodników", "4 zawodników", "6 zawodników", "8 zawodników"],
    correct: 0,
    explanation: "W siatkówce plażowej każda drużyna składa się z dokładnie 2 zawodników i na boisku nie ma graczy rezerwowych."
  },
  {
    id: 145,
    category: "ogolne",
    difficulty: "latwe",
    question: "Co oznacza skrót NBA w odniesieniu do amerykańskich rozgrywek koszykarskich?",
    options: [
      "National Basketball Association",
      "New Basketball Alliance",
      "National Ball Association",
      "North Basketball Association"
    ],
    correct: 0,
    explanation: "NBA to skrót od National Basketball Association (Krajowe Stowarzyszenie Koszykówki), założonego w USA w 1946 roku."
  },
  {
    id: 146,
    category: "ogolne",
    difficulty: "srednie",
    question: "Który sport walki uprawia się z użyciem broni zwanej floret, szpada lub szabla?",
    options: ["Kendo", "Szermierka", "Boks tajski", "Zapasy"],
    correct: 1,
    explanation: "Szermierka olimpijska obejmuje walki trzema rodzajami broni białej: floretem, szpadą oraz szablą."
  },
  {
    id: 147,
    category: "ogolne",
    difficulty: "srednie",
    question: "Jak nazywa się nagroda przyznawana corocznie najlepszemu strzelcowi hiszpańskiej ligi piłkarskiej (La Liga)?",
    options: ["Złoty But", "Trofeo Pichichi", "Trofeo Zamora", "Złota Piłka"],
    correct: 1,
    explanation: "Trofeo Pichichi to nagroda hiszpańskiego dziennika 'Marca' dla króla strzelców Primera División."
  },
  {
    id: 148,
    category: "ogolne",
    difficulty: "trudne",
    question: "Jaka jest średnica tarczy strzeleckiej (czarnego krążka) w biathlonie w pozycji leżącej?",
    options: ["45 mm", "110 mm", "115 mm", "50 mm"],
    correct: 0,
    explanation: "Średnica celu w biathlonie wynosi 45 mm dla pozycji leżącej oraz 115 mm dla pozycji stojącej."
  },
  {
    id: 149,
    category: "ogolne",
    difficulty: "latwe",
    question: "Z ilu graczy składa się drużyna na boisku w hokeju na trawie?",
    options: ["6", "9", "11", "15"],
    correct: 2,
    explanation: "Podobnie jak w piłce nożnej, w hokeju na trawie na boisku występuje po 11 zawodników w każdej drużynie."
  },
  {
    id: 150,
    category: "ogolne",
    difficulty: "srednie",
    question: "Które państwo wygrało najwięcej klasyfikacji medalowych w historii letnich igrzysk olimpijskich?",
    options: ["USA", "ZSRR", "Niemcy", "Wielka Brytania"],
    correct: 0,
    explanation: "Stany Zjednoczone zdobyły najwięcej medali i najczęściej wygrywały klasyfikację medalową letnich igrzysk olimpijskich."
  }
];

const kidsQuestions = [
  // ==========================================
  // HISTORIA POLSKIEGO I ŚWIATOWEGO SPORTU (201-216)
  // ==========================================
  {
    id: 201,
    category: "historia",
    difficulty: "latwe",
    question: "W którym kraju narodziły się starożytne igrzyska olimpijskie?",
    options: ["Grecja", "Rzym / Włochy", "Egipt", "Francja"],
    correct: 0,
    explanation: "Starożytne igrzyska olimpijskie odbywały się w Olimpii w starożytnej Grecji od 776 roku p.n.e."
  },
  {
    id: 202,
    category: "historia",
    difficulty: "latwe",
    question: "Jak nazywa się legendarny polski lekkoatleta, przedwojenny mistrz olimpijski na 10 000 metrów, patron wielu stadionów i szkół?",
    options: ["Janusz Kusociński", "Kamil Stoch", "Robert Lewandowski", "Adam Małysz"],
    correct: 0,
    explanation: "Janusz Kusociński zdobył złoty medal w biegu na 10 000 m w Los Angeles w 1932 roku."
  },
  {
    id: 203,
    category: "historia",
    difficulty: "latwe",
    question: "Który polski skoczek jako pierwszy zdobył medal na zimowych igrzyskach olimpijskich (Sapporo 1972)?",
    options: ["Wojciech Fortuna", "Adam Małysz", "Kamil Stoch", "Piotr Żyła"],
    correct: 0,
    explanation: "Wojciech Fortuna zdobył złoty medal na dużej skoczni w Sapporo w 1972 roku."
  },
  {
    id: 204,
    category: "historia",
    difficulty: "latwe",
    question: "Ile razy reprezentacja Polski w piłce nożnej zajęła 3. miejsce na mistrzostwach świata (w latach 1974 i 1982)?",
    options: ["1 raz", "2 razy", "3 razy", "4 razy"],
    correct: 1,
    explanation: "Polska zdobyła srebrne medale (za 3. miejsce) na mistrzostwach świata w RFN w 1974 r. oraz w Hiszpanii w 1982 r."
  },
  {
    id: 205,
    category: "historia",
    difficulty: "latwe",
    question: "Który polski kolarz szosowy jako pierwszy zdobył medal mistrzostw świata dla Polski i jest organizatorem Tour de Pologne?",
    options: ["Czesław Lang", "Ryszard Szurkowski", "Rafał Majka", "Michał Kwiatkowski"],
    correct: 0,
    explanation: "Czesław Lang to wicemistrz olimpijski z Moskwy (1980), który po zakończeniu kariery został dyrektorem Tour de Pologne."
  },
  {
    id: 206,
    category: "historia",
    difficulty: "latwe",
    question: "Jakim symbolem rozpala się znicz podczas ceremonii otwarcia igrzysk olimpijskich?",
    options: ["Ogniem olimpijskim", "Lampionem", "Zapałkami", "Świeczkami"],
    correct: 0,
    explanation: "Ogień olimpijski jest przenoszony za pomocą sztafety z Grecji do miasta-gospodarza igrzysk."
  },
  {
    id: 207,
    category: "historia",
    difficulty: "latwe",
    question: "Gdzie w Polsce odbywa się co roku słynny noworoczny konkurs skoków narciarskich na Wielkiej Krokwi?",
    options: ["W Zakopanem", "W Wiśle", "W Szczyrku", "Karpaczu"],
    correct: 0,
    explanation: "Zakopane i Wielka Krokiew to stolica polskich skoków narciarskich, gdzie odbywają się zawody Pucharu Świata."
  },
  {
    id: 208,
    category: "historia",
    difficulty: "latwe",
    question: "Jaki sport uprawiał legendarny bokser Muhammad Ali?",
    options: ["Boks", "Zapasy", "Judo", "Karate"],
    correct: 0,
    explanation: "Muhammad Ali był wielokrotnym mistrzem świata wagi ciężkiej i jest uznawany za jednego z najwybitniejszych bokserów w historii."
  },
  {
    id: 209,
    category: "historia",
    difficulty: "latwe",
    question: "W którym roku Polska wspólnie z Ukrainą organizowała Mistrzostwa Europy w piłce nożnej (Euro)?",
    options: ["2008", "2010", "2012", "2016"],
    correct: 2,
    explanation: "Turniej UEFA Euro 2012 odbył się na stadionach Polski i Ukrainy. Finał rozegrano w Kijowie, a mecz otwarcia w Warszawie."
  },
  {
    id: 210,
    category: "historia",
    difficulty: "latwe",
    question: "Jak nazywa się legendarny polski biegacz długodystansowy, mistrz olimpijski z Moskwy (1980) w biegu na 3000 m z przeszkodami, który tragicznie zginął w wypadku?",
    options: ["Bronisław Malinowski", "Janusz Kusociński", "Zdzisław Krzyszkowiak", "Paweł Fajdek"],
    correct: 0,
    explanation: "Bronisław Malinowski był wybitnym biegaczem przeszkodowym, mistrzem (1980) i wicemistrzem olimpijskim (1976)."
  },
  {
    id: 211,
    category: "historia",
    difficulty: "latwe",
    question: "Który polski klub piłkarski jako jedyny dotarł do finału europejskiego pucharu (Puchar Zdobywców Pucharów w 1970 r.)?",
    options: ["Górnik Zabrze", "Legia Warszawa", "Wisła Kraków", "Lech Poznań"],
    correct: 0,
    explanation: "Górnik Zabrze zagrał w finale w 1970 roku, ulegając Manchesterowi City 1:2."
  },
  {
    id: 212,
    category: "historia",
    difficulty: "latwe",
    question: "Jak nazywa się ojczyzna karate i judo – popularnych sztuk walki?",
    options: ["Japonia", "Chiny", "Korea", "Brazylia"],
    correct: 0,
    explanation: "Obie te dyscypliny wywodzą się z Japonii i są obecnie popularnymi sportami olimpijskimi."
  },
  {
    id: 213,
    category: "historia",
    difficulty: "latwe",
    question: "Który polski skoczek narciarski wygrał Puchar Świata cztery razy i zdobył cztery medale olimpijskie na początku XXI wieku?",
    options: ["Adam Małysz", "Kamil Stoch", "Dawid Kubacki", "Piotr Żyła"],
    correct: 0,
    explanation: "Adam Małysz zdominował skoki narciarskie, zdobywając Kryształowe Kule w latach 2001, 2002, 2003 i 2007."
  },
  {
    id: 214,
    category: "historia",
    difficulty: "latwe",
    question: "W jakim mieście w 2024 roku odbyły się letnie igrzyska olimpijskie?",
    options: ["W Paryżu", "W Londynie", "W Rzymie", "W Tokio"],
    correct: 0,
    explanation: "Letnie Igrzyska Olimpijskie w 2024 roku gościł Paryż, stolica Francji."
  },
  {
    id: 215,
    category: "historia",
    difficulty: "latwe",
    question: "Kto był legendarnym trenerem polskich piłkarzy, z którym zdobyliśmy złoto olimpijskie w 1972 r. i trzecie miejsce na świecie w 1974 r.?",
    options: ["Kazimierz Górski", "Hubert Wagner", "Leo Beenhakker", "Adam Nawałka"],
    correct: 0,
    explanation: "Kazimierz Górski jest uznawany za trenera wszech czasów polskiej piłki nożnej."
  },
  {
    id: 216,
    category: "historia",
    difficulty: "latwe",
    question: "Która dyscyplina sportowa jest najstarszą na świecie i obejmuje biegi, rzuty oraz skoki?",
    options: ["Lekkoatletyka", "Piłka nożna", "Gimnastyka", "Zapasy"],
    correct: 0,
    explanation: "Lekkoatletyka jest często nazywana „królową sportu” i stanowiła podstawę starożytnych igrzysk."
  },

  // ==========================================
  // PRZEPISY GRY (217-232)
  // ==========================================
  {
    id: 217,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ile minut trwa cały regulaminowy mecz piłki nożnej (bez dogrywki)?",
    options: ["60 minut", "80 minut", "90 minut", "100 minut"],
    correct: 2,
    explanation: "Mecz piłki nożnej trwa 90 minut, podzielonych na dwie połowy po 45 minut każda."
  },
  {
    id: 218,
    category: "przepisy",
    difficulty: "latwe",
    question: "Z ilu zawodników składa się drużyna na boisku w trakcie meczu siatkówki?",
    options: ["5", "6", "7", "11"],
    correct: 1,
    explanation: "Na boisku w siatkówce w każdej drużynie gra jednocześnie 6 zawodników."
  },
  {
    id: 219,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ile kroków z piłką w dłoniach (bez kozłowania) może zrobić koszykarz, zanim sędzia odgwiżdże błąd kroków?",
    options: ["Maksymalnie 2 kroki", "Maksymalnie 3 kroki", "Dowolną liczbę", "Żadnego kroku"],
    correct: 0,
    explanation: "W koszykówce po zakończeniu kozłowania zawodnik może wykonać maksymalnie dwa kroki przed oddaniem rzutu lub podaniem."
  },
  {
    id: 220,
    category: "przepisy",
    difficulty: "latwe",
    question: "Jaki kolor ma karta pokazana przez sędziego piłkarskiego, która oznacza wykluczenie zawodnika z gry i opuszczenie boiska?",
    options: ["Żółty", "Niebieski", "Czerwony", "Zielony"],
    correct: 2,
    explanation: "Czerwona kartka oznacza natychmiastowe wyrzucenie zawodnika z boiska bez prawa powrotu i konieczność gry w osłabieniu."
  },
  {
    id: 221,
    category: "przepisy",
    difficulty: "latwe",
    question: "Z ilu graczy składa się drużyna na boisku w meczu piłki nożnej?",
    options: ["9 osób", "10 osób", "11 osób", "12 osób"],
    correct: 2,
    explanation: "Na boisku piłkarskim w każdej drużynie występuje 11 zawodników, w tym jeden bramkarz."
  },
  {
    id: 222,
    category: "przepisy",
    difficulty: "latwe",
    question: "Czy w siatkówce wolno odbić piłkę jakąkolwiek częścią ciała (np. nogą lub głową)?",
    options: ["Tak, każdą częścią ciała", "Nie, tylko dłońmi i rękami", "Nie, tylko powyżej pasa", "Tylko klatką piersiową"],
    correct: 0,
    explanation: "Zgodnie z przepisami siatkówki, piłka może dotknąć każdej części ciała zawodnika."
  },
  {
    id: 223,
    category: "przepisy",
    difficulty: "latwe",
    question: "Jak nazywa się błąd w piłce ręcznej polegający na tym, że zawodnik biegnie z piłką bez jej kozłowania więcej niż 3 kroki?",
    options: ["Błąd kroków", "Błąd podwójnego kozłowania", "Spalony", "Błąd szarży"],
    correct: 0,
    explanation: "W piłce ręcznej zawodnik trzymający piłkę może wykonać maksymalnie 3 kroki bez kozłowania."
  },
  {
    id: 224,
    category: "przepisy",
    difficulty: "latwe",
    question: "Co oznacza gwizdek sędziego w piłce nożnej informujący o pozycji „spalonej” (tzw. ofsajd)?",
    options: ["Zawodnik podał do kolegi, który był bliżej bramki rywala niż obrońcy w momencie podania", "Zawodnik faulował bramkarza", "Piłka opuściła boisko za bramką", "Zawodnik dotknął piłki ręką"],
    correct: 0,
    explanation: "Spalony występuje wtedy, gdy w momencie podania zawodnik drużyny atakującej znajduje się na połowie przeciwnika i jest bliżej linii bramkowej niż przedostatni zawodnik drużyny broniącej."
  },
  {
    id: 225,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ile punktów otrzymuje drużyna w koszykówce za celny rzut z rzutów wolnych (po faulu)?",
    options: ["1 punkt", "2 punkty", "3 punkty", "4 punkty"],
    correct: 0,
    explanation: "Rzut wolny w koszykówce wart jest dokładnie 1 punkt."
  },
  {
    id: 226,
    category: "przepisy",
    difficulty: "latwe",
    question: "Co dzieje się w grze w „dwa ognie” (zbijak), gdy zawodnik złapie piłkę rzuconą przez przeciwnika bezpośrednio w ręce (tzw. klapa)?",
    options: ["Zawodnik nie zostaje zbity i gra dalej", "Zawodnik zostaje zbity i schodzi z boiska", "Drużyna traci punkt", "Gra zostaje przerwana"],
    correct: 0,
    explanation: "Złapanie piłki (klapa/chwyt) chroni zawodnika przed zbiciem, a piłka zostaje w posiadaniu jego drużyny."
  },
  {
    id: 227,
    category: "przepisy",
    difficulty: "latwe",
    question: "Czy bramkarz w piłce nożnej może łapać piłkę w ręce poza swoim polem karnym?",
    options: ["Nie, grozi za to rzut wolny lub kartka", "Tak, na całym boisku", "Tak, ale tylko na własnej połowie", "Tak, jeśli piłka leci wysoko"],
    correct: 0,
    explanation: "Bramkarz może grać rękami wyłącznie we własnym polu karnym (tzw. szesnastce)."
  },
  {
    id: 228,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ilu zawodników gra na boisku w drużynie koszykówki podczas meczu?",
    options: ["5 osób", "6 osób", "7 osób", "11 osób"],
    correct: 0,
    explanation: "W klasycznym meczu koszykówki na boisku gra po 5 zawodników w każdej drużynie."
  },
  {
    id: 229,
    category: "przepisy",
    difficulty: "latwe",
    question: "W jakiej dyscyplinie sportowej zawodnik po zdobyciu punktu przebiega przez bazy wokół boiska, aby zdobyć „run”?",
    options: ["Baseball", "Krykiet", "Hokej", "Tenis"],
    correct: 0,
    explanation: "W baseballu celem jest odbicie piłki i przebiegnięcie przez cztery bazy w celu zdobycia punktu."
  },
  {
    id: 230,
    category: "przepisy",
    difficulty: "latwe",
    question: "Co oznacza żółta kartka w piłce nożnej?",
    options: ["Ostrzeżenie dla zawodnika za niesportowe zachowanie lub faul", "Wykluczenie z gry na 2 minuty", "Koniec meczu", "Przyznanie punktu rywalom"],
    correct: 0,
    explanation: "Żółta kartka to oficjalne ostrzeżenie. Dwie żółte kartki w jednym meczu oznaczają czerwoną i wykluczenie z gry."
  },
  {
    id: 231,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ile razy maksymalnie (oprócz bloku) drużyna siatkarska może odbić piłkę, zanim przebije ją na stronę przeciwnika?",
    options: ["2 razy", "3 razy", "4 razy", "5 razy"],
    correct: 1,
    explanation: "Drużyna siatkarska ma prawo do maksymalnie 3 odbić, aby przebić piłkę na stronę rywala."
  },
  {
    id: 232,
    category: "przepisy",
    difficulty: "latwe",
    question: "W jakim sporcie nie wolno dotknąć piłki ręką (z wyjątkiem bramkarza i autów)?",
    options: ["Piłka nożna", "Koszykówka", "Piłka ręczna", "Siatkówka"],
    correct: 0,
    explanation: "W piłce nożnej celowe dotknięcie piłki dłonią lub ręką przez gracza z pola jest faulem."
  },

  // ==========================================
  // WYNIKI I REKORDY (233-248)
  // ==========================================
  {
    id: 233,
    category: "wyniki",
    difficulty: "latwe",
    question: "Kto jest najlepszym strzelcem w historii reprezentacji Polski w piłce nożnej?",
    options: ["Robert Lewandowski", "Włodzimierz Lubański", "Grzegorz Lato", "Zbigniew Boniek"],
    correct: 0,
    explanation: "Robert Lewandowski zdobył najwięcej bramek w barwach narodowych w historii polskiego futbolu."
  },
  {
    id: 234,
    category: "wyniki",
    difficulty: "latwe",
    question: "W jakiej dyscyplinie sportu Polacy zdobyli złoty medal Mistrzostw Świata w 2014 i 2018 roku?",
    options: ["Siatkówka mężczyzn", "Piłka nożna", "Piłka ręczna", "Skoki narciarskie"],
    correct: 0,
    explanation: "Reprezentacja Polski siatkarzy zdobyła dwa mistrzostwa świata z rzędu pod wodzą Stephane'a Antigi (2014) i Vitala Heynena (2018)."
  },
  {
    id: 235,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile metrów ma długość basenu olimpijskiego, na którym odbywają się najważniejsze zawody pływackie?",
    options: ["25 metrów", "50 metrów", "100 metrów", "75 metrów"],
    correct: 1,
    explanation: "Basen olimpijski (tzw. długi basen) ma długość dokładnie 50 metrów. Basen krótki ma 25 metrów."
  },
  {
    id: 236,
    category: "wyniki",
    difficulty: "latwe",
    question: "Jaki dystans ma najsłynniejszy i najkrótszy bieg sprinterski na igrzyskach olimpijskich, wyłaniający „najszybszego człowieka świata”?",
    options: ["60 metrów", "100 metrów", "200 metrów", "400 metrów"],
    correct: 1,
    explanation: "Bieg na 100 metrów jest koronnym dystansem sprinterskim lekkoatletyki."
  },
  {
    id: 237,
    category: "wyniki",
    difficulty: "latwe",
    question: "Z jakiego kraju pochodzi biegacz Usain Bolt, wielokrotny rekordzista świata w sprintach na 100 m i 200 m?",
    options: ["Z Jamajki", "Z USA", "Z Kenii", "Z Wielkiej Brytanii"],
    correct: 0,
    explanation: "Usain Bolt to jamajski sprinter, ośmiokrotny mistrz olimpijski i rekordzista świata w biegach na 100 m i 200 m."
  },
  {
    id: 238,
    category: "wyniki",
    difficulty: "latwe",
    question: "Który polski skoczek narciarski jako jedyny wygrał prestiżowy Turniej Czterech Skoczni trzy razy (w tym wszystkie 4 konkursy w jednej edycji)?",
    options: ["Kamil Stoch", "Adam Małysz", "Dawid Kubacki", "Piotr Żyła"],
    correct: 0,
    explanation: "Kamil Stoch wygrał Turniej Czterech Skoczni w sezonach 2016/17, 2017/18 (wygrywając wszystkie 4 konkursy) oraz 2020/21."
  },
  {
    id: 239,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile złotych medali olimpijskich zdobyła polska lekkoatletka Anita Włodarczyk w rzucie młotem?",
    options: ["1 złoty medal", "2 złote medale", "3 złote medale", "4 złote medale"],
    correct: 2,
    explanation: "Anita Włodarczyk wywalczyła złoto w Londynie (2012), Rio de Janeiro (2016) i Tokio (2020), będąc trzykrotną mistrzynią olimpijską."
  },
  {
    id: 240,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile punktów w meczu koszykówki otrzymuje zespół za celny rzut zza specjalnej linii w kształcie łuku (tzw. rzut z dystansu)?",
    options: ["1 punkt", "2 punkty", "3 punkty", "4 punkty"],
    correct: 2,
    explanation: "Rzut zza linii rzutów za trzy punkty (w koszykówce FIBA oddalonej o 6,75 m) daje drużynie 3 punkty."
  },
  {
    id: 241,
    category: "wyniki",
    difficulty: "latwe",
    question: "Jaki kolor medalu otrzymuje zwycięzca danej konkurencji sportowej na igrzyskach olimpijskich?",
    options: ["Złoty", "Srebrny", "Brązowy", "Biały"],
    correct: 0,
    explanation: "Zwycięzca otrzymuje złoty medal, zdobywca drugiego miejsca srebrny, a trzeciego brązowy."
  },
  {
    id: 242,
    category: "wyniki",
    difficulty: "latwe",
    question: "Jak nazywa się legendarna polska tenisistka stołowa, wielokrotna mistrzyni i medalistka paraolimpijska, która grała też na igrzyskach dla sprawnych sportowców?",
    options: ["Natalia Partyka", "Li Qian", "Lucjan Błaszczyk", "Samuel Kulczycki"],
    correct: 0,
    explanation: "Natalia Partyka to wybitna tenisistka stołowa, reprezentująca Polskę zarówno na Igrzyskach Olimpijskich, jak i Paraolimpijskich."
  },
  {
    id: 243,
    category: "wyniki",
    difficulty: "latwe",
    question: "Który polski lekkoatleta w chodzie sportowym zdobył aż 4 złote medale olimpijskie i jest jednym z najbardziej utytułowanych polskich sportowców?",
    options: ["Robert Korzeniowski", "Bronisław Malinowski", "Wojciech Nowicki", "Dawid Tomala"],
    correct: 0,
    explanation: "Robert Korzeniowski wygrał chód na 50 km (Atlanta 1996, Sydney 2000, Ateny 2004) oraz chód na 20 km (Sydney 2000)."
  },
  {
    id: 244,
    category: "wyniki",
    difficulty: "latwe",
    question: "W jakiej dyscyplinie sportu polska sztafeta kobiet (nazwana Aniołkami Matusińskiego) zdobywała medale mistrzostw świata i igrzysk w biegu 4x400 m?",
    options: ["Lekkoatletyka (biegi)", "Pływanie", "Wioślarstwo", "Biathlon"],
    correct: 0,
    explanation: "Polska sztafeta 4x400 metrów prowadzona przez Aleksandra Matusińskiego odnosiła ogromne sukcesy na arenie międzynarodowej."
  },
  {
    id: 245,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile sekund ma minuta gry w sportach zespołowych (oraz ogólnie w czasie)?",
    options: ["50 sekund", "60 sekund", "80 sekund", "100 sekund"],
    correct: 1,
    explanation: "Każda minuta, także ta mierzona na stoperze sędziowskim, ma dokładnie 60 sekund."
  },
  {
    id: 246,
    category: "wyniki",
    difficulty: "latwe",
    question: "Która polska biegaczka narciarska zdobyła 5 medali olimpijskich i wygrała prestiżowy bieg Tour de Ski cztery razy z rzędu?",
    options: ["Justyna Kowalczyk", "Marit Bjoergen", "Therese Johaug", "Sylwia Jaśkowiec"],
    correct: 0,
    explanation: "Justyna Kowalczyk to wybitna biegaczka narciarska, mistrzyni olimpijska z Vancouver (2010) i Soczi (2014)."
  },
  {
    id: 247,
    category: "wyniki",
    difficulty: "latwe",
    question: "W jakiej dyscyplinie sportowej mistrzem świata w rajdach samochodowych (kategorii WRC2) i wielokrotnym zwycięzcą Rajdu Polski był Kajetan Kajetanowicz?",
    options: ["Rajdy samochodowe", "Formuła 1", "Motocross", "Kolarstwo"],
    correct: 0,
    explanation: "Kajetan Kajetanowicz to jeden z najbardziej utytułowanych polskich kierowców rajdowych."
  },
  {
    id: 248,
    category: "wyniki",
    difficulty: "latwe",
    question: "Jaki jest najwyższy możliwy wynik (w punktach) za jeden rzut w popularnej grze w rzutki (dart) do tarczy?",
    options: ["20 punktów", "50 punktów", "60 punktów", "100 punktów"],
    correct: 2,
    explanation: "Najwyższy wynik to trafienie w potrójne pole liczby 20 (tzw. potrójna dwudziestka), co daje 60 punktów."
  },

  // ==========================================
  // OLIMPIJCZYCY I GWIAZDY SPORTU (249-264)
  // ==========================================
  {
    id: 249,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jak nazywa się wybitna polska tenisistka, liderka rankingu WTA, która wygrała turnieje wielkoszlemowe, w tym wielokrotnie Roland Garros w Paryżu?",
    options: ["Iga Świątek", "Agnieszka Radwańska", "Magda Linette", "Maryla Rodowicz"],
    correct: 0,
    explanation: "Iga Świątek to polska tenisistka, która zapisała się w historii jako wielokrotna zwyciężczyni turniejów wielkoszlemowych."
  },
  {
    id: 250,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Który polski lekkoatleta specjalizuje się w rzucie młotem, jest pięciokrotnym mistrzem świata i mistrzem olimpijskim z Tokio (2020)?",
    options: ["Paweł Fajdek", "Wojciech Nowicki", "Piotr Małachowski", "Konrad Bukowiecki"],
    correct: 1,
    explanation: "Wojciech Nowicki zdobył złoty medal olimpijski w Tokio w rzucie młotem, a Paweł Fajdek brązowy medal."
  },
  {
    id: 251,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jak nazywa się polski piłkarz grający na pozycji napastnika, który występował w Bayernie Monachium i FC Barcelona?",
    options: ["Robert Lewandowski", "Arkadiusz Milik", "Piotr Zieliński", "Wojciech Szczęsny"],
    correct: 0,
    explanation: "Robert Lewandowski to kapitan reprezentacji Polski i jeden z najlepszych napastników na świecie."
  },
  {
    id: 252,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "W jakiej dyscyplinie sportu sukcesy święci polska sportsmenka Aleksandra Mirosław, mistrzyni olimpijska i rekordzistka świata?",
    options: ["Wspinaczka sportowa (na czas)", "Pływanie", "Biegi płotkarskie", "Gimnastyka artystyczna"],
    correct: 0,
    explanation: "Aleksandra Mirosław to wybitna polska zawodniczka we wspinaczce na czas, wielokrotna mistrzyni i rekordzistka globu."
  },
  {
    id: 253,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jak nazywa się polski skoczek narciarski, trzykrotny indywidualny mistrz olimpijski, który zdobył złote medale w Soczi i Pjongczangu?",
    options: ["Kamil Stoch", "Adam Małysz", "Dawid Kubacki", "Piotr Żyła"],
    correct: 0,
    explanation: "Kamil Stoch zdobył dwa złote medale w Soczi (2014) oraz jeden w Pjongczangu (2018)."
  },
  {
    id: 254,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Z jakiego sportu znana jest Maja Włoszczowska, dwukrotna wicemistrzyni olimpijska?",
    options: ["Kolarstwo górskie (MTB)", "Pływanie synchroniczne", "Wioślarstwo", "Narciarstwo alpejskie"],
    correct: 0,
    explanation: "Maja Włoszczowska zdobyła srebrne medale olimpijskie w Pekinie (2008) oraz w Rio de Janeiro (2016) w kolarstwie górskim."
  },
  {
    id: 255,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jaki sport uprawia polski zawodnik Hubert Hurkacz?",
    options: ["Tenis ziemny", "Koszykówka", "Siatkówka", "Golf"],
    correct: 0,
    explanation: "Hubert Hurkacz to najlepszy obecnie polski tenisista, zwycięzca wielu prestiżowych turniejów ATP."
  },
  {
    id: 256,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Z jakiego sportu znana jest Bartosz Kurek, kapitan reprezentacji Polski, uznany za najlepszego siatkarza świata?",
    options: ["Piłka siatkowa", "Piłka ręczna", "Piłka nożna", "Hokej na lodzie"],
    correct: 0,
    explanation: "Bartosz Kurek to legendarny polski atakujący i lider siatkarskiej kadry narodowej."
  },
  {
    id: 257,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Która polska lekkoatletka, specjalizująca się w rzucie młotem, pobiła rekord świata i jako pierwsza kobieta rzuciła młotem ponad 80 metrów?",
    options: ["Anita Włodarczyk", "Kamila Skolimowska", "Maria Andrejczyk", "Pia Skrzyszowska"],
    correct: 0,
    explanation: "Anita Włodarczyk jest absolutną rekordzistką świata w rzucie młotem z wynikiem 82,98 m."
  },
  {
    id: 258,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jak nazywa się polski skoczek narciarski znany z ogromnego poczucia humoru, który dwukrotnie zdobył złoty medal mistrzostw świata w skokach na skoczni normalnej?",
    options: ["Piotr Żyła", "Kamil Stoch", "Dawid Kubacki", "Aleksander Zniszczoł"],
    correct: 0,
    explanation: "Piotr Żyła zdobył złote medale mistrzostw świata w Oberstdorfie (2021) oraz Planicy (2023)."
  },
  {
    id: 259,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "W jakiej dyscyplinie sportu cztery medale olimpijskie (w tym 3 złote) zdobyła Irena Szewińska?",
    options: ["Lekkoatletyka (sprinty i skok w dal)", "Pływanie", "Wioślarstwo", "Szermierka"],
    correct: 0,
    explanation: "Irena Szewińska to najwybitniejsza polska sportsmenka, wielokrotna rekordzistka świata i medalistka igrzysk."
  },
  {
    id: 260,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jak nazywa się polski lekkoatleta, mistrz olimpijski z Tokio (2020) w chodzie na 50 kilometrów?",
    options: ["Dawid Tomala", "Robert Korzeniowski", "Paweł Fajdek", "Piotr Lisek"],
    correct: 0,
    explanation: "Dawid Tomala sprawił wielką niespodziankę, wygrywając chód na 50 km podczas igrzysk w Tokio w 2021 roku."
  },
  {
    id: 261,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jak nazywa się polski koszykarz, który przez wiele lat grał w amerykańskiej lidze NBA w takich drużynach jak Phoenix Suns czy Washington Wizards?",
    options: ["Marcin Gortat", "Jeremy Sochan", "Maciej Lampe", "Aleksander Balcerowski"],
    correct: 0,
    explanation: "Marcin Gortat, zwany „Polish Hammer”, spędził w NBA 12 sezonów i jako jedyny Polak zagrał w finale tej ligi."
  },
  {
    id: 262,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "W jakiej dyscyplinie sportu polska osada wioślarska kobiet (tzw. Czwórka Podwójna) zdobyła medal olimpijski w Tokio?",
    options: ["Wioślarstwo", "Kajakarstwo", "Żeglarstwo", "Pływanie"],
    correct: 0,
    explanation: "Czwórka podwójna kobiet zdobyła srebrny medal na igrzyskach olimpijskich w Tokio."
  },
  {
    id: 263,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Który polski skoczek narciarski, brązowy medalista olimpijski z Pekinu, słynie z bardzo spokojnego i precyzyjnego stylu skakania?",
    options: ["Dawid Kubacki", "Kamil Stoch", "Maciej Kot", "Stefan Hula"],
    correct: 0,
    explanation: "Dawid Kubacki to mistrz świata z Seefeld (2019) oraz brązowy medalista igrzysk w Pekinie (2022)."
  },
  {
    id: 264,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jak nazywa się polska mistrzyni olimpijska z Sydney (2000) w rzucie młotem, która zdobyła złoto mając zaledwie 17 lat i której pamięci poświęcony jest coroczny memoriał?",
    options: ["Kamila Skolimowska", "Anita Włodarczyk", "Joanna Fiodorow", "Malwina Kopron"],
    correct: 0,
    explanation: "Kamila Skolimowska była najmłodszą polską mistrzynią olimpijską. Zmarła nagle w 2009 roku w wieku 26 lat."
  },

  // ==========================================
  // WIEDZA OGÓLNA I WF (265-280)
  // ==========================================
  {
    id: 265,
    category: "ogolne",
    difficulty: "latwe",
    question: "Co należy zrobić bezpośrednio przed każdym treningiem lub lekcją WF, aby przygotować mięśnie i stawy do wysiłku?",
    options: ["Rozgrzewkę", "Rozciąganie statyczne", "Odpoczynek", "Zjeść duży posiłek"],
    correct: 0,
    explanation: "Rozgrzewka podnosi temperaturę ciała, przyspiesza tętno i przygotowuje mięśnie do intensywnego wysiłku, zapobiegając kontuzjom."
  },
  {
    id: 266,
    category: "ogolne",
    difficulty: "latwe",
    question: "Jaki kolor ma flaga olimpijska, na której znajduje się pięć kolorowych splecionych kół?",
    options: ["Biały", "Niebieski", "Żółty", "Czerwony"],
    correct: 0,
    explanation: "Flaga olimpijska ma białe tło, które symbolizuje pokój i czystość sportowej rywalizacji."
  },
  {
    id: 267,
    category: "ogolne",
    difficulty: "latwe",
    question: "Ile kółek znajduje się na fladze olimpijskiej i co one symbolizują?",
    options: ["5 kółek – symbolizują 5 kontynentów zamieszkanych przez ludzi", "3 kółka – symbolizują rodzaje medali", "6 kółek – symbolizują kontynenty", "4 kółka – symbolizują pory roku"],
    correct: 0,
    explanation: "Pięć splecionych kół symbolizuje jedność pięciu kontynentów: Europy, Azji, Afryki, Ameryki i Australii z Oceanią."
  },
  {
    id: 268,
    category: "ogolne",
    difficulty: "latwe",
    question: "Co to jest „fair play” w sporcie?",
    options: ["Czysta, uczciwa gra z szacunkiem dla przeciwnika i zasad", "Szybki atak na bramkę rywala", "Zasada gry bez bramkarza", "Rzucenie ręcznika na ring"],
    correct: 0,
    explanation: "Fair play to podstawa etyki sportowej. Oznacza uczciwą rywalizację, szacunek dla rywala i sędziów oraz przestrzeganie reguł."
  },
  {
    id: 269,
    category: "ogolne",
    difficulty: "latwe",
    question: "W jakiej dyscyplinie sportowej używa się rakiety, małej siatki pośrodku stołu oraz lekkiej, plastikowej piłeczki?",
    options: ["Tenis stołowy (ping-pong)", "Tenis ziemny", "Badminton", "Squash"],
    correct: 0,
    explanation: "Tenis stołowy jest popularną grą rekreacyjną oraz dyscypliną olimpijską."
  },
  {
    id: 270,
    category: "ogolne",
    difficulty: "latwe",
    question: "W jakiej wodnej dyscyplinie sportowej zawodnicy ścigają się na dystansach, używając takich stylów jak kraul, żabka czy motylkowy?",
    options: ["Pływanie", "Wioślarstwo", "Kajakarstwo", "Żeglarstwo"],
    correct: 0,
    explanation: "Pływanie to jedna z najważniejszych dyscyplin letnich igrzysk olimpijskich."
  },
  {
    id: 271,
    category: "ogolne",
    difficulty: "latwe",
    question: "Który napój jest najbardziej wskazany do picia podczas lekcji WF i treningu sportowego, aby odpowiednio nawodnić organizm?",
    options: ["Woda niegazowana", "Sok owocowy", "Napoje gazowane (np. cola)", "Herbata z cukrem"],
    correct: 0,
    explanation: "Czysta woda najlepiej nawadnia organizm podczas wysiłku fizycznego, nie dostarczając zbędnego cukru."
  },
  {
    id: 272,
    category: "ogolne",
    difficulty: "latwe",
    question: "Jak nazywa się urządzenie służące do mierzenia liczby wykonanych kroków w ciągu dnia?",
    options: ["Krokomierz (pedometr)", "Stoper", "Termometr", "Ciśnieniomierz"],
    correct: 0,
    explanation: "Krokomierz mierzy liczbę kroków na podstawie ruchu ciała. Dziś jest funkcją niemal każdego smartfona lub opaski sportowej."
  },
  {
    id: 273,
    category: "ogolne",
    difficulty: "latwe",
    question: "W jakim sporcie zimowym zawodnicy zjeżdżają ze stoku na jednej szerokiej desce przymocowanej do butów?",
    options: ["Snowboard", "Narciarstwo alpejskie", "Saneczkarstwo", "Łyżwiarstwo"],
    correct: 0,
    explanation: "Snowboarding to popularny sport zimowy, polegający na jeździe i wykonywaniu ewolucji na desce snowboardowej."
  },
  {
    id: 274,
    category: "ogolne",
    difficulty: "latwe",
    question: "Jaki przyrząd gimnastyczny w kształcie koła jest kręcony wokół bioder, talii lub rąk podczas ćwiczeń?",
    options: ["Hula-hoop", "Skakanka", "Wstążka", "Piłka lekarska"],
    correct: 0,
    explanation: "Kręcenie hula-hoop to doskonałe ćwiczenie na mięśnie brzucha i koordynację ruchową."
  },
  {
    id: 275,
    category: "ogolne",
    difficulty: "latwe",
    question: "Co należy zrobić po zakończeniu intensywnego treningu, aby uspokoić organizm i rozluźnić mięśnie?",
    options: ["Rozciąganie statyczne i wyciszenie (cool down)", "Szybki sprint na 100 m", "Zjeść chipsy", "Od razu pójść spać"],
    correct: 0,
    explanation: "Faza wyciszenia i lekkie rozciąganie po wysiłku przyspieszają regenerację i zapobiegają bólom mięśniowym."
  },
  {
    id: 276,
    category: "ogolne",
    difficulty: "latwe",
    question: "W jakim sporcie zawodnik próbuje trafić ciężką kulą w ustawione na końcu toru kręgle?",
    options: ["Bowling (kręgle)", "Bilard", "Bole", "Curling"],
    correct: 0,
    explanation: "W bowlingu celem jest strącenie jak największej liczby kręgli za pomocą specjalnej kuli z otworami na palce."
  },
  {
    id: 277,
    category: "ogolne",
    difficulty: "latwe",
    question: "Który z tych sportów jest sportem zespołowym (gra się w drużynie)?",
    options: ["Siatkówka", "Bieg maratoński", "Tenis ziemny (singiel)", "Skok o tyczce"],
    correct: 0,
    explanation: "Siatkówka to typowy sport drużynowy, w którym współdziała 6 zawodników na boisku."
  },
  {
    id: 278,
    category: "ogolne",
    difficulty: "latwe",
    question: "Jak nazywa się miękka mata, na której ćwiczy się przewroty w tył i w przód na lekcji WF, aby chronić kręgosłup i głowę?",
    options: ["Materac gimnastyczny", "Karimata", "Trampolina", "Ławka gimnastyczna"],
    correct: 0,
    explanation: "Materac amortyzuje upadki i chroni ciało podczas ćwiczeń gimnastycznych i akrobatycznych."
  },
  {
    id: 279,
    category: "ogolne",
    difficulty: "latwe",
    question: "W jakim sporcie używa się okularów pływackich i czepka?",
    options: ["Pływanie", "Narciarstwo", "Kolarstwo", "Wspinaczka"],
    correct: 0,
    explanation: "Czepek chroni włosy i zmniejsza opór wody, a okularki pozwalają widzieć pod wodą i chronią oczy przed chlorem."
  },
  {
    id: 280,
    category: "ogolne",
    difficulty: "latwe",
    question: "Ile wynosi zalecana przez lekarzy i sportowców minimalna dzienna liczba kroków dla zdrowego stylu życia człowieka?",
    options: ["Około 8 000 - 10 000 kroków", "Około 1 000 kroków", "Dokładnie 500 kroków", "Około 100 000 kroków"],
    correct: 0,
    explanation: "Wykonanie ok. 8-10 tysięcy kroków dziennie wspiera pracę serca, poprawia kondycję i pomaga zachować zdrowie."
  }
];

const juniorsQuestions = [
  // ==========================================
  // OGÓLNA WIEDZA SPORTOWA (301-310)
  // ==========================================
  {
    id: 301,
    category: "ogolne",
    difficulty: "latwe",
    question: "W jakim sporcie jeździ się na rowerze?",
    options: ["W kolarstwie", "W bieganiu", "W pływaniu", "W skokach narciarskich"],
    correct: 0,
    explanation: "Jazda na rowerze to kolarstwo. Możemy jeździć na rowerze szosowym, górskim lub miejskim."
  },
  {
    id: 302,
    category: "ogolne",
    difficulty: "latwe",
    question: "Co zakładamy na głowę podczas jazdy na rowerze lub hulajnodze, aby być bezpiecznym?",
    options: ["Czapkę z daszkiem", "Kask", "Kapelusz", "Opaskę"],
    correct: 1,
    explanation: "Kask chroni naszą głowę przed uderzeniem, gdybyśmy przypadkowo spadli z roweru lub hulajnogi."
  },
  {
    id: 303,
    category: "ogolne",
    difficulty: "latwe",
    question: "Na czym zjeżdża się zimą ze śnieżnej górki dla zabawy?",
    options: ["Na sankach", "Na rowerze", "Na wrotkach", "Na deskorolce"],
    correct: 0,
    explanation: "Sanki mają płozy, które świetnie ślizgają się po śniegu, dając dzieciom mnóstwo radości zimą."
  },
  {
    id: 304,
    category: "ogolne",
    difficulty: "latwe",
    question: "Co jest potrzebne do gry w tenisa lub badmintona, aby móc odbić piłeczkę lub lotkę?",
    options: ["Rakieta", "Kij baseballowy", "Wiosło", "Tarcza"],
    correct: 0,
    explanation: "Rakietą tenisową lub rakietką do badmintona odbijamy piłkę lub lotkę nad siatką na stronę przeciwnika."
  },
  {
    id: 305,
    category: "ogolne",
    difficulty: "latwe",
    question: "Ile kółek ma klasyczna hulajnoga dla starszych dzieci?",
    options: ["Dwa", "Trzy", "Cztery", "Pięć"],
    correct: 0,
    explanation: "Klasyczna hulajnoga ma dwa kółka – jedno z przodu, a drugie z tyłu, i wymaga utrzymania równowagi."
  },
  {
    id: 306,
    category: "ogolne",
    difficulty: "latwe",
    question: "W co rzucamy dużą pomarańczową piłką, aby zdobyć punkty w koszykówce?",
    options: ["Do metalowego kosza z siatką", "Do bramki", "W kręgle", "W tarczę na ziemi"],
    correct: 0,
    explanation: "W koszykówce punkty zdobywa się przez wrzucenie piłki do kosza zawieszonego wysoko na tablicy."
  },
  {
    id: 307,
    category: "ogolne",
    difficulty: "latwe",
    question: "Na jakich specjalnych butach jeździ się zimą po lodowisku?",
    options: ["Na łyżwach", "Na rolkach", "Na nartach", "W kaloszach"],
    correct: 0,
    explanation: "Łyżwy mają pod podeszwą metalowe płozy, które pozwalają nam ślizgać się i wykonywać akrobacje na lodzie."
  },
  {
    id: 308,
    category: "ogolne",
    difficulty: "latwe",
    question: "Gdzie możemy bezpiecznie pływać zimą, gdy woda w jeziorach i morzu jest zamarznięta?",
    options: ["Na krytym basenie", "W wannie", "W rzece pod lodem", "W kałuży"],
    correct: 0,
    explanation: "Kryte baseny mają ciepłą wodę i dach, dzięki czemu możemy uczyć się pływać przez cały rok."
  },
  {
    id: 309,
    category: "ogolne",
    difficulty: "latwe",
    question: "Jak nazywa się duża, sprężysta siatka rozpięta na metalowej ramie, na której można skakać wysoko w górę?",
    options: ["Trampolina", "Materac", "Huśtawka", "Zjeżdżalnia"],
    correct: 0,
    explanation: "Skakanie na trampolinie to świetna zabawa i dobre ćwiczenie na wzmocnienie mięśni nóg."
  },
  {
    id: 310,
    category: "ogolne",
    difficulty: "latwe",
    question: "Jak nazywają się buty z przymocowanymi kółkami w jednym rzędzie, na których jeździmy po asfalcie?",
    options: ["Rolki", "Łyżwy", "Trampki", "Kalosze"],
    correct: 0,
    explanation: "Rolki mają kółka w linii prostej. Podobne do nich wrotki mają kółka rozmieszczone po bokach."
  },

  // ==========================================
  // PRZEPISY GRY I REGUŁY (311-320)
  // ==========================================
  {
    id: 311,
    category: "przepisy",
    difficulty: "latwe",
    question: "Czym NIE wolno dotykać piłki w grze w piłkę nożną (oprócz bramkarza)?",
    options: ["Głową", "Rękami", "Klatką piersiową", "Nogami"],
    correct: 1,
    explanation: "W piłce nożnej zawodnicy z pola mogą odbijać piłkę każdą częścią ciała oprócz rąk i dłoni."
  },
  {
    id: 312,
    category: "przepisy",
    difficulty: "latwe",
    question: "Jakiego koloru kartkę pokazuje sędzia piłkarzowi, gdy ten musi za karę natychmiast opuścić boisko?",
    options: ["Żółtą", "Zieloną", "Niebieską", "Czerwoną"],
    correct: 3,
    explanation: "Czerwona kartka oznacza wykluczenie zawodnika z meczu. Jego drużyna musi wtedy grać w osłabieniu."
  },
  {
    id: 313,
    category: "przepisy",
    difficulty: "latwe",
    question: "Ile osób gra ze sobą na boisku podczas pojedynczego meczu tenisa ziemnego (singla)?",
    options: ["Dwie osoby", "Cztery osoby", "Sześć osób", "Jedna osoba"],
    correct: 0,
    explanation: "W grze pojedynczej (singlu) po obu stronach siatki stoi po jednym zawodniku, czyli razem grają dwie osoby."
  },
  {
    id: 314,
    category: "przepisy",
    difficulty: "latwe",
    question: "Co dzieli boisko na dwie równe połowy w meczu siatkówki?",
    options: ["Wysoka siatka", "Drewniany płot", "Czerwona linia na ziemi", "Rzeka"],
    correct: 0,
    explanation: "Siatka zawieszona na słupkach dzieli boisko do siatkówki. Piłkę należy przebić nad nią na stronę rywali."
  },
  {
    id: 315,
    category: "przepisy",
    difficulty: "latwe",
    question: "Jak nazywa się osoba na boisku, która pilnuje reguł gry i biega z gwizdkiem?",
    options: ["Sędzia", "Trener", "Bramkarz", "Kibic"],
    correct: 0,
    explanation: "Sędzia dba o to, aby gra była uczciwa i bezpieczna, a w razie faulu przerywa grę gwizdkiem."
  },
  {
    id: 316,
    category: "przepisy",
    difficulty: "latwe",
    question: "Co musi robić koszykarz, kiedy idzie lub biega z piłką po boisku, aby nie popełnić błędu?",
    options: ["Musi ją kozłować (odbijać od podłogi)", "Musi trzymać ją pod pachą", "Musi ją kopać", "Musi rzucić ją jak najdalej"],
    correct: 0,
    explanation: "W koszykówce nie wolno biegać z piłką w rękach bez odbijania. Ruch z piłką wymaga jej kozłowania."
  },
  {
    id: 317,
    category: "przepisy",
    difficulty: "latwe",
    question: "Gdzie hokeiści muszą wbić krążek za pomocą kijów, aby zdobyć punkt?",
    options: ["Do bramki przeciwnika", "Do kosza", "Za linię boczną boiska", "Do dziury w lodzie"],
    correct: 0,
    explanation: "W hokeju na lodzie celem jest wbicie krążka do bramki bronionej przez bramkarza drużyny przeciwnej."
  },
  {
    id: 318,
    category: "przepisy",
    difficulty: "latwe",
    question: "W jakim sporcie zawodnicy na macie próbują przewrócić rywala na plecy, używając specjalnych chwytów, bez bicia i kopania?",
    options: ["W zapasach / judo", "W boksie", "W karate", "W biegach"],
    correct: 0,
    explanation: "Zapasy i judo to sporty walki oparte na chwytach i rzutach, w których uderzenia i kopnięcia są zabronione."
  },
  {
    id: 319,
    category: "przepisy",
    difficulty: "latwe",
    question: "Co oznacza długi gwizdek sędziego na boisku piłkarskim po upływie 90 minut gry?",
    options: ["Koniec meczu", "Przerwę na picie wody", "Początek meczu", "Faul w polu karnym"],
    correct: 0,
    explanation: "Ostatni, długi gwizdek sędziego kończy spotkanie i oznacza, że czas gry dobiegł końca."
  },
  {
    id: 320,
    category: "przepisy",
    difficulty: "latwe",
    question: "Jak zaczyna się każdy mecz piłki nożnej na początku pierwszej połowy?",
    options: ["Kopnięciem piłki ze środkowego punktu boiska", "Rzutem piłki z autu", "Rzutem karnym", "Wrzuceniem piłki przez sędziego z góry"],
    correct: 0,
    explanation: "Mecz piłki nożnej zaczyna się od tzw. rozpoczęcia gry ze środka boiska przez jedną z drużyn."
  },

  // ==========================================
  // HISTORIA POLSKIEGO I ŚWIATOWEGO SPORTU (321-330)
  // ==========================================
  {
    id: 321,
    category: "historia",
    difficulty: "latwe",
    question: "W jakim starożytnym kraju narodziły się pierwsze igrzyska olimpijskie?",
    options: ["W starożytnej Grecji", "W Chinach", "W Egipcie", "W Polsce"],
    correct: 0,
    explanation: "Pierwsze igrzyska olimpijskie zorganizowano w Olimpii w Grecji ponad 2700 lat temu."
  },
  {
    id: 322,
    category: "historia",
    difficulty: "latwe",
    question: "Kto jest najsłynniejszym polskim napastnikiem z numerem 9, który grał w Bayernie Monachium i FC Barcelonie?",
    options: ["Robert Lewandowski", "Arkadiusz Milik", "Kamil Glik", "Wojciech Szczęsny"],
    correct: 0,
    explanation: "Robert Lewandowski to jeden z najlepszych napastników na świecie, kapitan naszej reprezentacji narodowej."
  },
  {
    id: 323,
    category: "historia",
    difficulty: "latwe",
    question: "Jaki polski skoczek narciarski z charakterystycznym wąsem wygrywał konkursy i zdobył 4 Kryształowe Kule na początku XXI wieku?",
    options: ["Adam Małysz", "Kamil Stoch", "Dawid Kubacki", "Piotr Żyła"],
    correct: 0,
    explanation: "Adam Małysz wywołał w Polsce 'małyszomanię' swoimi wspaniałymi skokami i sukcesami na całym świecie."
  },
  {
    id: 324,
    category: "historia",
    difficulty: "latwe",
    question: "Co przedstawia flaga olimpijska, która jest symbolem przyjaźni wszystkich sportowców świata?",
    options: ["Pięć kolorowych, połączonych kół", "Złoty puchar", "Białego orła", "Trzy kolorowe paski"],
    correct: 0,
    explanation: "Pięć kół na fladze olimpijskiej symbolizuje pięć zamieszkanych kontynentów połączonych duchem sportu."
  },
  {
    id: 325,
    category: "historia",
    difficulty: "latwe",
    question: "Kim z zawodu był przedwojenny polski bohater Janusz Kusociński, na którego cześć organizuje się znane zawody lekkoatletyczne?",
    options: ["Biegaczem długodystansowym", "Bramkarzem", "Skoczkiem wzwyż", "Kolarzem"],
    correct: 0,
    explanation: "Janusz Kusociński zdobył złoty medal olimpijski w biegu na 10 000 m w 1932 roku w Los Angeles."
  },
  {
    id: 326,
    category: "historia",
    difficulty: "latwe",
    question: "Jaki dawny sport walki rycerzy na miecze i szable przetrwał do dziś jako dyscyplina olimpijska z maskami i białymi strojami?",
    options: ["Szermierka", "Boks", "Karate", "Zapasy"],
    correct: 0,
    explanation: "Szermierka to nowoczesny sport olimpijski wywodzący się z dawnych pojedynków na broń białą."
  },
  {
    id: 327,
    category: "historia",
    difficulty: "latwe",
    question: "W jakim sąsiednim kraju odbywały się mecze Mistrzostw Europy w piłce nożnej Euro 2012 wspólnie z Polską?",
    options: ["Na Ukrainie", "W Niemczech", "W Czechach", "Na Słowacji"],
    correct: 0,
    explanation: "Euro 2012 było zorganizowane wspólnie przez Polskę i Ukrainę. Finał turnieju odbył się w Kijowie."
  },
  {
    id: 328,
    category: "historia",
    difficulty: "latwe",
    question: "Z jakiego naturalnego materiału robiono pierwsze piłki do gry w piłkę nożną, zanim zaczęto produkować je z nowoczesnych tworzyw sztucznych?",
    options: ["Ze skóry zwierzęcej", "Z drewna", "Z żelaza", "Ze szkła"],
    correct: 0,
    explanation: "Dawniej piłki szyto ze skóry, a w środku znajdował się napompowany pęcherz zwierzęcy."
  },
  {
    id: 329,
    category: "historia",
    difficulty: "latwe",
    question: "Skąd wzięła się nazwa bardzo długiego biegu sportowego zwanego 'Maratonem'?",
    options: ["Od nazwy miejscowości w Grecji", "Od imienia pierwszego biegacza", "Od rzymskiego słowa oznaczającego zmęczenie", "Od nazwy greckiego boga"],
    correct: 0,
    explanation: "Nazwa pochodzi od greckiej miejscowości Maraton, skąd posłaniec pobiegł do Aten, by ogłosić zwycięstwo w bitwie."
  },
  {
    id: 330,
    category: "historia",
    difficulty: "latwe",
    question: "How nazywa się jedyny polski kierowca, który startował w niesamowicie szybkich wyścigach Formuły 1?",
    options: ["Robert Kubica", "Krzysztof Hołowczyc", "Kajetan Kajetanowicz", "Tomasz Gollob"],
    correct: 0,
    explanation: "Robert Kubica to wybitny polski kierowca wyścigowy, który wygrał wyścig Formuły 1 w Kanadzie w 2008 roku."
  },

  // ==========================================
  // OLIMPIJCZYCY I SŁAWNI SPORTOWCY (331-340)
  // ==========================================
  {
    id: 331,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "W jaką dyscyplinę sportową gra nasza mistrzyni Iga Świątek, która używa rakiety na korcie?",
    options: ["W tenisa ziemnego", "W koszykówkę", "W siatkówkę", "W badmintona"],
    correct: 0,
    explanation: "Iga Świątek to jedna z najlepszych tenisistek na świecie, wielokrotna zwyciężczyni turniejów wielkoszlemowych."
  },
  {
    id: 332,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "W jakiej zimowej dyscyplinie sportowej Kamil Stoch zdobył aż trzy złote medale olimpijskie dla Polski?",
    options: ["W skokach narciarskich", "W biegach narciarskich", "W jeździe na łyżwach", "W hokeju na lodzie"],
    correct: 0,
    explanation: "Kamil Stoch to jeden z najbardziej utytułowanych skoczków w historii, mistrz z Soczi i Pjongczangu."
  },
  {
    id: 333,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jaki medal otrzymuje sportowiec, który zajmie drugie miejsce w finale na Igrzyskach Olimpijskich?",
    options: ["Srebrny", "Złoty", "Brązowy", "Platynowy"],
    correct: 0,
    explanation: "Za 1. miejsce przyznaje się medal złoty, za 2. miejsce medal srebrny, a za 3. miejsce medal brązowy."
  },
  {
    id: 334,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "W jakiej wodnej dyscyplinie Otylia Jędrzejczak zdobyła dla Polski złoty medal na Igrzyskach w Atenach?",
    options: ["W pływaniu", "W kajakarstwie", "W wioślarstwie", "W żeglarstwie"],
    correct: 0,
    explanation: "Otylia Jędrzejczak specjalizowała się w pływaniu stylem motylkowym i zdobyła złoto na dystansie 200 metrów."
  },
  {
    id: 335,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Bartosz Zmarzlik to polski mistrz świata, który ściga się na motocyklach bez hamulców na sypkim torze. Jaki to sport?",
    options: ["Żużel", "Motocross", "Kolarstwo torowe", "Formuła 1"],
    correct: 0,
    explanation: "Żużel (speedway) to wyścigi motocyklowe na owalnym torze ziemnym. Bartosz Zmarzlik to wielokrotny mistrz świata w tej dyscyplinie."
  },
  {
    id: 336,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jaki kruszec (metal) symbolizuje zwycięstwo i wykonany jest z niego medal za 1. miejsce?",
    options: ["Złoto", "Srebro", "Brąz", "Miedź"],
    correct: 0,
    explanation: "Złoty medal to najwyższe trofeum olimpijskie, przyznawane zwycięzcy danej konkurencji."
  },
  {
    id: 337,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Co nakłada się na głowę mistrzom w niektórych dyscyplinach na podium (np. w dawnych czasach w Grecji) oprócz wręczenia medalu?",
    options: ["Wieniec laurowy (z liści)", "Czapkę z pomponem", "Kask", "Klucz do bram miasta"],
    correct: 0,
    explanation: "W starożytnej Grecji zwycięzcy igrzysk otrzymywali gałązkę oliwną lub wieniec laurowy jako symbol chwały."
  },
  {
    id: 338,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Jak nazywają się największe i najważniejsze zawody sportowe na świecie, organizowane raz na 4 lata?",
    options: ["Igrzyska Olimpijskie", "Mistrzostwa Szkoły", "Puchar Świata", "Bieg Konstytucji"],
    correct: 0,
    explanation: "Igrzyska Olimpijskie dzielą się na Letnie i Zimowe i gromadzą najlepszych sportowców ze wszystkich państw świata."
  },
  {
    id: 339,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Co niesie sztafeta biegaczy przez wiele krajów, aby na stadionie uroczyście rozpocząć igrzyska olimpijskie?",
    options: ["Ogień olimpijski (pochodnię)", "Złoty puchar", "Flagę państwa gospodarza", "Wielką piłkę"],
    correct: 0,
    explanation: "Ogień olimpijski zapala się w grecznej Olimpii od promieni słonecznych, a potem w sztafecie wędruje na stadion igrzysk."
  },
  {
    id: 340,
    category: "olimpijczycy",
    difficulty: "latwe",
    question: "Nasza mistrzyni Anita Włodarczyk rzuca bardzo daleko ciężką metalową kulą zawieszoną na stalowej lince. Co to za konkurencja?",
    options: ["Rzut młotem", "Pchnięcie kulą", "Rzut oszczepem", "Skok o tyczce"],
    correct: 0,
    explanation: "Rzut młotem to konkurencja lekkoatletyczna. Anita Włodarczyk jest trzykrotną mistrzynią olimpijską w tej dyscyplinie."
  },

  // ==========================================
  // WYNIKI I PUNKTY (341-350)
  // ==========================================
  {
    id: 341,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile punktów (bramek) dopisuje się drużynie za strzelenie jednego gola w meczu piłki nożnej?",
    options: ["Jeden punkt", "Dwa punkty", "Trzy punkty", "Pięć punktów"],
    correct: 0,
    explanation: "Każdy celny strzał do bramki przeciwnika daje drużynie dokładnie 1 gol (punkt)."
  },
  {
    id: 342,
    category: "wyniki",
    difficulty: "latwe",
    question: "Jaki jest wynik meczu piłki nożnej, w którym żadna z drużyn nie strzeliła ani jednego gola?",
    options: ["0:0 (zero do zera)", "1:1", "Wygrana gospodarzy", "Przegrana obu drużyn"],
    correct: 0,
    explanation: "Wynik 0:0 oznacza, że mecz zakończył się bezbramkowym remisem."
  },
  {
    id: 343,
    category: "wyniki",
    difficulty: "latwe",
    question: "Z jakiego kraju pochodzi Usain Bolt – najszybszy biegacz w historii świata?",
    options: ["Z Jamajki", "Z Polski", "Z Chin", "Z Brazylii"],
    correct: 0,
    explanation: "Usain Bolt pochodzi z Jamajki i ustanowił niesamowity rekord świata w biegu na 100 metrów wynoszący 9,58 sekundy."
  },
  {
    id: 344,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile punktów w tabeli ligowej otrzymuje drużyna piłkarska za wygranie meczu?",
    options: ["3 punkty", "1 punkt", "0 punktów", "5 punktów"],
    correct: 0,
    explanation: "Za zwycięstwo drużyna dostaje 3 punkty w tabeli, za remis 1 punkt, a za przegraną 0 punktów."
  },
  {
    id: 345,
    category: "wyniki",
    difficulty: "latwe",
    question: "Jak nazywa się wynik sportowy, w którym obie drużyny zdobyły dokładnie tyle samo punktów lub bramek?",
    options: ["Remis", "Dogrywka", "Zwycięstwo", "Porażka"],
    correct: 0,
    explanation: "Remis następuje wtedy, gdy żadna z drużyn nie ma przewagi punktowej po regulaminowym czasie gry."
  },
  {
    id: 346,
    category: "wyniki",
    difficulty: "latwe",
    question: "Co oznacza skrót PZPN, który zarządza polską piłką nożną?",
    options: ["Polski Związek Piłki Nożnej", "Polska Zabawa Piłkarzy Narodowych", "Polskie Zawody Piłkarskie Nowe", "Puchar Zwycięzców Piłki Narodowej"],
    correct: 0,
    explanation: "PZPN to oficjalna organizacja dbająca o reprezentację Polski i rozgrywki piłkarskie w naszym kraju."
  },
  {
    id: 347,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile bramek w jednym meczu musi strzelić ten sam piłkarz, aby zdobyć tak zwanego 'hat-tricka'?",
    options: ["Trzy bramki", "Dwie bramki", "Cztery bramki", "Pięć bramek"],
    correct: 0,
    explanation: "Strzelenie trzech bramek w jednym meczu przez tego samego zawodnika nazywa się tradycyjnie 'hat-trickiem'."
  },
  {
    id: 348,
    category: "wyniki",
    difficulty: "latwe",
    question: "Jaki kolor kruszcu (metalu) ma medal przyznawany sportowcowi za zajęcie 3. miejsca na podium?",
    options: ["Brązowy", "Złoty", "Srebrny", "Czerwony"],
    correct: 0,
    explanation: "Brązowy medal otrzymuje zawodnik lub drużyna, która ukończy zawody na trzeciej pozycji."
  },
  {
    id: 349,
    category: "wyniki",
    difficulty: "latwe",
    question: "Jak nazywa się uporządkowana lista drużyn pokazująca, ile punktów zdobyły w całym sezonie?",
    options: ["Tabela ligowa (klasyfikacja)", "Lista zakupów", "Dziennik ocen", "Rozkład jazdy"],
    correct: 0,
    explanation: "W tabeli ligowej drużyny są uszeregowane od tej z największą liczbą punktów na samej górze, do tej z najmniejszą na dole."
  },
  {
    id: 350,
    category: "wyniki",
    difficulty: "latwe",
    question: "Ile punktów do tabeli dostaje drużyna piłkarska, która przegrała mecz?",
    options: ["Zero punktów", "Jeden punkt", "Dwa punkty", "Minus trzy punkty"],
    correct: 0,
    explanation: "Przegrana drużyna nie powiększa swojego dorobku punktowego w tabeli i otrzymuje za ten mecz 0 punktów."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = questions;
  module.exports.kidsQuestions = kidsQuestions;
  module.exports.juniorsQuestions = juniorsQuestions;
}
