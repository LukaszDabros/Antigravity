<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "config.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['ids']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "error" => "Missing data"]);
    exit;
}

if ($data['password'] !== $admin_password) {
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit;
}

try {
    $db = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $db->beginTransaction();

    $stmt = $db->prepare("UPDATE menu_links SET order_priority = ? WHERE id = ?");

    foreach ($data['ids'] as $index => $id) {
        $stmt->execute([$index, $id]);
    }

    $db->commit();
    echo json_encode(["success" => true]);
}
catch (PDOException $e) {
    if (isset($db))
        $db->rollBack();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
