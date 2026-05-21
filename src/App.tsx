/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Info, 
  ChevronDown, 
  ExternalLink, 
  Navigation, 
  ShoppingBag, 
  Coffee, 
  Utensils, 
  Hotel, 
  Smartphone, 
  Languages,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plane,
  Phone,
  User,
  Tag,
  Copy,
  Users,
  Battery,
  AlertTriangle,
  CloudRain,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import amenitiesData from '../kyushu_trip_amenities.json';

// --- Types ---

interface Recommendation {
  type: 'food' | 'shop' | 'souvenir';
  name: string;
  description: string;
  link?: string;
}

interface NearbyAmenity {
  name: string;
  category: string;
  time: string;
  link: string;
  directionsLink?: string;
  isCar?: boolean;
}

interface ItineraryItem {
  day: number;
  title: string;
  summary: string;
  spots: {
    name: string;
    description: string;
    image: string;
    time?: string;
    tips?: string;
  }[];
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  hotel: {
    name: string;
    link: string;
    nearby: NearbyAmenity[];
    warning?: string;
  };
  flight?: {
    airline: string;
    number: string;
    departure: string;
    departureTime: string;
    arrival: string;
    arrivalTime: string;
  };
  recommendations?: Recommendation[];
}

// --- Data ---

const ITINERARY_DATA: ItineraryItem[] = [
  {
    day: 1,
    title: "高雄 / 福岡",
    summary: "抵達九州第一大城 - 福岡，開啟精彩旅程。",
    spots: [
      {
        name: "福岡機場 (Fukuoka Airport)",
        description: "福岡機場是日本少數位於市區內的機場，距離博多車站僅需 5 分鐘地鐵車程。抵達後由專人協辦出境手續，隨即搭乘專車前往飯店休息，為明天的行程儲備體力。",
        image: "https://d1grca2t3zpuug.cloudfront.net/2025/10/fukuokaairport_02-860x645-1759926819.webp",
        tips: "福岡地區飯店以簡單整潔之商務旅館為主，交通極為便利。"
      }
    ],
    meals: {
      breakfast: "自理",
      lunch: "自理",
      dinner: "機上簡餐"
    },
    hotel: {
      name: "QUINTESSA福岡天神南 (QUINTESSA HOTEL FUKUOKA TENJIN MINAMI)",
      link: "https://www.google.com/maps/search/?api=1&query=QUINTESSA福岡天神南",
      nearby: [
        { name: "7-Eleven 白金1丁目店", category: "便利商店", time: "1", link: "https://www.google.com/maps/place/?q=place_id:ChIJgWJD65yRQTURZUuNnHJakvo" },
        { name: "Lawson 福岡白金1丁目店", category: "便利商店", time: "1", link: "https://www.google.com/maps/place/?q=place_id:ChIJA1D8W5yRQTURUqSlkOyGD1E" },
        { name: "Drug Shinseido 藥院", category: "藥妝店", time: "2", link: "https://www.google.com/maps/place/?q=place_id:ChIJyd21d5yRQTUR-BF54P7-Fbk" },
        { name: "Matsumoto Kiyoshi 藥院店", category: "藥妝店", time: "2", link: "https://www.google.com/maps/place/?q=place_id:ChIJ_RWZkU2RQTURBIIz_G18ZY4" },
        { name: "Reganet Marche 藥院 (西鐵超市)", category: "超市", time: "2", link: "https://www.google.com/maps/place/?q=place_id:ChIJAZJTuJyRQTUR8tfRBi-g2gE" },
        { name: "McDonald's 藥院站", category: "連鎖餐廳", time: "2", link: "https://www.google.com/maps/place/?q=place_id:ChIJw7oxu5yRQTUR1U9OC-x891Q" },
        { name: "Sunny 渡邊通店", category: "超市", time: "6", link: "https://www.google.com/maps/place/?q=place_id:ChIJ-542bJmRQTURsacRi9RoDpE" },
        { name: "百旬館 (Hyaku Shun Kan)", category: "超市", time: "6", link: "https://www.google.com/maps/place/?q=place_id:ChIJ_1isKJqRQTUR-rpMq3j0NeE" },
        { name: "Don Quijote 天神本店", category: "唐吉訶德", time: "12", link: "https://www.google.com/maps/place/?q=place_id:ChIJj9iUqoWRQTURWnFERWGSVHg" },
        { name: "BIC CAMERA 天神店", category: "電器行", time: "12", link: "https://www.google.com/maps/place/?q=place_id:ChIJk0nzrJqRQTURDQH3sM66ViA" },
        { name: "MITSUKOSHI 三越百貨", category: "百貨公司", time: "15", link: "https://www.google.com/maps/place/?q=place_id:ChIJc5H06o-RQTURfHoAQlLv0b0" }
      ]
    },
    flight: {
      airline: "長榮航空",
      number: "BR120",
      departure: "高雄",
      departureTime: "15:30",
      arrival: "福岡",
      arrivalTime: "19:20"
    },
    recommendations: [
      { type: 'food', name: "博多拉麵 一蘭 (Ichiran)", description: "福岡機場店，最後一碗道地拉麵的機會。", link: "https://ichiran.com/shop/kyushu/fukuoka-airport/" },
      { type: 'souvenir', name: "博多通りもん (Hakata Torimon)", description: "福岡最受歡迎的伴手禮，連續多年獲得金賞。", link: "https://www.meigetsudo.co.jp/menubook/torimon/" },
      { type: 'souvenir', name: "福砂屋 (Fukusaya) 長崎蛋糕", description: "底部有砂糖顆粒的經典長崎蛋糕。", link: "https://www.fukusaya.co.jp/" }
    ]
  },
  {
    day: 2,
    title: "水鄉柳川與熊本名城",
    summary: "體驗柳川扁舟搖船，參訪日本三大名城之一的熊本城。",
    spots: [
      {
        name: "柳川扁舟搖船 (Yanagawa River Cruise)",
        description: "柳川市被譽為「日本威尼斯」，擁有總長約 930 公里的運河網。搭乘由船夫撐篙的木舟，穿梭在古意盎然的街道與垂柳間，沿途可欣賞水門、紅磚倉庫及四季花卉，聆聽船夫吟唱傳統民謠。",
        image: "https://itinerary.colatour.com.tw/COLA_AppFiles/A03A_Tour/PictureObj/00081574.JPG",
        time: "約 30 分鐘",
        tips: "著名詩人北原白秋的故鄉，充滿文學氣息。"
      },
      {
        name: "熊本城 (Kumamoto Castle)",
        description: "日本三大名城之一，由加藤清正於 1607 年完工。其壯觀的石牆「武者返」以陡峭著稱，令敵人難以攀爬。天守閣內展示了豐富的歷史文物，從頂層可俯瞰熊本市景。雖然在 2016 年地震中受損，但目前已完成天守閣修復並開放參觀。",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt2Gdfo262trM35bJxgJJVTvLMDV7LlB2YxA&s",
        tips: "別名銀杏城，據說加藤清正為了圍城戰儲備糧食而種植大量銀杏。"
      },
      {
        name: "櫻之馬場城彩苑",
        description: "位於熊本城腳下，重現了江戶時代的城下町風情。這裡匯集了熊本縣內的特色美食與伴手禮，是遊客品嚐當地小吃（如辛子蓮根、馬肉料理）的最佳地點。",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTYVXxr5YK24eRlATEo1Ijy6taCtHJGuvS4g&s",
        tips: "贈送海膽可樂餅，外酥內軟充滿海味。"
      },
      {
        name: "萌熊電鐵 (Kumamon Tram)",
        description: "熊本電氣鐵道的彩繪電車，車內外佈滿了熊本縣營業部長「萌熊」的可愛身影。這條地方鐵道充滿懷舊氛圍，是鐵道迷與萌熊粉絲必訪的景點。",
        image: "https://b2b.travelerts.com.tw/eWeb_ts/IMGDB/000046/00001908.JPG",
        time: "約 6 分鐘",
        tips: "北熊本車站設有萌熊周邊商品專賣店。"
      }
    ],
    meals: {
      breakfast: "飯店早餐",
      lunch: "日式風味御膳 或 和洋式自助餐",
      dinner: "飯店和、洋、中百匯自助餐 (和牛無限享用)"
    },
    hotel: {
      name: "南關溫泉 SEKIA (SEKIA)",
      link: "https://www.google.com/maps/search/?api=1&query=南関温泉セキア",
      nearby: [
        { name: "7-Eleven 關北亀店", category: "便利商店", time: "5", link: "https://www.google.com/maps/place/?q=place_id:ChIJWzITRgBTQDURQlnb2VeDrJ0", isCar: true },
        { name: "南關いきいき村 (特產中心)", category: "農產特產", time: "6", link: "https://www.google.com/maps/place/?q=place_id:ChIJF9LjD4JTQDURqTtFsQmlgwg", isCar: true },
        { name: "Setaka Nankan 藥妝店", category: "藥妝店", time: "7", link: "https://www.google.com/maps/place/?q=place_id:ChIJEZhJApJTQDURmH7Y5WQv1Wk", isCar: true },
        { name: "Nanchan ちゃんぽん名店", category: "餐廳", time: "7", link: "https://www.google.com/maps/place/?q=place_id:ChIJlTzh8VZTQDURcEr5vfE9Btg", isCar: true },
        { name: "ビッグオーク南關購物中心", category: "綜合超市", time: "7", link: "https://www.google.com/maps/place/?q=place_id:ChIJ7V4fG5JTQDURI3LyFg7ATVg", isCar: true }
      ]
    },
    recommendations: [
      { type: 'food', name: "元祖本吉屋 (Motoyoshiya)", description: "柳川最古老的鰻魚飯老店，必嚐蒸鰻魚飯。", link: "http://www.motoyoshiya.jp/" },
      { type: 'food', name: "菅乃屋 (Suganoya) 馬肉可樂餅", description: "櫻之馬場城彩苑內，熊本特色馬肉料理。", link: "https://suganoya.com/" },
      { type: 'souvenir', name: "譽之陣太鼓 (Homare no Jindaiko)", description: "熊本代表性甜點，紅豆泥包裹著求肥。", link: "https://www.kobai.jp/jindaiko/" }
    ]
  },
  {
    day: 3,
    title: "阿蘇大觀峰與由布院散策",
    summary: "探訪白川水源，漫步絕美金鱗湖與歐洲童話村。",
    spots: [
      {
        name: "白川水源 (Shirakawa Suigen)",
        description: "位於阿蘇山腳下的南阿蘇村，是日本環境省評選的「名水百選」之一。每分鐘湧出約 60 噸的清水，水溫全年維持在 14 度左右。水質清澈見底，可直接飲用，口感甘甜。",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEI8grWf64lRn9WU67T8MWII57psJuQxE_Ew&s",
        tips: "可自備容器或在現場購買寶特瓶裝取神水。"
      },
      {
        name: "阿蘇大觀峰展望台 (Daikanbo)",
        description: "阿蘇北外輪山的最高峰，海拔 936 公尺。從這裡可以 360 度俯瞰阿蘇五岳（根子岳、高岳、中岳、杵島岳、烏帽子岳），其形狀酷似橫臥的釋迦牟尼佛，被稱為「阿蘇涅槃像」。",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp-2G19HcQOK78CQ_G_FzmM4WiMxPiz3odIw&s",
        tips: "氣候多變，建議隨身攜帶薄外套。"
      },
      {
        name: "湯布院 / 湯之坪街道",
        description: "湯布院（由布院）是日本女性票選最愛的度假勝地。湯之坪街道兩旁林立著各式特色小店、藝廊、咖啡廳及甜點店，充滿悠閒的藝術氣息。",
        image: "https://img.vialife.tw/201504/15-32.jpg",
        tips: "推薦必嚐：B-speak 奶油捲、金賞可樂餅。"
      },
      {
        name: "湯之坪歐洲童話村 (Yufuin Floral Village)",
        description: "以英國科茨沃爾德地區為藍本打造的迷你主題樂園。繽紛的石屋建築、可愛的小動物區以及宮崎駿、哈利波特等主題商店，讓人彷彿置身於歐洲童話世界。",
        image: "https://www.tahsintour.com.tw/mobile_final/mobile/images/theme_travel/kyu/p1/181009JFF5BR.jpg",
        tips: "贈送由布院人氣甜點：Milch 手匠半熟布丁。"
      },
      {
        name: "金鱗湖 (Lake Kinrin)",
        description: "湖底同時湧出溫泉與清水，溫差使得湖面在秋冬清晨常出現如夢似幻的晨霧。夕陽照射下，湖中游魚的鱗片閃爍金光，因而得名「金鱗湖」。",
        image: "https://i0.wp.com/boo2k.com/wp-content/uploads/2019/06/20190418-3C1A4113.jpg?resize=860%2C573&ssl=1",
        tips: "湖畔的 CAFE LA RUCHE 是享受悠閒下午茶的好地方。"
      }
    ],
    meals: {
      breakfast: "飯店早餐",
      lunch: "湯布院蒸籠料理 或 日式風味御膳",
      dinner: "飯店自助晚餐 或 飯店會席料理"
    },
    hotel: {
      name: "GRANDVRIO HOTEL BEPPUWAN WAKURA (グランヴィリオホテル別府湾和蔵)",
      link: "https://www.google.com/maps/search/?api=1&query=GRANDVRIO+HOTEL+BEPPUWAN+WAKURA",
      nearby: [
        { name: "7-Eleven 日出平道店", category: "便利商店", time: "11", link: "https://www.google.com/maps/place/?q=place_id:ChIJC91yQ7cdRDUR2yuWiEmbdJA" },
        { name: "Grand Mercure Beppu Bay Resort (隔壁飯店)", category: "鄰近設施", time: "11", link: "https://www.google.com/maps/place/?q=place_id:ChIJReReCbcdRDUR-CY3C1eiwvA" },
        { name: "裏リッチヒルズ (居酒屋)", category: "餐廳", time: "19", link: "https://www.google.com/maps/place/?q=place_id:ChIJA-uXGLQdRDURKyI7LhXovPY" }
      ]
    },
    recommendations: [
      { type: 'food', name: "B-speak 奶油捲", description: "湯布院超人氣甜點，口感綿密細緻。", link: "http://www.b-speak.net/" },
      { type: 'food', name: "金賞可樂餅 (Kinsho Croquette)", description: "外皮酥脆內餡濃郁，湯布院散策必吃。", link: "https://yufuin-kinsho-korokke.com/" },
      { type: 'souvenir', name: "Milch 半熟起司蛋糕", description: "冷熱皆宜，濃郁起司香氣撲鼻。", link: "https://milch-japan.co.jp/" }
    ]
  },
  {
    day: 4,
    title: "宇佐神宮與門司港夜景",
    summary: "參拜國寶宇佐神宮，欣賞皿倉山新日本三大夜景。",
    spots: [
      {
        name: "宇佐神宮 (Usa Jingu)",
        description: "建於 8 世紀，是全日本 4 萬多座八幡宮的總本宮。其獨特的「八幡造」建築風格被指定為國寶。境內古木參天，氣氛莊嚴肅穆，是九州著名的能量景點。",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGF44-8HZ5Vm5NVEDhYQGPl_CbxfPQFAqqEg&s",
        tips: "參拜方式為「二拜、四拍手、一拜」，與一般神社不同。"
      },
      {
        name: "門司港懷舊散策 (Mojiko Retro)",
        description: "門司港曾是日本三大港口之一，保留了許多明治至大正時期的西式建築。如紅磚造的舊門司稅關、木造的門司港車站等，充滿異國情調。海峽廣場則有許多土特產店與餐廳。",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgYd4EuVcd32GGUbwjJHS_cnGibfVmemQwXQ&s",
        tips: "推薦品嚐當地名物：燒咖哩 (Baked Curry)。"
      },
      {
        name: "皿倉山纜車 (Mt. Sarakura)",
        description: "搭乘纜車與爬坡車前往海拔 622 公尺的山頂，可俯瞰被稱為「價值百億美元」的北九州市夜景。這裡與長崎稻佐山、札幌藻岩山並列為「新日本三大夜景」。",
        image: "https://bjsmile.tw/wp-content/uploads/2023/11/2-1-jpeg.webp",
        tips: "山頂風大，冬季或傍晚前往請務必加強保暖。"
      }
    ],
    meals: {
      breakfast: "飯店早餐",
      lunch: "北九州燒咖哩 或 河豚風味餐",
      dinner: "發 ¥1000 自理"
    },
    hotel: {
      name: "Premier 門司港飯店 (PREMIER HOTEL MOJIKO)",
      link: "https://www.google.com/maps/search/?api=1&query=Premier+門司港飯店",
      nearby: [
        { name: "Curry Honpo 門司港レトロ店", category: "餐廳", time: "2", link: "https://www.google.com/maps/place/?q=place_id:ChIJZR1rBCmWQzUREcNT1shalPE" },
        { name: "海峽廣場 Kaikyo Plaza", category: "購物中心", time: "2", link: "https://www.google.com/maps/place/?q=place_id:ChIJNRsiNSmWQzURHzE7Jh6TklM" },
        { name: "Princess Phi Phi (門司港咖哩名店)", category: "餐廳", time: "3", link: "https://www.google.com/maps/place/?q=place_id:ChIJTY3z1S6WQzURA85AUpAA_WI" },
        { name: "MOJIKO BEER HOUSE", category: "餐廳/酒吧", time: "3", link: "https://www.google.com/maps/place/?q=place_id:ChIJBTOi7CuWQzURnDwNyJoszeo" },
        { name: "FamilyMart 西海岸店", category: "便利商店", time: "4", link: "https://www.google.com/maps/place/?q=place_id:ChIJU66zMuCXQzUReBt5vBa0myk" },
        { name: "Lawson 門司港町", category: "便利商店", time: "4", link: "https://www.google.com/maps/place/?q=place_id:ChIJMwb11S6WQzURC4pcbaMGCxQ" },
        { name: "サンキュードラッグ 門司港本店", category: "藥妝店", time: "7", link: "https://www.google.com/maps/place/?q=place_id:ChIJ8cPW-S6WQzURHMNkc9sypwY" },
        { name: "Halloday (門司港)", category: "超市", time: "8", link: "https://www.google.com/maps/place/?q=place_id:ChIJdUDqbS6WQzUR7ZWY0RivO_w" },
        { name: "You-Me Mart 東門司店", category: "超市", time: "12", link: "https://www.google.com/maps/place/?q=place_id:ChIJQ4gESM2XQzUR_LrqMnFDmLg" }
      ]
    },
    recommendations: [
      { type: 'food', name: "伽哩本舖 (Curry Honpo)", description: "門司港名物燒咖哩，濃郁起司與咖哩的完美結合。", link: "http://www.curry-honpo.com/" },
      { type: 'souvenir', name: "門司港香蕉巧克力餅乾", description: "門司港是日本香蕉拍賣發源地，相關商品極具特色。", link: "https://www.mojiko.info/shop/" }
    ]
  },
  {
    day: 5,
    title: "太宰府天滿宮與賦歸",
    summary: "參拜學問之神，搭乘旅人觀光列車，帶著回憶返台。",
    spots: [
      {
        name: "福岡免稅商店",
        description: "位於福岡市區或機場周邊，提供各式日本名產、化妝品、電器等免稅商品，是旅程最後掃貨的最佳時機。",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDgFrmdyo9eRwI7r7v_cFzuPT6Blv0rLZdlw&s",
        tips: "建議列好清單，把握最後購物時間。"
      },
      {
        name: "太宰府天滿宮",
        description: "祭祀「學問之神」菅原道真，每年吸引無數考生前來祈求金榜題名。境內種植了約 6,000 株梅樹，每逢早春梅花盛開，景色迷人。",
        image: "https://blog-static.kkday.com/zh-hk/blog/wp-content/uploads/%E7%A6%8F%E5%B2%A1%E6%99%AF%E9%BB%9E%EF%BC%9A%E5%A4%AA%E5%AE%B0%E5%BA%9C%E5%A4%A9%E6%BB%BF%E5%AE%AE.png",
        tips: "贈送梅枝餅，現烤熱騰騰的紅豆內餡非常美味。"
      },
      {
        name: "太宰府星巴克 (Starbucks Dazaifu)",
        description: "由知名建築師隈研吾設計，利用 2,000 根杉木木材交織而成，完全不使用釘子。其獨特的幾何美學與神社的傳統氛圍完美融合，是全球最美星巴克之一。",
        image: "https://www.mottimes.com/upload/article/design/architecture/1783bb1f7d8325f6dfce86d9d77ac2da.jpg",
        tips: "店內空間較窄，建議外帶後在門口拍照留念。"
      },
      {
        name: "太宰府旅人觀光列車 (Tabito)",
        description: "外部彩繪著太宰府的四季花卉與景點，內部則有 6 種代表不同開運意義的圖騰。搭乘這部充滿和風美感的列車，為太宰府之旅畫下完美句點。",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiLVCE4mB0jhRp50BwZ9R4doXX0vcV45-8uA&s",
        time: "約 5-10 分鐘",
        tips: "車廂內設有紀念章戳，別忘了蓋章留念。"
      }
    ],
    meals: {
      breakfast: "飯店早餐",
      lunch: "螃蟹會席料理 或 長腳蟹吃到飽",
      dinner: "機上簡餐"
    },
    hotel: {
      name: "溫暖的家",
      link: "",
      nearby: []
    },
    flight: {
      airline: "長榮航空",
      number: "BR119",
      departure: "福岡",
      departureTime: "20:20",
      arrival: "高雄",
      arrivalTime: "22:10"
    },
    recommendations: [
      { type: 'food', name: "かさの家 (Kasanoya) 梅枝餅", description: "太宰府參道名店，現烤梅枝餅皮脆心軟。", link: "http://www.kasanoya.com/" },
      { type: 'shop', name: "太宰府星巴克", description: "隈研吾設計，獨特的木造結構建築。", link: "https://store.starbucks.co.jp/detail-1058/" },
      { type: 'souvenir', name: "明太子 (Mentaiko)", description: "福岡代表性特產，推薦創始老店「ふくや」。", link: "https://www.fukuya.com/" }
    ]
  }
];

