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
		this.links = []
	}
	
	add_root() { 
		this.rootNodes.push({ id:this.#newElementId }); 
		this.#newElementId++; 
		return this.#newElementId - 1;
	}
	add_site() { 
		this.siteNodes.push({ id:this.#newElementId }); 
		this.#newElementId++; 
		return this.#newElementId - 1; 
	}
	add_node(ctrl) { 
		this.regularNodes.push({ id:this.#newElementId, ctrl }); 
		this.#newElementId++; 
		return this.#newElementId - 1;
	}
	add_link() {
		this.linkNodes.push({ id:this.#newElementId }); 
		this.#newElementId++; 
		return this.#newElementId - 1;
	}
	add_outerface(name) { 
		this.outerfaceNodes.push({ id:this.#newElementId, name }); 
		this.#newElementId++; 
		return this.#newElementId - 1; 
	}
	add_innerface(name) { 
		this.innerfaceNodes.push({ id:this.#newElementId, name }); 
		this.#newElementId++; 
		return this.#newElementId - 1; 
	}
	connect_elements(fromId,toId,type="") { 
		if (type === BigNetwork.PlaceGraphConnectionType)
			this.links.push({from:fromId,to:toId, arrows:"to" }) 
		else if (type === BigNetwork.LinkGraphConnectionType)
			this.links.push({from:fromId,to:toId  }) 
		else
			throw new Error ("Not implemented"); //detect the type of elements and infer the proper type of connection 
	}
	toNetworkDatasets() { throw new Error('Not implemented'); }
}

module.exports = BigNetwork