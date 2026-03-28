<?php
require 'config.php';

echo "Rozpoczynam aktualizacje bazy danych (V5 Patch)...<br>";

try {
    $db_name_query = $pdo->query("SELECT DATABASE()")->fetchColumn();

    $stmt = $pdo->prepare("
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'menu_links' 
        AND COLUMN_NAME = 'parent_id' 
        AND REFERENCED_TABLE_NAME IS NOT NULL 
        LIMIT 1
    ");
    $stmt->execute([$db_name_query]);
    $fk = $stmt->fetchColumn();

    if ($fk) {
        $pdo->exec("ALTER TABLE menu_links DROP FOREIGN KEY $fk");
        echo "Usunieto klucz obcy: $fk.<br>";
    }
    else {
        echo "Brak klucza obcego do usuniecia (lub juz usuniety).<br>";
    }

    $pdo->exec("ALTER TABLE menu_links MODIFY parent_id VARCHAR(50) DEFAULT NULL");
    echo "Zmieniono typ kolumny parent_id na VARCHAR(50).<br>";
    echo "<strong>Gotowe! Baza zostala zaktualizowana i obsluguje teraz modyfikacje zagniezdzonego menu.</strong>";
}
catch (Exception $e) {
    echo "<strong>Wystapil blad:</strong> " . $e->getMessage();
}
?>
