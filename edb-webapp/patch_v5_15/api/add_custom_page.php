<?php
// add_custom_page.php
require 'config.php';
header('Content-Type: application/json');

$json = json_decode(file_get_contents('php://input'), true);

if ($json === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Błąd formatu danych. Upewnij się, że treść nie jest zbyt duża (np. przez wklejenie wielu zdjęć bez użycia przycisku "Wstaw Obraz").']);
    exit();
}

$password = $json['password'] ?? null;
$title = $json['title'] ?? null;
$slug = $json['slug'] ?? null;
$content = $json['content'] ?? null;

if ($password !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!$title || !$slug || !$content) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO custom_pages (title, slug, content) VALUES (?, ?, ?)");
    $stmt->execute([$title, $slug, $content]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
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
