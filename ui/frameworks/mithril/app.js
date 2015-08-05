var go = {config: {}};
var edit = go.config.edit = {
    stage: {},
    job: {},
    component: {},
    control: {}
};

edit.Stages = Array;

edit.Stage = function(name, jobs) {
    this.name = m.prop(name);
    this.jobs = m.prop(jobs);
    var stage = this;
    this.newJob = function(){
	stage.jobs().push(new edit.Job("", []));
    };
}

edit.Job = function(name, tasks){
    this.name = m.prop(name);
    this.tasks = m.prop(tasks);
    var job = this;
    this.newTask = function(){
	job.tasks().push(new edit.Task(""));
    };
}

edit.Task = function(command) {
    this.command = m.prop(command);
}

edit.vm = {
    init: function(data){
        var stages = this.stages = new edit.Stages();
        data.map(function(stage){
            stages.push(new edit.Stage(stage.name, stage.jobs.map(function(job){
                return new edit.Job(job.name, job.tasks.map(function(task){
                    return new edit.Task(task);
                }));
            })));
        });
    },
    save: function(){
	var pipeline = edit.vm.stages.map(function(stage){
	    return {
		stage : stage.name(), 
		jobs: stage.jobs().map(function(job){
		    return {
			name : job.name(), 
			tasks : job.tasks().map(function(task){
			    return task.command();
			})
		    }
		})
	    };
	});
	console.log(JSON.stringify(pipeline));
    }
};

edit.controller = function(){
    m.request({method: "GET", url: "/stages.json"}).then(function(data){
	go.config.edit.vm.init(data);
    });
};

edit.control.binds =  function(prop) {
    return {oninput: m.withAttr("value", prop), value: prop()}
};

edit.component.task = function(task){
    return m("div.task", 
	     m("h3", m("div", "task"), 
	       m("div", m("input", edit.control.binds(task.command)))));
};

edit.component.job = function(job){
    return m("div.job", 
             m("h2", m("div", "Job"),
               m("span",
                 m("input", edit.control.binds(job.name))),
               job.tasks().map(edit.component.task),
	       m("div", m("button", { onclick: job.newTask }, "Add Task"))
	      ));
};

edit.component.stage = function(stage){
    return m("div.stage",
             m("h1", 
	       m("div", "Stage"), 
	       m("input", edit.control.binds(stage.name))),
             stage.jobs().map(edit.component.job),
	     m("h1", m("button", { onclick: stage.newJob }, "Add Job")));
}

edit.view = function(){
    return m("div.stages", 
	     m("h3", m("button", {onclick: edit.vm.save}, "Save")),
	     edit.vm.stages.map(edit.component.stage));
}

m.mount(document.getElementById('pipeline'), edit);
