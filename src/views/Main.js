var m = require("mithril")

module.exports = {
    view: () => {
        return m(".pure-g" ,[
            m(".pure-u-1", { style: {height: '40vh'}}, ""),
            m(".pure-u-6-24"),
            m(".pure-u-6-24", 
                m("button.pure-button", 
                    { onclick: () => {
                        location.hash="#!/view/";
                    }} ,
                    "Bigraph to BigNet"
            )),
            m(".pure-u-6-24", 
                m("button.pure-button",{ 
                    onclick: () => {
                    location.hash="#!/build/";
                }} ,
                "BigNet to Bigraph")),
            m(".pure-u-6-24"),
            m(".pure-u-1", { style: {height: '40vh'}} ,""),
        ])
    }
}