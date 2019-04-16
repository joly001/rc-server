var MessageControl = (function(){

    function _(options){
        this.currentWebSocket;
        if(this.currentWebSocket != null && this.currentWebSocket.readyState == 1){
            return;
        }

        try{
            this.currentWebSocket = connect(options.url);
        }catch(e){
            console.error(e);
        }


        this.currentWebSocket.onmessage = function (evt) {
            try{
                options.onmessage((JSON.parse(evt.data)));
            }catch (e){
                console.error(e);
            }
        }

        this.currentWebSocket.onclose =function(e){
            options.onclose(e)
        };

        this.currentWebSocket.onopen = function(e){
            options.onopen(e)
        }

        this.currentWebSocket.onerror = function(e){
            options.onerror(e)
        }



    }

    _.prototype.closeWS = function(fn){
        this.currentWebSocket.close();
    }

    function connect(url) {
        if ("WebSocket" in window) {
            return new WebSocket(url);
        } else if("MozWebSocket" in window) {
            return new MozWebSocket(url);
        } else {
            return null;
        }
    }
    return _;
})()
