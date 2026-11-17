import { articleUrl, element, link, readData, sourceItem } from "./common.js";

const difficulty = { beginner: "入門", intermediate: "進階" };
const categoryLabel = (index, id) => index.categories.find((category) => category.id === id).label;

function metadata(entry, index) {
  const meta = element("div", "lesson-meta");
  meta.append(
    element("span", "tag", categoryLabel(index, entry.category)),
    element("span", "", difficulty[entry.difficulty] + " · " + entry.minutes + " 分鐘")
  );
  return meta;
}

function lessonCard(entry, index) {
  const card = link(articleUrl(entry.slug), "", "lesson-card card");
  const heading = document.body.dataset.page === "index" ? "h3" : "h2";
  card.append(
    metadata(entry, index),
    element(heading, "lesson-title", entry.title),
    element("p", "", entry.summary),
    element("span", "lesson-action", "閱讀教材 →")
  );
  return card;
}

function renderLearn(index) {
  const search = document.querySelector("#search");
  const clear = document.querySelector("#clear-search");
  const result = document.querySelector("#results");
  const status = document.querySelector("#result-status");
  const categories = document.querySelector("#categories");
  let active = "";
  const options = [{ id: "", label: "全部" }, ...index.categories];
  for (const option of options) {
    const button = element("button", "filter", option.label);
    button.type = "button";
    button.dataset.category = option.id;
    button.addEventListener("click", () => {
      active = option.id;
      render();
    });
    categories.append(button);
  }
  const normalize = (text) => text.normalize("NFKC").toLocaleLowerCase("zh-TW");
  function render() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    const matches = index.articles.filter((item) => {
      const text = normalize([item.title, item.summary, categoryLabel(index, item.category), ...item.tags].join(" "));
      return (!active || item.category === active) && terms.every((term) => text.includes(term));
    });
    for (const button of categories.children) {
      button.setAttribute("aria-pressed", String(button.dataset.category === active));
    }
    clear.disabled = !search.value && !active;
    status.textContent = "找到 " + matches.length + " 篇教材";
    result.replaceChildren(...matches.map((item) => lessonCard(item, index)));
    if (!matches.length) {
      const empty = element("div", "panel empty-state");
      empty.append(element("h2", "", "沒有符合條件的教材"), element("p", "", "試試其他關鍵字，或清除搜尋與分類。"));
      result.append(empty);
    }
  }
  search.disabled = false;
  search.addEventListener("input", render);
  clear.addEventListener("click", () => {
    search.value = "";
    active = "";
    render();
    search.focus();
  });
  render();
}

function section(heading, className = "") {
  const node = element("section", className);
  node.append(element("h2", "", heading));
  return node;
}

function textList(tag, values) {
  const list = element(tag);
  list.append(...values.map((value) => element("li", "", value)));
  return list;
}

function renderArticle(container, entry, data, index) {
  document.title = entry.title + "｜ETF Lab";
  document.querySelector(".breadcrumbs span:last-child").textContent = entry.title;
  const heading = element("header", "article-heading");
  heading.append(metadata(entry, index), element("h1", "", entry.title), element("p", "", entry.summary));
  const content = element("div", "prose");

  const takeaways = section("核心觀念", "callout");
  takeaways.append(textList("ul", data.takeaways));
  content.append(takeaways);

  for (const item of data.sections) {
    const part = section(item.heading);
    part.append(...item.paragraphs.map((text) => element("p", "", text)));
    content.append(part);
  }

  const diagram = section(data.diagram.title, "panel diagram");
  diagram.append(textList("ol", data.diagram.steps));
  const example = section(data.example.title, "callout");
  example.append(element("p", "", data.example.body));
  const misconceptions = section("常見誤解");
  const myths = element("dl", "myth-list");
  for (const item of data.misconceptions) {
    myths.append(element("dt", "", item.claim), element("dd", "", item.explanation));
  }
  misconceptions.append(myths);

  const sources = section("資料來源");
  const verified = element("p", "muted", "最後查證 ");
  const date = element("time", "", data.lastVerified);
  date.dateTime = data.lastVerified;
  verified.append(date);
  const sourceList = element("ol", "source-list");
  sourceList.append(...data.sources.map(sourceItem));
  sources.append(verified, sourceList);

  const related = section("延伸閱讀");
  const links = element("div", "related");
  const otherEntries = index.articles.filter((item) => item.id !== entry.id);
  const relatedEntries = [
    ...otherEntries.filter((item) => item.category === entry.category),
    ...otherEntries.filter((item) => item.category !== entry.category)
  ].slice(0, 2);
  links.append(...relatedEntries.map((item) => link(articleUrl(item.slug), item.title)));
  links.append(link("./learn.html", "返回學習中心 →"));
  related.append(links);
  content.append(diagram, example, misconceptions, sources, related);
  container.replaceChildren(heading, content);
}

export async function loadFeatured(container) {
  try {
    const index = await readData("articles/index.json");
    const featured = index.featured.map((id) => index.articles.find((entry) => entry.id === id));
    container.replaceChildren(...featured.map((entry) => lessonCard(entry, index)));
  } catch (error) {
    container.replaceChildren(element("p", "muted", "暫時無法載入精選教材，請重新整理。"));
    console.error(error);
  }
}

async function openArticle(container, index) {
  const slug = new URLSearchParams(location.search).get("slug");
  const entry = index.articles.find((item) => item.slug === slug);
  if (!entry) {
    document.title = "找不到教材｜ETF Lab";
    container.replaceChildren(element("h1", "", "找不到這篇教材"), link("./learn.html", "返回學習中心 →"));
    return;
  }
  const data = await readData("articles/" + encodeURIComponent(entry.slug) + ".json");
  if (data.slug !== entry.slug || data.id !== entry.id) throw new Error("文章索引不一致");
  renderArticle(container, entry, data, index);
}

async function initializePage() {
  const page = document.body.dataset.page;
  const article = document.querySelector("#article");
  try {
    const index = await readData("articles/index.json");
    if (page === "learn") renderLearn(index);
    if (article) await openArticle(article, index);
  } catch (error) {
    const message = "暫時無法載入教材，請重新整理。";
    if (article) article.replaceChildren(element("h1", "", message), link("./learn.html", "返回學習中心 →"));
    else document.querySelector("#result-status").textContent = message;
    console.error(error);
  } finally {
    article?.removeAttribute("aria-busy");
  }
}

if (["learn", "article"].includes(document.body.dataset.page)) initializePage();
