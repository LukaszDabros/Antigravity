<?php
// add_presentation.php
require 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['password']) || $data['password'] !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized / Invalid Password']);
    exit();
}

if (!isset($data['title']) || !isset($data['url']) || !isset($data['category'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit();
}

$thumb = isset($data['thumbnail_url']) ? $data['thumbnail_url'] : null;

// Validate category
$allowed_categories = ['sp', 'lo', 'inne'];
if (!in_array($data['category'], $allowed_categories)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid category']);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO presentations (title, url, thumbnail_url, category) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['title'], $data['url'], $thumb, $data['category']]);

    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add presentation']);
}
?>
