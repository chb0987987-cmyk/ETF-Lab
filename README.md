# ETF Lab｜ETF 投資新手學習網站

ETF Lab 是以繁體中文製作的投資教育網站。從認識 ETF 開始，接著閱讀商品資料，最後用可調整的輸入練習複利與定期定額。深海軍藍與青綠色介面支援桌面、平板及手機。

## 網站功能

- **首頁**提供三步學習路線、精選教材和複利情境。
- **ETF 學習中心**收錄七篇教材，支援標題、摘要、標籤及分類搜尋。所有文章使用共用模板，含觀念、圖解、範例、常見誤解、參考資料和延伸閱讀。
- **ETF 比較**可選擇 0050、006208、00940 並排比較。涵蓋指數、選股、收益分配、經理費、保管費、集中度、主要風險與查證日。
- **投資試算**接受初始本金、月底投入、年數與假設年化報酬率。計算期末資產、累積投入、假設增減值，並顯示成長圖與年度明細。
- **關於網站**說明教材目的、資料政策及專案維護方式。

## 本機預覽

解壓縮後，在含有 index.html 的 etf-lab 資料夾開啟終端機。若已安裝 Python 3，執行下列命令。

```sh
python -m http.server 8000 --bind 127.0.0.1
```

在瀏覽器開啟 [本機首頁](http://127.0.0.1:8000/)。使用任意靜態 HTTP 伺服器也可預覽。文章與商品資料透過 HTTP 載入，請由上述網址進入。按 Ctrl+C 可關閉預覽。

## 檔案結構

```text
etf-lab/
├── AGENTS.md
├── README.md
├── .nojekyll
├── index.html
├── learn.html
├── article.html
├── compare.html
├── calculator.html
├── about.html
├── assets/
│   ├── favicon.png
│   ├── styles.css
│   ├── common.js
│   ├── home.js
│   ├── learn.js
│   ├── compare.js
│   ├── calculator.js
│   ├── model.js
│   └── chart.js
└── data/
    ├── etfs.json
    └── articles/
        ├── index.json
        └── <slug>.json
```

## 新增教材

1. 閱讀 [AGENTS.md](./AGENTS.md) 的教材 Schema、來源與命名規則。
2. 參考 [配息與總報酬教材](./data/articles/distributions-and-total-return.json)，新增 data/articles/<slug>.json，填入內容、來源和查證日。
3. 在 [文章索引](./data/articles/index.json) 的 articles 陣列加入同 id、slug 的摘要與標籤。需要首頁精選時才調整 featured。
4. 進入學習中心，依分類及關鍵字找出新教材。也可直接開啟 article.html?slug=<slug>，重新整理後應能讀取。這個流程可沿用現有文章模板與樣式。

若要展示擴充，可請 AI 依 AGENTS.md 新增一篇「如何閱讀 ETF 公開說明書」，將新教材及索引更新提交成一筆 Git commit。

## 試算口徑

使用固定有效年化報酬率 r。等效月報酬率 m = (1 + r)^(1/12) − 1。每月更新順序為「前期資產 × (1 + m) + 月底投入」。初始本金一開始便參與計算。假設收益留在資產中。結果未另計手續費、稅、基金費用、通膨或匯率，未模擬市場波動與報酬順序，且實際投資可能虧損。

## GitHub Pages 部署

1. 在 GitHub 建立名為 etf-lab 的公開 repository。
2. 將 etf-lab 內的檔案及資料夾上傳到 main 分支的根目錄，包含 .nojekyll。確認 GitHub 的檔案清單第一層看得到 index.html、AGENTS.md、assets 和 data。
3. 開啟 repository 的 **Settings → Pages**。在 **Build and deployment** 的 **Source** 選 **Deploy from a branch**，選 **main** 和 **/(root)**，再按 **Save**。
4. 等 Pages 部署成功後，使用 Pages 頁面顯示的網址。專案網站一般位於 https://<GitHub帳號>.github.io/etf-lab/。請交付實際可開啟的 Pages 與 repository 網址。
5. 在正式網址測試首頁、文章直達及重新整理、商品選擇、試算和手機導覽。使用標準 github.io 專案網址時，關於頁會由網址取得原始碼連結。

可參考 [GitHub Pages 官方部署說明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 驗收與資料日期

- 從包含 etf-lab 子資料夾的上一層啟動預覽伺服器，再進入 /etf-lab/，可模擬 GitHub Pages 的專案路徑。
- 搜尋「配息」，切換分類並清除。開啟任一文章及不存在的 slug，確認正確呈現。
- 比較表切換成兩檔或一檔，手機可橫向捲動。嘗試取消最後一檔時應保留該項。
- 試算本金 NT$100,000、每月 NT$1,000、1 年、0% 應得 NT$112,000。使用本金 NT$1,000、每月 0、1 年、−10% 應得 NT$900。
- 商品為 2026-11-17 查證的教學快照。每個商品與教材保留各自的來源及日期。最新資訊以投信與證交所公告為準。

