const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const retry = require('async-retry');
const os= require('os');

class Metrics {
  constructor() {
    const token = "my-super-secret-auth-token";
    const org = "poc-organization";
    const bucket = "poc-artillery.io";
    const client = new InfluxDB({ url: "http://influxdb:8086", token });
    this.writeApi = client.getWriteApi(org, bucket);
    this.writeApi.useDefaultTags({ host: "host1" });
  }

  async capture(options) {
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
     // Capture CPU and memory usage
     const cpuUsage = this.getCpuUsage();
     const memoryUsage = this.getMemoryUsage();
     point.floatField('cpu_usage', cpuUsage);
     point.floatField('memory_usage', memoryUsage);
   
    this.writeApi.writePoint(point);
    this.writeApi.flush();
  }

  getCpuUsage() {
    const cpus = os.cpus();
    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;
    for (let cpu of cpus) {
      user += cpu.times.user;
      nice += cpu.times.nice;
      sys += cpu.times.sys;
      idle += cpu.times.idle;
      irq += cpu.times.irq;
    }
    const total = user + nice + sys + idle + irq;
    return ((total - idle) / total) * 100;
  }

  getMemoryUsage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    return ((totalMemory - freeMemory) / totalMemory) * 100;
  }

  fetchDurationMs(start){
    const duration = process.hrtime(start);
    const durationMs = duration[0] * 1000 + duration[1] / 1e6;
    return durationMs;
  }
}

module.exports = Metrics;
