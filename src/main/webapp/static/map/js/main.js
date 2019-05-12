var url = "http://119.3.246.90:8090/iserver/services/map-KuAKaXianLuXinXi/rest/maps/东站333@最新43582",trainMap,
    messageControl,loadSon1,loadSon2,localPage,loadSon,fatherDivH,list1H,list1TbodyH从,cordonLine,redCable,kilometer;

$(function(){
    init();
})
function init() {
    document.title="资源open layers3表述";
    loadMap();
    loadMessage();
}

function loadMap() {
     trainMap = new TrainMap({
        originResult:{"viewBounds":{"top":4623898.623665297,"left":432601.7618150609,"bottom":4623880.506250784,"leftBottom":{"x":432601.7618150609,"y":4623880.506250784},"right":432619.8792295738,"rightTop":{"x":432619.8792295738,"y":4623898.623665297}},"viewer":{"leftTop":{"x":0,"y":0},"top":0,"left":0,"bottom":256,"rightBottom":{"x":256,"y":256},"width":256,"right":256,"height":256},"distanceUnit":"METER","minVisibleTextSize":0.1,"coordUnit":"METER","scale":0.003738576124381197,"description":"","paintBackground":true,"maxVisibleTextSize":1000,"maxVisibleVertex":3600000,"clipRegionEnabled":false,"antialias":false,"textOrientationFixed":false,"angle":0,"prjCoordSys":{"distanceUnit":"METER","projectionParam":{"centralParallel":0,"firstPointLongitude":0,"rectifiedAngle":0,"scaleFactor":1,"falseNorthing":0,"centralMeridian":87,"secondStandardParallel":0,"secondPointLongitude":0,"azimuth":0,"falseEasting":500000,"firstStandardParallel":0},"epsgCode":4538,"coordUnit":"METER","name":"China_2000_3_DEGREE_GK_Zone_29N","projection":{"name":"Gauss_Kruger","type":"PRJ_GAUSS_KRUGER"},"type":"PCS_CHINA_2000_3_DEGREE_GK_29N","coordSystem":{"datum":{"name":"D_China_2000","type":"DATUM_CHINA_2000","spheroid":{"flatten":0.00335281068118232,"name":"CGCS2000","axis":6378137,"type":"SPHEROID_CHINA_2000"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_China_2000","type":"GCS_CHINA_2000","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},"minScale":0,"markerAngleFixed":false,"overlapDisplayedOptions":{"allowPointWithTextDisplay":true,"horizontalOverlappedSpaceSize":0,"allowPointOverlap":true,"allowThemeGraduatedSymbolOverlap":false,"verticalOverlappedSpaceSize":0,"allowTextOverlap":false,"allowThemeGraphOverlap":false,"allowTextAndPointOverlap":true},"visibleScales":[5.841525194345576E-5,1.1683050388691152E-4,2.336610077738228E-4,4.6732201554764666E-4,9.346440310952977E-4,0.0018692880621905953,0.003738576124381197],"visibleScalesEnabled":true,"customEntireBoundsEnabled":false,"clipRegion":{"center":null,"parts":null,"style":null,"prjCoordSys":null,"id":0,"type":"REGION","partTopo":null,"points":null},"maxScale":1.0E12,"customParams":"","center":{"x":432610.8205223174,"y":4623889.564958041},"dynamicPrjCoordSyses":[{"distanceUnit":null,"projectionParam":null,"epsgCode":0,"coordUnit":null,"name":null,"projection":null,"type":"PCS_ALL","coordSystem":null}],"colorMode":"DEFAULT","textAngleFixed":false,"overlapDisplayed":false,"userToken":{"userID":""},"cacheEnabled":true,"dynamicProjection":false,"autoAvoidEffectEnabled":true,"customEntireBounds":null,"name":"东站333@最新43582","bounds":{"top":4624460.912806389,"left":432081.5990853539,"bottom":4623057.4961914765,"leftBottom":{"x":432081.5990853539,"y":4623057.4961914765},"right":433792.9482847886,"rightTop":{"x":433792.9482847886,"y":4624460.912806389}},"backgroundStyle":{"fillGradientOffsetRatioX":0,"markerSize":2.4,"fillForeColor":{"red":255,"green":255,"blue":255,"alpha":255},"fillGradientOffsetRatioY":0,"markerWidth":0,"markerAngle":0,"fillSymbolID":0,"lineColor":{"red":0,"green":0,"blue":0,"alpha":255},"markerSymbolID":0,"lineWidth":0.1,"markerHeight":0,"fillOpaqueRate":100,"fillBackOpaque":true,"fillBackColor":{"red":255,"green":255,"blue":255,"alpha":255},"fillGradientMode":"NONE","lineSymbolID":0,"fillGradientAngle":0}}
        ,url:url
    });

    cordonLine  =  new CordonLine(trainMap.getMap());
    redCable = new RedCable(trainMap.getMap())
    kilometer = new Kilometer(trainMap.getMap());
}

function loadMessage() {
    messageControl = new MessageControl({
        url:wsUrl,
        onopen:function(){console.log("connect success")},
        onclose:function(){console.log("connect close")},
        onerror:function(){console.log("connect error")},
        onmessage:function(data){
            if(data){
                trainMap.addPoints(data);
            }else{
                console.error("数据解析失败");
            }
        }
    });
}

function minpoint(a,b){
    var x=(a[0]+b[0])/2;
    var y=(a[1]+b[1])/2;
    return [x,y];


}

function changeMapArea(startLongitude,startLatitude,endLongitude,endLatitude) {
    var mapArea = minpoint([startLongitude,startLatitude],[endLongitude,endLatitude]);
    trainMap.moveTo(mapArea)
}

function showType(type,display){
    trainMap.showForType(type,display);
}

function showLayer(type,display){
    trainMap.showForLayer(type,display);
    switch (type) {
        case 'CordonLine':
            if(display){
                cordonLine.addLayer();
            }else{
                cordonLine.removeLayer();
            }
            break;
        case 'Cable':
            if(display){
                redCable.addLayer();
            }else{
                redCable.removeLayer();
            }
            break;
        case 'Kilometer':
            if(display){
                kilometer.addLayer();
            }else{
                kilometer.removeLayer();
            }
            break
        default:
            console.error("未找到对应图层");
    }
}
