export interface Order {
  price: number;
  size: number;
}

// Datafeed server returns an array of ServerRespond with 2 stocks

export interface ServerRespond {
  stock: string;
  top_bid: Order;
  top_ask: Order;
  timestamp: Date;
}

class DataStreamer {
  static API_URL: string = 'http://localhost:8080/query?id=1';

  // Send request to the datafeed server and executes callback function

  static getData(callback: (data: ServerRespond[]) => void): void {
    const request = new XMLHttpRequest();
    request.open('GET', DataStreamer.API_URL, false);

    request.onload = () => {
      if (request.status === 200) {
        callback(JSON.parse(request.responseText));
      } else {
        alert('Request failed');
      }
    };

    request.send();
  }
}

export default DataStreamer;
