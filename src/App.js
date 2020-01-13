import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import  NetworkGraph  from "./lib";

import { snapshots as snapshotsSmall } from "./sample_json_for_network_map/small_network/networks_77_snapshots";
import { connections as connectionsSmall } from './sample_json_for_network_map/small_network/snapshots_9_connections';
import { devices as devicesSmall } from './sample_json_for_network_map/small_network/snapshots_9_network_devices';

import { snapshots as snapshotsLarge } from './sample_json_for_network_map/large_network/networks_77_snapshots';
import { connections as connectionsLarge } from './sample_json_for_network_map/large_network/snapshots_10_connections';
import { devices as devicesLarge } from './sample_json_for_network_map/large_network/snapshots_10_network_devices';

class App extends Component {
  state = { };

  onError = (...args) => console.log("onError", ...args);
  onSelectNode = (...args) => console.log("onSelectNode", ...args);
  onSelectGroup = (...args) => console.log("onSelectGroup", ...args);

  _loadSmallNetowrk = () => {
    console.log("_loadSmallNetowrk");

    this.setState({ connections: connectionsSmall, devices: devicesSmall, snapshots: snapshotsSmall });
  }

  _loadLargeNetowrk = () => {
    console.log("_loadLargeNetowrk");

    this.setState({ connections: connectionsLarge, devices: devicesLarge, snapshots: snapshotsLarge });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <span id="test-icon"></span>
        </p>

        <button onClick={this._loadSmallNetowrk}>Load Small Graph</button>
        <button onClick={this._loadLargeNetowrk}>Load Large Graph</button>

        <NetworkGraph ref={(ref) => this.graph = ref}
          onError={this.onError}
          onSelectNode={this.onSelectNode}
          onSelectGroup={this.onSelectGroup}
          nodes={this.state.devices && this.state.devices.data}
          filteredNodes={this.state.devices && this.state.devices.data}
          edges={this.state.connections && this.state.connections.data}
          isHierarchy={false}
          snapshot={this.state.snapshots && this.state.snapshots.data[0]}
        />
      </div>
    );
  }
}

export default App;
