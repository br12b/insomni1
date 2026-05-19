import os
import sys
import random
import shutil

# KUTUPHANE KONTROLU
try:
    from fpdf import FPDF
except ImportError:
    os.system(f"{sys.executable} -m pip install fpdf2")
    from fpdf import FPDF

# Turkish character to ASCII converter helper to 100% prevent FPDF character range crashes!
def to_ascii(text):
    mapping = {
        'ı': 'i', 'ş': 's', 'ğ': 'g', 'ç': 'c', 'ö': 'o', 'ü': 'u',
        'ı'.upper(): 'I', 'ş'.upper(): 'S', 'ğ'.upper(): 'G', 'ç'.upper(): 'C', 'ö'.upper(): 'O', 'ü'.upper(): 'U',
        'İ': 'I', 'Ş': 'S', 'Ğ': 'G', 'Ç': 'C', 'Ö': 'O', 'Ü': 'U'
    }
    for k, v in mapping.items():
        text = text.replace(k, v)
    return text

class BankStatement(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 20)
        self.set_text_color(129, 140, 248) # Premium Indigo color
        self.cell(0, 10, 'INSOMNI PRIVATE BANKING', new_x="LMARGIN", new_y="NEXT", align='L')
        self.set_font('helvetica', '', 10)
        self.set_text_color(156, 163, 175)
        self.cell(0, 5, 'Autonomous Identity Profiling & Statement Engine v3.0', new_x="LMARGIN", new_y="NEXT")
        self.ln(10)

