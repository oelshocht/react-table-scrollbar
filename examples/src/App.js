import React from 'react';
import './App.css';

import TableScrollbar from 'react-table-scrollbar';
import randomusers from './data.js';

const table = (
  <table>
    <thead>
      <tr>
        <th>id</th>
        <th>first</th>
        <th>last</th>
        <th>email</th>
      </tr>
    </thead>
    <tbody>
      {randomusers.map((user, id) =>
        <tr key={id}>
          <td>{id}</td>
          <td>{user.name.first}</td>
          <td>{user.name.last}</td>
          <td>{user.email}</td>
        </tr>
      )}
    </tbody>
  </table>
);


function App() {
  return (
    <div className="App">
      <div className="box">
        <span>
          Set the table height as a number of body rows
        </span>
        <TableScrollbar rows="5">
          {table}
        </TableScrollbar>
      </div>
      <div className="box">
        <span>
          Set the table height in CSS units
        </span>
        <TableScrollbar height="200px">
          {table}
        </TableScrollbar>
      </div>
      <div className="box" style={{height: "30vh"}}>
        <span>
          By default, the table will fill up the container's height
        </span>
        <TableScrollbar>
          {table}
        </TableScrollbar>
      </div>
    </div>
  );
}

export default App;
