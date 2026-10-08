/* YENİ TEMA EKLEME: THEMES içine tek blok ekle; seçici otomatik oluşur.
Boş şablon (ortak lexicon kendiliğinden kullanılır; tema sözcükleri override edilir):
newTheme: { id: "newTheme", label: {tr:"",en:""}, fonts:{display:"",body:"",mono:""},
 tokens:{"--bg":"","--panel":"","--text":"","--muted":"","--accent":"","--warn":"","--danger":"","--grid":"","--glow":"","--radius":"","--star":"","--transparent":"transparent"},
 lexicon:{title:{tr:"",en:""},balance:{tr:"",en:""},graduation:{tr:"",en:""},firstNegative:{tr:"",en:""},months:{tr:"",en:""},reserve:{tr:"",en:""},locked:{tr:"",en:""},timeline:{tr:"",en:""}},
 decor:"none", chart:{line:"",dashed:"",dotted:"",area:"",font:""} }
*/
// 1 THEMES — all colors, fonts and interface vocabulary are data.
const UI_LEXICON = {"text_000": {"tr": "Almanya master — yaşam ve göç simülasyonu", "en": "Master’s in Germany — life and migration simulator"}, "text_001": {"tr": "Almanya’da masterdan bağımsız hayata", "en": "From a master’s degree in Germany to an independent life"}, "text_002": {"tr": "Örnek eğitim → iş arama → iş yolu. Tarihleri ve bütçeyi kendi varsayımlarına göre değiştir.", "en": "Example study → job search → work path. Adjust dates and budget to your own assumptions."}, "text_003": {"tr": "Altı ülke", "en": "Six countries"}, "text_004": {"tr": "Diğer göç yolları", "en": "Other migration paths"}, "text_005": {"tr": "Üç kariyer deneyi", "en": "Three career experiments"}, "text_006": {"tr": "Ayrıntılı raporlar ve CLI kullanım bilgileri proje README.md dosyasında. Mobil sunucu yalnız simülatör ekranını paylaşır.", "en": "Detailed reports and CLI usage information are in the project’s README.md file. The mobile server shares only the simulator screen."}, "text_007": {"tr": "Program bilgileri 2026 kaynaklarıdır; kişisel uygunluk ve 2029 koşulları henüz teyitli değil. Yaşam giderleri ve işler düzenlenebilir varsayımlardır. Hiçbir alan kişisel dating, iş bulma veya PR yüzdesi üretmez. Veriler tarayıcıda kalır; senaryo bu sekme oturumunda korunur.", "en": "Program information comes from 2026 sources; personal eligibility and conditions in 2029 have not yet been confirmed. Living costs and jobs are editable assumptions. No field generates a personal dating, job-finding, or permanent-residency probability. Data stays in the browser; the scenario is preserved in this tab session."}, "text_008": {"tr": "Finansman senaryosu: birikim ve ek kaynak", "en": "Funding scenario: savings and extra funds"}, "text_009": {"tr": "Bu ekran örnek verilerle açılır. Birikim, ek kaynak ve geri ödeme yükünü senaryona göre gir; bunlar doğrulanmış finansman değildir.", "en": "This screen starts with example data. Enter savings, extra funds and repayment obligations for your scenario; these are not verified funding."}, "text_010": {"tr": "Birikim tahmini (AZN)", "en": "Estimated savings (AZN)"}, "text_011": {"tr": "Kur senaryosu (AZN / EUR)", "en": "Exchange-rate scenario (AZN / EUR)"}, "text_012": {"tr": "Belirsiz ek kaynak", "en": "Uncertain additional source"}, "text_013": {"tr": "Dönüşümlü toplama hariç", "en": "Exclude the rotating savings payment"}, "text_014": {"tr": "10.000 AZN brüt ödeme ayrıca gelirse", "en": "If the gross payment of 10,000 AZN is received separately"}, "text_015": {"tr": "Bu tahmini bütçeyi nakit alanlarına uygula", "en": "Apply this estimated budget to the cash fields"}, "text_016": {"tr": "Kur referansı: 7 Ekim 2026 CBAR, 1 EUR = 1,9095 AZN; 2029 tahmini değil, dönüşüm masrafı hariç. Bloke hedefi 11.904 EUR yalnız tarihli referans; düşük bütçe bu hedefi karşılamış sayılmaz. Güncel düzenlenmiş nakit alanları uygulanırken değişir.", "en": "Exchange-rate reference: CBAR, 7 October 2026, 1 EUR = 1.9095 AZN; this is not a 2029 forecast and excludes conversion fees. The blocked-account target of 11,904 EUR is a dated reference only; a lower budget is not considered to meet this target. The currently edited cash fields change when this is applied."}, "text_017": {"tr": "İncelenen program / şehir", "en": "Program / city under review"}, "text_018": {"tr": "Yolun süresi ve temel bütçe (EUR)", "en": "Path duration and core budget (EUR)"}, "text_019": {"tr": "Master başlangıç tarihi", "en": "Master’s start date"}, "text_020": {"tr": "Master süresi (ay)", "en": "Master’s duration (months)"}, "text_021": {"tr": "Mezuniyetten işe bekleme (ay)", "en": "Wait from graduation to employment (months)"}, "text_022": {"tr": "Başlangıç kullanılabilir nakit", "en": "Available cash at the start"}, "text_023": {"tr": "Başlangıç bloke hesap (ayrı)", "en": "Blocked account at the start (separate)"}, "text_024": {"tr": "Aylık kira + yan giderler", "en": "Monthly rent + utilities"}, "text_025": {"tr": "Aylık sosyal hayat / dating bütçesi", "en": "Monthly social life / dating budget"}, "text_026": {"tr": "Öğrenci işi saati / hafta (varsayım)", "en": "Student-work hours per week (assumption)"}, "text_027": {"tr": "Öğrenci işi başlangıç ayı", "en": "Month student job starts"}, "text_028": {"tr": "Yazılı bursun aylık neti (yoksa 0)", "en": "Monthly net amount of a confirmed scholarship (0 if none)"}, "text_029": {"tr": "Öğrenci işi başlangıçta 0 saat: iş bulunmuş sayılmaz. 10/20 saat seçimi yalnız “bu iş ve saatler gerçekten oluşursa” dalıdır. 20 saat bu ders dönemi modelinin aralığıdır; hukuki gün hesabı veya sigorta kararının yerine geçmez.", "en": "Student work starts at 0 hours: this does not assume a job has been found. Choosing 10/20 hours models only the scenario “if this job and these hours actually materialize.” Twenty hours is the range used by this semester-based model; it does not replace a legal day-count calculation or an insurance decision."}, "text_030": {"tr": "Giderler, dönem ücretleri, ilk ödeme ve taşınma", "en": "Expenses, semester fees, initial payment, and moving"}, "text_031": {"tr": "Gıda / ay", "en": "Food / month"}, "text_032": {"tr": "Sigorta / sağlık / ay", "en": "Insurance / health / month"}, "text_033": {"tr": "Diğer / ulaşım / ay", "en": "Other / transport / month"}, "text_034": {"tr": "Dönem katkısı / 6 ay", "en": "Semester contribution / 6 months"}, "text_035": {"tr": "Öğrenim harcı / 6 ay", "en": "Tuition / 6 months"}, "text_036": {"tr": "Varış / depozito / kurulum", "en": "Arrival / deposit / setup"}, "text_037": {"tr": "Acil rezerv tabanı", "en": "Emergency reserve floor"}, "text_038": {"tr": "Blokeden aylık serbest tutar", "en": "Monthly amount released from blocked funds"}, "text_039": {"tr": "Öğrenci işi brüt saat ücreti", "en": "Student job gross hourly wage"}, "text_040": {"tr": "Brütten kullanılabilir pay (varsayım)", "en": "Usable share of gross pay (assumption)"}, "text_041": {"tr": "Mezuniyet sonrası iş neti / ay", "en": "Net income from post-graduation work / month"}, "text_042": {"tr": "İlk iş maaşı gecikmesi (ay)", "en": "Delay until first salary (months)"}, "text_043": {"tr": "Gider enflasyonu / yıl (0–1)", "en": "Expense inflation / year (0–1)"}, "text_044": {"tr": "Sonradan katkı / geri ödeme (EUR / ay)", "en": "Later contribution / repayment (EUR / month)"}, "text_045": {"tr": "Katkı / geri ödeme ilk ayı", "en": "First month of contribution / repayment"}, "text_046": {"tr": "Kaç ay katkı / geri ödeme", "en": "Number of months for contribution / repayment"}, "text_047": {"tr": "Ek taşınma ayı (yoksa boş)", "en": "Additional move month (leave blank if none)"}, "text_048": {"tr": "Ek taşınma masrafı", "en": "Additional moving cost"}, "text_049": {"tr": "Bloke para yeni gelir değil, senin varlığının aylık serbest kalan kısmı. Burs bunu hukuki açıdan değiştirebilir; finansman kanıtı ve izin yenilemesi ayrıca doğrulanır. Katkılar önceden ödenmişse gelecekte ödeme olmayabilir; sonradan ödenecekse EUR aylık tutar/başlama/süre gir. Şu an 0 takvim yalnız bilinmeyen yükümlülüğün modele henüz girilmediğini gösterir. Net pay vergi hesabı değildir. İş arama döneminde gelir 0; işin ve ücretin oluşması varsayılmıştır. Sigorta/harç gerçek takvime göre değiştirilmelidir.", "en": "Blocked funds are not new income; they are a monthly released portion of your own assets. A scholarship may change the legal situation; proof of funding and permit renewal must be verified separately. If contributions were paid in advance, there may be no future payments; if they will be paid later, enter the monthly EUR amount, start month, and duration. A schedule of 0 for now only means the unknown obligation has not yet been entered in the model. The net share is not a tax calculation. Income is 0 during the job-search period; a job and its pay are assumed to materialize. Insurance and tuition should be adjusted to the actual schedule."}, "text_050": {"tr": "Dil, zaman, sosyal çevre ve Almanya’da ilişki", "en": "Language, time, social life, and relationships in Germany"}, "text_051": {"tr": "Dil seviyesi ve haftalık çalışma süresi birer varsayımdır; hedef seçmek mevcut sertifika veya başarı garantisi değildir.", "en": "Language level and weekly study time are assumptions; selecting a target is not a current certificate or a guarantee of success."}, "text_052": {"tr": "Almanca hedefi", "en": "German target"}, "text_053": {"tr": "A1", "en": "A1"}, "text_054": {"tr": "A2", "en": "A2"}, "text_055": {"tr": "B1", "en": "B1"}, "text_056": {"tr": "B2", "en": "B2"}, "text_057": {"tr": "C1", "en": "C1"}, "text_058": {"tr": "Ders / tez saati / hafta", "en": "Classes / thesis hours / week"}, "text_059": {"tr": "Almanca saati / hafta", "en": "German hours / week"}, "text_060": {"tr": "Sosyal etkinlik saati / hafta", "en": "Social activity hours / week"}, "text_061": {"tr": "Gidiş geliş saati / hafta", "en": "Commute hours / week"}, "text_062": {"tr": "Hayat dalı (gerçekleşirse)", "en": "Life scenario (if it happens)"}, "text_063": {"tr": "Yeni çevre ve tanışma", "en": "New community and meeting people"}, "text_064": {"tr": "Almanya’da ilişki", "en": "Relationship in Germany"}, "text_065": {"tr": "Almanya’da birlikte yaşam", "en": "Living together in Germany"}, "text_066": {"tr": "Almanya’da gerçek evlilik", "en": "Actual marriage in Germany"}, "text_067": {"tr": "Ortak yaşam başlama ayı (yoksa boş)", "en": "Month shared living starts (leave blank if none)"}, "text_068": {"tr": "Sana düşen aylık kira azalması", "en": "Your monthly share of rent reduction"}, "text_069": {"tr": "Kira azalması otomatik değil; gerçek paylaşım oluşursa girilir. Dating/evlilik seçimi partner maaşı veya oturum üretmez. Sosyal harcamalar yukarıdaki bütçededir. Zaman hesabında 56 saat uyku + 28 saat yemek/ev/kişisel bakım sabit örnektir; kalan serbest paydır.", "en": "A rent reduction is not automatic; enter it only if an actual cost-sharing arrangement happens. Selecting dating/marriage does not generate a partner’s salary or a residence permit. Social spending is included in the budget above. The time model sets aside 56 hours for sleep and 28 hours for meals, household tasks, and personal care; the remainder is unallocated time."}, "text_070": {"tr": "Rezervli başlangıç toplamı", "en": "Required starting total, including reserve"}, "text_071": {"tr": "Mezuniyet anında likit bakiye", "en": "Liquid balance at graduation"}, "text_072": {"tr": "İlk negatif ay", "en": "First month with a negative balance"}, "text_073": {"tr": "Düz renkli çizgi: kullanılabilir nakit · kesikli: bloke varlık · noktalı: rezerv. Ay 0 kurulum ödenmiş hâl. Burs/iş oluşmazsa ayrı dalı 0 gelirle dene.", "en": "Solid line: available cash · dashed: blocked assets · dotted: reserve. Month 0 is after setup costs have been paid. If no scholarship/job materializes, try a separate scenario with zero income."}, "text_074": {"tr": "Yaş ve yol çizelgesi", "en": "Age and pathway timeline"}, "text_075": {"tr": "Son tarih yalnız Alman mezunu için uygun işçi oturumu, 24 ay katkı, B1 ve diğer şartlar kesintisiz sağlanırsa olası settlement başvuru kapısıdır. Oturum verilmiş veya evlilik olmuş sayılmaz.", "en": "The final date is only a possible settlement application milestone if an eligible residence permit for a German graduate, 24 months of contributions, B1, and all other requirements are continuously met. It does not mean a permit has been granted or a marriage has taken place."}, "text_076": {"tr": "Bu seçimlerin yaşam etkisi", "en": "How these choices affect daily life"}, "text_077": {"tr": "Kaynaklı şehir / kampüs bilgileri", "en": "Sourced city / campus information"}, "tu-dortmund-automation-robotics": {"tr": "Otomasyon/robotik odağı. İngilizce C1; Alman 2,0 not eşdeğerliği ve belirli matematik/programlama kredileri. GRE talimatı ve yönetmelik arasında teyit gereken fark var.", "en": "Focus on automation/robotics. English C1; German grade equivalent of 2.0 and specific mathematics/programming credits. There is a discrepancy between the GRE instructions and regulations that needs confirmation."}, "tu-dresden-nanoelectronic-systems": {"tr": "Elektronik/donanım odağı; devre, sistem ve programlama altyapısı önemli. Güncel B2 ile eski C1 dil kaynakları başvuru yılında teyit edilmeli.", "en": "Focus on electronics/hardware; a foundation in circuits, systems, and programming matters. The current B2 and older C1 language sources should be checked in the year of application."}, "uni-due-automation-safety": {"tr": "Kontrol/otomasyon odağı; yarı Almanca yarı İngilizce, kayıt için iki dilde B2. ISE genel kabul şartı Alman 3,0 veya yabancı eşdeğeri; diploma/ders değerlendirmesi kurulca yapılır.", "en": "Focus on control/automation; half German and half English, with B2 in both languages for enrollment. ISE’s general admission requirement is a German grade of 3.0 or an international equivalent; the committee evaluates the degree and coursework."}, "fau-autonomy-technologies": {"tr": "Otonom sistemler ve kontrol; İngilizce B2, yeterlik değerlendirmesi. Uygun non-EU adaylar için dönemlik 2.000 EUR harç; muafiyet ayrıca teyit edilir.", "en": "Autonomous systems and control; English B2 and an aptitude assessment. Tuition is 2,000 EUR per semester for eligible non-EU applicants; any exemption must be confirmed separately."}, "theme": {"tr": "Tema", "en": "Theme"}, "language": {"tr": "Dil", "en": "Language"}, "turkish": {"tr": "Türkçe", "en": "Turkish"}, "english": {"tr": "İngilizce", "en": "English"}, "status": {"tr": "HORIZON / GÖREV DURUMU", "en": "HORIZON / MISSION STATUS"}, "title": {"tr": "Horizon · Almanya Görev Kontrol", "en": "Horizon · Germany Mission Control"}, "directWork": {"tr": "Doğrudan iş / göç", "en": "Direct work / relocation"}, "warning": {"tr": "Örnek verilerle başlayan, herkese açık simülatör. Kabul, iş bulma, oturum, dating veya evlilik olasılığı hesaplanmaz. Girdiğin bilgiler yalnız tarayıcıda hesaplanır; bu sekme oturumunda korunur; sunucuya gönderilmez.", "en": "Public simulator starting with example data. Admission, employment, residence, dating or marriage probabilities are not calculated. Your inputs are processed only in your browser; they stay in this tab session and are not sent to a server."}, "balance": {"tr": "Yakıt Seviyesi · likit", "en": "Fuel Level · liquid"}, "graduation": {"tr": "İniş · mezuniyette likit", "en": "Landing · liquid at graduation"}, "firstNegative": {"tr": "Kritik Uyarı · ilk negatif ay", "en": "Critical Alert · first negative month"}, "months": {"tr": "Görev Evresi · ay", "en": "Mission Phase · month"}, "reserve": {"tr": "Rezerv Yakıt", "en": "Reserve Fuel"}, "locked": {"tr": "Kilitli Kargo · bloke", "en": "Locked Cargo · blocked"}, "timeline": {"tr": "Görev Zaman Çizelgesi", "en": "Mission Timeline"}, "reserveTotal": {"tr": "Rezervli başlangıç toplamı", "en": "Required initial total with reserve"}, "blockedDepleted": {"tr": "Bloke tükenme ayı", "en": "Blocked depletion month"}, "chartTitle": {"tr": "60 aylık yakıt izleme", "en": "60-month fuel tracking"}, "chartAria": {"tr": "Ay 0–60: kullanılabilir nakit, bloke varlık ve rezerv tabanı", "en": "Months 0–60: accessible cash, blocked assets and reserve floor"}, "none": {"tr": "Yok", "en": "None"}, "month": {"tr": "Ay {n}", "en": "Month {n}"}, "unknown": {"tr": "Bilinmiyor", "en": "Unknown"}, "invalid": {"tr": "Gerekli alanları geçerli tarih ve sınırlar içindeki sayılarla doldur.", "en": "Fill required fields with a valid date and numbers within their limits."}, "cashDetail": {"tr": "Toplamın {locked} kısmı bloke, {liquid} kısmı kullanılabilir olmalı. Girdiğin nakde ek gereken: {additional}. Hesap ufku: {horizon} ay; grafik ilk 60 ay. Rezerv ayrı harcama değil, likit güvenlik tabanıdır.", "en": "The total includes {locked} blocked and {liquid} accessible cash. Additional cash needed: {additional}. Calculation horizon: {horizon} months; chart shows the first 60. Reserve is a liquid safety floor, not a separate expense."}, "arrival": {"tr": "Master başlangıcı", "en": "Master starts"}, "graduationEvent": {"tr": "Varsayımsal mezuniyet", "en": "Assumed graduation"}, "work_start_assumed": {"tr": "İşe başlama varsayımı", "en": "Assumed work start"}, "settlement_gate_conditional": {"tr": "Koşullu başvuru kapısı", "en": "Conditional application gate"}, "eventText": {"tr": "{event}: {date} · {age} yaş", "en": "{event}: {date} · age {age}"}, "timeEffect": {"tr": "Öğrenci işi: {gross} brüt/ay; varsayımsal kullanılabilir pay {net}. Haftalık boş pay: {hours} saat. {load} Almanca {level} hedefi mevcut sertifika değildir.", "en": "Student work: {gross} gross/month; assumed accessible share {net}. Unallocated weekly time: {hours} hours. {load} German {level} is a target, not a current certificate."}, "overbooked": {"tr": "Program haftaya sığmıyor; ders/iş/dil/sosyal hedeflerini azalt.", "en": "The schedule exceeds a week; reduce study/work/language/social targets."}, "manageable": {"tr": "Bu zaman hesabı başarı ölçümü değil; sınav ve tez haftasında yeniden düzenle.", "en": "This time budget does not measure success; adjust it during exams and thesis work."}, "housing": {"tr": "Yurt fiyatı oda teklifi değildir. Ucuz oda bulunmazsa kira, geçici konaklama, depozito ve ulaşımı artırıp tekrar dene. Ortak evde uyum, gürültü ve mahremiyet sorunları olabilir.", "en": "Dorm prices are not room offers. If a low-cost room is unavailable, increase rent, temporary accommodation, deposit and commuting, then rerun. Shared housing can bring compatibility, noise and privacy issues."}, "programUnknown": {"tr": "{summary} Kişisel kabul uygunluğu bilinmiyor.", "en": "{summary} Personal admission eligibility is unknown."}, "programFees": {"tr": "Kaynak dönemi: {period}; katkı {fee}, harç {tuition} / dönem. Seçim yalnız ücret alanlarını günceller; kira ve yaşam bütçesini belirlemez.", "en": "Source period: {period}; contribution {fee}, tuition {tuition} / semester. Selection updates fees only, not rent or the living budget."}, "officialProgram": {"tr": "Programın resmî kaynağı", "en": "Official program source"}, "budgetInvalid": {"tr": "Geçerli birikim ve pozitif kur gir.", "en": "Enter valid savings and a positive exchange rate."}, "budget": {"tr": "Tahmini toplam {total}; bloke referans açığı {gap}. {branch} Kaynak henüz gerçekleşmiş değil.", "en": "Estimated total {total}; blocked reference shortfall {gap}. {branch} Funds have not yet materialized."}, "rotatingYes": {"tr": "Brüt dönüşümlü ödeme dalı; ayrı katkı/geri ödeme takvimi henüz hesaba katılmadı.", "en": "Gross rotating-payment branch; separate contributions/repayment schedule has not been included."}, "rotatingNo": {"tr": "Dönüşümlü ödeme dahil edilmedi.", "en": "Rotating payment excluded."}, "open": {"tr": "Seçtiğin başlangıç tarihinde önce kampüs çevresi, dil ve bağımsız düzen kurma: welcome/buddy, haftalık spor/kulüp ve dil tandemi. Her tanışma dating değildir; tekrar eden temas fırsatı ilişki yüzdesi değildir.", "en": "At your selected start date, first build a campus community, language skills, and an independent routine: welcome/buddy programs, weekly sports or clubs, and language tandems. Meeting someone does not mean dating; recurring opportunities to interact are not a relationship probability."}, "dating": {"tr": "Almanya’da karşılıklı bir ilişki oluşursa: ders/iş, ortak dil, görüşme zamanı ve sosyal bütçe birlikte yönetilir. Partnerin vatandaşlığı veya gelirini varsaymıyoruz; ilişki seçiminden oturum sonucu üretilmiyor.", "en": "If a mutual relationship develops in Germany, study/work, a shared language, time together, and the social budget must be managed together. The model does not assume your partner’s citizenship or income, and selecting a relationship does not generate a residence outcome."}, "cohabit": {"tr": "Almanya’da gerçek ortak yaşam oluşursa: kira paylaşımı, taşınma/depozito, çalışma saatleri ve kişisel bağımsızlık konuşulur. Yalnız açıkça girdiğin kira azalması bütçeye yansır; partner maaşı eklenmez.", "en": "If you actually begin living together in Germany, discuss sharing rent, moving/deposit costs, working hours, and personal independence. Only the rent reduction you explicitly enter is reflected in the budget; a partner’s salary is not added."}, "marriage": {"tr": "Almanya’da gerçek evlilik oluşursa: partnerin Alman, AB veya başka oturum sahibi olması farklı hukuki durumlar yaratır. Evlilik anında PR/vatandaşlık vermez; bu model eğitim–iş yolunu korur. Tarih veya başarı olasılığı hesaplanmaz.", "en": "If an actual marriage takes place in Germany, your partner being German, an EU citizen, or holding another residence status leads to different legal situations. Marriage does not grant permanent residence/citizenship immediately; this model retains the study-to-work pathway. No date or probability of success is calculated."}, "de_dortmund_dorm_rent_supply_2025": {"tr": "Dortmund 2025 konut raporu: yurt sıcak kira örnekleri 255–404 EUR/ay; bugün boş oda veya şehir ortalaması değildir.", "en": "Dortmund 2025 housing report: examples of warm dorm rent are 255–404 EUR/month; these do not indicate a room available today or the city average."}, "de_dresden_example_hochschulstrasse_rent": {"tr": "Dresden Hochschulstraße 46: seçili WG odaları 259–285 EUR/ay; tek daire 319–359 EUR/ay. 2026 ilanı, boş oda garantisi değil.", "en": "Dresden, Hochschulstraße 46: selected shared-flat rooms are 259–285 EUR/month; studio apartments are 319–359 EUR/month. These are 2026 listings, not a guarantee of availability."}, "de_duisburg_example_dorm_rent": {"tr": "Duisburg Kammerstraße: 398–413 EUR/ay ilanı; belirli yurt örneği, şehir ortalaması değil.", "en": "Duisburg, Kammerstraße: listing at 398–413 EUR/month; an example of a specific residence, not the city average."}, "de_essen_example_dorm_rent": {"tr": "Essen Rottstraße: 498–563 EUR/ay ilanı; belirli yurt örneği, şehir ortalaması değil.", "en": "Essen, Rottstraße: listing at 498–563 EUR/month; an example of a specific residence, not the city average."}, "de_minimum_wage_2026": {"tr": "2026 genel asgari ücret: 13,90 EUR brüt/saat. İş/saat veya net maaş garantisi değil.", "en": "2026 general minimum wage: 13.90 EUR gross/hour. This does not guarantee a job, working hours, or net pay."}, "de_minimum_wage_2027": {"tr": "2027 ilan edilmiş asgari ücret: 14,60 EUR brüt/saat. 2029 ücret tahmini değil.", "en": "Announced 2027 minimum wage: 14.60 EUR gross/hour. This is not a 2029 wage forecast."}, "de_social_environment_dortmund": {"tr": "Dortmund: Come2Campus, ESN ve Hochschulsport; düzenli tanışma ortamları, dating sonucu değil.", "en": "Dortmund: Come2Campus, ESN, and university sports; recurring opportunities to meet people, not a dating outcome."}, "de_social_environment_dresden": {"tr": "Dresden: tutor/karşılama, öğrenci grupları ve üniversite sporu; ilişki sonucu bilinmiyor.", "en": "Dresden: tutors/welcome programs, student groups, and university sports; relationship outcomes are unknown."}, "de_social_environment_ude": {"tr": "Duisburg-Essen: buddy, dil tandemi ve üniversite sporu; düzenli sosyal ortamlar.", "en": "Duisburg-Essen: buddy programs, language tandems, and university sports; recurring social settings."}, "brand": {"tr": "HORIZON", "en": "HORIZON"}, "brandSub": {"tr": "GÖÇ & YAŞAM LAB", "en": "RELOCATION & LIFE LAB"}, "currentRoute": {"tr": "Almanya · Master", "en": "Germany · Master"}, "heroEyebrow": {"tr": "GÖREV KONTROL / SENARYO PLANLAYICI", "en": "MISSION CONTROL / SCENARIO PLANNER"}, "heroDescription": {"tr": "Eğitimden işe, bütçeden günlük hayata. Seçimlerini değiştir; önündeki yolu ve nakit ihtiyacını birlikte gör.", "en": "From study to work, from your budget to everyday life. Change your choices to see the path ahead and the cash it needs."}, "editScenario": {"tr": "Senaryoyu düzenle ↗", "en": "Edit scenario ↗"}, "offline": {"tr": "Yerel · Senaryo bu sekmede", "en": "Local · Scenario in this tab"}, "resultsLabel": {"tr": "Senaryo sonuçları", "en": "Scenario results"}, "resultsEyebrow": {"tr": "01 / GÖREV DURUMU", "en": "01 / MISSION STATUS"}, "resultsTitle": {"tr": "Rotanın finansal görünümü", "en": "Your route, in numbers"}, "liveUpdates": {"tr": "Anlık hesap", "en": "Live calculation"}, "telemetry": {"tr": "02 / NAKİT TELEMETRİSİ", "en": "02 / CASH TELEMETRY"}, "chartWindow": {"tr": "60 AY · EUR", "en": "60 MONTHS · EUR"}, "conditional": {"tr": "Koşullu yol", "en": "Conditional path"}, "timelineConditions": {"tr": "Bu tarihlerin koşulları", "en": "Conditions behind these dates"}, "calculationDetails": {"tr": "Hesap nasıl okunur?", "en": "How to read this calculation"}, "scenarioEyebrow": {"tr": "SENARYO / ALMANYA", "en": "SCENARIO / GERMANY"}, "scenarioTitle": {"tr": "Planını şekillendir", "en": "Shape your plan"}, "scenarioHint": {"tr": "Varsayımları değiştir. Sonuçlar anında güncellenir.", "en": "Adjust the assumptions. Results update instantly."}, "currency": {"tr": "EUR", "en": "EUR"}, "programDetails": {"tr": "Program ve ücret bilgileri", "en": "Program and fee information"}, "incomeAssumption": {"tr": "Öğrenci işi varsayımı", "en": "Student work assumption"}, "footerNote": {"tr": "Horizon · Varsayımlarla düşün, gerçek kanıtlarla karar ver.", "en": "Horizon · Explore assumptions, decide with real evidence."}, "cashGapState": {"tr": "Ek başlangıç nakdi gerekiyor", "en": "Additional initial cash is needed"}, "cashCoveredState": {"tr": "Bu senaryoda rezerv korunuyor", "en": "This scenario preserves the reserve"}, "cashGapNote": {"tr": "Mevcut nakit girdisine ek {amount}; eğitim, iş ve gider varsayımları gerçekleşirse.", "en": "{amount} beyond the current cash input, if the study, work and expense assumptions materialize."}, "cashCoveredNote": {"tr": "Girdiğin nakit, bu varsayımlarla hesap ufku boyunca rezerv tabanını karşılıyor.", "en": "Under these assumptions, the cash entered covers the reserve floor throughout the projection."}, "destinationCode": {"tr": "DE", "en": "DE"}, "birthDate": {"tr": "Doğum tarihi (örnek; düzenlenebilir)", "en": "Date of birth (example; editable)"}};
const THEMES = {
  "mission": {
    "id": "mission",
    "label": {
      "tr": "Görev Kontrol",
      "en": "Mission Control"
    },
    "fonts": {
      "display": "\"Bahnschrift\", \"Segoe UI\", system-ui, sans-serif",
      "body": "\"Segoe UI\", system-ui, sans-serif",
      "mono": "\"Cascadia Mono\", Consolas, monospace"
    },
    "tokens": {
      "--bg": "#080f19",
      "--panel": "#101c2c",
      "--text": "#ecf4ff",
      "--muted": "#b3c5dc",
      "--accent": "#72e3ff",
      "--warn": "#ffd17a",
      "--danger": "#ff997d",
      "--grid": "#526b83",
      "--glow": "#72e3ff12",
      "--radius": "14px",
      "--star": "#7591aa80",
      "--transparent": "transparent",
      "--panel-soft": "#0c1523",
      "--accent-soft": "#72e3ff14",
      "--hero-glow": "#72e3ff0d",
      "--danger-soft": "#ff997d10"
    },
    "lexicon": {
      "title": {
        "tr": "Yeni hayatının\nbir sonraki yörüngesi.",
        "en": "Your next chapter.\nA clearer trajectory."
      },
      "balance": {
        "tr": "Yakıt Seviyesi · likit",
        "en": "Fuel Level · liquid"
      },
      "graduation": {
        "tr": "İniş · mezuniyette likit",
        "en": "Landing · liquid at graduation"
      },
      "firstNegative": {
        "tr": "Kritik Uyarı · ilk negatif ay",
        "en": "Critical Alert · first negative month"
      },
      "months": {
        "tr": "Görev Evresi · ay",
        "en": "Mission Phase · month"
      },
      "reserve": {
        "tr": "Rezerv Yakıt",
        "en": "Reserve Fuel"
      },
      "locked": {
        "tr": "Kilitli Kargo · bloke",
        "en": "Locked Cargo · blocked"
      },
      "timeline": {
        "tr": "Görev Zaman Çizelgesi",
        "en": "Mission Timeline"
      }
    },
    "decor": "starfield",
    "chart": {
      "line": "#72e3ff",
      "dashed": "#b3c5dc",
      "dotted": "#ffd17a",
      "area": "#ff704026",
      "font": "\"Cascadia Mono\", Consolas, monospace"
    }
  },
  "horizon": {
    "id": "horizon",
    "label": {
      "tr": "Beyaz · Yeşil",
      "en": "White · Green"
    },
    "fonts": {
      "display": "\"Bahnschrift\", \"Segoe UI\", system-ui, sans-serif",
      "body": "\"Segoe UI\", system-ui, sans-serif",
      "mono": "\"Cascadia Mono\", Consolas, monospace"
    },
    "tokens": {
      "--bg": "#ffffff",
      "--panel": "#f2f8f4",
      "--text": "#173b2a",
      "--muted": "#42624f",
      "--accent": "#176b42",
      "--warn": "#596b26",
      "--danger": "#75451f",
      "--grid": "#9bb7a4",
      "--glow": "#176b4212",
      "--radius": "14px",
      "--star": "#7591aa80",
      "--transparent": "transparent",
      "--panel-soft": "#e8f2eb",
      "--accent-soft": "#176b4214",
      "--hero-glow": "#176b4208",
      "--danger-soft": "#75451f10"
    },
    "lexicon": {
      "title": {
        "tr": "Almanya’da eğitim ve yaşam planı",
        "en": "Study and life plan for Germany"
      },
      "balance": {
        "tr": "Bütçe Dengesi · likit",
        "en": "Budget Balance · liquid"
      },
      "graduation": {
        "tr": "Mezuniyet · kalan likit",
        "en": "Graduation · liquid remaining"
      },
      "firstNegative": {
        "tr": "İlk açık · ay",
        "en": "First shortfall · month"
      },
      "months": {
        "tr": "Zaman çizelgesi · ay",
        "en": "Timeline · month"
      },
      "reserve": {
        "tr": "Acil durum rezervi",
        "en": "Emergency reserve"
      },
      "locked": {
        "tr": "Bloke bakiye",
        "en": "Blocked balance"
      },
      "timeline": {
        "tr": "Yaşam ve nakit zaman çizelgesi",
        "en": "Life and cash timeline"
      },
      "status": {
        "tr": "HORIZON / SENARYO DURUMU",
        "en": "HORIZON / SCENARIO STATUS"
      },
      "heroEyebrow": {
        "tr": "ALMANYA · EĞİTİM VE YAŞAM SENARYOSU",
        "en": "GERMANY · STUDY AND LIFE SCENARIO"
      },
      "heroDescription": {
        "tr": "Eğitim, iş, yaşam giderleri ve nakit ihtiyacını birlikte incele. Varsayımları değiştir; sonuçları ve açık koşulları karşılaştır.",
        "en": "Review education, work, living costs, and cash needs together. Change assumptions to compare outcomes and outstanding conditions."
      },
      "resultsEyebrow": {
        "tr": "01 / SENARYO SONUÇLARI",
        "en": "01 / SCENARIO RESULTS"
      },
      "telemetry": {
        "tr": "02 / NAKİT AKIŞI",
        "en": "02 / CASH FLOW"
      },
      "scenarioEyebrow": {
        "tr": "SENARYO / ALMANYA",
        "en": "SCENARIO / GERMANY"
      },
      "chartTitle": {
        "tr": "60 aylık nakit akışı",
        "en": "60-month cash flow"
      },
      "footerNote": {
        "tr": "Horizon · Varsayımları incele, gerçek kanıtlarla karar ver.",
        "en": "Horizon · Review assumptions and decide with real evidence."
      }
    },
    "decor": "none",
    "chart": {
      "line": "#176b42",
      "dashed": "#42624f",
      "dotted": "#596b26",
      "area": "#b4472420",
      "font": "\"Cascadia Mono\", Consolas, monospace"
    }
  }
};
if(typeof module!=="undefined")module.exports={THEMES,UI_LEXICON};
