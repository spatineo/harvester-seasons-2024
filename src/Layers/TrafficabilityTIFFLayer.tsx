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

interface TIFFLayerProps {
  title: string;
  url: string;
}
const COLOR_TRANSPARENT = { r: 0, g: 0, b: 0, a: 0 };
const COLOR_KIVIMAAKELIRIKKO = { r: 0, g: 0.38, b: 0, a: 1 };
const COLOR_KIVIMAANORMAALIKESA = { r: 0.38, g: 0.6, b: 0, a: 1 };
const COLOR_KIVIMAKUIVAESA = { r: 0.627, g: 0.859, b: 0, a: 1 };
const COLOR_TURVEMAANORMAALIKESA = { r: 1.0, g: 0.98, b: 0, a: 1 };
const COLOR_TURVEMAAKUIVAKESA = { r: 1.0, g: 0.518, b: 0, a: 1 };
const COLOR_KIVITURVEMAATALVI = { r: 1.0, g: 0.149, b: 0, a: 1 };

const color = {
  // Note! There is one less threshold than colors in palette - the last color in the palette is for all values above last threshold
  thresholds: [0, 1, 2, 3, 4, 5, 6],
  palette_huono: [
    COLOR_TRANSPARENT,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAANORMAALIKESA,
    COLOR_KIVITURVEMAATALVI,
    COLOR_TURVEMAANORMAALIKESA,
    COLOR_KIVITURVEMAATALVI,
    COLOR_KIVITURVEMAATALVI,
    COLOR_TRANSPARENT,
  ],
  palette_epavarma_kesa_keli: [
    COLOR_TRANSPARENT,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAANORMAALIKESA,
    COLOR_KIVIMAKUIVAESA,
    COLOR_TURVEMAANORMAALIKESA,
    COLOR_TURVEMAAKUIVAKESA,
    COLOR_KIVITURVEMAATALVI,
    COLOR_TRANSPARENT,
  ],
  palette_epavarma_talvi_keli: [
    COLOR_TRANSPARENT,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAANORMAALIKESA,
    COLOR_KIVIMAKUIVAESA,
    COLOR_TURVEMAANORMAALIKESA,
    COLOR_TURVEMAAKUIVAKESA,
    COLOR_KIVITURVEMAATALVI,
    COLOR_TRANSPARENT,
  ],
  palette_hyva_kesa_keli: [
    COLOR_TRANSPARENT,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVITURVEMAATALVI,
    COLOR_TRANSPARENT,
  ],
  palette_hyva_talvi_keli: [
    COLOR_TRANSPARENT,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_KIVIMAAKELIRIKKO,
    COLOR_TRANSPARENT,
  ],
};
function colorExpression(palette) {
  function process(channel: string) {
    const c = color.thresholds.reduce(
      (memo, threshold, i) => {
        memo.push(["<=", ["band", 1], threshold]);
        memo.push(palette[i][channel] as number);
        window.console.log(memo, "memo");
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
  const opacityValue = useAppSelector(
    (state: RootState) => state.mapState.opacityValue
  );
  const { trafficabilityIndexColor } = useAppSelector(
    (state: RootState) => state.global
  );
  const [layer, setLayer] = useState<TileLayer | null>(null);

  useEffect(() => {
    if (!layer) return;
    const opacity = getOpacityFromPercentage(opacityValue);
    layer.setOpacity(opacity);
  }, [opacityValue]);

  useEffect(() => {
    if (!map || !url) return;

    const summer = false
    let palette: Array<{r: number, g: number, b: number, a: number}>;
    switch (trafficabilityIndexColor) {
      case 0:
        palette = color.palette_huono;
        break;
      case 1:
        palette = color.palette_epavarma_kesa_keli;
        break;
      case 2:
        if (summer) {
          palette = color.palette_hyva_kesa_keli;
        } else {
          palette = color.palette_hyva_talvi_keli;
        }
        break;
      default:
        window.console.error(
          "tuntematon indeksiarvo, ei voida piirtää trafficabilityä"
        );
        return;
    }
    const newLayer = new TileLayer({
      title,
      visible: true,
      opacity: 1,
      className: "class",
      maxResolution: 150,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      style: {
        color: colorExpression(palette),
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
  }, [map, url, title, trafficabilityIndexColor]);

  return null;
};

export default TIFFLayer;
