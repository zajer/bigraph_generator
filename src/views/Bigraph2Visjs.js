var m = require("mithril")
var Converter = require("../models/Converter")
var vis = require("vis-network")
require("vis-network/styles/vis-network.min.css")
let network;
let bigraphInputContent = "Paste bigraph as text here";
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
		let bigraphAsBignetContainer = document.getElementById("bignet_output");
		let bignetDownloadButton = document.getElementById("bignet_download_button");
		let bigraph = Converter.text_2_bigraph(bigraphInputContent); 
		let bignet = bigraph.to_BigNetwork();
		let data = bignet.to_NetworkDatasets();
		network.setData(data);
		bigraphAsBignetContainer.value = JSON.stringify(bignet);
		let bignetBlob = new Blob([bigraphAsBignetContainer.value], {type: 'text/plain'});
		URL.revokeObjectURL(bignetDownloadButton.href);
		bignetDownloadButton.href = URL.createObjectURL(bignetBlob)
	},
    view: () => {
        return m(".pure-g" ,[
			m(".pure-u-2-5", { style: { 'padding': ".5em", 'box-sizing':'border-box', 'border':'1px solid black' } },
				m(".pure-g",[
				m(".pure-u-1-1",m("label", "Bigraph as text")),
				m(".pure-u-1-1", { style: { 'padding' : '.7em' } } ,m("textarea[rows=5][cols=60]", 
					{ id:"bigraph_input", style: { 'width':'99%', 'resize':'none', 'height': '40vh' } }, 
					bigraphInputContent)),
				m(".pure-u-2-6",m("button.pure-button .pure-button-primary", { 
					style: { 'font-size': '70%' },
					onclick: () => { 
						let bigraph_as_text_container = document.getElementById("bigraph_input");
						bigraphInputContent = bigraph_as_text_container.value;
					}
				} , "Visualize and transform")),
				m(".pure-u-1-1", { style: { 'padding' : '.7em' } } ,m("textarea[rows=5][cols=60]", { 
					readonly: true, 
					id:"bignet_output", 
					style: { 'width':'99%', 'resize':'none', 'height': '40vh' }
				}, "Bigraph transformed into BigNet will appear here.")),
				m(".pure-u-1-1", m("a.pure-button .pure-button-primary", {
						id: "bignet_download_button",
						style: { 'font-size': '70%' }
				 	} ,
					"Save BigNet to a file")
				)
			])),
			m(".pure-u-3-5",[
				m("", { id:"network_container", style:{ 'height': '98vh' } },"abc")
			])
		]);
    }
}