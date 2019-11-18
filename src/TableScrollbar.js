// Copyright 2017, 2019 Olivier Elshocht <olivier.elshocht@gmail.com>
// Created 2017-01-11

import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
  height: PropTypes.string.isRequired,
  rows: PropTypes.number,
};

const defaultProps = {
  height: "100%",
};


export default class TableScrollbar extends React.Component {
  constructor(props) {
    super(props);
    this.container = null;
    this.table = null;
    this.tableclone = null;
    this.headHeight = 0;
    this.rowHeight = 0;

    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.renderFixedHeader = this.renderFixedHeader.bind(this);
  }

  componentDidMount() {
    this.renderFixedHeader();
    addEventListener("resize", this.handleResize);
    this.forceUpdate();
  }

  componentWillUnmount() {
    removeEventListener("resize", this.handleResize);
  }

  componentDidUpdate() {
    this.renderFixedHeader();
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
      cloneColumns[i].style.boxSizing = "border-box";
    }
  }

  renderFixedHeader() {
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

    // Get the table head height.
    if (this.headHeight === 0) {
      const thead = this.table.getElementsByTagName("thead")[0];
      if (thead) {
        this.headHeight = thead.clientHeight;
        console.log("Table head height:", this.headHeight);
      }
    }

    // Get the table row height - from a temp row, as the table body
    // may not contain any row yet.
    if (this.rowHeight === 0) {
      const tbody = document.createElement("tbody");
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      const content = document.createTextNode("&nbsp;");
      td.appendChild(content);
      tr.appendChild(td);
      tbody.appendChild(tr);
      this.tableclone.appendChild(tbody);
      this.rowHeight = tbody.clientHeight;  // Use tbody iso of tr to account for boder-spacing.
      this.tableclone.removeChild(tbody);
      console.log("Table row height:", this.rowHeight);
    }
  }

  render() {
    const containerStyle = {
      height: (this.props.rows) ?
        this.headHeight + (this.props.rows * this.rowHeight) + "px" :
        this.props.height,
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
}

TableScrollbar.propTypes = propTypes;
TableScrollbar.defaultProps = defaultProps;
