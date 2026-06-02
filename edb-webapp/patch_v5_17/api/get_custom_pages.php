<?php
// get_custom_pages.php
require 'config.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM custom_pages ORDER BY created_at DESC");
    $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($pages);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
