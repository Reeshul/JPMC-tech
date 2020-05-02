import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

// Props declaration for <Graph />

interface IProps {
  data: ServerRespond[];
}

// Perspective library adds load - an interface wrapper for TypeScript

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

// Data drilled from App.tsx as props into this graph component which renders Pesrpective

class RatioGraph extends Component<IProps, {}> {
  // Perspective table

  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer', { id: 'ratio' });
  }

  componentDidMount() {
    // Get element from the DOM.
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
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute(
        'columns',
        '["ratio", "lower_bound", "upper_bound", "trigger"]'
      );
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
