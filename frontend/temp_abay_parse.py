import urllib.request
url = 'https://www.gov.kz/memleket/entities/abay?lang=ru'
html = urllib.request.urlopen(url).read().decode('utf-8', errors='replace')
print(html[:1200])
