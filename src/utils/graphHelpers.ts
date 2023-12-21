/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Parameter, Smartmet, GraphOptions } from "../types";
import { EChartOption } from "echarts";

const monthFI = [
  "Tammi",
  "Hel",
  "Maalis",
  "Huhti",
  "Touko",
  "Kesä",
  "Heinä",
  "Elo",
  "Syys",
  "Loka",
  "Marras",
  "Joulu"
];

const param2 = "HARVIDX{55;SWI2:ECXSF:5062:1:0:0:0-50}";
const param3 = "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}";
const param5 = "HARVIDX{0.55;SWI2-0TO1:SWI}";
const param7 = "ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}";
const param8 = "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}";
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
const fiFormat = (value: Date) => {
  const date = new Date(value);
  const month = monthFI[date.getMonth()];
  return `${month} {yyyy}`;
};

const enFormat = (value: Date) => {
  const date = new Date(value);
  const month = monthNames[date.getMonth()];
  return `${month} {yyyy}`;
};

export function createTrafficabilityGraphOptions(
  parameters: Parameter[],
  values: [],
  windGustArray: [],
  mark,
  winterSeries: (string | number)[],
  languageObject: {
    summerIndex: string;
    winterIndex: string;
    windGust: string;
    winterTenDays: string;
    summerTenDays: string;
  },
  locale: string
) {
  const trafficabilityOptionData: EChartOption = {
    animation: false,
    animationThreshold: 1,
    legend: {},
    grid: {
      show: true,
      left: 46,
      width: "90%"
    },
    tooltip: {
      show: true,
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
          padding: 8
        }
      },
      {
        name: "Wind Gust",
        nameLocation: "middle",
        min: 0,
        max: 28,
        splitNumber: 1,
        nameTextStyle: {
          padding: 8
        }
      }
    ],
    xAxis: {
      type: "time",
      splitNumber: 12,
      axisLabel: {
        formatter: locale === "en" ? enFormat : fiFormat,
        fontSize: 10
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
            width: 3,
            color: "#666362"
          }
        }
      },
      {
        type: "line",
        name: `${languageObject.summerIndex}`,
        symbol: "none",
        itemStyle: {
          color: "#0073CF"
        },
        lineStyle: {
          type: "solid",
          width: 2
        },
        areaStyle: {
          color: "rgba(0,115,207, 0.3)"
        },
        yAxisIndex: 0,
        data: [
          ...values.map((t: { utctime: string }) => {
            const summerValue = t[param2] !== null ? t[param2] : "nan";
            return [new Date(t.utctime).toISOString(), summerValue];
          })
        ]
      },
      {
        type: "line",
        symbol: "none",
        name: `${languageObject.winterIndex}`,
        itemStyle: {
          color: "green"
        },
        lineStyle: {
          type: "solid",
          width: 1.5
        },
        areaStyle: {
          color: "rgba(2, 138, 15, 0.5)"
        },
        yAxisIndex: 0,
        data: [
          ...values.map(
            (t: { utctime: string; [key: string]: string }, index) => {
              return [
                new Date(t.utctime).toISOString(),
                ...parameters.map(() => {
                  if (t[param8] !== null) {
                    return Math.max(Number(t[param3]), Number(t[param8]));
                  } else if (
                    t[param3] !== null ||
                    (!isNaN(Number(winterSeries[index])) &&
                      winterSeries.length == values.length)
                  ) {
                    return Math.max(
                      Number(t[param3]),
                      Number(winterSeries[index])
                    );
                  } else {
                    return "nan";
                  }
                })
              ];
            }
          )
        ]
      },
      {
        type: "line",
        symbol: "none",
        itemStyle: {
          color: "#E3242B"
        },
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        name: `${languageObject.windGust}`,
        yAxisIndex: 1,
        data: [
          ...windGustArray.map((t: { utctime: string }) => {
            return [
              new Date(t.utctime).toISOString(),
              t["FFG-MS:CERRA:5057:6:10:0"]
            ];
          })
        ]
      },
      {
        type: "line",
        name: `${languageObject.summerTenDays}`,
        symbol: "none",
        itemStyle: {
          color: "#610C04"
        },
        lineStyle: {
          type: "solid",
          width: 2
        },
        areaStyle: {
          color: "rgba(97,12,4, 0.3)"
        },
        yAxisIndex: 0,
        data: [
          ...values.map((t: { utctime: string; [key: string]: string }) => {
            if (t[param5] !== null) {
              return [t.utctime, t[param5]];
            } else {
              return [t.utctime, "nan"];
            }
          })
        ]
      },
      {
        type: "line",
        name: `${languageObject.winterTenDays}`,
        symbol: "none",
        itemStyle: {
          color: "black"
        },
        lineStyle: {
          type: "solid",
          width: 2
        },
        areaStyle: {
          color: "rgba(50,50,50, 0.3)"
        },
        yAxisIndex: 0,
        data: [
          ...values.map((t: { utctime: string; [key: string]: string }) => {
            return [
              new Date(t.utctime).toISOString(),
              ...parameters.map(() => {
                if (t[param8] !== null) {
                  return Math.max(Number(t[param3]), Number(t[param8]));
                } else if (t[param7] !== null) {
                  return Math.max(Number(t[param7]), Number(t[param3]));
                } else {
                  return "nan";
                }
              })
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
  padding: [number, number, number, number],
  locale: string,
  yValueMax: number,
  yValueMin: number
) {
  return {
    animation: false,
    animationThreshold: 1,
    grid: {
      left: 46,
      width: "98%"
    },
    tooltip: {
      show: true,
      trigger: "axis",
      borderWidth: 10
    },
    yAxis: {
      name: opts.title,
      nameLocation: "middle",
      nameTextStyle: {
        padding
      },
      max: yValueMax,
      min: yValueMin
    },
    xAxis: {
      type: "time",
      splitNumber: 12,
      axisLabel: {
        formatter: locale === "en" ? enFormat : fiFormat,
        fontSize: 10
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
            arrow: "none",
            color: "#666362"
          }
        }
      },
      ...parameters.map((p: { code: string }, i: number) => {
        const codes = p.code;
        return {
          type: "line",
          symbolSize: 1,
          name: `SH-${i}`,
          data: values.map((d: { utctime: string }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return [d.utctime, d[codes]];
          })
        };
      })
    ]
  };
}
