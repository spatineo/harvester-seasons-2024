import { useEffect, useContext } from "react";
import LayerTile from 'ol/layer/Tile';
import { BaseLayerOptions } from 'ol-layerswitcher';
import { useRootDispatch } from "../store/hooks";
import Feature from 'ol/Feature'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MapContext from "../MapComponent/MapContext";
import Timeline from "ol-ext/control/Timeline";
import Select from 'ol/interaction/Select'
import Fill from "ol/style/Fill";
import BaseEvent from "ol/events/Event";
import Style from 'ol/style/Style'
import eCharts from 'echarts'
import $ from 'jquery'

interface OSMLayerProps {
 source: VectorSource
}

const style = new Style({
  fill: new Fill({
    color: '#eeeeee',
  }),
});

const Taustakartta: React.FC<OSMLayerProps> = ({ source }) => {
  const {map} = useContext(MapContext)
  const dispatch = useRootDispatch()
 
  useEffect(() => {
    if (!map) return;
    
    const vectorLayer = new VectorLayer({
      title: 'Taustakartta',
      type: 'base',
      source, 
      style: (feature: any) => {
        const color = feature.get('COLOR') || '#eeeeee';
        style.getFill().setColor(color);
        return style;
      }
    } as BaseLayerOptions);
    
    map.addLayer(vectorLayer)
   
    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const feature: Feature[] = []
    const minDate_string = new Date('2023-04-01').toDateString()
    const max_date_string = new Date('2023-10-01').toDateString()
    const timelineControl = new Timeline({
      source: source,
      className: 'ol-pointer',
      features: feature,
      // features: [{
        //text: 2015,
        //date: new Date('2015/01/01'),
        // endDate: new Date('2015/12/31')
     // }],
      graduation: 'day', // 'month'
      minDate: minDate_string,
      maxDate: max_date_string,
      getHTML: function(f: any){ return 2015; },
      getFeatureDate: function(f: any){ return f.date; },
      endFeatureDate: function(f: any) { return f.endDate }
     
    });

    map.addControl(timelineControl)
    let timer = setTimeout(function(){ timelineControl.setDate('2015'); });
  timelineControl.addButton ({
    className: "go",
    title: "GO!",
    html: 'play',
    click: (e) => {
      return ''
    },
  });

   /*  timelineControl.on('click', function(e: BaseEvent | Event){
      var d = timelineControl.roundDate(e.date, 'day')
      $('.dateStart').text(d.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'}));
      // Filter features visibility
      source.getFeatures().forEach(function(f: any) {
        let dt = f.get('time') - e.target.value;
        if (Math.abs(dt) > 1000*3600*12) {
          f.setStyle([]);
        } else {
          f.setStyle();
        }
      });
    }); */

  let select = new Select({ hitTolerance: 5, });
  map.addInteraction(select);
  select.on('select', function(e){
    var f = e.selected[0];
    if (f) {
      // Show info
			var info = $("#select").html("");
      $("<p>").text((new Date(f.get("time"))).toLocaleString()).appendTo(info);
			$("<p>").text('MAG.: '+f.get("mag")+' - '+f.get("place")).appendTo(info);
		} else {
      $("#select").html('');
    }
  });

  var running = false; 
  var start = new Date('203-04-01');
  var end = new Date('2016');

  /* function go(next: any) {
    let date = timelineControl.getStartDate()
    if (running) clearTimeout(undefined);
    if (!next) {
      // stop
      if (date>start && date<end && running) {
        running = false;
        timelineControl.element.classList.remove('running');
        return;
      }
      if (date > end) {
        date = start;
      }
    }
    if (date > end) {
      timelineControl.element.classList.remove('running');
      return;
    }
    if (date < start) {
      date = start;
    }
    // 1 day
    date = new Date(date.getTime() + 24*60*60*1000);
    timelineControl.setDate(date, { anim:false });
    // next
    timelineControl.element.classList.add('running');
    running = setTimeout(function() { go(true); }, 100);
  }
 */
  
  }, [map])
  return null;
};

export default Taustakartta;