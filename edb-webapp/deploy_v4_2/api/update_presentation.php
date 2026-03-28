<?php
// update_presentation.php
require 'config.php';
header('Content-Type: application/json');

// Handle both JSON and multipart/form-data
$password = $_POST['password'] ?? null;
$id = $_POST['id'] ?? null;
$title = $_POST['title'] ?? null;
$url = $_POST['url'] ?? null;
$category = $_POST['category'] ?? null;
$thumbnail_url = $_POST['thumbnail_url'] ?? null;

if (!$password) {
    $json = json_decode(file_get_contents('php://input'), true);
    $password = $json['password'] ?? null;
    $id = $json['id'] ?? null;
    $title = $json['title'] ?? null;
    $url = $json['url'] ?? null;
    $category = $json['category'] ?? null;
    $thumbnail_url = $json['thumbnail_url'] ?? null;
}

if ($password !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!$id || !$title || !$url || !$category) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit();
}

// Handle Thumbnail Upload
if (isset($_FILES['thumbnail_file']) && $_FILES['thumbnail_file']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = 'uploads/thumbnails/';
    if (!is_dir($upload_dir))
        mkdir($upload_dir, 0777, true);

    $file_ext = pathinfo($_FILES['thumbnail_file']['name'], PATHINFO_EXTENSION);
    $file_name = uniqid('thumb_') . '.' . $file_ext;
    $target_path = $upload_dir . $file_name;

    if (move_uploaded_file($_FILES['thumbnail_file']['tmp_name'], $target_path)) {
        $thumbnail_url = 'api/' . $target_path;
    }
}

// Handle Presentation File Upload
if (isset($_FILES['presentation_file']) && $_FILES['presentation_file']['error'] === UPLOAD_ERR_OK) {
    $pres_dir = 'uploads/presentations/';
    if (!is_dir($pres_dir))
        mkdir($pres_dir, 0777, true);

    $file_ext = pathinfo($_FILES['presentation_file']['name'], PATHINFO_EXTENSION);
    $file_name = uniqid('pres_') . '.' . $file_ext;
    $target_path = $pres_dir . $file_name;

    if (move_uploaded_file($_FILES['presentation_file']['tmp_name'], $target_path)) {
        $url = 'api/' . $target_path;
    }
}

try {
    $stmt = $pdo->prepare("UPDATE presentations SET title = ?, url = ?, thumbnail_url = ?, category = ? WHERE id = ?");
    $stmt->execute([$title, $url, $thumbnail_url, $category, $id]);
    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database update failed: ' . $e->getMessage()]);
}
?>
