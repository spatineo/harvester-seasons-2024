import { WMSCapabilitiesLayerType } from "../types";

interface Layer {
  layerName: string;
  disabled: boolean;
  layerInfo: WMSCapabilitiesLayerType | null;
  utctime: string;
}

export const getLayersWithLayerInfo = (
  array1: (Layer | undefined)[],
  mapStateArray: WMSCapabilitiesLayerType[]
) => {
  return array1.map((res) => {
    if (typeof res === "object") {
      const layerCode = res.layerName;
      const matchingLayer = mapStateArray.find((layer) => {
        return layer && layer.Name === layerCode;
      });
      if (matchingLayer) {
        return {
          ...res,
          layerName: matchingLayer.layerName,
          layerInfo: matchingLayer
        };
      } else {
        return {
          ...res,
          disabled: true
        };
      }
    }
  });
};

export const getOneParamFromData = (arr1: (string | { utctime: string; } | null | undefined)[]) => {
  return arr1.map((m) => {
    if (typeof m === "string") {
      window.console.log(m);
    }
    if (m !== null && typeof m === "object") {
      const keys = Object.keys(m);
      const filteredKeys = keys.filter((key) => key !== "utctime");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return filteredKeys.length > 0 && m[filteredKeys[0]] !== null
        ? {
            ...m,
            disabled: false,
            layerInfo: null
          }
        : {
            ...m,
            disabled: true,
            layerInfo: null
          };
    }
  });
};
