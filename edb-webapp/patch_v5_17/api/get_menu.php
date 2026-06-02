<?php
// get_menu.php
require 'config.php';
header('Content-Type: application/json');

try {
    // Auto-patch parent_id column format to allow string tags
    try {
        $db = $pdo->query("SELECT DATABASE()")->fetchColumn();
        $fk = $pdo->query("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '$db' AND TABLE_NAME = 'menu_links' AND COLUMN_NAME = 'parent_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1")->fetchColumn();
        if ($fk)
            $pdo->exec("ALTER TABLE menu_links DROP FOREIGN KEY $fk");
        $pdo->exec("ALTER TABLE menu_links MODIFY parent_id VARCHAR(50) DEFAULT NULL");
    }
    catch (Exception $e) {
    }

    $stmt = $pdo->query("SELECT id, label, url, parent_id, order_priority FROM menu_links ORDER BY order_priority ASC");
    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert generic falsy string "0" to actual "0" but otherwise keep as is
    foreach ($links as &$link) {
        if ($link['parent_id'] === '0' || $link['parent_id'] === 0) {
            $link['parent_id'] = null; // Fix for previously truncated rows
        }
    }

    echo json_encode($links);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch menu']);
}
?>
