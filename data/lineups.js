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
  // ================= 天枢云阙 =================
  { id: "lu-abyss-1", map: "天枢云阙", agent: "雷兹", type: "闪光",
    title: "把人扔下天际线：边缘处决",
    desc: "天枢云阙是唯一一张“掉出地图即死亡”的地图。雷兹的爆炸包、铁臂的震爆都能把敌人从边缘掀下去——守卫方在包点边缘站位时要刻意收进一个身位，进攻方则要盯着敌人的边缘习惯性走位抓机会。",
    video: null },
  { id: "lu-abyss-2", map: "天枢云阙", agent: "幽影", type: "烟雾",
    title: "越界烟雾：把烟放在“地图外面”",
    desc: "幽影的烟雾可以放到地图边缘之外制造“假视野”——敌人透过烟的边缘判断不了你的真实站位。高位平台（B 点天台）被烟盖住后，进攻方从下方拉出来是安全的。",
    video: null },
  { id: "lu-abyss-3", map: "天枢云阙", agent: null, type: "进点技巧",
    title: "双出生点的合围节奏",
    desc: "天枢云阙和裂变峡谷一样是双侧进攻出生点设计：两侧同时施压可以迫使守卫方分兵，中后期合围一个包点。关键在“同步”——两边交火时间差超过 10 秒，守卫就能逐个支援。",
    video: null },
  { id: "lu-abyss-4", map: "天枢云阙", agent: "猎枭", type: "侦查",
    title: "边缘侦察：只探“会掉下去的位置”",
    desc: "侦察箭优先探包点边缘的架枪位——那里的敌人被震下深渊就是直接减员，价值远高于普通点位的暴露。看到人后让位移英雄跟上，一次配合就是人头加地形双重优势。",
    video: null },

  // ================= 深海明珠 =================
  { id: "lu-pearl-1", map: "深海明珠", agent: "海神", type: "烟雾",
    title: "B 长弧形毒墙：整段遮蔽枪线",
    desc: "深海明珠几乎没有高低差，枪线是纯平面对抗——烟雾的价值在于“封横向枪线”。海神的弧形墙贴着 B 长转角立起来，可以把守卫方整段架点位遮住，队友贴墙推进即可。",
    video: null },
  { id: "lu-pearl-2", map: "深海明珠", agent: "猎枭", type: "侦查",
    title: "中路电弧箭探“喷泉后”",
    desc: "中路是深海明珠的节奏核心。猎枭的电弧箭朝喷泉后方打，覆盖守卫方最常用的两个中路架点。箭响之后先报点再决定打 A 还是打 B——深海明珠的转点距离很长，信息比速度重要。",
    video: null },
  { id: "lu-pearl-3", map: "深海明珠", agent: null, type: "进点技巧",
    title: "无高台地图的枪线原则：水平交叉",
    desc: "没有高台的地图里，架枪位全靠墙面转角。进点后第一时间贴墙，把自己的暴露面控制在一个方向；两人进点保持前后错位，形成水平方向的交叉火线，而不是肩并肩。",
    video: null },

  // ================= 盐海矿镇 =================
  { id: "lu-corrode-1", map: "盐海矿镇", agent: "蝰蛇", type: "烟雾",
    title: "A 区毒墙：切段前后照应",
    desc: "盐海矿镇的 A 区通道窄长，蝰蛇的毒墙立在中段可以直接切断守卫方的前后照应——墙前的队友听不到墙后的动静。进攻方进点后优先清墙这一侧，远侧等毒散。",
    video: null },
  { id: "lu-corrode-2", map: "盐海矿镇", agent: "奇乐", type: "守卫技巧",
    title: "哨戒炮卡“必经转角”高位",
    desc: "奇乐的哨戒炮不要放在敌人一眼看到的位置——卡在必经转角的“高位天花板”上，敌人才会在毫无防备时被打。哨炮响的同时你的枪线应该已经架在同一转角。",
    video: null },
  { id: "lu-corrode-3", map: "盐海矿镇", agent: null, type: "进点技巧",
    title: "新图先学“声音地图”",
    desc: "盐海矿镇的矿车与机械音效会盖住脚步声——这张图里“听声辨位”的可靠性下降，队友报点的权重更高。新图训练期多报点、少赌耳朵。",
    video: null },

  // ================= 裂变峡谷 =================
  { id: "lu-fracture-1", map: "裂变峡谷", agent: "铁臂", type: "闪光",
    title: "双线夹击的震爆配合",
    desc: "裂变峡谷的进攻方从两侧出生。两侧同时施压时，铁臂的震爆弹从两侧墙体内同时引爆——守卫方无论背对哪一侧都会被晃到。震爆后 2 秒是进点的黄金窗口，两边队友要数同一个拍子。",
    video: null },
  { id: "lu-fracture-2", map: "裂变峡谷", agent: "蝰蛇", type: "烟雾",
    title: "B 点毒墙封“回防墙”",
    desc: "B 点的回防通道墙是守卫方支援的必经之路。蝰蛇的毒墙立在这条通道口，等于把守卫方的支援“计时器”暂停——墙存在的 12 秒里，进攻方在包点内是人数均势。",
    video: null },
  { id: "lu-fracture-3", map: "裂变峡谷", agent: null, type: "进点技巧",
    title: "H 型地图的双线夹击",
    desc: "裂变峡谷是 H 型布局：进攻方两侧包夹，守卫方靠滑索快速转点。进攻方的核心思路是“让两边的交火同时响”；守卫方的核心思路是“滑索支援永远留一人在反向”——两边都去就是两边都丢。",
    video: null },

  // ================= 亚海悬城（扩充） =================
  { id: "lu-ascent-4", map: "亚海悬城", agent: "铁臂", type: "闪光",
    title: "B 点穿墙震爆双清“箱子后”",
    desc: "B 点的箱子后是守卫方最爱的蹲点位。铁臂站在 B 主外对墙体放双震爆——第一发清大箱子后，第二发清小箱区，队友数着第二次爆炸的回声同时进点。",
    video: null },
  { id: "lu-ascent-5", map: "亚海悬城", agent: "奇乐", type: "守卫技巧",
    title: "A 点哨戒炮盯“天台回防位”",
    desc: "奇乐的哨戒炮放在 A 点内“天台跳下”的落点方向——敌人从天台回防落地时最容易被打。哨炮本体藏在天台侧沿的后面，敌人落地后才看得见它。",
    video: null },

  // ================= 源工重镇（扩充） =================
  { id: "lu-bind-3", map: "源工重镇", agent: "奇乐", type: "守卫技巧",
    title: "B 点哨戒炮藏“门框上沿”",
    desc: "B 点传送门旁边是进攻方的必经之路。奇乐的哨戒炮贴在门框上沿，敌人进门的第一视角看不到它——哨炮锁定后你就是免费的人头收割机。",
    video: null },
  { id: "lu-bind-4", map: "源工重镇", agent: "蝰蛇", type: "烟雾",
    title: "B 点毒墙封“回防门”",
    desc: "B 点打完包之后，守卫方会从回防门支援。蝰蛇的毒墙直接立在回防门口——守包阶段毒墙的持续伤害会显示敌人位置（墙内有脚印声+掉血提示），是守包的顶级道具。",
    video: null },

  // ================= 隐世修所（扩充） =================
  { id: "lu-haven-3", map: "隐世修所", agent: "铁臂", type: "闪光",
    title: "C 长穿墙震爆清“车库角”",
    desc: "C 长的车库角是隐世修所最经典的蹲点位。铁臂站在 C 长中段对墙体放震爆——穿墙引爆不需要视野，震到之后队友贴墙进点。",
    video: null },
  { id: "lu-haven-4", map: "隐世修所", agent: "奇乐", type: "守卫技巧",
    title: "C 点哨戒炮看“车库门”",
    desc: "C 点车库门是进攻方推 C 长的终点。奇乐的哨戒炮放在车库门内的箱子上——敌人推门进来的第一眼盲区。守 C 点时哨炮+你的枪线呈交叉，形成双人守门。",
    video: null },

  // ================= 莲华古城（扩充） =================
  { id: "lu-lotus-3", map: "莲华古城", agent: "铁臂", type: "闪光",
    title: "A 点破门前震爆清门后",
    desc: "莲华古城的可破坏门开门声全场可闻——守卫方一定会在门后架枪等开门。铁臂提前对门体放震爆弹，穿门引爆门后区域，开门的瞬间门后已经是“真空区”。",
    video: null },

  // ================= 霓虹町（扩充） =================
  { id: "lu-split-3", map: "霓虹町", agent: "蝰蛇", type: "烟雾",
    title: "B 点毒墙封“天台”",
    desc: "霓虹町 B 点的天台（Heaven）是最高危的高位架枪点。蝰蛇的毒墙立在天台边缘的“脖颈”位置——恰好把天台视野拦腰截断，进攻方从 B 主进点就安全了一半。",
    video: null },

  // ================= 森寒冬港（扩充） =================
  { id: "lu-icebox-3", map: "森寒冬港", agent: "奇乐", type: "守卫技巧",
    title: "A 点哨戒炮看“黄色钢管”",
    desc: "A 点的黄色钢管是进攻方最爱的高位路线。奇乐的哨戒炮对着钢管末端——敌人滑索下来的落点正好在哨炮射程里。哨炮被打掉也没关系：它的价值是告诉你敌人从哪来。",
    video: null },

  // ================= 日落之城（扩充） =================
  { id: "lu-sunset-2", map: "日落之城", agent: "猎枭", type: "侦查",
    title: "中路电弧箭探“市场窗”",
    desc: "日落之城的中路市场连接 A/B 两翼。猎枭的电弧箭从 B 主方向朝市场窗打——箭的落点覆盖市场内的两个常规架枪位，报完点再决定主攻方向。",
    video: null },

  // ================= 微风岛屿（扩充） =================
  { id: "lu-breeze-2", map: "微风岛屿", agent: "猎枭", type: "侦查",
    title: "A 点电弧箭探“要塞顶”",
    desc: "微风岛屿 A 点的要塞顶是全图最经典的高位架枪点。猎枭的电弧箭朝要塞顶平台打，箭响之后高位若有人，让狙击手先拿对枪，别用身体去换信息。",
    video: null },
  { id: "lu-breeze-3", map: "微风岛屿", agent: "蝰蛇", type: "烟雾",
    title: "B 点毒墙封长廊整线",
    desc: "微风岛屿 B 点的长廊枪线极长。蝰蛇的毒墙从长廊中段横着立起来，一堵墙遮掉整条枪线——队友从墙的近端贴过去进点，远端守卫全程“目视一面墙”。",
    video: null },

  // ================= 通用原则（扩充） =================
  { id: "lu-generic-3", map: "通用", agent: null, type: "闪光",
    title: "自丢闪的正确姿势：丢完就转身",
    desc: "自己的闪光也会晃自己——丢出闪光后立刻转身背对爆点，转身时机要练成肌肉记忆。团队推进时口令化：“闪——转——进”，三个人同一个节奏，闪光的价值才吃满。",
    video: null },
  { id: "lu-generic-4", map: "通用", agent: null, type: "侦查",
    title: "侦察道具留给“最后 5 秒”",
    desc: "开局就把侦察箭/诡眼全交掉，等于进点时裸奔。侦察道具的价值在“进点前最后 5 秒”的信息确认——留一颗，比开局探一圈重要得多。",
    video: null },
  { id: "lu-generic-5", map: "通用", agent: null, type: "守卫技巧",
    title: "哨戒炮/陷阱要“错开标准位”",
    desc: "奇乐的哨炮、钢锁的陷阱都有“教科书点位”——敌人背得比你还熟。同一个包点换个刁钻角度（低位、贴天花板、反方向），命中率翻倍。守卫道具的寿命 = 敌人的意外程度。",
    video: null },
  { id: "lu-generic-6", map: "通用", agent: null, type: "决斗技巧",
    title: "决斗者的位移：留着“进点后”用",
    desc: "捷风的升空、雷兹的窜跃、霓虹的滑铲——位移技能开场就挥霍，进点后就没有补枪和拉扯的本钱。职业打法的共识：位移留给“进点后补枪线”和“打完撤出”两个瞬间。",
    video: null },
];

