import re

try:
    with open('R:\\webplot\\Bankend\\WorkShopDiaryReport.xls', 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
        
    # Find the first tr
    tr_match = re.search(r'<tr[^>]*>(.*?)</tr>', html, re.IGNORECASE | re.DOTALL)
    if tr_match:
        tr_content = tr_match.group(1)
        # Find all td or th
        cell_matches = re.finditer(r'<t[dh][^>]*>(.*?)</t[dh]>', tr_content, re.IGNORECASE | re.DOTALL)
        
        cols = []
        for match in cell_matches:
            # Strip tags to get clean text
            clean = re.sub(r'<[^>]+>', '', match.group(1)).strip()
            cols.append(clean)
            
        print("Exact Legacy Columns:")
        for i, c in enumerate(cols):
            print(f"{i+1}: {c}")
    else:
        print("No row found")
except Exception as e:
    print(f"Error: {e}")
