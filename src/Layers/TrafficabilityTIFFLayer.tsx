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

const color = {
  // Note! There is one less threshold than colors in palette - the last color in the palette is for all values above last threshold
  thresholds: [0, 1, 2, 3, 4, 5, 6],
  palette: [
    { r: 0, g: 0, b: 0, a: 0 },
    { r: 0, g: 0.38, b: 0, a: 1 },
    { r: 0.38, g: 0.6, b: 0, a: 1 },
    { r: 0.627, g: 0.859, b: 0, a: 1 },
    { r: 1.0, g: 0.98, b: 0, a: 1 },
    { r: 1.0, g: 0.518, b: 0, a: 1 },
    { r: 1.0, g: 0.149, b: 0, a: 1 },
    { r: 0, g: 0, b: 0, a: 0 },
  ],
};

function colorExpression() {
  function process(channel) {
    const c = color.thresholds.reduce(
      (memo, threshold, i) => {
        memo.push(["<=", ["band", 1], threshold]);
        memo.push(color.palette[i][channel] as number);
        return memo;
      },
      ["case"] as [ExpressionValue]
    );
    c.push(color.palette[color.palette.length - 1][channel] as number);
    return c;
  }
  return ["array", process("r"), process("g"), process("b"), process("a")];
}

const TIFFLayer: React.FC<TIFFLayerProps> = ({ title, url }) => {
  const { map } = useContext(MapContext);
  const opacityValue = useAppSelector(
    (state: RootState) => state.mapState.opacityValue
  );
 
  const [layer, setLayer] = useState<TileLayer | null>(null);

  useEffect(() => {
    if (!layer) return;
    const opacity = getOpacityFromPercentage(opacityValue)
    layer.setOpacity(opacity);
  }, [opacityValue]);

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
        color: colorExpression(),
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
