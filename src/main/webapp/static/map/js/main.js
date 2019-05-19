var url = "http://119.3.246.90:8090/iserver/services/map-ugcv5-DongZhan333DiTu/rest/maps/东站333底图",trainMap,
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
        originResult:{"viewBounds":{"top":41.554970602788565,"left":82.14006286791144,"bottom":41.51625114941144,"leftBottom":{"x":82.14006286791144,"y":41.51625114941144},"right":82.17878232128857,"rightTop":{"x":82.17878232128857,"y":41.554970602788565}},"viewer":{"leftTop":{"x":0,"y":0},"top":0,"left":0,"bottom":256,"rightBottom":{"x":256,"y":256},"width":256,"right":256,"height":256},"distanceUnit":null,"minVisibleTextSize":0,"coordUnit":"DEGREE","scale":1.5714552575179423E-5,"description":null,"paintBackground":false,"maxVisibleTextSize":0,"maxVisibleVertex":0,"clipRegionEnabled":false,"antialias":false,"textOrientationFixed":false,"angle":0,"prjCoordSys":{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.0033528106647474805,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},"minScale":0,"markerAngleFixed":false,"overlapDisplayedOptions":null,"visibleScales":[1.5714552575179423E-5,3.1429105150358845E-5,6.28582103007175E-5,1.257164206014358E-4,2.5143284120286843E-4,5.028656824057495E-4,0.001005731364811499,0.002011462729622998,0.004022925459245187,0.00804585091849361],"visibleScalesEnabled":true,"customEntireBoundsEnabled":false,"clipRegion":null,"maxScale":0,"customParams":"","center":{"x":82.1594225946,"y":41.5356108761},"dynamicPrjCoordSyses":[{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.0033528106647474805,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}}],"colorMode":null,"textAngleFixed":false,"overlapDisplayed":false,"userToken":{"userID":""},"cacheEnabled":false,"dynamicProjection":false,"autoAvoidEffectEnabled":true,"customEntireBounds":null,"name":"东站333底图","bounds":{"top":41.5500857651,"left":82.0631768268,"bottom":41.5211359871,"leftBottom":{"x":82.0631768268,"y":41.5211359871},"right":82.2556683624,"rightTop":{"x":82.2556683624,"y":41.5500857651}},"backgroundStyle":null}
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
