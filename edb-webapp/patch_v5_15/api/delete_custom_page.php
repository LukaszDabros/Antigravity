<?php
// delete_custom_page.php
require 'config.php';
header('Content-Type: application/json');

$json = json_decode(file_get_contents('php://input'), true);
$password = $json['password'] ?? null;
$id = $json['id'] ?? null;

if ($password !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing ID']);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM custom_pages WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
