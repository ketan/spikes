var data = [
    {
        "name": "Build",
        "jobs": [
            {
                "name":"build",
                "tasks": [
                    "mvn build"
                ]
            },
            {
                "name": "test",
                "tasks": [
                    "mvn test"
                ]
            }
        ]
    },
    {
        "name": "Deploy",
        "jobs": [
            {
                "name": "package",
                "tasks": [
                    "mvn package"
                ]
            }
        ]
    }
]

var go = {};
go.config = {};
go.config.edit = {};
go.config.edit.Pipeline = Array;
go.config.edit.Stage = function(name) {
    this.name = m.prop(name);
}

go.config.edit.vm = {
    init: function(data){
        var pipeline = this.pipeline = new go.config.edit.Pipeline();
        data.map(function(stage){
            pipeline.push(new go.config.edit.Stage(stage.name));
        });
    }
};

go.config.edit.controller = function(){
    go.config.edit.vm.init(data);
};

go.config.edit.view = function(){
    var pipeline = go.config.edit.vm.pipeline;
    var stages = pipeline.map(function(stage){
        return m("div", stage.name());
    });
    return m("div", stages);
    
}

m.render(document.getElementById('pipeline'), go.config.edit);
