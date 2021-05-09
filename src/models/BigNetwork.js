class BigNetwork {
	static PlaceGraphConnectionType = "PGCT"
	static LinkGraphConnectionType = "LGCT"
	newElementId = 0
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
			let source = json;
			this.rootNodes = source['rootNodes'];
			this.siteNodes = source['siteNodes'];
			this.linkNodes = source['linkNodes'];
			this.outerfaceNodes = source['outerfaceNodes'];
			this.innerfaceNodes = source['innerfaceNodes'];
			this.regularNodes = source['regularNodes'];
			let deleteIdFun = connection => { if (connection.hasOwnProperty("id") ) { delete connection.id; return connection } } ;
			this.placeGraphConnections = source['placeGraphConnections'].map( deleteIdFun );
			this.linkGraphConnections = source['linkGraphConnections'].map ( deleteIdFun );
			this.newElementId = source["newElementId"]
		}
		
	}
	_make_root_visjs_element(label){
		return { id:this.newElementId, label, color: '#d780ff' };
	}
	_make_site_visjs_element(label){
		return { id:this.newElementId, label, color: '#fcb110' };
	}
	_make_node_visjs_element(ctrl,label){
		return { id:this.newElementId, ctrl, label, shape:"box" }
	}
	_make_link_visjs_element(label){
		return { id:this.newElementId, shape:"dot", color: '#90f399', size:5, label }
	}
	_make_outerface_visjs_element(label){
		return { id:this.newElementId, label, shape:"triangleDown", color: "#7BE141", size:15 }
	}
	_make_innerface_visjs_element(label){
		return { id:this.newElementId, label, shape:"triangle", color: "#7BE141", size:15 }
	}
	_delete_node_generic(arrayToDeleteFrom,id){
		let index = arrayToDeleteFrom.findIndex( node => { return node.id === id });
		arrayToDeleteFrom.splice(index,1);
	}
	add_root() { 
		this.rootNodes.push(this._make_root_visjs_element(this.newElementId.toString())); 
		this.newElementId++; 
		return this.newElementId - 1;
	}
	delete_root(id){
		this._delete_node_generic(this.rootNodes,id);
	}
	add_site() { 
		this.siteNodes.push(this._make_site_visjs_element((this.newElementId).toString())); 
		this.newElementId++; 
		return this.newElementId - 1; 
	}
	delete_site(id){
		this._delete_node_generic(this.siteNodes,id);
	}
	add_node(ctrl) { 
		this.regularNodes.push(this._make_node_visjs_element(ctrl,ctrl+":"+(this.newElementId).toString())); 
		this.newElementId++; 
		return this.newElementId - 1;
	}
	delete_node(id){
		this._delete_node_generic(this.regularNodes,id);
	}
	add_link() {
		this.linkNodes.push(this._make_link_visjs_element(this.newElementId.toString())); 
		this.newElementId++; 
		return this.newElementId - 1;
	}
	delete_link(id){
		this._delete_node_generic(this.linkNodes,id);
	}
	add_outerface(name) { 
		this.outerfaceNodes.push(this._make_outerface_visjs_element(name+":"+this.newElementId.toString())); 
		this.newElementId++; 
		return this.newElementId - 1; 
	}
	delete_outerface(id){
		this._delete_node_generic(this.outerfaceNodes,id);
	}
	add_innerface(name) { 
		this.innerfaceNodes.push(this._make_innerface_visjs_element(name+":"+this.newElementId.toString())); 
		this.newElementId++; 
		return this.newElementId - 1; 
	}
	delete_innerface(id){
		this._delete_node_generic(this.outerfaceNodes,id);
	}
	connect_elements(fromId,toId,type="") { 
		if (type === BigNetwork.PlaceGraphConnectionType)
			this.placeGraphConnections.push({from:fromId,to:toId, arrows:"to", color:"#3377ff" }) 
		else if (type === BigNetwork.LinkGraphConnectionType)
			this.linkGraphConnections.push({from:fromId,to:toId, color:"#7BE141"  }) 
		else
			throw new Error ("Unknown connection type:"+type);
	}
	_delete_connection_generic(arrayToDeleteFrom,from,to){
		let index = arrayToDeleteFrom.findIndex( connection => {return (connection.from === from && connection.to === to) });
		arrayToDeleteFrom.splice(index,1);
	}
	delete_connection(fromId,toId,type=""){
		if (type === BigNetwork.PlaceGraphConnectionType)
			this._delete_connection_generic(this.placeGraphConnections,fromId,toId);
		else if (type === BigNetwork.LinkGraphConnectionType)
			this._delete_connection_generic(this.linkGraphConnections,fromId,toId);
		else
			throw new Error ("Unknown connection type:"+type);
	}
	_append_legend_properties(visjsElement,id,x,y){
		visjsElement["id"] = id;
		visjsElement["x"] = x;
		visjsElement["y"] = y;
		visjsElement["fixed"] = true;
		visjsElement["physics"] = false;
	}
	to_NetworkDatasets(networkDivElement) {
		let nodes = [...this.rootNodes, ...this.siteNodes, ...this.linkNodes, ...this.outerfaceNodes, ...this.innerfaceNodes, ...this.regularNodes]
		let edges = [...this.placeGraphConnections,...this.linkGraphConnections]
		if (arguments.length == 1) {
			let x = - networkDivElement.clientWidth;
			let y = - networkDivElement.clientWidth / 2 + 50;
			let step = 55;
			
			let rootLegendElement = this._make_root_visjs_element("Root");
			let nodeLegendElement = this._make_node_visjs_element("CtrlType","Node");
			let siteLegendElement = this._make_site_visjs_element("Site");
			let linkLegendElement = this._make_link_visjs_element("Link");
			let outerfaceLegendElement = this._make_outerface_visjs_element("Outerface");
			let innerfaceLegendElement = this._make_innerface_visjs_element("Innerface");
			this._append_legend_properties(rootLegendElement,this.newElementId+1000,x,y);
			this._append_legend_properties(nodeLegendElement,this.newElementId+1001,x,y+step);
			this._append_legend_properties(siteLegendElement,this.newElementId+1002,x,y+2*step);
			this._append_legend_properties(linkLegendElement,this.newElementId+1003,x,y+3*step);
			this._append_legend_properties(outerfaceLegendElement,this.newElementId+1004,x,y+4*step);
			this._append_legend_properties(innerfaceLegendElement,this.newElementId+1005,x,y+5*step);
			
			
			nodes.push(rootLegendElement);
			nodes.push(nodeLegendElement);
			nodes.push(siteLegendElement);
			nodes.push(linkLegendElement);
			nodes.push(outerfaceLegendElement);
			nodes.push(innerfaceLegendElement);

		}
		return {
			nodes,
			edges
		}	
	}
	_num_of_linkgraph_connections_by_node(nid) {
		return this.linkGraphConnections.filter( conn => conn.from === nid ).length
	}
	_make_first_row_of_text() {
		let resutArray = this.regularNodes.map( (node,posIndex) => {
			return "("+posIndex.toString()+", "+node.ctrl+":"+this._num_of_linkgraph_connections_by_node(node.id).toString()+")"
		})
		return "{"+resutArray.join(',')+"}"
		
	}
	_make_second_row_of_text() {
		let resultArray = [this.rootNodes.length.toString(),this.regularNodes.length.toString(),this.siteNodes.length.toString()]
		
		return resultArray.join(' ')
	}
	_find_row_in_place_graph_for_node_with_id(nid) {
		let rootIndexWithId = this.rootNodes.findIndex( node => node.id === nid );
		if (rootIndexWithId !== -1) 
			return rootIndexWithId;
		let nodeIndexWithId = this.regularNodes.findIndex( node => node.id === nid );
		if (nodeIndexWithId !== -1) 
			return nodeIndexWithId+this.rootNodes.length;
		throw new Error("Cannot determine row index. Node with id:"+nid+" not found!");
	}
	_find_column_in_place_graph_for_node_with_id(nid) {
		let nodeIndexWithId = this.regularNodes.findIndex( node => node.id === nid );
		if (nodeIndexWithId !== -1) 
			return nodeIndexWithId;
		let siteIndexWithId = this.siteNodes.findIndex( node => node.id === nid );
		if (siteIndexWithId !== -1) 
			return siteIndexWithId+this.regularNodes.length;
		throw new Error("Cannot determine index in row. Node with id:"+nid+" not found!");
	}
	_make_place_graph_as_text(){
		let defaultPlaceGraphRow = Array(this.regularNodes.length+this.siteNodes.length).fill(false);
		let resultRaw = Array.from(Array(this.rootNodes.length+this.regularNodes.length), () => ([...defaultPlaceGraphRow]));
		
		this.placeGraphConnections.forEach( connection => {
			let row =  this._find_row_in_place_graph_for_node_with_id(connection.from);
			let column = this._find_column_in_place_graph_for_node_with_id(connection.to);
			resultRaw[row][column] = true;
		});
		
		let resultArray = resultRaw.map ( row => { 
			let rowConverter = row.map ( v => v === false ? "0" : "1"); 
			return rowConverter.join(""); 
		});
		return resultArray.join('\n')
	}
	static _wrap_face(faceNode) {
		if (faceNode !== undefined)
			return  "{"+faceNode.label+"}"
		else 
			return "{}"
	}
	_make_link_graph_connection_for_link(linkId){
		let connectionsForLink = this.linkGraphConnections.filter( connection => connection.to === linkId);
		let mapOfPortsUsedByNodes = new Map();
		connectionsForLink.forEach( connection => { 
			let nodeId = connection.from;
			mapOfPortsUsedByNodes.set(nodeId, mapOfPortsUsedByNodes.has(nodeId) ? mapOfPortsUsedByNodes.get(nodeId)+1 : 1 );
		});
		
		let arrayOfRelativeNodesWithTheirPortsUsage = [];
		mapOfPortsUsedByNodes.forEach( (numOfPorts,nodeId) => {
			let nodeIndex = this.regularNodes.findIndex( node => node.id === nodeId );
			arrayOfRelativeNodesWithTheirPortsUsage.push({nodeIndex,numOfPorts});
		});
		
		let result = [];
		result = arrayOfRelativeNodesWithTheirPortsUsage.map( entry => {			
			return "(" + entry.nodeIndex+", " + entry.numOfPorts+")";
		});

		return "{"+result.join(", ")+"}"
	}
	_make_link_graph_as_text(){
		let resultArray = this.linkNodes.map( link => {
			
			let connectionToFaceId = this.linkGraphConnections.find( connection => connection.from === link.id )
			var innerface,outerface
			if (connectionToFaceId !== undefined) {
				innerface = this.innerfaceNodes.find ( innf => innf.id === connectionToFaceId.to)
				outerface = this.outerfaceNodes.find ( outf => outf.id === connectionToFaceId.to)
			}
			
			innerface = BigNetwork._wrap_face(innerface);
			outerface = BigNetwork._wrap_face(outerface);
			
			let connections = this._make_link_graph_connection_for_link(link.id);
			return "("+innerface+", "+outerface+", "+connections+")"
		});
		return resultArray.join('\n');
	}
	to_text() {
		var result = []
		result.push(this._make_first_row_of_text());
		result.push(this._make_second_row_of_text());
		result.push(this._make_place_graph_as_text());
		result.push(this._make_link_graph_as_text());
		return result.join('\n');
	}
}

module.exports = BigNetwork