import React from 'react';
import {Draggable} from 'react-beautiful-dnd'

class Task extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e){
    this.props.displayTaskDetails(true, this.props.task.id)
  }

  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (

          <div
            onClick={this.handleClick}
            className={`
              border
              p-2
              m-2
              bg-light
              card
              ${snapshot.isDragging ? 'highlighted-task':''}`
            }
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref = {provided.innerRef}
          >

            <div className="card-title">
              {this.props.task.title}
            </div>

          </div>

        )}
      </Draggable>

    )}

}

export default Task;
