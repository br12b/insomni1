import os
import sys
import random
import datetime

# KUTUPHANE KONTROLU
try:
    from fpdf import FPDF
except ImportError:
    os.system(f"{sys.executable} -m pip install fpdf2")
    from fpdf import FPDF

class BankStatement(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 20)
        self.set_text_color(16, 185, 129)
        self.cell(0, 10, 'CASHEDGE PRIVATE BANKING', ln=True, align='L')
        self.set_font('helvetica', '', 10)
        self.set_text_color(100)
        self.cell(0, 5, 'Customized Statement Simulation Engine v2.0', ln=True)
        self.ln(10)

def get_user_config():
    print("\n" + "="*50)
    print("      CASHEDGE EKSTRE OZELLESTIRME PANELI")
    print("="*50)
    
    name = input("Musteri Adi (Varsayilan: Emre): ") or "Emre"
    
    print("\n[1] Harcama Seviyesi:")
    print("    1. Cimri (Dusuk Giderler)")
    print("    2. Normal (Standart)")
    print("    3. Savurgan (Yuksek Giderler)")
    lvl = input("Seciminiz (1-3): ") or "2"
    
    print("\n[2] Harcama Odak Noktasi:")
    print("    1. Dengeli")
    print("    2. Abonelik Agirlikli (Netflix, Spotify, Cloud...)")
    print("    3. Yasam/Market Agirlikli")
    focus = input("Seciminiz (1-3): ") or "1"
    
    return {
        "name": name,
        "level": int(lvl),
        "focus": int(focus)
    }

def generate_custom_pdf():
    try:
        config = get_user_config()
        
        pdf = BankStatement()
        pdf.add_page()
        
        # Seviye carpanlari
        multiplier = 0.5 if config["level"] == 1 else (2.5 if config["level"] == 3 else 1.0)
        
        # Veri Havuzu
        merchants = {
            "fixed": [("Kira Odemesi", 20000), ("Site Aidati", 1800), ("Turkcell Fatura", 700)],
            "subs": [("Netflix", 229), ("Spotify", 99), ("YouTube Prem", 110), ("Disney+", 150), ("iCloud", 60), ("ChatGPT Plus", 680)],
            "var": [("Migros", 2500), ("Starbucks", 200), ("Shell Fuel", 3500), ("Trendyol", 4500), ("GetirYemek", 550)]
        }

        # Odak noktasina gore adet belirleme
        counts = {"fixed": 3, "subs": 3, "var": 6}
        if config["focus"] == 2: counts["subs"] = 10; counts["var"] = 3
        if config["focus"] == 3: counts["var"] = 15; counts["subs"] = 2

        statement = []
        
        # Giderleri Uret
        for key, count in counts.items():
            for _ in range(count):
                item = random.choice(merchants[key])
                price = int(item[1] * multiplier * random.uniform(0.8, 1.2))
                statement.append({
                    "date": f"{random.randint(1, 28):02d}.05.2026",
                    "name": item[0],
                    "cat": key.capitalize(),
                    "price": price
                })

        statement.sort(key=lambda x: x["date"])

        # PDF TABLO CIZIMI
        pdf.set_font('helvetica', 'B', 11)
        pdf.cell(0, 10, f"Sayin {config['name'].upper()}, Ayin Finansal Ozeti:", ln=True)
        pdf.ln(5)

        pdf.set_fill_color(240, 240, 240)
        pdf.set_font('helvetica', 'B', 10)
        pdf.cell(30, 10, 'Tarih', 1, 0, 'C', True)
        pdf.cell(80, 10, 'Aciklama', 1, 0, 'L', True)
        pdf.cell(40, 10, 'Kategori', 1, 0, 'C', True)
        pdf.cell(40, 10, 'Tutar (TL)', 1, 1, 'R', True)

        pdf.set_font('helvetica', '', 9)
        total = 0
        for row in statement:
            pdf.cell(30, 8, row["date"], 1, 0, 'C')
            pdf.cell(80, 8, f"  {row['name']}", 1, 0, 'L')
            pdf.cell(40, 8, row["cat"], 1, 0, 'C')
            pdf.cell(40, 8, f"{row['price']:,} TL", 1, 1, 'R')
            total += row["price"]

        pdf.ln(5)
        pdf.set_font('helvetica', 'B', 12)
        pdf.cell(150, 10, 'TOPLAM HARCAMA:', 0, 0, 'R')
        pdf.set_text_color(200, 0, 0)
        pdf.cell(40, 10, f"{total:,} TL", 0, 1, 'R')

        filename = f"Ekstre_{config['name']}.pdf"
        pdf.output(filename)
        print(f"\n[Neo AI]: {filename} basariyla uretildi.")
        os.startfile(filename)

    except Exception as e:
        print(f"\nHata: {str(e)}")
    finally:
        input("\nYeni ekstre uretmek veya cikmak icin ENTER...")

if __name__ == "__main__":
    generate_custom_pdf()