const MERGED_ITINERARY_DATA: ItineraryItem[] = ITINERARY_DATA.map((day) => {
  const keyMap: { [key: number]: string } = {
    1: 'Day1_06_14_Sun',
    2: 'Day2_06_15_Mon',
    3: 'Day3_06_16_Tue',
    4: 'Day4_06_17_Wed',
  };
  
  const dayKey = keyMap[day.day];
  let nearby: NearbyAmenity[] = [];
  let warning: string | undefined = undefined;

  const dataForDay = dayKey ? (amenitiesData as any)[dayKey] : null;
  if (dataForDay) {
    warning = dataForDay.warning || undefined;
    const walkList = dataForDay.places_within_walking_distance || [];
    const carList = dataForDay.nearby_by_car || [];

    if (walkList.length > 0) {
      walkList.forEach((item: any) => {
        nearby.push({
          name: item.name,
          category: item.category,
          time: `${item.estimated_walking_min_google ?? 0}`,
          link: item.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`,
          directionsLink: item.directions_url || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.name)}`,
          isCar: false
        });
      });
    } else if (carList.length > 0) {
      carList.forEach((item: any) => {
        nearby.push({
          name: item.name,
          category: item.category,
          time: `${item.drive_min ?? 0}`,
          link: item.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`,
          directionsLink: item.directions_url || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.name)}`,
          isCar: true
        });
      });
    }
  } else {
    // Fallback to static ITINERARY_DATA nearby
    nearby = (day.hotel.nearby || []).map((item) => ({
      ...item,
      directionsLink: item.link
    }));
  }

  return {
    ...day,
    hotel: {
      ...day.hotel,
      warning,
      nearby
    }
  };
});

