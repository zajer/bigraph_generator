var BigNetwork = require('./BigNetwork');
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
	get_roots_count() { return this.roots }
	get_nodes_count() { return this.nodes.length }
	get_sites_count() { return this.sites }
	add_roots( numOfNewRoots ) { this.roots = this.roots+numOfNewRoots; }
	add_sites( numOfNewSites) { this.sites = this.sites+numOfNewSites; }
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
	open_innerface_for_link( linkId, name ) { var link = this.links.find( link => link.id === linkId); link.innerface=name; }
	
	to_BigNetwork() {
		var result = new BigNetwork();
        var rootsIdsMap = new Map();
		var sitesIdsMap = new Map();
		var nodesIdsMap = new Map();
		var linksIdsMap = new Map();
		for(var i=0;i<this.roots;i++){
			rootsIdsMap[i] = result.add_root();
		}
		for(var i=0;i<this.sites;i++){
			sitesIdsMap[i] = result.add_site();
		}
		this.nodes.forEach( node => {
			nodesIdsMap[node.id] = result.add_node(node.ctrl);
		})
		this.placeGraphRelations.forEach( rel => {
			if (rel.type === Bigraph.ROOT_TO_NODE_relation_type) {
				let internalRootId = rootsIdsMap[rel.from]
				let internalNodeId = nodesIdsMap[rel.to]
				result.connect_elements(internalRootId,internalNodeId,BigNetwork.PlaceGraphConnectionType);
			}
			else if (rel.type === Bigraph.NODE_TO_NODE_relation_type) {
				let internalNodeFromId = nodesIdsMap[rel.from]
				let internalNodeToId = nodesIdsMap[rel.to]
				result.connect_elements(internalNodeFromId,internalNodeToId,BigNetwork.PlaceGraphConnectionType);
			}
			else if (rel.type === Bigraph.NODE_TO_SITE_relation_type) {
				let internalNodeId = nodesIdsMap[rel.from]
				let internalSiteId = sitesIdsMap[rel.to]
				result.connect_elements(internalNodeId,internalSiteId,BigNetwork.PlaceGraphConnectionType);
			}
			else
				throw new Error ("Unknow type of place graph relation"+rel.type)
				
		});
		this.links.forEach( link => {
			let internalLinkId = result.add_link();
			linksIdsMap[link.id] = internalLinkId;
			if (link.outerface !== "") {
				let outerfaceId = result.add_outerface(link.outerface);
				result.connect_elements(internalLinkId,outerfaceId,BigNetwork.LinkGraphConnectionType);
			}
			if (link.innerface !== "") {
				let innerfaceId = result.add_innerface(link.innerface);
				result.connect_elements(internalLinkId,innerfaceId,BigNetwork.LinkGraphConnectionType);
			}
		});
		this.linkGraphRelations.forEach( rel => {
			let from = nodesIdsMap[rel.nodeId];
			let to = linksIdsMap[rel.linkId];
			result.connect_elements(from,to,BigNetwork.LinkGraphConnectionType);
		});
		return result;
	}
}

module.exports = Bigraph