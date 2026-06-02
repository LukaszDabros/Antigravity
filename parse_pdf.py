import pdfplumber
import re
import pandas as pd
from datetime import datetime

def parse_pko_pdf(pdf_path):
    transactions = []
    
    # Pattern for date at the start of a line
    date_pattern = re.compile(r'^(\d{2}\.\d{2}\.\d{4})')
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
                
            lines = text.split('\n')
            current_tx = None
            
            for line in lines:
                match = date_pattern.match(line)
                if match:
                    # If we had a previous transaction being built, save it
                    if current_tx:
                        transactions.append(current_tx)
                    
                    # New transaction detected
                    # Typical line: 03.04.2018 03.04.2018 DESCRIPTION 30,00 34 778,76
                    parts = line.split()
                    date_str = parts[0]
                    
                    # Transaction might have a second date (booking date)
                    # We look for amounts which usually have a comma and appear at the end
                    # But the description can be multiline.
                    
                    current_tx = {
                        'date': date_str,
                        'details': " ".join(parts[1:]),
                        'amount': 0.0,
                        'category': 'Of'
                    }
                elif current_tx:
                    # Append more details to the current transaction
                    current_tx['details'] += " " + line
            
            # Add the last one
            if current_tx:
                transactions.append(current_tx)
    
    # Refine transactions (extract amount and clean details)
    refined = []
    amount_pattern = re.compile(r'(-?\d+,\d{2})\s+\d+,\d{2}') # Amount followed by balance
    
    for tx in transactions:
        det = tx['details']
        
        # Look for amount
        # PKO BP formats often have amount and then balance at the end of the block
        # Example: 30,00 34 778,76
        # Or sometimes they are on the same line as the date.
        
        # Simple extraction for now: look for the last pair of numbers with commas
        found_amounts = re.findall(r'(-?\d+,\d{2})', det)
        if found_amounts:
            # Usually the first one in the "tail" is the amount, second is balance
            # But we might have other numbers. Let's look at the end of the string.
            tx['amount_str'] = found_amounts[0]
            try:
                tx['amount'] = float(found_amounts[0].replace(',', '.'))
            except:
                pass
        
        # Determine Category
        low_det = det.lower()
        if 'nadzieja' in low_det:
            tx['category'] = 'N'
        elif 'intencja' in low_det or 'msza' in low_det:
            tx['category'] = 'Int'
        else:
            tx['category'] = 'Of'
            
        refined.append(tx)
        
    return refined

if __name__ == "__main__":
    pdf_path = r"F:\Pendrive King\bMis\Finanse\Wyciągi bankowe\history_04 2018.pdf"
    txs = parse_pko_pdf(pdf_path)
    for t in txs[:5]:
        print(f"{t['date']} | {t['amount']} | {t['category']} | {t['details'][:50]}...")
