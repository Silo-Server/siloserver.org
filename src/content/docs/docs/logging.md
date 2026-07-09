---
title: Logging and Telemetry
description: View, export, redact, and retain Silo logs.
---

Silo provides two built-in log destinations and an optional OpenTelemetry export path:

- **stderr** for `docker compose logs`, journald, or another process supervisor
- **Admin > Logs** through Silo's operational-log (`opslog`) database pipeline
- **OTLP** for an external collector or observability backend when explicitly enabled

OpenTelemetry export is default-off. Without OpenTelemetry configuration, Silo continues to use stderr and `opslog` only.

Some database connection, migration, and startup-tuning messages are emitted before the runtime handlers are installed. These early-boot records go to stderr only, even when OTLP export is enabled, and do not appear under Admin > Logs.

## Viewing logs

For the default Docker Compose deployment, follow the live stderr stream with:

```sh
docker compose logs --follow --timestamps silo
```

Use Admin > Logs to search retained runtime records by message text, request ID, component, or playback-session ID. Admin Settings > Log Retention controls how long this database-backed history is kept.

## Log controls

| Setting | Effect | Default | Applying changes |
| --- | --- | --- | --- |
| `server.log_level` | Minimum level for stderr and OTLP export. Accepts `debug`, `info`, `warn`, or `error`. | `info` | live reload |
| `server.log_format` | stderr format. Use `text` or `json`; this does not change OTLP encoding. | `text` | restart required |
| `server.log_quiet` | Comma-separated message prefixes to suppress from stderr and OTLP, such as `metadata,scanner`. | empty | live reload |
| `opslog.capture_level` | Minimum level stored by `opslog` and shown under Admin > Logs. | `info` | restart required |

`server.log_level` and `opslog.capture_level` are separate thresholds. This lets an operator keep a different amount of local searchable history than is sent to the console and collector. Quiet-prefix filtering applies to stderr and OTLP; `opslog` uses its own capture threshold.

## OpenTelemetry export

Telemetry turns on when either `SILO_OTEL_ENABLED` is truthy or `OTEL_EXPORTER_OTLP_ENDPOINT` is set.

Signal-specific endpoint variables such as `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` do not enable telemetry by themselves. Setting `SILO_OTEL_ENABLED` to a false value also does not override a configured generic endpoint; leave both enablement inputs unset to keep telemetry off.

| Variable | Purpose | Default |
| --- | --- | --- |
| `SILO_OTEL_ENABLED` | Explicit enable flag. Truthy values are `1`, `true`, `yes`, and `on`. | off |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector or vendor endpoint. Setting it also enables telemetry. | unset |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Exporter protocol: `grpc` or `http/protobuf`. | `grpc` |
| `OTEL_EXPORTER_OTLP_TRACES_PROTOCOL` | Optional trace-specific protocol override. | generic protocol |
| `OTEL_EXPORTER_OTLP_LOGS_PROTOCOL` | Optional log-specific protocol override. | generic protocol |
| `OTEL_SERVICE_NAME` | OpenTelemetry `service.name` resource attribute. | `silo-server` |
| `OTEL_SERVICE_VERSION` | OpenTelemetry `service.version` resource attribute. | unset |
| `OTEL_TRACES_SAMPLER` | `always_on`, `always_off`, `traceidratio`, `parentbased_always_on`, `parentbased_always_off`, or `parentbased_traceidratio`. Unsupported values fall back to the default. | `parentbased_traceidratio` |
| `OTEL_TRACES_SAMPLER_ARG` | Sampling ratio for ratio-based samplers. Invalid values use the default; values above `1` are clamped to `1`. | `1.0` |

Silo also honors the standard resource and exporter environment variables read by the OpenTelemetry SDK, including `OTEL_RESOURCE_ATTRIBUTES`, headers, TLS options, and per-signal endpoints. The Silo node identity is exported as `service.instance.id`, allowing multiple nodes to share one `service.name` while remaining distinguishable in the backend. Silo resolves that identity from `SILO_NODE_NAME`, then `NODE_NAME`, then the hostname.

Setting only `SILO_OTEL_ENABLED` uses the SDK's default local endpoint, which is usually not useful inside Docker. Configure `OTEL_EXPORTER_OTLP_ENDPOINT` for normal deployments; the generic endpoint enables telemetry without also setting the Silo flag.

### Local Collector example

