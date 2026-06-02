<?php
// delete_student_file.php
require 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
    // 1. Fetch file_path before deletion
    $stmt = $pdo->prepare("SELECT file_path FROM student_submissions WHERE id = ?");
    $stmt->execute([$data['id']]);
    $sub = $stmt->fetch(PDO::FETCH_ASSOC);

    // 2. Delete from DB
    $stmt = $pdo->prepare("DELETE FROM student_submissions WHERE id = ?");
    $stmt->execute([$data['id']]);

    // 3. Remove physical file if exists
    if ($sub && !empty($sub['file_path'])) {
        // file_path is stored as 'api/uploads/filename.ext' but we are in 'api/'
        // so we need to remove 'api/' from the start or adjust the path
        $path = str_replace('api/', '', $sub['file_path']);
        if (file_exists($path)) {
            unlink($path);
        }
    }

    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete submission']);
}
?>
