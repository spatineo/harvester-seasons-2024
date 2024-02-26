/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
import React, { useEffect, useContext, useState, useCallback } from "react";
import MapContext from "../MapComponent/MapContext";
import { BaseLayerOptions } from "ol-layerswitcher";
import GeoTIFF from "ol/source/GeoTIFF";
import TileLayer from "ol/layer/WebGLTile";
import { ExpressionValue } from "ol/style/expressions";
import { getOpacityFromPercentage } from "../utils/helpers";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { createColorPalette } from "../utils/colors_palette";
import { ColorPalette } from "../types";
import { unByKey } from "ol/Observable";
import * as turf from '@turf/turf';

interface TIFFLayerProps {
  title: string;
  finlandUrl: string;
  europeUrl: string;
  zIndex: number;
  visible: boolean;
}

//const finlandFeature = turf.polygon({ "type": "Feature", "properties": { "fid": 1 }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 3143413.525253552477807, 8395332.122831059619784 ], [ 2359978.15434420760721, 8292163.678925301879644 ], [ 2189105.41912529617548, 8337299.873134074732661 ], [ 2124625.141684197355062, 8469484.441888323053718 ], [ 2231017.599462009966373, 9127183.271787531673908 ], [ 2679155.527677644509822, 9707505.768757414072752 ], [ 2569539.056027776561677, 10474821.070306485518813 ], [ 2260033.72431050427258, 10758534.29104732349515 ], [ 2324514.001751602627337, 10900390.901417737826705 ], [ 2563091.028283667284995, 10706950.069094447419047 ], [ 2801668.054815731476992, 10687605.985862115398049 ], [ 2891940.443233268801123, 11080935.678252818062901 ], [ 3285270.13562396960333, 11119623.844717472791672 ], [ 3685047.855758779682219, 9036910.8833699952811 ], [ 3143413.525253552477807, 8395332.122831059619784 ] ] ] }, "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::3857" } } });
const finlandFeature = turf.polygon([ [ [ 3143413.525253552477807, 8395332.122831059619784 ], [ 2359978.15434420760721, 8292163.678925301879644 ], [ 2189105.41912529617548, 8337299.873134074732661 ], [ 2124625.141684197355062, 8469484.441888323053718 ], [ 2231017.599462009966373, 9127183.271787531673908 ], [ 2679155.527677644509822, 9707505.768757414072752 ], [ 2569539.056027776561677, 10474821.070306485518813 ], [ 2260033.72431050427258, 10758534.29104732349515 ], [ 2324514.001751602627337, 10900390.901417737826705 ], [ 2563091.028283667284995, 10706950.069094447419047 ], [ 2801668.054815731476992, 10687605.985862115398049 ], [ 2891940.443233268801123, 11080935.678252818062901 ], [ 3285270.13562396960333, 11119623.844717472791672 ], [ 3685047.855758779682219, 9036910.8833699952811 ], [ 3143413.525253552477807, 8395332.122831059619784 ] ] ] );

function colorExpression(palette) {
  function process(channel: string) {
    const c = [0, 1, 2, 3, 4, 5, 6].reduce(
      (memo, threshold, i) => {
        memo.push(["<=", ["band", 1], threshold]);
        memo.push(palette[i][channel] as number);
        return memo;
      },
      ["case"] as [ExpressionValue]
    );
    c.push(palette[palette.length - 1][channel] as number);
    return c;
  }
  return ["array", process("r"), process("g"), process("b"), process("a")];
}

const TIFFLayer: React.FC<TIFFLayerProps> = ({
  title,
  finlandUrl,
  europeUrl,
  zIndex,
  visible,
}) => {
  const { map } = useContext(MapContext);
  const { opacityValue } = useAppSelector((state: RootState) => state.mapState);
  const { trafficabilityIndexColor, defaultColorSwitch, markLine, itIsWinter } =
    useAppSelector((state: RootState) => state.global);
  const [layer, setLayer] = useState<TileLayer | null>(null);
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null);
  const [winterState, setWinterState] = useState<boolean>(false);

  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const result = createColorPalette(defaultColorSwitch);
    setColorPalette(result);
  }, [defaultColorSwitch]);

  useEffect(() => {
    if (!markLine) return;
    if (trafficabilityIndexColor === 2) {
      if (itIsWinter === true) {
        setWinterState(true);
      }
    } else {
      setWinterState(false);
    }
  }, [markLine]);

  useEffect(() => {
    if (!layer) return;
    const opacity = getOpacityFromPercentage(opacityValue);
    layer.setOpacity(opacity);
  }, [opacityValue]);
  
  useEffect(() => {
    if (!layer) {
      return;
    }

    let palette:
      | Array<{ r: number; g: number; b: number; a?: number }>
      | undefined;
    switch (trafficabilityIndexColor) {
      case 0:
        palette = colorPalette?.palette_huono;
        break;
      case 1:
        palette = colorPalette?.palette_epavarma_kesa_keli;
        break;
      case 2:
        if (winterState === false) {
          palette = colorPalette?.palette_hyva_talvi_keli;
        } else {
          palette = colorPalette?.palette_hyva_kesa_keli;
        }
        break;
      default:
        window.console.error(
          "tuntematon indeksiarvo, ei voida piirtää trafficabilityä"
        );
        palette = colorPalette?.palette_base_color;
    }

    if (palette) {
      layer.setStyle({
        color: colorExpression(palette),
      });
    }
  }, [trafficabilityIndexColor, colorPalette, winterState]);

  const moveEndCallback = React.useCallback(() => {
    if (!map) return;
    const center = map.getView().getCenter();

    if (!center) return;

    const u = turf.booleanPointInPolygon(turf.point(center), finlandFeature) ? finlandUrl : europeUrl;
    setUrl(u);
  }, [map, finlandUrl, europeUrl]);

  useEffect(() => {
    if (!map) return;

    const eventsKey = map.on('moveend', moveEndCallback);

    return () => {
      unByKey(eventsKey);
    }
  }, [map])

  useEffect(() => {
    if (!map || !url) return;
    const newLayer = new TileLayer({
      title,
      visible,
      opacity: getOpacityFromPercentage(opacityValue),
      className: "class",
      zIndex,
      maxResolution: 150,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      style: {
        color: colorExpression(colorPalette?.palette_base_color),
        gamma: 1.0,
      },
      source: new GeoTIFF({
        sources: [{ url }],
        normalize: false,
        interpolate: false,
      }),
    } as BaseLayerOptions);

    if (layer) {
      map.removeLayer(layer);
    }

    map.addLayer(newLayer);

    setLayer(newLayer);

    return () => {
      map.removeLayer(newLayer);
    };
  }, [map, url, title, visible]);

  return null;
};

const MemoizedTIFFLayer = React.memo(TIFFLayer);
export default MemoizedTIFFLayer;
