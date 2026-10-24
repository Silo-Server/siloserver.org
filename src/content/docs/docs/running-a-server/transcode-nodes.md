---
slug: docs/transcode-nodes
title: Add and check transcode nodes
description: Add proxy and transcode nodes on other machines and check that playback uses them.
---

A single Silo server already streams and converts video itself. Add nodes when you want part of that work on other machines. Every node runs the same Silo image in a different mode and shares the main server's PostgreSQL, Redis, and encryption key.

A transcode node can also run as a [standalone worker](#run-a-standalone-transcode-worker), which needs only an HTTP or HTTPS connection to the main server and no media mounts or shared credentials.

## Choose a node type

| Type | Does | Use it when |
| --- | --- | --- |
| Transcode | Converts video for playback and prepared downloads, and reads audio for [subtitle sync](/docs/subtitle-providers#set-up-subtitle-sync) | The main server's CPU or GPU can't keep up, or another machine has a better GPU |
| Proxy | Delivers streams and downloads to clients | You want streams to leave from somewhere other than the main server, such as a host with more bandwidth |

Transcode nodes only talk to the main server and proxy nodes, so they need no public address. Clients connect to proxy nodes directly.

## Prepare the node

The server repository's [Compose file](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml) includes commented `silo-proxy` and `silo-transcode` examples. Use them as a starting point on the node's host. A node needs:

- `MODE=transcode` or `MODE=proxy`.
- `NODE_NAME`, the same name you give the node in Silo, and `NODE_URL`, the node's own address. Silo matches the running node to its entry by these values.
- The same `SECRET_KEY` as the main server, and `DATABASE_URL` and `REDIS_URL` pointing at the shared PostgreSQL and Redis. Use the same Redis [database number](/docs/configuration#external-postgresql-and-redis) as the main server. Behind [Redis Sentinel](/docs/configuration#redis-sentinel), use the main server's Sentinel URL, and let the node reach every Sentinel and Redis server.
- Enough PostgreSQL connections for every node. Each node opens up to 20 database connections of its own, but the main server only sizes PostgreSQL's connection limit for itself. In the main server's `.env`, raise `POSTGRES_TUNE_CONNECTIONS` as described in [PostgreSQL tuning](/docs/configuration#postgresql-tuning).
- The media mounted at the same container path the main server uses, such as `/mnt/media`.
- A plugin directory (`SILO_PLUGIN_CACHE_DIR`). A transcode node also needs the artwork directory and a writable transcode directory with plenty of free space.
- For GPU encoding on a transcode node, its own driver and device access, set up as in [Set up transcoding](/docs/playback).
- A clock that stays within 30 seconds of the main server and the other nodes, for example kept in sync with NTP. A node whose clock is further off refuses requests from the main server and proxy nodes, so work sent to it fails.

The examples publish the node on port 8082 (transcode) or 8083 (proxy). The default Compose file publishes PostgreSQL and Redis only on the main host's loopback address, so a node on another machine can't reach them until you change that. Keep PostgreSQL, Redis, and node ports on a trusted network.

Local artwork on the main server isn't shared with other hosts automatically. For several hosts, consider [S3 artwork storage](/docs/s3-storage).

## Add the node

Add the node in Silo, then start it.

1. Open **Admin > Playback > Nodes** and select **Add Transcode** or **Add Proxy**.
2. Enter a **Name** that matches the node's `NODE_NAME`.
3. Enter the **URL** the main server uses to reach the node, matching its `NODE_URL`. A private address is fine.
4. For a proxy node, enter a **Public URL** if clients should use a different address, such as a public hostname in front of the node. Leave it empty to give clients the **URL**, which then must be reachable from clients.
5. If the node shares a host or local network with other nodes, give them all the same **Group**, such as `rack-1`. Silo then keeps their streams inside the group; see [Groups](/docs/node-status#groups).
6. Optionally set **Max Transcodes** or **Max Streams** (and **Max Egress Bandwidth (Mbps)** for a proxy), then select **Save**.
7. Start the node with its Compose file.

Silo checks every node every 30 seconds. The node's state changes to **Healthy** once Silo can reach it, and a transcode node's **Acceleration** block shows the verified encoder, such as **VAAPI** or **SW**. Use the refresh button to check it right away. [Read node status](/docs/node-status) explains each reading.

Then play something that needs conversion, or from a client that uses the proxy. **Admin > Activity** shows the session, and the node's **Capacity** block shows the job. Test seeking and stopping as well.

## Run a standalone transcode worker

A standalone worker is a transcode node without media mounts, PostgreSQL, Redis, or `SECRET_KEY`. It reads each file it converts from the main server over HTTPS, or HTTP on a trusted network, converts it on its own CPU or GPU, and keeps the output on a local disk. Use one when a machine can't mount your media or shouldn't hold the main server's credentials. Apps keep using the main server's addresses, so they need no setup.

The worker proves who it is with a key it creates when you enroll it, so most of [Prepare the node](#prepare-the-node) doesn't apply. It needs:

- An address the main server can reach, and a direct route to the main server's address. That's the **Silo public URL** unless you enroll the worker with another.
- HTTPS both ways, with certificates valid for those exact addresses. Plain HTTP works only if you allow it when you enroll the worker. A worker enrolled for HTTPS never falls back to HTTP.
- A local directory for temporary output, with free space.
- For GPU encoding, its own driver and device access, set up as in [Set up transcoding](/docs/playback).
- A clock within 30 seconds of the main server's.

Run the worker under an account used only for it. While the worker converts a file, FFmpeg's command line holds a local link to that file, which other accounts on the host that can list processes may see.

### Enroll the worker

1. In **Admin > Playback > Nodes**, select **Add Transcode**. Enter a **Name**, and as the **URL** the worker's address as the main server reaches it, such as `https://worker1.example.com` or `http://192.168.1.20:8097`. Use only the scheme, host, and port, with no path. Select **Save**.
2. Find the new node's ID with `GET /api/v2/admin/nodes` in the [admin API](/docs/api).
3. On the main server, create an enrollment ticket for that node and copy it out of the container:

   ```sh
   docker compose exec silo silo worker-enrollment --node-id 3 --out /tmp/worker-3.ticket
   docker compose cp silo:/tmp/worker-3.ticket ./worker-3.ticket
   ```

   The ticket points the worker at the **Silo public URL**. Add `--core-url https://silo.example.com` to use another address, and `--allow-http` if either address uses HTTP. A ticket works once and expires after five minutes.
4. Copy the ticket to the worker's host, for example to `/opt/silo-worker/worker-3.ticket`, and make it readable only by its owner with `chmod 600`. The worker refuses a ticket other accounts can read.
5. On the worker's host, redeem the ticket:

   ```sh
   docker run --rm -v /opt/silo-worker:/var/lib/silo-worker \
     ghcr.io/silo-server/silo-server:latest worker-enroll \
     --ticket /var/lib/silo-worker/worker-3.ticket \
     --binding /var/lib/silo-worker/binding.json
   ```

   This creates `binding.json`, which holds the worker's private key. Keep it readable only by the worker's account, and delete the used ticket. If enrollment fails, create a new ticket and try again.

### Start the worker

Run the worker with the binding file and a scratch directory. A Compose file on the worker's host can look like this:

```yaml
services:
  silo-worker:
    image: ghcr.io/silo-server/silo-server:latest
    restart: unless-stopped
    command: ["worker", "--binding", "/var/lib/silo-worker/binding.json", "--scratch", "/var/lib/silo-worker/scratch"]
    environment:
      PORT: "8097" # the port the image's health check uses
    ports:
      - "8097:8097"
    volumes:
      - /opt/silo-worker:/var/lib/silo-worker
    # For GPU encoding:
    # devices:
    #   - /dev/dri:/dev/dri
```

Leave out the media library, `.env`, and any database, Redis, or storage credentials. The worker refuses to start if `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, or `JWT_SECRET` is set.

Once it's running, Silo checks it like any other node, and it shows **Healthy** when the main server can reach it. Play something that needs conversion to test it.

The worker's encoder, directory, and limits come from these options, not from the node's settings in Silo:

| Option | Default | Sets |
| --- | --- | --- |
| `--binding` | None, required | The binding file from enrollment |
| `--scratch` | None, required | The local directory for temporary output, as an absolute path |
| `--listen` | `:8097` | The address and port the worker listens on |
| `--hw-accel` | `auto` | The encoder, with the same choices as **Hardware Acceleration** |
| `--hw-device` | None | The GPU render device, such as `/dev/dri/renderD128` |
| `--ffmpeg`, `--ffprobe` | The image's own | Paths to other FFmpeg and FFprobe programs |
| `--max-jobs` | `0`, no limit | How many conversions and file checks run at once |
| `--max-source-readers` | `32` | How many files the worker reads from the main server at once, from 1 to 4096 |
| `--max-inputs` | `128` | How many files the worker keeps open, from 1 to 65536 |

Drain the worker in **Admin > Playback > Nodes** before you stop it. A drained worker takes no new work and keeps serving its current streams. Unlike other transcode nodes, it doesn't drain on its own when stopped, and streams on it end. It also stops its work when it loses contact with the main server. After a restart, playback resumes from the main server's copy of each session.

### Reach the main server over HTTPS

For a worker outside your local network, put the main server behind HTTPS, for example with a [reverse proxy](/docs/reverse-proxy). The proxy must pass the original `Host` header on to Silo. The worker signs each request for the address it enrolled with, so a proxy that changes `Host` to an internal name makes Silo reject the worker's requests with `401` errors. Caddy keeps the header by default.

The worker doesn't follow redirects or use proxy settings such as `HTTPS_PROXY`, so the address must reach Silo directly. If your certificate comes from your own certificate authority, give the worker that authority's certificate, for example by mounting it into the container and setting `SSL_CERT_FILE` to its path.

The worker's file reads cross this link, so a slow or distant connection slows its start-up and seeking.

### Several Silo servers behind one address

If a load balancer spreads requests across several Silo servers, set `SILO_WORKER_SOURCE_URL` on each to that server's own direct address, different from the shared one, and restart it. A worker's file reads must reach the server that handed out the file. Without this setting, only that server can answer them, and the others return a temporary error. While that server is down or restarting, the worker can't read the files it handed out.

Each server sends at most 32 files to workers at once. To change that, set `SILO_WORKER_SOURCE_MAX_READERS`, from 1 to 4096. Ordinary playback, replacement streams, and the reads Silo makes to index a file all count toward it.

## Route playback to nodes

**Routing** on **Admin > Playback > Nodes** decides where remuxing and transcoding run and which machine sends each stream to the client. Choose a **Routing preset** and save. **Silo Defaults** prefers transcode nodes for conversion and proxy nodes for delivery, and falls back to the main server. **GPU offload** keeps direct play and remuxing on the main server and sends video transcodes to nodes. **Central egress** runs conversion on nodes but sends every stream from the main server. To set the five routes one by one, open **Advanced** under the presets. A route ending in "only" never falls back, so that kind of playback fails while no healthy node of the needed type is available.

## Convert to HEVC on nodes

With **Allow HEVC encoding** on (see [Allow 4K and HEVC output](/docs/playback#allow-4k-and-hevc-output)), Silo checks each machine's encoders separately, so HEVC support on the main server doesn't mean a node has it. HEVC is used only when a machine that may convert video under **Routing** can encode it, and HEVC jobs go only to nodes that can. When none can, devices get H.264.

A node whose GPU can't encode HEVC encodes it on the CPU, even though its **Acceleration** block shows the GPU. After an HEVC stream starts on a node, check the session in **Admin > Activity**: **SW** means that node's CPU is encoding.

## Store prepared downloads on a node

A transcode node keeps the [downloads it prepares](/docs/download-storage) in `download-artifacts` inside its transcode directory, unless you give it another directory. That puts them on the same disk as live transcodes, so they count toward the 95% at which Silo [skips the node](#if-work-does-not-reach-the-node) for new streams. To keep prepared downloads apart, mount a separate volume on the node and point it there:

1. Open **Admin > Downloads > Prepared Files**. On the node's card, select **Edit location**.
2. Enter the path inside the node's container in **Prepared file directory**.
3. Under **Storage budget**, keep **Default** to use **Default storage budget per location**, choose **Custom** and enter a size in GB, or choose **None** to rely on the disk ceiling only.
4. Select **Save**. If you changed the directory, restart the node; it uses the new directory once it restarts.

Changing the directory doesn't move files. Files that devices are still waiting for are prepared again in the new directory, and cached files are dropped. Old files stay in the old directory until you delete them.

If **Prepared file directory** is set in **Admin > Downloads > Settings**, a node with a blank directory uses that path, so it must exist on the node too. A card that reads **Shares disk with transcode scratch** still has its prepared files on the transcode disk.

## If work does not reach the node

Check that the node is enabled, **Healthy**, below its limit, and can read the file at the same path. A node can show **Healthy** and still refuse work when its clock is more than 30 seconds off, so check that its clock agrees with the main server's. For a grouped node, check that every enabled node in its [group](/docs/node-status#groups) is **Healthy**.

A transcode node whose transcode directory is 95% full is skipped while another node has room. If every transcode node is that full, Silo uses one anyway, and streams on it can fail once the disk fills. Silo never skips a node whose disk use it can't read.

To see which case you're in, filter **Admin > Logs > Server Log** by the `nodepool` component. `transcode scratch guard ignored: every eligible node is over the scratch threshold` means new sessions are going to a nearly full disk. To fix it, enlarge the node's transcode volume or clear old files from its transcode directory.

## Maintain a node

To stop or upgrade a transcode node without cutting playback, drain it first:

1. In **Admin > Playback > Nodes**, select the pause icon in the node's header. Silo sends the node no new work, and streams already on it keep playing. Its state changes to **Draining**, and the line under its address counts the work left, such as **Draining · 2 transcodes left**.
2. Wait for **Drained · safe to stop**. Streams play until they end, so this can take as long as the longest one left on the node.
3. Stop or upgrade the node. While it's stopped, it shows **Unhealthy**, and if it's in a [group](/docs/node-status#groups), Silo sends that group no new transcodes until the node is back.
4. Once the node is running again, select the play icon in its header to resume it. It stays drained after a restart until you resume it.

The [admin API](/docs/api) has the same actions: `POST /api/v2/admin/nodes/{id}/drain` and `POST /api/v2/admin/nodes/{id}/resume`.

You can also stop a transcode node directly, and it drains on its own. It takes no new work and keeps serving its streams until they end or `SILO_NODE_DRAIN_TIMEOUT` passes, then stops and ends any streams still on it. The timeout is `10m` by default. Set it on the node as a duration such as `15m` or a number of seconds, or set it to `0` to turn the drain off. A second stop signal stops the node at once. Docker kills a container 10 seconds after asking it to stop, so set the node's `stop_grace_period` to the timeout plus a minute, as in [Distributed and external services](/docs/docker#distributed-and-external-services).

Proxy nodes don't drain. Turn a proxy node's switch off to stop new work while its current streams finish.

After changing a node's driver or devices, use its re-probe button. Silo refuses it while the node is transcoding, so drain the node first and resume it once the re-probe finishes. See [Set up transcoding](/docs/playback#after-a-driver-or-device-change).

To change a transcode node's encoder, select the pencil in the node's header, set **Hardware Acceleration** or **GPU Devices**, and select **Save**. New transcodes on the node use the change within a minute, and running sessions keep their old settings.

To make a node re-read its configuration straight away, use force reload in the [admin API](/docs/api): `POST /api/v2/admin/nodes/{id}/force-reload` for one node, or `POST /api/v2/admin/nodes/force-reload` for every enabled node. There is no button for it. On a transcode node it also ends every live playback session.

Update all nodes together with the main server when the release notes say so. If you update one machine at a time, update the transcode nodes first, then the proxy nodes, then the main server. Some releases change how the main server and proxy nodes talk to other nodes, and a node that hasn't been updated yet can't answer the new requests. During the [1.0 update](/docs/updates#moving-from-alpha-to-10), don't mix alpha and 1.0 nodes.

A transcode node on an older version than the main server can't send subtitles from inside a video file along with the converted video. Silo then converts that playback on the main server or an updated node instead. Only if **Routing** leaves no such machine does an older node convert it, and the apps then download the subtitle separately, which can take minutes on network storage.
