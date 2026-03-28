<?php
// update_custom_page.php
require 'config.php';
header('Content-Type: application/json');

$json = json_decode(file_get_contents('php://input'), true);
$password = $json['password'] ?? null;
$id = $json['id'] ?? null;
$title = $json['title'] ?? null;
$slug = $json['slug'] ?? null;
$content = $json['content'] ?? null;

if ($password !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!$id || !$title || !$slug || !$content) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit();
}

try {
    $stmt = $pdo->prepare("UPDATE custom_pages SET title = ?, slug = ?, content = ? WHERE id = ?");
    $stmt->execute([$title, $slug, $content, $id]);
    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    if ($e->getCode() == 23000) {
        echo json_encode(['error' => 'Slug (część adresu URL) musi być unikalny.']);
    }
    else {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
