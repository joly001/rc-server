var SelectPlugin = (function(){

    function _(options) {
        this.fistUlId = options.fistUlId;
    }

     _.HtmlStr = (function(){

        function _(option){
            this.customKeyValue = option.customKeyValue;
        }

         /**
          *
          * @param data = {name:"",id:""}
          *
          *
          *
          * @returns {string}
          */
        _.prototype.getParentSingleStr = function (data,i){
            var o = this;
            var str = '';
            var id = data.id?data.id:data[o.customKeyValue.id];
            var name = data.name?data.name:data[o.customKeyValue.name];
            str +=
            '<li style="overflow: auto;margin-top: 10px;padding-left: 18px;position: relative">'+
                '<div class="liDiv" style="overflow: auto;" dataType = "'+i+'" id = "'+id+'">'+
                  '<a style="float: left;margin-left: 5px;cursor: pointer">'+name+'</a>'+
                  '<div class="arr" style="float: right;margin-left: 10px;margin-right: 8px">'+
                        '<div class="arrUp"></div>'+
                        '<div class="arrDown"></div>'+
                    '</div>'+
                '</div>'+
                '<div id="'+id+'_div" style="display:none;height: 130px;text-align: center;">'+
                    '<ul id="'+id+'_ul">'+

                    '</ul>'+
               '</div>'+
            '</li>';
            return str;
        }

        _.prototype.getSonSingleStr = function (data,i) {
            var o = this;
            var id = data.id?data.id:data[o.customKeyValue.id];
            var name = data.name?data.name:data[o.customKeyValue.name];
            var str = '';
                 str +=
                    '<li id="'+id+'" style="margin-top: 10px;">'+
                        '<a><u>'+name+'</u></a>'+
                     '</li>';
                 return str;
        }

        _.prototype.getParent = function (data){
            var length = data.length;
            var str = '';
            if(!length) return console.error("请传入正确数据格式",data);
            for(var i=0;i<length;i++){
                str += this.getParentSingleStr(data[i],i);
            }
            return str;
        }

        _.prototype.getSon = function (data){
            var str = '';
            var length = data.length;
            if(!length) return console.error("请传入正确数据格式",data);
            for(var i=0;i<length;i++){
                str += this.getSonSingleStr(data[i],i);
            }
            return str;
        }

        return _;
    })();

    /**
     *
     * @param options{data:[...],customKeyValue:{...}}
     */
    _.prototype.createParentList = function (options){
        var length = options.data.length;
        if(!length) return console.error("一级菜单初始化失败!");
        var sphs =  new SelectPlugin.HtmlStr({
            customKeyValue : options.customKeyValue
        });
        var str =  sphs.getParent(options.data);
        if(typeof(str) == "string") {
            $("#"+this.fistUlId).html(str);
        }

        if( typeof(options.fn) != 'function' ) return;
        for(var i=0;i<length;i++){
            var id = options.data[i].id?options.data[i].id:options.data[i][options.customKeyValue.id];
            $("#"+id).data(options.data[i]);
            $("#"+id).click(function(){
            $('#workingInterval').find('.select-plugin__active').each(function (index, ele) {
                $(ele).removeClass('select-plugin__active')
            })
            $(this).addClass("select-plugin__active")
            options.fn(this);
            })
        }
    }

    _.prototype.createSonList =  function (options){
        var length = options.data.length;
        if(!length) return console.error("二级菜单初始化失败!");
        var sphs =  new SelectPlugin.HtmlStr({
            customKeyValue : options.customKeyValue
        });
       var str = sphs.getSon(options.data)
       $("#"+options.pId+"_ul").html(str).parent().show();
        if( typeof(options.fn) != 'function' ) return;
        for(var i=0;i<length;i++){
            var id = options.data[i].id?options.data[i].id:options.data[i][options.customKeyValue.id];
            $("#"+id).data(options.data[i]);
            $("#"+id).click(function (){
              $('.nav-menu__detail').show()
                // @desc: 给区段信息赋值 @author: 石墨鑫 @date: 2019-05-24
                var index = 0
                for (var j = 0; j <options.data.length ; j++) {
                  if(options.data[j].id === id){
                    index = j
                    break
                  }
                }
                var data =  options.data[index]
                // @desc: 获取区段作业时间 @author: 石墨鑫 @date: 2019-05-24
                axios.post(baseUrl+"/rc-bms/workSegment/workSegmentDataTimeList",{workSegmentId: id})
                  .then(function (res) {
                    var resData = res.data._data.list
                    var date = new Date(resData[0].startworkTime).$Format('yyyy-MM-dd')
                    for (var j = 0; j <resData.length ; j++) {
                      var time = new Date(resData[j].startworkTime).$Format('hh:mm:ss') + '-' + new Date(resData[j].endWorkTime).$Format('hh:mm:ss')
                      date += ' \n ' + time
                    }
                    $('.nd-1').text(data.mileageSegmentName)
                    $('.nd-2').text('未知')
                    $('.nd-3').text(data.workSegmentName)
                    $('.nd-4').text(date)
                    $('.nd-5').text(data.safetyProtectionPersonnel)
                    $('.nd-6').text(data.workPersonnel)
                    $('.nd-7').text('未知')
                  })
                options.fn(this);
            })
        }
    }


    return _;
})()
