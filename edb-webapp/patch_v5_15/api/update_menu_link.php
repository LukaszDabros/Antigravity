<?php
// update_menu_link.php
require 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['password']) || $data['password'] !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!isset($data['id']) || !isset($data['label']) || !isset($data['url'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit();
}

try {
    $parent_id = !empty($data['parent_id']) ? $data['parent_id'] : null;
    $stmt = $pdo->prepare("UPDATE menu_links SET label = ?, url = ?, parent_id = ? WHERE id = ?");
    $stmt->execute([$data['label'], $data['url'], $parent_id, $data['id']]);
    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update menu link: ' . $e->getMessage()]);
}
?>
