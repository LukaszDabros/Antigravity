import pdfplumber
import re
import pandas as pd
from datetime import datetime, timedelta
import difflib
import os

def clean_name(name):
    if not name: return ""
    # Remove common words and clean up
    name = re.sub(r'PRZELEW|PRZYCHODZĄCY|OFIARA|MSZA|INTENCJA|NADZIEJA', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\d+', '', name)
    name = " ".join(name.split())
    return name.upper()

def get_best_match(sender_info, excel_persons):
    """
    sender_info: string from PDF (description/sender)
    excel_persons: list of dicts {'id': row_idx, 'label': 'SURNAME NAME'}
    """
    sender_clean = clean_name(sender_info)
    if not sender_clean or len(sender_clean) < 3:
        return None, 0
    
    # Try exact match first
    for p in excel_persons:
        if p['label'] in sender_clean or sender_clean in p['label']:
            return p, 1.0
            
    # Use difflib for fuzzy match
    choices = [p['label'] for p in excel_persons]
    matches = difflib.get_close_matches(sender_clean, choices, n=1, cutoff=0.6)
    
    if matches:
        best_label = matches[0]
        for p in excel_persons:
            if p['label'] == best_label:
                return p, 0.8 # Score
                
    return None, 0

def parse_pdf_better(pdf_path):
    transactions = []
    date_pattern = re.compile(r'^(\d{2}\.\d{2}\.\d{4})')
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text: continue
            lines = text.split('\n')
            current_tx = None
            for line in lines:
                match = date_pattern.match(line)
                if match:
                    if current_tx: transactions.append(current_tx)
                    parts = line.split()
                    current_tx = {'date': parts[0], 'details': " ".join(parts[1:]), 'amount': 0.0}
                elif current_tx:
                    current_tx['details'] += " " + line
            if current_tx: transactions.append(current_tx)
            
    for tx in transactions:
        # Extract amount
        found_amounts = re.findall(r'(\d+,\d{2})', tx['details'])
        if found_amounts:
            # Usually the first is amount, second is balance
            tx['amount_val'] = float(found_amounts[0].replace(',', '.'))
        else:
            tx['amount_val'] = 0.0
            
        low_det = tx['details'].lower()
        if 'nadzieja' in low_det: tx['tag'] = 'N'
        elif 'intencja' in low_det or 'msza' in low_det: tx['tag'] = 'Int'
        else: tx['tag'] = 'Of'
        
    return transactions

def run_import():
    xls_path = r"F:\Pendrive King\bMis\Finanse\Baza Danych 2018_Auto.xlsx"
    pdf_path = r"F:\Pendrive King\bMis\Finanse\Wyciągi bankowe\history_04 2018.pdf"
    
    print("Reading Excel...")
    df = pd.read_excel(xls_path, header=None)
    
    # Extract persons from XLS (Header is at row 0, data starts from row 1)
    # Col 0: Imię, Col 1: Nazwisko
    excel_persons = []
    for idx, row in df.iterrows():
        if idx == 0: continue
        name = str(row[0]).strip()
        surname = str(row[1]).strip()
        if name != 'nan' and surname != 'nan':
            excel_persons.append({
                'row': idx,
                'label': f"{surname.upper()} {name.upper()}",
                'name': name,
                'surname': surname
            })
            
    print(f"Loaded {len(excel_persons)} persons from Excel.")
    
    print("Parsing PDF...")
    bank_txs = parse_pdf_better(pdf_path)
    print(f"Found {len(bank_txs)} transactions in PDF.")
    
    results = []
    for tx in bank_txs:
        if tx['amount_val'] == 0: continue
        
        person, score = get_best_match(tx['details'], excel_persons)
        
        results.append({
            'date': tx['date'],
            'amount': tx['amount_val'],
            'tag': tx['tag'],
            'details': tx['details'][:60],
            'matched_person': person['label'] if person else "???",
            'row': person['row'] if person else None,
            'score': score
        })
        
    # Generate Report Table
    print("\n--- REPORT: PROPOSED UPDATES ---")
    print(f"{'Date':<12} | {'Amount':<8} | {'Tag':<4} | {'Match':<25} | {'Details'}")
    print("-" * 100)
    
    summary = {'N': 0.0, 'Int': 0.0, 'Of': 0.0}
    
    for r in results:
        print(f"{r['date']:<12} | {r['amount']:<8} | {r['tag']:<4} | {r['matched_person']:<25} | {r['details']}")
        summary[r['tag']] += r['amount']
        
    print("\n--- SUMMARY TOTALS ---")
    for k, v in summary.items():
        print(f"Total {k}: {v:.2f} zł")
    print(f"GRAND TOTAL: {sum(summary.values()):.2f} zł")
    
    return results

if __name__ == "__main__":
    run_import()
