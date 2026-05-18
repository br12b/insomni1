# -*- coding: utf-8 -*-
import os
import json
import sys
from datetime import datetime, timedelta

try:
    from pytefas import Crawler
except ImportError:
    print("Error: 'pytefas' library is not installed. Please run 'pip install pytefas' first.")
    sys.exit(1)

print("====================================================")
print("   INSO-MNI AI AGENT TEFAS REAL-TIME SCRAPER  ")
print("====================================================")

crawler = Crawler()

# Automated Business Day Backtracking (up to 7 days for weekend safety)
def find_valid_day(target_date):
    for i in range(7):
        current_check = target_date - timedelta(days=i)
        date_str = current_check.strftime("%Y-%m-%d")
        print(f"Checking TEFAS data availability for: {date_str}...")
        try:
            df = crawler.fetch(date_str, columns="info", kind="YAT")
            if not df.empty:
                print(f"[SUCCESS] Active trading day found: {date_str}")
                return df, current_check
        except Exception as e:
            pass
    return None, None

# Find end date (Date B)
end_df, found_end_dt = find_valid_day(datetime.now())
if end_df is None:
    print("[ERROR] Critical Error: Could not retrieve any recent active trading data from TEFAS.")
    sys.exit(1)

# Find start date (Date A - 30 days prior)
print("\nFetching historical data (30 days prior)...")
target_start_dt = found_end_dt - timedelta(days=30)
start_df, found_start_dt = find_valid_day(target_start_dt)
if start_df is None:
    print("[ERROR] Critical Error: Could not retrieve historical comparison data from TEFAS.")
    sys.exit(1)

# Filter for Money Market Funds (PPFs)
def is_ppf(row):
    name = str(row['fund_name']).upper()
    return "PARA P" in name or "P.P." in name or "PPF" in name

ppf_a = start_df[start_df.apply(is_ppf, axis=1)][['fund_code', 'fund_name', 'price']]
ppf_b = end_df[end_df.apply(is_ppf, axis=1)][['fund_code', 'fund_name', 'price']]

# Merge on fund_code
import pandas as pd
merged = pd.merge(ppf_b, ppf_a, on='fund_code', suffixes=('_end', '_start'))

if merged.empty:
    print("[ERROR] Critical Error: No matching PPFs found between the start and end dates.")
    sys.exit(1)

# Calculate yields
merged['yield_val'] = ((merged['price_end'] - merged['price_start']) / merged['price_start']) * 100
sorted_merged = merged.sort_values(by='yield_val', ascending=False)

top5 = []
print("\n====================================================")
print(f"TOP 5 MONEY MARKET FUNDS (30-DAY YIELD):")
print("====================================================")

for idx, row in sorted_merged.head(5).iterrows():
    # Clean up and standardize the fund name representation
    clean_name = str(row['fund_name_end'])
    clean_name = clean_name.encode('utf-8', 'ignore').decode('utf-8', 'ignore')
    
    clean_name = clean_name.replace("PORTFÖY", "") \
                           .replace("PORTFY", "") \
                           .replace("PARA PİYASASI", "")                            .replace("PARA PYASASI", "")                            .replace("ŞEMSİYE", "")                            .replace("EMSYE", "")                            .replace("FONU", "")                            .replace("(TL)", "")                            .replace("  ", " ").strip()
                           
    clean_name = clean_name + " Para Piyasası"
    
    # Capitalize Words nicely
    cap_name = " ".join([w.capitalize() for w in clean_name.lower().split(" ")])
    
    yield_str = f"%{row['yield_val']:.2f}"
    print(f"  [{row['fund_code']}] Yield: {yield_str}")
    
    top5.append({
        "code": row['fund_code'],
        "name": cap_name,
        "yield": yield_str
    })

# Write to seededPPFs.json
output_data = {
    "updatedAt": found_end_dt.strftime("%Y-%m-%d"),
    "data": top5
}

seeded_file_path = f"c:/Users/emreb/.gemini/antigravity/brain/842cf0eb-2136-462f-81ea-3f80fd642547/cashedge-v2/src/utils/seededPPFs.json"
with open(seeded_file_path, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("====================================================")
print("SUCCESS: JSON Database updated successfully!")
print("====================================================")
