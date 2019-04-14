var url = "http://47.94.11.219:8090/iserver/services/map-KUA/rest/maps/东站333_1@4326",trainMap,
    messageControl,loadSon1,loadSon2;

$(function(){
    init();
})
function init() {
    document.title="资源open layers3表述";
    loadMap();
    loadMessage();
    loadArea();
    selectEvent();
    login();
    dataList();
    /*new ol.supermap.LayerInfoService("http://47.94.11.219:8090/iserver/services/map-KUA/rest/maps/东站333_1@4326/tempLayersSet/{warning_Line@4326}/Rivers@World@@World").getLayersInfo(function(result){
       console.log(result);
    })*/
}

function login(){
    var comment = {
        'username':'admin',
        'password':'888888'
    };
    $.ajax({
        url: baseUrl+"/rc-bms/user/login",
        data: JSON.stringify(comment),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        cache: false,
        success: function(data) {
            console.log(data);
        },
        error: function(xhr) {
            console.error(xhr.responseText);
        }
    });

}

function loadMap() {
     trainMap = new TrainMap({
        originResult:{"viewBounds":{"top":41.74646385083608,"left":86.1920203561631,"bottom":41.745599971786646,"leftBottom":{"x":86.1920203561631,"y":41.745599971786646},"right":86.19288423521253,"rightTop":{"x":86.19288423521253,"y":41.74646385083608}},"viewer":{"leftTop":{"x":0,"y":0},"top":0,"left":0,"bottom":256,"rightBottom":{"x":256,"y":256},"width":256,"right":256,"height":256},"distanceUnit":"METER","minVisibleTextSize":0.1,"coordUnit":"DEGREE","scale":7.043334204907002E-4,"description":"","paintBackground":true,"maxVisibleTextSize":1000,"maxVisibleVertex":3600000,"clipRegionEnabled":false,"antialias":false,"textOrientationFixed":false,"angle":0,"prjCoordSys":{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"Longitude / Latitude Coordinate System---GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.00335281066474748,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},"minScale":0,"markerAngleFixed":false,"overlapDisplayedOptions":{"allowPointWithTextDisplay":true,"horizontalOverlappedSpaceSize":0,"allowPointOverlap":true,"allowThemeGraduatedSymbolOverlap":false,"verticalOverlappedSpaceSize":0,"allowTextOverlap":false,"allowThemeGraphOverlap":false,"allowTextAndPointOverlap":true},"visibleScales":[],"visibleScalesEnabled":false,"customEntireBoundsEnabled":false,"clipRegion":{"center":null,"parts":null,"style":null,"prjCoordSys":null,"id":0,"type":"REGION","partTopo":null,"points":null},"maxScale":1.0E12,"customParams":"","center":{"x":86.19245229568781,"y":41.74603191131136},"dynamicPrjCoordSyses":[{"distanceUnit":null,"projectionParam":null,"epsgCode":0,"coordUnit":null,"name":null,"projection":null,"type":"PCS_ALL","coordSystem":null}],"colorMode":"DEFAULT","textAngleFixed":false,"overlapDisplayed":false,"userToken":{"userID":""},"cacheEnabled":true,"dynamicProjection":false,"autoAvoidEffectEnabled":true,"customEntireBounds":null,"name":"东站333_1@4326","bounds":{"top":41.75257005329401,"left":86.18339288847393,"bottom":41.739791493063485,"leftBottom":{"x":86.18339288847393,"y":41.739791493063485},"right":86.2041231679664,"rightTop":{"x":86.2041231679664,"y":41.75257005329401}},"backgroundStyle":{"fillGradientOffsetRatioX":0,"markerSize":2.4,"fillForeColor":{"red":255,"green":255,"blue":255,"alpha":255},"fillGradientOffsetRatioY":0,"markerWidth":0,"markerAngle":0,"fillSymbolID":0,"lineColor":{"red":0,"green":0,"blue":0,"alpha":255},"markerSymbolID":0,"lineWidth":0.1,"markerHeight":0,"fillOpaqueRate":100,"fillBackOpaque":true,"fillBackColor":{"red":255,"green":255,"blue":255,"alpha":255},"fillGradientMode":"NONE","lineSymbolID":0,"fillGradientAngle":0}},
        url:url
    });
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

function loadArea(){
    var sp = new SelectPlugin({
        fistUlId:"workingInterval"
    });

    sp.createParentList({
        data:firstData._data.list,
        customKeyValue:{
            name:"mileageSegmentName"
        },
        fn:function (o){
            loadSon = true;
            var id =  $(o).attr("id");
            var type = $(o).attr("datatype");
            if(loadSon1 != true && type=="0"){
                sp.createSonList({
                    pId:id,
                    data:type=="0"?k457_t._data.list:k457._data.list,
                    customKeyValue:{
                        name:"workSegmentName"
                    },
                    fn:function (o){
                        console.log($(o).data())
                        var c = minpoint([$(o).data().startLongitude,$(o).data().startLatitude],[$(o).data().endLongitude,$(o).data().endLatitude]);
                        trainMap.moveTo(c)
                    }
                });
                showSonDiv(id+"_div");
                loadSon1 = true;
                return;
            }

            if(loadSon2 != true && type=="1"){
                sp.createSonList({
                    pId:id,
                    data:type=="0"?k457_t._data.list:k457._data.list,
                    customKeyValue:{
                        name:"workSegmentName"
                    },
                    fn:function(o){
                        var c = minpoint([$(o).data().startLongitude,$(o).data().startLatitude],[$(o).data().endLongitude,$(o).data().endLatitude]);
                        trainMap.moveTo(c)
                    }
                })
                showSonDiv(id+"_div");
                loadSon2 = true;
                return;
            }
            $("#"+id+"_div").hide();
            showSonDiv(id+"_div");
            if(type=="0"){
                loadSon1 = false;
            }else{
                loadSon2 = false;
            }
        }
    })
}


function selectEvent(){


    var time = null;
    var list = $("#navlist");
    var box = $("#navbox");
    var lista = list.find("a");

    for(var i=0,j=lista.length;i<j;i++){
        if(lista[i].className == "now"){
            var olda = i;
        }
    }

    var box_show = function(hei){
        box.stop().animate({
            height:hei,
            opacity:1
        },400);
    }

    var box_hide = function(){
        box.stop().animate({
            height:0,
            opacity:0
        },400);
    }

    lista.hover(function(){
        lista.removeClass("now");
        $(this).addClass("now");
        clearTimeout(time);
        box.find(".cont").show();
        var _height = box.find(".cont").height()+54;
        box_show(190)
    },function(){
        time = setTimeout(function(){
            box.find(".cont").hide();
            box_hide();
        },50);
        lista.removeClass("now");
        lista.eq(olda).addClass("now");
    });

    box.find(".cont").hover(function(){
        var _index = box.find(".cont").index($(this));
        lista.removeClass("now");
        lista.eq(_index).addClass("now");
        clearTimeout(time);
        $(this).show();
        var _height = $(this).height()+54;
        //box_show(_height);
    },function(){
        time = setTimeout(function(){
            $(this).hide();
            box_hide();
        },50);
        lista.removeClass("now");
        lista.eq(olda).addClass("now");
    });


}

function showSonDiv(i){
    var o = $("#"+i);
    if(o.is(':hidden')){
        var h =  $("#navbox").height()-o.height();
        $("#navbox").animate({
            height:h,
            opacity:1
        },400);

    }else{
        var h =  $("#navbox").height()+o.height();
        $("#navbox").animate({
            height:h,
            opacity:1
        },400);

    }

}

function dataList(){
    //列定义，注意是又层中括号
    var cols = [[
        {field:'id',title:'序号',displayTip:true, width:100, align:'center'},
        {field:'name1',title:'告警时间',displayTip:true,width:170,align:'center'},
        {field:'name2',title:'作业区间',displayTip:true,width:170,align:'center'},
        {field:'name3',title:'作业面',displayTip:true,width:170,align:'center'},
        {field:'name4',title:'部门名称',displayTip:true,width:170,align:'center'},
        {field:'name5',title:'人员类型',displayTip:true,width:170,align:'center'},
        {field:'name6',title:'姓 名',displayTip:true,width:170,align:'center'},
        {field:'name7',title:'联系电话',displayTip:true,width:170,align:'center'},
        {field:'name8',title:'告警原因',displayTip:true,width:170,align:'center'}
    ]];

    //表格初始化
    $('#list1').datagrid({
        idField:"id", //明确唯一主键
       // frozenColumns:[[{field:'ck',checkbox:fale}]],//复选框列
        columns:cols,//普通列
        showHeader:true,//是否显示表头，默认true显示
        nowrap:false, //false可自动换行，默认true
        onDblClickRow:function(rowIndex, rowData){ alert("单击事件："+rowIndex+"--"+rowData.name);}, //行双击事件
        onClickRow:function(rowIndex, rowData){ }, //行单击事件
       // width:"100%", //初始宽
        height:130, //实始高
        pagination:false //显示分页栏
    });

    $.ajax({
        url: baseUrl+"/rc-bms/user/login",
        data: JSON.stringify(comment),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        cache: false,
        success: function(data) {
            console.log(data);
        },
        error: function(xhr) {
            console.error(xhr.responseText);
        }
    });


    var data =[];
    for(var i=0;i<20;i++){
        data.push({id:i+"",name1:i+"呵呵"+(i%10==1?"abc def ghi jkl mno pqr stu vwx yz":""),name2:(i%2),  name3:(i==1) ,name4:i,name5:i,name6:i,name7:i,name8:i});
    }

    //加载数据
    $('#list1').datagrid("loadData",data);
}