<?php
// delete_menu_link.php
require 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['password']) || $data['password'] !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing ID']);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM menu_links WHERE id = ?");
    $stmt->execute([$data['id']]);
    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete menu link']);
}
?>
