/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Parameter, Smartmet, GraphOptions } from "../types";
import { EChartOption } from "echarts";

const monthFI = [
  'Tammi', 'Hel', 'Maalis', 'Huhti', 'Touko', 'Kesä',
  'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'
]

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
}

const enFormat = (value: Date) => {
  const date = new Date(value);
  const month = monthNames[date.getMonth()];
  return `${month} {yyyy}`;
}
const format = () => {
  return `{MMM} {yyyy}`;
}

export function createTrafficabilityGraphOptions(
  parameters: Parameter[],
  values: [],
  windGustArray: [],
  mark,
  winterSeries: (string | number)[],
  languageObject: {
    summerIndex: string,
    winterIndex: string,
    windGust: string,
    winterTenDays: string,
    summerTenDays: string
  },
  locale: string
) {
  const trafficabilityOptionData: EChartOption = {
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
      },
      
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
          ...values.map(
            (t: { utctime: string}) => {
              //window.console.log(t)
              const summerValue =
                t['HARVIDX{55;SWI2:ECXSF:5062:1:0:0:0-50}'] !== null ? t['HARVIDX{55;SWI2:ECXSF:5062:1:0:0:0-50}'] : "nan";
              return [new Date(t.utctime).toISOString(), summerValue];
            }
          )
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
                  if (t["ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}"] !== null) {
                    return Math.max(
                      Number(
                        t[
                          "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}"
                        ]
                      ),
                      Number(t["ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}"])
                    );
                  } else if (
                    t[
                      "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}"
                    ] !== null ||
                    (!isNaN(Number(winterSeries[index]))&&
                      winterSeries.length == values.length)
                  ) {
                    return Math.max(
                      Number(
                        t[
                          "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}"
                        ]
                      ),
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
            if (t["HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015}"] !== null) {
              return [t.utctime, t["HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015}"]];
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
        yAxisIndex: 0,
        data: [
          ...values.map((t: { utctime: string; [key: string]: string }) => {
            return [
              new Date(t.utctime).toISOString(),
              ...parameters.map(() => {
                if (t["ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}"] !== null) {
                  return Math.max(
                    Number(
                      t[
                        "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}"
                      ]
                    ),
                    Number(t["ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}"])
                  );
                } else if (
                  t["ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}"] !== null
                ) {
                  return Math.max(
                    Number(
                      t[
                        "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}"
                      ]
                    ),
                    Number(t["ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}"])
                  );
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
  locale: string
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
      borderWidth: 10,
     
      
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
        formatter: locale === "en" ? enFormat : fiFormat,
        fontSize: 10
      },
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
