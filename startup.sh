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

# Start k3s (Kubernetes)
echo "Starting k3s (Kubernetes)..."
sudo systemctl start k3s
sudo systemctl enable k3s

echo "All services started successfully!"
echo ""
echo "Service URLs:"
echo "  Jenkins:   http://52.62.7.217:8080"
echo "  Prometheus: http://52.62.7.217:9090"
echo "  Grafana:   http://52.62.7.217:3000"
echo "  App:       http://52.62.7.217:30080"
echo ""
echo "Grafana default credentials: admin / admin"
