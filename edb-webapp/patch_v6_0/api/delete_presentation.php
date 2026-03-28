<?php
// delete_presentation.php
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

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing presentation ID']);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM presentations WHERE id = ?");
    $stmt->execute([$data['id']]);

    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete presentation']);
}
?>