const USEFUL_INFO = {
  taxRefund: [
    { title: "消耗品 (食品/藥妝)", content: "5,000 ~ 500,000 日圓，須封裝且不可在日本境內拆封。" },
    { title: "一般品 (衣物/電器)", content: "5,000 日圓以上，可拆封使用。" },
    { title: "退稅門檻", content: "同日、同一商店累計消費滿 5,000 日圓 (未稅)。" }
  ],
  travelTips: [
    { title: "電壓規格", content: "100V，插頭雙平頭與台灣直接通用。" },
    { title: "行李規定", content: "托運行李每人限額 30 KG，隨身行李 7 KG (長榮航空)。" },
    { title: "上網漫遊", content: "請在前一晚或機場啟用 eSIM 或確認 SIM 卡數據漫遊已開啟。" },
    { title: "日幣現金", content: "建議自備 3萬~5萬日圓現金，部分山區/熊本溫泉飯店不收信用卡。" }
  ],
  japanese: [
    { jp: "すみません (Sumimasen)", cn: "不好意思 / 請問" },
    { jp: "トイレはどこですか？ (Toire wa doko desu ka?)", cn: "廁所在哪裡？" },
    { jp: "メニューをお願いします (Menyuu o onegaishimasu)", cn: "請給我菜單" },
    { jp: "これをお願いします (Kore o onegaishimasu)", cn: "請給我這個 (點餐/購物)" },
    { jp: "わさびを抜いてください (Wasabi o nuite kudasai)", cn: "請不要加芥末" },
    { jp: "お会計をお願いします (Okaikei o onegaishimasu)", cn: "請幫我結帳" },
    { jp: "いくらですか？ (Ikura desu ka?)", cn: "多少錢？" },
    { jp: "免稅(めんぜい)できますか？ (Menzei dekimasu ka?)", cn: "可以退稅嗎？" },
    { jp: "クレジットカードは使えますか？ (Kurejitto kaado wa tsukaemasu ka?)", cn: "可以使用信用卡嗎？" },
    { jp: "Wi-Fiのパスワードは何ですか？ (Wi-Fi no pasuwaado wa nan desu ka?)", cn: "Wi-Fi 密碼是什麼？" },
    { jp: "荷物を預かってもらえますか？ (Nimotsu o azukatte moraemasu ka?)", cn: "可以幫我寄放行李嗎？" },
    { jp: "袋(ふくろ)は大丈夫です (Fukuro wa daijoubu desu)", cn: "不需要袋子 (響應減塑環保)" },
    { jp: "袋(ふくろ)を１枚お願いします (Fukuro o ichimai onegaishimasu)", cn: "請給我一個袋子 (需購買塑膠袋時)" },
    { jp: "中国語のメニューはありますか？ (Chuugokugo no menyuu wa arimasu ka?)", cn: "有中文菜單嗎？" },
    { jp: "お水をいただけますか？ (Omizu o itadakemasu ka?)", cn: "可以給我開水/冰水嗎？ (餐廳常用)" },
    { jp: "おすすめは何ですか？ (Osumume wa nan desu ka?)", cn: "有推薦的嗎？ (點餐或挑商品推薦)" },
    { jp: "写真を撮ってもいいですか？ (Shashin o totte mo ii desu ka?)", cn: "可以拍照嗎？" },
    { jp: "これを試着してもいいですか？ (Kore o shichaku shite mo ii desu ka?)", cn: "這個可以試穿嗎？" },
    { jp: "領収書をお願いします (Ryoushuusho o onegaishimasu)", cn: "請給我收據 / 統編發票" },
    { jp: "日本語がわかりません (Nihongo ga wakarimasen)", cn: "我不懂日語" },
    { jp: "中国語が話せますか？ (Chuugokugo ga hanasemasu ka?)", cn: "會說中文嗎？" },
    { jp: "ありがとうございます (Arigatou gozaimasu)", cn: "謝謝" }
  ]
};

