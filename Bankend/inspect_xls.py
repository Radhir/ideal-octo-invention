import sys

try:
    with open('R:\\webplot\\Bankend\\WorkShopDiaryReport.xls', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        print("File starts with:")
        print(content[:500])
        print("...")
        if "<html>" in content.lower() or "<table" in content.lower():
            print("File is HTML!")
            import pandas as pd
            df = pd.read_html(content)[0]
            print("Columns:")
            print(df.columns.tolist())
            sys.exit(0)
except Exception as e:
    print(f"Error reading as text: {e}")

try:
    import pandas as pd
    df = pd.read_excel('R:\\webplot\\Bankend\\WorkShopDiaryReport.xls')
    print("Columns:")
    print(df.columns.tolist())
except Exception as e:
    print(f"Error reading as excel: {e}")
