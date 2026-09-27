// ============================================================
// 选手数据
// 【中国选手（verified: true）】整理自 valorantcrosshairdb.com 选手专页
//   （2026-09-27 抓取，来源链接见每条的 source 字段）
// 【其他赛区（verified: false）】暂为演示占位数据，待后续核实替换
// 字段说明：
//   dpi/sens        鼠标DPI × 游戏内灵敏度（null=待核实）
//   crosshairCode   准星代码（游戏内设置可粘贴导入；null=待核实）
//   res             游戏内分辨率；monitorRes 显示器原生分辨率
//   nick/realName   中文昵称 / 真名（页面原文）
// ============================================================

const PLAYERS = [
  // ================= EDward Gaming（EDG） =================
  { id: "zmjjkk", name: "ZmjjKK", nick: "康康", realName: "郑永康", team: "EDG", teamFull: "EDward Gaming", region: "中国", role: "决斗者",
    dpi: 400, sens: 0.8,
    crosshairCode: "0;P;h;0;d;1;f;0;0l;2;0v;2;0g;1;0o;1;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/zmjjkk/" },

  { id: "chichoo", name: "CHICHOO", nick: "球球", realName: "万顺治", team: "EDG", teamFull: "EDward Gaming", region: "中国", role: "哨卫",
    dpi: 800, sens: 0.2,
    crosshairCode: "0;s;1;P;c;5;h;0;m;1;0t;4;0l;3;0o;2;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G Pro X2 SUPERSTRIKE", keyboard: "Wooting 60HE+", headset: "HyperX Cloud II Pink", mousepad: "Artisan Ninja FX Zero Mid Orange", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/chichoo/" },

  { id: "smoggy", name: "Smoggy", realName: "Zeng Hao", team: "EDG", teamFull: "EDward Gaming", region: "中国", role: null,
    dpi: 400, sens: 0.78,
    crosshairCode: "0;s;1;P;o;0.3;f;0;0l;3;0o;2;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2 DEX", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/smoggy/" },

  { id: "nobody", name: "nobody", realName: "Wang Senxu", team: "EDG", teamFull: "EDward Gaming", region: "中国", role: null,
    dpi: null, sens: null,
    crosshairCode: "0;s;1;P;o;1;m;1;0t;1;0l;2;0v;2;0g;1;0o;2;0a;1;0f;0;1b;0", crosshairColor: null,
    res: null, aspect: null, monitorRes: "1920×1080",
    mouse: "Razer DeathAdder V3 HyperSpeed", keyboard: "IQUNIX EZ63 HE", headset: "Razer BlackShark V3 Pro Black", mousepad: "VAXEE PD151", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/nobody/" },

  // ================= Bilibili Gaming（BLG） =================
  { id: "knight", name: "Knight", realName: "刘宇翔", team: "BLG", teamFull: "Bilibili Gaming", region: "中国", role: "哨卫",
    dpi: 800, sens: 0.35,
    crosshairCode: "0;s;1;P;c;1;h;0;f;0;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "绿",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2 DEX", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/knight/" },

  { id: "whzy", name: "whzy", realName: "魏智龙", team: "BLG", teamFull: "Bilibili Gaming", region: "中国", role: "决斗者",
    dpi: 400, sens: 0.49,
    crosshairCode: "0;P;h;0;d;1;z;1;f;0;s;0;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "VAXEE XE Wireless", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "X-raypad Aqua Control Pro Gray XL", monitor: "ZOWIE XL2566K",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/whzy/" },

  { id: "rushia", name: "Rushia", realName: "王晓杰", team: "BLG", teamFull: "Bilibili Gaming", region: "中国", role: "控场",
    dpi: 400, sens: 0.55,
    crosshairCode: "0;s;1;P;c;1;o;1;0t;1;0l;3;0o;2;0a;1;0f;0;1b;0;S;c;7;s;0.623;o;1", crosshairColor: "绿",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "VAXEE XE Wireless", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/rushia/" },

  { id: "bud", name: "Bud", realName: "杨韧余", team: "BLG", teamFull: "Bilibili Gaming", region: "中国", role: "控场",
    dpi: 800, sens: 0.3,
    crosshairCode: "0;P;h;0;d;1;z;1;f;0;s;0;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "绿",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/bud/" },

  { id: "nephh", name: "nephh", realName: "Lee Yee Seng", team: "BLG", teamFull: "Bilibili Gaming", region: "中国", role: null,
    dpi: 800, sens: 0.39,
    crosshairCode: "0;s;1;P;c;5;h;0;0l;3;0o;0;0a;1;0f;0;1b;0;S;s;0.8;o;1", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Lamzu Atlantis OG Superstrike", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "X-raypad Equate Plus Purple XL", monitor: "ZOWIE XL2546X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/nephh/" },

  // ================= Wolves Esports（WOL） =================
  { id: "yosemite", name: "yosemite", realName: "王磊", team: "WOL", teamFull: "Wolves Esports", region: "中国", role: "先锋",
    dpi: 800, sens: 0.329,
    crosshairCode: "0;s;1;P;c;7;h;0;d;1;z;1;f;0;s;0;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0;S;d;0", crosshairColor: "红",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "VAXEE XE Wireless", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/yosemite/" },

  { id: "satoshi", name: "Satoshi", realName: "Wang Rui", team: "WOL", teamFull: "Wolves Esports", region: "中国", role: null,
    dpi: 800, sens: 0.4,
    crosshairCode: "0;P;h;0;d;1;f;0;0l;2;0v;2;0g;1;0o;1;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/satoshi/" },

  { id: "qiutian", name: "qiutiaN", realName: "Yang Zhenghao", team: "WOL", teamFull: "Wolves Esports", region: "中国", role: null,
    dpi: 400, sens: 0.6,
    crosshairCode: "0;s;1;P;c;1;h;0;f;0;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/qiutian/" },

  { id: "siufatbb", name: "SiuFatBB", realName: "Chiu Fat Lei", team: "WOL", teamFull: "Wolves Esports", region: "中国", role: null,
    dpi: 1600, sens: 0.23,
    crosshairCode: "0;s;1;P;c;5;h;0;m;1;0t;4;0l;3;0o;2;0a;1;0f;0;1b;0;S;s;0.8;o;1", crosshairColor: "青",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2 DEX", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/siufatbb/" },

  { id: "spring", name: "Spring", realName: "Lau Chak Kwan", team: "WOL", teamFull: "Wolves Esports", region: "中国", role: null,
    dpi: 800, sens: 0.2,
    crosshairCode: "0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Zero Mid Soft L Blue", monitor: "ZOWIE XL2546K",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/spring/" },

  { id: "s1mon", name: "S1Mon", realName: "郑雅文", team: "WOL", teamFull: "Wolves Esports", region: "中国", role: null,
    dpi: 400, sens: 0.5,
    crosshairCode: "0;s;1;P;c;5;h;0;m;1;0t;4;0l;2;0o;2;0a;1;0f;0;1b;0;S;c;5;s;0.8;o;1", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2 DEX", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/s1mon/" },

  { id: "youjun", name: "youjun", realName: "Tang Youjun", team: "WOL", teamFull: "Wolves Esports", region: "中国", role: null,
    dpi: 800, sens: 0.32,
    crosshairCode: "0;P;h;0;d;1;z;2;f;0;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/youjun/" },

  // ================= All Gamers（AG） =================
  { id: "rarga", name: "Rarga", realName: "王俊凯", team: "AG", teamFull: "All Gamers", region: "中国", role: "决斗者",
    dpi: 400, sens: 0.55,
    crosshairCode: "0;s;1;P;c;5;o;1;d;1;z;3;f;0;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0;S;s;0.64;o;1", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2 DEX", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/rarga/" },

  { id: "dannyy", name: "Dannyy", realName: "Dong Haoran", team: "AG", teamFull: "All Gamers", region: "中国", role: null,
    dpi: 800, sens: 0.35,
    crosshairCode: "0;s;1;P;c;5;h;0;m;1;0t;4;0l;3;0o;2;0a;1;0f;0;1b;0;S;c;5;s;0.8;o;1", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/dannyy/" },

  { id: "ffs", name: "ffs", realName: "Tan Zhi Hong", team: "AG", teamFull: "All Gamers", region: "中国", role: null,
    dpi: 800, sens: 0.4,
    crosshairCode: "0;s;1;P;c;6;h;0;s;0;0t;1;0l;3;0o;1;0a;1;0f;0;1b;0;S;c;7;s;0.815;o;1", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/ffs/" },

  { id: "juicy", name: "Juicy", realName: "Zhao Xuan", team: "AG", teamFull: "All Gamers", region: "中国", role: null,
    dpi: 800, sens: 0.45,
    crosshairCode: "0;P;c;1;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "VAXEE XE Wireless", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/juicy/" },

  // ================= Xi Lai Gaming（XLG） =================
  { id: "jowa", name: "Jowa", realName: "林立", team: "XLG", teamFull: "Xi Lai Gaming", region: "中国", role: "哨卫",
    dpi: 400, sens: 0.6,
    crosshairCode: "0;P;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0", crosshairColor: "绿",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2 DEX", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/jowa/" },

  { id: "lysoar", name: "LYSOAR", realName: "斯亮宇", team: "XLG", teamFull: "Xi Lai Gaming", region: "中国", role: "决斗者",
    dpi: 800, sens: 0.3,
    crosshairCode: "0;s;1;P;c;1;h;0;d;1;0l;3;0o;2;0a;1;0f;0;1b;0;S;c;7;s;0.7;o;1", crosshairColor: "红",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Razer Viper V3 Pro Faker Edition", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Hien Mid Wine Red", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/lysoar/" },

  { id: "happywei", name: "happywei", realName: "魏德正", team: "XLG", teamFull: "Xi Lai Gaming", region: "中国", role: "决斗者",
    dpi: 800, sens: 0.35,
    crosshairCode: "0;P;h;0;d;1;0l;3;0o;2;0a;1;0f;0;1b;0", crosshairColor: "绿",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2 DEX", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/happywei/" },

  { id: "noman", name: "noman", realName: "Zhang Lei", team: "XLG", teamFull: "Xi Lai Gaming", region: "中国", role: null,
    dpi: 800, sens: 0.36,
    crosshairCode: "0;P;h;0;d;1;f;0;s;0;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/noman/" },

  { id: "wsleo", name: "WSLEO", realName: "李伟豪", team: "XLG", teamFull: "Xi Lai Gaming", region: "中国", role: "决斗者",
    dpi: 1600, sens: 0.15,
    crosshairCode: "0;s;1;P;c;5;h;0;d;1;0l;2;0o;2;0a;1;0f;0;1b;0;S;c;5;s;0.8;o;1", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Razer Viper V3 Pro", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/wsleo/" },

  // ================= 自由人（Free Agent） =================
  { id: "biank", name: "Biank", realName: "钟剑飞", team: "自由人", teamFull: "Free Agent", region: "中国", role: "先锋",
    dpi: 400, sens: 0.48,
    crosshairCode: "0;P;h;0;d;1;f;0;s;0;0t;1;0l;3;0o;3;0a;1;0f;0;1b;0", crosshairColor: "绿",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "VAXEE OUTSET AX", keyboard: "Wooting 60HE+", headset: "HyperX Cloud II", mousepad: "Artisan Hien Mid Wine Red", monitor: "ZOWIE XL2546K",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/biank/" },

  { id: "youze", name: "youze", realName: "Tao Youze", team: "自由人", teamFull: "Free Agent", region: "中国", role: null,
    dpi: 800, sens: 0.45,
    crosshairCode: "0;s;1;P;c;6;h;0;s;0;0t;1;0l;3;0o;2;0a;1;0f;0;1b;0;S;d;0;d;0;n;0", crosshairColor: "青",
    res: "1280×960", aspect: "4:3（填充）", monitorRes: "1920×1080",
    mouse: "Logitech G PRO X SUPERLIGHT 2", keyboard: "Wooting 60HE+", headset: "Razer BlackShark V3 Pro", mousepad: "Artisan Type-99 Mid Brown", monitor: "ZOWIE XL2566X+",
    verified: true, source: "https://www.valorantcrosshairdb.com/zh/players/youze/" },

  // ================= 其他赛区（演示占位数据，verified: false，待核实） =================
  { id: "boaster", name: "Boaster", team: "FNC", teamFull: "Fnatic", region: "EMEA", role: "控场",
    dpi: 800, sens: 0.31,
    crosshairCode: "0;P;c;1;o;1;d;1;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "绿",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "罗技 G PRO X 超轻2代", keyboard: "罗技 G PRO X 键盘", headset: "罗技 G PRO X 2耳机", mousepad: "Xtrfy GP4 超大版", monitor: "ZOWIE XL2566K",
    verified: false },

  { id: "chronicle", name: "Chronicle", team: "FNC", teamFull: "Fnatic", region: "EMEA", role: "先锋",
    dpi: 800, sens: 0.38,
    crosshairCode: "0;P;c;4;o;0.7;d;1;z;2;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "Endgame Gear XM2we", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Artisan Zero 柔速版", monitor: "华硕 ROG 猛禽PG27AQN",
    verified: false },

  { id: "alfajer", name: "Alfajer", team: "FNC", teamFull: "Fnatic", region: "EMEA", role: "哨卫",
    dpi: 800, sens: 0.42,
    crosshairCode: "0;P;c;5;o;1;d;1;0t;2;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "粉",
    res: "1280×960", aspect: "4:3 拉伸", monitorRes: "1920×1080",
    mouse: "雷蛇 毒蝰V3专业版", keyboard: "雷蛇 猎魂光蛛V3竞技版", headset: "雷蛇 旋风黑鲨V2专业版", mousepad: "Pulsar 超滑玻璃垫", monitor: "ZOWIE XL2586X",
    verified: false },

  { id: "f0rsaken", name: "f0rsakeN", team: "PRX", teamFull: "Paper Rex", region: "太平洋", role: "决斗者",
    dpi: 800, sens: 0.4,
    crosshairCode: "0;P;c;1;o;1;d;1;z;3;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "绿",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "罗技 G PRO X 超轻2代", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Artisan Zero 柔速版", monitor: "ZOWIE XL2566K",
    verified: false },

  { id: "jinggg", name: "Jinggg", team: "PRX", teamFull: "Paper Rex", region: "太平洋", role: "决斗者",
    dpi: 1600, sens: 0.3,
    crosshairCode: "0;P;c;3;o;1;d;1;0t;2;0l;1;0o;2;0a;1;0f;0;1b;0", crosshairColor: "黄",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "雷蛇 毒蝰V3专业版", keyboard: "雷蛇 猎魂光蛛V3竞技版", headset: "雷蛇 旋风黑鲨V2专业版", mousepad: "罗技 G640", monitor: "三星 玄龙骑士G7",
    verified: false },

  { id: "mindfreak", name: "mindfreak", team: "PRX", teamFull: "Paper Rex", region: "太平洋", role: "控场",
    dpi: 800, sens: 0.29,
    crosshairCode: "0;P;c;8;o;0.6;d;1;0t;1;0l;3;0o;1;0a;1;0f;0;1b;0", crosshairColor: "白",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "卓威 EC2-CW", keyboard: "罗技 G PRO X 键盘", headset: "罗技 G PRO X 2耳机", mousepad: "Artisan Zero 柔速版", monitor: "三星 玄龙骑士G7",
    verified: false },

  { id: "zekken", name: "zekken", team: "SEN", teamFull: "Sentinels", region: "美洲", role: "决斗者",
    dpi: 800, sens: 0.36,
    crosshairCode: "0;P;c;5;o;1;d;1;z;1;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "粉",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "Finalmouse Starlight Pro 无线", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Artisan Zero 柔速版", monitor: "华硕 ROG 猛禽PG27AQN",
    verified: false },

  { id: "johnqt", name: "johnqt", team: "SEN", teamFull: "Sentinels", region: "美洲", role: "哨卫",
    dpi: 1600, sens: 0.135,
    crosshairCode: "0;P;c;4;o;1;d;1;0t;2;0l;1;0o;3;0a;1;0f;0;1b;0", crosshairColor: "青",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "罗技 G PRO X 超轻2代", keyboard: "罗技 G PRO X 键盘", headset: "罗技 G PRO X 2耳机", mousepad: "罗技 G640", monitor: "华硕 ROG 猛禽PG27AQN",
    verified: false },

  { id: "mako", name: "MaKo", team: "DRX", teamFull: "DRX", region: "太平洋", role: "控场",
    dpi: 800, sens: 0.348,
    crosshairCode: "0;P;c;1;o;0.8;d;1;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "绿",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "罗技 G PRO X 超轻2代", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "罗技 G640", monitor: "ZOWIE XL2566K",
    verified: false },

  { id: "buzz", name: "BuZz", team: "DRX", teamFull: "DRX", region: "太平洋", role: "决斗者",
    dpi: 800, sens: 0.4,
    crosshairCode: "0;P;c;8;o;1;d;1;z;2;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "白",
    res: "1920×1080", aspect: "16:9", monitorRes: "1920×1080",
    mouse: "雷蛇 毒蝰V3专业版", keyboard: "雷蛇 猎魂光蛛V3竞技版", headset: "雷蛇 旋风黑鲨V2专业版", mousepad: "Artisan Zero 柔速版", monitor: "ZOWIE XL2586X",
    verified: false },

  { id: "t3xture", name: "t3xture", team: "GEN", teamFull: "Gen.G", region: "太平洋", role: "决斗者",
    dpi: 400, sens: 0.8,
    crosshairCode: "0;P;c;7;o;0.9;d;1;0t;2;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "红",
    res: "2560×1440", aspect: "16:9", monitorRes: "2560×1440",
    mouse: "卓威 EC2-CW", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Pulsar 超滑玻璃垫", monitor: "华硕 ROG 猛禽PG27AQN",
    verified: false }
];
