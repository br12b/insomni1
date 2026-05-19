import os
import sys
import random
import datetime
import json
import webbrowser
import shutil
import http.server
import socketserver
import threading



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

def get_user_config():
    print("\n" + "="*60)
    print("      INSOMNI PREMIUM FİNANSAL KİMLİK & EKSTRE PANELİ")
    print("="*60)
    
    name = input("Müşteri Adı: ").strip() or "Emre"
    
    print("\nLütfen aşağıdaki sektörlerdeki harcama eğiliminizi")
    print("0 (Hiç/Çok Düşük) ile 5 (Çok Yüksek) arasında puanlayın:")
    
    sectors = [
        ("gaming", "Oyun / Dijital Eğlence (Steam, Eneba, Voidu...)"),
        ("food", "Gıda / Market / Dışarıda Yemek (Getir, Starbucks...)"),
        ("kira", "Kira Ödemesi (Sahibinden Kira, Rezidans...)"),
        ("housing", "Barınma / Ev Eşyası / Aidat (IKEA, Koçtaş, Aidat...)"),
        ("transport", "Ulaşım / Yakıt / Seyahat (Shell, Uber, Otobüs...)"),
        ("bills", "Faturalar / Dijital Abonelikler (Turkcell, Netflix...)")
    ]
    
    ratings = {}
    for sid, label in sectors:
        while True:
            try:
                val = input(f" - {label} [0-5]: ")
                if not val:
                    val = "3"
                num = int(val)
                if 0 <= num <= 5:
                    ratings[sid] = num
                    break
                else:
                    print("Lütfen 0 ile 5 arasında bir tam sayı girin.")
            except ValueError:
                print("Geçersiz giriş. Lütfen bir sayı girin.")
                
    # Persona Hesaplama
    gaming = ratings["gaming"]
    food = ratings["food"]
    kira = ratings["kira"]
    housing = ratings["housing"]
    transport = ratings["transport"]
    bills = ratings["bills"]
    
    scores_dict = {
        "Dopamin Canavarı Oyuncu 🎮": gaming,
        "Gurme Kaşif 🍔": food,
        "Konfor Odaklı Ev Kuşu 🏠": housing,
        "Gezgin Ruh 🚗": transport,
        "Dijital Abonelik Gurusu 📄": bills
    }
    
    # En yüksek skoru bul
    highest_persona = max(scores_dict, key=scores_dict.get)
    highest_score = scores_dict[highest_persona]
    
    total_score = sum(ratings.values())
    
    if highest_score >= 4:
        persona = highest_persona
    elif total_score <= 8:
        persona = "Tasarruf Şampiyonu 🏆"
    else:
        persona = "Dengeli Harcamacı ⚖️"
        
    print("\n" + "-"*60)
    print(f" ANALİZ BAŞARILI! Finansal Profiliniz: {persona}")
    print("-"*60)
    
    return {
        "name": name,
        "ratings": ratings,
        "persona": persona
    }

