var m = require("mithril");
var purecss = require("purecss");
var Bigraph2Visjs = require("./views/Bigraph2Visjs");
var BigNetConstructor = require("./views/BigNetConstructor");
require("./index.css");
m.route(document.body, "/build", {
    "/view": Bigraph2Visjs,	
    "/build": BigNetConstructor
})