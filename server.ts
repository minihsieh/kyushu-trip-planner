import express from "express";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JPY Exchange Rate API (Scrapes Bank of Taiwan, with live resilient global API fallback)
  app.get("/api/exchange-rate", async (req, res) => {
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
      
      $("table tr, tr").each((i, el) => {
        const text = $(el).text();
        if (text.includes("日圓") && text.includes("JPY")) {
          // Attempt parsing using standard data-table attribute selector
          const spotSelling = $(el).find('td[data-table="本行賣出"].rate-content-sight').text().trim();
          if (spotSelling) {
            const parsed = parseFloat(spotSelling);
            if (!isNaN(parsed) && parsed > 0) {
              jpyRate = parsed;
              return false; // Break loop
            }
          }
          // Fallback parsing: spot selling is usually the 5th column cell (index 4)
          const tds = $(el).find("td");
          if (tds.length >= 5) {
            const colText = $(tds[4]).text().trim();
            const parsed = parseFloat(colText);
            if (!isNaN(parsed) && parsed > 0) {
              jpyRate = parsed;
              return false; // Break loop
            }
          }
        }
      });

      if (jpyRate > 0) {
        return res.json({ 
          rate: jpyRate, 
          source: "臺灣銀行 (即時官網)", 
          timestamp: new Date().toISOString() 
        });
      }
      throw new Error("無法從臺灣銀行 HTML 網頁解析日圓匯率資料");
    } catch (error: any) {
      botErrorMsg = error.message || String(error);
      console.warn("臺灣銀行官網連線或解析失敗（可能受防火牆或WAF阻擋雲端IP），使用即時備份 API。錯誤訊息:", botErrorMsg);
    }

    // High performance Resilient Fallback to standard free Live Exchange Rate API
    try {
      const backupResponse = await axios.get("https://open.er-api.com/v6/latest/JPY", { timeout: 3000 });
      if (backupResponse.data && backupResponse.data.result === "success" && backupResponse.data.rates && backupResponse.data.rates.TWD) {
        const liveTwdRate = backupResponse.data.rates.TWD;
        return res.json({
          rate: liveTwdRate,
          source: "全球匯率中心 (即時備用)",
          timestamp: new Date().toISOString(),
          botError: botErrorMsg
        });
      }
    } catch (fallbackError: any) {
      console.error("備用全球匯率 API 連線失敗:", fallbackError.message || fallbackError);
    }

    // Offline absolute safe fallback
    res.json({ 
      rate: 0.2078, 
      source: "系統預設/歷史匯率 (離線備用)", 
      timestamp: new Date().toISOString(),
      botError: botErrorMsg
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