def generate_custom_pdf():
    try:
        config = get_user_config()
        
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
        ratings = config["ratings"]
        persona = config["persona"]

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

            # Kira için özel durum: Puanı 0 ise hiç kira eklemesin, 1 veya üzeri ise tek bir kira ödemesi eklesin (Çünkü 2 kira ödenmez!)
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

        # PDF TABLO CIZIMI (Karakter analizi / Persona PDF içeriğinden tamamen çıkartıldı!)
        pdf.set_font('helvetica', 'B', 11)
        pdf.cell(0, 10, to_ascii(f"Sayin {config['name'].upper()}, Ayin Finansal Raporu (Mayis 2026):"), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(5)

        pdf.set_fill_color(240, 240, 240)
        pdf.set_font('helvetica', 'B', 10)
        pdf.cell(30, 10, to_ascii('Tarih'), 1, 0, 'C', True)
        pdf.cell(80, 10, to_ascii('Aciklama'), 1, 0, 'L', True)
        pdf.cell(40, 10, to_ascii('Kategori'), 1, 0, 'C', True)
        pdf.cell(40, 10, to_ascii('Tutar (TL)'), 1, new_x="LMARGIN", new_y="NEXT", align='R', fill=True)

        pdf.set_font('helvetica', '', 9)
        total = 0
        for row in statement:
            pdf.cell(30, 8, to_ascii(row["date"]), 1, 0, 'C')
            pdf.cell(80, 8, to_ascii(f"  {row['name']}"), 1, 0, 'L')
            pdf.cell(40, 8, to_ascii(row["cat"]), 1, 0, 'C')
            pdf.cell(40, 8, to_ascii(f"{row['price']:,} TL"), 1, new_x="LMARGIN", new_y="NEXT", align='R')
            total += row["price"]

        pdf.ln(5)
        pdf.set_font('helvetica', 'B', 12)
        pdf.cell(150, 10, to_ascii('TOPLAM GIDER:'), 0, 0, 'R')
        pdf.set_text_color(220, 38, 38)
        pdf.cell(40, 10, to_ascii(f"{total:,} TL"), 0, new_x="LMARGIN", new_y="NEXT", align='R')

        # Generate safe filename to prevent Chromium download-button crashes for local files!
        safe_name = "".join([c if c.isalnum() else "_" for c in config['name']]).strip("_")
        while "__" in safe_name:
            safe_name = safe_name.replace("__", "_")
        if not safe_name:
            safe_name = "Musteri"
        filename = f"Ekstre_{safe_name}.pdf"
        pdf.output(filename)
        print(f"\n[R.E.M AI]: {filename} basariyla uretildi.")

        # Dynamically save a copy to the system Downloads folder for effortless drag-and-drop!
        try:
            home = os.path.expanduser("~")
            downloads_dir = os.path.join(home, "Downloads")
            if os.path.exists(downloads_dir):
                shutil.copy2(filename, os.path.join(downloads_dir, filename))
                print(f"[R.E.M AI]: Bir kopya Downloads (Indirilenler) klasorune kopyalandi: {os.path.join(downloads_dir, filename)}")
        except Exception as copy_err:
            pass


        
        # PROJE WORKSPACE'İNDEKİ userProfile.json DOSYASINI GUNCELLE!
        profile_path = r"c:\Users\emreb\.gemini\antigravity\brain\842cf0eb-2136-462f-81ea-3f80fd642547\cashedge-v2\src\utils\userProfile.json"
        
        profile_data = {
            "name": config["name"],
            "persona": persona,
            "ratings": ratings,
            "generatedExpenses": [
                {
                    "name": x["name"],
                    "amount": x["price"],
                    "date": int(x["date"].split(".")[0]),
                    "category": x["cat"].lower()
                }
                for x in statement
            ]
        }
        
        with open(profile_path, "w", encoding="utf-8") as f:
            json.dump(profile_data, f, ensure_ascii=False, indent=2)
        print("[R.E.M AI]: Proje workspace'indeki 'userProfile.json' başarıyla güncellendi!")

        # Otomatik yerel HTTP sunucusu başlatma (tarayıcının file:// indirme engelini tamamen aşar!)
        port = 8085
        httpd = None
        while True:
            try:
                # Silence standard library http server logging
                class QuietHandler(http.server.SimpleHTTPRequestHandler):
                    def log_message(self, format, *args):
                        pass
                httpd = socketserver.TCPServer(("127.0.0.1", port), QuietHandler)
                break
            except OSError:
                port += 1
                if port > 8100: # Protection limit
                    break
        
        if httpd:
            def serve():
                httpd.serve_forever()
            t_srv = threading.Thread(target=serve, daemon=True)
            t_srv.start()
            
            print(f"[R.E.M AI]: PDF yerel HTTP sunucusundan aciliyor: http://127.0.0.1:{port}/{filename}")
            webbrowser.open(f"http://127.0.0.1:{port}/{filename}")
        else:
            # Fallback to file:// if port binding fails completely
            pdf_absolute_path = os.path.abspath(filename)
            print(f"[R.E.M AI]: PDF yerel dosyadan aciliyor: {pdf_absolute_path}")
            webbrowser.open(f"file:///{pdf_absolute_path.replace(chr(92), '/')}")


    except Exception as e:
        print(f"\nHata: {str(e)}")
    finally:
        input("\nYeni ekstre uretmek veya cikmak icin ENTER...")

if __name__ == "__main__":
    generate_custom_pdf()
