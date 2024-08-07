from flask import Flask, Response
from prometheus_client import generate_latest, Counter, Histogram, Gauge
import time

app = Flask(__name__)

# Define Prometheus metrics
REQUEST_COUNT = Counter('request_count', 'Total number of requests')
REQUEST_LATENCY = Histogram('request_latency_seconds', 'Request latency in seconds')
IN_PROGRESS = Gauge('in_progress_requests', 'Number of requests in progress')

@app.route('/slow')
def slow_response():
    start_time = time.time()
    IN_PROGRESS.inc()  # Increment the in-progress gauge
    time.sleep(2)  # Simulate a 2-second delay
    REQUEST_COUNT.inc()  # Increment the request counter
    REQUEST_LATENCY.observe(time.time() - start_time)  # Observe the request latency
    IN_PROGRESS.dec()  # Decrement the in-progress gauge
    return "This is a slow response"

@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype='text/plain')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)