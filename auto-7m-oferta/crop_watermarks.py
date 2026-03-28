from PIL import Image
import os

files_to_crop = ["picture_5.jpg", "picture_6.jpg", "picture_8.jpg", "picture_9.jpg"]
directory = "pictures"

for filename in files_to_crop:
    filepath = os.path.join(directory, filename)
    if os.path.exists(filepath):
        try:
            img = Image.open(filepath)
            w, h = img.size
            crop_amount = int(h * 0.08)
            cropped_img = img.crop((0, 0, w, h - crop_amount))
            cropped_img.save(filepath)
            print(f"Pomyślnie przycięto {filename} (usunięto dolne {crop_amount}px)")
        except Exception as e:
            print(f"Błąd: {e}")
