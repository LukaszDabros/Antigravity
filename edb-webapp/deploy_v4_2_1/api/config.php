<?php
// config.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database configuration
// MUST BE CHANGED for 7m.pl
$db_host = 'localhost';
$db_name = 'edb_presentations';
$db_user = 'root';
$db_pass = '';

// Admin Password (for adding/deleting presentations)
$admin_password = 'admin'; // Change this on production

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['error' => 'Database connection failed']));
}
?>
