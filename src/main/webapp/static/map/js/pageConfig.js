var wsUrl = "ws://119.3.246.90:8800/iserver/services/dataflow/dataflow/subscribe";
var isLocaltion = window.location.href.indexOf('http') === -1
var baseUrl = isLocaltion ? "http://47.93.254.21:9091" : "";
var loginUrl = isLocaltion ? window.location.href : top.location.href.split('wisdom/info')[0];
