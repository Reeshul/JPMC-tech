import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import RatioGraph from './RatioGraph';
import './App.css';
import StocksGraph from './StocksGraph';

interface IState {
  data: ServerRespond[];
  showGraph: boolean;
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      data: [],
      showGraph: false,
    };
  }

  renderRatioGraph() {
    if (this.state.showGraph) {
      return <RatioGraph data={this.state.data} />;
    }
  }

  renderStockGraph() {
    if (this.state.showGraph) {
      return <StocksGraph data={this.state.data} />;
    }
  }

  // Gets new data from server and updates state

  getDataFromServer() {
    let x = 0;
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({
          data: serverResponds,
          showGraph: true,
        });
      });
      x++;
      if (x > 1000) {
        clearInterval(interval);
      }
    }, 100);
  }

  render() {
    return (
      <div className="App">
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              this.getDataFromServer();
            }}
          >
            Stream Data
          </button>
          <header className="App-header">Stocks X & Y</header>
          <div className="Graph">{this.renderStockGraph()}</div>
          <header className="App-header">Stock X / Stock Y</header>
          <div className="Graph">{this.renderRatioGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
