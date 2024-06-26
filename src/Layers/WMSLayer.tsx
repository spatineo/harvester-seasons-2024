/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from "react";
import MapContext from "../MapComponent/MapContext";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";
import { BaseLayerOptions } from "ol-layerswitcher";
import add from "date-fns/add";
import { Duration } from "date-fns";
import { WMSLayerTimeStrategy, WMSCapabilitiesLayerType } from "../types";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { getOpacityFromPercentage } from "../utils/helpers";

interface WMSLayerProps {
  layerInfo: WMSCapabilitiesLayerType;
  strategy: WMSLayerTimeStrategy;
  date?: string;
  visible: boolean;
  title: string;
  url: string;
}

const TIME_DIMENSION_PERIOD_MATCHER = /([0-9-T:Z]+)\/([0-9-T:Z]+)\/(P.*)/;

// https://stackoverflow.com/a/69295907, modified to work with date-fns (types, plural names in output dict)
function parseISODuration(s): Duration {
  // QnD validation of string, need something smarter
  // Should check tokens, order and values
  // e.g. decimals only in smallest unit, W excludes other date parts
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (!/^P/.test(s)) return {};

  // Split into parts
  const parts = s.match(/\d+(\.\d+)?[a-z]|T/gi);

  // Flag for date and time parts, used to disambiguate month and minute
  let inDate = true;

  // Map of part tokens to words
  const partMap = {
    Y: "years",
    M: "months",
    W: "weeks",
    D: "days",
    h: "hours",
    m: "minutes",
    s: "seconds",
  };

  return parts.reduce((acc, part) => {
    // Set flag if reached a time part
    if (part == "T") {
      inDate = false;
      return acc;
    }

    // Disambiguate time parts (month/minute)
    if (!inDate) {
      part = part.toLowerCase();
    }

    // Add part name and value as a number
    acc[partMap[part.slice(-1)]] = +part.slice(0, -1);
    return acc;
  }, {});
}

function getLatestTimestamp(layerInfo: WMSCapabilitiesLayerType): Date | null {
  const values = layerInfo.Dimension.find((d) => d.name === "time")?.values;

  if (!values) {
    window.console.error("No time dimension values in layer", layerInfo);
    return null;
  }

  const periodMatch = TIME_DIMENSION_PERIOD_MATCHER.exec(values);
  if (periodMatch) {
    return new Date(periodMatch[2]); // latest date = end of period
  }

  const availableTimestamps = values
    .split(",")
    .map((timeStr) => new Date(timeStr));

  if (availableTimestamps.length === 0) {
    window.console.error("No values for time dimension in layer", layerInfo);
    return null;
  }

  availableTimestamps.sort((a, b) => a.getTime() - b.getTime());

  return availableTimestamps[availableTimestamps.length - 1];
}

function getNearestTimestamps(
  layerInfo: WMSCapabilitiesLayerType,
  date: Date
): (null | Date)[] | undefined {
  const values = layerInfo.Dimension.find((d) => d.name === "time")?.values;

  if (!values) {
    window.console.error("No time dimension values in layer", layerInfo);
    return;
  }

  const periodMatch = TIME_DIMENSION_PERIOD_MATCHER.exec(values);
  if (periodMatch) {
    const duration = parseISODuration(periodMatch[3]);

    let iter = new Date(periodMatch[1]);
    let prev: null | Date = null;
    const last = new Date(periodMatch[2]);

    for (; iter <= last; prev = iter, iter = add(iter, duration)) {
      if (iter === date) {
        return [date, date];
      }
      if (iter >= date) {
        return [prev, iter];
      }
      if (prev !== null && iter <= prev) {
        window.console.error(
          "error in loop, the iterator going the wrong way in time, there is probably something wonky with the duration:",
          duration
        );
        return;
      }
    }
    return [prev, null];
  }

  const availableTimestamps = values
    .split(",")
    .map((timeStr) => new Date(timeStr));

  if (availableTimestamps.length === 0) {
    window.console.error("No values for time dimension in layer", layerInfo);
    return;
  }

  availableTimestamps.sort((a, b) => a.getTime() - b.getTime());

  for (let i = 0; i < availableTimestamps.length; i++) {
    // Special case: we found the exact timestamp => return the same timestamp as both "previous" and "next"
    if (availableTimestamps[i] == date) {
      return [date, date];
    }

    if (availableTimestamps[i] >= date) {
      return [
        i > 0 ? availableTimestamps[i - 1] : null,
        availableTimestamps[i],
      ];
    }
  }
  // otherwise, return the last timestamp and null
  return [availableTimestamps[availableTimestamps.length - 1], null];
}

const WMSLayer: React.FC<WMSLayerProps> = ({
  strategy,
  date,
  visible,
  layerInfo,
  url,
}) => {
  const { map, WMSLayerGroup } = useContext(MapContext);
  const [time, setTime] = useState<string>("");
  const [layer, setLayer] = useState<TileLayer<TileWMS> | null>(null);
  const { opacityValue } = useAppSelector((state: RootState) => state.mapState);

  useEffect(() => {
    if (!map || !layerInfo) return;

    let timeStamp: Date | null = null;

    if (strategy === WMSLayerTimeStrategy.ForceSelectedDate) {
      timeStamp = new Date(
        date ? date.substring(0, 10) + "T00:00:00Z" : new Date()
      );
    } else if (strategy === WMSLayerTimeStrategy.Latest) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      timeStamp = getLatestTimestamp(layerInfo);
    } else if (strategy !== WMSLayerTimeStrategy.NoTimeDimesion) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const nearest = getNearestTimestamps(
        layerInfo,
        new Date(date || new Date())
      );

      if (nearest) {
        if (strategy === WMSLayerTimeStrategy.LatestBeforeNow) {
          timeStamp = nearest[0];
        } else if (strategy === WMSLayerTimeStrategy.EarliestAfterNow) {
          timeStamp = nearest[1];
        }
      }
    }

    if (!timeStamp) {
      setTime("");
      return;
    }

    const tmp = timeStamp.toISOString();
    setTime(tmp);
  }, [layerInfo, strategy, date]);

  useEffect(() => {
    if (!layer) return;
    const opac = getOpacityFromPercentage(opacityValue);
    layer.setOpacity(opac);
  }, [opacityValue]);

  useEffect(() => {
    // add try catch
    try {
      if (!map || !layerInfo || !WMSLayerGroup) return;

      if (time === "" && strategy !== WMSLayerTimeStrategy.NoTimeDimesion)
        return;

      const params: Record<string, string | boolean> = {
        LAYERS: layerInfo.Name,
        TILED: true,
        VERSION: "1.3.0",
        TRANSPARENT: true,
      };

      if (strategy !== WMSLayerTimeStrategy.NoTimeDimesion) {
        params.TIME = time;
      }

      const newLayer: TileLayer<TileWMS> = new TileLayer({
        opacity: getOpacityFromPercentage(opacityValue),
        title: layerInfo?.Title,
        visible,
        source: new TileWMS({
          url,
          params,
        }),
      } as BaseLayerOptions);

      if (layer) {
        window.console.log(WMSLayerGroup.getLayers());
        WMSLayerGroup.getLayers().remove(layer);
      }

      WMSLayerGroup.getLayers().push(newLayer);
      setLayer(newLayer);

      return () => {
        if (WMSLayerGroup) {
          WMSLayerGroup.getLayers().remove(newLayer);
        }
      };
    } catch (error) {
      window.console.error(error);
    }
  }, [map, layerInfo, time, strategy, visible, WMSLayerGroup]);

  return null;
};

export default WMSLayer;
