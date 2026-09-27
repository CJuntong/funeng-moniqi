// ============================================================
// 选手数据 · 演示版
// 注意：所有设置数值均为示例占位数据，正式版（M2）将逐条核实
// 公开资料后替换。真实姓名等个人信息暂不收录，避免不准确。
// 字段说明：
//   dpi/sens        鼠标DPI × 游戏内灵敏度
//   crosshairCode   准星代码（游戏内设置可粘贴导入）
//   crosshairColor  准星颜色（用于筛选）
//   hz              显示器刷新率
// ============================================================

const PLAYERS = [
  { id: "zmjjkk",   name: "ZmjjKK",   team: "EDG", teamFull: "EDward Gaming",   region: "中国",   role: "决斗者",
    dpi: 800,  sens: 0.45,
    crosshairCode: "0;P;c;5;o;1;d;1;z;3;f;0;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "粉",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "罗技 G PRO X 超轻2代", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Artisan Zero 柔速版", monitor: "ZOWIE XL2566K 360Hz" },

  { id: "chichoo",  name: "CHICHOO",  team: "EDG", teamFull: "EDward Gaming",   region: "中国",   role: "哨卫",
    dpi: 800,  sens: 0.30,
    crosshairCode: "0;P;c;4;o;1;d;1;z;1;0t;2;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "青",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "雷蛇 毒蝰V3专业版", keyboard: "罗技 G PRO X 键盘", headset: "罗技 G PRO X 2耳机", mousepad: "罗技 G640", monitor: "ZOWIE XL2566K 360Hz" },

  { id: "smoggy",   name: "Smoggy",   team: "EDG", teamFull: "EDward Gaming",   region: "中国",   role: "控场",
    dpi: 800,  sens: 0.35,
    crosshairCode: "0;P;c;1;o;0.5;d;1;0t;1;0l;3;0o;1;0a;1;0f;0;1b;0", crosshairColor: "绿",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "卓威 EC2-CW", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Artisan Zero 柔速版", monitor: "ZOWIE XL2586X 540Hz" },

  { id: "haodong",  name: "Haodong",  team: "EDG", teamFull: "EDward Gaming",   region: "中国",   role: "先锋",
    dpi: 800,  sens: 0.32,
    crosshairCode: "0;P;c;8;o;1;d;1;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "白",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "雷蛇 毒蝰V3专业版", keyboard: "雷蛇 猎魂光蛛V3竞技版", headset: "雷蛇 旋风黑鲨V2专业版", mousepad: "Xtrfy GP4 超大版", monitor: "ZOWIE XL2566K 360Hz" },

  { id: "nobody",   name: "nobody",   team: "EDG", teamFull: "EDward Gaming",   region: "中国",   role: "控场",
    dpi: 1600, sens: 0.18,
    crosshairCode: "0;P;c;4;o;1;d;1;0t;1;0l;1;0o;3;0a;1;0f;0;1b;0", crosshairColor: "青",
    resolution: "1920×1080", aspect: "16:9", hz: 240,
    mouse: "罗技 G PRO X 超轻", keyboard: "罗技 G PRO X 键盘", headset: "HyperX Cloud III", mousepad: "罗技 G640", monitor: "三星 玄龙骑士G7 240Hz" },

  { id: "whzy",     name: "whzy",     team: "BLG", teamFull: "Bilibili Gaming", region: "中国",   role: "决斗者",
    dpi: 800,  sens: 0.49,
    crosshairCode: "0;P;c;7;o;1;d;1;z;2;0t;2;0l;1;0o;2;0a;1;0f;0;1b;0", crosshairColor: "红",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "Pulsar X2V2 Mini", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Artisan Zero 柔速版", monitor: "ZOWIE XL2566K 360Hz" },

  { id: "boaster",  name: "Boaster",  team: "FNC", teamFull: "Fnatic",          region: "EMEA",   role: "控场",
    dpi: 800,  sens: 0.31,
    crosshairCode: "0;P;c;1;o;1;d;1;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "绿",
    resolution: "1920×1080", aspect: "16:9", hz: 240,
    mouse: "罗技 G PRO X 超轻2代", keyboard: "罗技 G PRO X 键盘", headset: "罗技 G PRO X 2耳机", mousepad: "Xtrfy GP4 超大版", monitor: "三星 玄龙骑士G7 240Hz" },

  { id: "chronicle",name: "Chronicle",team: "FNC", teamFull: "Fnatic",          region: "EMEA",   role: "先锋",
    dpi: 800,  sens: 0.38,
    crosshairCode: "0;P;c;4;o;0.7;d;1;z;2;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "青",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "Endgame Gear XM2we", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Artisan Zero 柔速版", monitor: "华硕 ROG 猛禽PG27AQN 360Hz" },

  { id: "alfajer",  name: "Alfajer",  team: "FNC", teamFull: "Fnatic",          region: "EMEA",   role: "哨卫",
    dpi: 800,  sens: 0.42,
    crosshairCode: "0;P;c;5;o;1;d;1;0t;2;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "粉",
    resolution: "1280×960", aspect: "4:3 拉伸", hz: 540,
    mouse: "雷蛇 毒蝰V3专业版", keyboard: "雷蛇 猎魂光蛛V3竞技版", headset: "雷蛇 旋风黑鲨V2专业版", mousepad: "Pulsar 超滑玻璃垫", monitor: "ZOWIE XL2586X 540Hz" },

  { id: "f0rsaken", name: "f0rsakeN", team: "PRX", teamFull: "Paper Rex",       region: "太平洋", role: "决斗者",
    dpi: 800,  sens: 0.40,
    crosshairCode: "0;P;c;1;o;1;d;1;z;3;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "绿",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "罗技 G PRO X 超轻2代", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Artisan Zero 柔速版", monitor: "ZOWIE XL2566K 360Hz" },

  { id: "jinggg",   name: "Jinggg",   team: "PRX", teamFull: "Paper Rex",       region: "太平洋", role: "决斗者",
    dpi: 1600, sens: 0.30,
    crosshairCode: "0;P;c;3;o;1;d;1;0t;2;0l;1;0o;2;0a;1;0f;0;1b;0", crosshairColor: "黄",
    resolution: "1920×1080", aspect: "16:9", hz: 240,
    mouse: "雷蛇 毒蝰V3专业版", keyboard: "雷蛇 猎魂光蛛V3竞技版", headset: "雷蛇 旋风黑鲨V2专业版", mousepad: "罗技 G640", monitor: "三星 玄龙骑士G7 240Hz" },

  { id: "mindfreak",name: "mindfreak",team: "PRX", teamFull: "Paper Rex",       region: "太平洋", role: "控场",
    dpi: 800,  sens: 0.29,
    crosshairCode: "0;P;c;8;o;0.6;d;1;0t;1;0l;3;0o;1;0a;1;0f;0;1b;0", crosshairColor: "白",
    resolution: "1920×1080", aspect: "16:9", hz: 240,
    mouse: "卓威 EC2-CW", keyboard: "罗技 G PRO X 键盘", headset: "罗技 G PRO X 2耳机", mousepad: "Artisan Zero 柔速版", monitor: "三星 玄龙骑士G7 240Hz" },

  { id: "zekken",   name: "zekken",   team: "SEN", teamFull: "Sentinels",       region: "美洲",   role: "决斗者",
    dpi: 800,  sens: 0.36,
    crosshairCode: "0;P;c;5;o;1;d;1;z;1;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "粉",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "Finalmouse Starlight Pro 无线", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Artisan Zero 柔速版", monitor: "华硕 ROG 猛禽PG27AQN 360Hz" },

  { id: "johnqt",   name: "johnqt",   team: "SEN", teamFull: "Sentinels",       region: "美洲",   role: "哨卫",
    dpi: 1600, sens: 0.135,
    crosshairCode: "0;P;c;4;o;1;d;1;0t;2;0l;1;0o;3;0a;1;0f;0;1b;0", crosshairColor: "青",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "罗技 G PRO X 超轻2代", keyboard: "罗技 G PRO X 键盘", headset: "罗技 G PRO X 2耳机", mousepad: "罗技 G640", monitor: "华硕 ROG 猛禽PG27AQN 360Hz" },

  { id: "mako",     name: "MaKo",     team: "DRX", teamFull: "DRX",             region: "太平洋", role: "控场",
    dpi: 800,  sens: 0.348,
    crosshairCode: "0;P;c;1;o;0.8;d;1;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "绿",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "罗技 G PRO X 超轻2代", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "罗技 G640", monitor: "ZOWIE XL2566K 360Hz" },

  { id: "buzz",     name: "BuZz",     team: "DRX", teamFull: "DRX",             region: "太平洋", role: "决斗者",
    dpi: 800,  sens: 0.40,
    crosshairCode: "0;P;c;8;o;1;d;1;z;2;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", crosshairColor: "白",
    resolution: "1920×1080", aspect: "16:9", hz: 360,
    mouse: "雷蛇 毒蝰V3专业版", keyboard: "雷蛇 猎魂光蛛V3竞技版", headset: "雷蛇 旋风黑鲨V2专业版", mousepad: "Artisan Zero 柔速版", monitor: "ZOWIE XL2586X 540Hz" },

  { id: "t3xture",  name: "t3xture",  team: "GEN", teamFull: "Gen.G",           region: "太平洋", role: "决斗者",
    dpi: 400,  sens: 0.80,
    crosshairCode: "0;P;c;7;o;0.9;d;1;0t;2;0l;2;0o;1;0a;1;0f;0;1b;0", crosshairColor: "红",
    resolution: "2560×1440", aspect: "16:9", hz: 360,
    mouse: "卓威 EC2-CW", keyboard: "Wooting 60HE", headset: "HyperX Cloud III", mousepad: "Pulsar 超滑玻璃垫", monitor: "华硕 ROG 猛禽PG27AQN 360Hz" }
];
