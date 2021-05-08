var m = require("mithril")
var vis = require("vis-network")
require("vis-network/styles/vis-network.min.css")
var BigNetwork = require("../models/BigNetwork")
var bigNet = new BigNetwork();

class NamedObjectCreator {
    constructor(label,addFunc,delFunc){
        this.objectTypeLabel = label;
        this.addElementFunction = addFunc.bind(bigNet);
        this.deletingElementFunction = delFunc;
    }
    view = () => {
        return [
            m("label", this.objectTypeLabel),
            m("br"),
            m("input.margin1", { id:(this.objectTypeLabel+"-name"),  type:"text", size:10, placeholder: "name" } ),
            m("button.margin1", { 
                onclick: () => {
                    let ctrl = document.getElementById(this.objectTypeLabel+"-name").value;
                    this.addElementFunction(ctrl); 
                }} ,"Add"),
            m("br"),
            m("input.margin1", {  id:(this.objectTypeLabel+"-id"), type:"number", placeholder: "ID" } ),
            m("button.margin1", { onclick:this.deletingElementFunction } ,"Delete")
        ]
    }
}

class NamelessObjectCreator {
    constructor(label,addFunc,delFunc){
        this.objectTypeLabel = label;
        this.addElementFunction = addFunc;
        this.deleteElementFunction = delFunc;
    }
    view = () => {
        return [
            m("label", this.objectTypeLabel),
            m("br"),
            m("button.margin1", { onclick: this.addElementFunction.bind(bigNet) } ,"Add"),
            m("br"),
            m("input.margin1", { id:(this.objectTypeLabel+"-id"),  type:"number", placeholder: "ID" } ),
            m("button.margin1", { onclick: this.deleteElementFunction } ,"Delete")
        ]
    }
}

class ConnectionCreator {
    constructor(label,type,addFunc,delFunc){
        console.log(addFunc);
        this.connectionTypeLabel = label;
        this.connectionType = type;
        this.addElementFunction = addFunc.bind(bigNet);
        this.deletingElementFunction = delFunc;
    }
    view = () => {
        return [
            m("label", this.connectionTypeLabel),
            m("br"),
            m("input.margin1", { id:(this.connectionTypeLabel+"-from"), type:"number", placeholder: "From" } ),
            m("input.margin1", { id:(this.connectionTypeLabel+"-to"), type:"number", placeholder: "To" } ),
            m("button.margin1", { 
                onclick: () => {
                    let from = document.getElementById(this.connectionTypeLabel+"-from").value;
                    let to = document.getElementById(this.connectionTypeLabel+"-to").value;
                    this.addElementFunction(from,to,this.connectionType);
                }} ,"Connect"),
            m("button.margin1", { onclick: this.deletingElementFunction } ,"Delete connection")
        ]
    }
}

var bignetCreator = {
    view: () => {
        return m(".pure-g" ,[
            m(".pure-u-1", m(new NamelessObjectCreator("Roots",bigNet.add_root,undefined))),
            m(".pure-u-1", m(new NamedObjectCreator("Nodes",bigNet.add_node,undefined))),
            m(".pure-u-1", m(new NamelessObjectCreator("Sites",bigNet.add_site,undefined))),
            m(".pure-u-1", m(new ConnectionCreator("Place graph connections",BigNetwork.PlaceGraphConnectionType,bigNet.connect_elements,undefined) )),
            m(".pure-u-1", m(new NamelessObjectCreator("Links",bigNet.add_link,undefined))),
            m(".pure-u-1", m(new NamedObjectCreator("Outerfaces",bigNet.add_outerface,undefined))),
            m(".pure-u-1", m(new NamedObjectCreator("Innerfaces",bigNet.add_innerface,undefined))),
            m(".pure-u-1", m(new ConnectionCreator("Link graph connections",BigNetwork.LinkGraphConnectionType,bigNet.connect_elements,undefined) )),
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
		let networkContainer = document.getElementById("network_container");
		let data = {
		  nodes: [],
		  edges: [],
		};
		let network_options = 
			{
			height: '100%',
		  };
		network = new vis.Network(networkContainer, data, network_options);
	},
    onupdate: () => {
        let networkContainer = document.getElementById("network_container");
        let data = bigNet.to_NetworkDatasets(networkContainer);
        network.setData(data);
    },
    view: () => {
        return m(".pure-g" ,[
            m(".pure-u-2-5", { style: { height: '100vh', 'padding': ".5em", 'box-sizing':'border-box', 'border':'1px solid black' } }, [
                m(bignetCreator),
                m("hr", {width: "100%"}),
                m(".pure-button .pure-button-primary .margin1", { onclick: saveBigNetToFile } ,"Save BigNet"),
                m(".pure-button .pure-button-primary .margin1", { onclick: loadBigNetFromFile } ,"Load BigNet"),
                m(".pure-button .pure-button-primary .margin1", { onclick: loadBigNetFromFile } ,"Save BigNet as bigraph")
            ]),
            m(".pure-u-3-5", m("", { id:"network_container", style:{ 'height': '100vh' } },"Here should be displayed a network."))
        ]);
    }
}