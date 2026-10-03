---
slug: docs/profiling
title: Collect a performance profile
description: Turn on Silo's private profiling listener, capture the profile a maintainer asks for, and send it privately.
---

When a maintainer asks for a profile, turn on Silo's profiling listener, capture the profile they ask for with the `silo-profile` helper, and send the files privately. Each capture covers one Silo process: the main server, or one proxy or transcode node.

## Turn on the profiling listener

Add the listener address to `.env`, then recreate the container with `docker compose up -d`. Recreating the container interrupts playback.

```dotenv
SILO_DEBUG_LISTEN=127.0.0.1:6060
```

The listener is off by default. It works the same way on the main server and on proxy and transcode nodes.

- Use a literal loopback address, IPv4 or IPv6, such as `127.0.0.1:6060` or `[::1]:6060`. Silo rejects hostnames, wildcard addresses such as `0.0.0.0`, other addresses, and port `0`. A value it rejects stops Silo from starting, and the container log shows `local profiling configuration:` followed by the reason.
- If the port is already in use, Silo keeps running without the listener and logs `local profiling listener unavailable; continuing server startup`. With [metrics](/docs/monitoring) turned on, `silo_debug_listener_available` is `1` while the listener is up, and `silo_debug_listener_failures_total` counts failures.

Remove the line and recreate the container again when the investigation is over.

## Keep it private

- Never publish the profiling port through Docker `ports`, a reverse proxy, an ingress, or a load balancer. Silo's web and Jellyfin ports never serve profiles.
- Loopback doesn't keep out other processes in the same network namespace. Anything else running in the same container or pod can connect.
- Use `127.0.0.1` in commands, not `localhost`. The listener only accepts a literal loopback address as the request's host, and answers anything else with `profiling requires a local request`.
- Profiles contain function names, file paths, and stack traces. Never attach them to a public issue.

## Get the helper

The helper is [`scripts/silo-profile`](https://github.com/Silo-Server/silo-server/blob/main/scripts/silo-profile) in the server repository. It isn't in the image. From the folder that holds your Compose file, make a private folder and download the helper into it:

```sh
mkdir -m 700 incident
curl -fsSL -o incident/silo-profile https://raw.githubusercontent.com/Silo-Server/silo-server/main/scripts/silo-profile
```

The helper needs Node.js, which the Silo image already includes, so the steps below run it inside the container.

The helper saves each capture to a file only you can read. It stops at 128 MiB (change this with `--max-bytes`), gives up after 75 seconds, and never overwrites an existing file. Beside each capture it writes a `.json` file with the build, Go version, instance, start and end times, size, and checksum. `"valid": true` means the capture finished. A capture that went over the size limit, was interrupted, or failed keeps a `.partial` name and has `"valid": false`. Don't send it as a complete capture.

## Capture a profile with Docker

The listener is on the container's own loopback address, so a published port can't reach it. Run the helper inside the container and copy the results out. From the folder that holds your Compose file:

1. Check that the listener is up. The response lists the profiles you can take.

   ```sh
   docker compose exec silo curl --fail http://127.0.0.1:6060/debug/pprof/
   ```

2. Make a private folder in the container:

   ```sh
   docker compose exec silo sh -c 'umask 077; mkdir -p /tmp/silo-incident'
   ```

3. Run the capture the maintainer asked for. This one takes a heap profile:

   ```sh
   docker compose exec -T silo node - --profile heap --gc 1 --output /tmp/silo-incident/heap.pprof < incident/silo-profile
   ```

   The helper prints the file name when the capture finishes. For other profiles, change the options after `node -`:

   ```text
   --profile cpu --seconds 30 --output /tmp/silo-incident/cpu.pprof
   --profile allocs --seconds 30 --output /tmp/silo-incident/allocs.pprof
   --profile goroutine --output /tmp/silo-incident/goroutine.pprof
   --profile trace --seconds 1 --max-bytes 67108864 --output /tmp/silo-incident/runtime.trace
   ```

4. Copy the captures and the Silo program out of the container, and note the image version:

   ```sh
   docker compose cp silo:/tmp/silo-incident/. incident/
   docker compose cp silo:/usr/local/bin/silo incident/silo
   docker compose images silo
   ```

   Maintainers need the exact `silo` program that produced a capture to read it.

Each process runs one capture at a time. Starting another while one is running fails with `silo-profile: profiling returned HTTP 429`.

For a proxy or transcode node, run the same commands on the node's host, using the node's Compose service name in place of `silo`.

## Choose a profile

Take the profile the maintainer asks for.

| Profile | Shows | Duration |
| --- | --- | --- |
| `cpu` | Where Silo's Go code spends CPU time | `--seconds`, default 30, up to 60 |
| `heap` | Live Go memory, sampled. `--gc 1` runs garbage collection first | Immediate, or the change over `--seconds`, up to 60 |
| `allocs` | Memory allocations, including memory already freed | Immediate, or the change over `--seconds`, up to 60 |
| `goroutine` | What each goroutine is doing, and whether their number keeps growing | Immediate, or the change over `--seconds`, up to 60 |
| `threadcreate` | What created operating system threads | Immediate, or the change over `--seconds`, up to 60 |
| `block` | Time spent waiting on other goroutines | Needs [contention sampling](#turn-on-contention-profiles) |
| `mutex` | Time spent waiting for locks | Needs [contention sampling](#turn-on-contention-profiles) |
| `trace` | Scheduler, garbage collection, and goroutine timing | `--seconds`, default 1, up to 5 |

A heap profile covers only Go memory. It doesn't include FFmpeg, plugins, native libraries, the file cache, or GPU memory, so compare it with the process's RSS and the container's memory.

### Turn on contention profiles

`block` and `mutex` profiles need sampling turned on when Silo starts. Add these next to `SILO_DEBUG_LISTEN` in `.env`, then recreate the container:

```dotenv
SILO_DEBUG_BLOCK_RATE=10000000
SILO_DEBUG_MUTEX_FRACTION=100
```

`SILO_DEBUG_BLOCK_RATE` accepts 1000000 to 1000000000, and `SILO_DEBUG_MUTEX_FRACTION` accepts 100 to 1000000. Both default to `0`, which turns that profile off, and both need `SILO_DEBUG_LISTEN`. A value outside its range stops Silo from starting.

While one is off, requesting its profile fails with `silo-profile: profiling returned HTTP 409`. That doesn't mean there's no contention. Set both back to `0` and recreate the container when the investigation is over.

## Other setups

On Kubernetes, forward one pod's listener to a loopback port on your machine, then run the helper there with Node.js:

```sh
kubectl port-forward --address 127.0.0.1 pod/POD 16060:6060
node incident/silo-profile --url http://127.0.0.1:16060 --profile heap --output incident/heap.pprof
```

If your container runtime can't forward to the pod's loopback address, use `kubectl exec` the way the Docker steps use `docker compose exec`.

For Silo running directly on a remote host, not in a container, forward the port over SSH with `ssh -N -L 127.0.0.1:16060:127.0.0.1:6060 HOST` and run the same `node` command. A container on that host has its own loopback address, so use the Docker steps for it.

## Send the captures

Send the capture files, their `.json` files, the `silo` program, and the image version to the maintainer who asked, the private way they ask for. Never attach them to a public issue. After the review, delete your `incident` folder and the copy in the container:

```sh
docker compose exec silo rm -rf /tmp/silo-incident
```
