<?php
// get_menu.php
require 'config.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT id, label, url FROM menu_links ORDER BY order_priority ASC");
    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($links);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch menu']);
}
?>
