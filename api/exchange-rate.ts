import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req: any, res: any) {
  let botErrorMsg = "";
  try {
    const response = await axios.get("https://rate.bot.com.tw/xrt?Lang=zh-TW", {
      timeout: 4000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache"
      }
    });
    const $ = cheerio.load(response.data);
    
    let jpyRate = 0;
    
    $("table tr, tr").each((i: number, el: any) => {
      const text = $(el).text();
      if (text.includes("日圓") && text.includes("JPY")) {
        const spotSelling = $(el).find('td[data-table="本行賣出"].rate-content-sight').text().trim();
        if (spotSelling) {
          const parsed = parseFloat(spotSelling);
          if (!isNaN(parsed) && parsed > 0) {
            jpyRate = parsed;
            return false;
          }
        }
        const tds = $(el).find("td");
        if (tds.length >= 5) {
          const colText = $(tds[4]).text().trim();
          const parsed = parseFloat(colText);
          if (!isNaN(parsed) && parsed > 0) {
            jpyRate = parsed;
            return false;
          }
        }
      }
    });

    if (jpyRate > 0) {
      return res.status(200).json({ 
        rate: jpyRate, 
        source: "臺灣銀行 (即時官網)", 
        timestamp: new Date().toISOString() 
      });
    }
    throw new Error("無法從臺灣銀行 HTML 網頁解析日圓匯率資料");
  } catch (error: any) {
    botErrorMsg = error.message || String(error);
  }

  try {
    const backupResponse = await axios.get("https://open.er-api.com/v6/latest/JPY", { timeout: 3000 });
    if (backupResponse.data && backupResponse.data.result === "success" && backupResponse.data.rates && backupResponse.data.rates.TWD) {
      const liveTwdRate = backupResponse.data.rates.TWD;
      return res.status(200).json({
        rate: liveTwdRate,
        source: "全球匯率中心 (即時備用)",
        timestamp: new Date().toISOString(),
        botError: botErrorMsg
      });
    }
  } catch (fallbackError: any) {
    // Silently proceed to final fallback
  }

  return res.status(200).json({ 
    rate: 0.2078, 
    source: "系統預設/歷史匯率 (離線備用)", 
    timestamp: new Date().toISOString(),
    botError: botErrorMsg
  });
}
