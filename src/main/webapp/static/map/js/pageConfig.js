var wsUrl = "ws://119.3.246.90:9090/rc-collectors";
var isLocaltion = window.location.href.indexOf('http') === -1
var baseUrl = isLocaltion ? "http://119.3.246.90:9091" : "";
var loginUrl = isLocaltion ? window.location.href : top.location.href.split('wisdom/info')[0];
