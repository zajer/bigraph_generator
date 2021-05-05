var Bigraph = require('./Bigraph')

function _parse_place_graph_line(line) {
	var regex = /\d/g
	return line.match(regex).map(function(v) { 
		var result = (v == '0' ? false : true);
		return result;
	})
}
function _parse_link_graph_line(line) {
	var faceRegex = /{\S*}/g
	var attachementRegex = /(\d, \d)/g
	var numRegex = /\d/g
	var faces = line.match(faceRegex);
	var nodesAttached = line.match(attachementRegex);
	var nodes = nodesAttached.map(function(attachement){ return parseInt(attachement.match(numRegex)[0]) })
	
	return { faces: {innerface:faces[0].replace(/{|}/g, ''), outerface:faces[1].replace(/{|}/g, '')},nodes }
}

var Converter = {
	_parse_node: function(nodeDef){
		var portsRegex = /\d/g;
		var ctrlRegex = / [a-zA-Z0-9]+/;
		
		var portsMatch = nodeDef.match(portsRegex)
		return {ctrl: nodeDef.match(ctrlRegex)[0].replace(' ',''), ports : parseInt(portsMatch[portsMatch.length-1]) }
	},
	_extract_nodes: function(line) {
		var nodeRegex = /\d, [a-zA-Z0-9]+:\d/g;
		
		var nodes = line.match(nodeRegex);
		return nodes.map(function(nodeDef) { return Converter._parse_node(nodeDef)});
	},
	_extract_elements_count_declaration: function(line) {
		var numRegex = /\d/g;
		
		var match = line.match(numRegex)
		return {roots: parseInt(match[0]),nodes: parseInt(match[1]),sites: parseInt(match[2])}
	},
	_add_place_graph_relations(placeGraph,bigraph){
		placeGraph.forEach(function (line,lineIndex) {
			var parsedPGLine = _parse_place_graph_line(line)
			parsedPGLine.forEach(function (rel,relIndex) {
				if (rel) {
					if (lineIndex < bigraph.roots) {
						if (relIndex < bigraph.nodes.length)
							bigraph.place_node_inside_root(lineIndex,relIndex)
						else
							bigraph.place_site_inside_root(lineIndex,relIndex)
					}
					else {
						if (relIndex < bigraph.nodes.length)
							bigraph.place_node_inside_node(lineIndex,relIndex)
						else
							bigraph.place_site_inside_node(lineIndex,relIndex)
					}
				}
			})
		})
	},
	_add_link_graph_relations(linkGraph,bigraph){
		linkGraph.forEach(function (line,lineIndex) {
			var parsedLGLine = _parse_link_graph_line(line)
			bigraph.add_link()
			parsedLGLine.nodes.forEach(function (nodeId) {
				bigraph.attach_link_to_node(linkId = lineIndex,nodeId)
			})
			
			if (parsedLGLine.faces.outerface != "")
				bigraph.open_outerface_for_link(lineIndex,parsedLGLine.faces.outerface)
			if (parsedLGLine.faces.innerface != "")
				bigraph.open_innerface_for_link(lineIndex,parsedLGLine.faces.innerface)
		})
	},
	text_2_bigraph: function (text) {
		var result = new Bigraph();
		
		var lines = text.split('\n');
		
		var nodes = Converter._extract_nodes(lines[0]);
		nodes.forEach( function(node) { 
			result.add_node(node.ctrl,node.ports)
		})
		
		var elementsCountDeclaration = Converter._extract_elements_count_declaration(lines[1]);
		result.add_roots(elementsCountDeclaration.roots);
		result.add_sites(elementsCountDeclaration.sites);
		
		var placeGraph = lines.slice(2,elementsCountDeclaration.roots+elementsCountDeclaration.nodes)
		Converter._add_place_graph_relations(placeGraph,result);
		
		var linkGraph = lines.slice(elementsCountDeclaration.roots+elementsCountDeclaration.nodes+2)
		Converter._add_link_graph_relations(linkGraph,result);
		
		
		return result;
	}

}

module.exports = Converter