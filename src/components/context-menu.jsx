import React from 'react'

export default class ContextMenu extends React.Component{
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e){
    const splitId=e.target.id.split('_')
    const thisId = this.props.id
    if(splitId[0] === 'moveto'){
      this.props.moveTasksColumn(thisId, splitId[1])
      this.props.displayContext(false, null, {})
    }
    if(splitId[0] === 'delete'){
      this.props.deleteColumn(this.props.id)
      this.props.displayContext(false, null, {})
    }
  }

  render(){
    const xPos = this.props.pos.xPos
    const yPos = this.props.pos.yPos
    const id = this.props.id
    const columns = this.props.columns
    const columnsList = []
    for(const property in columns) {
      const children = columns[property].title
      if(columns[property] !== columns[id]){
        columnsList.push(<li key={property} id={`moveto_${property}`} className="list-group-item">{children}</li>)
      }
    }
    return(
      <div
      onClick={this.handleClick}
      id="context"
      className="card"
      style={{
        position: "absolute",
        top: yPos,
        left: xPos,
        zIndex: 49,

      }}
      >
        <div className="p-2">
          <h6>Column: {columns[id].title}</h6>
          <p>Move All Cards To:</p>
          <ul className="list-group">
            {columnsList.map((item) => item)}
          </ul>
        </div>
        <button id="delete"
          className="btn btn-danger"
        >
          Delete Column: {columns[id].title}
        </button>
      </div>
    )
  }
}
