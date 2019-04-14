function mercatorTolonlat(mercator){
    var lonlat={x:0,y:0};
    var x = mercator[0]/20037508.34*180;
    var y = mercator[1]/20037508.34*180;
    y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
    lonlat.x = x;
    lonlat.y = y;
    console.log("X",x,"Y",y);
    return [x,y];
}

var TrainMap = (function(){
    var map, layer, view, options,prjCoordSys,epsgcode,vectorLayer,sourceVector;
    var lon=0,lat=0,zoomlevel=2,initZoomToScale;
    function _(optionsObj){
        var originResult =optionsObj.originResult;
        var visableResolution = [];
        var attrib = 'Map data &copy; 2013 Lantm?teriet, Imagery &copy; 2013 SuperMap';
        var url = optionsObj.url;
        var projection = 'EPSG:3857';
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
    }

    _.prototype.getMap =function(){
        return map;
    }
    _.prototype.addPoints = function(arr){

        var f = sourceVector.getFeatureById(arr.properties.id);
        if(f){
            //f.getGeometry().setCoordinates(mercatorTolonlat(arr.geometry.coordinates));
            f.getGeometry().setCoordinates(arr.geometry.coordinates);
        }else{
            f= addPoint(arr)
            sourceVector.addFeature(f);
        }
        console.log(f);
        console.log(f.getGeometry());

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

     function addPoint (param){
          var f =  new ol.Feature({
             // geometry:new ol.geom.Point(mercatorTolonlat(param.geometry.coordinates)),
              geometry:new ol.geom.Point(param.geometry.coordinates),
              featuretype:'point'
          });
          f.setId(param.properties.id);
          f.setStyle(styleFunction(param.properties.type));
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

                // 这个是相当于是进行切图了
                // size: [50,50],
                // 注意这个，竟然是比例 左上[0,0]  左下[0,1]  右下[1，1]
                anchor: [0.5, 0.5],
                // 这个直接就可以控制大小了
                scale: 0.15,
                // 开启转向
                rotateWithView: true,
                // rotation: ele.rotation||3.14 * Math.random(),
            }),
            /*text: new ol.style.Text({
                // 对其方式
                textAlign: 'center',
                // 基准线
                textBaseline: 'middle',
                offsetY: -25,
                // 文字样式
                font: 'normal 16px 黑体',
                // 文本内容
                text: `name:admin`,
                // 文本填充样式
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,255,1)'
                }),
                padding: [5, 5, 5, 5],
                backgroundFill: new ol.style.Fill({
                    color: 'rgba(0,0,0,0.6)'
                })
            })*/
        })

    }


    return _;
})()