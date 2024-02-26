/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
import React, { useEffect, useContext, useState } from "react";
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

const finlandFeature = turf.polygon([ [ [ 3182839.088396922219545, 10770937.845795575529337 ], [ 3166588.001213975716382, 10556210.177710307762027 ], [ 3337071.79761303961277, 10357920.934622891247272 ], [ 3234342.052687847986817, 10140203.927272913977504 ], [ 3363813.410969363059849, 9823945.504529779776931 ], [ 3288870.903377515263855, 9594864.459697775542736 ], [ 3389086.831561614293605, 9401873.713462341576815 ], [ 3343577.976571943610907, 9237104.137495834380388 ], [ 3508355.313233963213861, 9067880.7329729385674 ], [ 3466487.94142712187022, 8944460.147863127291203 ], [ 3363085.047541102394462, 8807171.072352545335889 ], [ 3124737.883928207214922, 8512703.804220234975219 ], [ 3057171.154176084324718, 8407422.174851272255182 ], [ 2816176.117239979561418, 8361479.977174488827586 ], [ 2563897.031751682516187, 8299417.710137435235083 ], [ 2257615.713906465563923, 8295387.692797363735735 ], [ 2139939.207576461602002, 8427572.26155161485076 ], [ 2134297.183300364762545, 8546860.77481765113771 ], [ 2169761.335892969742417, 8951474.515760540962219 ], [ 2311617.946263385470957, 9214231.646333016455173 ], [ 2498314.834083795547485, 9303649.129436902701855 ], [ 2752988.002896941732615, 9582695.378152636811137 ], [ 2827299.996892936062068, 9637783.260176531970501 ], [ 2815719.986863165628165, 9750549.200675971806049 ], [ 2660911.978518628980964, 9878741.999432522803545 ], [ 2623341.761695389635861, 9986091.974314298480749 ], [ 2620402.147902011871338, 10428007.741345044225454 ], [ 2446639.324582141358405, 10632791.736883096396923 ], [ 2298256.899885173421353, 10783869.930477511137724 ], [ 2364975.457455686293542, 10866837.795505814254284 ], [ 2488685.030213233083487, 10701802.655924798920751 ], [ 2634047.3571249791421, 10717087.921322282403708 ], [ 2753563.19070587027818, 10642786.24902237765491 ], [ 2859710.110039943829179, 10779459.916688501834869 ], [ 2914302.190200382377952, 11012091.367398181930184 ], [ 3087144.623970374464989, 11122368.176282668486238 ], [ 3229998.811435057315975, 10993136.137832336127758 ], [ 3182839.088396922219545, 10770937.845795575529337 ] ] ]);

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
