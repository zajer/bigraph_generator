class BigNetwork {
	static PlaceGraphConnectionType = "PGCT"
	static LinkGraphConnectionType = "LGCT"
	#newElementId = 0
	constructor (json) {
		if (!arguments.length) {
			this.rootNodes = [];
			this.siteNodes = [];
			this.linkNodes = [];
			this.outerfaceNodes = [];
			this.innerfaceNodes = [];
			this.regularNodes = [];
			this.placeGraphConnections = [];
			this.linkGraphConnections = [];
		}
		else {
			let source = JSON.parse(json);
			this.rootNodes = source['rootNodes'];
			this.siteNodes = source['siteNodes'];
			this.linkNodes = source['linkNodes'];
			this.outerfaceNodes = source['outerfaceNodes'];
			this.innerfaceNodes = source['innerfaceNodes'];
			this.regularNodes = source['regularNodes'];
			let deleteIdFun = connection => { if (connection.hasOwnProperty("id") ) { delete connection.id; return connection } } ;
			this.placeGraphConnections = source['rootNodes'].map( deleteIdFun );
			this.linkGraphConnections = source['rootNodes'].map ( deleteIdFun );
			this.#newElementId = [
				...this.rootNodes, 
				...this.siteNodes, 
				...this.linkNodes, 
				...this.outerfaceNodes, 
				...this.innerfaceNodes, 
				...this.regularNodes
			].reduce( (maxNodeId, node) => { if (node.id > maxNodeId) {return node.id + 1} else {return maxNodeId } }, 0 )
		}
		
	}

	add_root() { 
		this.rootNodes.push({ id:this.#newElementId, label:(this.#newElementId).toString(), color: '#d780ff' }); 
		this.#newElementId++; 
		return this.#newElementId - 1;
	}
	add_site() { 
		this.siteNodes.push({ id:this.#newElementId, label:(this.#newElementId), color: '#d780ff' }); 
		this.#newElementId++; 
		return this.#newElementId - 1; 
	}
	add_node(ctrl) { 
		this.regularNodes.push({ id:this.#newElementId, ctrl, label:ctrl+":"+(this.#newElementId).toString(), shape:"box" }); 
		this.#newElementId++; 
		return this.#newElementId - 1;
	}
	add_link() {
		this.linkNodes.push({ id:this.#newElementId, shape:"dot", color: '#90f399', size:5, label:this.#newElementId.toString() }); 
		this.#newElementId++; 
		return this.#newElementId - 1;
	}
	add_outerface(name) { 
		this.outerfaceNodes.push({ id:this.#newElementId, label:name, shape:"triangleDown", color: "#7BE141", size:15 }); 
		this.#newElementId++; 
		return this.#newElementId - 1; 
	}
	add_innerface(name) { 
		this.innerfaceNodes.push({ id:this.#newElementId, label:name, shape:"traingle", color: "#7BE141", size:15 }); 
		this.#newElementId++; 
		return this.#newElementId - 1; 
	}
	connect_elements(fromId,toId,type="") { 
		if (type === BigNetwork.PlaceGraphConnectionType)
			this.placeGraphConnections.push({from:fromId,to:toId, arrows:"to", color:"#3377ff" }) 
		else if (type === BigNetwork.LinkGraphConnectionType)
			this.linkGraphConnections.push({from:fromId,to:toId, color:"#7BE141"  }) 
		else
			throw new Error ("Not implemented");
	}
	to_NetworkDatasets() {
		let nodes = [...this.rootNodes, ...this.siteNodes, ...this.linkNodes, ...this.outerfaceNodes, ...this.innerfaceNodes, ...this.regularNodes]
		let edges = [...this.placeGraphConnections,...this.linkGraphConnections]
		return {
			nodes,
			edges
		}	
	}
	#_num_of_linkgraph_connections_by_node(nid) {
		return this.linkGraphConnections.filter( conn => conn.from === nid ).length
	}
	#_make_first_row_of_text() {
		let resutArray = this.regularNodes.map( (node,posIndex) => {
			return "("+posIndex.toString()+", "+node.ctrl+":"+this.#_num_of_linkgraph_connections_by_node(node.id).toString()+")"
		})
		return "{"+resutArray.join(',')+"}"
		
	}
	#_make_second_row_of_text() {
		let resultArray = [this.rootNodes.length.toString(),this.regularNodes.length.toString(),this.siteNodes.length.toString()]
		
		return resultArray.join(' ')
	}
	#_find_row_in_place_graph_for_node_with_id(nid) {
		let rootIndexWithId = this.rootNodes.findIndex( node => node.id === nid );
		if (rootIndexWithId !== -1) 
			return rootIndexWithId;
		let nodeIndexWithId = this.regularNodes.findIndex( node => node.id === nid );
		if (nodeIndexWithId !== -1) 
			return nodeIndexWithId+this.rootNodes.length;
		throw new Error("Cannot determine row index. Node with id:"+nid+" not found!");
	}
	#_find_column_in_place_graph_for_node_with_id(nid) {
		let nodeIndexWithId = this.regularNodes.findIndex( node => node.id === nid );
		if (nodeIndexWithId !== -1) 
			return nodeIndexWithId;
		let siteIndexWithId = this.siteNodes.findIndex( node => node.id === nid );
		if (siteIndexWithId !== -1) 
			return siteIndexWithId+this.regularNodes.length;
		throw new Error("Cannot determine index in row. Node with id:"+nid+" not found!");
	}
	#_make_place_graph_as_text(){
		let defaultPlaceGraphRow = Array(this.regularNodes.length+this.siteNodes.length).fill(false);
		let resultRaw = Array.from(Array(this.rootNodes.length+this.regularNodes.length), () => ([...defaultPlaceGraphRow]));
		
		this.placeGraphConnections.forEach( connection => {
			let row =  this.#_find_row_in_place_graph_for_node_with_id(connection.from);
			let column = this.#_find_column_in_place_graph_for_node_with_id(connection.to);
			resultRaw[row][column] = true;
		});
		
		let resultArray = resultRaw.map ( row => { 
			let rowConverter = row.map ( v => v === false ? "0" : "1"); 
			return rowConverter.join(""); 
		});
		return resultArray.join('\n')
	}
	static #_wrap_face(faceNode) {
		if (faceNode !== undefined)
			return  "{"+faceNode.label+"}"
		else 
			return "{}"
	}
	#_make_link_graph_connection_for_link(linkId,mapOfPortsUsedByNode){
		let connectionsForLink = this.linkGraphConnections.filter( connection => connection.to === linkId);
		
		let result = connectionsForLink.map( connection => { 
			let nodeIndex = this.regularNodes.findIndex( node => node.id === connection.from );
			let portIndex = mapOfPortsUsedByNode.has(nodeIndex) ? mapOfPortsUsedByNode.get(nodeIndex) : 0;
			mapOfPortsUsedByNode.set(nodeIndex, (portIndex+1) );
			return "("+nodeIndex+", "+portIndex+")";
		});
		
		return "{"+result.join(", ")+"}"
	}
	#_make_link_graph_as_text(){
		let result = [];
		let mapOfPortsUsedByNode = new Map();
		let resultArray = this.linkNodes.map( link => {
			
			let connectionToFaceId = this.linkGraphConnections.find( connection => connection.from === link.id )
			var innerface,outerface
			if (connectionToFaceId !== undefined) {
				innerface = this.innerfaceNodes.find ( innf => innf.id === connectionToFaceId.to)
				outerface = this.outerfaceNodes.find ( outf => outf.id === connectionToFaceId.to)
			}
			
			innerface = BigNetwork.#_wrap_face(innerface);
			outerface = BigNetwork.#_wrap_face(outerface);
			
			let connections = this.#_make_link_graph_connection_for_link(link.id,mapOfPortsUsedByNode);
			return "("+innerface+", "+outerface+", "+connections+")"
		});
		return resultArray.join('\n');
	}
	to_text() {
		var result = []
		result.push(this.#_make_first_row_of_text());
		result.push(this.#_make_second_row_of_text());
		result.push(this.#_make_place_graph_as_text());
		result.push(this.#_make_link_graph_as_text());
		return result.join('\n');
	}
}

module.exports = BigNetwork