var Kilometer = (function(){
    var map, layer, view, options,prjCoordSys,epsgcode,url = "http://119.3.246.90:8090/iserver/services/lichengbiao/rest/maps/lichengbiao",isMvt = false;
    var lon=0,lat=0,zoomlevel=2,initZoomToScale;
    var envelope;

    var queryString = "";
    // 中继服务发送的请求，queryString字段是类似“token=&isMvt=true"这种情况，和普通请求做一下兼容处理
    var parms = queryString.split("&");
    for(var i = 0; i < parms.length; i++) {
        if(parms[i] == "isMvt=true") {
            isMvt = true;
            break;
        }
    }

    function _(m){
        map = m;
        /*var originResult = {"viewBounds":{"top":42.03012064,"left":80.96165381999998,"bottom":37.82188525999998,"leftBottom":{"x":80.96165381999998,"y":37.82188525999998},"right":85.1698892,"rightTop":{"x":85.1698892,"y":42.03012064}},"viewer":{"leftTop":{"x":0,"y":0},"top":0,"left":0,"bottom":256,"rightBottom":{"x":256,"y":256},"width":256,"right":256,"height":256},"distanceUnit":null,"minVisibleTextSize":0,"coordUnit":"DEGREE","scale":1.4458765511334118E-7,"description":"","paintBackground":false,"maxVisibleTextSize":0,"maxVisibleVertex":0,"clipRegionEnabled":false,"antialias":true,"textOrientationFixed":false,"angle":0,"prjCoordSys":{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"Longitude / Latitude Coordinate System---GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.00335281066474748,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},"minScale":0,"markerAngleFixed":false,"overlapDisplayedOptions":null,"visibleScales":[1.5714552575179423E-5,3.1429105150358845E-5,6.28582103007175E-5,1.257164206014358E-4,2.5143284120286843E-4,5.028656824057495E-4,0.001005731364811499,0.002011462729622998],"visibleScalesEnabled":true,"customEntireBoundsEnabled":false,"clipRegion":null,"maxScale":0,"customParams":"","center":{"x":83.06577150999999,"y":39.92600294999999},"dynamicPrjCoordSyses":[{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"Longitude / Latitude Coordinate System---GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.00335281066474748,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}}],"colorMode":null,"textAngleFixed":false,"overlapDisplayed":false,"userToken":{"userID":""},"cacheEnabled":true,"dynamicProjection":false,"autoAvoidEffectEnabled":true,"customEntireBounds":null,"name":"lichengbiao","bounds":{"top":42.03012064,"left":80.96165381999998,"bottom":41.32495301,"leftBottom":{"x":80.96165381999998,"y":41.32495301},"right":85.1698892,"rightTop":{"x":85.1698892,"y":42.03012064}},"backgroundStyle":{"fillGradientOffsetRatioX":0,"markerSize":0,"fillForeColor":{"red":255,"green":0,"blue":0,"alpha":255},"fillGradientOffsetRatioY":0,"markerWidth":0,"markerAngle":0,"fillSymbolID":0,"lineColor":{"red":0,"green":0,"blue":0,"alpha":255},"markerSymbolID":0,"lineWidth":0.01,"markerHeight":0,"fillOpaqueRate":100,"fillBackOpaque":false,"fillBackColor":{"red":255,"green":255,"blue":255,"alpha":255},"fillGradientMode":"NONE","lineSymbolID":0,"fillGradientAngle":0}};
        var visibleScales = originResult.visibleScales;
        var visableResolution = [1.512478647543738E-4,7.56239323771869E-5,3.781196618859356E-5,1.890598309429666E-5,9.452991547148448E-6,4.726495773574106E-6,2.363247886787053E-6,1.1816239433935264E-6];
        var prjParamter =  "+proj=longlat +datum=WGS84 +no_defs";
        var attrib = 'Map data &copy; 2013 Lantm?teriet, Imagery &copy; 2013 SuperMap';
        var projection = 'EPSG:3857';*/
        var originResult = {"viewBounds":{"top":42.03012064,"left":80.31936563000001,"bottom":36.16271048,"leftBottom":{"x":80.31936563000001,"y":36.16271048},"right":86.18677579,"rightTop":{"x":86.18677579,"y":42.03012064}},"viewer":{"leftTop":{"x":0,"y":0},"top":0,"left":0,"bottom":256,"rightBottom":{"x":256,"y":256},"width":256,"right":256,"height":256},"distanceUnit":null,"minVisibleTextSize":0,"coordUnit":"DEGREE","scale":1.037014405277582E-7,"description":"","paintBackground":false,"maxVisibleTextSize":0,"maxVisibleVertex":0,"clipRegionEnabled":false,"antialias":true,"textOrientationFixed":false,"angle":0,"prjCoordSys":{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"Longitude / Latitude Coordinate System---GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.00335281066474748,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},"minScale":0,"markerAngleFixed":false,"overlapDisplayedOptions":null,"visibleScales":[1.5714552575179423E-5,3.1429105150358845E-5,6.28582103007175E-5,1.257164206014358E-4,2.5143284120286843E-4,5.028656824057495E-4,0.001005731364811499,0.002011462729622998],"visibleScalesEnabled":true,"customEntireBoundsEnabled":false,"clipRegion":null,"maxScale":0,"customParams":"","center":{"x":83.25307071,"y":39.09641556},"dynamicPrjCoordSyses":[{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"Longitude / Latitude Coordinate System---GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.00335281066474748,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}}],"colorMode":null,"textAngleFixed":false,"overlapDisplayed":false,"userToken":{"userID":""},"cacheEnabled":true,"dynamicProjection":false,"autoAvoidEffectEnabled":true,"customEntireBounds":null,"name":"lichengbiao","bounds":{"top":42.03012064,"left":80.31936563,"bottom":41.14847258,"leftBottom":{"x":80.31936563,"y":41.14847258},"right":86.18677579,"rightTop":{"x":86.18677579,"y":42.03012064}},"backgroundStyle":{"fillGradientOffsetRatioX":0,"markerSize":0,"fillForeColor":{"red":255,"green":0,"blue":0,"alpha":255},"fillGradientOffsetRatioY":0,"markerWidth":0,"markerAngle":0,"fillSymbolID":0,"lineColor":{"red":0,"green":0,"blue":0,"alpha":255},"markerSymbolID":0,"lineWidth":0.01,"markerHeight":0,"fillOpaqueRate":100,"fillBackOpaque":false,"fillBackColor":{"red":255,"green":255,"blue":255,"alpha":255},"fillGradientMode":"NONE","lineSymbolID":0,"fillGradientAngle":0}};		
		var visibleScales = originResult.visibleScales;
		var visableResolution = [1.512478647543738E-4,7.56239323771869E-5,3.781196618859356E-5,1.890598309429666E-5,9.452991547148448E-6,4.726495773574106E-6,2.363247886787053E-6,1.1816239433935264E-6];		
		var prjParamter =  "+proj=longlat +datum=WGS84 +no_defs";
		var attrib = 'Map data &copy; 2013 Lantm?teriet, Imagery &copy; 2013 SuperMap';
		var projection = 'EPSG:3857';
        var maxZoom = 18;
        var zoom = 0;
        options = {};
        options.maxZoom = 18;
        options.minZoom = 0;
        options.attribution = attrib;
        if(originResult.overlapDisplayed){
            options.overlapDisplayed=originResult.overlapDisplayed;
        }
        var envelope;

        if(originResult.prjCoordSys){
            var resolution;
            if(originResult.prjCoordSys.coordUnit){
                resolution = scaleToResolution(originResult.scale, 96, originResult.prjCoordSys.coordUnit);
            }

            if(isMvt){
                var styleJson = getVectorStyle();
                // 如果style.json中有indexbounds，那么就根据indexbounds计算地图的缩放层级zoom
                if(styleJson && styleJson.metadata && styleJson.metadata.indexbounds){
                    var indexbounds = styleJson.metadata.indexbounds;
                    if(indexbounds.length == 4) {
                        envelope = {};
                        envelope.left = indexbounds[0];
                        envelope.bottom = indexbounds[1];
                        envelope.right = indexbounds[2];
                        envelope.top = indexbounds[3];
                    }
                } else {
                    envelope = getProjectionExtent();
                }
            }

            if(visableResolution.length == 0){
                if(!envelope) {
                    envelope = getProjectionExtent();
                }
                if(!envelope) {
                    envelope = originResult.bounds;
                }
                visableResolution = getStyleResolutions(envelope);
                var scales = getScales(envelope, originResult.prjCoordSys.coordUnit);
                if(originResult.scale){
                    var temp;
                    for(var j = 0; j < scales.length; j++){
                        if(j == 0) {
                            temp = Math.abs(originResult.scale - scales[j]);
                        }
                        if(temp > Math.abs(originResult.scale - scales[j])){
                            temp = Math.abs(originResult.scale - scales[j]);
                            zoom = j;
                        }
                    }
                }
            } else {
                if(resolution){
                    var temp;
                    for(var j = 0; j < visableResolution.length; j++){
                        if(j == 0) {
                            temp = Math.abs(resolution - visableResolution[j]);
                        }
                        if(temp > Math.abs(resolution - visableResolution[j])){
                            temp = Math.abs(resolution - visableResolution[j]);
                            zoom = j;
                        }
                    }
                }
            }
            if(epsgcode&&originResult.prjCoordSys.type!="PCS_NON_EARTH") {//有设置动态投影而且不是平面坐标的地图
                if(epsgcode=="4326"){
                    options.projection = 4326;
                    projection = 'EPSG:4326';
                }else if(epsgcode=="3857"){
                    options.projection = 3857;
                    projection = 'EPSG:3857';
                }
            } else {//没有设置动态投影
                if(isMvt && originResult.prjCoordSys.epsgCode && originResult.prjCoordSys.epsgCode != -1000 && originResult.prjCoordSys.epsgCode != -1){
                    projection = 'EPSG:' + originResult.prjCoordSys.epsgCode;
                } else if (originResult.prjCoordSys.epsgCode=="4326" || originResult.prjCoordSys.type=="PCS_EARTH_LONGITUDE_LATITUDE") {
                    lon = (originResult.bounds.left + originResult.bounds.right) / 2;
                    lat = (originResult.bounds.bottom + originResult.bounds.top) / 2;
                    projection = 'EPSG:4326';
                } else if (originResult.prjCoordSys.epsgCode=="3857" || originResult.prjCoordSys.type=="PCS_SPHERE_MERCATOR") {
                    projection = 'EPSG:3857';
                } else if (originResult.prjCoordSys.type=="PCS_NON_EARTH") {
                    projection = new ol.proj.Projection({
                        extent: [originResult.bounds.left, originResult.bounds.bottom, originResult.bounds.right, originResult.bounds.top],
                        units: 'm',
                        code: '0'
                    });
                } else {
                    projection = 'EPSG:3857';
                }
            }
        }

        var tileGrid;
        if(visableResolution.length > 0) {
            tileGrid = new ol.tilegrid.TileGrid({
                extent: [originResult.bounds.left, originResult.bounds.bottom, originResult.bounds.right, originResult.bounds.top],
                resolutions: visableResolution
            });
        }else{
            tileGrid = ol.source.TileSuperMapRest.optionsFromMapJSON(url, originResult).tileGrid;
            visableResolution = tileGrid.getResolutions();
        }

        if(isMvt && projection != 'EPSG:3857' && projection != 'EPSG:4326'){
            if(prjParamter){
                proj4.defs(projection,prjParamter);
                var prj = ol.proj.get(projection);
                prj.setExtent([envelope.left, envelope.bottom, envelope.right, envelope.top]);
            }
        }

        view = new ol.View({
            center: [(originResult.bounds.left + originResult.bounds.right) / 2, (originResult.bounds.bottom + originResult.bounds.top) / 2],
            zoom: zoom,
            projection: projection,
            resolutions: visableResolution
        });

        if(isMvt){
            var container = document.getElementById('popup');
            var content = document.getElementById('popup-content');
            info = new ol.control.Control({
                element: container
            });
            info.setMap(map);
            map.addControl(info);

        }
        var format = new ol.format.MVT({
            featureClass: ol.Feature
        });
        format.defaultDataProjection = new ol.proj.Projection({
            code: projection,
            units: ol.proj.Units.TILE_PIXELS
        });

        if(isMvt){
            var host = "http://119.3.246.90:8090/iserver/services/map-ugcv5-Kilometer/rest";
            host = host.substring(0,host.indexOf("/iserver"));
            url = (window.isLocal ? window.server : host) + url;
            var styleResolutions = getStyleResolutions(envelope);
            var style = new ol.supermap.MapboxStyles({
                url: url,
                source: originResult.name,
                resolutions: styleResolutions,
                map:map
            })
            var origin = [envelope.left, envelope.top];
            style.on('styleloaded', function () {
                vectorLayer = new ol.layer.VectorTile({
                    //设置避让参数
                    declutter: true,
                    source: new ol.source.VectorTileSuperMapRest({
                        url: url,
                        projection: projection,
                        tileGrid: new ol.tilegrid.TileGrid({
                            resolutions: styleResolutions,
                            origin: origin,
                            tileSize: 512
                        }),
                        tileType: "ScaleXY",
                        format: format
                    }),
                    style: style.getStyleFunction()
                });
                map.addLayer(vectorLayer);
            })

            map.on('pointermove', function (e) {
                var features = map.getFeaturesAtPixel(e.pixel);
                if (!features) {
                    content.innerHTML = '';
                    container.style.opacity = 0;
                    return;
                }
                content.innerHTML = "Layer: " + features[0].get('layer') + "<br />" + (features[0].get('NAME') ?
                    "Name:  " + features[0].get('NAME') : "");
                container.style.opacity = 1;

            });
        }else{
            options.url = url;
            options.tileGrid = tileGrid;
            layer = new ol.layer.Tile({
                source: new ol.source.TileSuperMapRest(options)
            });
            map.addLayer(layer);
        }
    }

    function getProjection(epsgCodeStr, bounds, resolutions) {
        return new L.Proj.CRS(epsgCodeStr,"",{
            bounds: L.bounds([bounds.left, bounds.bottom], [bounds.right, bounds.top]),
            resolutions: resolutions,
            origin: [bounds.left, bounds.top]
        });
    }

    function showScale(){
        var scale = layer.getScale();
        scale = parseInt(1 / scale * 10) / 10;
        var scaleText = document.getElementById("scaleText");
        scaleText.value="比例尺： 1/" + scale;
    }

    function showCoords(){
        var mapdiv = document.getElementById("map");
        var coordsText = document.getElementById("coordsText");
        mapdiv.onmousemove = function(e){
            e = e||window.event;
            var point = map.mouseEventToLatLng(e);
            coordsText.value=parseFloat(point.lat).toFixed(4)+","+parseFloat(point.lng).toFixed(4);
        }
    }

    function getProjectionExtent(){
        var requestUrl = "/iserver/services/map-ugcv5-Kilometer/rest/maps/Kilometer";
        requestUrl = requestUrl + "/" + "prjCoordSys/projection/extent.json";
        var commit = new Requester();
        var extent = commit.sendRequestWithResponse(requestUrl, "GET", null);
        if(extent){
            var result = eval('('+extent+')');
            if(result && result.left && result.right && result.top && result.bottom) {
                return result;
            }
        }
        return null;
    }

    function getVectorStyle(){
        var requestUrl = "/iserver/services/map-ugcv5-Kilometer/rest/maps/Kilometer";
        requestUrl = requestUrl + "/" + "tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true";
        var commit = new Requester();
        try {
            var style = commit.sendRequestWithResponse(requestUrl, "GET", null);
            return JSON.parse(style);
        }catch(ex){
            return null;
        }
    }

    function setPrjCoordSys() {// 支持动态投影，解析url相应参数
    }

    function scaleToResolution(scale, dpi, mapUnit) {
        var inchPerMeter = 1 / 0.0254;
        var meterPerMapUnitValue = getMeterPerMapUnit(mapUnit);
        var resolution = scale * dpi * inchPerMeter * meterPerMapUnitValue;
        resolution = 1 / resolution;
        return resolution;
    }

    function resolutionToScale(resolution, dpi, mapUnit) {
        var inchPerMeter = 1 / 0.0254;
        // 地球半径。
        var meterPerMapUnit = getMeterPerMapUnit(mapUnit);
        var scale = resolution * dpi * inchPerMeter * meterPerMapUnit;
        scale = 1 / scale;
        return scale;
    }

    function getMeterPerMapUnit(mapUnit) {
        var earchRadiusInMeters = 6378137;// 6371000;
        var meterPerMapUnit;
        if (mapUnit == "METER") {
            meterPerMapUnit = 1;
        } else if (mapUnit == "DEGREE") {
            // 每度表示多少米。
            meterPerMapUnit = Math.PI * 2 * earchRadiusInMeters / 360;
        } else if (mapUnit == "KILOMETER") {
            meterPerMapUnit = 1.0E-3;
        } else if (mapUnit == "INCH") {
            meterPerMapUnit = 1 / 2.5399999918E-2;
        } else if (mapUnit == "FOOT") {
            meterPerMapUnit = 0.3048;
        }
        return meterPerMapUnit;
    }

    //由于mvt的style渲染必须要传一个完整的分辨率数组，这里计算出一个从0开始的分辨率数组
    function getStyleResolutions(bounds){
        var styleResolutions = [];
        var temp = Math.abs(bounds.left - bounds.right)/ 512;
        for(var i = 0;i < 22;i++){
            if(i == 0){
                styleResolutions[i] = temp;
                continue;
            }
            temp = temp / 2;
            styleResolutions[i] = temp;
        }
        return styleResolutions;
    }

    function getScales(bounds, coordUnit){
        var resolution0 = Math.abs(bounds.left - bounds.right)/ 512;
        var temp = resolutionToScale(resolution0, 96, coordUnit);
        var scales = [];
        for(var i = 0;i < 22;i++){
            if(i == 0){
                scales[i] = temp;
                continue;
            }
            temp = temp * 2;
            scales[i] = temp;
        }
        return scales;
    }

    _.prototype.addLayer = function(){
        map.addLayer(layer);
    }

    _.prototype.removeLayer = function(){
        map.removeLayer(layer);
    }

    return _;

})()
