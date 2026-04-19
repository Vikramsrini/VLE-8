#!/bin/bash

echo "Starting all services..."

# Start Jenkins
echo "Starting Jenkins..."
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Start Prometheus
echo "Starting Prometheus..."
sudo systemctl start prometheus
sudo systemctl enable prometheus

# Start Grafana
echo "Starting Grafana..."
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Start Prometheus Node Exporter
echo "Starting Prometheus Node Exporter..."
sudo systemctl start prometheus-node-exporter
sudo systemctl enable prometheus-node-exporter

echo "All services started successfully!"
echo ""
echo "Service URLs:"
echo "  Jenkins:   http://3.106.239.232:8080"
echo "  Prometheus: http://3.106.239.232:9090"
echo "  Grafana:   http://3.106.239.232:3000"
echo ""
echo "Grafana default credentials: admin / admin"
