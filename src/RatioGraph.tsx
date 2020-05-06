import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
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

// Drill data as props into RadioGraph component

class RatioGraph extends Component<IProps, {}> {
  // Perspective table

  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer', { id: 'ratio' });
  }

  componentDidMount() {
    // Reference the 'perspective-viewer' element created above

    const elem = (document.getElementById(
      'ratio'
    ) as unknown) as PerspectiveViewerElement;

    const schema = {
      price_x: 'float',
      price_y: 'float',
      ratio: 'float',
      timestamp: 'date',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger: 'float',
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

      // Map datapoints based on the timestamp

      elem.setAttribute('row-pivots', '["timestamp"]');

      // Monitor ratio, lower_bound, upper_bound and trigger

      elem.setAttribute(
        'columns',
        '["ratio", "lower_bound", "upper_bound", "trigger"]'
      );

      // Handle duplicate data so that each datapoint is unique - ie one price for one timestamp

      elem.setAttribute(
        'aggregates',
        JSON.stringify({
          price_x: 'avg',
          price_y: 'avg',
          ratio: 'avg',
          timestamp: 'distinct count',
          upper_bound: 'avg',
          lower_bound: 'avg',
          trigger: 'avg',
        })
      );
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([DataManipulator.generateRow(this.props.data)]);
    }
  }
}

export default RatioGraph;