Add this Compose override beside the existing deployment:

```yaml title="docker-compose.override.yml"
services:
  otel-collector:
    image: otel/opentelemetry-collector:latest
    command: ["--config=/etc/otelcol/config.yaml"]
    volumes:
      - ./otelcol.yaml:/etc/otelcol/config.yaml:ro

  silo:
    environment:
      SILO_OTEL_ENABLED: "1"
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4317
```

Use this minimal Collector configuration:

```yaml title="otelcol.yaml"
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  debug:
    verbosity: detailed

service:
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [debug]
    traces:
      receivers: [otlp]
      exporters: [debug]
```

Recreate the services after changing the environment, then watch the Collector output:

```sh
docker compose up -d --force-recreate silo otel-collector
docker compose logs --follow --timestamps otel-collector
```

The `http://` scheme is required for the plaintext Collector in this example. The debug exporter only prints received data and does not retain it. Pin the Collector image to a release tag and replace the debug exporter with a durable backend before using this setup in production.

For a secured collector or vendor endpoint, use its HTTPS endpoint and configure the standard OTLP certificate, client-certificate, header, or authentication environment variables it requires.

### Failure behavior

OpenTelemetry setup and export are best-effort. An unreachable collector does not delay or crash startup. Unsupported sampler and protocol values fall back to documented defaults. Exporter setup errors are reported to stderr; when telemetry setup returns an error, Silo disables both OTLP signals and continues running. Runtime export failures do not interrupt the stderr or `opslog` paths, but buffered telemetry is held only in process memory and can be lost.

### Tracing and metrics

The current implementation installs an OTLP trace provider and W3C trace-context propagation, but it does not yet create detailed spans for HTTP requests, PostgreSQL, Redis, plugins, scanning, or playback. A working collector may therefore receive logs without a useful request trace tree.

Metrics remain on the Prometheus `/metrics` endpoint. Silo does not install an OpenTelemetry meter provider.

## Redaction

Silo masks secret-keyed structured attributes before they reach stderr, OTLP, or `opslog`. Key matching is case-insensitive and substring-based. Keys containing `password`, `secret`, `token`, `api_key`, `apikey`, `authorization`, or `cookie` are emitted as `[REDACTED]`. This also covers attributes attached to a logger, nested groups, and secret-named group trees.

:::caution
Redaction is key-based, not value-based. Silo does not scan free-text messages or values stored under unrelated keys, so avoid logging secrets in message text or under generic names such as `value` or `message`. Review log excerpts before sharing them publicly.

Redaction applies only to records that pass through Silo's structured logger. Early-boot output, plugin process output, and third-party output that bypasses that handler chain must be reviewed separately.
:::

## Retention and rotation

Silo does not write or rotate its own log files. Retention belongs to the system that owns each destination:

- **Docker stderr:** configure the container runtime's log driver to limit local disk use. These logs are tied to the container and are not the durable history to rely on across container replacement.
- **OTLP:** configure retention in the collector or backend. This is the durable, searchable path for history outside Silo, for example Loki for logs and Tempo for traces.
- **Admin > Logs:** Silo stores operational logs in PostgreSQL and prunes them according to Admin Settings > Log Retention, including global and per-component limits.

To rotate Docker's default `json-file` logs, add this to the `silo` service:

```yaml title="docker-compose.override.yml"
services:
  silo:
    logging:
      driver: json-file
      options:
        max-size: "50m"
        max-file: "5"
```

## Source notes

- OpenTelemetry operator behavior and limitations: [`observability.md`](https://github.com/Silo-Server/silo-server/blob/main/docs/architecture/observability.md#L12-L205).
- Telemetry environment parsing: [`config.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/telemetry/config.go#L91-L168).
- Telemetry bootstrap and failure behavior: [`telemetry.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/telemetry/telemetry.go#L43-L118) and [`main.go`](https://github.com/Silo-Server/silo-server/blob/main/cmd/silo/main.go#L555-L593).
- Runtime log settings and reload behavior: [`db_loader.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/config/db_loader.go#L153-L158), [`restart_keys.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/config/restart_keys.go#L15-L21), and [`main.go`](https://github.com/Silo-Server/silo-server/blob/main/cmd/silo/main.go#L693-L698).
- Secret redaction across log sinks: [`redact.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/logredact/redact.go#L18-L160) and [`handler.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/opslog/handler.go#L178-L193).
