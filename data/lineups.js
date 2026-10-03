// 道具点位与进点技巧库
// 文字打法为通用经验总结（原创整理）；教学视频一律以链接方式跳转到 B 站原页面并标注 UP 主出处，
// 版权归原 UP 主所有，本工具不存储不转载任何视频内容。
// video 字段由采集流程回填：{ title, author, url, bvid }，无视频时为 null。
const LINEUPS = [
  // ================= 亚海悬城 =================
  { id: "lu-ascent-1", map: "亚海悬城", agent: "幽影", type: "烟雾",
    title: "A 点进攻双烟：封“市场”与“天台”",
    desc: "进攻 A 点的关键不是封点位本身，而是封守卫方的架枪视野。常规做法：一颗烟封市场窗（切断从小道方向回防的枪线），一颗烟封天台边缘（让 A 主的守卫失去高位视野），中间留给队友从 A 主拉出来对枪。烟雾要贴着烟墙外沿落，给进点队友留出贴墙走的通道。",
    video: null },
  { id: "lu-ascent-2", map: "亚海悬城", agent: "猎枭", type: "侦查",
    title: "B 点先手侦察箭：枪线预热",
    desc: "进 B 点前先从中路广场朝 B 点内部斜上方向射侦察箭，箭的落点选在箱子后与墓碑位之间——这两个是守卫方最常用的架枪点。看到人之后不要急着冲，先报点，让狙击手先拿一次对枪机会。",
    video: null },
  { id: "lu-ascent-3", map: "亚海悬城", agent: null, type: "进点技巧",
    title: "中路控制 = 半张地图",
    desc: "亚海悬城的中路是全图节奏核心：拿下中路就可以快速转 A 或转 B，守卫方则会被迫分兵。进中路的标准节奏：道具先行清“市场窗口”和“猫屋”，两人架枪线，两人从瓷砖间推进。拿完中路先卡转点口，再决定打哪边——不要拿完就立刻冲点。",
    video: null },

  // ================= 源工重镇 =================
  { id: "lu-bind-1", map: "源工重镇", agent: "蝰蛇", type: "烟雾",
    title: "A 点蝰蛇毒墙：一分为二",
    desc: "A 大进点时把毒墙立在“淋浴间”门口，直接把 A 点切成两半：守卫方在 A 点内的防守位和回防通道被隔开，进攻方只需要处理墙这一侧。毒墙持续时间长，进点后优先清近侧，远侧等墙散了再打。",
    video: null },
  { id: "lu-bind-2", map: "源工重镇", agent: null, type: "进点技巧",
    title: "传送门的心理战",
    desc: "源工重镇的两条传送门（B 长廊门、A 洗手间门）核心价值是制造人数差：门开的声音会让守卫方误判主攻方向。常用套路——三人 A 大慢慢推，一人开门假打 B，守卫回防一半时真打 A。反过来守卫方也可以用门的音效做假回防。",
    video: null },

  // ================= 隐世修所 =================
  { id: "lu-haven-1", map: "隐世修所", agent: "星礈", type: "烟雾",
    title: "三包点地图的双烟开团",
    desc: "隐世修所三个包点，守卫方人手分散，进攻方要用双烟同时“关掉”一个点的两架枪线。以 A 点为例：一颗烟封 A 长的窗户位，一颗烟封 A 短的天井位，剩下正面留给队友拉枪线。星礈的烟雾可以放得很远，站在出生点就能完成布烟。",
    video: null },
  { id: "lu-haven-2", map: "隐世修所", agent: "猎枭", type: "侦查",
    title: "C 长廊侦察箭清“车库角”",
    desc: "C 长是最容易蹲人的长走廊。进 C 长前朝车库角方向射一发电弧箭，能同时探到车库角和箱子后两个点位。箭响之后数 1.5 秒再拉出去——先让敌人听见箭响开枪暴露位置。",
    video: null },

  // ================= 莲华古城 =================
  { id: "lu-lotus-1", map: "莲华古城", agent: null, type: "进点技巧",
    title: "三个包点的“开门石”博弈",
    desc: "莲华古城 A/C 点都有可破坏的门。进攻方开门会暴露意图（全场都听得到），所以常用节奏是：先假装打另一侧，等守卫站位偏向后再回身破门。破门后门板消失会形成新的枪线，双方都要重新适应。",
    video: null },
  { id: "lu-lotus-2", map: "莲华古城", agent: "幽影", type: "烟雾",
    title: "B 点单烟双用",
    desc: "B 点中央的巨石是天然的分割线。幽影的烟可以立在石头上方——同时遮蔽石头两侧的视野，一颗烟当两颗用。进攻方用它掩护进点，守卫方回防时用它切断进攻方的 crossfire（交叉火线）。",
    video: null },

  // ================= 霓虹町 =================
  { id: "lu-split-1", map: "霓虹町", agent: null, type: "进点技巧",
    title: "绳子与滑索的快速转点",
    desc: "霓虹町 A/B 两点都有绳子通道，攻守互换速度极快。进攻打 A 时安排一人听 B 区绳子音效——守卫方从 B 绳回防需要 5 秒以上，那是转 A 的窗口。反之守卫方听到 A 区交火不要全员回防，留一人防转 B。",
    video: null },
  { id: "lu-split-2", map: "霓虹町", agent: "铁臂", type: "闪光",
    title: "A 点墙体震爆弹开点",
    desc: "铁臂的震爆弹可以穿墙引爆。打 A 点时从 A 主对准墙体内侧放双震爆——第一发清“海报位”，第二发清“箱子后”，队友数着爆炸间隔跟进。震爆弹命中会震晕+浮空，是全游戏最强的进点道具之一。",
    video: null },

  // ================= 森寒冬港 =================
  { id: "lu-icebox-1", map: "森寒冬港", agent: null, type: "进点技巧",
    title: "垂直维度的搜点顺序",
    desc: "森寒冬港是全游戏立体感最强的地图：管子、天台、地下三层空间。进点口诀是“先清上再清下”——高位架枪点（黄桶、天台）威胁远大于平地。每人负责一层视角，进点时不要所有人挤在同层。",
    video: null },
  { id: "lu-icebox-2", map: "森寒冬港", agent: "海神", type: "烟雾",
    title: "B 点毒墙封“黄桶”",
    desc: "B 点的黄桶位是最高危的高位架枪点。海神的毒墙从 B 主立起来可以恰好横在黄桶高度——墙的高度是可调的，把墙“顶”在桶位视野上，队友就能安全进点。墙散后第一时间清桶，因为守卫一定会回那里。",
    video: null },

  // ================= 日落之城 =================
  { id: "lu-sunset-1", map: "日落之城", agent: null, type: "进点技巧",
    title: "中路市场的控制权",
    desc: "日落之城的中路市场连接 A/B 两翼，还有一扇可破坏门。进攻方控市场 = 掌握转点主动权；标准节奏是道具清“市场窗”→ 双人架枪 → 门后留一人听回防。守卫方则要在门被打开前，用道具消耗进攻方的进点节奏。",
    video: null },

  // ================= 微风岛屿 =================
  { id: "lu-breeze-1", map: "微风岛屿", agent: "星礈", type: "烟雾",
    title: "A 点大范围封烟：先用“新星脉冲”再落烟",
    desc: "微风岛屿开阔、枪线长，烟雾要封“线”而不是封“点”。A 点进攻时先用星礈的新星脉冲逼退架枪位（脉冲把人吸住无法开枪），再把烟雾落在长枪线上，队友贴着烟沿进点。",
    video: null },

  // ================= 通用原则 =================
  { id: "lu-generic-1", map: "通用", agent: null, type: "进点技巧",
    title: "进点三原则：道具先行 / 分层搜点 / 交叉火线",
    desc: "①道具先行：烟雾/闪光/侦查永远先于人的脚步，逼敌人先暴露；②分层搜点：进点后按“高位→箱后→门角”顺序清点，每人负责一个视角，不重复不遗漏；③交叉火线：进点后立刻形成前后照应的两个枪线位，任何一侧被打，另一侧立刻补枪。",
    video: null },
  { id: "lu-generic-2", map: "通用", agent: null, type: "进点技巧",
    title: "残局 1vX：拖时间 > 拼枪",
    desc: "包已下则守包听脚步，拆包声音是最好的“闪光弹”；包未下则不轻易现身，利用地图音效（门、绳子、传送门）制造假信息。残局每一秒都在给对手施加压力，先犯错的人输。",
    video: null },
];

