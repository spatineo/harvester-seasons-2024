/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Parameter, GraphOptions, Smartmet } from "../types";
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
  windGustArray: Smartmet[],
  values: [],
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
            width: 2,
            type: "solid",
            color: "green"
          }
        }
      },

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      ...parameters.map((p: { code: string }) => {
        const codes = p.code;
        return {
          type: "line",
          symbolSize: 1,
          name: `SH-${codes}`,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          data: windGustArray.map((d: { utctime: string }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return [
              new Date(d.utctime).toISOString(),
              d[codes] ? d[codes] : "nan"
            ];
          })
        };
      })
    ]
  };
  return trafficabilityOptionData;
}

export function createOptions(
  opts: GraphOptions,
  parameters,
  values,
  mark: string,
  padding: number,
  locale: string
) {
  return {
    animation: false,
    animationThreshold: 1,
    grid: {
      width: "auto",
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
      }
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
            width: 2,
            color: "green"
          }
        }
      },

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      ...parameters.map((p: { code: string }) => {
        const codes = p.code;
        return {
          type: "line",
          symbolSize: 1,
          name: `SH-${codes}`,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          data: values.map((d: { utctime: string }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return [d.utctime, d[codes] ? d[codes] : "nan"];
          })
        };
      })
    ]
  };
}

const s: string[] = [];
for (let i = 0; i < 10; i++) {
  const date = new Date();
  date.setDate(date.getDate() + i);
  s.push(date.toISOString());
}

export function graphOption(data: (string | number | Date)[][]) {
  const d: string[] = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    d.push(date.toISOString());
  }

  return {
    tooltip: {
      show: true,
      trigger: "axis"
    },
    xAxis: {
      type: "time"
    },
    yAxis: {},
    series: data.map((item) => {
      return {
        type: "line",
        data: item.map((value, i) => [d[i], value])
      };
    })
  };
}

/* 
_SPATINEO_ID=165159&BBOX=11.051469386771252%2C38.813252479428314%2C11.869753176035994%2C39.631536268693054&CRS=CRS%3A27&customer=gui&EXCEPTIONS=XML&LAYERS=gui%3Aisobands%3ACERRA_FFG-MS&projection.bbox=11.051469386771252%2C38.813252479428314%2C11.869753176035994%2C39.631536268693054&projection.crs=NAD27&projection.xsize=256&projection.ysize=256&REQUEST=GetMap&SERVICE=WMS&STYLES=&type=png&VERSION=1.3.0
*/