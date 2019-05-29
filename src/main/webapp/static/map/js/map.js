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
    var map, layer, view, options,vectorLayer,sourceVector,prjCoordSys,overlay,epsgcode,url = "http://119.3.246.90:8090/iserver/services/ditu/rest/maps/ditu",isMvt = false;
    var lon=0,lat=0,zoomlevel=2,initZoomToScale;
    var envelope;
    var waringObj = {};

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

        var originResult = {"viewBounds":{"top":41.5500857651,"left":81.5096352129,"bottom":40.8040526156,"leftBottom":{"x":81.5096352129,"y":40.8040526156},"right":82.25566836239999,"rightTop":{"x":82.25566836239999,"y":41.5500857651}},"viewer":{"leftTop":{"x":0,"y":0},"top":0,"left":0,"bottom":256,"rightBottom":{"x":256,"y":256},"width":256,"right":256,"height":256},"distanceUnit":null,"minVisibleTextSize":0,"coordUnit":"DEGREE","scale":8.155922912634746E-7,"description":"","paintBackground":false,"maxVisibleTextSize":0,"maxVisibleVertex":0,"clipRegionEnabled":false,"antialias":true,"textOrientationFixed":false,"angle":0,"prjCoordSys":{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"Longitude / Latitude Coordinate System---GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.00335281066474748,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},"minScale":0,"markerAngleFixed":false,"overlapDisplayedOptions":null,"visibleScales":[1.5714552575179423E-5,3.1429105150358845E-5,6.28582103007175E-5,1.257164206014358E-4,2.5143284120286843E-4,5.028656824057495E-4,0.001005731364811499,0.002011462729622998],"visibleScalesEnabled":true,"customEntireBoundsEnabled":false,"clipRegion":null,"maxScale":0,"customParams":"","center":{"x":81.88265178764999,"y":41.17706919035},"dynamicPrjCoordSyses":[{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"Longitude / Latitude Coordinate System---GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.00335281066474748,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}}],"colorMode":null,"textAngleFixed":false,"overlapDisplayed":false,"userToken":{"userID":""},"cacheEnabled":true,"dynamicProjection":false,"autoAvoidEffectEnabled":true,"customEntireBounds":null,"name":"ditu","bounds":{"top":41.5500857651,"left":81.5096352129,"bottom":41.3957086657,"leftBottom":{"x":81.5096352129,"y":41.3957086657},"right":82.2556683624,"rightTop":{"x":82.2556683624,"y":41.5500857651}},"backgroundStyle":{"fillGradientOffsetRatioX":0,"markerSize":0,"fillForeColor":{"red":255,"green":0,"blue":0,"alpha":255},"fillGradientOffsetRatioY":0,"markerWidth":0,"markerAngle":0,"fillSymbolID":0,"lineColor":{"red":0,"green":0,"blue":0,"alpha":255},"markerSymbolID":0,"lineWidth":0.01,"markerHeight":0,"fillOpaqueRate":100,"fillBackOpaque":false,"fillBackColor":{"red":255,"green":255,"blue":255,"alpha":255},"fillGradientMode":"NONE","lineSymbolID":0,"fillGradientAngle":0}};
        var visibleScales = originResult.visibleScales;
        var visableResolution = [1.512478647543738E-4,7.56239323771869E-5,3.781196618859356E-5,1.890598309429666E-5,9.452991547148448E-6,4.726495773574106E-6,2.363247886787053E-6,1.1816239433935264E-6];
        var prjParamter =  "+proj=longlat +datum=WGS84 +no_defs";
        var attrib = 'Map data &copy; 2013 Lantm?teriet, Imagery &copy; 2013 SuperMap';
        var projection = 'EPSG:3857';
        var maxZoom = 18;
        var zoom = 0;
        this.container = document.getElementById('popup');
        this.content = document.getElementById('popup-content');
        this.closer = $('#popup-closer');
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
            zoom: 3,
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

        map.on('pointermove',function(e){
            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            if(hit){
                map.getTargetElement().style.cursor = 'pointer';
            }
            else{
                map.getTargetElement().style.cursor = '';
            }
        });

        map.on("singleclick",function(e){
            var pixel = e.pixel;
            var map = e.map;
            var f = map.getFeaturesAtPixel(pixel);
            if(f){
                f.forEach(function(fe){
                    var  fId = fe.getId();
                    var pointsFeature = sourceVector.getFeatureById(fId);
                    if(pointsFeature){
                        var manData = fId.split("_");
                        if(manData.length != 2) return;
                        console.log(manData);
                        var manId =manData[0];
                        var manType = manData[1];
                        //baseUrl+
                        axios.post(baseUrl+"/rc-bms/workWarning/userWarningList", {
                            id: manId,
                            type: manType
                        }).then(function (response) {
                                if(response.data._data){
                                    $("#nickName").text(response.data._data.nick || "");
                                    $("#depName").text(response.data._data.depName || "");
                                    $("#mobile").text(response.data._data.mobile || "");
                                    $("#roleName").text(response.data._data.roleName || "");
                                    var textStr = "";
                                    var listData = response.data._data.list;
                                    for(var i=0;i<listData.length;i++){
                                        if(i == 5) return;
                                        var datetime = new Date();
                                        datetime.setTime(listData[i].createTime);
                                        var dYear = datetime.getFullYear();
                                        var dMonth =datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
                                        var dDate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
                                        textStr+=
                                            "<tr class='tableTr'>"+
                                               "<td>"+listData[i].workSegmentName+"</td>"+
                                                "<td>"+dYear+"."+dMonth+"."+dDate+"</td>"+
                                            "<td>"+enumTypeForAlarm[listData[i].type]+"</td>"+
                                            "</tr>"
                                    }
                                    $("#alarmTableTbody").html(textStr);
                                    $(".personInfomation").show();
                                }
                        }).catch(function (error) {
                                console.log(error);
                            });

                    }
                })
            }
        })

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
          f.setId(param.properties.id+"_"+param.properties.type);
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
