// 主播热门准星数据
// 仅收录有明确来源的真实主播数据，绝不编造。
// 来源：游民星空 2024-05-31《无畏契约主播自用准星推荐》（59 位主播图鉴），
// 代码逐字摘自文章各分页正文（每页标注主播名），颜色经文章内嵌准星预览截图视觉核验（含放大像素确认）。
// 文章未提供 DPI/灵敏度/分辨率，故置 null（页面显示"待核实"）。
// 字段：id/name/platform(即team)/crosshairCode/crosshairColor/dpi/sens/verified/source
const STREAMERS = [
  // ================= 虎牙 =================
  { id: "st-jiezou", name: "节奏", platform: "虎牙", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;P;c;8;u;000000FF;h;0;b;1;0l;4;0o;0;0a;1;0f;0;1b;0", crosshairColor: "黑",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800.shtml" },

  { id: "st-xuenai", name: "雪乃荔荔枝", platform: "虎牙", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;P;c;1;u;1111FFFF;h;0;d;1;f;0;0b;0;1b;0", crosshairColor: "绿",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_2.shtml" },

  { id: "st-mituan", name: "米团-蓝七", platform: "虎牙", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;c;1;s;1;P;c;5;u;000000FF;o;0.114;d;1;z;1;0t;1;0l;3;0v;0;0o;0;0a;1;0f;0;1b;0;S;c;1;s;1.043;o;1", crosshairColor: "青",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_11.shtml" },

  { id: "st-xuanxuanpi", name: "XuanXuanPi", platform: "虎牙", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;P;o;1;d;1;z;3;f;0;0b;0;1b;0", crosshairColor: "白",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_13.shtml" },

  { id: "st-biaoge", name: "彪哥", platform: "虎牙", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;s;1;P;c;1;o;1;f;0;s;0;0l;5;0v;4;0o;4;0a;1;0f;0;1b;0;S;s;0.798", crosshairColor: "绿",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_16.shtml" },

  { id: "st-tianzai", name: "甜崽zZ", platform: "虎牙", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;s;1;P;o;1;f;0;0t;1;0l;3;0o;0;0a;1;0f;0;1b;0;S;d;0", crosshairColor: "白",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_19.shtml" },

  // ================= 斗鱼 =================
  { id: "st-eq118", name: "EQ118", platform: "斗鱼", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;P;c;1;o;0.11;m;1;0t;1;0l;2;0o;1;0a;1;0e;0.341;1t;0;1l;0;1o;1;1a;0.161;1s;0.168;1e;0.07", crosshairColor: "绿",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_20.shtml" },

  { id: "st-k4os", name: "K4os", platform: "斗鱼", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0", crosshairColor: "白",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_22.shtml" },

  { id: "st-akashaohua", name: "Aka少华", platform: "斗鱼", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;s;1;P;c;8;u;000000FF;h;0;b;1;f;0;0l;4;0v;2;0o;2;0a;1;0f;0;1b;0;S;c;5;s;1.375;o;1", crosshairColor: "黑",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_23.shtml" },

  { id: "st-xiaoyetina", name: "小野Tina", platform: "斗鱼", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;P;h;0;f;0;m;1;0l;4;0o;0;0a;1;0f;0;1b;0", crosshairColor: "白",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_37.shtml" },

  { id: "st-naisi", name: "奶思paopao", platform: "斗鱼", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;P;c;1;o;1;d;1;z;3;0t;0;0l;0;0o;0;0a;0;1t;0;1l;0;1a;0", crosshairColor: "绿",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_39.shtml" },

  { id: "st-syqvq", name: "SyQvQ", platform: "斗鱼", region: "中国", role: "主播",
    dpi: null, sens: null,
    crosshairCode: "0;P;h;0;0l;4;0o;0;0a;1;0f;0;1b;0", crosshairColor: "白",
    res: null, aspect: null, monitorRes: null,
    mouse: null, keyboard: null, headset: null, mousepad: null, monitor: null,
    verified: true, source: "https://www.gamersky.com/handbook/202405/1758800_47.shtml" },
];
