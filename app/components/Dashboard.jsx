import React from 'react';

export default class Dashboard extends React.Component {

  render() {
    return (
      <div id="dashboard">
        <h2>Domains</h2>
        <table>
          <thead>
          <tr>
            <th>Domain</th>
            <th>Origin</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>andrew.sprou.se</td>
              <td>andrew.sprou.se.s3-website-us-east-1.amazonaws.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}
