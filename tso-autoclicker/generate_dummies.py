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
    "odwazny_odkrywca.png",
    "zuchwaly_odkrywca.png",
    "uroczy_odkrywca.png",
    "bystry_odkrywca.png",
    "puszysty_odkrywca.png",
    "przestraszony_odkrywca.png",
    "krolewski_odkrywca.png",
    "zoe_odkrywca.png",
    "rina_odkrywca.png",
    "zadna_odkrywca.png",
    "dobrotliwa_odkrywca.png",
    "dzielna_odkrywca.png",
    "zauroczona_odkrywca.png"
]

script_dir = os.path.dirname(os.path.abspath(__file__))

print("Generowanie zastępczych, czerwonych kwadratów...")
for f in files_to_create:
    full_path = os.path.join(script_dir, f)
    # Generuj plik TYLKO wtedy, kiedy fizycznie go jeszcze nie ma.
    # W ten sposób nie nadpiszemy grafik, które już sam ładnie wyciąłeś!
    if not os.path.exists(full_path):
        img = Image.new('RGB', (20, 20), color='red')
        img.save(full_path)
        print(f" [+] Utworzono pusty plik: {f}")
    else:
        print(f" [OK] Pominięto: {f} (Plik już istnieje u Ciebie na dysku)")

print("\nGotowe! Możesz je teraz podmieniać nadpisując w wycinarce Windowsa.")
