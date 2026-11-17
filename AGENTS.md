# ETF Lab 專案協作規範

## 1. 專案目的

ETF Lab 是給臺灣投資新手的繁體中文學習網站。依序認識 ETF、讀懂商品差異，再用假設數字練習複利與定期定額。全站以教育為目的，維持中性敘述，避免買賣建議、報酬保證、商品排名及容易被當成行情的模擬數據。

## 2. 技術與部署

- 使用 HTML5、CSS、原生 JavaScript ES modules、Canvas 與 UTF-8 JSON。網站可由任意靜態 HTTP 伺服器提供，無須安裝前端套件。
- GitHub Pages 從 main 分支的根目錄發布，入口為 index.html，保留空白的 .nojekyll。
- HTML、JS、CSS、JSON 路徑須保留相對解析。HTML 連到 ./learn.html；JS 使用相對 module import，共用 fetch helper 相對於 assets/common.js 載入 ../data/。連結須支援 /etf-lab/ 之類的專案子路徑。
- 資料採靜態快照。網站的閱讀、比較與試算均在瀏覽器執行，沒有帳號、資料庫、外部行情 API 或追蹤程式。公開部署與權限設定依當次使用者指示執行。

## 3. 目錄與責任

| 路徑 | 用途 |
| --- | --- |
| index.html | 首頁、學習動線與精選文章 |
| learn.html | 學習中心、關鍵字搜尋與分類 |
| article.html?slug=<slug> | 所有教材共用的文章模板 |
| compare.html | 教學商品選擇、並排比較與官方來源 |
| calculator.html | 複利與定期定額試算、年末圖表與資料表 |
| about.html | 專案目的、來源原則、範圍與 repo 公開方式 |
| assets/favicon.png | 瀏覽器頁籤圖示 |
| assets/styles.css | 色彩、排版、共用元件、斷點與焦點樣式 |
| assets/common.js | 導覽、資料載入、共用 DOM 元件與格式 |
| assets/home.js | 首頁示意圖表與精選入口 |
| assets/learn.js | 首頁精選、中心搜尋與文章模板 |
| assets/compare.js | 商品選擇與比較結果 |
| assets/calculator.js | 試算表單與結果 |
| assets/model.js | 每月複利模型與年度資料 |
| assets/chart.js | Canvas 圖表，含大小調整 |
| data/articles/index.json | 分類、文章摘要索引、首頁精選 ID |
| data/articles/<slug>.json | 單篇教材完整內文 |
| data/etfs.json | ETF 比較資料 |
| README.md | 本機預覽、內容維護、驗收與部署 |

## 4. 視覺與可及性

- 延續深海軍藍與青綠色。背景使用 --bg（#0a121e）、卡片 --surface（#101e2c）、正文 --text（#eef6ff）、次要文字 --muted（#a3b5c9）、互動強調 --accent（#52ebba）。新增顏色寫成 styles.css 的變數並檢查暗底對比。
- 延續 .wrap 內容寬度、.panel 與 .card 卡片、.button 主次按鈕、.site-header 與 .site-footer。標題沿用系統無襯線字體與繁體中文字體備援，數據用等寬字與 tabular-nums。每頁只有一個 h1。
- 桌面可呈現多欄閱讀卡片，手機以單欄為主。表格放入有名稱、可聚焦的水平捲動區，頁面本體維持在螢幕寬度內。斷點以共用 CSS 為準。
- 使用原生按鈕、連結、表單與表格。保留跳至主內容、aria-current、可見鍵盤焦點、輸入標籤、錯誤提示及狀態訊息。圖表保留表格等文字替代。盈虧同時使用正負號與文字。
- 內文使用繁體中文與臺灣投資術語。動態內容用 textContent 或 DOM API，外部來源經 HTTPS 協定檢查。保留 prefers-reduced-motion 支援。

## 5. 內容 Schema

所有 JSON 使用 UTF-8、雙引號和 2 空白縮排。陣列順序即顯示順序。必要文字欄位應為非空字串。日期為實際有效的 YYYY-MM-DD，使用臺灣日期。

### 教材索引 data/articles/index.json

| 欄位 | 型別與規則 |
| --- | --- |
| categories | 陣列。每筆含唯一 id 與 label。當前分類為 basics、types、strategy、risk |
| articles | 陣列。每筆含 id、slug、title、category、difficulty、minutes、summary、tags |
| featured | 至多 3 個不重複的文章 id，依首頁顯示順序排列 |

| 教材摘要欄位 | 型別與規則 |
| --- | --- |
| id | 穩定、唯一的字串，例如 etf-basics-001 |
| slug | 唯一小寫英文 kebab-case，與 JSON 檔名相同 |
| title、summary | 繁體中文標題與一至兩句摘要 |
| category | 既有 categories[].id |
| difficulty | beginner 或 intermediate |
| minutes | 1 至 60 的整數，估計閱讀時間 |
| tags | 非空字串陣列，收錄同義詞、常見縮寫或搜尋用詞 |

### 教材內文 data/articles/<slug>.json

內文檔保存教學內容，索引保存中繼資料。內文的 id、slug 必須與索引完全相同。

| 欄位 | 型別與規則 |
| --- | --- |
| id、slug | 比對索引的識別碼 |
| takeaways | 2 至 4 個核心觀念的字串陣列 |
| sections | 至少 2 項。每項含 heading 與 paragraphs，paragraphs 為非空字串陣列 |
| diagram | 含 title、steps。steps 為 2 至 4 項短句，組成可用文字理解的圖解 |
| example | 含 title、body 的教學範例。假想數字應在正文標示 |
| misconceptions | 至少 1 項。每項含 claim 與 explanation |
| sources | 至少 1 筆來源。每項含 label、url、scope，分別為來源名稱、HTTPS 網址、對應觀念 |
| lastVerified | 實際查讀 sources 的日期 |

