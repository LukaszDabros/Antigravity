<?php
// get_student_files.php
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

try {
    $stmt = $pdo->prepare("SELECT id, student_name, url, file_path, school_type, created_at FROM student_submissions ORDER BY created_at DESC");
    $stmt->execute();
    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($submissions);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch submissions']);
}
?>
