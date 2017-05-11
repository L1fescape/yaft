import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import raf from 'raf';

import Body from './body'

class Table extends Component {
  state = {
    fixed: false,
    scrollContainer: null,
    scrollListener: null
  }

  onScroll = (element, scrollContainer) => {
    const header = element.querySelector('.thead')
    const body = element.querySelector('.tbody')
    const container = element.querySelector('.yaft-table-container')
    const isContainerRelative = window.getComputedStyle(scrollContainer).position === 'relative'

    return () => {
      let fixed = scrollContainer.scrollTop >= element.offsetTop
      if (!isContainerRelative) {
        fixed = scrollContainer.scrollTop + scrollContainer.offsetTop >= element.offsetTop + container.offsetTop
      }
      let absolute = false // fixed && scrollContainer.scrollTop >= element.offsetTop + element.offsetHeight - header.offsetHeight

      let style = {
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%'
      }

      if (absolute) {
        style = {
          ...style,
          position: 'absolute',
          top: element.offsetHeight - header.offsetHeight
        }
      } else if (fixed) {
        style = {
          ...style,
          position: 'fixed',
          top: `${scrollContainer.offsetTop}px`,
          left: `${element.offsetLeft}px`,
          width: `${element.offsetWidth}px`
        }
      }

      raf(() => {
        body.style.paddingTop = fixed ? `${header.clientHeight}px` : '0'

        for (var key in style) {
          if (style.hasOwnProperty(key)) {
            header.style.setProperty(key, style[key])
          }
        }

        if (this.state.fixed != fixed) {
          this.setState({
            fixed
          })
        }
      })
    }
  }

  bindScrollListener = (parentSelector) => {
    const element = ReactDOM.findDOMNode(this)
    const scrollContainer = parentSelector ?  document.querySelector(parentSelector) : element.parentNode

    if (!scrollContainer) {
      throw new Error(`could not find ${parentSelector}. make sure your selector is on the page or set \`fixedHeader\` to \`false\``)
    }

    const scrollListener = this.onScroll(element, scrollContainer)
    scrollContainer.addEventListener('scroll', scrollListener)
    window.addEventListener('resize', scrollListener)

    this.setState({
      scrollContainer: scrollContainer,
      scrollListener: scrollListener
    })
  }

  unbindScrollListener = () => {
    if (this.state.scrollContainer && this.state.scrollListener) {
      this.state.scrollContainer.removeEventListener('scroll', this.state.scrollListener)
      window.removeEventListener('resize', this.state.scrollListener)
    }
  }

  componentDidMount() {
    const { fixedHeader, parentSelector } = this.props

    if (fixedHeader) {
      this.bindScrollListener(parentSelector)
    }
  }

  componentWillUnmount() {
    this.unbindScrollListener()
  }

  componentDidUpdate(prevProps) {
    if (this.state.scrollListener && prevProps.data.length != this.props.data.length) {
      this.state.scrollListener()
    }
  }


  render() {
    const { columns, className, fixedHeader, header, data, scroll, shouldComponentUpdate } = this.props
    const shouldBeFixed = fixedHeader && this.state.fixed

    return (
      <div className={`yaft-table ${scroll ? "scroll" : ""} ${className || ""}`}>
        <div className="yaft-table-container">
          <div className="thead">
            { header && <div className="thead-header">{header}</div> }
            <div className="thead-container">
              { columns.map((props, i) => <div className={`th ${props.className || ""}`} key={i}>{props.header}</div>) }
            </div>
          </div>
          <Body
            columns={columns}
            data={data}
            shouldComponentUpdate={shouldComponentUpdate}
          />
        </div>
      </div>
    )
  }
}

export default Table
