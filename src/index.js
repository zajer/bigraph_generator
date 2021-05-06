var m = require("mithril")
var purecss = require("purecss")
var Bigraph2Visjs = require("./views/Bigraph2Visjs")

m.route(document.body, "/home", {
    "/home": Bigraph2Visjs,	
})