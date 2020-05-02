import { ServerRespond } from './DataStreamer';

export interface Row {
  price_x: number;
  price_y: number;
  ratio: number;
  timestamp: Date;
  bound_limit: number;
  upper_bound: number;
  lower_bound: number;
  trigger: number;
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceOfStockX =
      (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceOfStockY =
      (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceOfStockX / priceOfStockY;
    const boundLimit = 0.01;
    const upperBound = 1 + boundLimit;
    const lowerBound = 1 - boundLimit;
    return {
      price_x: priceOfStockX,
      price_y: priceOfStockY,
      ratio,
      timestamp:
        serverRespond[0].timestamp > serverRespond[1].timestamp
          ? serverRespond[0].timestamp
          : serverRespond[1].timestamp,
      bound_limit: boundLimit,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger: ratio > upperBound || ratio < lowerBound ? ratio : NaN,
    };
  }
}
