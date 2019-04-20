var wsUrl = "ws://47.94.11.219:8800/iserver/services/rcDataFlow/dataflow/subscribe";
var isLocaltion = window.location.protocol.indexOf('http') === -1
var baseUrl = isLocaltion ? "http://47.93.254.21:9091" : "";
var loginUrl = isLocaltion ? window.location.href : top.location.href.split('wisdom/info')[0];
