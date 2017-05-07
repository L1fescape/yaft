import React, { Component } from 'react';

class Column extends Component {
  render() {
    const { accessor, content, className, render } = this.props.columnProps
    const { data } = this.props

    let body = ""

    if (render) {
      return render(data)
    }

    if (accessor) {
      body = data[accessor]
    } else if (content) {
      body = content(data)
    }

    return (
      <div className={`td ${className || ""}`}>
        {body}
      </div>
    )
  }
}

export default Column
