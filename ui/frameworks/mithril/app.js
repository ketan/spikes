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
    job: {},
    component: {},
    control: {}
};

edit.Pipelines = Array;

edit.Stage = function(name, jobs) {
    this.name = m.prop(name);
    this.jobs = m.prop(jobs);
}

edit.Job = function(name, tasks){
    this.name = m.prop(name);
    this.tasks = m.prop(tasks);
}

edit.Task = function(command) {
    this.command = m.prop(command);
}

edit.vm = {
    init: function(data){
        var pipelines = this.pipelines = new edit.Pipelines();
        data.map(function(stage){
            pipelines.push(new edit.Stage(stage.name, stage.jobs.map(function(job){
                return new edit.Job(job.name, job.tasks.map(function(task){
                    return new edit.Task(task);
                }));
            })));
        });
    }
};

edit.controller = function(){
    go.config.edit.vm.init(data);
};

edit.control.binds =  function(prop) {
    return {oninput: m.withAttr("value", prop), value: prop()}
};

edit.component.task = function(task){
    return m("div.task", m("h3", m("div", "task"), m("input", edit.control.binds(task.command))));
};

edit.component.job = function(job){
    return m("div.job", 
             m("h2", m("div", "Job"),
               m("span",
                 m("input", edit.control.binds(job.name))),
               job.tasks().map(edit.component.task)));
};

edit.component.stage = function(stage){
    return m("div.stage",
             m("h1", m("div", "Stage"), m("input", edit.control.binds(stage.name))),
             stage.jobs().map(edit.component.job));
    
}

edit.view = function(){
    return m("div.stages", edit.vm.pipelines.map(edit.component.stage));
}

m.render(document.getElementById('pipeline'), edit);
