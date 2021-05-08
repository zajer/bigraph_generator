var m = require("mithril");
var purecss = require("purecss");
var Bigraph2Visjs = require("./views/BigraphTransformer");
var BigNetConstructor = require("./views/BigNetConstructor");
var Main = require("./views/Main");
require("./index.css");
m.route(document.body, "/main", {
    "/main": Main,
    "/view": Bigraph2Visjs,	
    "/build": BigNetConstructor
})