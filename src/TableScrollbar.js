// Copyright 2017 Olivier Elshocht <olivier.elshocht@gmail.com>
// Created 2017-01-11

import React, { Component } from 'react';

export default class TableScrollbar extends Component {
  constructor(props) {
    super(props);
    this.container = null;
    this.table = null;
    this.tableclone = null;
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    removeEventListener("resize", this.handleResize);
  }

  componentDidUpdate() {
    // Remove previous table clone from the DOM.
    if (this.tableclone !== null) {
      if (this.tableclone.parentNode !== null) {
        this.tableclone.parentNode.removeChild(this.tableclone);
      }
      this.tableclone = null;
      this.table = null;
    }

    // Find the enclosed table and clone it, removing the tbody to keep
    // the thead only.
    // TODO: iso removing the tbody, copy the table and thead only.
    this.table = this.container.getElementsByTagName("table")[0];
    this.tableclone = this.table.cloneNode(true);
    this.tableclone.removeChild(this.tableclone.getElementsByTagName("tbody")[0]);

    // Set the clone size (column widths) and position (scroll top)
    this.handleResize()
    this.handleScroll();

    // Add the clone to the container.
    this.tableclone.setAttribute("class", this.table.getAttribute("class") + " table-fixed-head");
    this.tableclone.style.position = "absolute";
    this.container.appendChild(this.tableclone);
  }

  render() {
    const containerStyle = {
      height: this.props.height,
      overflow: "auto",
      position: "relative",
    };

    return (
      <div className="TableScrollbar"
           style={containerStyle}
           onScroll={this.handleScroll}
           ref={(container) => {this.container = container}}>
        {this.props.children}
      </div>
    );
  }

  handleScroll() {
    this.tableclone.style.top = this.container.scrollTop + "px";
  }

  handleResize() {
    // Copy the columns width from the table to the clone.
    let columns = this.table.getElementsByTagName("th");
    let cloneColumns = this.tableclone.getElementsByTagName("th");
    for (let i = 0; i < columns.length; i++) {
      let width = columns[i].clientWidth + "px";
      cloneColumns[i].style.minWidth = width;
      cloneColumns[i].style.width = width;
    }
  }
}

TableScrollbar.propType = {
  height: React.PropTypes.string.isRequired,
}
