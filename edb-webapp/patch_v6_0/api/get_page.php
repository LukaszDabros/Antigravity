<?php
// get_page.php
require 'config.php';
header('Content-Type: application/json');

$slug = $_GET['slug'] ?? null;

if (!$slug) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing slug']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM custom_pages WHERE slug = ?");
    $stmt->execute([$slug]);
    $page = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($page) {
        echo json_encode($page);
    }
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Page not found']);
    }
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