// ===== B 站教学视频出处（采集员逐条经 bilibili API 校验 BV 号有效，2026-10-03 采集）=====
// 版权归原 UP 主所有，本工具仅以链接跳转原页面，不存储不转载视频内容。
const LINEUP_VIDEOS = [
 {
  "map": "亚海悬城",
  "title": "【亚海悬城2.0】全新猎枭/sova探测箭！更快！更强！更丝滑！全地图覆盖！",
  "author": "猎枭绝症柴柴",
  "bvid": "BV1wm411X72T",
  "url": "https://www.bilibili.com/video/BV1wm411X72T",
  "play": 1730681,
  "topic": "侦查道具点位"
 },
 {
  "map": "亚海悬城",
  "title": "亚海悬城穿墙点位整整30个 无畏契约新手穿墙教学",
  "author": "无畏战术大师兄",
  "bvid": "BV1Qh7C6XEVx",
  "url": "https://www.bilibili.com/video/BV1Qh7C6XEVx",
  "play": 1155038,
  "topic": "道具点位"
 },
 {
  "map": "亚海悬城",
  "title": "亚海悬城KO无解单向闪 ！",
  "author": "猫指导Valorant",
  "bvid": "BV1HiWwe8EzH",
  "url": "https://www.bilibili.com/video/BV1HiWwe8EzH",
  "play": 279359,
  "topic": "闪光点位"
 },
 {
  "map": "源工重镇",
  "title": "奶妈在源工重镇的阴间冰墙",
  "author": "修脚大师魏玲莹",
  "bvid": "BV1jPgqzrEAR",
  "url": "https://www.bilibili.com/video/BV1jPgqzrEAR",
  "play": 1009455,
  "topic": "道具点位"
 },
 {
  "map": "源工重镇",
  "title": "源工重镇保安点位 无畏契约哨位零保安摄像头拌线单向烟教学",
  "author": "无畏战术大师兄",
  "bvid": "BV1KAuEziE9m",
  "url": "https://www.bilibili.com/video/BV1KAuEziE9m",
  "play": 539814,
  "topic": "烟雾点位"
 },
 {
  "map": "源工重镇",
  "title": "无畏契约全地图教学——源工重镇（上），防守思路与选位",
  "author": "大东彦",
  "bvid": "BV1WV4y117gp",
  "url": "https://www.bilibili.com/video/BV1WV4y117gp",
  "play": 387514,
  "topic": "进点技巧"
 },
 {
  "map": "隐世修所",
  "title": "【隐世修所2.0】全新猎枭/sova探测箭！更快！更强！更丝滑！全地图覆盖！",
  "author": "猎枭绝症柴柴",
  "bvid": "BV1Nf421z7az",
  "url": "https://www.bilibili.com/video/BV1Nf421z7az",
  "play": 1217322,
  "topic": "侦查道具点位"
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
  "topic": "进点技巧"
 },
 {
  "map": "莲华古城",
  "title": "奶妈在莲华古城的阴间冰墙",
  "author": "修脚大师魏玲莹",
  "bvid": "BV1qwVh6JEWA",
  "url": "https://www.bilibili.com/video/BV1qwVh6JEWA",
  "play": 849730,
  "topic": "道具点位"
 },
 {
  "map": "莲华古城",
  "title": "【无畏契约】猎枭|sova—无敌猎枭王 莲花古城/莲华古城 全点位寻敌探测箭 Valorant 瓦罗兰特",
  "author": "无敌猎枭王",
  "bvid": "BV1ou411A7LQ",
  "url": "https://www.bilibili.com/video/BV1ou411A7LQ",
  "play": 733491,
  "topic": "侦查道具点位"
 },
 {
  "map": "莲华古城",
  "title": "【SEN TenZ】玩烟的人必学的一集！ 莲华古城Lotus暮蝶Clove29杀打法解析 无畏契约职业选手烟位第一视角解析",
  "author": "圣诞ChristmasLdw",
  "bvid": "BV16J4m1V76Y",
  "url": "https://www.bilibili.com/video/BV16J4m1V76Y",
  "play": 274559,
  "topic": "烟雾点位"
 },
 {
  "map": "霓虹町",
  "title": "无畏契约全地图教学——霓虹町（上），防守思路与选位全解",
  "author": "大东彦",
  "bvid": "BV1Fz4y1q71y",
  "url": "https://www.bilibili.com/video/BV1Fz4y1q71y",
  "play": 624320,
  "topic": "进点技巧"
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
  "title": "【黑梦-霓虹町】8颗诡眼，看穿霓虹町！超高容错诡眼教学！",
  "author": "帕帕_黑梦绝活版",
  "bvid": "BV1eqqWYxE9A",
  "url": "https://www.bilibili.com/video/BV1eqqWYxE9A",
  "play": 276125,
  "topic": "侦查道具点位"
 },
 {
  "map": "森寒冬港",
  "title": "阴间奶妈在森寒冬港天空冰墙",
  "author": "修脚大师魏玲莹",
  "bvid": "BV1tGNRzhEMz",
  "url": "https://www.bilibili.com/video/BV1tGNRzhEMz",
  "play": 1102975,
  "topic": "道具点位"
 },
 {
  "map": "森寒冬港",
  "title": "【森寒冬港】猎枭/sova探测箭！全地图覆盖！简单好学，无敌内卷，细节拉满！【极地寒港】",
  "author": "猎枭绝症柴柴",
  "bvid": "BV1794y1T7NX",
  "url": "https://www.bilibili.com/video/BV1794y1T7NX",
  "play": 923948,
  "topic": "侦查道具点位"
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
  "map": "日落之城",
  "title": "奶妈在日落之城的阴间冰墙",
  "author": "修脚大师魏玲莹",
  "bvid": "BV1nQgn6sEk6",
  "url": "https://www.bilibili.com/video/BV1nQgn6sEk6",
  "play": 1526246,
  "topic": "道具点位"
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
  "play": 314918,
  "topic": "进点技巧"
 },
 {
  "map": "微风岛屿",
  "title": "奶妈在微风岛屿的阴间冰墙",
  "author": "修脚大师魏玲莹",
  "bvid": "BV1rJ8z6oEeN",
  "url": "https://www.bilibili.com/video/BV1rJ8z6oEeN",
  "play": 365207,
  "topic": "道具点位"
 },
 {
  "map": "微风岛屿",
  "title": "【微风岛屿2.0】全新猎枭/sova探测箭！更快！更强！更丝滑！全地图覆盖！",
  "author": "猎枭绝症柴柴",
  "bvid": "BV1hm411U7BM",
  "url": "https://www.bilibili.com/video/BV1hm411U7BM",
  "play": 223196,
  "topic": "侦查道具点位"
 },
 {
  "map": "微风岛屿",
  "title": "无畏契约全地图教学—微风岛屿（上），防守选位与思路解析",
  "author": "大东彦",
  "bvid": "BV1Jh4y1q7xu",
  "url": "https://www.bilibili.com/video/BV1Jh4y1q7xu",
  "play": 211327,
  "topic": "进点技巧"
 },
 {
  "map": "天枢云阙",
  "title": "超级实用！一期视频学会新地图[天枢云阙]【黑梦】诡眼道具点位！",
  "author": "比比_Sama",
  "bvid": "BV1sT7e67Eki",
  "url": "https://www.bilibili.com/video/BV1sT7e67Eki",
  "play": 155942,
  "topic": "道具点位"
 },
 {
  "map": "天枢云阙",
  "title": "低分辐能带你从地图设计的视角彻底学会天枢云阙【瓦的地图理解】",
  "author": "KiddoJioJio",
  "bvid": "BV1937q63E83",
  "url": "https://www.bilibili.com/video/BV1937q63E83",
  "play": 153846,
  "topic": "地图理解"
 },
 {
  "map": "天枢云阙",
  "title": "幽邃地窟A点防守悬崖前压旋转跳教学",
  "author": "勇气小龙虾_",
  "bvid": "BV1PkrQYhEgA",
  "url": "https://www.bilibili.com/video/BV1PkrQYhEgA",
  "play": 14332,
  "topic": "边缘技巧"
 },
 {
  "map": "深海明珠",
  "title": "10分钟精通深海明珠，全地图教学——深海明珠篇",
  "author": "大东彦",
  "bvid": "BV1ZySgY4EnP",
  "url": "https://www.bilibili.com/video/BV1ZySgY4EnP",
  "play": 536170,
  "topic": "地图理解"
 },
 {
  "map": "深海明珠",
  "title": "深海明珠KO道具点位 无畏契约先锋位KO教学 KO单向闪探测刀点位",
  "author": "无畏战术大师兄",
  "bvid": "BV1JWmEBiETX",
  "url": "https://www.bilibili.com/video/BV1JWmEBiETX",
  "play": 159899,
  "topic": "闪光/道具点位"
 },
 {
  "map": "深海明珠",
  "title": "【深海明珠】猎枭/sova探测箭！简单好学，全地图覆盖！",
  "author": "猎枭绝症柴柴",
  "bvid": "BV1JwqRYDE2i",
  "url": "https://www.bilibili.com/video/BV1JwqRYDE2i",
  "play": 164962,
  "topic": "侦查道具"
 },
 {
  "map": "盐海矿镇",
  "title": "盐海矿镇黑梦实用点位 无畏契约信息位黑梦诡眼点位教学",
  "author": "无畏战术大师兄",
  "bvid": "BV1GutyzAEsz",
  "url": "https://www.bilibili.com/video/BV1GutyzAEsz",
  "play": 258682,
  "topic": "侦查道具点位"
 },
 {
  "map": "盐海矿镇",
  "title": "新地图【盐海矿镇】公式化封烟点位教学",
  "author": "好家伙不演了",
  "bvid": "BV1ZPKZz4E1b",
  "url": "https://www.bilibili.com/video/BV1ZPKZz4E1b",
  "play": 44044,
  "topic": "烟雾点位"
 },
 {
  "map": "盐海矿镇",
  "title": "盐海矿镇的阴间冰墙教学",
  "author": "修脚大师魏玲莹",
  "bvid": "BV1dzf4B2EAi",
  "url": "https://www.bilibili.com/video/BV1dzf4B2EAi",
  "play": 129797,
  "topic": "道具点位"
 },
 {
  "map": "裂变峡谷",
  "title": "五分钟掌握裂变峡谷！全地图教学-裂变峡谷篇",
  "author": "大东彦",
  "bvid": "BV1pnc7ejEMp",
  "url": "https://www.bilibili.com/video/BV1pnc7ejEMp",
  "play": 339592,
  "topic": "地图理解"
 },
 {
  "map": "裂变峡谷",
  "title": "裂变峡谷铁臂超实用进攻道具！",
  "author": "猫指导Valorant",
  "bvid": "BV1QZwrewEMb",
  "url": "https://www.bilibili.com/video/BV1QZwrewEMb",
  "play": 88229,
  "topic": "道具点位"
 },
 {
  "map": "裂变峡谷",
  "title": "【一招制胜】裂变峡谷进攻思路",
  "author": "虞姬电竞-无畏契约",
  "bvid": "BV1VFQmBJE8v",
  "url": "https://www.bilibili.com/video/BV1VFQmBJE8v",
  "play": 27517,
  "topic": "进点技巧"
 }
];
