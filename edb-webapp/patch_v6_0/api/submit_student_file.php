<?php
// submit_student_file.php
require 'config.php';

header('Content-Type: application/json');

// This script now handles both multipart/form-data (for files) and json (for links)
$student_name = "";
$url = null;
$school_type = "";
$file_path = null;

if (isset($_POST['student_name'])) {
    // Handling form-data (file upload)
    $student_name = $_POST['student_name'];
    $school_type = $_POST['school_type'];

    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $max_size = 50 * 1024 * 1024; // 50MB

        if ($file['size'] > $max_size) {
            http_response_code(400);
            echo json_encode(['error' => 'Plik jest za duży (max 50MB)']);
            exit();
        }

        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        $file_ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $file_name = uniqid() . '.' . $file_ext;
        $target_path = $upload_dir . $file_name;

        if (move_uploaded_file($file['tmp_name'], $target_path)) {
            $file_path = 'api/' . $target_path;
        }
        else {
            http_response_code(500);
            echo json_encode(['error' => 'Błąd zapisu pliku na serwerze']);
            exit();
        }
    }
    else if (isset($_POST['url'])) {
        $url = $_POST['url'];
    }
}
else {
    // Fallback to JSON for link submission
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data) {
        $student_name = $data['student_name'];
        $url = $data['url'];
        $school_type = $data['school_type'];
    }
}

if (empty($student_name) || empty($school_type)) {
    http_response_code(400);
    echo json_encode(['error' => 'Wszystkie pola są wymagane']);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO student_submissions (student_name, url, file_path, school_type) VALUES (?, ?, ?, ?)");
    $stmt->execute([$student_name, $url, $file_path, $school_type]);

    echo json_encode(['success' => true]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd serwera podczas zapisywania']);
}
?>
