import type { EChartsOption } from "echarts";

export function barOption(labels: string[], values: number[], color = "#2563eb"): EChartsOption {
  return {
    grid: { left: 34, right: 18, top: 24, bottom: 28 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: labels, axisTick: { show: false } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: "#e5e7eb" } } },
    series: [{ type: "bar", data: values, itemStyle: { color, borderRadius: [4, 4, 0, 0] } }]
  };
}

export function lineOption(labels: string[], values: number[], color = "#0f766e"): EChartsOption {
  return {
    grid: { left: 38, right: 18, top: 24, bottom: 28 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: labels, axisTick: { show: false } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: "#e5e7eb" } } },
    series: [{ type: "line", data: values, smooth: true, symbolSize: 5, lineStyle: { color }, itemStyle: { color } }]
  };
}
