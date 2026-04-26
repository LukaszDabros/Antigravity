import pandas as pd
import sys

xls_path = r"F:\Pendrive King\bMis\Finanse\Baza Danych 24-08-2018.xls"
xlsx_path = r"F:\Pendrive King\bMis\Finanse\Baza Danych 2018_Auto.xlsx"

try:
    # Get all sheet names
    xls = pd.ExcelFile(xls_path, engine='xlrd')
    print(f"Sheet names: {xls.sheet_names}")
    
    # Read the main sheet (assuming first one is the database)
    df = pd.read_excel(xls_path, sheet_name=0, header=None)
    
    # Save to XLSX
    df.to_excel(xlsx_path, index=False, header=False)
    print(f"Successfully converted to {xlsx_path}")
except Exception as e:
    print(f"Error: {e}")
