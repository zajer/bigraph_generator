var m = require("mithril")
var vis = require("vis-network")
require("vis-network/styles/vis-network.min.css")
class ObjectCreator {
    constructor(label,addFunc,delFunc){
        this.objectTypeLabel = label;
        this.addElementFunction = addFunc;
        this.deletingElementFunction = delFunc;
    }
    view = () => {
        return [
            m("label", this.objectTypeLabel),
            m("br"),
            m("button.margin1", { onclick: this.addElementFunction } ,"Add"),
            m("br"),
            m("input.margin1", {  type:"number", placeholder: "ID" } ),
            m("button.margin1", { onclick:this.deletingElementFunction } ,"Delete")
        ]
    }
}
class ConnectionCreator {
    constructor(label,addFunc,delFunc){
        this.connectionTypeLabel = label;
        this.addElementFunction = addFunc;
        this.deletingElementFunction = delFunc;
    }
    view = () => {
        return [
            m("label", this.connectionTypeLabel),
            m("br"),
            m("input.margin1", {  type:"number", placeholder: "From" } ),
            m("input.margin1", {  type:"number", placeholder: "To" } ),
            m("button.margin1", { onclick: this.addElementFunction} ,"Connect"),
            m("button.margin1", { onclick: this.deletingElementFunction } ,"Delete connection")
        ]
    }
}

var bignetCreator = {
    view: () => {
        return m(".pure-g" ,[
            m(".pure-u-1", m(new ObjectCreator("Roots",undefined,undefined))),
            m(".pure-u-1", m(new ObjectCreator("Nodes",undefined,undefined))),
            m(".pure-u-1", m(new ObjectCreator("Sites",undefined,undefined))),
            m(".pure-u-1", m(new ConnectionCreator("Place graph connections",undefined,undefined) )),
            m(".pure-u-1", m(new ObjectCreator("Links",undefined,undefined))),
            m(".pure-u-1", m(new ObjectCreator("Outerfaces",undefined,undefined))),
            m(".pure-u-1", m(new ObjectCreator("Innerfaces",undefined,undefined))),
            m(".pure-u-1", m(new ConnectionCreator("Link graph connections",undefined,undefined) )),
        ])
    }
}

function saveBigNetToFile(){

}
function loadBigNetFromFile(){

}
let network;
module.exports = {
    oncreate: () => {
		let network_container = document.getElementById("network_container");
		let data = {
		  nodes: [],
		  edges: [],
		};
		let network_options = 
			{
			height: '100%',
		  };
		network = new vis.Network(network_container, data, network_options);
	},
    view: () => {
        return m(".pure-g" ,[
            m(".pure-u-2-5", { style: { height: '100vh', 'padding': ".5em", 'box-sizing':'border-box', 'border':'1px solid black' } }, [
                m(bignetCreator),
                m("hr", {width: "100%"}),
                m(".pure-button .margin1", { onclick: saveBigNetToFile } ,"Save BigNet"),
                m(".pure-button .margin1", { onclick: loadBigNetFromFile } ,"Load BigNet"),
            ]),
            m(".pure-u-3-5", m("", { id:"network_container", style:{ 'height': '100vh' } },"Here should be displayed a network."))
        ]);
    }
}