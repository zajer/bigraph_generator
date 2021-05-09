var m = require("mithril")
var Converter = require("../models/Converter")
var vis = require("vis-network")
require("vis-network/styles/vis-network.min.css")

let network;
let bigraphInputContent = "You can paste bigraph as text here or import it from a file below.";
let isBigraphProvided = false;
let isBigraphConverted = false;

function _activate_button(id) {
	let buttonToActivate = document.getElementById(id);
	buttonToActivate.classList.remove("pure-button-disabled")
}

function _deactivate_button(id) {
	let buttonToActivate = document.getElementById(id);
	buttonToActivate.classList.add("pure-button-disabled")
}

function _finished_reading_file(e) {
	bigraphInputContent = e.target.result;
	let hiddenButton = document.getElementById("async_trigger_button")
	hiddenButton.click();
}

var bigraphImport = {
	view: () => {
		return m(".pure-g", [
			m(".pure-u-1", m("", "Bigraph as text")),
			m(".pure-u-1", 
				{ style: { 'padding' : '.7em' } },
				m("textarea[rows=5][cols=60]", 
					{ id:"bigraph_input", style: { 'width':'99%', 'resize':'none', 'height': '40vh' } },
					bigraphInputContent
			)),
			m(".pure-u-1", [
				m("input.margin1", { 
					id: 'bigraph_file',
					type: 'file', 
					onchange: () => { 
						_activate_button( "bigraph_upload_button" );
					}
				}),
				m("button.pure-button .pure-button-primary .pure-button-disabled .margin1", {
					id: "bigraph_upload_button",
					onclick: () => {
						let bigraphAsTextFile = document.getElementById("bigraph_file").files[0];
						let reader = new FileReader();
						reader.onload = _finished_reading_file;
						reader.readAsText(bigraphAsTextFile);
						_deactivate_button( "bigraph_upload_button" );
						_activate_button( "process_bigraph_button" );
					}
				},
				"Load bigraph from a file"), 
				m("button.pure-button .pure-button-primary .pure-button-disabled .margin1", {
					id: 'process_bigraph_button',
					onclick: () => { 
						//let bigraph_as_text_container = document.getElementById("bigraph_input");
						//bigraphInputContent = bigraph_as_text_container.value;
						isBigraphProvided = true;
						_deactivate_button("process_bigraph_button");
						_activate_button("bignet_download_button");
					}
				}, "Process"),
				m("a.pure-button .pure-button-primary .pure-button-disabled .margin1", {
						id: "bignet_download_button"
					},
					"Save BigNet to a file"),
				m("a.pure-button .pure-button-primary .margin1", {
					onclick: () => {
						location.hash="#!/build/";
					}
				},
				"Go to BigNet editor"),
				m("button", { style: { display: 'none' }, id: 'async_trigger_button', onclick: () => {console.log('hidden click!')}},"")
			])])
	}
}

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
		console.log("update");
		if (isBigraphProvided) {
			let bignetDownloadButton = document.getElementById("bignet_download_button");
			let bigraph = Converter.text_2_bigraph(bigraphInputContent); 
			let bignet = bigraph.to_BigNetwork();
			let data = bignet.to_NetworkDatasets();
			network.setData(data);
			let bignetBlob = new Blob([JSON.stringify(bignet)], {type: 'text/plain'});
			URL.revokeObjectURL(bignetDownloadButton.href);
			bignetDownloadButton.href = URL.createObjectURL(bignetBlob)
		}
	},
    view: () => {
        return m(".pure-g" ,[
			m(".pure-u-2-5", { style: { height: '100vh', 'padding': ".5em", 'box-sizing':'border-box', 'border':'1px solid black' } },
				m(bigraphImport)),
			m(".pure-u-3-5",[
				m("", { id:"network_container", style:{ 'height': '98vh' } },"abc")
			])
		]);
    }
}