import { ServerRespond } from './DataStreamer';

// Ensure we return an object that corresponds to the schema written in RatioGraph

export interface Row {
  price_x: number;
  price_y: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger: number | undefined;
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // Compute price of stock x

    const priceOfStockX =
      (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;

    // Compute price of stock y

    const priceOfStockY =
      (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;

    // Compute ratio

    const ratio = priceOfStockX / priceOfStockY;

    // Enter bound limit

    const boundLimit = 0.01;

    // Compute upper bound

    const upperBound = 1 + boundLimit;

    // Compute lower bound

    const lowerBound = 1 - boundLimit;
    return {
      price_x: priceOfStockX,
      price_y: priceOfStockY,
      ratio,
      timestamp:
        serverRespond[0].timestamp > serverRespond[1].timestamp
          ? serverRespond[0].timestamp
          : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger: ratio > upperBound || ratio < lowerBound ? ratio : undefined,
    };
  }
}
