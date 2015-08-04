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
var edit = go.config.edit = {};

edit.Pipeline = Array;

edit.Stage = function(name, jobs) {
    this.name = m.prop(name);
    this.jobs = m.prop(jobs);
}

edit.Job = function(name){
    this.name = m.prop(name);
}

edit.vm = {
    init: function(data){
        var pipeline = this.pipeline = new edit.Pipeline();
        data.map(function(stage){
            pipeline.push(new edit.Stage(stage.name, stage.jobs.map(function(job){
                return new edit.Job(job.name);
            })));
        });
    }
};

edit.controller = function(){
    go.config.edit.vm.init(data);
};

edit.view = function(){
    return m("ul", edit.vm.pipeline.map(function(stage){
        return m("li", stage.name(), m("ul", stage.jobs().map(function(job){
            return m("li", job.name());
        })))
    }));
}

m.render(document.getElementById('pipeline'), edit);