模板依序顯示摘要、核心觀念、內文、圖解、範例、常見誤解、資料來源及延伸閱讀。內文補充來源用 [1]、[2] 對應 sources 的 1-based 順序。初版可參考 what-is-etf.json。搜尋覆蓋標題、摘要、標籤和分類。新增文章時把檔案與索引記錄一起提交。

### 比較資料 data/etfs.json

根物件的 etfs 陣列每筆包含以下欄位。欄位均必填，fees.effectiveDate 可使用 null 代表官網未列適用起日。

| 欄位 | 型別與規則 |
| --- | --- |
| ticker | 4 至 6 字元、數字開頭且可帶大寫字母，保留前導零且唯一 |
| name、issuer、type、index | 字串。交易簡稱、投信、教學分類、官方追蹤指數 |
| approach、distribution | 字串。指數方法及已查證的收益分配規則或近況 |
| fees | 含 management、custody、effectiveDate。前兩項為字串，費率級距須標清單位與計費方式 |
| concentration | 字串。說明結構性的集中度，不把持股比例當固定值 |
| risks | 非空字串陣列，至少列出一項產品特有風險 |
| sources | 至少 1 筆，同教材來源格式 |
| lastVerified | 實際查讀官方資料的日期。與官方生效日、公告日及資料基準日分開 |

## 6. 命名與連結

- 頁面、CSS、JS、JSON 用小寫英文，兩字以上用連字號。AGENTS.md、README.md 與 .nojekyll 依慣例命名。
- 新教材的 slug 僅用 a–z、0–9 與單一連字號，開頭與結尾須為英數字元。既有公開 slug 維持穩定。連結由 article.html?slug= 搭配 URL 編碼產生。
- JS 變數與 JSON 欄位用 camelCase，CSS 類別用 kebab-case。用 ASCII 大小寫一致的路徑，避免在 Windows 可用而 GitHub Pages 失效。

## 7. 查證與金融內容

1. 先用臺灣證券交易所或公開資訊觀測站對照代號、名稱與指數，再到發行投信的基金頁、公開說明書或公告查看費用、收益分配及適用日期。指數選股與權重規則以指數公司文件為準。通用觀念可輔以 SEC Investor.gov，歸屬各市場的稅費、法規及交易限制不得混用。
2. 點開來源找出可支持文字的欄位。來源若不一致，優先採用適用日期較新且有明確生效依據的官方文件。資料不足時寫「請參照發行人公告」並附查詢來源。
3. 區分靜態查證日與數據基準日。重新查讀後再更新 lastVerified。商品費率若採級距，費率範圍不可當成實際成本或總費用率。配息頻率、配息金額和報酬有各自意義。
4. 清楚說明市場、集中度、流動性、折溢價、追蹤偏離等適用風險。區分價格報酬、現金分配、含息總報酬與再投入。教材用自己的話說明，旁附可查的來源與必要前提。
5. 試算定義為固定有效年化報酬率轉等效月報酬率，每月先計當期報酬，再於月底投入。M = (1 + R/100)^(1/12) - 1，B(n) = B(n-1) × (1 + M) + C。固定年化假設反映平滑的總報酬情境，未另計費用、稅、通膨、匯率和報酬波動。累積投入 = 初始本金 + 月投入 × 月數。用全精度運算，金額只在顯示時四捨五入。0% 和負報酬皆須正確處理。

## 8. AI 維護流程

1. 先讀 README、本文件及同類的資料檔，確認變更應落在資料、共用樣式或功能模組。
2. 新增教材時複用現有分類與文章模板。建立內文 JSON、追加索引。只有需要調整精選時才更新 featured。新增 ETF 時查證來源、更新 etfs 陣列並使用現有比較元件。
3. 尊重已公開的 slug、資料欄位與相對路徑。需要變更 Schema 時，同步修改資料、消費它的頁面與本規範，並驗證既有項目。
4. 修改金融資料時同步更新該資料的快照註解與來源。對外公開前確認交付資料沒有個人資料、金鑰或本機暫存檔。
5. 交付時列出受影響的檔案、驗證方式、資料查證日、剩餘限制與部署狀態。

## 9. 驗收清單

- [ ] 用 HTTP 開啟根路徑與一個專案子路徑，確認主要頁面、CSS、JS、JSON 和文章深連結均可讀取及重新整理。
- [ ] 驗證 JSON 可解析，索引 id、slug 和來源對得上。逐個開啟教材，檢查圖解、誤解、來源日期與延伸閱讀。未知 slug 顯示返回入口。
- [ ] 搜尋繁體關鍵字、同義詞與 ETF 縮寫。測試分類交集、無結果與清除操作。新增一筆暫存教材確認只需 JSON 便能顯示與搜尋，驗證後清理。
- [ ] 切換比較選項，確認保留至少一檔、費率與配息文字完整，查證日和個別來源可辨識。
- [ ] 試算用本金 100,000、月投入 1,000、1 年、0% 應得 112,000。以 1,000、零月投入、1 年、−10% 應得 900。另測正報酬、清空、超出範圍、圖表與年末表格。
- [ ] 檢查約 360、768、1440 px 的導覽、表單及表格，並使用鍵盤操作。看瀏覽器錯誤與資源載入狀態。
- [ ] 部署後開啟實際 GitHub Pages 網址，再抽查文章直接網址、手機版與試算，將可用網址與 repository 連結交付。

