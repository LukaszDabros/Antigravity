<?php
// get_presentations.php
require 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $stmt = $pdo->query("SELECT id, title, url, thumbnail_url, category, created_at FROM presentations ORDER BY order_priority ASC, created_at DESC");
    $presentations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($presentations);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch presentations']);
}
?>
