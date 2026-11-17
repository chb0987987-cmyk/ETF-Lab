export function element(tag, className = "", text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function link(href, text, className = "") {
  const node = element("a", className, text);
  node.href = href;
  return node;
}

export function sourceItem(source) {
  const item = element("li");
  const url = new URL(source.url);
  if (url.protocol !== "https:") throw new Error("Source must use HTTPS");
  item.append(link(url.href, source.label), element("small", "", source.scope));
  return item;
}

export async function readData(path) {
  const response = await fetch(new URL("../data/" + path, import.meta.url));
  if (!response.ok) throw new Error("JSON 載入失敗 (" + response.status + ")");
  return response.json();
}

export function articleUrl(slug) {
  return "./article.html?slug=" + encodeURIComponent(slug);
}

const currency = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 });

export function formatMoney(value) {
  return "NT$" + currency.format(value);
}

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
const mobile = matchMedia("(max-width: 700px)");

function updateMenu(open) {
  toggle.hidden = !mobile.matches;
  toggle.setAttribute("aria-expanded", String(mobile.matches && open));
  nav.hidden = mobile.matches && !open;
}

toggle.addEventListener("click", () => updateMenu(nav.hidden));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobile.matches && !nav.hidden) {
    updateMenu(false);
    toggle.focus();
  }
});
mobile.addEventListener("change", () => updateMenu(false));
updateMenu(false);

const repository = document.querySelector("#repository-link");
const [, account] = location.hostname.match(/^([a-z0-9-]+)\.github\.io$/i) ?? [];
const project = location.pathname.split("/")[1];
if (repository && account && /^[a-z0-9_.-]+$/i.test(project) && project !== "about.html") {
  repository.href = "https://github.com/" + account + "/" + project;
  repository.hidden = false;
}
