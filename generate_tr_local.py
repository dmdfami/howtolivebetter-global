import os

content = """> Yalnızca bilgi amaçlıdır, hukuki tavsiye değildir. İşlem yapmadan önce resmî kaynağı kontrol edin.

### 1. Yaşlı yakınınız aklı başındayken, gelecekteki vasisini yazılı olarak belirtin
- Türkiye'de: Türkiye için henüz doğrulanmış bilgi yok.
- Resmî kaynaklar:
- Kontrol tarihi: 2026-11-02
- Güvenilirlik: doğrulanmadı

### 2. Vasiyetnamenizi yazın: sonra yazılan öncekini geçersiz kılar, noter onaylı olan artık otomatik olarak öncelikli değildir
- Türkiye'de: Türkiye için henüz doğrulanmış bilgi yok.
- Resmî kaynaklar:
- Kontrol tarihi: 2026-11-02
- Güvenilirlik: doğrulanmadı

### 5. Yaşlılardan önce para isteyen "yaşlılıkta yatırım" tekliflerinin hepsinden uzak durun: üyelik kartı, bakım yatağı satın alma, yaşlılar için daire, turistik yaşlılık ve yaşlılara özel ürün satışı aynı yasadışı para toplama düzeneğidir
- Türkiye'de: Türkiye için henüz doğrulanmış bilgi yok.
- Resmî kaynaklar:
- Kontrol tarihi: 2026-11-02
- Güvenilirlik: doğrulanmadı

### 6. Sigorta şirketlerinin "konut ters ipotek yaşlılık sigortası" dışında "ev karşılığı yaşlılık" tekliflerinden uzak durun; evi asla rehin verip yatırım için borç almayın
- Türkiye'de: Türkiye için henüz doğrulanmış bilgi yok.
- Resmî kaynaklar:
- Kontrol tarihi: 2026-11-02
- Güvenilirlik: doğrulanmadı

### 7. Evde uzun süre yatalak ya da ağır engelli yaşlı varsa, sigortalı olduğunuz yerdeki sağlık sigortası kurumuna uzun dönem bakım sigortası için başvurun; bu sigorta yalnızca yaşlılar için değil
- Türkiye'de: Türkiye için henüz doğrulanmış bilgi yok.
- Resmî kaynaklar:
- Kontrol tarihi: 2026-11-02
- Güvenilirlik: doğrulanmadı

### 11. Yaşlı yakınınızı bakımevine yerleştirmeden önce kurumun kayıtlı olduğunu ve yazılı sözleşme imzalandığını kontrol edin; depozito en fazla 12 aylık yatak ücreti olabilir ve banka güvence hesabına yatırılmalıdır
- Türkiye'de: Türkiye için henüz doğrulanmış bilgi yok.
- Resmî kaynaklar:
- Kontrol tarihi: 2026-11-02
- Güvenilirlik: doğrulanmadı

### 12. Tek çocuğun anne babası hastaneye yatarsa, eyaletinizin yasalarında çocuğa bakım izni verilip verilmediğine bakın; varsa yatış belgesiyle işverene yazılı başvuru yapın
- Türkiye'de: Türkiye için henüz doğrulanmış bilgi yok.
- Resmî kaynaklar:
- Kontrol tarihi: 2026-11-02
- Güvenilirlik: doğrulanmadı
"""

os.makedirs('locales/tr/local', exist_ok=True)
with open('locales/tr/local/17.md', 'w', encoding='utf-8') as f:
    f.write(content)
