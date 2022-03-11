import "ol/ol.css";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTSTileGrid from "ol/tilegrid/WMTS";

import { get as getProjection } from "ol/proj";
import { getTopLeft, getWidth } from "ol/extent";

const parser = new WMTSCapabilities();
let map;

const projection = getProjection("EPSG:4326");
const projectionExtent = projection.getExtent();
const size = getWidth(projectionExtent) / 256;
const resolutions = new Array(18);
const matrixIds = new Array(18);
for (let z = 0; z < 18; ++z) {
  // generate resolutions and matrixIds arrays for this WMTS
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
}
const wmtsTileGrid = new WMTSTileGrid({
  origin: getTopLeft(projectionExtent), // 原点（左上角）
  resolutions: resolutions, // 分辨率数组
  matrixIds: matrixIds // 矩阵ID，就是瓦片坐标系z维度各个层级的标识
});

map = new Map({
  layers: [
    // new TileLayer({
    //   source: new OSM(),
    //   opacity: 0.7,
    // }),
    new TileLayer({
      opacity: 1,
      source: new WMTS({
        url:
          "https://www.luzhoumap.com/LZ/rest/services/Vector_TDT_DP/MapServer/WMTS",
        layer: "BaseMap_Vector_TDT_DP",
        matrixSet: "default",
        format: "image/png",
        style: "default",
        wrapX: true,
        projection: projection,
        tileGrid: wmtsTileGrid
      })
    })
  ],
  target: "map",
  view: new View({
    center: [105.41450500488281, 28.916702270507812],
    zoom: 5
  })
});
