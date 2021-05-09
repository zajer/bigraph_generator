var m = require("mithril")
var vis = require("vis-network")
require("vis-network/styles/vis-network.min.css")
var BigNetwork = require("../models/BigNetwork")
var bigNet = new BigNetwork();

class NamedObjectCreator {
    constructor(label,addFunc,delFunc){
        this.objectTypeLabel = label;
        this.addElementFunction = addFunc.bind(bigNet);
        this.deletingElementFunction = delFunc.bind(bigNet);
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
        this.addElementFunction = addFunc.bind(bigNet);
        this.deleteElementFunction = delFunc.bind(bigNet);
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
        this.connectionTypeLabel = label;
        this.connectionType = type;
        this.addElementFunction = addFunc.bind(bigNet);
        this.deletingElementFunction = delFunc.bind(bigNet);
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
                    this.addElementFunction(parseInt(from),parseInt(to),this.connectionType);
                }} ,"Connect"),
            m("button.margin1", { 
                onclick: () => {
                    let from = document.getElementById(this.connectionTypeLabel+"-from").value;
                    let to = document.getElementById(this.connectionTypeLabel+"-to").value;
                    this.deletingElementFunction(parseInt(from),parseInt(to),this.connectionType);
            }} ,"Delete connection")
        ]
    }
}

var bignetCreator = {
    view: () => {
        return m(".pure-g" ,[
            m(".pure-u-1", m(new NamelessObjectCreator("Roots",bigNet.add_root,bigNet.delete_root))),
            m(".pure-u-1", m(new NamedObjectCreator("Nodes",bigNet.add_node,bigNet.delete_node))),
            m(".pure-u-1", m(new NamelessObjectCreator("Sites",bigNet.add_site,bigNet.delete_site))),
            m(".pure-u-1", m(new ConnectionCreator("Place graph connections",BigNetwork.PlaceGraphConnectionType,bigNet.connect_elements,bigNet.delete_connection) )),
            m(".pure-u-1", m(new NamelessObjectCreator("Links",bigNet.add_link,bigNet.delete_link))),
            m(".pure-u-1", m(new NamedObjectCreator("Outerfaces",bigNet.add_outerface,bigNet.delete_outerface))),
            m(".pure-u-1", m(new NamedObjectCreator("Innerfaces",bigNet.add_innerface,bigNet.delete_innerface))),
            m(".pure-u-1", m(new ConnectionCreator("Link graph connections",BigNetwork.LinkGraphConnectionType,bigNet.connect_elements,bigNet.delete_connection) )),
        ])
    }
}
function _bignet_loaded_from_file(e){
    console.log("loaded");
    let loadedBignetAsText = e.target.result;
    let loadedBignetJSON = JSON.parse(loadedBignetAsText);
	bigNet = new BigNetwork(loadedBignetJSON);
    let forceRefresh = document.getElementById("async_trigger_button");
    forceRefresh.click();
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
        let bignetDownloadButton = document.getElementById("bignet_download_button");
        let bigraphDownloadButton = document.getElementById("bigraph_download_button");
        let bignetBlob = new Blob([JSON.stringify(bigNet)], {type: "text/plain"});
        let bigraphBlob = new Blob([bigNet.to_text()], {type: "text/plain"});
        URL.revokeObjectURL(bignetDownloadButton.href);
        URL.revokeObjectURL(bigraphDownloadButton.href);
        bignetDownloadButton.href = URL.createObjectURL(bignetBlob);
        bigraphDownloadButton.href = URL.createObjectURL(bigraphBlob);
    },
    view: () => {
        return m(".pure-g" ,[
            m(".pure-u-2-5", { style: { height: '100vh', 'padding': ".5em", 'box-sizing':'border-box', 'border':'0px solid black' } }, [
                m(bignetCreator),
                m("hr", {width: "100%"}),
                m("vl", { style: {'border-left': '1px solid black', 'height': '100%', 'position': 'absolute', 'left': '40%', 'margin-left': '-3px', 'top': 0}}),
                m("a.pure-button .pure-button-primary .margin1", { id: "bignet_download_button" } ,"Save BigNet"),
                m("a.pure-button .pure-button-primary .margin1", { id: "bigraph_download_button" } ,"Save BigNet as bigraph"),
                m("br"),
                m("input.margin1", { 
					id: 'bignet_file',
					type: 'file',
                    style : { width: '250px'},
					onchange: () => { 
                        let bigraphAsTextFile = document.getElementById("bignet_file").files[0];
						let reader = new FileReader();
						reader.onload = _bignet_loaded_from_file;
						reader.readAsText(bigraphAsTextFile);
					}
				}),
                m("button", { style: { display: 'none' }, id: 'async_trigger_button', onclick: () => {console.log('hidden click!')}},"")
            ]),
            m(".pure-u-3-5", m("", { id:"network_container", style:{ 'height': '100vh' } },"Here should be displayed a network."))
        ]);
    }
}