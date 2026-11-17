import { element, formatMoney } from "./common.js";
import { connectChart } from "./chart.js";
import { projectGrowth } from "./model.js";

const form = document.querySelector("#calculator");
const output = document.querySelector("#calc-output");
const status = document.querySelector("#calc-status");
const stats = document.querySelector("#stats");
const table = document.querySelector("#annual-values");
const fields = Array.from(form.querySelectorAll("input"));
const draw = connectChart(document.querySelector("#growth-chart"));

function setError(field, message) {
  document.querySelector("#" + field.id + "-error").textContent = message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

function validate(field) {
  const { valueMissing, badInput, rangeOverflow, rangeUnderflow, stepMismatch } = field.validity;
  if (badInput || valueMissing) return "請輸入有效數字。";
  if (rangeOverflow || rangeUnderflow) return "請輸入 " + field.min + " 至 " + field.max + " 之間的數字。";
  if (stepMismatch) return field.step === "1" ? "請輸入整數。" : "請最多輸入兩位小數。";
  return "";
}

function showResult() {
  const input = Object.fromEntries(fields.map((field) => [field.name, field.valueAsNumber]));
  const points = projectGrowth(input);
  const { asset, invested } = points.at(-1);
  const difference = Math.round(asset - invested);
  const statsData = [
    ["期末資產", formatMoney(asset), ""],
    ["累積投入", formatMoney(invested), ""],
    [difference < 0 ? "假設減值" : "假設增值", (difference < 0 ? "−" : difference > 0 ? "+" : "") + formatMoney(Math.abs(difference)), difference < 0 ? "loss" : "gain"]
  ];
  stats.replaceChildren(...statsData.map(([label, value, tone]) => {
    const item = element("div");
    item.append(element("dt", "", label), element("dd", tone, value));
    return item;
  }));
  table.replaceChildren(...points.map((point) => {
    const row = element("tr");
    const label = element("th", "", point.year ? "第 " + point.year + " 年" : "初始");
    label.scope = "row";
    row.append(label, element("td", "", formatMoney(point.invested)), element("td", "", formatMoney(point.asset)));
    return row;
  }));
  output.hidden = false;
  status.textContent = input.years + " 年後的假設資產為 " + formatMoney(asset) + "。";
  draw(points);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const invalid = fields.filter((field) => {
    const message = validate(field);
    setError(field, message);
    return message;
  });
  if (invalid.length) {
    output.hidden = true;
    status.textContent = "請修正輸入後再試算。";
    invalid[0].focus();
    return;
  }
  showResult();
});

form.addEventListener("input", (event) => {
  if (event.target.hasAttribute("aria-invalid")) setError(event.target, validate(event.target));
  if (!output.hidden) status.textContent = "條件已變更。請按「開始試算」更新下方結果。";
});

form.addEventListener("reset", () => {
  requestAnimationFrame(() => {
    fields.forEach((field) => setError(field, ""));
    showResult();
  });
});

showResult();
