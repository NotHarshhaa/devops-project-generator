import { ProjectConfig, GeneratedFile } from "@/lib/types";
import { normalizeProjectName } from "../file-utils";

export function generateRealisticMonitoringFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = normalizeProjectName(config.projectName);
  const obs = config.observability;

  if (obs === "prometheus-grafana") {
    files.push({
      path: `${projectName}/monitoring/prometheus/prometheus.yml`,
      content: `global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts.yml"

scrape_configs:
  - job_name: '${config.projectName}-service'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['app:8080']
        labels:
          environment: 'production'
          app: '${config.projectName}'

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/monitoring/prometheus/alerts.yml`,
      content: `groups:
  - name: ${config.projectName}-alerts
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service ${config.projectName} is down"
          description: "Instance {{ $labels.instance }} has been unreachable for more than 1 minute."

      - alert: HighRequestLatency
        expr: rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m]) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High request latency on {{ $labels.instance }}"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100 > 5
        for: 3m
        labels:
          severity: critical
        annotations:
          summary: "Error rate is above 5% on {{ $labels.instance }}"
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/monitoring/grafana/dashboards/dashboard.json`,
      content: JSON.stringify(
        {
          title: `${config.projectName} - Service Overview`,
          schemaVersion: 16,
          refresh: "10s",
          panels: [
            {
              title: "Request Rate (QPS)",
              type: "graph",
              targets: [{ expr: `rate(http_requests_total{app="${config.projectName}"}[1m])` }],
            },
            {
              title: "P95 Latency",
              type: "graph",
              targets: [
                {
                  expr: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{app="${config.projectName}"}[5m])) by (le))`,
                },
              ],
            },
            {
              title: "Error Rate (%)",
              type: "singlestat",
              targets: [
                {
                  expr: `sum(rate(http_requests_total{app="${config.projectName}",status=~"5.."}[5m])) / sum(rate(http_requests_total{app="${config.projectName}"}[5m])) * 100`,
                },
              ],
            },
          ],
        },
        null,
        2
      ),
      type: "file",
    });
  } else if (obs === "elk-stack") {
    files.push({
      path: `${projectName}/monitoring/logstash/logstash.conf`,
      content: `input {
  beats {
    port => 5044
  }
}

filter {
  json {
    source => "message"
  }
  mutate {
    add_field => { "project" => "${config.projectName}" }
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "${config.projectName}-logs-%{+YYYY.MM.dd}"
  }
}
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/monitoring/filebeat/filebeat.yml`,
      content: `filebeat.inputs:
  - type: container
    paths:
      - /var/log/containers/*.log

output.logstash:
  hosts: ["logstash:5044"]
`,
      type: "file",
    });
  } else if (obs === "datadog") {
    files.push({
      path: `${projectName}/monitoring/datadog/datadog.yaml`,
      content: `api_key: \${DD_API_KEY}
site: datadoghq.com
tags:
  - project:${config.projectName}
  - env:production
logs_enabled: true
apm_config:
  enabled: true
process_config:
  expvar_port: 6062
`,
      type: "file",
    });
  } else if (obs === "cloudwatch") {
    files.push({
      path: `${projectName}/monitoring/cloudwatch/amazon-cloudwatch-agent.json`,
      content: JSON.stringify(
        {
          logs: {
            logs_collected: {
              files: {
                collect_list: [
                  {
                    file_path: "/var/log/app.log",
                    log_group_name: `/aws/apps/${config.projectName}`,
                    log_stream_name: "{instance_id}",
                  },
                ],
              },
            },
          },
          metrics: {
            metrics_collected: {
              mem: { measurement: ["mem_used_percent"] },
              cpu: { measurement: ["cpu_usage_idle"], totalcpu: true },
            },
          },
        },
        null,
        2
      ),
      type: "file",
    });
  } else {
    // jaeger-prometheus or fallback
    files.push({
      path: `${projectName}/monitoring/otel/otel-collector.yaml`,
      content: `receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
  jaeger:
    endpoint: "jaeger:14250"
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
`,
      type: "file",
    });
  }

  return files;
}
