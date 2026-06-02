<?php
// update_presentation.php
require 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['password']) || $data['password'] !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!isset($data['id']) || !isset($data['title']) || !isset($data['url']) || !isset($data['category'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit();
}

try {
    $stmt = $pdo->prepare("UPDATE presentations SET title = ?, url = ?, thumbnail_url = ?, category = ? WHERE id = ?");
    $stmt->execute([
        $data['title'],
        $data['url'],
        isset($data['thumbnail_url']) ? $data['thumbnail_url'] : null,
        $data['category'],
        $data['id']
    ]);

    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database update failed: ' . $e->getMessage()]);
}
?>
