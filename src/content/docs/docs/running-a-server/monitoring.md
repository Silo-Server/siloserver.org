---
slug: docs/monitoring
title: Monitor Silo with Prometheus
description: Scrape Silo's metrics on a private network, load the example alerts and dashboard, and know what to check when an alert fires.
---

Turn on Silo's metrics listener, scrape it from a private network, and load the example alerts and dashboard from the server repository. Silo runs without Prometheus or Grafana. This page assumes you already run both, and their own documentation covers setting them up. For logs and OpenTelemetry traces, see [Logs and monitoring](/docs/logging).

## Turn on metrics

Add a metrics address to `.env`, then recreate the container with `docker compose up -d`:

```dotenv
SILO_METRICS_LISTEN=0.0.0.0:9091
```

The main server serves `/metrics` only on this address. Metrics are off while `SILO_METRICS_LISTEN` is unset, and Silo's web port answers `/metrics` with 404 either way. If Silo can't listen on the address, it stops at startup and the container log shows `metrics listener:` followed by the error.

The metrics address has no authentication. Keep it on loopback or a private monitoring network, and don't publish it through Docker `ports`, a reverse proxy, or an ingress.

Inside Docker, `127.0.0.1` is the container itself, so nothing outside the container can scrape `127.0.0.1:9091`. With `0.0.0.0:9091` and no `ports` entry, the address stays on the Docker network: a Prometheus container on the same network scrapes it as `silo:9091`. Use `127.0.0.1:9091` when Silo runs directly on the host and Prometheus runs beside it.

Don't scrape or publish the profiling port set by `SILO_DEBUG_LISTEN`. It's only for [collecting a performance profile](/docs/profiling).

### Proxy and transcode nodes

Proxy and transcode nodes serve `/metrics` on their own port, the one in the node's **URL** in **Admin > Nodes**. `SILO_METRICS_LISTEN` has no effect on them, and their `/metrics` has no authentication either. Clients stream from proxy nodes, so if clients reach a proxy node through a public hostname or a reverse proxy, block `/metrics` there. [Read node status](/docs/node-status#node-metrics-in-prometheus) lists the node series and example alerts.

## Set up Prometheus and Grafana

The server repository has example files in [`deploy/observability/`](https://github.com/Silo-Server/silo-server/tree/main/deploy/observability):

| File | Contains |
| --- | --- |
| `prometheus.yml` | An example scrape configuration |
| `silo.rules.yml` | Recording rules and [alerts](#when-an-alert-fires) |
| `silo.rules.test.yml` | Tests for the rules, run with `promtool test rules` |
| `grafana-dashboard.json` | A Grafana dashboard |

1. Start from `prometheus.yml` and replace its targets with your own: each main server's metrics port at an address Prometheus can reach, such as `silo:9091` from the same Docker network, and the address of each proxy or transcode node. Don't point a target at the main server's web port.
2. Keep the job name `silo`. The rules in `silo.rules.yml` expect it.
3. Load `silo.rules.yml` under `rule_files`, as the example does.
4. In Grafana, import `grafana-dashboard.json` and choose your Prometheus data source when Grafana asks for one.

### Label targets

Give every target a `cluster` label, and put the process's job in a `process_role` label, such as `api`, `transcode`, or `proxy`. The example does both. Don't add or relabel `role`: Silo's own metrics use it for database, cache, and storage pool roles.

### Other exporters

Silo measures its own processes and the calls it makes. For the host's disks and network, PostgreSQL, Redis, and GPU temperature, run the usual exporters for those on the same private network. Set retention in Prometheus; Silo has no setting for it.

## When an alert fires

`silo.rules.yml` has alerts for the problems below. The thresholds are in the file.

| Alert | What to check |
| --- | --- |
| `SiloTargetUnavailable` | Prometheus can't reach a server or node. Check the node's state in **Admin > Nodes** and whether the process is running. |
| `SiloCPUThrottled` | The container is hitting its CPU limit. Check FFmpeg and other load on the host. A [CPU profile](/docs/profiling#choose-a-profile) shows where Silo spends the time. |
| `SiloCgroupMemoryHigh`, `SiloCgroupOOM` | The container is near its memory limit, or the kernel killed a process. Two [heap profiles](/docs/profiling#choose-a-profile) taken some time apart show what grew. |
| `SiloPostgresPoolSaturated` | Requests are waiting for a database connection, so the API is slow while CPU is idle. Check PostgreSQL's own load, then take a [goroutine profile](/docs/profiling#choose-a-profile). |
| `SiloQueueAgeHigh` | A background job, such as a library scan, has waited a long time. Check the task in **Admin > Scheduled Tasks**. |
| `SiloQueueSamplingFailed` | Silo can't measure its job queues, so queue panels show gaps. A gap doesn't mean the queue is empty. |
| `SiloResourceSampleStale` | Silo stopped reading CPU, memory, disk, or GPU use. Check for blocked `/proc` access, a missing GPU tool such as `nvidia-smi`, or a mount that stopped responding. |
| `SiloOTLPExportFailure` | Traces aren't reaching your collector. Check the collector and the [OpenTelemetry settings](/docs/logging#opentelemetry-export). |
| `SiloScrapeSlow` | Prometheus takes too long to read Silo's metrics. Check the server's load. |

Every main server reports the same job queues, so a dashboard that adds them up counts each job once per server. The dashboard and the rules already handle this; keep it in mind when you build your own panels.
