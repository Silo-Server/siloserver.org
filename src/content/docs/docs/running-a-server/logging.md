---
slug: docs/logging
title: Logs and monitoring
description: Find errors, limit retained logs, and add private monitoring when needed.
---

Use **Admin > Logs** for searchable runtime records. Use container logs when Silo fails before the web app becomes available.

## Viewing logs

From the default Compose directory:

```sh
docker compose logs --tail 100 --timestamps silo
```

Add `--follow` to watch new records as you reproduce a problem; press Ctrl+C to stop watching. This does not stop Silo.

In **Admin > Logs**, search around the failure time by message, component, request ID, or playback-session ID. Early database and migration messages can appear only in container output, before the admin log pipeline starts.

## Log controls

Under **Admin > Settings > General**, adjust the log level only as needed. Return to the normal level after collecting a short diagnostic sample.

| Setting | Effect | Change takes effect |
| --- | --- | --- |
| `server.log_level` | stderr and OTLP minimum level | Live |
| `server.log_format` | Text or JSON on stderr | After restart |
| `server.log_quiet` | Suppressed message prefixes on stderr and OTLP | Live |
| `opslog.capture_level` | Minimum level retained in Admin Logs | After restart |

The admin log threshold is separate from the console threshold. Raising one does not necessarily increase the other.

## Redaction

Silo masks secret-named structured fields, including password, token, authorization, and cookie attributes. It does not recognize every secret inside arbitrary message text.

Read an excerpt before sharing it. Remove account details, private paths or titles, and any credentials. Early-boot output and third-party/plugin output need the same review. Follow [Report a problem](/docs/report-a-problem) for a useful, safe report.

## Retention and rotation

Configure database-backed log retention in **Admin > Settings > Storage & Database**, under **Logs**. Container-log retention belongs to Docker, not to that setting.

For Docker's `json-file` driver, a Compose override can cap local logs:

```yaml
services:
  silo:
    logging:
      driver: json-file
      options:
        max-size: "50m"
        max-file: "5"
```

Merge this into an existing override rather than replacing it. Validate the configuration and apply it during a quiet period; replacing the container interrupts playback.

## Health and metrics

The application exposes `/api/v1/health` and `/api/v1/ready`. [Readiness can be degraded](/docs/server-health#check-startup) even with HTTP 200.

Prometheus metrics use a separate, opt-in listener. Set `SILO_METRICS_LISTEN` only when you have a private collector. Its `/metrics` route has no application authentication; do not publish or reverse-proxy it to the internet. The normal application listener does not serve metrics.

For a local process, `SILO_METRICS_LISTEN=127.0.0.1:9091` restricts the listener to that machine. Inside Docker, loopback belongs to the container; your collector must have an intentional private route to it.

## OpenTelemetry export

External export is optional. Leave `SILO_OTEL_ENABLED` and `OTEL_EXPORTER_OTLP_ENDPOINT` unset to keep it off.

To send logs to an existing collector, set its endpoint and transport in the Silo environment, then recreate the container:

```dotenv
OTEL_EXPORTER_OTLP_ENDPOINT=https://collector.example.com
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
```

Replace the example with your collector's address and configure its required authentication and certificates. Setting the generic endpoint turns export on even if `SILO_OTEL_ENABLED` is false. Per-signal endpoint variables alone do not turn it on.

### Local Collector example

Use your collector's own deployment guide for a local receiver. Give the Silo container a reachable private hostname; `localhost` inside Silo does not refer to a collector in another container. Keep authentication material out of shared Compose snippets.

### Failure behavior

Export is best-effort. Collector failure does not replace or disable the built-in stderr and admin log destinations. Buffered export data can be lost, so use collector-side retention for history you need to keep.

### Tracing and metrics

The current telemetry setup does not provide a complete request trace through the database, providers, scanning, and playback. Receiving logs at the collector does not prove those detailed spans exist. Prometheus metrics remain on their separate listener.
