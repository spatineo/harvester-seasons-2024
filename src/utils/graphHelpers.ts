/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Parameter, Smartmet, GraphOptions } from "../types";
import { EChartOption } from "echarts";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export function createTrafficabilityGraphOptions(
  parameters: Parameter[],
  values: [],
  wind: [],
  mark
) {
  const trafficabilityOptionData: EChartOption = {
    legend: {},
    grid: {
      show: true,
      left: 46,
      width: "90%"
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: [
      {
        name: "Traficability",
        nameLocation: "middle",
        min: 0,
        max: 2,
        splitNumber: 1,
        nameTextStyle: {
          padding: 18
        }
      },
      {
        name: "Wind Gust",
        nameLocation: "middle",
        min: 0,
        max: 28,
        splitNumber: 1,
        nameTextStyle: {
          padding: 18
        }
      }
    ],
    xAxis: {
      type: "time",
      splitNumber: 12,
      axisLabel: {
        formatter: (value: Date) => {
          const date = new Date(value);
          const month = monthNames[date.getMonth()];
          const year = date.getFullYear();
          return `${month} ${year}`;
        }
      }
    },
    series: [
      {
        symbol: "none",
        label: {
          show: false
        },
        type: "line",
        seriesLayoutBy: "row",
        markLine: {
          data: [
            {
              xAxis: mark,
              name: "",
              type: "min",
              label: { show: false }
            }
          ],
          symbol: "none",
          lineStyle: {
            type: "solid",
            width: 3
          }
        }
      },
      {
        type: "line",
        name: "Summer",
        areaStyle: {
          color: "rgba(0, 12, 0, 0.3)"
        },
        yAxisIndex: 0,
        data: [
          ...values.map((t: { utctime: string; [key: string]: string }) => {
            return [
              new Date(t.utctime).toISOString(),
              ...parameters.map((p) => {
                if (p.code === "HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015}") {
                  if (Number(t[p.code]) === 2) {
                    return "nan";
                  }
                } else {
                  return 2;
                }
              })
            ];
          })
        ]
      },
      {
        type: "line",
        name: "Winter",
        areaStyle: {
          color: "rgba(0, 128, 255, 0.3)"
        },
        yAxisIndex: 0,
        data: [
          ...values.map((t: { utctime: string; [key: string]: string }) => {
            return [
              new Date(t.utctime).toISOString(),
              ...parameters.map((p) => {
                if (p["ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}"] !== null) {
                  return Math.max(
                    Number(t["ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}"]),
                    Number(
                      t[
                        "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}"
                      ]
                    )
                  );
                } else {
                  return "";
                }
              })
            ];
          })
        ]
      },
      {
        type: "line",
        name: "Wind gust",
        yAxisIndex: 1,
        data: [
          ...wind.map((t: { utctime: string }) => {
            return [
              new Date(t.utctime).toISOString(),
              t["FFG-MS:CERRA:5057:6:10:0"]
            ];
          })
        ]
      }
    ]
  };
  return trafficabilityOptionData;
}

export function createOptions(
  opts: GraphOptions,
  parameters: Parameter[],
  values: Smartmet[],
  mark: string,
  padding: [number, number, number, number]
) {
  return {
    animation: false,
    animationThreshold: 1,
    grid: {
      left: 46,
      width: "98%"
    },
    tooltip: {
      trigger: "item"
    },
    yAxis: {
      name: opts.title,
      nameLocation: "middle",
      nameTextStyle: {
        padding
      }
    },
    xAxis: {
      type: "time",
      splitNumber: 12,
      axisLabel: {
        formatter: (value: Date) => {
          const date = new Date(value);
          const month = monthNames[date.getMonth()];
          const year = date.getFullYear();
          return `${month} ${year}`;
        }
      }
    },
    series: [
      {
        label: {
          show: false
        },
        type: "line",
        seriesLayoutBy: "row",
        markLine: {
          data: [
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              xAxis: mark,
              name: "",
              type: "min",
              label: { show: false }
            }
          ],
          symbol: "none",
          lineStyle: {
            type: "solid",
            width: 3,
            arrow: "none"
          }
        }
      },
      ...parameters.map((p: { code: string }, i: number) => {
        const codes = p.code;
        return {
          type: "line",
          symbolSize: 2,
          name: `SH-${i}`,
          data: values.map(
            (d: { utctime: string; [key: string]: string | number | null }) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return [d.utctime, d[codes]];
            }
          )
        };
      })
    ]
  };
}
