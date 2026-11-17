export const defaultScenario = { principal: 50000, monthly: 3000, years: 20, annual: 5 };

export function projectGrowth({ principal, monthly, years, annual }) {
  const monthlyRate = Math.expm1(Math.log1p(annual / 100) / 12);
  const points = [{ year: 0, asset: principal, invested: principal }];
  let asset = principal;
  for (let month = 1; month <= years * 12; month++) {
    asset = asset * (1 + monthlyRate) + monthly;
    if (month % 12 === 0) {
      points.push({ year: month / 12, asset, invested: principal + monthly * month });
    }
  }
  return points;
}
