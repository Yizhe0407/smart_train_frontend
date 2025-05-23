// src/lib/locationData.ts

export const counties: string[] = [
  "基隆市",
  "台北市",
  "新北市",
  "桃園市",
  "新竹市",
  "新竹縣",
  "苗栗縣",
  "台中市",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "台南市",
  "高雄市",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "台東縣",
];

export interface StationInfo {
  name: string;
  isSmall: boolean;
}

export const stationsByCounty: Record<string, StationInfo[]> = {
  基隆市: [
    { name: "基隆", isSmall: false },
    { name: "三坑", isSmall: true },
    { name: "八堵", isSmall: false },
    { name: "七堵", isSmall: false },
  ],
  台北市: [
    { name: "南港", isSmall: false },
    { name: "松山", isSmall: false },
    { name: "台北", isSmall: false },
    { name: "萬華", isSmall: false },
  ],
  新北市: [
    { name: "板橋", isSmall: false },
    { name: "樹林", isSmall: false },
    { name: "鶯歌", isSmall: false },
    { name: "福隆", isSmall: true },
  ],
  桃園市: [ /* 請在此處添加桃園市的車站資料 */ ],
  新竹市: [ /* 請在此處添加新竹市的車站資料 */ ],
  新竹縣: [ /* 請在此處添加新竹縣的車站資料 */ ],
  苗栗縣: [ /* 請在此處添加苗栗縣的車站資料 */ ],
  台中市: [ /* 請在此處添加台中市的車站資料 */ ],
  彰化縣: [ /* 請在此處添加彰化縣的車站資料 */ ],
  南投縣: [ /* 請在此處添加南投縣的車站資料 */ ],
  雲林縣: [ /* 請在此處添加雲林縣的車站資料 */ ],
  嘉義市: [ /* 請在此處添加嘉義市的車站資料 */ ],
  嘉義縣: [ /* 請在此處添加嘉義縣的車站資料 */ ],
  台南市: [ /* 請在此處添加台南市的車站資料 */ ],
  高雄市: [ /* 請在此處添加高雄市的車站資料 */ ],
  屏東縣: [ /* 請在此處添加屏東縣的車站資料 */ ],
  宜蘭縣: [ /* 請在此處添加宜蘭縣的車站資料 */ ],
  花蓮縣: [ /* 請在此處添加花蓮縣的車站資料 */ ],
  台東縣: [ /* 請在此處添加台東縣的車站資料 */ ],
  // 務必補齊其他縣市的車站資料
};