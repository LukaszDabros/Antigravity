<?php
// add_presentation.php
require 'config.php';

error_reporting(0);
header('Content-Type: application/json');

// Check for post_max_size exceeded
if (empty($_POST) && empty($_FILES) && isset($_SERVER['CONTENT_LENGTH']) && $_SERVER['CONTENT_LENGTH'] > 0) {
    $json = json_decode(file_get_contents('php://input'), true);
    if ($json === null) {
        http_response_code(413);
        echo json_encode(['error' => 'Przekroczono maksymalny rozmiar danych. Plik lub zawartość jest zbyt duża.']);
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Handle both JSON and multipart/form-data
$password = $_POST['password'] ?? null;
$title = isset($_POST['title_b64']) ? base64_decode($_POST['title_b64']) : ($_POST['title'] ?? null);
$url = isset($_POST['url_b64']) ? base64_decode($_POST['url_b64']) : ($_POST['url'] ?? null);
$category = $_POST['category'] ?? null;
$thumbnail_url = isset($_POST['thumbnail_url_b64']) ? base64_decode($_POST['thumbnail_url_b64']) : ($_POST['thumbnail_url'] ?? null);

if (!$password) {
    $json = json_decode(file_get_contents('php://input'), true);
    $password = $json['password'] ?? null;
    $title = isset($json['title_b64']) ? base64_decode($json['title_b64']) : ($json['title'] ?? null);
    $url = isset($json['url_b64']) ? base64_decode($json['url_b64']) : ($json['url'] ?? null);
    $category = $json['category'] ?? null;
    $thumbnail_url = isset($json['thumbnail_url_b64']) ? base64_decode($json['thumbnail_url_b64']) : ($json['thumbnail_url'] ?? null);
}

if ($password !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!$title || !$category) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields (title or category)']);
    exit();
}

// Ensure URL is provided OR a file is being uploaded
$is_upload = isset($_FILES['presentation_file']) && $_FILES['presentation_file']['error'] === UPLOAD_ERR_OK;
if (!$url && !$is_upload) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing URL or Presentation File']);
    exit();
}

// Handle Thumbnail Upload
if (isset($_FILES['thumbnail_file'])) {
    if ($_FILES['thumbnail_file']['error'] === UPLOAD_ERR_INI_SIZE || $_FILES['thumbnail_file']['error'] === UPLOAD_ERR_FORM_SIZE) {
        http_response_code(413);
        echo json_encode(['error' => 'Plik miniatury jest zbyt duży. Maksymalny dopuszczalny rozmiar pliku zależy od ustawień Twojego serwera.']);
        exit();
    }

    if ($_FILES['thumbnail_file']['error'] === UPLOAD_ERR_OK) {
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
}

// Handle Presentation File Upload
if (isset($_FILES['presentation_file'])) {
    if ($_FILES['presentation_file']['error'] === UPLOAD_ERR_INI_SIZE || $_FILES['presentation_file']['error'] === UPLOAD_ERR_FORM_SIZE) {
        http_response_code(413);
        echo json_encode(['error' => 'Plik prezentacji jest zbyt duży. Maksymalny dopuszczalny rozmiar pliku zależy od ustawień Twojego serwera.']);
        exit();
    }

    if ($_FILES['presentation_file']['error'] === UPLOAD_ERR_OK) {
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
}

try {
    $stmt = $pdo->prepare("INSERT INTO presentations (title, url, thumbnail_url, category) VALUES (?, ?, ?, ?)");
    $stmt->execute([$title, $url, $thumbnail_url, $category]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
