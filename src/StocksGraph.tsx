import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

// Props declaration for <Graph />

interface IProps {
  data: ServerRespond[];
}

// Gets 'PerspectiveViewerElement' to behave like an HTML element

interface PerspectiveViewerElement extends HTMLElement {
  // Load table in the HTML element

  load: (table: Table) => void;
}

// Drill data as props into StocksGraph component

class StocksGraph extends Component<IProps, {}> {
  // Perspective table

  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer', { id: 'stocks' });
  }

  componentDidMount() {
    // Reference the <perspective-viewer> element created above

    const elem = (document.getElementById(
      'stocks'
    ) as unknown) as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the table in <perspective-viewer>

      elem.load(this.table);

      // CONFIGURE GRAPH

      // Line graph

      elem.setAttribute('view', 'y_line');

      // Two stocks, each with a value of ["stock"]

      elem.setAttribute('column-pivots', '["stock"]');

      // Map datapoints based on the timestamp

      elem.setAttribute('row-pivots', '["timestamp"]');

      // Ensure we only use the top_ask_price to to correspond with the value of the stock

      elem.setAttribute('columns', '["top_ask_price"]');

      // Handle duplicate data so that each datapoint is unique - ie one price for one timestamp. If there are two prices for a timestamp then average the top_bid_price and top_ask_price

      elem.setAttribute(
        'aggregates',
        JSON.stringify({
          stock: 'distinct count',
          top_ask_price: 'avg',
          top_bid_price: 'avg',
          timestamp: 'distinct count',
        })
      );
    }
  }

  componentDidUpdate() {
    // Insert data into Perspective table every time the data props updates

    if (this.table) {
      this.table.update(
        this.props.data.map((el: any) => {
          // Format data from ServerRespond to schema

          return {
            stock: el.stock,
            top_ask_price: (el.top_ask && el.top_ask.price) || 0,
            top_bid_price: (el.top_bid && el.top_bid.price) || 0,
            timestamp: el.timestamp,
          };
        })
      );
    }
  }
}

export default StocksGraph;
