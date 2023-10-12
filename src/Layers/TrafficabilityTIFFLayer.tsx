/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from "react";
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

interface TIFFLayerProps {
  title: string;
  url: string;
}

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

const TIFFLayer: React.FC<TIFFLayerProps> = ({ title, url }) => {
  const { map } = useContext(MapContext);
  const { opacityValue } = useAppSelector(
    (state: RootState) => state.mapState
  );
  const { trafficabilityIndexColor, defaultColorSwitch } = useAppSelector(
    (state: RootState) => state.global
  );
  const [layer, setLayer] = useState<TileLayer | null>(null);
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null);

  useEffect(() => {
    const result = createColorPalette(defaultColorSwitch);
    setColorPalette(result);
  }, [defaultColorSwitch]);

  useEffect(() => {
    if (!layer) return;
    const opacity = getOpacityFromPercentage(opacityValue);
    layer.setOpacity(opacity);
  }, [opacityValue]);

  useEffect(() => {
    if (!layer) {
      return;
    }
    const summer = false;
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
        if (summer) {
          palette = colorPalette?.palette_hyva_kesa_keli;
        } else {
          palette = colorPalette?.palette_hyva_talvi_keli;
        }
        break;
      default:
        window.console.error(
          "tuntematon indeksiarvo, ei voida piirtää trafficabilityä"
        );
        return;
    }

    if (palette) {
      layer.setStyle({
        color: colorExpression(palette),
      });
    }
  }, [trafficabilityIndexColor, colorPalette]);

  useEffect(() => {
    if (!map || !url) return;

    const newLayer = new TileLayer({
      title,
      visible: true,
      opacity: 1,
      className: "class",
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
  }, [map, url, title]);

  return null;
};

export default TIFFLayer;
