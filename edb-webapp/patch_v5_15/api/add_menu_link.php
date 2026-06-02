<?php
// add_menu_link.php
require 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['password']) || $data['password'] !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!isset($data['label']) || !isset($data['url'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit();
}

try {
    $parent_id = !empty($data['parent_id']) ? $data['parent_id'] : null;
    $stmt = $pdo->prepare("INSERT INTO menu_links (label, url, parent_id) VALUES (?, ?, ?)");
    $stmt->execute([$data['label'], $data['url'], $parent_id]);
    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add menu link']);
}
?>
