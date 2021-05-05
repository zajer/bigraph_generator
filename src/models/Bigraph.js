class Bigraph {
	static ROOT_TO_NODE_relation_type = "RNr"
	static ROOT_TO_SITE_relation_type = "RSr"
	static NODE_TO_NODE_relation_type = "NNr"
	static NODE_TO_SITE_relation_type = "SSr"
	
	constructor() {
		this.roots = 0;
		this.sites = 0;
		this.nodes = [];
		this.placeGraphRelations = [];
		this.links = [];
		this.linkGraphRelations = [];
	}
	add_roots( numOfNewRoots ) { this.roots = this.roots+numOfNewRoots }
	add_sites( numOfNewSites) { this.sites = this.sites+numOfNewSites }
	add_node(control,ports){ this.nodes.push( { id: this.nodes.length, ctrl: control, ports:ports } ) }
	#_add_place_graph_relation( type, from, to) { 
		var newElement = {
			type,
			from,
			to
		}
		this.placeGraphRelations.push(newElement)
	}
	place_node_inside_root( rootId, nodeId) {
		this.#_add_place_graph_relation(Bigraph.ROOT_TO_NODE_relation_type,rootId,nodeId);
	}
	place_node_inside_node( parentNodeId, childNodeId ) {
		this.#_add_place_graph_relation(Bigraph.NODE_TO_NODE_relation_type,parentNodeId,childNodeId);
	}
	place_site_inside_node( nodeId, siteId ) { 
		this.#_add_place_graph_relation(Bigraph.NODE_TO_SITE_relation_type,nodeId,siteId);
	}
	place_site_inside_root( rootId, siteId ) {
		this.#_add_place_graph_relation(Bigraph.ROOT_TO_SITE_relation_type,rootId,siteId);
	}
	add_link() { this.links.push( { id:this.links.length, outerface:"", innerface:"" } );  }
	attach_link_to_node( linkId, nodeId ) { 
		this.linkGraphRelations.push ({ linkId, nodeId }) 
	}
	open_outerface_for_link( linkId, name ) { var link = this.links.find( link => link.id === linkId); link.outerface=name; }
	open_innerface_for_link( linkId, name ) { }
	
	to_BigNetwork() { }
}

module.exports = Bigraph