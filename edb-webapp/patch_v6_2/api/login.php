<?php
// login.php
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$json = json_decode(file_get_contents('php://input'), true);
$password = $json['password'] ?? null;

if ($password === $admin_password) {
    echo json_encode(['success' => true]);
}
else {
    http_response_code(401);
    echo json_encode(['error' => 'Nieprawidłowe hasło.']);
}
?>
