// Konfiguracja PDF.js wrappera
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDocument = null;
let totalPages = 0;
let isBookInitialized = false;

// Elementy UI (inicjalizowane po załadowaniu DOM)
let bookContainer, loadingPanel, loadingText, sidebar, tocContent, zoomLevelText;

let currentZoom = 1;
const zoomStep = 0.2;
const minZoom = 0.5;
const maxZoom = 2.5;

$(document).ready(function () {
    bookContainer = $('#flipbook');
    loadingPanel = $('#loading');
    loadingText = $('#loading-text');
    sidebar = $('#sidebar');
    tocContent = $('#toc-content');
    zoomLevelText = $('#zoom-level');

    // ----- EVENTY UI -----
    $('#file-upload').on('change', function (e) {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            alert('Wybierz poprawny plik PDF.');
            return;
        }

        resetBook();
        loadingPanel.removeClass('hidden');

        const fileReader = new FileReader();
        fileReader.onload = function () {
            const typedarray = new Uint8Array(this.result);
            loadPDF(typedarray, file.name);
        };
        fileReader.readAsArrayBuffer(file);
    });

    $('#nav-prev').on('click', () => {
        if (isBookInitialized) bookContainer.turn('previous');
    });

    $('#nav-next').on('click', () => {
        if (isBookInitialized) bookContainer.turn('next');
    });

    // Zdarzenia dla Zoom
    $('#zoom-in-btn').on('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            updateZoom();
        }
    });

    $('#zoom-out-btn').on('click', () => {
        if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            updateZoom();
        }
    });

    function updateZoom() {
        // Zoomujemy cały kontener, a nie format strony
        $('.book-container').css('transform', `scale(${currentZoom})`);
        zoomLevelText.text(`${Math.round(currentZoom * 100)}%`);
    }

    // Zdarzenia dla menu bocznego
    $('#toggle-toc-btn').on('click', () => {
        sidebar.removeClass('hidden');
    });

    $('#close-sidebar-btn').on('click', () => {
        sidebar.addClass('hidden');
    });

    // Obsługa rolki myszki (Scroll) - przybliżanie i oddalanie dokumentu zamiast przełączania stron
    let scrollTimeout = null;
    $(window).on('wheel', function (e) {
        if (!isBookInitialized) return;

        // Originalny event z myszki
        const wheelEvent = e.originalEvent;

        // Zapobiegamy przeładowaniu natywnego scrolla jeśli klawisz Ctrl lub na samej stronie
        if (e.ctrlKey) {
            e.preventDefault();
        }

        // Zabezpieczenie przed gwałtownym scrollowaniem/zoomowaniem
        if (scrollTimeout) return;

        if (wheelEvent.deltaY > 0) {
            // Scroll w dół -> Oddal
            if (currentZoom > minZoom) {
                currentZoom -= zoomStep;
                updateZoom();
            }
            scrollTimeout = setTimeout(() => scrollTimeout = null, 150);
        } else if (wheelEvent.deltaY < 0) {
            // Scroll w górę -> Przybliż
            if (currentZoom < maxZoom) {
                currentZoom += zoomStep;
                updateZoom();
            }
            scrollTimeout = setTimeout(() => scrollTimeout = null, 150);
        }
    }, { passive: false });

    // Wsparcie dla klawiatury
    $(window).on('keydown', function (e) {
        if (!isBookInitialized) return;
        if (e.keyCode === 37) bookContainer.turn('previous');
        if (e.keyCode === 39) bookContainer.turn('next');
    });


    // ----- LOGIKA GŁÓWNA CZYTNIKA PDF -----

    function resetBook() {
        if (isBookInitialized) {
            bookContainer.turn('destroy');
            bookContainer.empty();
        }
        isBookInitialized = false;
        $('.nav-arrow').addClass('hidden');
        $('#footer').addClass('hidden');
        $('#current-page').text('0');
    }

    async function loadPDF(pdfData, filename) {
        loadingText.text('Parsowanie PDF...');
        try {
            const loadingTask = pdfjsLib.getDocument({ data: pdfData });
            pdfDocument = await loadingTask.promise;
            totalPages = pdfDocument.numPages;

            $('#total-pages').text(totalPages);

            // Wyciągamy proporcje z pierwszej strony by zdefiniować rozmiar książki
            const firstPage = await pdfDocument.getPage(1);
            const baseViewport = firstPage.getViewport({ scale: 1.0 });

            // Zamiast arbitralnej skali 1.5 - obliczamy ją względem ekranu!
            // Zostawiamy 150px zapasu na Header i Footer, aby książka nie wychodziła dołem!
            const maxHeight = window.innerHeight - 150;
            const scale = maxHeight / baseViewport.height;
            const viewport = firstPage.getViewport({ scale: scale });

            // Ponieważ książka ma widok dwóch stron na raz, szerokość kontenera to 2x pojedyncza strona
            const pageW = viewport.width;
            const pageH = viewport.height;
            const bookW = pageW * 2;

            // Pętla pobierająca i rysująca każdą stronę w Canvas
            for (let i = 1; i <= totalPages; i++) {
                loadingText.text(`Renderowanie strony ${i} z ${totalPages}...`);
                await injectPage(i, pageW, pageH);
            }

            // Dodanie tylnej, sztywnej okładki, jeśli PDF jest "nieparzysty" lub gdy chcemy elegancki koniec
            if (totalPages % 2 !== 0) {
                const emptyEnd = $(`<div class="page page-cover"><h2>Koniec</h2></div>`);
                bookContainer.append(emptyEnd);
            }

            loadingPanel.addClass('hidden');
            initTurnJS(bookW, pageH);

            // Budujemy spis treści korzystając z wbudowanych mechanizmów
            const outline = await pdfDocument.getOutline();
            await renderTOC(outline);

            // Reset zoomu dla noewgo dokumentu
            currentZoom = 1;
            updateZoom();

        } catch (err) {
            console.error('Błąd PDF:', err);
            loadingText.text('Wystąpił błąd wczytywania!');
            setTimeout(() => loadingPanel.addClass('hidden'), 3000);
        }
    }

    async function injectPage(pageNum, requiredWidth, requiredHeight) {
        const page = await pdfDocument.getPage(pageNum);

        // Obliczamy skalę by pasowała do idealnego wymiaru (wysokości)
        const baseVp = page.getViewport({ scale: 1.0 });
        const scaleFactor = requiredHeight / baseVp.height;
        const finalVp = page.getViewport({ scale: scaleFactor });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = finalVp.width;
        canvas.height = finalVp.height;

        await page.render({ canvasContext: ctx, viewport: finalVp }).promise;

        // Klasa zależna od strony (lewa, prawa itp) do cieniowania
        const parityClass = (pageNum % 2 === 0) ? 'even' : 'odd';

        // Pierwsza strona dostaje klasę okładki
        const coverClass = (pageNum === 1) ? 'page-cover' : '';

        const pageDiv = $(`<div class="page ${parityClass} ${coverClass}"></div>`);
        pageDiv.append(canvas);
        bookContainer.append(pageDiv);
    }

    function initTurnJS(width, height) {
        // Odpalenie wtyczki Turn.js na elemencie
        bookContainer.turn({
            width: width,   // Rozmiar OTWARTEJ książki (zatem 2 strony)
            height: height, // Wysokość książki
            autoCenter: true,
            display: 'double',
            elevation: 50,  // Efekt wysokości zagięcia podczas przewracania
            gradients: true, // Automatyczne cieniowanie zagięć
            duration: 1000,  // Czas trwania animacji obracania (możesz dostosować)
            turnCorners: "tl,tr,r,l,bl,br", // Zapewnienia, że wszystkie rogi reagują na chwytanie!
            when: {
                // Aktualizacja ułatwień nawigacji po przełożeniu 
                turned: function (e, page, view) {
                    // 'view' to tablica 2 liczb z otwartymi elementami, np [1, 2] albo [2, 3]
                    let visibleText = view.join(' - ');
                    if (view[0] === 0) visibleText = view[1]; // pierwsza sztywna okladka ma index zero (pusty) z lewej

                    $('#current-page').text(visibleText);

                    // Ukrywanie/Pokazywanie strzałek
                    if (page === 1) $('#nav-prev').addClass('hidden');
                    else $('#nav-prev').removeClass('hidden');

                    if (page === bookContainer.turn('pages')) $('#nav-next').addClass('hidden');
                    else $('#nav-next').removeClass('hidden');
                }
            }
        });

        isBookInitialized = true;

        // Narzędzia UI stają się widoczne
        $('#footer').removeClass('hidden');
        $('#nav-next').removeClass('hidden'); // O ile to nie 1 stronny dokument
    }

    async function renderTOC(outline) {
        tocContent.empty();
        if (!outline || outline.length === 0) {
            tocContent.html('<div class="toc-empty">Brak spisu treści (Outline) dla tego dokumentu PDF.</div>');
            return;
        }

        for (const item of outline) {
            const itemDiv = $(`<div class="toc-item">${item.title}</div>`);

            itemDiv.on('click', async () => {
                let dest = item.dest;
                // PDF.js może przechowywać detynacje jako string w outline. Trzeba pobrać obiekt!
                if (typeof dest === 'string') {
                    dest = await pdfDocument.getDestination(dest);
                }
                if (dest && dest[0]) {
                    try {
                        const pageIndex = await pdfDocument.getPageIndex(dest[0]);
                        if (isBookInitialized) {
                            // PDFjs indeksuje od 0, więc pageIndex+1, to numer strony dla użytkownika i TurnJS
                            bookContainer.turn('page', pageIndex + 1);
                            sidebar.addClass('hidden');
                        }
                    } catch (e) {
                        console.warn("Nie można odnaleźć strony dla wybranej pozycji TOC", e);
                    }
                }
            });

            tocContent.append(itemDiv);
        }
    }

    // Zasilanie wtyczki z parametru backendowego
    if (typeof wpPdfBookViewerData !== 'undefined' && wpPdfBookViewerData.pdfUrl) {
        // Mamy URL z shortcode'u, więc automatycznie wgrywamy!
        fetch(wpPdfBookViewerData.pdfUrl)
            .then(res => {
                if (!res.ok) throw new Error("HTTP error " + res.status);
                return res.arrayBuffer();
            })
            .then(buf => {
                loadPDF(new Uint8Array(buf), 'Książka PDF');
            })
            .catch(err => {
                console.error('Błąd pobierania PDF z shortcode:', err);
            });
    }
});
