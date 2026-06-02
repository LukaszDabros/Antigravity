<?php
require 'config.php';
header('Content-Type: application/json');

// Sprawdzanie autoryzacji
if (!isset($_POST['password']) || $_POST['password'] !== $admin_password) {
    http_response_code(401);
    echo json_encode(['error' => 'Brak uprawnień.']);
    exit();
}

// Sprawdzanie czy przeslano plik
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Błąd przesyłania pliku.']);
    exit();
}

$file = $_FILES['image'];

// Walidacja mime type (czy to obraz)
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowed_mimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($mime, $allowed_mimes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Niedozwolony format pliku. Obsługiwane to JPG, PNG, GIF, WEBP.']);
    exit();
}

// Walidacja wielkosci pliku (max 5MB)
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'Plik jest zbyt duży. Maksymalny rozmiar to 5MB.']);
    exit();
}

// Przygotowanie folderu docelowego
$upload_dir = '../uploads/pages/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Generowanie unikalnej nazwy pliku i rozszerzenia
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
if (empty($extension)) {
    if ($mime === 'image/jpeg')
        $extension = 'jpg';
    elseif ($mime === 'image/png')
        $extension = 'png';
    elseif ($mime === 'image/gif')
        $extension = 'gif';
    elseif ($mime === 'image/webp')
        $extension = 'webp';
    else
        $extension = 'jpg';
}

$filename = uniqid('page_img_') . '.' . strtolower($extension);
$destination = $upload_dir . $filename;

// Przenoszenie pliku
if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Generowanie URL zwracanego do edytora (zwracamy sciezke zaczynajaca sie od glownego katalogu serwera lub uploads/)
    // Poniewaz EDB jest serwowane najprawdopodobniej na roocie, sciezka bezposrednia to /uploads/pages/
    $image_url = '/uploads/pages/' . $filename;
    echo json_encode(['success' => true, 'url' => $image_url]);
}
else {
    http_response_code(500);
    echo json_encode(['error' => 'Nie udało się zapisać pliku na serwerze.']);
}
?>
