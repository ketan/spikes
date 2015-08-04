$(function(){
  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var ENTER_KEY = 13;

  function makeProp(prop, value) {
    var obj = {};
    obj[prop] = value;
    return obj;
  }

  var jobCounter = 0;
  var stageCounter = 0;

  var createNewJob = function() {
    return {name: "NewJob" + ++jobCounter, tasks: []};
  };

  var createNewStage = function(){
    return {name: "NewStage" + ++stageCounter, jobs: [createNewJob()]};
  }

  var StageList = React.createClass({
    getInitialState: function() {
      return {data: []};
    },
    componentDidMount: function() {
      var stageList = this;
      $.ajax({
        url: stageList.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
          window.data = data;
          stageList.setState({data: data});
        },
        error: function(xhr, status, err) {
          console.error(stageList.props.url, status, err.toString());
        }
      });
    },
    addTaskTo: function(stage, job, taskCommand){
      var stageIndex = _.findIndex(this.state.data, {name: stage.props.name});
      var jobIndex = _.findIndex(stage.props.jobs, {name: job.props.name});

      var newData = React.addons.update(this.state.data, makeProp(
        stageIndex, {
          jobs: makeProp(jobIndex, {
            tasks: {
              $push: [taskCommand]
            }
          })
        }
      ));

      this.setState({data: newData});
    },
    insertJob: function(stage, afterJob){
      var stageIndex = _.findIndex(this.state.data, {name: stage.props.name});
      var jobIndex = _.findIndex(stage.props.jobs, {name: afterJob.props.name});

      var newData = React.addons.update(this.state.data, makeProp(
        stageIndex, {
          jobs: {
            $splice: [[jobIndex+1, 0, createNewJob()]]
          }
        }
      ));

      this.setState({data: newData});
    },
    insertStage: function() {
      var newData = React.addons.update(this.state.data, {$push: [createNewStage()]});
      this.setState({data: newData});
    },
    save: function() {
      console.log(JSON.stringify(this.state.data, null, 2));
    },
    render: function(){
      var pipeline = this;
      var stageNodes = this.state.data.map(function(stage){
        return (
          <Stage {...stage} keyx={stage.name} pipeline={pipeline}/>
        );
      });

      return (
        <div className="stages">
          <ReactCSSTransitionGroup transitionName="example">
            {stageNodes}
            <AddStage pipeline={pipeline}/>
          </ReactCSSTransitionGroup>
          <SavePipeline pipeline={this} />
        </div>
      );
    }
  });

  var SavePipeline = React.createClass({
    save: function(event) {
      event.preventDefault();
      this.props.pipeline.save();
    },
    render: function() {
      return (
        <a
            href="#"
            className="save-pipeline"
            onClick={this.save}
          >Save Pipeline</a>
      );
    }
  });

  var Stage = React.createClass({
    addTaskTo: function(job, taskCommand){
      this.props.pipeline.addTaskTo(this, job, taskCommand);
    },
    insertJob: function(afterJob){
      this.props.pipeline.insertJob(this, afterJob);
    },
    render: function() {
      return (
        <div className="stage">
          <h1>Stage <input value={this.props.name} /></h1>
          <JobList jobs={this.props.jobs} stage={this} />
        </div>
      );
    }
  });

  var JobList = React.createClass({
    render: function() {
      var stage = this.props.stage;
      var jobNodes = this.props.jobs.map(function (job) {
        return (
          <Job name={job.name} tasks={job.tasks} keyx={job.name} stage={stage} />
        );
      });
      return (
        <div className="jobs">
          <ReactCSSTransitionGroup transitionName="example" transitionAppear={false}>
            {jobNodes}
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  });

  var Job = React.createClass({
    addTask: function(taskCommand) {
      this.props.stage.addTaskTo(this, taskCommand);
    },
    render: function() {
      return (
        <div className="job">
          <h2 className="name">Job <input value={this.props.name} /></h2>
          <TaskList tasks={this.props.tasks} job={this} />
          <AddJob stage={this.props.stage} afterJob={this} />
        </div>
      );
    }
  });

  var AddStage = React.createClass({
    addStage: function(event){
      event.preventDefault();
      this.props.pipeline.insertStage();
    },
    render: function(){
      return (
        <div className="stage">
          <a
            href="#"
            className="add-stage"
            onClick={this.addStage}
          >Add Stage</a>
        </div>
      );
    }
  });

  var AddJob = React.createClass({
    addJob: function(event){
      event.preventDefault();
      this.props.stage.insertJob(this.props.afterJob);
    },
    render: function() {
      return (
        <a
          href="#"
          className="add-job"
          onClick={this.addJob}
        >Add Job</a>
      );
    }
  });

  var AddTask = React.createClass({
    handleNewCommandKeyDown: function (event){
      if (event.keyCode !== ENTER_KEY) {
        return;
      }

      event.preventDefault();

      var val = event.target.value.trim();

      if (val === "") {
        return;
      }

      this.props.job.addTask(val);
      event.target.value = '';
    },
    render: function() {
      return (
        <input
          className="new-task"
          placeholder="Enter a new command"
          onKeyDown={this.handleNewCommandKeyDown}
        />
      );
    }
  });

  var TaskList = React.createClass({
    render: function() {
      var taskNodes = this.props.tasks.map(function (task) {
        return (
          <Task task={task} keyx={task} />
        );
      });
      return (
        <div className="tasks">
          <h3>Tasks:</h3>
          {taskNodes}
          <AddTask job={this.props.job} />
        </div>
      );
    }
  });

  var Task = React.createClass({
    render: function(){
      return (
        <input value={this.props.task} type="text" />
      );
    }
  })

  React.render(
    <StageList url="data.json" />,
    document.getElementById('content')
  );

});
