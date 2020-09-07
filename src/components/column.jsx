import React from 'react';
import Task from './task';
import {Droppable, Draggable} from 'react-beautiful-dnd'

class Column extends React.Component {
  constructor(props){
    super(props)
    this.state = {editTitle: false, columnTitle: this.props.column.title}
    this.handleClick = this.handleClick.bind(this);
    this.handleContext = this.handleContext.bind(this);
    this.deleteThisColumn = this.deleteThisColumn.bind(this);
    this.onTitleChange=this.onTitleChange.bind(this);
    this.onTitleClick=this.onTitleClick.bind(this);
    this.onTitleSave=this.onTitleSave.bind(this);
  }

  deleteThisColumn() {
    this.props.deleteColumn(this.props.column.id)
  }

  handleClick(){
    this.props.addCard(this.props.column.id);
  }

  onTitleClick(){
    this.setState({editTitle:true});
  }

  onTitleChange(event){
    this.setState({columnTitle:event.target.value})
  }

  onTitleSave(e){
    e.preventDefault();
    this.props.changeColumnTitle(this.props.column.id, this.state.columnTitle);
    this.setState({ editTitle: false });
  }

  handleContext(e){
    e.preventDefault()
    const xPos = e.pageX
    const yPos = e.pageY
    this.props.displayContext(true, this.props.column.id, xPos, yPos)
  }



  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided, snapshot) => (
          <div
          className={`
          col-min
          card
          h-80
          w-25
          m-1
          ${snapshot.isDragging ? 'highlighted-task' : ''}
          `}
          onContextMenu={this.handleContext}
          ref = {provided.innerRef}
          {...provided.draggableProps}
          >
          <div className="w-100 border-bottom d-flex justify-content-between"
            {...provided.dragHandleProps}>
            {this.state.editTitle?<>
              <input value={this.state.columnTitle} onChange={this.onTitleChange}></input>
              <button className="btn btn-success" onClick={this.onTitleSave}>Save</button></>
              :<h3 className="pt-2 pl-2" onClick={this.onTitleClick}>{this.props.column.title}</h3>}
            <div className={`m-2`}>
              <button
                className={`btn btn-primary`}
                onClick={this.handleClick}
                >
              <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
                {this.props.deleteColumnButton &&
                  <button
                    className="btn btn-outline-danger ml-2"
                    onClick={this.deleteThisColumn}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>}
            </div>
          </div>
          <Droppable droppableId={this.props.column.id}>
            {(provided, snapshot)=>(
              <div
              className={`
              tasklist
              h-80
              p-1
              ${snapshot.isDraggingOver ? 'bg-info':''}
              `}
              ref={provided.innerRef}
              {...provided.droppableProps}
              >
                {this.props.tasks.map((task, index) => (
                  <Task
                  key={task.id}
                  task={task}
                  index={index}
                  displayTaskDetails={this.props.displayTaskDetails}
                  />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>)}
      </Draggable>
    );
  }
}

export default Column;