def generate_profile_pdf(name, ratings, persona):
    pdf = BankStatement()
    pdf.add_page()
    
    # Zengin platform veri havuzu
    merchants = {
        "gaming": [
            ("Steam Games", 450), ("Eneba Key Market", 350), ("ByNoGame Pin", 250), 
            ("Voidu Game Store", 500), ("Kabasakal Online", 150), ("Epic Games Purchases", 300), 
            ("Humble Bundle Subscription", 220), ("Razer Gold Pin", 180), 
            ("Xbox Game Pass", 209), ("PlayStation Network", 400)
        ],
        "food": [
            ("Migros Sanal Market", 1200), ("Starbucks Coffee", 180), ("GetirYemek", 380), 
            ("Yemeksepeti Siparis", 420), ("Trendyol Yemek", 350), ("CarrefourSA Market", 950), 
            ("Kahve Dunyasi", 120), ("Burger King", 280), ("Macrocenter Gourmet", 850), 
            ("A101 Market", 450)
        ],
        "kira": [
            ("Sahibinden Kira Odemesi", 12500),
            ("Kira Odemesi", 12500),
            ("Daire Kira Bedeli", 12500)
        ],
        "housing": [
            ("Emlak Vergisi Odemesi", 2400), ("Site Aidati", 1500), 
            ("Deprem Sigortasi DASK", 900), ("IKEA Ev Esyasi", 3500), ("Evidea Mobilya", 2800), 
            ("Koctas Yapi Market", 1400)
        ],
        "transport": [
            ("Shell Akaryakit", 2800), ("BP Fuel Station", 2200), ("Uber Yolculuk", 450), 
            ("BiTaksi", 180), ("Istanbulkart Yukleme", 300), ("OGS/HGS Gecisi", 250), 
            ("Otogar Otobus Bileti", 600)
        ],
        "bills": [
            ("Turkcell Fatura Odemesi", 650), ("Netflix Premium", 229), ("Spotify Duo", 129), 
            ("YouTube Premium", 110), ("Disney+ Monthly", 150), ("iCloud Saklama Alani", 60), 
            ("ChatGPT Plus", 680), ("Amazon Prime", 39), ("TurkNet Internet", 399), 
            ("ENERJISA Elektrik", 850)
        ]
    }

    statement = []

    # Sektör puanlarına göre işlem adetlerini ve miktarlarını ayarla
    for sec_id, score in ratings.items():
        base_count = score
        if (sec_id == "gaming" and "Oyuncu" in persona) or \
           (sec_id == "food" and "Gurme" in persona) or \
           (sec_id == "housing" and "Ev Kuşu" in persona) or \
           (sec_id == "transport" and "Gezgin" in persona) or \
           (sec_id == "bills" and "Abonelik" in persona):
            base_count += 3 # Ekstra harcama ekle
            
        if "Tasarruf" in persona:
            base_count = max(1, base_count - 1)

        # Kira için özel durum: Puanı 0 ise hiç kira eklemesin, 1 veya üzeri ise tek bir kira ödemesi eklesin
        if sec_id == "kira":
            if score > 0:
                available_merchants = merchants.get(sec_id, [])
                item = random.choice(available_merchants)
                multiplier = 1.0 + (score * 0.05) + (random.uniform(-0.02, 0.02))
                price = int(item[1] * multiplier)
                statement.append({
                    "date": "05.05.2026",
                    "name": item[0],
                    "cat": "Kira",
                    "price": price
                })
            continue

        available_merchants = merchants.get(sec_id, [])
        count = min(base_count, len(available_merchants))
        
        selected = random.sample(available_merchants, count)
        for item in selected:
            multiplier = 1.0 + (score * 0.15) + (random.uniform(-0.15, 0.15))
            if "Tasarruf" in persona:
                multiplier *= 0.65
            price = int(item[1] * multiplier)
            
            statement.append({
                "date": f"{random.randint(1, 28):02d}.05.2026",
                "name": item[0],
                "cat": "Barinma" if sec_id == "housing" else sec_id.capitalize(),
                "price": price
            })

    statement.sort(key=lambda x: x["date"])

    # PDF TABLO CIZIMI
    pdf.set_font('helvetica', 'B', 11)
    pdf.cell(0, 10, to_ascii(f"Sayin {name.upper()}, Ayin Finansal Raporu (Mayis 2026):"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    pdf.set_fill_color(240, 240, 240)
    pdf.set_font('helvetica', 'B', 10)
    pdf.cell(30, 10, to_ascii('Tarih'), 1, 0, 'C', True)
    pdf.cell(80, 10, to_ascii('Aciklama'), 1, 0, 'L', True)
    pdf.cell(40, 10, to_ascii('Kategori'), 1, 0, 'C', True)
    pdf.cell(40, 10, to_ascii('Tutar'), 1, 1, 'R', True)

    pdf.set_font('helvetica', '', 10)
    fill = False
    for item in statement:
        pdf.cell(30, 8, to_ascii(item["date"]), 1, 0, 'C', fill)
        pdf.cell(80, 8, to_ascii(item["name"]), 1, 0, 'L', fill)
        pdf.cell(40, 8, to_ascii(item["cat"]), 1, 0, 'C', fill)
        pdf.cell(40, 8, to_ascii(f"-{item['price']} TL"), 1, 1, 'R', fill)
        fill = not fill

    # PDF Footer / System Key
    pdf.ln(10)
    pdf.set_font('helvetica', 'B', 8)
    pdf.set_text_color(156, 163, 175)
    pdf.cell(0, 5, to_ascii('================================================================================'), new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.cell(0, 5, to_ascii('SECURE METADATA CLOUD BRIDGE KEY. DO NOT ALTER THIS LINE:'), new_x="LMARGIN", new_y="NEXT", align='C')
    
    # Secure Bridge Meta String!
    meta_str = f"KEY:{name}|{ratings['gaming']},{ratings['food']},{ratings['kira']},{ratings['housing']},{ratings['transport']},{ratings['bills']}"
    pdf.cell(0, 5, to_ascii(meta_str), new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.cell(0, 5, to_ascii('================================================================================'), new_x="LMARGIN", new_y="NEXT", align='C')

    # Output to local dir
    safe_name = name.replace(" ", "_")
    filename = f"Ekstre_{safe_name}.pdf"
    pdf.output(filename)
    print(f"[R.E.M AI]: {filename} başarıyla oluşturuldu.")

    # Copy to Downloads
    try:
        home = os.path.expanduser("~")
        downloads_dir = os.path.join(home, "Downloads")
        if os.path.exists(downloads_dir):
            shutil.copy2(filename, os.path.join(downloads_dir, filename))
            print(f"[R.E.M AI]: Bir kopya İndirilenler klasörüne kopyalandi: {os.path.join(downloads_dir, filename)}")
    except Exception as e:
        print(f"Kopyalama hatası: {e}")

# 4 Farklı Finansal Profil Tanımı
profiles = [
    {
        "name": "Mert Oyuncu",
        "ratings": {"gaming": 5, "food": 2, "kira": 0, "housing": 1, "transport": 1, "bills": 4},
        "persona": "Dopamin Canavarı Oyuncu 🎮"
    },
    {
        "name": "Selin Gurme",
        "ratings": {"gaming": 1, "food": 5, "kira": 4, "housing": 2, "transport": 2, "bills": 2},
        "persona": "Gurme Kaşif 🍔"
    },
    {
        "name": "Ahmet Tasarruf",
        "ratings": {"gaming": 0, "food": 1, "kira": 2, "housing": 1, "transport": 1, "bills": 1},
        "persona": "Tasarruf Şampiyonu 🏆"
    },
    {
        "name": "Can Gezgin",
        "ratings": {"gaming": 1, "food": 3, "kira": 0, "housing": 1, "transport": 5, "bills": 2},
        "persona": "Gezgin Ruh 🚗"
    }
]

for p in profiles:
    generate_profile_pdf(p["name"], p["ratings"], p["persona"])

print("\n[R.E.M AI]: Tüm 4 test ekstresi başarıyla hazırlandı!")