// --- Components ---

const ExchangeRate = () => {
  const [rate, setRate] = useState<number>(0.215);
  const [source, setSource] = useState<string>("LIVE MOCK");

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch("/api/exchange-rate");
        const data = await response.json();
        if (data.rate) {
          setRate(data.rate);
          setSource(data.source || "Bank of Taiwan");
        }
      } catch (error) {
        console.error("Failed to fetch rate:", error);
      }
    };

    fetchRate();
    const interval = setInterval(fetchRate, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-[#E5E1D8] rounded-2xl p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F27D26]/10 flex items-center justify-center text-[#F27D26]">
          <TrendingUp size={20} />
        </div>
        <div>
          <p className="text-xs text-[#2C3E50]/60 font-medium uppercase tracking-wider">JPY Exchange Rate</p>
          <p className="text-lg font-bold text-[#2C3E50]">1 TWD ≈ {(1 / rate).toFixed(2)} JPY</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-[#2C3E50]/40 font-mono">{source}</p>
        <p className="text-sm font-semibold text-[#2C3E50]">{rate.toFixed(4)}</p>
      </div>
    </div>
  );
};

const DepartureInfo: React.FC<{ copyToClipboard: (text: string) => void }> = ({ copyToClipboard }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-[#E5E1D8] rounded-[2rem] p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-[#E5E1D8] pb-3">
        <Plane className="text-[#F27D26]" size={18} />
        <h3 className="font-bold text-sm text-[#2C3E50]">出發當天重要資訊</h3>
        <span className="text-[9px] bg-[#F27D26]/10 text-[#F27D26] px-2 py-0.5 rounded-full font-black ml-auto">
          請務必牢記
        </span>
      </div>

      <div className="space-y-3">
        {/* 團號 */}
        <div className="flex items-center justify-between bg-[#F9F7F2]/50 p-3 rounded-2xl border border-[#E5E1D8]/60">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-[#2C3E50]/60" />
            <span className="text-xs font-bold text-[#2C3E50]/70">團號</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-[#2C3E50]">NFF061405BR6K</span>
            <button 
              onClick={() => copyToClipboard("NFF061405BR6K")} 
              className="p-1 hover:bg-[#E5E1D8]/50 rounded text-[#F27D26] transition-colors"
              title="複製團號"
            >
              <Copy size={12} />
            </button>
          </div>
        </div>

        {/* 集合時間 */}
        <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#F27D26]" />
            <span className="text-xs font-bold text-amber-900">集合時間</span>
            <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold ml-auto">請勿遲到</span>
          </div>
          <p className="text-sm font-black text-amber-900 pl-6">
            2026 / 06 / 14 (日) 13:30
          </p>
        </div>

        {/* 集合地點 */}
        <div className="bg-[#2C3E50] text-white p-3 rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#F27D26]" />
            <span className="text-xs font-bold opacity-90">集合地點</span>
          </div>
          <div className="pl-5 space-y-1.5">
            <p className="text-xs font-bold leading-relaxed">
              高雄小港國際機場長榮航空櫃台 (國際線3樓)
            </p>
            <div className="flex gap-2 pt-1">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=高雄小港國際機場長榮航空櫃台" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] bg-white/15 hover:bg-white/20 px-2.5 py-1 rounded-md font-bold transition-colors"
              >
                <Navigation size={10} className="text-[#F27D26]" />
                導航
              </a>
              <button 
                onClick={() => copyToClipboard("高雄小港國際機場長榮航空櫃台 (國際線3樓)")} 
                className="inline-flex items-center gap-1 text-[10px] bg-white/15 hover:bg-white/20 px-2.5 py-1 rounded-md font-bold transition-colors"
              >
                <Copy size={10} />
                複製地點
              </button>
            </div>
          </div>
        </div>

        {/* 領隊聯絡資訊 */}
        <div className="space-y-2 border-t border-[#E5E1D8] pt-3">
          <div className="flex items-center gap-2">
            <User size={14} className="text-[#2C3E50]/60" />
            <span className="text-xs font-bold text-[#2C3E50]">導遊與通訊電話</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2 pl-5">
            {/* 領隊 */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-[#E5E1D8]/20">
              <span className="text-[#2C3E50]/60">領隊導遊</span>
              <span className="font-bold text-[#2C3E50]">石翊君小姐</span>
            </div>
            
            {/* 國內電話 */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-[#E5E1D8]/20">
              <span className="text-[#2C3E50]/60">國內電話</span>
              <div className="flex items-center gap-1.5">
                <a href="tel:0988756848" className="font-bold text-[#2C3E50] hover:underline hover:text-[#F27D26]">0988756848</a>
                <button 
                  onClick={() => copyToClipboard("0988756848")} 
                  className="p-1 hover:bg-[#E5E1D8]/40 rounded text-[#F27D26]"
                  title="複製電話"
                >
                  <Copy size={10} />
                </button>
              </div>
            </div>
            
            {/* 國外電話 */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-[#E5E1D8]/20">
              <span className="text-[#2C3E50]/60">國外電話</span>
              <div className="flex items-center gap-1.5">
                <a href="tel:08019706957" className="font-bold text-[#2C3E50] hover:underline hover:text-[#F27D26]">08019706957</a>
                <button 
                  onClick={() => copyToClipboard("08019706957")} 
                  className="p-1 hover:bg-[#E5E1D8]/40 rounded text-[#F27D26]"
                  title="複製電話"
                >
                  <Copy size={10} />
                </button>
              </div>
            </div>

            {/* 機場服務專線 */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-[#E5E1D8]/20">
              <span className="text-[#2C3E50]/60">機場服務專線</span>
              <div className="flex items-center gap-1.5">
                <a href="tel:0966-606-010" className="font-bold text-[#2C3E50] hover:underline hover:text-[#F27D26]">0966-606-010</a>
                <button 
                  onClick={() => copyToClipboard("0966-606-010")} 
                  className="p-1 hover:bg-[#E5E1D8]/40 rounded text-[#F27D26]"
                  title="複製電話"
                >
                  <Copy size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 行李牌顏色 */}
        <div className="flex items-center justify-between border-t border-[#E5E1D8] pt-3 text-xs bg-pink-50/50 p-2.5 rounded-2xl border border-pink-100">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-pink-600" />
            <span className="font-bold text-pink-900">行李牌顏色</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E0115F]" />
            <span className="font-bold text-pink-900">桃紅色_插畫</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DayCard: React.FC<{ day: ItineraryItem }> = ({ day }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent));
    }
  }, []);

  return (
    <motion.div 
      layout
      className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-sm mb-6"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex items-start justify-between gap-4"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#2C3E50] text-white flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold uppercase opacity-60">Day</span>
            <span className="text-xl font-bold leading-none">{day.day}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2C3E50] mb-1">{day.title}</h3>
            <p className="text-sm text-[#2C3E50]/70 line-clamp-1">{day.summary}</p>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="mt-2 text-[#2C3E50]/30"
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 space-y-8 border-t border-[#F9F7F2]">
              {/* Flight Info */}
              {day.flight && (
                <div className="bg-[#2C3E50] text-white rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Plane size={18} className="text-[#F27D26]" />
                      <span className="text-sm font-bold">{day.flight.airline} {day.flight.number}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase opacity-60">Flight Details</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-2xl font-black">{day.flight.departureTime}</p>
                      <p className="text-xs font-bold opacity-60 uppercase tracking-wider">{day.flight.departure}</p>
                    </div>
                    <div className="flex flex-col items-center px-4 opacity-40">
                      <div className="h-px w-12 bg-white mb-1" />
                      <Plane size={12} />
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-2xl font-black">{day.flight.arrivalTime}</p>
                      <p className="text-xs font-bold opacity-60 uppercase tracking-wider">{day.flight.arrival}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Spots */}
              <div className="space-y-6 pt-6">
                {day.spots.map((spot, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-[#E5E1D8]">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#E5E1D8] border-4 border-white" />
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[#2C3E50]">{spot.name}</h4>
                      {spot.time && (
                        <span className="text-[10px] bg-[#F9F7F2] px-2 py-1 rounded-full text-[#2C3E50]/60 font-bold flex items-center gap-1">
                          <Clock size={10} /> {spot.time}
                        </span>
                      )}
                    </div>
                    
                    {/* Attraction Image */}
                    <div className="mb-3 rounded-2xl overflow-hidden aspect-[16/10] bg-[#F9F7F2]">
                      <img 
                        src={spot.image} 
                        alt={spot.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <p className="text-sm text-[#2C3E50]/70 mb-3 leading-relaxed">{spot.description}</p>
                    {spot.tips && (
                      <div className="bg-[#F9F7F2] p-3 rounded-xl text-xs text-[#2C3E50]/60 italic mb-3">
                        💡 {spot.tips}
                      </div>
                    )}
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#2C3E50] hover:underline"
                    >
                      <Navigation size={14} className="text-[#F27D26]" />
                      Google Maps 導航
                    </a>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {day.recommendations && day.recommendations.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-[#E5E1D8]">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag size={18} className="text-[#F27D26]" />
                    <h4 className="font-bold text-[#2C3E50]">在地推薦 (美食/店家/伴手禮)</h4>
                  </div>
                  <div className="grid gap-3">
                    {day.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-white border border-[#E5E1D8] rounded-2xl p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            rec.type === 'food' ? 'bg-orange-100 text-orange-600' : 
                            rec.type === 'souvenir' ? 'bg-pink-100 text-pink-600' : 
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {rec.type === 'food' ? <Utensils size={16} /> : 
                             rec.type === 'souvenir' ? <ShoppingBag size={16} /> : 
                             <Coffee size={16} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="font-bold text-sm text-[#2C3E50]">{rec.name}</p>
                              {rec.link && (
                                <a 
                                  href={rec.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#F27D26] hover:opacity-80"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-[#2C3E50]/60 mt-1">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meals */}
              <div className="bg-[#F9F7F2] rounded-2xl p-5 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-[#2C3E50]/40 uppercase mb-1">早</p>
                  <p className="text-xs font-medium text-[#2C3E50]">{day.meals.breakfast}</p>
                </div>
                <div className="text-center border-x border-[#E5E1D8]">
                  <p className="text-[10px] font-bold text-[#2C3E50]/40 uppercase mb-1">午</p>
                  <p className="text-xs font-medium text-[#2C3E50]">{day.meals.lunch}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-[#2C3E50]/40 uppercase mb-1">晚</p>
                  <p className="text-xs font-medium text-[#2C3E50]">{day.meals.dinner}</p>
                </div>
              </div>

              {/* Hotel */}
              {day.hotel.name !== "溫暖的家" && (
                <div className="border-t border-[#E5E1D8] pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Hotel size={18} className="text-[#2C3E50]" />
                    <h4 className="font-bold text-[#2C3E50]">住宿資訊</h4>
                  </div>
                  <a 
                    href={day.hotel.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(day.hotel.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#2C3E50] text-white p-5 rounded-2xl mb-4 hover:bg-[#34495E] transition-colors group"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold">{day.hotel.name}</p>
                      <Navigation size={14} className="text-[#F27D26] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>

                  {day.hotel.warning && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 leading-relaxed font-semibold">
                      ⚠️ <strong>此飯店溫馨叮嚀：</strong>{day.hotel.warning}
                    </div>
                  )}

                  {day.hotel.nearby.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-[#2C3E50]/60 uppercase tracking-wider">
                        {day.hotel.nearby.some(item => item.isCar) ? "周邊機能搜尋" : "周邊機能搜尋 (步行 30 分鐘內)"}
                      </p>
                      <div className="flex flex-col gap-2">
                        {day.hotel.nearby.map((item, idx) => {
                          const mapUrl = isMobile && item.directionsLink ? item.directionsLink : item.link;
                          return (
                            <a 
                              key={idx}
                              href={mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-3 bg-white border border-[#E5E1D8] rounded-xl text-xs font-medium text-[#2C3E50] flex items-center justify-between hover:bg-[#F9F7F2] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <ShoppingBag size={14} className="text-[#F27D26]" />
                                <span>
                                  {item.isCar 
                                    ? `${item.name}(${item.category})(開車${item.time}分鐘)` 
                                    : `${item.name}(${item.category})(${item.time}分鐘)`}
                                </span>
                              </div>
                              <ExternalLink size={12} className="opacity-30" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedPhrase, setSelectedPhrase] = useState<{jp: string, cn: string} | null>(null);
  const [showToast, setShowToast] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#2C3E50] font-sans selection:bg-[#F27D26]/20">
      {/* Copy Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[100] bg-[#2C3E50] text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse" />
            已複製到剪貼簿 / Copied
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Phrase Modal */}
      <AnimatePresence>
        {selectedPhrase && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#2C3E50] flex flex-col items-center justify-center p-8 text-center"
            onClick={() => setSelectedPhrase(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="space-y-8 w-full"
            >
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest">請出示給對方看 / Please show this</p>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight break-words">
                {selectedPhrase.jp}
              </h2>
              <div className="h-px w-24 bg-[#F27D26] mx-auto" />
              <p className="text-2xl text-white/60 font-medium">
                {selectedPhrase.cn}
              </p>
              <button 
                className="mt-12 px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhrase(null);
                }}
              >
                關閉 / Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#E5E1D8] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-lg font-black tracking-tighter">KYUSHU <span className="text-[#F27D26]">5D</span></h1>
          <nav className="flex gap-1">
            <button 
              onClick={() => scrollToSection('itinerary')}
              className="px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-colors"
            >
              行程
            </button>
            <button 
              onClick={() => scrollToSection('useful-info')}
              className="px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-colors"
            >
              資訊
            </button>
            <button 
              onClick={() => scrollToSection('japanese')}
              className="px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-colors"
            >
              日文
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#F27D26] uppercase tracking-[0.2em]">Travel Brochure</span>
            <h2 className="text-4xl font-black leading-[0.9] tracking-tighter">
              九州閃亮亮<br />
              <span className="text-[#2C3E50]/40 italic serif">Shining Kyushu</span>
            </h2>
            <p className="text-sm text-[#2C3E50]/60 font-medium">皿倉山夜景 • 熊本城 • 湯布院 • 雙電車雙溫泉</p>
          </div>
          
          <ExchangeRate />
          
          <DepartureInfo copyToClipboard={copyToClipboard} />
          
          <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" 
              alt="Kyushu" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Departure Date</p>
              <p className="text-xl font-bold">2026 / 06 / 14</p>
            </div>
          </div>
        </section>

        {/* Itinerary Section */}
        <section id="itinerary" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Calendar size={24} className="text-[#F27D26]" />
              每日行程
            </h3>
            <span className="text-[10px] font-bold text-[#2C3E50]/40 uppercase">5 Days Total</span>
          </div>
          
          <div className="space-y-4">
            {MERGED_ITINERARY_DATA.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
          </div>
        </section>

        {/* Useful Info Section */}
        <section id="useful-info" className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Info size={24} className="text-[#F27D26]" />
              實用旅遊筆記
            </h3>
            
            {/* Tax Refund */}
            <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag size={18} className="text-[#2C3E50]" />
                <h4 className="font-bold">退稅須知</h4>
              </div>
              <div className="space-y-4">
                {USEFUL_INFO.taxRefund.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs font-bold text-[#F27D26]">{item.title}</p>
                    <p className="text-sm text-[#2C3E50]/70 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Tips */}
            <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone size={18} className="text-[#2C3E50]" />
                <h4 className="font-bold">行前便攜指南</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {USEFUL_INFO.travelTips.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-[10px] font-bold text-[#2C3E50]/40 uppercase">{item.title}</p>
                    <p className="text-xs text-[#2C3E50]/70 font-medium">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 行動電源 2026 新規 */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
                <Battery size={18} className="text-amber-700 animate-pulse" />
                <h4 className="font-bold text-amber-900">🚨 行動電源 2026 最新登機規定</h4>
                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black ml-auto">航空法限制</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                近期國內外多起自燃事故，安檢規範全面收緊。違規可能在登機口要求丟棄或甚至拒載！
              </p>
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-2">
                  <span className="text-xs bg-amber-200 text-amber-900 rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="text-xs font-bold text-amber-950">絕對不可託運</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">行動電源與備用鋰電池「只能手提」，任何容量均無法放入託運行李。</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs bg-amber-200 text-amber-900 rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="text-xs font-bold text-amber-950">❌ 禁止放入「上方行李櫃」</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">必須放在「座位下方包包中」或「隨身椅袋內」。如發熱或冒煙，空服員與您才能第一時間處理。</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs bg-amber-200 text-amber-900 rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="text-xs font-bold text-amber-950">全程飛行中「禁止充電或使用」</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">長榮等各大航空全面禁止，亦不可用機上 USB 為行動電源充電。</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs bg-amber-200 text-amber-900 rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
                  <div>
                    <p className="text-xs font-bold text-amber-950">每人最多 2 顆（ICAO 2026/03 新規）</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">容量須 ≤ 100Wh (約 27,000 mAh 以下)，且標示需清晰。禁止攜帶不知名雜牌。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Japan Web 申報 */}
            <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E1D8]">
                <Smartphone size={18} className="text-[#2C3E50]" />
                <h4 className="font-bold text-[#2C3E50]">📲 Visit Japan Web 入境申報</h4>
                <span className="text-[9px] bg-[#F27D26]/10 text-[#F27D26] px-1.5 py-0.5 rounded font-black ml-auto">行前確認</span>
              </div>
              <p className="text-xs text-[#2C3E50]/80 leading-relaxed">
                出發前 7-10 天請務必主動向領隊<strong>石翊君小姐 (0988-756848)</strong> 打電話或在群組詢問：<strong>「本趟團體行程，Visit Japan Web 是旅行社統一包辦，還是需要團員自填？」</strong>
              </p>
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-[#F9F7F2] rounded-2xl border border-[#E5E1D8]">
                  <p className="text-xs font-bold text-[#2C3E50] mb-1">💡 若需「自行登錄」（常見）：</p>
                  <ul className="list-disc pl-4 text-[11px] text-[#2C3E50]/70 space-y-1">
                    <li>出發前至少 6 小時至 <a href="https://vjw.digital.go.jp/" target="_blank" rel="noopener noreferrer" className="text-[#F27D26] underline font-bold">VJW 官網</a>完成個人資料與申報。</li>
                    <li>
                      第一晚填載：<strong>QUINTESSA HOTEL FUKUOKA TENJIN MINAMI</strong>
                      <br/>(1-18-3 Shirogane, Chuo Ward, Fukuoka)
                    </li>
                    <li className="font-bold text-[#2C3E50]">產出入境與海關 QR Code 後，請務必截圖存於手機相簿。</li>
                  </ul>
                </div>
                <div className="p-3 bg-pink-50/40 rounded-2xl border border-pink-100 text-[11px] text-pink-900 leading-relaxed">
                  若偏好傳統紙本，亦可在飛機上向空服員索取<strong>紙本入境卡與海關申報單</strong>，親筆填寫一樣能順利通關。
                </div>
              </div>
            </div>

            {/* 天氣與雨具 */}
            <div className="bg-blue-50/40 border border-blue-100 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
                <CloudRain size={18} className="text-blue-600" />
                <h4 className="font-bold text-blue-900">☔ 九州梅雨季對策</h4>
                <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black ml-auto">6月陣雨多</span>
              </div>
              <p className="text-xs text-blue-900/80 leading-relaxed">
                6 月是九州梅雨季，福岡、熊本、別府大分平均雨量顯著，幾乎每日都有降雨可能。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 bg-white border border-blue-100 rounded-2xl">
                  <p className="font-bold text-blue-950 mb-1">👔 衣服穿搭</p>
                  <p className="text-[11px] text-blue-900/70 leading-relaxed">白天輕便短袖爲主，但必備<strong>薄長袖外套 1 件</strong>。山區、海邊風大或遊覽車及飯店冷氣房保暖好用。</p>
                </div>
                <div className="p-3 bg-white border border-blue-100 rounded-2xl">
                  <p className="font-bold text-blue-950 mb-1">🌂 抗雨準備</p>
                  <p className="text-[11px] text-blue-900/70 leading-relaxed">每人自備<strong>防風折疊傘</strong>、輕便雨衣、隨身防水袋與好走的防雨/防潑水鞋，避穿易濕的全新鞋。</p>
                </div>
              </div>
            </div>

            {/* 入境禁帶管制 */}
            <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-red-200">
                <ShieldAlert size={18} className="text-red-600 animate-pulse" />
                <h4 className="font-bold text-red-900">🚫 日本入境禁帶管制</h4>
                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black ml-auto">重罰警示</span>
              </div>
              <div className="text-xs text-red-900/80 leading-relaxed space-y-2">
                <div className="p-3 bg-white border border-red-100 rounded-2xl">
                  <p className="font-black text-red-700 mb-1">嚴格肉製品禁令 (最重要)</p>
                  <p className="text-[11px] text-red-950/80 leading-relaxed">
                    <strong>豬肉、牛肉、雞肉等所有肉製品</strong>（包括肉干、肉鬆、泡麵含肉調理包、甚至是<strong>未吃完的飛機餐點</strong>）因防非洲豬瘟嚴禁攜入日本。經查獲將重罰 <strong>300 萬日圓</strong>或面臨刑責！
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-white border border-red-100 rounded-2xl text-red-950/70 leading-relaxed">
                    <p className="font-bold text-red-800">新鮮水果與海鮮</p>
                    嚴格管制攜帶新鮮水果（柑橘、荔枝、芒果等）及活海鮮。脫水蔬菜與無肉果乾則沒問題。
                  </div>
                  <div className="p-3 bg-white border border-red-100 rounded-2xl text-red-950/70 leading-relaxed">
                    <p className="font-bold text-red-800">日常藥品與電捲棒</p>
                    隨身帶個人慢性病藥；感冒成藥可能有受限成分，建議少帶至日本現買。USB充電式電捲棒禁入，插電款可攜。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Japanese Section */}
        <section id="japanese" className="space-y-6">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Languages size={24} className="text-[#F27D26]" />
            簡單生活日文
          </h3>
          <div className="bg-[#2C3E50] text-white rounded-3xl p-6 space-y-6">
            {USEFUL_INFO.japanese.map((item, idx) => (
              <div 
                key={idx} 
                className="flex justify-between items-center gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0 cursor-pointer group"
                onClick={() => {
                  setSelectedPhrase(item);
                  copyToClipboard(item.jp);
                }}
              >
                <div className="space-y-1">
                  <p className="text-lg font-bold group-hover:text-[#F27D26] transition-colors">{item.jp}</p>
                  <p className="text-xs opacity-60">{item.cn}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#F27D26] transition-all">
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-24 text-center space-y-4 border-t border-[#E5E1D8]">
          <div className="flex justify-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E5E1D8] flex items-center justify-center text-[#2C3E50]">
              <Navigation size={18} />
            </div>
          </div>
          <p className="text-xs font-bold text-[#2C3E50]/40 uppercase tracking-widest">Have a nice trip to Kyushu</p>
          <p className="text-[10px] text-[#2C3E50]/20">© 2026 Kyushu Travel Brochure • All Rights Reserved</p>
        </footer>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50">
        <div className="bg-[#2C3E50] text-white rounded-full px-6 py-4 shadow-2xl flex items-center justify-around">
          <button onClick={() => scrollToSection('itinerary')} className="flex flex-col items-center gap-1">
            <Calendar size={20} />
            <span className="text-[10px] font-bold uppercase">行程</span>
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button onClick={() => scrollToSection('useful-info')} className="flex flex-col items-center gap-1">
            <Info size={20} />
            <span className="text-[10px] font-bold uppercase">資訊</span>
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button onClick={() => scrollToSection('japanese')} className="flex flex-col items-center gap-1">
            <Languages size={20} />
            <span className="text-[10px] font-bold uppercase">日文</span>
          </button>
        </div>
      </div>
    </div>
  );
}
