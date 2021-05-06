class BigNetwork {
	static PlaceGraphConnectionType = "PGCT"
	static LinkGraphConnectionType = "LGCT"
	#newElementId = 0
	constructor() {
		this.rootNodes = []
		this.siteNodes = []
		this.linkNodes = []
		this.outerfaceNodes = []
		this.innerfaceNodes = []
		this.regularNodes = []
		this.placeGraphConnections = []
		this.linkGraphConnections = []
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
		this.linkNodes.push({ id:this.#newElementId, shape:"ellipse", color: '#90f399' }); 
		this.#newElementId++; 
		return this.#newElementId - 1;
	}
	add_outerface(name) { 
		this.outerfaceNodes.push({ id:this.#newElementId, label:name, shape:"triangleDown", color: "#7BE141" }); 
		this.#newElementId++; 
		return this.#newElementId - 1; 
	}
	add_innerface(name) { 
		this.innerfaceNodes.push({ id:this.#newElementId, label:name, shape:"traingle", color: "#7BE141" }); 
		this.#newElementId++; 
		return this.#newElementId - 1; 
	}
	connect_elements(fromId,toId,type="") { 
		if (type === BigNetwork.PlaceGraphConnectionType)
			this.placeGraphConnections.push({from:fromId,to:toId, arrows:"to", color:"#3377ff" }) 
		else if (type === BigNetwork.LinkGraphConnectionType)
			this.linkGraphConnections.push({from:fromId,to:toId, color:"#7BE141"  }) 
		else
			throw new Error ("Not implemented"); //detect the type of elements and infer the proper type of connection 
	}
	to_NetworkDatasets() {
		let nodes = [...this.rootNodes, ...this.siteNodes, ...this.linkNodes, ...this.outerfaceNodes, ...this.innerfaceNodes, ...this.regularNodes]
		let edges = [...this.placeGraphConnections,...this.linkGraphConnections]
		return {
			nodes,
			edges
		}	
	}
}

module.exports = BigNetwork