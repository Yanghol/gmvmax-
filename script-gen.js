(() => {
  /* ======================================================================
     PRODUCT DATABASE — 6 SKUs, kids skincare, 10+ items per pool
     ====================================================================== */
  const DEFAULT_PRODUCTS = [
    {
      id: "ice_cream", icon: "🧊", custom: false,
      zh: { name: "冰沙霜", sub: "Ice Cream Moisturizer" },
      en: { name: "Ice Cream Moisturizer", sub: "" },
      id_: { name: "Ice Cream Moisturizer", sub: "" },
      pains: {
        zh: ["宝宝皮肤干燥起皮，涂了还是痒","天气热宝宝一出门就红脸蛋","大人的面霜太油腻，宝宝用了闷痘","孩子皮肤敏感，不敢随便用产品","空调房里宝宝脸蛋干到脱皮","试了好几款面霜都过敏","宝宝脸上起小红点，心疼死了","夏天用面霜太厚重，冬天又不够润","宝宝抓脸抓到破皮，因为太干了","每次涂面霜宝宝都躲，因为太油了"],
        en: ["Your kid's skin gets dry and flaky no matter what you try","Baby's cheeks turn red the moment they step outside","Adult creams are too heavy — causes breakouts on kids","Sensitive skin? You're scared to try anything new","AC rooms make baby's face peel and crack","Tried several creams and all caused allergic reactions","Baby's face has tiny red bumps — so heartbreaking","Summer creams feel too thick, winter ones aren't enough","Baby scratches face raw because skin is so dry","Kid runs away when you try to apply cream — too greasy"],
        id: ["Kulit anak kering dan mengelupas, sudah pakai krim tapi tetap gatal","Cuaca panas bikin pipi anak langsung merah","Krim orang dewasa terlalu berat untuk kulit anak","Kulit anak sensitif, takut coba produk baru","Ruangan AC bikin wajah anak kering mengelupas","Sudah coba beberapa krim tapi selalu alergi","Muncul bintik merah di wajah anak, sedih banget","Krim musim panas terlalu tebal, musim dingin kurang lembap","Anak garuk-garuk wajah sampai lecet karena kering","Anak kabur setiap mau diolesin krim — terlalu berminyak"]
      },
      points: {
        zh: ["冰沙质地，清爽不油腻","专为儿童敏感肌设计","快速吸收，保湿持久","温和配方，无刺激成分","涂上凉凉的，宝宝超喜欢","不含酒精、香精、色素","通过皮肤安全测试","一抹即化，不搓泥","四季适用，夏天也不闷","锁水保湿长达8小时","天然植物提取，妈妈放心"],
        en: ["Ice-cream texture, light and non-greasy","Designed for children's sensitive skin","Fast absorption, long-lasting moisture","Gentle formula, no harsh ingredients","Cooling sensation kids love","Free from alcohol, fragrance, and colorants","Dermatologically tested for safety","Melts on contact, no residue","All-season use — not heavy even in summer","Locks in moisture for up to 8 hours","Natural plant extracts moms can trust"],
        id: ["Tekstur es krim, ringan dan tidak berminyak","Dirancang khusus untuk kulit sensitif anak","Cepat menyerap, melembapkan tahan lama","Formula lembut, tanpa bahan keras","Sensasi dingin yang disukai anak-anak","Bebas alkohol, pewangi, dan pewarna","Telah diuji keamanan dermatologis","Langsung menyerap, tidak meninggalkan residu","Bisa dipakai semua musim — tidak berat di musim panas","Mengunci kelembapan hingga 8 jam","Ekstrak tumbuhan alami yang dipercaya ibu"]
      },
      hooks: {
        zh: ["宝宝涂了这个霜，居然说"妈妈再来一点"！","这个冰沙霜让我女儿的红脸蛋消失了！","别再给孩子用大人的面霜了！","印尼妈妈们都在囤的儿童面霜！","一涂就凉的面霜？宝宝抢着要涂！","面霜居然能让宝宝笑着护肤？","夏天也不油腻的宝宝面霜找到了！","这个质地，涂上去就像冰淇淋一样！","后悔没早发现！宝宝用了皮肤滑滑的","3秒吸收的儿童面霜，你信吗？"],
        en: ["My kid asked me to put MORE cream on her face!","This ice cream moisturizer fixed my daughter's red cheeks!","Stop putting adult cream on your kids!","Indonesian moms are STOCKING UP on this cream!","A cream that feels cool on touch? Kids BEG for it!","A moisturizer that makes kids SMILE during skincare?","Finally — a summer cream that's NOT greasy!","This texture feels just like real ice cream!","Wish I found this sooner — baby's skin is SO smooth now","A kids' cream that absorbs in 3 seconds — believe it?"],
        id: ["Anak saya minta diolesin lagi dan lagi!","Krim ini bikin pipi merah anak saya hilang!","Jangan pakai krim dewasa untuk anak!","Ibu-ibu Indonesia lagi borong krim ini!","Krim yang dingin saat dioles? Anak-anak minta terus!","Krim yang bikin anak SENYUM saat skincare?","Akhirnya nemu krim musim panas yang NGGAK berminyak!","Teksturnya kayak es krim beneran!","Nyesel baru nemu sekarang — kulit anak jadi halus banget","Krim anak yang menyerap dalam 3 detik — percaya nggak?"]
      },
      warn: { zh: "避免宣称"治疗湿疹"等医疗功效", en: "Avoid claiming medical benefits like 'treats eczema'", id: "Hindari klaim medis seperti 'mengobati eksim'" }
    },
    {
      id: "lotion", icon: "🧴", custom: false,
      zh: { name: "润肤乳", sub: "Body Lotion" }, en: { name: "Kids Body Lotion", sub: "" }, id_: { name: "Kids Body Lotion", sub: "" },
      pains: {
        zh: ["换季宝宝全身干痒，抓得到处红印","洗完澡皮肤紧绷，宝宝不舒服哭闹","市面上的润肤乳香精味太重，不放心","涂了身体乳还是脱皮，保湿力不够","宝宝腿上胳膊上起白色干皮","每次穿衣服宝宝说痒，一看都是干纹","用了好几款润肤乳都不够滋润","宝宝抗拒涂身体乳，嫌粘粘的","一到秋冬宝宝就变"蛇皮"肌","担心润肤乳成分不安全"],
        en: ["Seasonal changes leave your child's skin dry and itchy","Skin feels tight after bath — baby gets fussy","Most lotions smell too artificial for kids","Applied lotion but still peeling — not moisturizing enough","White flaky patches on baby's arms and legs","Kid says clothes feel itchy — dry lines everywhere","Tried many lotions, none moisturize enough","Baby hates body lotion because it's sticky","Every fall/winter baby's skin looks like scales","Worried about lotion ingredient safety"],
        id: ["Pergantian musim bikin kulit anak kering dan gatal","Setelah mandi kulit terasa kencang, anak rewel","Kebanyakan lotion baunya terlalu kuat untuk anak","Sudah pakai lotion tapi masih mengelupas","Muncul bercak putih kering di tangan dan kaki anak","Anak bilang baju terasa gatal — ternyata kulit kering","Sudah coba banyak lotion, tidak ada yang cukup lembap","Anak nggak mau pakai lotion karena lengket","Setiap musim kemarau kulit anak jadi kasar","Khawatir bahan lotion tidak aman untuk anak"]
      },
      points: {
        zh: ["温和保湿，全身可用","轻薄好推开，不粘腻","适合宝宝娇嫩肌肤","淡淡清香，宝宝不抗拒","大瓶装，性价比高","涂完立刻吸收，不沾衣服","24小时持续保湿","不含防腐剂和人工色素","经过儿童皮肤安全测试","按压式瓶口，妈妈单手操作"],
        en: ["Gentle moisturizing for the whole body","Lightweight, spreads easily, non-sticky","Perfect for delicate children's skin","Mild scent kids won't resist","Big bottle, great value","Absorbs instantly, doesn't stain clothes","24-hour continuous moisture","No preservatives or artificial colors","Tested safe for children's skin","Pump bottle — easy one-hand use for moms"],
        id: ["Melembapkan lembut untuk seluruh tubuh","Ringan, mudah diratakan, tidak lengket","Cocok untuk kulit halus anak-anak","Aroma lembut yang disukai anak","Botol besar, harga terjangkau","Langsung menyerap, tidak menempel di baju","Kelembapan 24 jam tanpa henti","Tanpa pengawet dan pewarna buatan","Teruji aman untuk kulit anak","Botol pompa — mudah dipakai satu tangan"]
      },
      hooks: {
        zh: ["换季不怕了！宝宝全身滑滑嫩嫩","一瓶搞定宝宝全身保湿！","宝宝洗完澡第一件事就是要涂这个！","告别蛇皮肌！宝宝润肤乳天花板","涂完不粘衣服的润肤乳，终于找到了！","这瓶润肤乳让宝宝主动伸手要涂！","印尼天气这么热，宝宝更需要保湿！","大瓶装用3个月，性价比绝了！","宝宝的皮肤，值得最温和的呵护","一按一抹，全身保湿搞定！"],
        en: ["No more dry skin this season! Baby smooth all over","One bottle for your baby's whole-body moisture!","After bath, my kid runs to grab this lotion!","Say goodbye to scaly skin! Best kids' lotion ever","Finally — a lotion that doesn't stain clothes!","This lotion made my kid stretch out their arms willingly!","Hot weather? Your kid needs moisture even MORE!","Big bottle lasts 3 months — amazing value!","Your baby's skin deserves the gentlest care","One pump, one smooth stroke — full body moisturized!"],
        id: ["Ganti musim nggak takut lagi! Kulit anak halus terus","Satu botol untuk melembapkan seluruh tubuh anak!","Habis mandi, anak saya langsung minta diolesin ini!","Bye bye kulit kasar! Lotion anak terbaik","Akhirnya nemu lotion yang nggak nempel di baju!","Lotion ini bikin anak saya mau diolesin sendiri!","Cuaca panas? Kulit anak LEBIH butuh kelembapan!","Botol besar awet 3 bulan — hemat banget!","Kulit anak layak dapat perawatan paling lembut","Satu pompa, satu olesan — seluruh tubuh lembap!"]
      },
      warn: { zh: "不要用"消除湿疹/皮炎"等描述", en: "Do not claim 'cures eczema/dermatitis'", id: "Jangan klaim 'menyembuhkan eksim/dermatitis'" }
    },
    {
      id: "mousse", icon: "🫧", custom: false,
      zh: { name: "洁面慕斯", sub: "Cleansing Mousse" }, en: { name: "Kids Cleansing Mousse", sub: "" }, id_: { name: "Kids Cleansing Mousse", sub: "" },
      pains: {
        zh: ["宝宝怕洗脸，每次洗都哭","普通洗面奶太刺激，洗完眼睛红红的","孩子出去玩一身汗，脸上脏兮兮不好洗","洁面产品泡泡不够多，孩子不配合","洗面奶残留感重，宝宝脸上滑滑的","宝宝用了洗面奶起红疹","每次给宝宝洗脸都像打仗一样","不知道该不该给孩子用洁面产品","孩子脸上出油冒汗但不敢用洗面奶","泡泡不细腻，宝宝觉得不好玩不配合"],
        en: ["Your kid cries every time you wash their face","Regular cleansers sting — red eyes after every wash","Kids come home sweaty and dirty but hate face washing","Not enough foam? Kids won't cooperate","Cleanser leaves a slippery residue on baby's face","Baby got rashes after using face wash","Face washing time feels like a battle","Not sure if kids even need a facial cleanser","Kid's face is oily and sweaty but scared to use cleanser","Foam isn't fine enough — kid thinks it's boring"],
        id: ["Anak menangis setiap kali cuci muka","Pembersih biasa perih di mata anak","Anak pulang berkeringat tapi nggak mau cuci muka","Busanya kurang banyak, anak nggak mau pakai","Pembersih meninggalkan residu licin di wajah anak","Anak muncul ruam setelah pakai pembersih","Waktu cuci muka kayak perang","Bingung anak perlu pembersih wajah atau nggak","Wajah anak berminyak tapi takut pakai pembersih","Busa nggak cukup halus, anak nggak tertarik"]
      },
      points: {
        zh: ["按压即出绵密泡泡","氨基酸配方，温和不刺激","无泪配方，不怕进眼睛","洗完不紧绷，保持水润","可爱瓶身，宝宝爱用","泡泡细腻如棉花糖","天然植物清洁因子","弱酸性配方，保护皮肤屏障","不含皂基，不伤肌肤","洗完脸蛋嫩嫩的"],
        en: ["One pump = rich, fluffy foam","Amino acid formula, gentle & mild","Tear-free — no stinging eyes","Doesn't dry out skin after wash","Cute bottle kids love using","Foam as fine as cotton candy","Natural plant-based cleansing agents","Mildly acidic — protects skin barrier","Soap-free, won't damage skin","Face feels soft and smooth after wash"],
        id: ["Satu pompa langsung busa lembut","Formula asam amino, lembut & ringan","Tanpa air mata — tidak perih di mata","Tidak bikin kulit kering setelah cuci","Botol lucu yang disukai anak","Busa halus seperti permen kapas","Agen pembersih alami dari tumbuhan","pH rendah — melindungi lapisan kulit","Bebas sabun, tidak merusak kulit","Wajah terasa lembut dan halus setelah cuci"]
      },
      hooks: {
        zh: ["从此宝宝不怕洗脸了！","这个泡泡让宝宝爱上洗脸！","无泪配方到底有多温和？看宝宝的反应就知道了","按一下就出来的绵密泡泡，宝宝玩疯了！","洗脸不哭的秘密，全靠这一瓶！","宝宝居然催我说"妈妈快洗脸"？！","再也不用追着宝宝洗脸了！","泡泡像棉花糖一样，宝宝当玩具玩！","妈妈们！别再用清水给宝宝洗脸了","这款慕斯让洗脸变成了宝宝最爱的游戏"],
        en: ["My kid finally stopped crying during face wash!","This foam made my baby LOVE washing her face!","How gentle is tear-free? Watch my baby's reaction!","One pump of fluffy foam — my kid went CRAZY for it!","The secret to cry-free face washing — this bottle!","My baby actually said 'Mom, let's wash my face!'","No more chasing kids around for face washing!","Foam like cotton candy — kids treat it like a toy!","Moms! Stop using just water on your baby's face","This mousse turned face wash into baby's favorite game"],
        id: ["Akhirnya anak saya nggak takut cuci muka lagi!","Busa ini bikin anak saya suka cuci muka!","Seberapa lembut formula tanpa air mata? Lihat reaksi anak saya!","Satu pompa busa lembut — anak saya langsung senang!","Rahasia cuci muka tanpa tangisan — botol ini!","Anak saya malah bilang 'Ma, ayo cuci muka!'","Nggak perlu kejar-kejaran lagi waktu cuci muka!","Busanya kayak permen kapas — anak main-main terus!","Ibu-ibu! Jangan cuma pakai air untuk cuci muka anak","Mousse ini bikin cuci muka jadi permainan favorit anak"]
      },
      warn: { zh: "不要宣称"杀菌消毒"功效", en: "Don't claim 'antibacterial/disinfecting' effects", id: "Jangan klaim efek 'antibakteri/disinfektan'" }
    },
    {
      id: "sunscreen", icon: "☀️", custom: false,
      zh: { name: "防晒霜", sub: "Sunscreen" }, en: { name: "Kids Sunscreen", sub: "" }, id_: { name: "Kids Sunscreen", sub: "" },
      pains: {
        zh: ["印尼太阳太毒，宝宝出门就晒黑晒伤","大人的防晒太油，宝宝脸上搓泥","每次涂防晒宝宝都哭，太刺激了","怕化学防晒伤害宝宝皮肤","出门半小时宝宝就晒红了","防晒霜味道太重宝宝不让涂","涂了防晒还是晒黑，感觉没效果","不知道宝宝多大可以用防晒","防晒和汗混在一起糊成一团","物理防晒太白太厚，化学防晒怕刺激"],
        en: ["Tropical sun is harsh — baby gets sunburnt in minutes","Adult sunscreen is too greasy, leaves white cast on kids","Every sunscreen makes your baby cry — too harsh!","Worried about chemical sunscreen on your child's skin?","30 minutes outside and baby's skin turns red","Sunscreen smells too strong — kid won't let you apply","Applied sunscreen but still got tanned — feels useless","Don't know what age kids can start using sunscreen","Sunscreen mixes with sweat and becomes a sticky mess","Physical sunscreen too white, chemical too harsh — what to do?"],
        id: ["Matahari tropis sangat terik, kulit anak cepat terbakar","Sunscreen dewasa terlalu berminyak, meninggalkan bekas putih","Setiap sunscreen bikin anak menangis — terlalu keras!","Khawatir sunscreen kimia merusak kulit anak?","30 menit di luar kulit anak sudah merah","Sunscreen baunya terlalu kuat, anak nggak mau diolesin","Sudah pakai sunscreen tapi tetap gosong — nggak efektif","Bingung anak umur berapa boleh pakai sunscreen","Sunscreen campur keringat jadi lengket berantakan","Sunscreen fisik terlalu putih, kimia terlalu keras — gimana dong?"]
      },
      points: {
        zh: ["儿童专用防晒配方","轻薄不油腻，不搓泥","温和不刺激眼睛","防水防汗，户外必备","易涂抹，宝宝不抗拒","不含酒精和人工香精","成膜快，出门前5分钟涂就够","滋润保湿，防晒养肤二合一","适合热带气候使用","不泛白，自然肤色"],
        en: ["Formulated specifically for kids","Lightweight, non-greasy, no white cast","Gentle on eyes, no stinging","Water & sweat resistant for outdoor play","Easy to apply, kids don't fuss","No alcohol or artificial fragrance","Quick-drying — apply 5 min before heading out","Moisturizing + sun protection in one","Perfect for tropical climates","No white cast, natural skin tone"],
        id: ["Diformulasikan khusus untuk anak-anak","Ringan, tidak berminyak, tanpa bekas putih","Lembut di mata, tidak perih","Tahan air & keringat untuk bermain di luar","Mudah diaplikasikan, anak tidak rewel","Tanpa alkohol dan pewangi buatan","Cepat kering — olesi 5 menit sebelum keluar","Melembapkan + perlindungan matahari dalam satu","Cocok untuk iklim tropis","Tanpa bekas putih, warna kulit alami"]
      },
      hooks: {
        zh: ["印尼妈妈必备！宝宝防晒不能马虎","别让阳光伤害宝宝嫩嫩的皮肤！","这个防晒霜，宝宝居然主动要涂！","不泛白的儿童防晒，终于被我找到了！","热带国家的宝宝，防晒是必需品！","涂了这个防晒，宝宝户外玩一天都没晒黑！","5分钟成膜！出门前随手一涂就OK","宝宝防晒霜里的天花板，不接受反驳！","不搓泥不油腻的儿童防晒，存在吗？存在！","和宝宝晒伤说拜拜！"],
        en: ["Indonesian moms, this sunscreen is a MUST!","Don't let the sun damage your baby's delicate skin!","My kid actually ASKS for this sunscreen!","A kids' sunscreen with NO white cast — finally found it!","Living in the tropics? Sunscreen is NON-NEGOTIABLE for kids!","Applied this and baby played outside ALL DAY — no tan!","5-minute dry time! Quick apply before heading out","The BEST kids' sunscreen — I won't take no for an answer!","Non-greasy kids' sunscreen? Does it exist? YES IT DOES!","Say BYE BYE to sunburned babies!"],
        id: ["Ibu-ibu Indonesia, sunscreen ini WAJIB punya!","Jangan biarkan matahari merusak kulit halus anak!","Anak saya malah MINTA pakai sunscreen ini!","Sunscreen anak TANPA bekas putih — akhirnya nemu!","Tinggal di tropis? Sunscreen anak itu WAJIB!","Pakai ini anak main seharian di luar — nggak gosong!","5 menit kering! Olesi cepat sebelum keluar","Sunscreen anak TERBAIK — nggak terima bantahan!","Sunscreen anak nggak berminyak? Ada nggak sih? ADA!","Bilang BYE BYE sama kulit anak yang terbakar matahari!"]
      },
      warn: { zh: "SPF值需如实标注，不夸大防护效果", en: "SPF value must be stated accurately, don't exaggerate", id: "Nilai SPF harus dinyatakan akurat, jangan dilebih-lebihkan" }
    },
    {
      id: "shampoo", icon: "🫧", custom: false,
      zh: { name: "洗头膏", sub: "Shampoo" }, en: { name: "Kids Shampoo", sub: "" }, id_: { name: "Kids Shampoo", sub: "" },
      pains: {
        zh: ["宝宝洗头大哭大闹，每次洗头像打仗","洗发水进眼睛，宝宝疼得直哭","头皮出汗多，普通洗发水洗不干净","洗完头发干涩打结，梳不动","宝宝头皮容易起头垢","大人的洗发水太刺激宝宝头皮","洗发水泡泡太少洗不干净","每次洗头宝宝都躲到浴室角落","宝宝头发细软容易断","洗完头发静电炸毛"],
        en: ["Bath time = war zone when it's hair washing time","Shampoo gets in eyes, baby screams in pain","Sweaty scalp — regular shampoo doesn't clean well","Hair is dry and tangled after wash, impossible to comb","Baby's scalp gets cradle cap buildup easily","Adult shampoo is too harsh for baby's scalp","Shampoo doesn't lather enough — not cleaning properly","Kid hides in bathroom corner every hair wash time","Baby's fine hair breaks easily","Static and flyaway hair after every wash"],
        id: ["Waktu mandi jadi perang kalau harus keramas","Sampo masuk mata, anak menangis kesakitan","Kulit kepala berkeringat, sampo biasa nggak bersih","Rambut kering dan kusut setelah keramas","Kulit kepala anak mudah berkerak","Sampo dewasa terlalu keras untuk kulit kepala anak","Sampo busanya sedikit, nggak bersih","Anak sembunyi di pojokan setiap mau keramas","Rambut anak halus dan mudah patah","Rambut mengembang karena listrik statis setelah keramas"]
      },
      points: {
        zh: ["无泪温和配方","天然植物清洁成分","洗完头发柔顺好梳理","温和清洁头皮，不刺激","淡淡果香，宝宝喜欢","丰富泡泡，清洁力够","不含硅油，不堵塞毛囊","PH值接近宝宝头皮","洗护二合一，省时省力","适合每天使用"],
        en: ["Tear-free gentle formula","Natural plant-based cleansing","Leaves hair soft and easy to comb","Gently cleanses scalp without irritation","Light fruity scent kids love","Rich lather for thorough cleaning","Silicone-free, won't clog follicles","pH balanced for baby's scalp","2-in-1 wash & care, saves time","Safe for daily use"],
        id: ["Formula lembut tanpa air mata","Bahan pembersih alami dari tumbuhan","Rambut lembut dan mudah disisir","Membersihkan kulit kepala dengan lembut","Aroma buah ringan yang disukai anak","Busa melimpah untuk membersihkan menyeluruh","Bebas silikon, tidak menyumbat folikel","pH seimbang untuk kulit kepala anak","2-in-1 cuci & rawat, hemat waktu","Aman untuk penggunaan harian"]
      },
      hooks: {
        zh: ["从此洗头不用再追着宝宝跑了！","无泪洗头膏，宝宝居然笑着洗头了！","宝宝洗头不哭的秘诀，就是这瓶！","洗完头发顺滑到梳子直接滑过去！","果香味的洗头膏，宝宝闻了就想洗头！","告别洗头大战！这瓶让宝宝爱上洗头","泡泡超多的儿童洗头膏，宝宝玩着就洗完了","洗护二合一，带娃效率翻倍！","宝宝头发总是打结？试试这个！","印尼天气热，宝宝一天一洗也不怕！"],
        en: ["No more chasing your kid around for hair wash!","Tear-free shampoo? My baby actually SMILED!","The secret to cry-free hair washing — this bottle!","Hair so smooth after wash, the comb just glides through!","Fruity-scented shampoo — baby WANTS to wash hair now!","End the hair wash battle! This makes kids love it","SO much foam — kid was playing and washing at the same time!","2-in-1 wash & care — doubles your parenting efficiency!","Baby's hair always tangled? Try THIS!","Hot tropical weather? Safe for daily washing!"],
        id: ["Nggak perlu kejar-kejaran lagi waktu keramas!","Sampo tanpa air mata? Anak saya malah SENYUM!","Rahasia keramas tanpa tangisan — botol ini!","Rambut halus banget setelah keramas, sisir langsung lewat!","Sampo aroma buah — anak MINTA keramas sendiri!","Akhiri perang keramas! Ini bikin anak suka","Busanya BANYAK banget — anak main sambil keramas!","2-in-1 cuci & rawat — efisiensi ngurus anak 2x lipat!","Rambut anak selalu kusut? Coba INI!","Cuaca tropis panas? Aman untuk keramas setiap hari!"]
      },
      warn: { zh: "不要宣称"防脱发""生发"等功效", en: "Don't claim 'prevents hair loss' or 'promotes growth'", id: "Jangan klaim 'mencegah rambut rontok' atau 'mempercepat pertumbuhan'" }
    },
    {
      id: "bodywash", icon: "🛁", custom: false,
      zh: { name: "沐浴露", sub: "Body Wash" }, en: { name: "Kids Body Wash", sub: "" }, id_: { name: "Kids Body Wash", sub: "" },
      pains: {
        zh: ["宝宝出汗多，普通沐浴露洗不干净","大人沐浴露太刺激，宝宝皮肤过敏","洗完澡皮肤干巴巴的","沐浴露味道太冲，宝宝不喜欢","宝宝不爱洗澡，每次都要哄半天","沐浴露泡泡太少，宝宝觉得没意思","天气热每天洗，怕沐浴露伤皮肤","宝宝身上起热痱子，洗澡更麻烦","用了沐浴露宝宝身上痒","香精味残留在宝宝身上一整天"],
        en: ["Kids sweat a lot — regular body wash doesn't cut it","Adult body wash irritates baby's skin","Skin feels dry and tight after bath","Body wash smell is too strong for kids","Kid hates bath time — takes forever to convince them","Not enough bubbles — kid thinks bath is boring","Daily baths in hot weather — worried about skin damage","Baby has heat rash — bath time becomes a hassle","Body wash makes baby's skin itchy","Artificial fragrance lingers on baby's skin all day"],
        id: ["Anak banyak berkeringat, sabun biasa nggak cukup bersih","Sabun dewasa bikin kulit anak iritasi","Kulit terasa kering setelah mandi","Aroma sabun terlalu kuat untuk anak","Anak nggak suka mandi, harus dibujuk lama","Busanya kurang, anak merasa mandi nggak seru","Mandi setiap hari di cuaca panas, takut kulit rusak","Anak kena biang keringat, mandi jadi repot","Sabun bikin kulit anak gatal","Aroma buatan nempel di kulit anak seharian"]
      },
      points: {
        zh: ["温和清洁，保护皮肤屏障","丰富泡泡，宝宝爱洗澡","洗完不干涩，保湿滋润","天然成分，安心使用","适合每天使用","弱酸性配方","不含皂基和SLS","清爽不假滑","淡雅果香，洗完留香清新","大容量按压瓶，方便使用"],
        en: ["Gentle cleansing, protects skin barrier","Rich lather kids love","Moisturizing — no dry feeling after bath","Natural ingredients, safe for daily use","Suitable for everyday use","Mildly acidic formula","No soap base or SLS","Clean rinse, no slippery residue","Light fruity scent, fresh after bath","Large pump bottle for easy use"],
        id: ["Membersihkan lembut, melindungi lapisan kulit","Busa melimpah yang disukai anak","Melembapkan — tidak kering setelah mandi","Bahan alami, aman digunakan setiap hari","Cocok untuk penggunaan harian","Formula pH rendah","Tanpa sabun dan SLS","Bersih tanpa residu licin","Aroma buah ringan, segar setelah mandi","Botol pompa besar, mudah digunakan"]
      },
      hooks: {
        zh: ["宝宝现在催我给他洗澡！","这个泡泡多到宝宝玩疯了！","终于找到一款宝宝不抗拒的沐浴露！","洗完澡不用再涂润肤乳了！这款自带保湿","宝宝在浴缸里笑得合不拢嘴！","一瓶搞定全身清洁！妈妈轻松了","泡泡浴的快乐，宝宝也能拥有！","不假滑不干涩，洗感刚刚好！","天天洗也不伤皮肤的沐浴露，存在吗？","宝宝洗完澡香香的，忍不住亲一口！"],
        en: ["My kid now BEGS for bath time!","So much foam, my baby went crazy playing with it!","Finally found a body wash my kid doesn't resist!","No need for lotion after — this has built-in moisture!","Baby couldn't stop laughing in the bathtub!","One bottle for full-body clean — moms rejoice!","Bubble bath joy — your baby deserves it too!","Not too slippery, not too dry — just right!","A body wash safe for DAILY use — does it exist? YES!","Baby smells so good after bath — can't stop cuddling!"],
        id: ["Anak saya sekarang MINTA dimandiin!","Busanya banyak banget, anak saya senang main busa!","Akhirnya nemu sabun yang anak saya nggak tolak!","Nggak perlu lotion setelah mandi — ini sudah melembapkan!","Anak nggak berhenti ketawa di bak mandi!","Satu botol bersihkan seluruh tubuh — ibu lega!","Keseruan mandi busa — anak juga berhak menikmati!","Nggak terlalu licin, nggak kering — pas banget!","Sabun yang aman untuk mandi SETIAP HARI — ada nggak? ADA!","Anak wangi banget habis mandi — nggak tahan mau peluk!"]
      },
      warn: { zh: "避免"杀菌99.9%"等未经验证的宣称", en: "Avoid unverified claims like 'kills 99.9% germs'", id: "Hindari klaim yang belum terverifikasi seperti 'membunuh 99,9% kuman'" }
    }
  ];

  const VIDEO_TYPES = [
    { id: "oral", icon: "🎤", zh: { name: "达人口播", desc: "对镜讲解推荐" }, en: { name: "Talking Head", desc: "Creator speaks to camera" }, id_: { name: "Review Langsung", desc: "Kreator bicara ke kamera" } },
    { id: "demo", icon: "🖐️", zh: { name: "使用演示", desc: "展示涂抹/使用过程" }, en: { name: "Demo / Tutorial", desc: "Show how to use" }, id_: { name: "Demo / Tutorial", desc: "Tunjukkan cara pakai" } },
    { id: "beforeafter", icon: "✨", zh: { name: "前后对比", desc: "使用前后效果" }, en: { name: "Before & After", desc: "Show results" }, id_: { name: "Sebelum & Sesudah", desc: "Tunjukkan hasil" } },
    { id: "skit", icon: "🎬", zh: { name: "情景剧", desc: "生活场景植入" }, en: { name: "Skit / Story", desc: "Lifestyle scenario" }, id_: { name: "Skit / Cerita", desc: "Skenario kehidupan" } }
  ];
  const DURATIONS = [
    { id: "15s", zh: { name: "15秒", desc: "硬广/快节奏" }, en: { name: "15 sec", desc: "Hard sell / fast" }, id_: { name: "15 detik", desc: "Iklan keras / cepat" }, timing: { hook: "0-3s", pain: "3-6s", product: "6-10s", effect: "10-13s", cta: "13-15s" } },
    { id: "30s", zh: { name: "30秒", desc: "标准种草" }, en: { name: "30 sec", desc: "Standard promo" }, id_: { name: "30 detik", desc: "Promosi standar" }, timing: { hook: "0-5s", pain: "5-12s", product: "12-20s", effect: "20-26s", cta: "26-30s" } },
    { id: "60s", zh: { name: "60秒", desc: "深度种草/测评" }, en: { name: "60 sec", desc: "Deep review" }, id_: { name: "60 detik", desc: "Review mendalam" }, timing: { hook: "0-5s", pain: "5-15s", product: "15-35s", effect: "35-50s", cta: "50-60s" } }
  ];
  const DIRECTIONS = {
    oral: { zh: { hook: "正脸出镜，表情夸张，制造好奇", pain: "皱眉/无奈表情，共情妈妈", product: "举起产品展示，介绍核心卖点", effect: "展示使用后效果/宝宝反应", cta: "指向下方链接，强调限时" }, en: { hook: "Face camera, expressive, create curiosity", pain: "Frustrated look, empathize with moms", product: "Hold up product, highlight key benefit", effect: "Show results or baby's reaction", cta: "Point to link below, stress urgency" }, id: { hook: "Hadap kamera, ekspresi menarik, bikin penasaran", pain: "Ekspresi frustrasi, empati sama ibu-ibu", product: "Angkat produk, jelaskan manfaat utama", effect: "Tunjukkan hasil atau reaksi anak", cta: "Tunjuk link di bawah, tekankan terbatas" } },
    demo: { zh: { hook: "展示产品外观/质地特写", pain: "展示宝宝皮肤问题场景", product: "挤出产品，展示质地和涂抹过程", effect: "涂抹前后皮肤对比/宝宝开心反应", cta: "展示产品全貌+价格标签" }, en: { hook: "Close-up of product texture/packaging", pain: "Show child's skin issue scenario", product: "Squeeze product, show texture and application", effect: "Before/after skin or happy baby reaction", cta: "Full product shot + price tag" }, id: { hook: "Close-up tekstur/kemasan produk", pain: "Tunjukkan masalah kulit anak", product: "Keluarkan produk, tunjukkan tekstur dan cara pakai", effect: "Sebelum/sesudah kulit atau reaksi anak senang", cta: "Tampilkan produk lengkap + harga" } },
    beforeafter: { zh: { hook: "先展示"使用前"的状态", pain: "放大问题细节，引起共鸣", product: "快速介绍产品+核心成分", effect: ""使用后"效果对比，配字幕", cta: "再次展示产品+引导购买" }, en: { hook: "Show the 'BEFORE' state", pain: "Zoom into the problem", product: "Quick product intro + key ingredient", effect: "'AFTER' result comparison with text overlay", cta: "Show product again + buy link" }, id: { hook: "Tunjukkan kondisi 'SEBELUM'", pain: "Zoom ke masalahnya", product: "Perkenalan produk singkat + bahan utama", effect: "Perbandingan hasil 'SESUDAH' dengan teks", cta: "Tunjukkan produk lagi + link beli" } },
    skit: { zh: { hook: "生活场景切入，妈妈发现问题", pain: "妈妈担心/焦虑的表演", product: "闺蜜/家人推荐产品（自然植入）", effect: "场景转换，问题解决，宝宝开心", cta: "回到妈妈视角，推荐+链接" }, en: { hook: "Everyday scene — mom notices a problem", pain: "Mom worried/anxious acting", product: "Friend/family recommends product (natural placement)", effect: "Scene transition — problem solved, happy baby", cta: "Back to mom's POV — recommend + link" }, id: { hook: "Adegan sehari-hari — ibu menyadari masalah", pain: "Ibu khawatir/cemas (acting)", product: "Teman/keluarga rekomendasikan produk (natural)", effect: "Transisi adegan — masalah teratasi, anak senang", cta: "Kembali ke sudut pandang ibu — rekomendasi + link" } }
  };
  const SEG_LABELS = {
    hook: { zh: "Hook · 开头抓眼球", en: "Hook · Attention Grab", id: "Hook · Menarik Perhatian" },
    pain: { zh: "痛点 · 引发共鸣", en: "Pain Point · Empathy", id: "Pain Point · Empati" },
    product: { zh: "产品 · 核心卖点", en: "Product · Key Benefits", id: "Produk · Manfaat Utama" },
    effect: { zh: "效果 · 社会证明", en: "Effect · Social Proof", id: "Efek · Bukti Sosial" },
    cta: { zh: "CTA · 行动号召", en: "CTA · Call to Action", id: "CTA · Ajakan Bertindak" }
  };
  const CTA_TEMPLATES = {
    zh: ["点击下方链接，现在就给宝宝安排上！","链接就在下面，手慢就没了！","想要同款？点击购物车，今天下单还有优惠！","赶紧戳链接，给宝宝最好的！","现在下单立享优惠，别犹豫！","点击下方黄色购物车，直接下单！","库存有限，卖完就没了！赶紧冲！","妈妈们赶紧囤起来，错过要等很久！"],
    en: ["Click the link below and get it for your baby now!","Link is right there — grab it before it's gone!","Want the same? Tap the cart — special price today!","Tap the link and give your baby the best!","Order now and enjoy the special offer!","Tap the yellow cart below — order directly!","Limited stock — once it's gone, it's GONE!","Moms, stock up now — you'll have to wait a long time if you miss it!"],
    id: ["Klik link di bawah, beli sekarang untuk si kecil!","Linknya ada di bawah — cepat sebelum habis!","Mau yang sama? Klik keranjang — harga spesial hari ini!","Klik linknya, berikan yang terbaik untuk anak!","Pesan sekarang dan nikmati penawaran spesial!","Klik keranjang kuning di bawah — langsung pesan!","Stok terbatas — kalau habis ya habis!","Ibu-ibu, borong sekarang — kalau kelewat nunggu lama!"]
  };
  const EFFECT_TEMPLATES = {
    zh: ["用了之后宝宝皮肤明显改善，摸起来滑滑嫩嫩的！很多妈妈都回购了。","坚持用一周，效果看得见！宝宝自己都觉得舒服。","身边妈妈用了都说好，回购率超高！","用完一瓶就能感受到区别，宝宝皮肤状态肉眼可见变好。","评论区看看妈妈们的反馈，真的一致好评！"],
    en: ["After using it, baby's skin improved noticeably — smooth and soft! So many moms repurchased.","Use it for a week and see the difference! Even baby feels more comfortable.","Moms around me all say it's great — super high repurchase rate!","One bottle and you'll see the change — baby's skin visibly improves.","Check the comments — moms are giving nothing but 5 stars!"],
    id: ["Setelah pakai, kulit anak jelas membaik — halus dan lembut! Banyak ibu yang beli lagi.","Pakai seminggu dan lihat perbedaannya! Anak pun merasa lebih nyaman.","Ibu-ibu di sekitar saya semua bilang bagus — tingkat pembelian ulang sangat tinggi!","Satu botol dan kamu bisa lihat perubahannya — kulit anak membaik terlihat jelas.","Cek kolom komentar — ibu-ibu kasih bintang 5 semua!"]
  };

  /* === STATE === */
  let PRODUCTS = [...DEFAULT_PRODUCTS];
  let state = { product: null, videoType: null, duration: null, outputLang: "zh", generated: null };
  const STORAGE_KEYS = { HISTORY: "cuscus_script_history", CUSTOM_PRODUCTS: "cuscus_custom_products" };

  /* === STORAGE === */
  function loadCustomProducts() { try { const d = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRODUCTS); if (d) PRODUCTS = [...DEFAULT_PRODUCTS, ...JSON.parse(d)]; } catch(e){} }
  function saveCustomProducts() { localStorage.setItem(STORAGE_KEYS.CUSTOM_PRODUCTS, JSON.stringify(PRODUCTS.filter(p => p.custom))); }
  function loadHistory() { try { const d = localStorage.getItem(STORAGE_KEYS.HISTORY); return d ? JSON.parse(d) : []; } catch(e) { return []; } }
  function saveHistory(entry) { const h = loadHistory(); h.unshift(entry); if (h.length > 50) h.length = 50; localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(h)); }
  function clearHistory() { localStorage.removeItem(STORAGE_KEYS.HISTORY); }

  /* === HELPERS === */
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function pickN(arr, n) { return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length)); }
  function getLang() { return localStorage.getItem("lang") || "zh"; }
  function escHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function fmtDate(d) { return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+" "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"); }
  function showToast(msg) { let t = document.querySelector(".toast"); if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t);} t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2000); }

  /* === RENDER === */
  function renderProducts() {
    const grid = document.getElementById("productGrid"), uiLang = getLang();
    grid.innerHTML = PRODUCTS.map(p => {
      const info = uiLang === "en" ? p.en : p.zh, sel = state.product === p.id ? " selected" : "";
      const badge = p.custom ? `<span class="custom-badge">${uiLang==="en"?"Custom":"自定义"}</span>` : "";
      return `<div class="product-card${sel}" data-id="${p.id}"><span class="product-icon">${p.icon}</span><div class="product-name">${escHtml(info.name)}</div><div class="product-name-sub">${escHtml(info.sub||"")}</div>${badge}</div>`;
    }).join("");
    grid.querySelectorAll(".product-card").forEach(c => c.addEventListener("click", () => { state.product = c.dataset.id; renderProducts(); renderRefCard(); }));
  }
  function renderVideoTypes() {
    const row = document.getElementById("videoTypeRow"), uiLang = getLang();
    row.innerHTML = VIDEO_TYPES.map(vt => { const info = uiLang==="en"?vt.en:vt.zh, sel = state.videoType===vt.id?" selected":""; return `<button class="option-btn${sel}" data-id="${vt.id}"><span class="opt-icon">${vt.icon}</span>${escHtml(info.name)}<span class="opt-desc">${escHtml(info.desc)}</span></button>`; }).join("");
    row.querySelectorAll(".option-btn").forEach(b => b.addEventListener("click", () => { state.videoType = b.dataset.id; renderVideoTypes(); }));
  }
  function renderDurations() {
    const row = document.getElementById("durationRow"), uiLang = getLang();
    row.innerHTML = DURATIONS.map(d => { const info = uiLang==="en"?d.en:d.zh, sel = state.duration===d.id?" selected":""; return `<button class="option-btn${sel}" data-id="${d.id}">${escHtml(info.name)}<span class="opt-desc">${escHtml(info.desc)}</span></button>`; }).join("");
    row.querySelectorAll(".option-btn").forEach(b => b.addEventListener("click", () => { state.duration = b.dataset.id; renderDurations(); }));
  }
  function renderRefCard() {
    const card = document.getElementById("refCard");
    if (!state.product) { card.style.display = "none"; return; }
    const p = PRODUCTS.find(x => x.id === state.product);
    if (!p) { card.style.display = "none"; return; }
    card.style.display = "block";
    const uiLang = getLang(), name = uiLang==="en"?p.en.name:p.zh.name;
    const L = { pains: uiLang==="en"?"Pain Points":"痛点库", points: uiLang==="en"?"Selling Points":"卖点库", hooks: uiLang==="en"?"Hook Ideas":"Hook参考", warn: uiLang==="en"?"Compliance Note":"合规提醒" };
    const cnt = uiLang==="en" ? `${p.pains.zh.length} pains · ${p.points.zh.length} points · ${p.hooks.zh.length} hooks` : `${p.pains.zh.length}条痛点 · ${p.points.zh.length}条卖点 · ${p.hooks.zh.length}条Hook`;
    const delBtn = p.custom ? `<br><button class="ghost delete-product-btn" data-id="${p.id}" style="margin-top:8px;font-size:0.78rem;color:var(--danger)">${uiLang==="en"?"Delete this product":"删除此产品"}</button>` : "";
    card.innerHTML = `<div class="ref-title">${p.icon} ${escHtml(name)} <span class="ref-count">${cnt}</span></div>
      <div class="ref-section"><div class="ref-section-title">${L.pains}</div><div class="ref-tags">${p.pains.zh.map(x=>`<span class="ref-tag">${escHtml(x)}</span>`).join("")}</div></div>
      <div class="ref-section"><div class="ref-section-title">${L.points}</div><div class="ref-tags">${p.points.zh.map(x=>`<span class="ref-tag">${escHtml(x)}</span>`).join("")}</div></div>
      <div class="ref-section"><div class="ref-section-title">${L.hooks}</div><div class="ref-tags">${p.hooks.zh.map(x=>`<span class="ref-tag">${escHtml(x)}</span>`).join("")}</div></div>
      <div class="ref-warn">⚠️ ${L.warn}：${escHtml(p.warn[uiLang==="en"?"en":"zh"])}${delBtn}</div>`;
    const del = card.querySelector(".delete-product-btn");
    if (del) del.addEventListener("click", () => { if(!confirm(uiLang==="en"?"Delete this custom product?":"确认删除此自定义产品？"))return; PRODUCTS=PRODUCTS.filter(x=>x.id!==del.dataset.id); saveCustomProducts(); state.product=null; renderProducts(); renderRefCard(); });
  }

  /* === GENERATE === */
  function generateScript() {
    const p = PRODUCTS.find(x=>x.id===state.product), dur = DURATIONS.find(x=>x.id===state.duration), vType = state.videoType;
    const promo = document.getElementById("promoInput").value.trim(), extra = document.getElementById("extraInput").value.trim(), customHook = document.getElementById("hookInput").value.trim();
    const scripts = {};
    ["zh","en","id"].forEach(lang => {
      const hook = customHook || pick(p.hooks[lang]), pain = pick(p.pains[lang]);
      const points = pickN(p.points[lang], dur.id==="15s"?1:dur.id==="30s"?2:3);
      const cta = pick(CTA_TEMPLATES[lang]), dirs = DIRECTIONS[vType]?DIRECTIONS[vType][lang]:DIRECTIONS.oral[lang];
      let productText = points.join(lang==="zh"?"，":", "); if(extra) productText += (lang==="zh"?"，":", ")+extra;
      const effectText = pick(EFFECT_TEMPLATES[lang]);
      let ctaText = promo ? promo+(lang==="zh"?"！":"! ")+cta : cta;
      scripts[lang] = { hook:{text:hook,direction:dirs.hook,timing:dur.timing.hook}, pain:{text:pain,direction:dirs.pain,timing:dur.timing.pain}, product:{text:productText,direction:dirs.product,timing:dur.timing.product}, effect:{text:effectText,direction:dirs.effect,timing:dur.timing.effect}, cta:{text:ctaText,direction:dirs.cta,timing:dur.timing.cta} };
    });
    state.generated = scripts;
    saveHistory({ time:new Date().toISOString(), productId:state.product, productName:p.zh.name, videoType:state.videoType, duration:state.duration, promo, extra, customHook, scripts });
  }

  /* === RENDER OUTPUT === */
  function renderOutput() {
    const section = document.getElementById("outputSection");
    if(!state.generated){section.style.display="none";return;} section.style.display="block";
    const p=PRODUCTS.find(x=>x.id===state.product), dur=DURATIONS.find(x=>x.id===state.duration), vt=VIDEO_TYPES.find(x=>x.id===state.videoType), lang=state.outputLang;
    const pName=lang==="en"?p.en.name:lang==="id"?p.id_.name:p.zh.name, vtName=lang==="en"?vt.en.name:lang==="id"?vt.id_.name:vt.zh.name, durName=lang==="en"?dur.en.name:lang==="id"?dur.id_.name:dur.zh.name;
    document.getElementById("scriptMeta").innerHTML = `<span class="meta-tag product">${p.icon} ${escHtml(pName)}</span><span class="meta-tag type">${vt.icon} ${escHtml(vtName)}</span><span class="meta-tag duration">⏱ ${escHtml(durName)}</span>`;
    const script=state.generated[lang]; const segs=["hook","pain","product","effect","cta"];
    document.getElementById("scriptBody").innerHTML = segs.map(seg => { const s=script[seg], label=SEG_LABELS[seg][lang]||SEG_LABELS[seg].zh; return `<div class="script-segment ${seg}"><div class="seg-label">${label}<span class="seg-timing">${s.timing}</span></div><div class="seg-text">${escHtml(s.text)}</div><div class="seg-direction">${escHtml(s.direction)}</div></div>`; }).join("");
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.toggle("active",b.dataset.tab===lang));
    section.scrollIntoView({behavior:"smooth",block:"start"});
  }

  /* === COPY === */
  function buildPlainText(scripts,lang,pObj,vtObj,durObj) {
    const pN=lang==="en"?pObj.en.name:lang==="id"?pObj.id_.name:pObj.zh.name, vtN=lang==="en"?vtObj.en.name:lang==="id"?vtObj.id_.name:vtObj.zh.name, durN=lang==="en"?durObj.en.name:lang==="id"?durObj.id_.name:durObj.zh.name;
    let t=`📋 ${pN} | ${vtN} | ${durN}\n${"─".repeat(30)}\n\n`;
    ["hook","pain","product","effect","cta"].forEach(seg=>{const s=scripts[lang][seg],label=SEG_LABELS[seg][lang]||SEG_LABELS[seg].zh;t+=`【${label}】(${s.timing})\n${s.text}\n📌 ${s.direction}\n\n`;});
    return t;
  }
  function copyScript() {
    if(!state.generated)return;
    const p=PRODUCTS.find(x=>x.id===state.product),dur=DURATIONS.find(x=>x.id===state.duration),vt=VIDEO_TYPES.find(x=>x.id===state.videoType);
    navigator.clipboard.writeText(buildPlainText(state.generated,state.outputLang,p,vt,dur)).then(()=>showToast(getLang()==="en"?"Copied!":"已复制到剪贴板！")).catch(()=>showToast("Copy failed"));
  }

  /* === HISTORY === */
  function renderHistory() {
    const panel=document.getElementById("historyPanel"), history=loadHistory(), uiLang=getLang();
    if(history.length===0){panel.innerHTML=`<p style="text-align:center;color:var(--muted)">${uiLang==="en"?"No scripts generated yet":"暂无生成记录"}</p>`;return;}
    let html=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span class="ref-count">${uiLang==="en"?history.length+" records":"共"+history.length+"条记录"}</span><button class="ghost" id="clearHistoryBtn" style="font-size:0.78rem;color:var(--danger)">${uiLang==="en"?"Clear All":"清空记录"}</button></div><div class="history-list">`;
    history.slice(0,20).forEach((entry,idx)=>{
      const d=new Date(entry.time), vtObj=VIDEO_TYPES.find(x=>x.id===entry.videoType), vtIcon=vtObj?vtObj.icon:"📄", vtName=vtObj?(uiLang==="en"?vtObj.en.name:vtObj.zh.name):entry.videoType;
      html+=`<div class="history-item"><div class="history-meta"><span>${vtIcon} ${escHtml(entry.productName)} · ${escHtml(vtName)} · ${entry.duration}</span><span class="history-time">${fmtDate(d)}</span></div><div class="history-preview">${escHtml((entry.scripts.zh.hook.text||"").substring(0,50))}...</div><div class="history-actions"><button class="ghost hist-copy-btn" data-idx="${idx}">${uiLang==="en"?"Copy ZH":"复制中文"}</button><button class="ghost hist-copy-btn" data-idx="${idx}" data-lang="en">Copy EN</button><button class="ghost hist-copy-btn" data-idx="${idx}" data-lang="id">Copy ID</button></div></div>`;
    });
    html+=`</div>`; panel.innerHTML=html;
    document.getElementById("clearHistoryBtn")?.addEventListener("click",()=>{if(!confirm(uiLang==="en"?"Clear all history?":"确认清空所有记录？"))return;clearHistory();renderHistory();});
    panel.querySelectorAll(".hist-copy-btn").forEach(btn=>{btn.addEventListener("click",()=>{
      const entry=history[parseInt(btn.dataset.idx)],lang=btn.dataset.lang||"zh";
      const p=PRODUCTS.find(x=>x.id===entry.productId)||{zh:{name:entry.productName},en:{name:entry.productName},id_:{name:entry.productName},icon:"📦"};
      const vt=VIDEO_TYPES.find(x=>x.id===entry.videoType)||VIDEO_TYPES[0], dur=DURATIONS.find(x=>x.id===entry.duration)||DURATIONS[0];
      navigator.clipboard.writeText(buildPlainText(entry.scripts,lang,p,vt,dur)).then(()=>showToast(getLang()==="en"?"Copied!":"已复制！")).catch(()=>showToast("Failed"));
    });});
  }

  /* === CUSTOM PRODUCT MODAL === */
  function showAddProductModal() {
    const uiLang=getLang(), overlay=document.createElement("div"); overlay.className="modal-overlay";
    const lbl=(zh,en)=>uiLang==="en"?en:zh;
    overlay.innerHTML=`<div class="modal-card"><h2>${lbl("添加自定义产品","Add Custom Product")}</h2><div class="modal-form">
      <div class="input-group"><label>${lbl("产品名称（中文）*","Product Name (CN)*")}</label><input type="text" id="cp_zh" class="search" /></div>
      <div class="input-group"><label>${lbl("产品名称（英文）","Product Name (EN)")}</label><input type="text" id="cp_en" class="search" /></div>
      <div class="input-group"><label>${lbl("产品名称（印尼语）","Product Name (ID)")}</label><input type="text" id="cp_id" class="search" /></div>
      <div class="input-group"><label>Icon (emoji)</label><input type="text" id="cp_icon" class="search" value="📦" maxlength="4" /></div>
      <div class="input-group"><label>${lbl("痛点（中文，每行一条）*","Pain Points (CN, one per line)*")}</label><textarea id="cp_pains_zh" class="search" rows="4"></textarea></div>
      <div class="input-group"><label>${lbl("痛点（英文）","Pain Points (EN)")}</label><textarea id="cp_pains_en" class="search" rows="4"></textarea></div>
      <div class="input-group"><label>${lbl("痛点（印尼语）","Pain Points (ID)")}</label><textarea id="cp_pains_id" class="search" rows="4"></textarea></div>
      <div class="input-group"><label>${lbl("卖点（中文）*","Selling Points (CN)*")}</label><textarea id="cp_points_zh" class="search" rows="4"></textarea></div>
      <div class="input-group"><label>${lbl("卖点（英文）","Selling Points (EN)")}</label><textarea id="cp_points_en" class="search" rows="4"></textarea></div>
      <div class="input-group"><label>${lbl("卖点（印尼语）","Selling Points (ID)")}</label><textarea id="cp_points_id" class="search" rows="4"></textarea></div>
      <div class="input-group"><label>${lbl("Hook（中文）*","Hooks (CN)*")}</label><textarea id="cp_hooks_zh" class="search" rows="3"></textarea></div>
      <div class="input-group"><label>${lbl("Hook（英文）","Hooks (EN)")}</label><textarea id="cp_hooks_en" class="search" rows="3"></textarea></div>
      <div class="input-group"><label>${lbl("Hook（印尼语）","Hooks (ID)")}</label><textarea id="cp_hooks_id" class="search" rows="3"></textarea></div>
      <div class="input-group"><label>${lbl("合规提醒","Compliance Warning")}</label><input type="text" id="cp_warn" class="search" /></div>
    </div><div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px"><button class="ghost" id="cpCancel">${lbl("取消","Cancel")}</button><button class="upload-btn" id="cpSave" style="padding:10px 24px">${lbl("保存产品","Save Product")}</button></div></div>`;
    document.body.appendChild(overlay);
    const lines=id=>document.getElementById(id).value.split("\n").map(s=>s.trim()).filter(Boolean);
    document.getElementById("cpCancel").addEventListener("click",()=>overlay.remove());
    overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.remove();});
    document.getElementById("cpSave").addEventListener("click",()=>{
      const zhN=document.getElementById("cp_zh").value.trim(),enN=document.getElementById("cp_en").value.trim(),idN=document.getElementById("cp_id").value.trim();
      if(!zhN){showToast(lbl("请填写产品名称","Name required"));return;}
      const pZ=lines("cp_pains_zh"),ptZ=lines("cp_points_zh"),hZ=lines("cp_hooks_zh");
      if(!pZ.length||!ptZ.length||!hZ.length){showToast(lbl("痛点、卖点、Hook至少各填一条","Need at least 1 pain, point, and hook"));return;}
      const np={id:"custom_"+Date.now(),icon:document.getElementById("cp_icon").value.trim()||"📦",custom:true,
        zh:{name:zhN,sub:enN},en:{name:enN||zhN,sub:""},id_:{name:idN||enN||zhN,sub:""},
        pains:{zh:pZ,en:lines("cp_pains_en").length?lines("cp_pains_en"):pZ,id:lines("cp_pains_id").length?lines("cp_pains_id"):pZ},
        points:{zh:ptZ,en:lines("cp_points_en").length?lines("cp_points_en"):ptZ,id:lines("cp_points_id").length?lines("cp_points_id"):ptZ},
        hooks:{zh:hZ,en:lines("cp_hooks_en").length?lines("cp_hooks_en"):hZ,id:lines("cp_hooks_id").length?lines("cp_hooks_id"):hZ},
        warn:{zh:document.getElementById("cp_warn").value.trim()||"请注意合规",en:document.getElementById("cp_warn").value.trim()||"Check compliance",id:document.getElementById("cp_warn").value.trim()||"Perhatikan kepatuhan"}};
      PRODUCTS.push(np); saveCustomProducts(); renderProducts(); overlay.remove(); showToast(lbl("产品已添加！","Product added!"));
    });
  }

  /* === BATCH EXPORT CSV === */
  function batchExport() {
    const uiLang=getLang();
    if(!state.product){showToast(uiLang==="en"?"Select a product first":"请先选择产品");return;}
    const count=Math.min(Math.max(parseInt(document.getElementById("batchCount")?.value)||5,1),30);
    const p=PRODUCTS.find(x=>x.id===state.product), vType=state.videoType||"oral", dur=DURATIONS.find(x=>x.id===(state.duration||"30s")), vt=VIDEO_TYPES.find(x=>x.id===vType);
    const promo=document.getElementById("promoInput").value.trim(), extra=document.getElementById("extraInput").value.trim();
    const headers=["#","Product","Type","Duration","Lang","Hook","Hook_Direction","Pain","Pain_Direction","Product_Points","Product_Direction","Effect","Effect_Direction","CTA","CTA_Direction"];
    let csv="\uFEFF"+headers.join(",")+"\n"; let num=1;
    for(let i=0;i<count;i++){["zh","en","id"].forEach(lang=>{
      const hook=pick(p.hooks[lang]),pain=pick(p.pains[lang]),points=pickN(p.points[lang],dur.id==="15s"?1:dur.id==="30s"?2:3),cta=pick(CTA_TEMPLATES[lang]),dirs=DIRECTIONS[vType]?DIRECTIONS[vType][lang]:DIRECTIONS.oral[lang],effect=pick(EFFECT_TEMPLATES[lang]);
      let productText=points.join(lang==="zh"?"，":", ");if(extra)productText+=(lang==="zh"?"，":", ")+extra;
      let ctaText=promo?promo+(lang==="zh"?"！":"! ")+cta:cta;
      const pN=lang==="en"?p.en.name:lang==="id"?p.id_.name:p.zh.name, vtN=lang==="en"?vt.en.name:lang==="id"?vt.id_.name:vt.zh.name, durN=lang==="en"?dur.en.name:lang==="id"?dur.id_.name:dur.zh.name;
      csv+=[num,pN,vtN,durN,lang.toUpperCase(),hook,dirs.hook,pain,dirs.pain,productText,dirs.product,effect,dirs.effect,ctaText,dirs.cta].map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")+"\n";num++;
    });}
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`scripts_${p.id}_${vType}_${dur.id}_x${count}.csv`;a.click();URL.revokeObjectURL(url);
    showToast(uiLang==="en"?`Exported ${count*3} scripts!`:`已导出${count*3}条脚本！`);
  }

  /* === EVENTS === */
  function bindEvents() {
    document.getElementById("generateBtn").addEventListener("click",()=>{if(!state.product||!state.videoType||!state.duration){showToast(getLang()==="en"?"Please select product, type, and duration":"请先选择产品、视频类型和时长");return;}generateScript();state.outputLang="zh";renderOutput();renderHistory();});
    document.getElementById("copyBtn").addEventListener("click",copyScript);
    document.getElementById("regenerateBtn").addEventListener("click",()=>{if(!state.product||!state.videoType||!state.duration)return;generateScript();renderOutput();renderHistory();});
    document.querySelectorAll(".tab-btn").forEach(b=>b.addEventListener("click",()=>{state.outputLang=b.dataset.tab;renderOutput();}));
    document.getElementById("addProductBtn").addEventListener("click",showAddProductModal);
    document.getElementById("batchExportBtn").addEventListener("click",batchExport);
    const btt=document.getElementById("btt");
    window.addEventListener("scroll",()=>btt.classList.toggle("show",window.scrollY>400));
    btt.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
    document.addEventListener("langchange",()=>{renderProducts();renderVideoTypes();renderDurations();renderRefCard();renderHistory();if(state.generated)renderOutput();});
  }

  /* === INIT === */
  function init(){loadCustomProducts();renderProducts();renderVideoTypes();renderDurations();renderHistory();bindEvents();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
