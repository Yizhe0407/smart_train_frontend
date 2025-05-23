// src/lib/locationData.ts

export const counties: string[] = [
  "基隆市",
  "台北市",
  "新北市",
  "桃園市",
  "新竹縣",
  "新竹市",
  "苗栗縣",
  "台中市",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義縣",
  "嘉義市",
  "台南市",
  "高雄市",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "台東縣",
];

export interface StationInfo {
  name: string;
  StationID: string;
}

export const stationsByCounty: Record<string, StationInfo[]> = {
  基隆市: [
    { name: "基隆", StationID: "0900" },
    { name: "三坑", StationID: "0910" },
    { name: "八堵", StationID: "0920" }, // 八堵站體主要在基隆市暖暖區
    { name: "七堵", StationID: "0930" },
    { name: "暖暖", StationID: "7390" },
    { name: "海科館", StationID: "7361" },
    { name: "八斗子", StationID: "7362" },
  ],
  台北市: [
    { name: "南港", StationID: "0980" },
    { name: "松山", StationID: "0990" },
    { name: "臺北", StationID: "1000" },
    { name: "臺北-環島", StationID: "1001" }, // 特殊列車起訖點，以台北計
    { name: "萬華", StationID: "1010" },
  ],
  新北市: [
    { name: "百福", StationID: "0940" }, // 位於新北市汐止區
    { name: "五堵", StationID: "0950" },
    { name: "汐止", StationID: "0960" },
    { name: "汐科", StationID: "0970" },
    { name: "板橋", StationID: "1020" },
    { name: "浮洲", StationID: "1030" },
    { name: "樹林", StationID: "1040" },
    { name: "南樹林", StationID: "1050" },
    { name: "山佳", StationID: "1060" },
    { name: "鶯歌", StationID: "1070" },
    { name: "鳳鳴", StationID: "1075" }, // 站體在新北市鶯歌區，但主要服務桃園龜山居民
    { name: "福隆", StationID: "7290" },
    { name: "貢寮", StationID: "7300" },
    { name: "雙溪", StationID: "7310" },
    { name: "牡丹", StationID: "7320" },
    { name: "三貂嶺", StationID: "7330" },
    { name: "大華", StationID: "7331" },
    { name: "十分", StationID: "7332" },
    { name: "望古", StationID: "7333" },
    { name: "嶺腳", StationID: "7334" },
    { name: "平溪", StationID: "7335" },
    { name: "菁桐", StationID: "7336" },
    { name: "猴硐", StationID: "7350" },
    { name: "瑞芳", StationID: "7360" },
    { name: "四腳亭", StationID: "7380" },
  ],
  桃園市: [
    { name: "桃園", StationID: "1080" },
    { name: "內壢", StationID: "1090" },
    { name: "中壢", StationID: "1100" },
    { name: "埔心", StationID: "1110" },
    { name: "楊梅", StationID: "1120" },
    { name: "富岡", StationID: "1130" },
    { name: "新富", StationID: "1140" }, // 位於桃園市楊梅區
  ],
  新竹縣: [
    { name: "北湖", StationID: "1150" }, // 位於新竹縣湖口鄉
    { name: "湖口", StationID: "1160" },
    { name: "新豐", StationID: "1170" },
    { name: "竹北", StationID: "1180" },
    { name: "竹中", StationID: "1193" }, // 六家線/內灣線轉乘，位於新竹縣竹東鎮
    { name: "六家", StationID: "1194" }, // 位於新竹縣竹北市 (高鐵新竹站)
    { name: "上員", StationID: "1201" },
    { name: "榮華", StationID: "1202" },
    { name: "竹東", StationID: "1203" },
    { name: "橫山", StationID: "1204" },
    { name: "九讚頭", StationID: "1205" },
    { name: "合興", StationID: "1206" },
    { name: "富貴", StationID: "1207" },
    { name: "內灣", StationID: "1208" },
  ],
  新竹市: [
    { name: "北新竹", StationID: "1190" },
    { name: "千甲", StationID: "1191" }, // 六家線，位於新竹市東區
    { name: "新莊", StationID: "1192" }, // 六家線，位於新竹市東區
    { name: "新竹", StationID: "1210" },
    { name: "三姓橋", StationID: "1220" },
    { name: "香山", StationID: "1230" },
  ],
  苗栗縣: [
    { name: "崎頂", StationID: "1240" },
    { name: "竹南", StationID: "1250" },
    { name: "談文", StationID: "2110" },
    { name: "大山", StationID: "2120" },
    { name: "後龍", StationID: "2130" },
    { name: "龍港", StationID: "2140" },
    { name: "白沙屯", StationID: "2150" },
    { name: "新埔", StationID: "2160" }, // 苗栗海線，非新竹新埔
    { name: "通霄", StationID: "2170" },
    { name: "苑裡", StationID: "2180" },
    { name: "造橋", StationID: "3140" },
    { name: "豐富", StationID: "3150" }, // 高鐵苗栗站
    { name: "苗栗", StationID: "3160" },
    { name: "南勢", StationID: "3170" },
    { name: "銅鑼", StationID: "3180" },
    { name: "三義", StationID: "3190" },
  ],
  台中市: [
    { name: "日南", StationID: "2190" },
    { name: "大甲", StationID: "2200" },
    { name: "臺中港", StationID: "2210" },
    { name: "清水", StationID: "2220" },
    { name: "沙鹿", StationID: "2230" },
    { name: "龍井", StationID: "2240" },
    { name: "大肚", StationID: "2250" },
    { name: "追分", StationID: "2260" },
    { name: "泰安", StationID: "3210" }, // 台中山線
    { name: "后里", StationID: "3220" },
    { name: "豐原", StationID: "3230" },
    { name: "栗林", StationID: "3240" },
    { name: "潭子", StationID: "3250" },
    { name: "頭家厝", StationID: "3260" },
    { name: "松竹", StationID: "3270" },
    { name: "太原", StationID: "3280" },
    { name: "精武", StationID: "3290" },
    { name: "臺中", StationID: "3300" },
    { name: "五權", StationID: "3310" },
    { name: "大慶", StationID: "3320" },
    { name: "烏日", StationID: "3330" },
    { name: "新烏日", StationID: "3340" }, // 高鐵台中站
    { name: "成功", StationID: "3350" }, // 追分成功
  ],
  彰化縣: [
    { name: "彰化", StationID: "3360" },
    { name: "花壇", StationID: "3370" },
    { name: "大村", StationID: "3380" },
    { name: "員林", StationID: "3390" },
    { name: "永靖", StationID: "3400" },
    { name: "社頭", StationID: "3410" },
    { name: "田中", StationID: "3420" },
    { name: "二水", StationID: "3430" }, // 集集線起點
    { name: "源泉", StationID: "3431" }, // 集集線，位於彰化縣二水鄉
  ],
  南投縣: [
    // 集集線主要在此縣
    { name: "濁水", StationID: "3432" },
    { name: "龍泉", StationID: "3433" },
    { name: "集集", StationID: "3434" },
    { name: "水里", StationID: "3435" },
    { name: "車埕", StationID: "3436" },
  ],
  雲林縣: [
    { name: "林內", StationID: "3450" },
    { name: "石榴", StationID: "3460" },
    { name: "斗六", StationID: "3470" },
    { name: "斗南", StationID: "3480" },
    { name: "石龜", StationID: "3490" },
  ],
  嘉義縣: [
    { name: "大林", StationID: "4050" },
    { name: "民雄", StationID: "4060" },
    { name: "水上", StationID: "4090" },
    { name: "南靖", StationID: "4100" },
  ],
  嘉義市: [
    { name: "嘉北", StationID: "4070" },
    { name: "嘉義", StationID: "4080" },
  ],
  台南市: [
    { name: "後壁", StationID: "4110" },
    { name: "新營", StationID: "4120" },
    { name: "柳營", StationID: "4130" },
    { name: "林鳳營", StationID: "4140" },
    { name: "隆田", StationID: "4150" },
    { name: "拔林", StationID: "4160" },
    { name: "善化", StationID: "4170" },
    { name: "南科", StationID: "4180" },
    { name: "新市", StationID: "4190" },
    { name: "永康", StationID: "4200" },
    { name: "大橋", StationID: "4210" },
    { name: "臺南", StationID: "4220" },
    { name: "保安", StationID: "4250" },
    { name: "仁德", StationID: "4260" },
    { name: "中洲", StationID: "4270" }, // 沙崙線轉乘點
    { name: "長榮大學", StationID: "4271" }, // 沙崙線
    { name: "沙崙", StationID: "4272" }, // 沙崙線 (高鐵台南站)
  ],
  高雄市: [
    { name: "大湖", StationID: "4290" },
    { name: "路竹", StationID: "4300" },
    { name: "岡山", StationID: "4310" },
    { name: "橋頭", StationID: "4320" },
    { name: "楠梓", StationID: "4330" },
    { name: "新左營", StationID: "4340" }, // 高鐵左營站
    { name: "左營", StationID: "4350" },
    { name: "內惟", StationID: "4360" },
    { name: "美術館", StationID: "4370" },
    { name: "鼓山", StationID: "4380" },
    { name: "三塊厝", StationID: "4390" },
    { name: "高雄", StationID: "4400" },
    { name: "民族", StationID: "4410" },
    { name: "科工館", StationID: "4420" },
    { name: "正義", StationID: "4430" },
    { name: "鳳山", StationID: "4440" },
    { name: "後庄", StationID: "4450" },
    { name: "九曲堂", StationID: "4460" },
  ],
  屏東縣: [
    { name: "六塊厝", StationID: "4470" },
    { name: "屏東", StationID: "5000" },
    { name: "歸來", StationID: "5010" },
    { name: "麟洛", StationID: "5020" },
    { name: "西勢", StationID: "5030" },
    { name: "竹田", StationID: "5040" },
    { name: "潮州", StationID: "5050" },
    { name: "崁頂", StationID: "5060" },
    { name: "南州", StationID: "5070" },
    { name: "鎮安", StationID: "5080" },
    { name: "林邊", StationID: "5090" },
    { name: "佳冬", StationID: "5100" },
    { name: "東海", StationID: "5110" }, // 位於屏東縣枋寮鄉
    { name: "枋寮", StationID: "5120" },
    { name: "加祿", StationID: "5130" },
    { name: "內獅", StationID: "5140" },
    { name: "枋山", StationID: "5160" },
    { name: "枋野", StationID: "5170" }, // 號誌站，通常無客運
    { name: "南方小站", StationID: "5998" }, // 潮州車輛基地一部分，算屏東
    { name: "潮州基地", StationID: "5999" }, // 算屏東
  ],
  宜蘭縣: [
    { name: "漢本", StationID: "7070" },
    { name: "武塔", StationID: "7080" },
    { name: "南澳", StationID: "7090" },
    { name: "東澳", StationID: "7100" },
    { name: "永樂", StationID: "7110" },
    { name: "蘇澳", StationID: "7120" },
    { name: "蘇澳新", StationID: "7130" },
    { name: "新馬", StationID: "7140" },
    { name: "冬山", StationID: "7150" },
    { name: "羅東", StationID: "7160" },
    { name: "中里", StationID: "7170" },
    { name: "二結", StationID: "7180" },
    { name: "宜蘭", StationID: "7190" },
    { name: "四城", StationID: "7200" },
    { name: "礁溪", StationID: "7210" },
    { name: "頂埔", StationID: "7220" },
    { name: "頭城", StationID: "7230" },
    { name: "外澳", StationID: "7240" },
    { name: "龜山", StationID: "7250" },
    { name: "大溪", StationID: "7260" }, // 宜蘭大溪
    { name: "大里", StationID: "7270" }, // 宜蘭大里
    { name: "石城", StationID: "7280" },
  ],
  花蓮縣: [
    { name: "和平", StationID: "7060" }, // 位於花蓮縣秀林鄉
    { name: "和仁", StationID: "7050" }, // 位於花蓮縣秀林鄉
    { name: "崇德", StationID: "7040" }, // 位於花蓮縣秀林鄉
    { name: "新城", StationID: "7030" }, // 太魯閣
    { name: "景美", StationID: "7020" }, // 位於花蓮縣秀林鄉
    { name: "北埔", StationID: "7010" }, // 位於花蓮縣新城鄉
    { name: "花蓮", StationID: "7000" },
    { name: "吉安", StationID: "6250" },
    { name: "志學", StationID: "6240" },
    { name: "平和", StationID: "6230" },
    { name: "壽豐", StationID: "6220" },
    { name: "豐田", StationID: "6210" },
    { name: "林榮新光", StationID: "6200" },
    { name: "南平", StationID: "6190" },
    { name: "鳳林", StationID: "6180" },
    { name: "萬榮", StationID: "6170" },
    { name: "光復", StationID: "6160" },
    { name: "大富", StationID: "6150" },
    { name: "富源", StationID: "6140" },
    { name: "瑞穗", StationID: "6130" },
    { name: "三民", StationID: "6120" }, // 位於花蓮縣玉里鎮
    { name: "玉里", StationID: "6110" },
    { name: "東里", StationID: "6100" }, // 位於花蓮縣富里鄉
    { name: "東竹", StationID: "6090" }, // 位於花蓮縣富里鄉
    { name: "富里", StationID: "6080" },
  ],
  台東縣: [
    { name: "池上", StationID: "6070" },
    { name: "海端", StationID: "6060" },
    { name: "關山", StationID: "6050" },
    { name: "瑞和", StationID: "6040" },
    { name: "瑞源", StationID: "6030" },
    { name: "鹿野", StationID: "6020" },
    { name: "山里", StationID: "6010" },
    { name: "臺東", StationID: "6000" },
    { name: "康樂", StationID: "5240" },
    { name: "知本", StationID: "5230" },
    { name: "太麻里", StationID: "5220" },
    { name: "金崙", StationID: "5210" },
    { name: "瀧溪", StationID: "5200" },
    { name: "大武", StationID: "5190" },
  ],
};
