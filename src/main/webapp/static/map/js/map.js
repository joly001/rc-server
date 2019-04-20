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
    var map, layer, view, options,prjCoordSys,epsgcode,vectorLayer,sourceVector,overlay ;
    var lon=0,lat=0,zoomlevel=2,initZoomToScale;
    var waringObj = {};
    var peopleSet = {};
    function _(optionsObj){
        var originResult =optionsObj.originResult;
        var visableResolution = [];
        var attrib = 'Map data &copy; 2013 Lantm?teriet, Imagery &copy; 2013 SuperMap';
        var url = optionsObj.url;
        var projection = 'EPSG:3857';
        this.container = document.getElementById('popup');
        this.content = document.getElementById('popup-content');
        this.closer = $('#popup-closer');
        options = {};
        options.maxZoom = 18;
        options.minZoom = 0;
        options.attribution = attrib;

        if(originResult.prjCoordSys){
            if(epsgcode&&originResult.prjCoordSys.type!="PCS_NON_EARTH") {//有设置动态投影而且不是平面坐标的地图
                if(epsgcode=="4326"){
                    options.projection = 4326;
                    projection = 'EPSG:4326';
                }else if(epsgcode=="3857"){
                    options.projection = 3857;
                    projection = 'EPSG:3857';
                }
            } else {//没有设置动态投影
                if(originResult.prjCoordSys.epsgCode=="4326" || originResult.prjCoordSys.type=="PCS_EARTH_LONGITUDE_LATITUDE") {
                    lon = (originResult.bounds.left + originResult.bounds.right) / 2;
                    lat = (originResult.bounds.bottom + originResult.bounds.top) / 2;
                    projection = 'EPSG:4326';
                } else if(originResult.prjCoordSys.type=="PCS_NON_EARTH") {
                    projection = new ol.proj.Projection({
                        extent: [originResult.bounds.left, originResult.bounds.bottom, originResult.bounds.right, originResult.bounds.top],
                        units: 'm'
                    });
                }else {
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
        view = new ol.View({
            center: [86.1918660498009,41.7455356987923],
            zoom: 6,
            projection: projection,
            resolutions: visableResolution
        });

        map = new ol.Map({
            target: 'map',
            view: view,
            controls: ol.control.defaults({attribution: false})
        });
        options.url = url;
        options.tileGrid = tileGrid;
        layer = new ol.layer.Tile({
            source: new ol.source.TileSuperMapRest(options)
        });

        vectorLayer = new ol.layer.Vector({
            id : 'vectorLayer',
            zIndex: 99
        });

        sourceVector = new ol.source.Vector();
        vectorLayer.setSource(sourceVector);

        map.addLayer(layer);
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