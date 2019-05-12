function mercatorTolonlat(mercator){
    var lonlat={x:0,y:0};
    var x = mercator[0]/20037508.34*180;
    var y = mercator[1]/20037508.34*180;
    y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
    lonlat.x = x;
    lonlat.y = y;
    return [x,y];
}

var TrainMap = (function(){
    var map, layer, view, options,vectorLayer,sourceVector,prjCoordSys,overlay,epsgcode,url = "http://119.3.246.90:8090/iserver/services/map-KuAKaXianLuXinXi/rest/maps/东站333底图",isMvt = false;
    var lon=0,lat=0,zoomlevel=2,initZoomToScale;
    var envelope;

    function _(optionsObj){
        var queryString = "";
        // 中继服务发送的请求，queryString字段是类似“token=&isMvt=true"这种情况，和普通请求做一下兼容处理
        var parms = queryString.split("&");
        for(var i = 0; i < parms.length; i++) {
            if(parms[i] == "isMvt=true") {
                isMvt = true;
                break;
            }
        }

        var originResult = {"viewBounds":{"top":4624338.953126392,"left":432357.51642065943,"bottom":4623179.438597568,"leftBottom":{"x":432357.51642065943,"y":4623179.438597568},"right":433517.0309494831,"rightTop":{"x":433517.0309494831,"y":4624338.953126392}},"viewer":{"leftTop":{"x":0,"y":0},"top":0,"left":0,"bottom":256,"rightBottom":{"x":256,"y":256},"width":256,"right":256,"height":256},"distanceUnit":"METER","minVisibleTextSize":0.1,"coordUnit":"METER","scale":5.841525194345576E-5,"description":"","paintBackground":true,"maxVisibleTextSize":1000,"maxVisibleVertex":3600000,"clipRegionEnabled":false,"antialias":false,"textOrientationFixed":false,"angle":0,"prjCoordSys":{"distanceUnit":"METER","projectionParam":{"centralParallel":0,"firstPointLongitude":0,"rectifiedAngle":0,"scaleFactor":1,"falseNorthing":0,"centralMeridian":87,"secondStandardParallel":0,"secondPointLongitude":0,"azimuth":0,"falseEasting":500000,"firstStandardParallel":0},"epsgCode":4538,"coordUnit":"METER","name":"China_2000_3_DEGREE_GK_Zone_29N","projection":{"name":"Gauss_Kruger","type":"PRJ_GAUSS_KRUGER"},"type":"PCS_CHINA_2000_3_DEGREE_GK_29N","coordSystem":{"datum":{"name":"D_China_2000","type":"DATUM_CHINA_2000","spheroid":{"flatten":0.00335281068118232,"name":"CGCS2000","axis":6378137,"type":"SPHEROID_CHINA_2000"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_China_2000","type":"GCS_CHINA_2000","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},"minScale":0,"markerAngleFixed":false,"overlapDisplayedOptions":{"allowPointWithTextDisplay":true,"horizontalOverlappedSpaceSize":0,"allowPointOverlap":true,"allowThemeGraduatedSymbolOverlap":false,"verticalOverlappedSpaceSize":0,"allowTextOverlap":false,"allowThemeGraphOverlap":false,"allowTextAndPointOverlap":true},"visibleScales":[5.841525194345576E-5,1.1683050388691152E-4,2.336610077738228E-4,4.6732201554764666E-4,9.346440310952977E-4,0.0018692880621905953,0.003738576124381197],"visibleScalesEnabled":true,"customEntireBoundsEnabled":false,"clipRegion":{"center":null,"parts":null,"style":null,"prjCoordSys":null,"id":0,"type":"REGION","partTopo":null,"points":null},"maxScale":1.0E12,"customParams":"","center":{"x":432937.27368507127,"y":4623759.19586198},"dynamicPrjCoordSyses":[{"distanceUnit":null,"projectionParam":null,"epsgCode":0,"coordUnit":null,"name":null,"projection":null,"type":"PCS_ALL","coordSystem":null}],"colorMode":"DEFAULT","textAngleFixed":false,"overlapDisplayed":false,"userToken":{"userID":""},"cacheEnabled":true,"dynamicProjection":false,"autoAvoidEffectEnabled":true,"customEntireBounds":null,"name":"东站333底图","bounds":{"top":4624460.895532484,"left":432081.5990853539,"bottom":4623057.4961914765,"leftBottom":{"x":432081.5990853539,"y":4623057.4961914765},"right":433792.9482847886,"rightTop":{"x":433792.9482847886,"y":4624460.895532484}},"backgroundStyle":{"fillGradientOffsetRatioX":0,"markerSize":2.4,"fillForeColor":{"red":255,"green":255,"blue":255,"alpha":255},"fillGradientOffsetRatioY":0,"markerWidth":0,"markerAngle":0,"fillSymbolID":0,"lineColor":{"red":0,"green":0,"blue":0,"alpha":255},"markerSymbolID":0,"lineWidth":0.1,"markerHeight":0,"fillOpaqueRate":100,"fillBackOpaque":true,"fillBackColor":{"red":255,"green":255,"blue":255,"alpha":255},"fillGradientMode":"NONE","lineSymbolID":0,"fillGradientAngle":0}};
        var visibleScales = originResult.visibleScales;
        var visableResolution = [4.529353628217545,2.2646768141087725,1.1323384070543876,0.5661692035271924,0.28308460176359485,0.14154230088179742,0.0707711504408986];
        var prjParamter =  "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs";
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
            zoom: 2,
            projection: projection,
            resolutions: visableResolution
        });


        map = new ol.Map({
            target: 'map',
            view: view
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
            var host = "http://119.3.246.90:8090/iserver/services/map-KuAKaXianLuXinXi/rest";
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

        vectorLayer = new ol.layer.Vector({
            id : 'vectorLayer',
            zIndex: 99
        });

        sourceVector = new ol.source.Vector();
        vectorLayer.setSource(sourceVector);

        map.addLayer(vectorLayer);

        /*********************显示弹出层**************************/
        var container = document.getElementById("popup");
        var content = document.getElementById("popup-content");
        var popupCloser = document.getElementById("popup-closer");

        overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));

        popupCloser.addEventListener('click',function(){
            overlay.setPosition(undefined);
        });

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
            var requestUrl = "/iserver/services/map-KuAKaXianLuXinXi/rest/maps/东站333底图";
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
            var requestUrl = "/iserver/services/map-KuAKaXianLuXinXi/rest/maps/东站333底图";
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

    }

    _.prototype.getMap =function(){
        return map;
    }
    _.prototype.addPoints = function(arr){
        var f = sourceVector.getFeatureById(arr.properties.id);
        if(f){
            f.getGeometry().setCoordinates(arr.geometry.coordinates);
            if(arr.properties.warningStatus == "true" && $("#t"+arr.properties.type).is(':checked')){
                var waringData = $.parseJSON(arr.properties.warning);
                this.content.innerHTML = waringData.waringContent ;
                overlay.setPosition(arr.geometry.coordinates);
                map.addOverlay(overlay);
                waringObj[arr.properties.id] = true
            }else if((arr.properties.warningStatus != "true") && waringObj[arr.properties.id]){
                overlay.setPosition(undefined);
                waringObj[arr.properties.id] = false;
            }
        }else{
            f= addPoint(arr,this)
            sourceVector.addFeature(f);
        }

    }

    _.prototype.moveTo = function (movetoCoordinate){
        var view  = map.getView();
        //var destination = ol.proj.transform(options.movetoCoordinate,'EPSG:4326', 'EPSG:3857')
        view.animate({
            center: movetoCoordinate,
            duration: 350,
            zoom:8
        });
    }


    _.prototype.showForType = function(type,isShow){
            var features = sourceVector.getFeatures();
            for(var i=0;i<features.length;i++){
                   var f =  features[i];
                   var id = f.getId();
                   var fType = f.get("showType")
                   if(fType == type && isShow){
                       //显示
                       f.setStyle(styleFunction(type));
                   }else if(fType == type){
                       //隐藏
                       f.setStyle(new ol.style.Style({
                           zIndex:0
                       }));

                       if(waringObj[id]){
                           overlay.setPosition(undefined);
                           waringObj[id] = false;
                       }
                   }

            }
    }

    _.prototype.showForLayer = function (type,isShow){

    }


     function addPoint (param,o){
          var f =  new ol.Feature({
              geometry:new ol.geom.Point(param.geometry.coordinates),
              featuretype:'point'
          });
          f.setId(param.properties.id);
          f.set("showType",param.properties.type);
          if($("#t"+param.properties.type).is(':checked')){
              f.setStyle(styleFunction(param.properties.type));
          }else{
              f.setStyle(new ol.style.Style({
                  // 设置一个标识
                  zIndex:0
              }));
          }
          f.setStyle(styleFunction(param.properties.type));
          if((param.properties.warningStatus == "true") && $("#t"+param.properties.type).is(':checked')){
              var waringData = $.parseJSON(param.properties.warning);
              o.content.innerHTML = waringData.waringContent ;
              overlay.setPosition(param.geometry.coordinates);
              map.addOverlay(overlay);
          }
          return f;
      }

    function  styleFunction(type) {
        var  imgSrc= 'images/106.png';
        if(type =="00"){
            imgSrc = "images/100.png"
        }else if(type =="01"){
            imgSrc = "images/101.png"
        }else if(type =="02"){
            imgSrc = "images/102.png"
        }else if(type =="03"){
            imgSrc = "images/104.png"
        }else if(type =="04"){
            imgSrc = "images/107.png"
        }else if(type =="05"){
            imgSrc = "images/103.png"
        }else if(type =="06"){
            imgSrc = "images/105.png"
        }
        return new ol.style.Style({
            // 设置一个标识
            image: new ol.style.Icon({
                src: imgSrc,
                anchor: [0.5, 0.5],
                scale: 0.15,
                rotateWithView: true,
            })
        })

    }
    return _;
})()
