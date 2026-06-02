<?php
/**
 * Plugin Name: PDF Book Viewer
 * Plugin URI: https://example.com
 * Description: Interaktywny czytnik PDF wykorzystujący Turn.js do symulacji prawdziwej książki. Użyj shortcode [pdf_book url="link-do-pdf"] na dowolnej stronie.
 * Version: 1.0.0
 * Author: Antigravity AI
 * License: GPL-2.0+
 */

// Zablokuj bezpośredni dostęp do pliku
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Zdefiniuj wersję wtyczki do "busting cache"
define( 'WP_PDF_BOOK_VIEWER_VERSION', '1.0.0' );

// Załaduj zasoby (CSS i JS) tylko wtedy, gdy na stronie pojawia się shortcode
function wp_pdf_book_viewer_enqueue_scripts() {
    global $post;

    if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'pdf_book' ) ) {
        
        // CSS
        wp_enqueue_style( 'google-fonts-inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', array(), null );
        wp_enqueue_style( 'wp-pdf-book-viewer-style', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), WP_PDF_BOOK_VIEWER_VERSION );

        // Zewnętrzne biblioteki JS
        wp_enqueue_script( 'pdf-js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', array(), null, true );
        // WordPress ma wbudowane jQuery, więc zrobimy dependencje
        wp_enqueue_script( 'turn-js', 'http://www.turnjs.com/lib/turn.min.js', array('jquery'), null, true );
        
        // Nasz glowny plik logiki
        wp_enqueue_script( 'wp-pdf-book-viewer-app', plugin_dir_url( __FILE__ ) . 'assets/js/app.js', array('jquery', 'turn-js', 'pdf-js'), WP_PDF_BOOK_VIEWER_VERSION, true );
    }
}
add_action( 'wp_enqueue_scripts', 'wp_pdf_book_viewer_enqueue_scripts' );

// Zarejestruj Shortcode [pdf_book]
function wp_pdf_book_viewer_shortcode( $atts ) {
    // Parametry shortocode
    $atts = shortcode_atts(
        array(
            'url' => '', // Domyślnie brak URL
        ),
        $atts,
        'pdf_book'
    );

    // Przekaż zmienną URL z shortcode'u bezpośrednio do naszego pliku JavaScript!
    wp_localize_script( 'wp-pdf-book-viewer-app', 'wpPdfBookViewerData', array(
        'pdfUrl' => esc_url( $atts['url'] )
    ) );

    // Zaczynamy buforowanie wyjścia, zeby zwrocic HTML jako zmienna dla WordPressa
    ob_start();
    ?>
    <div class="wp-pdf-book-viewer-wrapper">
        <!-- HEADER / Pasek zadań -->
        <header class="topbar">
            <div class="logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                <h2>Czytnik PDF</h2>
            </div>
            <div class="controls">
                <!-- Przycisk spisu treści -->
                <button id="toggle-toc-btn" class="icon-btn" title="Spis Treści">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <!-- Przyciski zoomu -->
                <div class="zoom-controls">
                    <button id="zoom-out-btn" class="icon-btn" title="Oddal"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg></button>
                    <span id="zoom-level">100%</span>
                    <button id="zoom-in-btn" class="icon-btn" title="Przybliż"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg></button>
                </div>
                <!-- Otwieranie lokalnego -->
                <label class="btn btn-primary" for="file-upload">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    Otwórz własny plik
                </label>
                <input type="file" id="file-upload" accept="application/pdf" style="display: none;">
            </div>
        </header>

        <!-- Sidebar ze spisem treści -->
        <div id="sidebar" class="sidebar hidden">
            <div class="sidebar-header">
                <h3>Spis Treści</h3>
                <button id="close-sidebar-btn" class="icon-btn">✕</button>
            </div>
            <div id="toc-content" class="toc-content">
                <div class="toc-empty">Brak spisu treści</div>
            </div>
        </div>

        <!-- LOADING SCREEN -->
        <div id="loading" class="loading-overlay hidden">
            <div class="loader"></div>
            <p id="loading-text">Inicjowanie...</p>
        </div>

        <!-- MAIN WORKSPACE -->
        <main class="workspace">
            <!-- Strzałka: Wstecz -->
            <button id="nav-prev" class="nav-arrow hidden">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <!-- KONTENER NA MAGIĘ KSIĄŻKI -->
            <div class="book-container">
                <div id="flipbook" class="flipbook">
                    <!-- Strony będą ładowane tutaj przez JavaScript -->
                </div>
            </div>
            <!-- Strzałka: Dalej -->
            <button id="nav-next" class="nav-arrow hidden">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
        </main>

        <!-- STOPKA / Status Książki -->
        <footer id="footer" class="bottombar hidden">
            <div class="page-status">
                Strona <span id="current-page">0</span> z <span id="total-pages">0</span>
            </div>
        </footer>
    </div>
    <?php
    // Zwróć cały załapany tekst HTML
    return ob_get_clean();
}
add_shortcode( 'pdf_book', 'wp_pdf_book_viewer_shortcode' );
