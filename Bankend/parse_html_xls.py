from bs4 import BeautifulSoup

try:
    with open('R:\\webplot\\Bankend\\WorkShopDiaryReport.xls', 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f, 'html.parser')
        
    table = soup.find('table')
    if table:
        header = table.find('tr')
        if header:
            cols = [th.text.strip() for th in header.find_all(['th', 'td'])]
            print("Exact Legacy Columns:")
            print(", ".join(cols))
        else:
            print("No header row found")
    else:
        print("No table found")
except Exception as e:
    print(f"Error: {e}")
