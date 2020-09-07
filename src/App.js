import React from 'react';
import Column from './components/column'
import  { DragDropContext, Droppable} from 'react-beautiful-dnd'
import TaskDetails from './components/task-details'
import ContextMenu from './components/context-menu'
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.addCard = this.addCard.bind(this)
    this.addColumn = this.addColumn.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.displayTaskDetails = this.displayTaskDetails.bind(this)
    this.changeTaskData = this.changeTaskData.bind(this);
    this.deleteColumn = this.deleteColumn.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.displayContext = this.displayContext.bind(this)
    this.moveTasksColumn = this.moveTasksColumn.bind(this);
    this.changeColumnTitle=this.changeColumnTitle.bind(this);
    this.switchView=this.switchView.bind(this)
    this.state={
      view:"home",
      taskSerial: 10,
      tasks:{
        'task-1': { id: 'task-1', title:"Take out the garbage.", content:"Empty Trash Can"},
        'task-2': { id: 'task-2', title: "Charge my phone.", content: "I lost my wire!" },
        'task-3': { id: 'task-3', title: "Complete the hackathon.", content: "Deploying!" },
        'task-4': { id: 'task-4', title: "Get a job.", content: "The Hard Part" },
        'task-5': { id: 'task-5', title: "To make a new task, press the column's plus button.", content: "" },
        'task-6': { id: 'task-6', title: "To delete a column, right click on a column.", content: "And press the red button. You will also delete all the tasks the column contains." },
        'task-7': { id: 'task-7', title: "You can transfer all the tasks in one column into another", content: "With the context Menu by Right Clicking" },
        'task-8': { id: 'task-8', title: "Edit a column's title by clicking on its title.", content: "Remember to press save. You can also drag a column by its head." },
        'task-9': { id: 'task-9', title: "Clicking on a task will let you see it's description", content: "And edit/delete it." }
      },
      columnSerial: 4,
      columns:{
        'column-1':{
          id: 'column-1',
          title:"To Do",
          taskIds: ['task-1','task-2','task-3','task-4']
        },
        'column-2': {
          id: 'column-2',
          title: "In Progress",
          taskIds: []
        },
        'column-3': {
          id: 'column-3',
          title: "Done",
          taskIds: ['task-5', 'task-6', 'task-7', 'task-8', 'task-9']
        }
      },
      columnOrder: ['column-1', 'column-2', 'column-3'],
      taskDetails:{
        display: false,
        taskId: null
      },
      displayContext:{
        display: false,
        contextId: null,
        pos:{}
      }
    }
  }



  changeTaskData(id, title, content){
    const newTasks = JSON.parse(JSON.stringify(this.state.tasks))
    const newTask = { id: id, title: title, content: content}
    newTasks[id]=newTask;
    this.setState({ tasks: newTasks }, () => toast.success("Task Updated!"))
  }
  changeColumnTitle(col, title) {
    const newColumns={...this.state.columns}
    newColumns[col].title=title;
    this.setState({ columns: newColumns },()=> toast.success("Column Title Updated!"))

  }
  displayContext(display, contextId, xPos, yPos){
    this.setState({
      displayContext:{
        display: display,
        contextId: contextId,
        pos: {
          xPos: xPos,
          yPos: yPos
        }
      }
    })
  }


  componentDidUpdate(prevState){
    if(this.state !== prevState){
      const appState = JSON.stringify(this.state)
      localStorage.savedState= appState
    }
  }

  displayTaskDetails(bool, taskId){
    const newTaskDetails = {
      display: bool,
      taskId: taskId
    }
    this.setState({taskDetails: newTaskDetails})
  }

  deleteTask(id){
    const newTasks = JSON.parse(JSON.stringify(this.state.tasks))
    delete newTasks[id];
    const newColumns = JSON.parse(JSON.stringify(this.state.columns))
    for(let column in newColumns){
      const deleteIndex = newColumns[column].taskIds.findIndex((taskId)=>taskId===id)
      if(deleteIndex>=0){
        newColumns[column].taskIds.splice(deleteIndex,1)
        break;
      }
    }
    this.setState({ tasks: newTasks, columns: newColumns }, () => toast.error("Task Deleted :("))
  }

  moveTasksColumn(originId, targetId) {
    const newColumns = JSON.parse(JSON.stringify(this.state.columns))
    const ToMoveTasks = newColumns[originId].taskIds
    newColumns[originId].taskIds = [];
    const targetTasks = newColumns[targetId].taskIds.concat(ToMoveTasks)
    newColumns[targetId].taskIds = targetTasks;
    this.setState({ columns: newColumns },()=>toast.success("Tasks Moved!"))
  }

  componentDidMount(){
    let savedState = localStorage.savedState
    if(!savedState){
      const state = JSON.stringify(this.state)
      localStorage.savedState = state
      return
    } else {
      savedState = JSON.parse(savedState)
      this.setState({
        taskSerial: savedState.taskSerial,
        tasks: savedState.tasks,
        columnSerial: savedState.columnSerial,
        columns: savedState.columns,
        columnOrder: savedState.columnOrder,
        taskDetails: {display: false, taskId: null},
        displayContext: {
          display: false,
          contextId: null,
          pos: {}
        }
      })
    }
  }

  onDragEnd = result => {
    const {destination, source, draggableId, type} = result;

    if(!destination){
      return;
    }

    if(destination.droppableId === source.droppableId &&
      destination.index === source.index
      ) {
        return;
      }

    if(type === 'column'){
      const newColumnOrder = [...this.state.columnOrder]//Array.from(this.state.columnOrder)
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId)

      this.setState({columnOrder: newColumnOrder})
      return;
    }

    const startColumn = this.state.columns[source.droppableId];
    const finishColumn = this.state.columns[destination.droppableId];
    if(startColumn === finishColumn){ //if change is inside the same column
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index,1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      this.setState({
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      });
      return;
    }

  const startTaskIds = Array.from(startColumn.taskIds);
  startTaskIds.splice(source.index,1);
  const newStartColumn = {
    ...startColumn,
    taskIds:startTaskIds
  };

  const finishTaskIds = Array.from(finishColumn.taskIds);
  finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = {
    ...finishColumn,
    taskIds: finishTaskIds
  };

  const newState={
  columns:{
    ...this.state.columns,
    [newStartColumn.id]: newStartColumn,
    [newFinishColumn.id]: newFinishColumn
  }
}
  this.setState(newState);
}

  addCard(column){
    let taskSerial = this.state.taskSerial
    const newTaskSerial = taskSerial + 1
    const newTasks = JSON.parse(JSON.stringify(this.state.tasks))
    newTasks.[`task-${taskSerial}`] = {
      id: `task-${taskSerial}`,
      title: `Click to edit New Card`,
      content: ""
    }
    const newColumns = JSON.parse(JSON.stringify(this.state.columns))
    newColumns[column].taskIds.unshift(`task-${taskSerial}`)
    this.setState({
      taskSerial: newTaskSerial,
      tasks: newTasks,
      columns: newColumns
    }, () => toast.info("New Task Added!"))

  }


  handleClick(e){
    let inContext = false
    let node = e.target
    while (node){
      if(node.id === 'context'){
        inContext = true
        break
      }
      node = node.parentNode
    }
    if(!inContext){
      this.setState({
        displayContext: {
          display: false,
          contextId: null,
          pos: {}
        }
      })
    }
  }

  deleteColumn(id){
    const newColumns = JSON.parse(JSON.stringify(this.state.columns))
    const newTasks = JSON.parse(JSON.stringify(this.state.tasks))
    const newColumnOrder=[...this.state.columnOrder]
    const deleteOrderIndex= newColumnOrder.findIndex((col)=>col===id)
    newColumnOrder.splice(deleteOrderIndex,1)
    const deleteToTasks=newColumns[id].taskIds;
    for(let i=0; i<deleteToTasks.length; i++){
      delete newTasks[deleteToTasks[i]]
    }
    delete newColumns[id];
    this.setState({
      columns:newColumns,
      tasks:newTasks,
      columnOrder:newColumnOrder
    }, () => toast.error("Column Deleted :("))

  }

  addColumn(){
    const columnSerial = this.state.columnSerial
    const newColumnSerial = columnSerial + 1
    const newColumns = JSON.parse(JSON.stringify(this.state.columns))
    const newColumnOrder = this.state.columnOrder.splice(0)
    newColumns[`column-${columnSerial}`] = {
      id: `column-${columnSerial}`,
      title: 'New Column',
      taskIds: []
    }
    newColumnOrder.push(`column-${columnSerial}`)
    this.setState({
      columns: newColumns,
      columnSerial: newColumnSerial,
      columnOrder: newColumnOrder
    }, () => toast.info("New Column Added!"))
  }

  switchView(){
    if(this.state.view==="home"){
      this.setState({view:"app"})
    }else{
      this.setState({view:"home"})
    }
  }

  render(){

    if(this.state.view==="home"){
      return(<>
      <header>
        <nav className="navbar bg-dark row justify-content-between">
            <h2 className="text-white navbar-brand px-3">Simple Kanban</h2>
            <button className="btn btn-info mx-3" onClick={this.switchView}>Go To Kanban</button>
        </nav>
      </header>
      <div className='container'>
        <div className='d-flex flex-column bg-light'>
          <div className="m-3 p-3 bg-secondary">
            <h2>Stay Organized, Keep it Simple</h2>
            <p>Don't make things more complicated than it has to be. That's why we have simple Kanban.</p>
            <div className="row justify-content-center">
              <iframe title="tutorial" width="600" height="350" src="https://www.youtube.com/embed/gPx23Ss8KR8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
          </div>
          <div className="m-2 p-3 bg-info">
            <h2>About This Project</h2>
              <p><a href="https://github.com/david-diep/kanban-hackathon" target="_blank" rel="noopener noreferrer" className="text-dark">
                <u>Simple Kanban</u></a> was a 3-day Mintbean Hackathon Project for the
                <a href="https://sites.google.com/mintbean.io/javascriptbootcampolympics/home" target="_blank" rel="noopener noreferrer" className="text-dark"> <u>JavaScript Bootcamp Olympics.</u></a></p>
              <p>The goal of the hackathon was to create a kanban board: an agile project management tool designed to help visualize work, limit work-in-progress, and maximize efficiency.
                Essentially, it is a giant virtual board with post-it notes.
              </p>
              <p>We feel like we've been successful and we're proud of what we've managed to accomplish in the time frame.</p>
          </div>
          <div className="m-2 p-3 bg-secondary">
            <h2>The Team</h2>
            <div className="row justify-content-around">
                <div className="p-2 m-2 bg-light">
                    <h4>David Diep</h4>
                  <div className="w-100 p-1">
                    <img src="https://i.imgur.com/7Dz1MT5.png" alt="David Diep" width="300">
                    </img>
                    <div className="row p-2 w-100">
                    <a class="btn btn-outline-dark m-1" href="https://github.com/david-diep/" target="_blank" rel="noopener noreferrer" role="button">GitHub <img class="logo" src="https://i.imgur.com/syIhqol.png" alt="gitHub"></img></a>
                    <a class="btn btn-outline-primary m-1" href="https://www.linkedin.com/in/david-diep-dev/" target="_blank" rel="noopener noreferrer" role="button"><span class="align-bottom">Linked</span> <img class="logo" alt="linkedIn" src="https://i.imgur.com/lYabiUU.png"></img></a>
                  </div>
                  </div>
              </div>
                <div className="p-2 m-2  bg-light">
                  <h4>Kevin Lenell</h4>
                  <div className="w-100 p-1">
                    <img src="https://i.imgur.com/akIMMka.png" alt="Kevin Lenell" width="300">
                    </img>
                    <div className="row p-2 w-100">
                      <a class="btn btn-outline-dark m-1" href="https://github.com/krlenell" target="_blank" rel="noopener noreferrer" role="button">GitHub <img class="logo" src="https://i.imgur.com/syIhqol.png" alt="gitHub"></img></a>
                      <a class="btn btn-outline-primary m-1" href="https://www.linkedin.com/in/kevin-lenell/" target="_blank" rel="noopener noreferrer" role="button"><span class="align-bottom">Linked</span> <img class="logo" alt="linkedIn" src="https://i.imgur.com/lYabiUU.png"></img></a>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <div>

          </div>
        </div>
      </div>
    </>  )
    }
    else{
    return (<>
        <div className="app overflow-x" onClick={this.handleClick}>
          {this.state.displayContext.display ?
            <ContextMenu
              deleteColumn= {this.deleteColumn}
              moveTasksColumn={this.moveTasksColumn}
              displayContext={this.displayContext}
              columns={this.state.columns}
              pos={this.state.displayContext.pos}
              id={this.state.displayContext.contextId}
            /> :
            <></>}
          <header>

            <nav className={`
              navbar
              navbar-light
              nav-z
              bg-dark
              d-flex
              navbar-horizontal-fixed
              justify-content-between
            `}
            id="navbar"
            >
              <h2 className="text-white navbar-brand" onClick={this.switchView}>Simple Kanban</h2>
              <div>

                <button
                  className="btn btn-primary"
                  onClick={this.addColumn}
              >Add New Column <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
                <button className="btn btn-info ml-2" onClick={this.switchView}>Info</button>
              </div>
            </nav>
            <div className="navbar-space"></div>
          </header>

          {this.state.taskDetails.display &&
          <TaskDetails
            changeTaskData={this.changeTaskData}
            displayTaskDetails={this.displayTaskDetails}
            task={this.state.tasks[this.state.taskDetails.taskId]}
            deleteTask={this.deleteTask}
          /> }
          <div className="p-3 app">
            <DragDropContext
              onDragEnd={this.onDragEnd}
            >
              <Droppable
                droppableId="all-columns"
                direction ="horizontal"
                type="column"
              >
                {provided => (
                  <div
                    className="row flex-nowrap"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {this.state.columnOrder.map((columnId, index) =>{
                      const column= this.state.columns[columnId];
                      const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

                      return <Column
                        displayContext={this.displayContext}
                        addCard={this.addCard}
                        key = {column.id}
                        column = {column}
                        tasks = {tasks}
                        index = {index}
                        displayTaskDetails= {this.displayTaskDetails}
                        changeColumnTitle={this.changeColumnTitle}
                        />
                    })}
                    {provided.placeholder}
                  </div>)}
            </Droppable>
          </DragDropContext>
          </div>
        </div>
      <ToastContainer autoClose={1500} position="bottom-right" hideProgressBar={true} transition={Slide}/>
</>

    );}
}}

export default App;
