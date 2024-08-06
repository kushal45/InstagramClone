const { InfluxDB, Point } = require("@influxdata/influxdb-client");

class Metrics {
  constructor() {
    const token = "my-super-secret-auth-token";
    const org = "poc-organization";
    const bucket = "poc-artillery.io";
    const client = new InfluxDB({ url: "http://influxdb:8086", token });
    this.writeApi = client.getWriteApi(org, bucket);
    this.writeApi.useDefaultTags({ host: "host1" });
  }

  capture(options) {
    const point = new Point("api_metrics");
    for (let key in options) {
      if (key !== "response_time_ms" || key !== "status_code") {
        point.tag(key, options[key]);
      }
      if (key === "response_time_ms") {
        point.floatField(key, options[key]);
      }
      if (key === "status_code") {
        point.intField(key, options[key]);
      }
    }
    this.writeApi.writePoint(point);
    this.writeApi.flush();
  }

  fetchDurationMs(start){
    const duration = process.hrtime(start);
    const durationMs = duration[0] * 1000 + duration[1] / 1e6;
    return durationMs;
  }
}

module.exports = Metrics;
