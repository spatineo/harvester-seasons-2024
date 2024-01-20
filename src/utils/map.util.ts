/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { RootState } from "../store/store"
import { Parameter, Smartmet } from "../types"

export const paramsWithDisabledValues = (arr1: Smartmet[]) => arr1.map(obj => {  
  const keys = (typeof obj === 'object' && obj !== null) ? Object.keys(obj) : [];
  if (keys.length > 0 && keys.some(key => key !== 'utctime' && obj[key] !== null)) {
    return { ...obj, disabled: false };
  } else {
    return { ...obj, disabled: true };
  }
});

export function getParams(arr1: any[],arr2: any[]) {
  /* return arr1.filter((obj1) => {
    const key = Object.values(obj1)[0];
    const matchingObj2 = arr2.find((obj2) => {
      const key2 = obj2 && Object.keys(obj2)[1];
      if(obj2 && key === key2){
        return obj2
      }
      return false
    });
    if (matchingObj2) {
      return {new: 'jonw'}
    }
    return false;
  }); */
 if(arr1.length === 0 || arr2.length === 0) return;
 return arr2.reduce((f: any, val: any)=> {
 
  if(f !== null && f !== undefined){
   // window.console.log(f)
  }

 })
}

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
    return `No match found for markLine`;
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