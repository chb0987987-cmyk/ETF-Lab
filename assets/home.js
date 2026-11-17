import { formatMoney } from "./common.js";
import { connectChart } from "./chart.js";
import { loadFeatured } from "./learn.js";
import { defaultScenario, projectGrowth } from "./model.js";

const points = projectGrowth(defaultScenario);
document.querySelector("#hero-total").textContent = formatMoney(points.at(-1).asset);
connectChart(document.querySelector("#hero-chart"))(points);
loadFeatured(document.querySelector("#featured"));
