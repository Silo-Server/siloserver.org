---
slug: docs/transcode-nodes
title: Add and check transcode nodes
description: Add proxy and transcode nodes on other machines and check that playback uses them.
---

A single Silo server already streams and converts video itself. Add nodes when you want part of that work on other machines. Every node runs the same Silo image in a different mode. A proxy node shares the main server's PostgreSQL, Redis, and encryption key. A transcode node connects only to the main server, with a key the main server issues for it.

## Choose a node type

| Type | Does | Use it when |
| --- | --- | --- |
| Transcode | Converts video for playback and prepared downloads, and reads audio for [subtitle sync](/docs/subtitle-providers#set-up-subtitle-sync) | The main server's CPU or GPU can't keep up, or another machine has a better GPU |
| Proxy | Delivers streams and downloads to clients | You want streams to leave from somewhere other than the main server, such as a host with more bandwidth |

Transcode nodes only talk to the main server and proxy nodes, so they need no public address, but each one must be able to reach the main server. Clients connect to proxy nodes directly.

## Prepare the node

The server repository's [Compose file](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml) includes commented `silo-proxy` and `silo-transcode` examples. Use them as a starting point on the node's host.

A transcode node needs:

- `MODE=transcode`.
- `SILO_CORE_URL`, an address of the main server that the node can reach, and `SILO_NODE_KEY`, the key Silo shows when you [add the node](#add-the-node). With several main servers, use their load-balanced address rather than one server's. The node takes everything else from the main server, including its encoder, transcode directory setting, and log level.
- A writable transcode directory with free space.
- With **Source Access** set to **Local library mount**, the default, the media mounted at the same container path the main server uses, such as `/mnt/media`. A node set to **Read from this server over HTTP** needs no media mount; see [Choose how a node reads media](#choose-how-a-node-reads-media).
- For GPU encoding, its own driver and device access, set up as in [Set up transcoding](/docs/playback).

A transcode node doesn't use `NODE_NAME`, `NODE_URL`, `SECRET_KEY`, `DATABASE_URL`, or `REDIS_URL`, and needs no plugin or artwork directory. If a shared `.env` sets any of those variables, the node ignores them and logs a warning.

A proxy node needs:

- `MODE=proxy`.
- `NODE_NAME`, the same name you give the node in Silo, and `NODE_URL`, the node's own address. Silo matches the running node to its entry by these values.
- The same `SECRET_KEY` as the main server, and `DATABASE_URL` and `REDIS_URL` pointing at the shared PostgreSQL and Redis. Use the same Redis [database number](/docs/configuration#external-postgresql-and-redis) as the main server. Behind [Redis Sentinel](/docs/configuration#redis-sentinel), use the main server's Sentinel URL, and let the node reach every Sentinel and Redis server.
- Enough PostgreSQL connections. Each proxy node opens up to 20 database connections of its own, but the main server only sizes PostgreSQL's connection limit for itself. In the main server's `.env`, raise `POSTGRES_TUNE_CONNECTIONS` as described in [PostgreSQL tuning](/docs/configuration#postgresql-tuning).
- The media mounted at the same container path the main server uses, and a plugin directory (`SILO_PLUGIN_CACHE_DIR`).

Every node also needs a clock that stays within 30 seconds of the main server and the other nodes, for example kept in sync with NTP. A node whose clock is further off refuses requests from the main server and proxy nodes, so work sent to it fails.

The examples publish the node on port 8082 (transcode) or 8083 (proxy). The default Compose file publishes PostgreSQL and Redis only on the main host's loopback address, so a proxy node on another machine can't reach them until you change that. Keep PostgreSQL, Redis, and node ports on a trusted network.

If a reverse proxy sits between a transcode node and the main server, it must pass `/api/internal/nodes/` through to Silo. The node reads its configuration and sends its reports and logs there, and a node set to **Read from this server over HTTP** streams whole media files through it, so turn off response buffering for that path and allow timeouts as long as a transcode.

Local artwork on the main server isn't shared with other hosts automatically. For several hosts, consider [S3 artwork storage](/docs/s3-storage).

## Add the node

Add the node in Silo, then start it.

1. Open **Admin > Playback > Nodes** and select **Add Transcode** or **Add Proxy**.
2. Enter a **Name**. For a proxy node, it must match the node's `NODE_NAME`.
3. Enter the **URL** the main server uses to reach the node. A private address is fine. For a proxy node, it must match the node's `NODE_URL`.
4. For a proxy node, enter a **Public URL** if clients should use a different address, such as a public hostname in front of the node. Leave it empty to give clients the **URL**, which then must be reachable from clients.
5. For a transcode node, choose its **Source Access**: **Local library mount** if the node mounts the media, or **Read from this server over HTTP** if it doesn't. See [Choose how a node reads media](#choose-how-a-node-reads-media).
6. If the node shares a host or local network with other nodes, give them all the same **Group**, such as `rack-1`. Silo then keeps their streams inside the group; see [Groups](/docs/node-status#groups).
7. Optionally set **Max Transcodes** or **Max Streams** (and **Max Egress Bandwidth (Mbps)** for a proxy), then select **Save**.
8. For a transcode node, select **Issue key** under the node's address. The **Key for** dialog shows the node's key and the two lines the node starts with.
9. Select **Copy environment**, add the lines to the node's environment, then select **I've saved it**. Silo doesn't show the key again.
10. Start the node with its Compose file.

The dialog fills in `SILO_CORE_URL` from the server's public URL, or from the address you opened the page at, so change it if the node reaches the main server at another address. The `silo-transcode` example sets `SILO_CORE_URL` to `http://silo:8080`, the main server on the same Compose network, and reads `SILO_NODE_KEY` from `.env`.

A transcode node without a key stays in the list and Silo keeps checking it, but it gets no work. The line under its address reads **No key: this node takes no work** until you issue one.

Silo checks every node every 30 seconds. The node's state changes to **Healthy** once Silo can reach it, and a transcode node's **Acceleration** block shows the verified encoder, such as **VAAPI** or **SW**. Use the refresh button to check it right away. A transcode node starts answering only after it has read its configuration from the main server with its key, so a **Healthy** transcode node has a working key. **Key issued** only means that a key exists. [Read node status](/docs/node-status) explains each reading.

Then play something that needs conversion, or from a client that uses the proxy. **Admin > Activity** shows the session, and the node's **Capacity** block shows the job. Test seeking and stopping as well.

## Choose how a node reads media

**Source Access**, in a transcode node's add and edit forms, sets how the node reads the files it converts:

- **Local library mount**, the default, reads each file through the node's own mount of the media, at the same paths the main server uses.
- **Read from this server over HTTP** reads each file from the main server, so the node needs no media mount. Use it when the node can't mount the media, such as a machine on another network. Every byte the node reads then passes through the main server and its network. The line under the node's address reads **Reads media from this server**.

A change applies to jobs the node starts after you save. Running jobs keep reading the way they started.

Every main server, and every node set to **Local library mount**, must see each media file with the same size and the same modification time, to the second. When a node's copy of a file differs, its jobs for that file fail rather than read different data. A node left on **Local library mount** without a media mount fails every job.

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

Check that the node is enabled, **Healthy**, below its limit, and, with **Local library mount**, can read the file at the same path. A node can show **Healthy** and still refuse work when its clock is more than 30 seconds off, so check that its clock agrees with the main server's. For a grouped node, check that every enabled node in its [group](/docs/node-status#groups) is **Healthy**.

For a transcode node, also check:

- The line under its address. **No key: this node takes no work** means it needs a key; see [Add the node](#add-the-node).
- Why it stays **Unhealthy**. A transcode node that can't read its configuration from the main server logs `cannot read this node's configuration from the core; retrying`. Check that it can reach `SILO_CORE_URL`, that `SILO_NODE_KEY` is the latest key issued for it, and that a reverse proxy in front of the main server passes `/api/internal/nodes/`.
- Whether its copy of the file matches. With **Local library mount**, a node whose file differs in size or modification time from the main server's logs `local source access: this node's mount does not show the source the core approved`, and the job fails.

Transcode nodes send their logs to the main server. In **Admin > Logs > Server Log**, open an entry to see which node wrote it in its **Node** field, such as `gpu-1#7`: the node's name and id.

On a transcode node, the first start of a large file with burned-in text subtitles can fail while Silo reads the subtitle track. The player tries again on its own, and the retry usually plays.

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

To change a transcode node's encoder, select the pencil in the node's header, set **Hardware Acceleration** or **GPU Devices**, and select **Save**. New transcodes on the node use the change within 30 seconds, and running sessions keep their old settings.

To replace a transcode node's key, drain the node first, then select **Rotate key** under its address and confirm in **Rotate node key**. The old key stops working at once: any streams still on the node stop, and the node shows **Unhealthy** and gets no work until you restart it with the new key.

Silo stores node keys encrypted with the main server's `SECRET_KEY`. If you change `SECRET_KEY`, every transcode node loses its key: issue each one a new key and restart it with it.

To make a node re-read its configuration straight away, use force reload in the [admin API](/docs/api): `POST /api/v2/admin/nodes/{id}/force-reload` for one node, or `POST /api/v2/admin/nodes/force-reload` for every enabled node. There is no button for it. On a transcode node it also ends every live playback session.

Update all nodes together with the main server when the release notes say so. If you update one machine at a time, update the transcode nodes first, then the proxy nodes, then the main server. Some releases change how the main server and proxy nodes talk to other nodes, and a node that hasn't been updated yet can't answer the new requests. During the [1.0 update](/docs/updates#moving-from-alpha-to-10), don't mix alpha and 1.0 nodes.

### Move transcode nodes to node keys

Transcode nodes from before node keys can't work with a main server that has them, and the reverse, so you can't update them one at a time. Update them in one maintenance window:

1. Stop every transcode node.
2. Update the main server and the proxy nodes.
3. In **Admin > Playback > Nodes**, issue each transcode node a key, as in [Add the node](#add-the-node).
4. For a node without a media mount, set **Source Access** to **Read from this server over HTTP**.
5. Remove `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `NODE_URL`, and `NODE_NAME` from each node's environment, add `SILO_CORE_URL` and `SILO_NODE_KEY`, and start the node.
6. Check that each node shows **Healthy**, then play something that needs conversion.
