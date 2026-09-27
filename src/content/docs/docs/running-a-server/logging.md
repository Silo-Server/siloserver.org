---
slug: docs/logging
title: Logs and monitoring
description: Find errors, limit retained logs, and add private monitoring when needed.
---

Use **Admin > Logs** for searchable server logs. Use the container logs when Silo fails before the web app is available.

## View logs

From the directory that holds your Compose file:

```sh
docker compose logs --tail 100 --timestamps silo
```

Add `--follow` to watch new lines while you reproduce a problem. Press Ctrl+C to stop watching; Silo keeps running.

In **Admin > Logs**, search around the time of the failure by message, component, request ID, or playback session ID. Early database and migration messages can appear only in the container logs, because Silo writes them before the admin log starts collecting.

## Log settings

In **Admin > Settings > General**, under **Logging**:

| Setting | Effect | Takes effect |
| --- | --- | --- |
| **Log level** | Lowest level written to the container log and to OpenTelemetry export | Immediately |
| **Quiet log prefixes** (under **Advanced**) | Drops lines that start with any of these words | Immediately |

Set **Log level** to **Debug** only while you collect a short sample, then set it back.

**Admin > Logs** has its own threshold and keeps **Info** and above by default, so **Debug** doesn't add lines there. Two stored settings have no control in the web app. You can change them through the [admin API](/docs/api), and both need a restart:

- `opslog.capture_level`: the lowest level kept in **Admin > Logs** (`debug`, `info`, `warn`, or `error`)
- `server.log_format`: `text` or `json` in the container log

## Redaction

Silo masks structured fields with secret-like names, such as passwords, tokens, authorization headers, and cookies. It cannot recognize every secret inside free-form message text.

Read an excerpt before sharing it. Remove account details, private paths or titles, and credentials. Plugin output needs the same review. [Report a problem](/docs/report-a-problem) explains what to include.

## Retention

Set how long **Admin > Logs** keeps entries in **Admin > Settings > Storage & Database**, under **Logs**: **Delete log entries older than**, **Maximum log entries**, and **Maximum log size**.

Docker keeps container logs separately. For Docker's `json-file` driver, a Compose override can cap them:

```yaml
services:
  silo:
    logging:
      driver: json-file
      options:
        max-size: "50m"
        max-file: "5"
```

Add this to your existing override if you have one. Applying it recreates the container, which interrupts playback.

## Metrics

Prometheus metrics are off on the main server until you set `SILO_METRICS_LISTEN` to a listen address, for example `SILO_METRICS_LISTEN=127.0.0.1:9091`. The `/metrics` route has no authentication, so keep it on a private network and don't publish or proxy it. Inside Docker, `127.0.0.1` is the container itself, so your collector needs a private route to that address.

Proxy and transcode nodes serve `/metrics` on their own port without authentication. Keep those ports private too.

For health and readiness checks, see [Check server health](/docs/server-health).

## OpenTelemetry export

To send logs to an existing OpenTelemetry collector, add its endpoint and protocol to `.env`, then recreate the container with `docker compose up -d`:

```dotenv
OTEL_EXPORTER_OTLP_ENDPOINT=https://collector.example.com
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
```

Replace the example with your collector's address and configure the authentication and certificates it needs. Setting `OTEL_EXPORTER_OTLP_ENDPOINT` turns export on. Setting only the per-signal endpoint variables does not; set `SILO_OTEL_ENABLED=true` in that case. Inside Docker, `localhost` does not reach a collector in another container, so use a hostname the Silo container can reach.

Export is best effort. If the collector fails, the container log and **Admin > Logs** keep working, but buffered export data can be lost. Keep history you need at the collector.
