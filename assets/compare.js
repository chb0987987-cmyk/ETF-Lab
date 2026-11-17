import { element, readData, sourceItem } from "./common.js";

const choices = document.querySelector("#choices");
const status = document.querySelector("#compare-status");
const comparison = document.querySelector("#comparison");
const insight = document.querySelector("#compare-insight");
const defaultInsight = insight.textContent;

function list(values, buildItem) {
  const node = element("ul", "source-list");
  node.append(...values.map(buildItem));
  return node;
}

function renderTable(etfs) {
  const table = element("table", "compare-table");
  const header = table.createTHead().insertRow();
  const label = element("th", "", "比較項目");
  label.scope = "col";
  header.append(label);
  for (const etf of etfs) {
    const cell = element("th");
    cell.scope = "col";
    cell.append(element("span", "ticker", etf.ticker), document.createTextNode(etf.name));
    header.append(cell);
  }

  const rows = [
    ["發行投信", (etf) => etf.issuer],
    ["投資類型", (etf) => etf.type],
    ["追蹤指數", (etf) => etf.index],
    ["選股方式", (etf) => etf.approach],
    ["收益分配", (etf) => etf.distribution],
    ["經理費／年", (etf) => etf.fees.management],
    ["保管費／年", (etf) => etf.fees.custody],
    ["費率生效日", (etf) => etf.fees.effectiveDate ?? "查閱來源與最新公開說明書"],
    ["集中度", (etf) => etf.concentration],
    ["主要風險", (etf) => list(etf.risks, (risk) => element("li", "", risk))],
    ["最後查證", (etf) => {
      const date = element("time", "", etf.lastVerified);
      date.dateTime = etf.lastVerified;
      return date;
    }],
    ["官方來源", (etf) => list(etf.sources, sourceItem)]
  ];
  const body = table.createTBody();
  for (const [name, getValue] of rows) {
    const row = body.insertRow();
    const key = element("th", "", name);
    key.scope = "row";
    row.append(key);
    for (const etf of etfs) row.insertCell().append(getValue(etf));
  }
  comparison.replaceChildren(table);
  comparison.hidden = false;
}

try {
  const { etfs } = await readData("etfs.json");
  const inputs = etfs.map((etf) => {
    const label = element("label", "choice");
    const input = element("input");
    input.type = "checkbox";
    input.value = etf.ticker;
    input.checked = true;
    label.append(input, document.createTextNode(etf.ticker + " " + etf.name));
    choices.append(label);
    return input;
  });
  choices.querySelector("p").remove();

  const selected = () => etfs.filter((_, index) => inputs[index].checked);
  function render() {
    const items = selected();
    renderTable(items);
    status.textContent = "已選 " + items.length + " 檔。手機可橫向捲動比較表。";
    const tickers = items.map((item) => item.ticker);
    insight.textContent = tickers.includes("0050") && tickers.includes("006208")
      ? "0050 和 006208 追蹤同一個臺灣50指數，持股曝險高度重疊。可以比較兩者的費用、交易條件與追蹤表現。"
      : defaultInsight;
  }
  choices.addEventListener("change", (event) => {
    if (!selected().length) {
      event.target.checked = true;
      status.textContent = "請至少保留一檔商品。";
      return;
    }
    render();
  });
  render();
} catch (error) {
  choices.replaceChildren(element("p", "", "暫時無法載入比較資料，請重新整理。"));
  console.error(error);
}
