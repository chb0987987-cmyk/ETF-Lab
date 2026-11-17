const compact = new Intl.NumberFormat("zh-TW", { notation: "compact", maximumFractionDigits: 1 });

export function connectChart(canvas) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};

  let points = [];
  function draw() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height || !points.length) return;

    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const left = width < 350 ? 47 : 58;
    const right = width - 10;
    const top = 13;
    const bottom = height - 26;
    const finalYear = points.at(-1).year;
    const max = Math.max(4, ...points.flatMap(({ asset, invested }) => [asset, invested]));
    const rough = max / 4;
    const unit = 10 ** Math.floor(Math.log10(rough));
    const step = [1, 2, 2.5, 5, 10].find((value) => value * unit >= rough) * unit;
    const tickCount = Math.ceil(max / step);
    const ceiling = step * tickCount;
    const x = (year) => left + (year / finalYear) * (right - left);
    const y = (value) => bottom - (value / ceiling) * (bottom - top);

    context.font = "11px system-ui, sans-serif";
    context.fillStyle = "#a3b5c9";
    context.textAlign = "right";
    context.textBaseline = "middle";
    for (let row = 0; row <= tickCount; row++) {
      const value = row * step;
      const level = y(value);
      context.fillText(compact.format(value), left - 7, level, left - 9);
      context.strokeStyle = "#334a5c";
      context.beginPath();
      context.moveTo(left, level);
      context.lineTo(right, level);
      context.stroke();
    }

    const years = new Set([0, Math.round(finalYear / 4), Math.round(finalYear / 2), Math.round(3 * finalYear / 4), finalYear]);
    context.textBaseline = "top";
    for (const year of years) {
      context.textAlign = year === finalYear ? "right" : "center";
      context.fillText(year + " 年", x(year), bottom + 8);
    }

    function trace(key) {
      context.beginPath();
      context.moveTo(x(0), y(points[0][key]));
      for (const point of points.slice(1)) context.lineTo(x(point.year), y(point[key]));
    }

    trace("asset");
    context.lineTo(right, bottom);
    context.lineTo(left, bottom);
    context.closePath();
    const fill = context.createLinearGradient(0, top, 0, bottom);
    fill.addColorStop(0, "#52ebba44");
    fill.addColorStop(1, "#52ebba04");
    context.fillStyle = fill;
    context.fill();

    context.lineJoin = "round";
    context.lineCap = "round";
    context.strokeStyle = "#52ebba";
    context.lineWidth = 2.8;
    trace("asset");
    context.stroke();
    context.setLineDash([5, 5]);
    context.strokeStyle = "#92bfff";
    context.lineWidth = 1.7;
    trace("invested");
    context.stroke();
    context.setLineDash([]);

    context.beginPath();
    context.arc(right, y(points.at(-1).asset), 3.5, 0, Math.PI * 2);
    context.fillStyle = "#52ebba";
    context.fill();
  }

  const observer = new ResizeObserver(draw);
  observer.observe(canvas);
  return (newPoints) => {
    points = newPoints;
    draw();
  };
}
