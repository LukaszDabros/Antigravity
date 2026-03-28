import os
import shutil
import pathlib

# Ścieżka do folderu Pobrane (Downloads) bieżącego użytkownika
DOWNLOADS_DIR = pathlib.Path.home() / 'Downloads'

# Słownik kategorii i przypisanych do nich rozszerzeń plików
CATEGORIES = {
    'Obrazy': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico'],
    'Dokumenty': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.rtf', '.odt'],
    'Archiwa': ['.zip', '.rar', '.7z', '.tar', '.gz', '.iso'],
    'Instalatory': ['.exe', '.msi', '.apk', '.bat', '.cmd'],
    'Wideo': ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv'],
    'Audio': ['.mp3', '.wav', '.aac', '.flac', '.ogg', '.wma'],
    'Kody_i_Skrypty': ['.py', '.js', '.html', '.css', '.json', '.xml', '.cpp', '.c', '.java', '.php', '.sql'],
    'Excel_i_CSV': ['.csv', '.xlsx', '.xls'], # Opcjonalnie dodatkowa kategoria
    'Inne': [] # Domyślny folder dla nierozpoznanych plików
}

def organize_folder(folder_path):
    if not folder_path.exists():
        print(f"Błąd: Nie znaleziono folderu {folder_path}")
        return

    print(f"Rozpoczynam porządkowanie folderu: {folder_path}")
    
    # Tworzenie folderów docelowych (jeśli nie istnieją)
    for category in CATEGORIES.keys():
        category_path = folder_path / category
        if not category_path.exists():
            category_path.mkdir(exist_ok=True)

    moved_count = 0

    # Przeglądanie plików w folderze Pobrane
    for item in folder_path.iterdir():
        # Ignorujemy foldery, przenosimy tylko pliki
        if item.is_file():
            file_extension = item.suffix.lower()
            
            # Znalezienie odpowiedniej kategorii dla pliku
            destination_category = 'Inne'
            for category, extensions in CATEGORIES.items():
                if file_extension in extensions:
                    destination_category = category
                    break
            
            # Ścieżka docelowa dla pliku
            destination_folder = folder_path / destination_category
            destination_path = destination_folder / item.name
            
            # Obsługa konfliktów nazw (dodanie numeru do nazwy pliku, np. plik_1.jpg)
            counter = 1
            while destination_path.exists():
                name_without_extension = item.stem
                destination_path = destination_folder / f"{name_without_extension}_{counter}{file_extension}"
                counter += 1
            
            # Przeniesienie pliku
            try:
                shutil.move(str(item), str(destination_path))
                print(f"Przeniesiono: {item.name} -> {destination_category}")
                moved_count += 1
            except Exception as e:
                print(f"Błąd podczas przenoszenia {item.name}: {e}")

    print(f"\nZakończono porządkowanie! Przeniesiono {moved_count} plików.")

if __name__ == "__main__":
    organize_folder(DOWNLOADS_DIR)
