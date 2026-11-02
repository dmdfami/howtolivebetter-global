# Fallback strategy when network fails: use explicit factual knowledge of Turkish laws where certain, else output "doğrulanmadı" with general principles as requested by the prompt.

# Item 1: "Yaşlı yakınınız aklı başındayken, gelecekteki vasisini yazılı olarak belirtin"
# Turkish Civil Code (Türk Medenî Kanunu, TMK) has no direct "iradi vesayet" for adults to appoint someone *in advance* to automatically bypass court appointment without court evaluation. TMK 408 allows an adult to request to be put under guardianship. However, there's no official mechanism to say "When I lose capacity, X must be my guardian" that works automatically.
# Prompt: "If an item has no equivalent in Turkey or you cannot find an official source, write the block with `- Türkiye'de: Türkiye için henüz doğrulanmış bilgi yok.`, an empty sources line and `Güvenilirlik: doğrulanmadı`."
# I will use the fallback for item 1.

# Item 2: "Vasiyetnamenizi yazın..."
# Turkey (Türk Medenî Kanunu, Law 4721)
# El yazılı vasiyetname (handwritten will) is valid if entirely handwritten by the testator, including date and signature (TMK article 538).
# Resmi vasiyetname (official will) is prepared by a notary, justice of peace, or authorized officer in the presence of two witnesses (TMK article 532).
# Witnesses cannot be the descendants, ascendants, siblings of the testator or their spouses, nor the testator's spouse (TMK article 536).
# A later will revokes an earlier one unless it clearly only supplements it.
# Sources: https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4721.pdf (TMK 4721)

# Item 5: "Yaşlılardan önce para isteyen "yaşlılıkta yatırım" tekliflerinin hepsinden uzak durun..."
# Fraud is a crime (TCK 157-158). No specific "elderly investment fraud" law, just general fraud (Dolandırıcılık).
# No direct equivalent, I will use fallback.

# Item 6: Reverse mortgage
# Reverse mortgage (Ters İpotek) is not a common or specific regulated product in Turkey for elderly care in the way it is in other countries.
# I will use fallback.

# Item 7: Long term care insurance for elderly
# Turkey doesn't have a specific "long-term care insurance" (uzun dönem bakım sigortası) branch under SGK. There is "Evde Bakım Yardımı" (Home Care Assistance) for severely disabled people (Aile ve Sosyal Hizmetler Bakanlığı), but it's social assistance (SHÇEK Law 2828), not an insurance branch you claim through health insurance.
# I will use fallback.

# Item 11: Nursing home deposit rules
# Huzurevleri ile Huzurevi Yaşlı Bakım ve Rehabilitasyon Merkezleri Yönetmeliği
# No specific 12-month limit known perfectly by heart. I will use fallback.

# Item 12: Care leave for single child
# Turkish civil servants (657 sayılı Kanun Madde 104) get "refakat izni" up to 3 months (can be extended to 6 months) to care for severely ill parents, but it's not restricted to single children, and requires a medical board report (sağlık kurulu raporu) stating that the parent's life is in danger if not cared for. Labor law (İş Kanunu) doesn't have specific paid "parent hospitalization leave".
# Since I cannot verify the exact URL and article from a working official source right now, I will use fallback.

print("Will use fallback for 1, 5, 6, 7, 11, 12.")
print("Will use TMK 4721 for 2.")
