import urllib.request
import re

url = "https://settlersonlinewiki.eu/poradniki/odkrywca/"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    
    # Znajdź wszystkie ciągi zaczynające się od src="..." lub src='...'
    sources = re.findall(r'src=["\']([^"\']+)["\']', html)
    
    print("Znalezione grafiki:")
    for src in sources:
        if src.endswith(('.png', '.jpg', '.gif')):
            print(src)
except Exception as e:
    print("Error:", e)