// ===== B 站教学视频出处（采集员逐条经 bilibili API 校验 BV 号有效，2026-10-03 采集）=====
// 版权归原 UP 主所有，本工具仅以链接跳转原页面，不存储不转载视频内容。
const LINEUP_VIDEOS = [
 {
  "map": "亚海悬城",
  "title": "亚海悬城穿墙点位整整30个 无畏契约新手穿墙教学",
  "author": "无畏战术大师兄",
  "bvid": "BV1Qh7C6XEVx",
  "url": "https://www.bilibili.com/video/BV1Qh7C6XEVx",
  "play": 1154967,
  "topic": "道具点位"
 },
 {
  "map": "亚海悬城",
  "title": "亚海悬城猎枭道具点位 无畏契约新手猎枭教学 猎枭秒杀箭点位",
  "author": "无畏战术大师兄",
  "bvid": "BV1bk5S6ZELE",
  "url": "https://www.bilibili.com/video/BV1bk5S6ZELE",
  "play": 260481,
  "topic": "侦查道具点位"
 },
 {
  "map": "亚海悬城",
  "title": "亚海悬城奇乐进攻方道具思路教学",
  "author": "Ys秀一丶",
  "bvid": "BV1UCVn66EVT",
  "url": "https://www.bilibili.com/video/BV1UCVn66EVT",
  "play": 212521,
  "topic": "进点技巧"
 },
 {
  "map": "源工重镇",
  "title": "源工重镇保安点位 无畏契约哨位零保安摄像头拌线单向烟教学",
  "author": "无畏战术大师兄",
  "bvid": "BV1KAuEziE9m",
  "url": "https://www.bilibili.com/video/BV1KAuEziE9m",
  "play": 539810,
  "topic": "烟雾点位"
 },
 {
  "map": "源工重镇",
  "title": "源工重镇奶妈阴间冰墙点位教学",
  "author": "九鹤-无畏契约手游",
  "bvid": "BV1qqAhzuEuK",
  "url": "https://www.bilibili.com/video/BV1qqAhzuEuK",
  "play": 381501,
  "topic": "道具点位"
 },
 {
  "map": "源工重镇",
  "title": "源工重镇奇乐A包点防守道具思路教学",
  "author": "Ys秀一丶",
  "bvid": "BV1CXGNzvEJ1",
  "url": "https://www.bilibili.com/video/BV1CXGNzvEJ1",
  "play": 238577,
  "topic": "进点技巧"
 },
 {
  "map": "隐世修所",
  "title": "隐世修所钢锁教学 无畏契约钢索道具点位 钢索大招",
  "author": "无畏战术大师兄",
  "bvid": "BV1fXF3z1ELt",
  "url": "https://www.bilibili.com/video/BV1fXF3z1ELt",
  "play": 496768,
  "topic": "道具点位"
 },
 {
  "map": "隐世修所",
  "title": "5分钟教你玩转隐世修所的进攻，进攻战术解析与爆弹执行",
  "author": "大东彦",
  "bvid": "BV1p94y1e7f4",
  "url": "https://www.bilibili.com/video/BV1p94y1e7f4",
  "play": 167581,
  "topic": "烟雾点位"
 },
 {
  "map": "隐世修所",
  "title": "隐世修所KO道具点位 无畏契约新手KO教学 KO单向闪瞬爆闪点位",
  "author": "无畏战术大师兄",
  "bvid": "BV11KZZB2EMR",
  "url": "https://www.bilibili.com/video/BV11KZZB2EMR",
  "play": 136664,
  "topic": "闪光点位"
 },
 {
  "map": "莲华古城",
  "title": "【无畏契约】猎枭|sova—无敌猎枭王 莲花古城/莲华古城 全点位寻敌探测箭 Valorant 瓦罗兰特",
  "author": "无敌猎枭王",
  "bvid": "BV1ou411A7LQ",
  "url": "https://www.bilibili.com/video/BV1ou411A7LQ",
  "play": 733490,
  "topic": "侦查道具点位"
 },
 {
  "map": "莲华古城",
  "title": "莲华古城黑梦诡眼点位 无畏契约新手黑梦教学",
  "author": "无畏战术大师兄",
  "bvid": "BV1KaRhBNEzu",
  "url": "https://www.bilibili.com/video/BV1KaRhBNEzu",
  "play": 206961,
  "topic": "道具点位"
 },
 {
  "map": "莲华古城",
  "title": "莲华古城正确C大包",
  "author": "露白不白",
  "bvid": "BV1Ajen6QErh",
  "url": "https://www.bilibili.com/video/BV1Ajen6QErh",
  "play": 103793,
  "topic": "进点技巧"
 },
 {
  "map": "霓虹町",
  "title": "无畏契约全地图教学——霓虹町（上），防守思路与选位全解",
  "author": "大东彦",
  "bvid": "BV1Fz4y1q71y",
  "url": "https://www.bilibili.com/video/BV1Fz4y1q71y",
  "play": 624319,
  "topic": "烟雾点位"
 },
 {
  "map": "霓虹町",
  "title": "【无畏契约】霓虹町保安单人扛点道具教学",
  "author": "羊尾人无畏契约",
  "bvid": "BV1ku4y1577y",
  "url": "https://www.bilibili.com/video/BV1ku4y1577y",
  "play": 590239,
  "topic": "道具点位"
 },
 {
  "map": "霓虹町",
  "title": "霓虹町KO道具教学 无畏契约KO单向闪探测刀点位",
  "author": "无畏战术大师兄",
  "bvid": "BV1iSBUBoEs9",
  "url": "https://www.bilibili.com/video/BV1iSBUBoEs9",
  "play": 144716,
  "topic": "侦查道具点位"
 },
 {
  "map": "森寒冬港",
  "title": "【无畏契约】森寒冬港蝰蛇道具教学！",
  "author": "约德尔大人",
  "bvid": "BV1zg4y1S7Xh",
  "url": "https://www.bilibili.com/video/BV1zg4y1S7Xh",
  "play": 952626,
  "topic": "道具点位"
 },
 {
  "map": "森寒冬港",
  "title": "【无畏契约】奇乐森寒冬港思路道具教学！",
  "author": "约德尔大人",
  "bvid": "BV1LK42187Px",
  "url": "https://www.bilibili.com/video/BV1LK42187Px",
  "play": 325637,
  "topic": "进点技巧"
 },
 {
  "map": "森寒冬港",
  "title": "【Liquid nAts】烟墙优化/进攻爽摸 森寒冬港Icebox蝰蛇Viper21杀打法解析 无畏契约职业选手第一视角解析",
  "author": "圣诞ChristmasLdw",
  "bvid": "BV1SboxYMEnC",
  "url": "https://www.bilibili.com/video/BV1SboxYMEnC",
  "play": 233661,
  "topic": "烟雾点位"
 },
 {
  "map": "日落之城",
  "title": "【日落之城2.0】全新猎枭/sova探测箭！更快！更强！更丝滑！全地图覆盖！",
  "author": "猎枭绝症柴柴",
  "bvid": "BV1BD421j7N2",
  "url": "https://www.bilibili.com/video/BV1BD421j7N2",
  "play": 483619,
  "topic": "侦查道具点位"
 },
 {
  "map": "日落之城",
  "title": "日落之城KO点位 无畏契约先锋位KO打法教学",
  "author": "无畏战术大师兄",
  "bvid": "BV1FQMMzFEHH",
  "url": "https://www.bilibili.com/video/BV1FQMMzFEHH",
  "play": 314914,
  "topic": "进点技巧"
 },
 {
  "map": "日落之城",
  "title": "日落之城奶妈全点位阴间冰墙教学",
  "author": "九鹤-无畏契约手游",
  "bvid": "BV1LecqzUE1Q",
  "url": "https://www.bilibili.com/video/BV1LecqzUE1Q",
  "play": 284666,
  "topic": "道具点位"
 },
 {
  "map": "微风岛屿",
  "title": "新微风岛屿蝰蛇教学 无畏契约蝰蛇道具点位 无畏契约新手教学",
  "author": "无畏战术大师兄",
  "bvid": "BV1N4rHBzExK",
  "url": "https://www.bilibili.com/video/BV1N4rHBzExK",
  "play": 151665,
  "topic": "道具点位"
 },
 {
  "map": "微风岛屿",
  "title": "【瓦】Breeze微风岛屿elbow真的可以跳上圆柱平台",
  "author": "Anki4o",
  "bvid": "BV1YN411T7Rk",
  "url": "https://www.bilibili.com/video/BV1YN411T7Rk",
  "play": 76386,
  "topic": "进点技巧"
 },
 {
  "map": "微风岛屿",
  "title": "微风岛屿海神道具点位 无畏契约新手烟位教学",
  "author": "无畏战术大师兄",
  "bvid": "BV1XmPzztEBg",
  "url": "https://www.bilibili.com/video/BV1XmPzztEBg",
  "play": 68647,
  "topic": "烟雾点位"
 }
];
