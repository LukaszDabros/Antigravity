<?php
// update_presentation_order.php
require 'config.php';
header('Content-Type: application/json');

$json = json_decode(file_get_contents('php://input'), true);
$password = $json['password'] ?? null;
$orderedIds = $json['orderedIds'] ?? []; // Array of IDs in the desired order

if ($password !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (empty($orderedIds)) {
    http_response_code(400);
    echo json_encode(['error' => 'No IDs provided']);
    exit();
}

try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare("UPDATE presentations SET order_priority = ? WHERE id = ?");
    
    foreach ($orderedIds as $index => $id) {
        $stmt->execute([$index, $id]);
    }
    
    $pdo->commit();
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
