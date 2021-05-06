var m = require("mithril")
var Converter = require("../models/Converter")
var vis = require("vis-network")
require("vis-network/styles/vis-network.min.css")
let network;
let bigraph;
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
	onupdate: () => {
		let bigNet = bigraph.to_BigNetwork();
		let data = bigNet.to_NetworkDatasets();
		network.setData(data);
	},
    view: () => {
        return m(".pure-g", { style:{ 'padding': ".5em" } } ,[
			m(".pure-u-2-5", { style: { 'padding': ".5em", 'box-sizing':'border-box', 'border':'1px solid black' } },[
				m(".pure-u-1",m("label", "Bigraph as text")),
				m(".pure-u-1",m("textarea[rows=5][cols=60]", { id:"bigraph_input", style: { 'width':'99%', 'resize':'vertical' } }, "Paste bigraph as text here")),
				m(".pure-u-1-6",m("button", { 
					onclick: () => { 
						let bigraph_as_text_container = document.getElementById("bigraph_input");
						let input = bigraph_as_text_container.value;
						bigraph = Converter.text_2_bigraph(input);
					}
				} , "Visualize"))
			]),
			m(".pure-u-3-5",[
				m("", { id:"network_container", style:{ 'height': '98vh' } },"abc")
			])
		]);
    }
}