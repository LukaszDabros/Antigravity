# Skrypt PowerShell do porządkowania folderu Pobrane na systemie Windows
$downloadsPath = [System.IO.Path]::Combine($env:USERPROFILE, "Downloads")

# Definicje kategorii i rozszerzeń
$categories = @{
    "Obrazy" = @(".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".ico")
    "Dokumenty" = @(".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv", ".rtf", ".odt")
    "Archiwa" = @(".zip", ".rar", ".7z", ".tar", ".gz", ".iso")
    "Instalatory" = @(".exe", ".msi", ".apk", ".bat", ".cmd")
    "Wideo" = @(".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv")
    "Audio" = @(".mp3", ".wav", ".aac", ".flac", ".ogg", ".wma")
    "Kody_i_Skrypty" = @(".py", ".js", ".html", ".css", ".json", ".xml", ".cpp", ".c", ".java", ".php", ".sql")
}

Write-Host "Rozpoczynam porządkowanie folderu: $downloadsPath" -ForegroundColor Cyan

# Tworzenie folderów jeśli nie istnieją
foreach ($category in $categories.Keys) {
    $categoryPath = Join-Path -Path $downloadsPath -ChildPath $category
    if (-not (Test-Path -Path $categoryPath)) {
        New-Item -ItemType Directory -Path $categoryPath | Out-Null
    }
}

# Utworzenie folderu 'Inne' jako domyślnego
$innePath = Join-Path -Path $downloadsPath -ChildPath "Inne"
if (-not (Test-Path -Path $innePath)) {
    New-Item -ItemType Directory -Path $innePath | Out-Null
}

# Pobranie wszystkich plików bezpośrednio w folderze Pobrane (ignorujemy podfoldery)
$files = Get-ChildItem -Path $downloadsPath -File

$movedCount = 0

foreach ($file in $files) {
    if (-not $file.Extension) {
        $extension = ""
    } else {
        $extension = $file.Extension.ToLower()
    }
    
    $destinationCategory = "Inne"

    # Dopasowanie rozszerzenia do kategorii
    if ($extension -ne "") {
        foreach ($category in $categories.GetEnumerator()) {
            if ($category.Value -contains $extension) {
                $destinationCategory = $category.Name
                break
            }
        }
    }

    $destinationFolder = Join-Path -Path $downloadsPath -ChildPath $destinationCategory
    $destinationPath = Join-Path -Path $destinationFolder -ChildPath $file.Name

    # Obsługa duplikatów
    $counter = 1
    while (Test-Path -Path $destinationPath) {
        $newName = "{0}_{1}{2}" -f $file.BaseName, $counter, $file.Extension
        $destinationPath = Join-Path -Path $destinationFolder -ChildPath $newName
        $counter++
    }

    # Przenoszenie pliku
    Try {
        Move-Item -Path $file.FullName -Destination $destinationPath -ErrorAction Stop
        Write-Host "Przeniesiono: $($file.Name) -> $destinationCategory" -ForegroundColor Green
        $movedCount++
    } Catch {
        Write-Host "Błąd podczas przenoszenia $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host "`nZakończono! Przeniesiono $movedCount plików." -ForegroundColor Cyan
Write-Host "Wciśnij dowolny klawisz, aby zakończyć..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
