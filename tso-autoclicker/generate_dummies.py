import os
from PIL import Image

files_to_create = [
    # Interfejs
    "gwiazda.png",
    "szukanie_skarbu.png",
    "krotkie_poszukiwania.png",
    "przedluzone_poszukiwania.png",
    "szukanie_przygody.png",
    "wyslij_zielony.png",
    "ikona_x_zamknij.png",
    "pinezka.png",
    "ekipa.png",
    
    # Odkrywcy
    "zwykly_odkrywca.png",
    "szczesliwy_odkrywca.png",
    "nieustraszony_odkrywca.png",
    "sniezny_odkrywca.png",
    "zakochany_odkrywca.png",
    "smialy_odkrywca.png",
    "uroczy_odkrywca.png",
    "puszysty_odkrywca.png",
    "przestraszony_odkrywca.png",
    "krolewski_odkrywca.png",
    "zoe_odkrywca.png",
    "rina_odkrywca.png",
    "zadna_odkrywca.png",
    "dobrotliwa_odkrywca.png",
    "dzielna_odkrywca.png",
    "zauroczona_odkrywca.png",
    "tubylczy_zwiadowca.png",
    "macierzynska_odkrywca.png",
    "nora_odkrywca.png"
]

script_dir = os.path.dirname(os.path.abspath(__file__))
assets_dir = os.path.join(script_dir, 'web', 'assets')

# Ensure assets directory exists
os.makedirs(assets_dir, exist_ok=True)

print("Generowanie zastępczych, czerwonych kwadratów...")
for f in files_to_create:
    for target_dir in [script_dir, assets_dir]:
        full_path = os.path.join(target_dir, f)
        # Generuj plik TYLKO wtedy, kiedy fizycznie go jeszcze nie ma.
        # W ten sposób nie nadpiszemy grafik, które już sam ładnie wyciąłeś!
        if not os.path.exists(full_path):
            img = Image.new('RGB', (20, 20), color='red')
            img.save(full_path)
            print(f" [+] Utworzono pusty plik: {os.path.relpath(full_path, script_dir)}")
        else:
            print(f" [OK] Pominięto: {os.path.relpath(full_path, script_dir)} (Plik już istnieje)")

print("\nGotowe! Możesz je teraz podmieniać nadpisując w wycinarce Windowsa.")
