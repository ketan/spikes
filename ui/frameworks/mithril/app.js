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

var go = {config: {}};
var edit = go.config.edit = {
    stage: {},
    job: {}
};

edit.Pipelines = Array;
edit.Pipelines.prototype.

edit.Stage = function(name, jobs) {
    this.name = m.prop(name);
    this.jobs = m.prop(jobs);
}

edit.Job = function(name){
    this.name = m.prop(name);
}

edit.vm = {
    init: function(data){
        var pipelines = this.pipelines = new edit.Pipelines();
        data.map(function(stage){
            pipelines.push(new edit.Stage(stage.name, stage.jobs.map(function(job){
                return new edit.Job(job.name);
            })));
        });
    }
};

edit.controller = function(){
    go.config.edit.vm.init(data);
};

edit.view = function(){
    return m("ul", edit.vm.pipelines.map(function(stage){
        return m("li",
                 m("a", {"href": "#/edit/stage/" + stage.name()}, stage.name()),
                 m("ul", stage.jobs().map(function(job){
                     return m("li",
                              m("a", {"href": "#/edit/job/" + stage.name() + "/" + job.name() }, job.name()));
                 })))
    }));
}

edit.stage.controller = function(){
    var name = m.route.param("id");
    return {
        "stage" : edit.vm.pipelines.find(function(stage){
            return stage.name() == name;
        })
    };
}

edit.stage.view = function(controller) {
    return m("div", controller.stage.name());
}

edit.job.controller = function(){
    return { "id" : m.route.param("id") };
}

edit.job.view = function(controller) {
    return m("div", controller.id);
}

m.render(document.getElementById('pipeline'), edit);

m.route.mode = "hash";
m.route(document.getElementById('editArea'),"/edit/stage/Build", {
    "/edit/stage/:id" : edit.stage,
    "/edit/job/:id..." : edit.job
});
