/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { RootState } from "../store/store"
import { Parameter, Smartmet } from "../types"

export const createLayers = (layer: string) => (state: RootState) => {
  if (state.global.params && state.global.params[layer]) {
    return (state.global.params[layer] as Parameter[])
  }
  return [];
}

export const getMarkLineMatch = (array: Smartmet[], markLine: string | Date) => {
  if(!markLine) return;
 
  const foundMatch = array && array.find(
    (item: { utctime: string | number | Date}) => {
      return (
        new Date(item.utctime).toISOString().split("T")[0] ===
        new Date(markLine).toISOString().split("T")[0]
      );
    }
  );
  if(!foundMatch) {
    return "No match found";
  }
  return foundMatch;
}

export const getKeyFromFoundMatch = (foundMatch: Smartmet) => {
  const allKeys = Object.keys(foundMatch);
  const keyWithValueNotNull = allKeys.find((key) => key !== "utctime" && foundMatch[key] !== null);
  return keyWithValueNotNull !== undefined ? keyWithValueNotNull : allKeys.find((key) => key !== "utctime" && foundMatch[key] === null);
};

export const filterLayers = (array: Parameter[], code: string) => {
  return array.find((match) => match.code === code);
}

export const getLayers = (layers: Parameter[],  state) => {
  const layerArray: Record<string, string>[] = []
  layers.map((l) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function findLayer(layer: any) {
      let ret: string | Record<string, string>  | null = null;
      if (layer !== null && l.layerName === layer.Name) {
        ret = layer;
      } else if (layer !== null && layer.Layer) {
        for (let i = 0; i < layer.Layer.length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ret = findLayer(layer.Layer[i]);
          if (ret) break;
        }
      }
      return ret;
    }

    const layer: Record<string, string> = findLayer(state);
    if (layer !== null) {
      return layerArray.push(layer)
    } else {
      window.console.error("No layers not found");
    }
  })
  return layerArray;
}