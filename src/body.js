import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import hash from 'object-hash'

import Column from './column'

class Body extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shouldComponentUpdate) {
      return this.props.shouldComponentUpdate(nextProps, nextState, this.props, this.state)
    }

    return hash(this.props.data) !== hash(nextProps.data)
  }

  render() {
    const { columns, data } = this.props

    return (
      <div className="tbody">
        { data.map((rowData, i) => {
          return (
            <div key={i} className="tr">
              { columns.map((props, j) => <Column key={j} rowIndex={i} columnProps={props} data={rowData} />) }
            </div>
          )
        }) }
      </div>
    )
  }
}

export default Body
