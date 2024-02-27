import {
  WMSCapabilitiesLayerType,
  Smartmet,
  Parameter,
  WMSLayerTimeStrategy
} from "../types";
import { getKeyFromFoundMatch } from "../globalSlice";
import { RootState } from "../store/store";

interface LayersWithLayerInfo {
  layerName: string | undefined;
  disabled: boolean;
  layerInfo: null | WMSCapabilitiesLayerType;
  utctime: string;
  WMSTimeStrategy: WMSLayerTimeStrategy;
  id: number;
  visible: boolean;
  dataFound?: string | null;
}

interface FindOneDataFromParamsData {
  utctime: string;
}

export const getMarkLineMatch = (param: string) => (state: RootState) => {
  const rootState = state.global[param] as Smartmet[] | undefined;
  const markLine = new Date(state.global.markLine);
  if (isNaN(markLine.getTime())) {
    window.console.error(`Invalid date format for markLine = ${param}`);
    return;
  }
  if (rootState === undefined || rootState.length === 0) {
    return `${param} array is empty`;
  }
  const marked = markLine.toLocaleDateString('en-US');
  const foundMatch = rootState.find((item: { utctime: string | number | Date }) => {
    const dateFromParams = new Date(item.utctime);
    const formattedDateFromParams = dateFromParams.toLocaleDateString('en-US');
    if (formattedDateFromParams === marked) {
      return item;
    }
    return false;
  });

  if (!foundMatch) {
    return `No match found for markLine`;
  }
  return foundMatch;
};

export const checkForDataStringOrObject = (value: Smartmet | string) => {
  if (typeof value === "object") {
    return getKeyFromFoundMatch(value);
  } else {
    return value;
  }
};

export const getOneParamFromData = (
  arr1: (FindOneDataFromParamsData | string | null | undefined)[]
) => {
  return arr1.map((m, index) => {
    if (m !== null && typeof m === "object") {
      const keys = Object.keys(m);
      const filteredKeys = keys.filter((key) => key !== "utctime");
      return filteredKeys.length > 0 && m[filteredKeys[0]] !== null
        ? {
            ...m,
            disabled: false,
            layerInfo: null,
            layerName: "",
            dataFound: "Data found",
            WMSTimeStrategy: WMSLayerTimeStrategy.ForceSelectedDate,
            id: index,
            visible: true
          }
        : {
            ...m,
            disabled: true,
            layerInfo: null,
            layerName: "",
            dataFound: null,
            WMSTimeStrategy: WMSLayerTimeStrategy.ForceSelectedDate,
            id: index,
            visible: false
          };
    }
  });
};

export const getLayersWithLayerInfo = (
  array1: (LayersWithLayerInfo | undefined)[],
  mapStateArray: WMSCapabilitiesLayerType[]
) => {
  return array1.map((res) => {
    if (typeof res === "object") {
      const layerCode = res.layerName;
      const matchingLayer = mapStateArray.find((layer) => {
        return layerCode && layer && layer.Name === layerCode;
      });
      if (matchingLayer) {
        return {
          ...res,
          layerName: layerCode,
          layerInfo: matchingLayer,
          WMSTimeStrategy: WMSLayerTimeStrategy.ForceSelectedDate,
          visible: true
        };
      } else {
        return {
          ...res,
          disabled: true,
          WMSTimeStrategy: WMSLayerTimeStrategy.ForceSelectedDate,
          layerName: layerCode,
          visible: false
        };
      }
    }
  });
};

export const findMatchingLayers = (
  dataFromParams: (LayersWithLayerInfo | undefined)[],
  layersArray: Parameter[]
) => {
  return dataFromParams.map((obj) => {
    if (typeof obj === "object" && obj !== null) {
      const layerCode = Object.keys(obj)[1];
      const matchingLayer = layersArray.find((layer) => {
        return layer.code === layerCode;
      });

      if (matchingLayer) {
        return {
          ...obj,
          layerName: matchingLayer.layerName
        };
      } else {
        return {
          ...obj,
          layerName: ""
        };
      }
    }
  });
};
