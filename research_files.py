import pandas as pd
import pdfplumber
import sys

def inspect_xls(file_path):
    print(f"--- Inspecting XLS: {file_path} ---")
    try:
        # xlrd is for .xls
        df = pd.read_excel(file_path, engine='xlrd')
        print("Columns:", df.columns.tolist())
        print("First 3 rows:")
        print(df.iloc[:3, :10].to_string()) # Show first 10 columns
    except Exception as e:
        print(f"Error reading XLS: {e}")

def inspect_pdf(file_path):
    print(f"\n--- Inspecting PDF: {file_path} ---")
    try:
        with pdfplumber.open(file_path) as pdf:
            first_page = pdf.pages[0]
            text = first_page.extract_text()
            print("First page text (start):")
            print(text[:1000] if text else "No text found")
            
            # Try to extract tables
            tables = first_page.extract_tables()
            if tables:
                print("\nTables found on first page:")
                for i, table in enumerate(tables[:2]):
                    print(f"Table {i}:")
                    for row in table[:5]:
                        print(row)
    except Exception as e:
        print(f"Error reading PDF: {e}")

if __name__ == "__main__":
    xls_path = r"F:\Pendrive King\bMis\Finanse\Baza Danych 24-08-2018.xls"
    pdf_path = r"F:\Pendrive King\bMis\Finanse\Wyciągi bankowe\history_04 2018.pdf"
    
    inspect_xls(xls_path)
    inspect_pdf(pdf_path)
