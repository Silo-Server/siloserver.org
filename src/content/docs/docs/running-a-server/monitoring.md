---
slug: docs/monitoring
title: Monitor Silo with Prometheus
description: Scrape Silo's metrics on a private network, load the example alerts and dashboard, and read queue and work metrics.
---

Turn on Silo's metrics listener, scrape it from a private network, and load the example alerts and dashboard from the server repository. For logs and OpenTelemetry traces, see [Logs and monitoring](/docs/logging).

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

Proxy and transcode nodes serve `/metrics` on their own port, the one in the node's **URL** in **Admin > Nodes**. `SILO_METRICS_LISTEN` has no effect on them, and their `/metrics` has no authentication either. Clients stream from proxy nodes, so if clients reach a proxy node through a public hostname or a reverse proxy, block `/metrics` there.

## Set up Prometheus and Grafana

The server repository has example files in [`deploy/observability/`](https://github.com/Silo-Server/silo-server/tree/main/deploy/observability):

| File | Contains |
| --- | --- |
| `prometheus.yml` | An example scrape configuration |
| `silo.rules.yml` | Recording rules and [alerts](#alerts) |
| `silo.rules.test.yml` | Tests for the rules, run with `promtool test rules` |
| `grafana-dashboard.json` | A Grafana dashboard |

1. Start from `prometheus.yml` and replace its targets with your own: the `SILO_METRICS_LISTEN` address of each main server, and the address of each proxy or transcode node. Don't point a target at the main server's web port.
2. Keep the job name `silo`. The rules in `silo.rules.yml` expect it.
3. Load `silo.rules.yml` under `rule_files`, as the example does.
4. In Grafana, import `grafana-dashboard.json` and choose your Prometheus data source when Grafana asks for one.

### Label targets

Give every target a `cluster` label, and put the process's job in a `process_role` label, such as `api`, `transcode`, or `proxy`. The example does both. Don't add or relabel `role`: Silo's own metrics use it for database, cache, and storage pool roles.

### Size scrapes

Start with the example's settings: a 15-second scrape interval, a 10-second timeout, and `sample_limit: 20000`. If a scrape goes over `sample_limit`, Prometheus rejects the whole scrape, so alert well before a target gets there. On a large installation, check `scrape_samples_scraped` and `scrape_duration_seconds` for each target before you rely on these limits.

### Retention and other exporters

Set metric retention in Prometheus, and trace and log retention in your OpenTelemetry backend. Silo has no setting for either.

Silo measures its own processes and the calls it makes. For the rest, run the usual exporters on the same private network:

- node-exporter for the host's disks, filesystems, and network
- a container exporter for orchestrator quotas and OOM history
- your GPU vendor's exporter for whole-device power and temperature limits
- PostgreSQL, Redis, and storage exporters for those services' own health

## Alerts

`silo.rules.yml` defines these alerts:

| Alert | Fires when |
| --- | --- |
| `SiloTargetUnavailable` | Prometheus can't scrape a Silo target for 2 minutes |
| `SiloResourceSampleStale` | Silo's CPU, memory, disk, and GPU readings stop updating for 1 minute |
| `SiloQueueSamplingFailed` | Silo can't measure a shared queue for 2 minutes |
| `SiloQueueAgeHigh` | The oldest queued job has waited more than 30 minutes, for 10 minutes |
| `SiloCgroupMemoryHigh` | The container uses more than 90% of its memory limit for 5 minutes |
| `SiloCgroupOOM` | The kernel killed a process in the container for running out of memory |
| `SiloCPUThrottled` | The container's CPU is throttled in more than 20% of periods for 10 minutes |
| `SiloOTLPExportFailure` | OpenTelemetry exports fail for 2 minutes |
| `SiloScrapeSlow` | A scrape takes longer than 1 second for 5 minutes |
| `SiloPostgresPoolSaturated` | A PostgreSQL connection pool is more than 90% in use for 2 minutes |

The rules also record `silo:queue_items:max` and `silo:queue_oldest_requested_timestamp_seconds:min`: each queue's depth and oldest request per cluster, with replicas combined. Use them in your own queries and panels.

## Read queue and work metrics

`silo_queue_*` metrics describe the shared queues Silo keeps in PostgreSQL, such as library scans, matching, image caching, and prepared downloads. `silo_work_*` metrics describe the work each process runs.

- Every main server reports the same shared queues. Combine them with `max by (cluster, queue, state)` for `silo_queue_items` and `min by (cluster, queue, state)` for `silo_queue_oldest_requested_timestamp_seconds`, or use the recorded series above. Never sum queue metrics across main servers.
- Queue age includes jobs waiting to retry, so it isn't the age of the oldest job that can run now.
- When `silo_queue_sample_available` is `0`, Silo couldn't measure that queue and leaves out its depth and age. Silo also leaves them out once its last measurement is more than 90 seconds old. A missing value doesn't mean an empty queue. `silo_queue_sample_errors_total` counts failed measurements.
- Work metrics are per process, so sum them across processes: `silo_work_active`, `silo_work_attempts_total`, `silo_work_duration_seconds`, `silo_work_queue_wait_seconds`, `silo_work_progress_updates_total`, and `silo_work_recoveries_total`.
- `silo_work_attempts_total{outcome="unknown"}` counts attempts Silo couldn't confirm the end of. Don't count them as successes.
- One scheduled task can start several jobs, so attempts aren't media items. Don't read item throughput from attempt counts.
- A missing or stale target isn't idle work. Keep panels for `up`, `silo_queue_sample_available`, and `silo_queue_sample_timestamp_seconds`.

## Diagnose with metrics

| Symptom | What to check |
| --- | --- |
| CPU saturated or throttled (`SiloCPUThrottled`) | Compare Silo's CPU use with the container's CPU limit and throttled periods. Check FFmpeg's CPU and other load on the host separately. A [CPU profile](/docs/profiling#choose-a-profile) of the busy process shows where Silo spends the time. |
| Memory growing or OOM kills (`SiloCgroupMemoryHigh`, `SiloCgroupOOM`) | Compare Silo's RSS, Go heap, running FFmpeg processes, and container memory. Two [heap profiles](/docs/profiling#choose-a-profile) taken some time apart show what grew. If Silo died before Prometheus could scrape it, check Docker or your orchestrator for the exit and OOM history. |
| Slow API while CPU is idle (`SiloPostgresPoolSaturated`) | Compare acquired and maximum PostgreSQL connections in `silo_postgres_pool_connections`, and Redis waits and timeouts in `silo_redis_pool_waits`. A goroutine profile or a short trace shows what requests are waiting on. |
| Queue age rising (`SiloQueueAgeHigh`) | Check `SiloQueueSamplingFailed` first. Then check for jobs waiting to retry, attempt outcomes, whether progress updates are still rising, and the task in **Admin > Scheduled Tasks**. |
| Stream interrupted or node lost (`SiloTargetUnavailable`) | Check `up`, the node's state in **Admin > Nodes**, and FFmpeg exits in `silo_subprocess_exits_total`. Before you decide a node restart did no harm, play the same file through another node. |
| Traces missing (`SiloOTLPExportFailure`) | Check the [trace sampling ratio](/docs/logging#trace-sampling), failed exports in `silo_otel_export_records_total{outcome="error"}`, and the collector. |
| Hardware values missing (`SiloResourceSampleStale`) | A missing value isn't zero. Fix what Silo reads from, such as blocked `/proc` access, a missing GPU tool such as `nvidia-smi`, or a mount that stopped responding. |
