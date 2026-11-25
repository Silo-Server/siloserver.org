---
slug: docs/transcode-nodes
keywords: ["distributed transcoding", "remote transcoding", "load balancing", "worker node", "second machine", "multiple servers", "cluster", "scale out", "offload transcoding", "node key", "GPU box", "no shared storage", "friend's GPU", "share a GPU", "Tailscale"]
questions: ["How do I use a second computer's GPU for converting?", "Can another machine handle streaming to take load off my server?", "Why isn't my extra machine getting any transcodes?", "How do I update a node without stopping playback?", "Does a transcode node need my database password?", "Can a node convert video without mounting my library?"]
title: Add and check transcode nodes
description: Add proxy and transcode nodes on other machines and check that playback uses them.
---

A single Silo server already streams and converts video itself. Add nodes when you want part of that work on other machines. Every node runs the same Silo image in a different mode. A transcode node needs only the main server's address and a key you issue for it. A proxy node shares the main server's PostgreSQL, Redis, and encryption key.

## Choose a node type

| Type | Does | Use it when |
| --- | --- | --- |
| Transcode | Converts video for playback and prepared downloads, and reads audio for [subtitle sync](/docs/subtitle-providers#set-up-subtitle-sync) | The main server's CPU or GPU can't keep up, or another machine has a better GPU |
| Proxy | Delivers streams and downloads to clients | You want streams to leave from somewhere other than the main server, such as a host with more bandwidth |

Transcode nodes only talk to the main server and proxy nodes, so they need no public address. Clients connect to proxy nodes directly.

## Prepare the node

On the node's host, use the server repository's [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml) with the node's settings in `.env`; the node section of the repository's `.env.example` lists them. In these modes the container starts none of its bundled services.

Set `PORT` in the node's `.env` to the port it's published on, such as `8082`. Every node also needs a clock that stays within 30 seconds of the main server and the other nodes, for example kept in sync with NTP. A node whose clock is further off has its requests refused and refuses the ones sent to it, so work sent to it fails.

### Transcode node settings

A transcode node connects to no database and holds none of the main server's secrets. It needs:

- `MODE=transcode`.
- `SILO_CORE_URL`, an address where the node can reach the main server, such as `http://192.168.1.10:8090`. A LAN address, a VPN address such as a Tailscale one, or your public URL all work. If you run several API servers, use their load-balanced address.
- `SILO_NODE_KEY`, the key you issue for this node when you [add it](#add-the-node).
- The media mounted at the same container path the main server uses, such as `/mnt/media`. A node whose **Source access** is **Through the API servers** doesn't need it; see [Choose a node's source access](#choose-a-nodes-source-access).
- A writable transcode directory with free space.
- For GPU encoding, its own driver and device access, set up as in [Set up transcoding](/docs/playback).
- `SILO_STOP_GRACE_PERIOD=11m`, so it can [drain](#maintain-a-node) before Docker stops it.

The node takes everything else from the main server, including its FFmpeg path and transcode directory. The repository's `docker-compose.yml` still asks for `SECRET_KEY` and `MEDIA_ROOT`. A transcode node doesn't use the key, so any value works there, and a node that reads through the API servers can point `MEDIA_ROOT` at an empty folder. If `DATABASE_URL`, `REDIS_URL`, `NODE_URL`, or `NODE_NAME` are still in its `.env`, the node ignores them.

The node calls the main server at `SILO_CORE_URL`, and the main server and proxy nodes call the node at its **URL**, so your network has to allow both directions. If `SILO_CORE_URL` goes through a reverse proxy, the proxy must pass requests under `/api/internal/nodes/` to Silo unchanged. The node takes its FFmpeg path and directories from the main server's answers, so use a network you trust or an `https://` address. With a plain `http://` address on another machine, the node logs a warning when it starts.

### Proxy node settings

A proxy node needs:

- `MODE=proxy`.
- `NODE_NAME`, the same name you give the node in Silo, and `NODE_URL`, the node's own address with its `PORT`. Silo matches the running node to its entry by these values. The container won't start a proxy node without `NODE_URL`.
- The same `SECRET_KEY` as the main server, and `DATABASE_URL` and `REDIS_URL` pointing at the shared PostgreSQL and Redis. Use the same Redis [database number](/docs/configuration#external-postgresql-and-redis) as the main server. Behind [Redis Sentinel](/docs/configuration#redis-sentinel), use the main server's Sentinel URL, and let the node reach every Sentinel and Redis server.
- Enough PostgreSQL connections for every proxy node. Each one opens up to 20 database connections of its own, but the main server only sizes PostgreSQL's connection limit for itself. In the main server's `.env`, raise `POSTGRES_TUNE_CONNECTIONS` as described in [PostgreSQL tuning](/docs/configuration#postgresql-tuning).
- The media mounted at the same container path the main server uses, such as `/mnt/media`.
- A plugin directory (`SILO_PLUGIN_CACHE_DIR`).

On the main server, PostgreSQL and Redis aren't reachable from other machines until you turn on [node access](/docs/docker#nodes-and-stop-timeouts). With [separate containers](/docs/docker#run-the-services-in-separate-containers), they're published only on the main host's loopback address until you change that. Keep PostgreSQL, Redis, and node ports on a trusted network. Only proxy nodes connect to PostgreSQL and Redis.

Local artwork on the main server isn't shared with other hosts automatically. For several hosts, consider [S3 artwork storage](/docs/s3-storage).

## Add the node

Add the node in Silo, then start it.

1. Open **Admin > Playback > Nodes** and select **Add Transcode** or **Add Proxy**.
2. Enter a **Name**. For a proxy node, it must match the node's `NODE_NAME`.
3. Enter the **URL** the main server uses to reach the node. For a proxy node, it must match the node's `NODE_URL`. A private address is fine.
4. For a proxy node, enter a **Public URL** if clients should use a different address, such as a public hostname in front of the node. Leave it empty to give clients the **URL**, which then must be reachable from clients.
5. For a transcode node, choose its [**Source access**](#choose-a-nodes-source-access). Keep **Library mount on the node** if the node mounts your media.
6. If the node shares a host or local network with other nodes, give them all the same **Group**, such as `rack-1`. Silo then keeps their streams inside the group; see [Groups](/docs/node-status#groups).
7. Optionally set **Max Transcodes** or **Max Streams** (and **Max Egress Bandwidth (Mbps)** for a proxy), then select **Save**.
8. For a transcode node, Silo offers its key as soon as you save. Select **Issue key**. In the dialog that opens, fill in **Server address for the node** if it's empty, then copy the two lines under **Node settings** into the node's `.env`. Silo shows the key only this once, so copy it before you select **I saved the key**.
9. Start the node with its Compose file.

A transcode node takes no work until it has a key. If you chose **Not now**, the node shows **No key: this node takes no work until a key is issued** under its address, with **Issue key** beside it. Once it has one, it shows **Key issued**.

Silo checks a new node as soon as you save it, then every 30 seconds. A node you start after saving shows **Unhealthy** until the next check. Its state changes to **Healthy** once Silo can reach it, and for a transcode node, once the node is running with its key. A transcode node's **Acceleration** block shows the verified encoder, such as **VAAPI** or **SW**. Use the refresh button to check it right away. [Read node status](/docs/node-status) explains each reading.

Then play something that needs conversion, or from a client that uses the proxy. **Admin > Activity** shows the session, and the node's **Capacity** block shows the job. Test seeking and stopping as well.

## Choose a node's source access

**Source access**, in a transcode node's add and edit forms, sets how the node reads your media:

- **Library mount on the node** is the default. The node reads each file from its own mount, at the same container path the main server uses.
- **Through the API servers** needs no mount. The node reads each file from the main server over the network, at the address in `SILO_CORE_URL`.

Choose **Through the API servers** for a machine that can't mount your library, such as a GPU machine at another site. Everything the node reads then passes through the main server, so the main server needs the bandwidth for it. A change applies to the work the node starts after you save; streams already running keep reading the way they started.

With **Library mount on the node**, the node must see each file exactly as the main server does: the same path, size, and modification time. If its mount shows a different file, the node refuses that job, and Silo converts it on the main server if **Routing** allows that.

A node set to **Through the API servers** can't burn in some text subtitles, such as those inside an MP4 file. Silo converts that playback on a node with a mount or on the main server instead.

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

## Borrow a friend's GPU

A transcode node doesn't have to be in your house. It needs only your server's address and a key, and with **Source access** set to **Through the API servers** it doesn't mount your library, so it can run on someone else's machine. Two friends can each run one for the other's server.

If a friend has a spare GPU and a fast connection, their machine can convert video for your Silo server. Install Tailscale on your server's host and on their machine. The [Tailscale plugin](/docs/tailscale) isn't enough here: it only lets devices reach Silo, and your server also has to call the node.

Share your server with your friend in Tailscale, and have them share their machine with you. Both shares are needed, because a shared machine can answer connections but not start them. Sign both hosts in to Tailscale as yourselves, not with a tag: a tagged machine can't reach a machine shared from another tailnet. If you run proxy nodes, they call the node too, so their hosts need the same access. Then [add the node](#add-the-node) with the Tailscale addresses as its **URL** and **Server address for the node**.

With the default **Silo Defaults** routing, your server sends remuxes and transcodes to the node whenever it's healthy and below its limit, not only when your own machine is busy. While the node is full, switched off, or unreachable, Silo converts on your server or another node instead. To keep remuxing on your server and send the node only video transcodes, choose **GPU offload** under [Route playback to nodes](#route-playback-to-nodes).

Your friend stays in charge of their hardware. They set `SILO_NODE_MAX_TRANSCODES` in the node's `.env`, the node refuses work past that number, and **Max Transcodes** is then read-only in your node editor. Your viewers never connect to your friend's machine: the node sends the converted video back to your server or a proxy node, which streams it to them.

Each file travels to the node and the converted video travels back, so this needs a fast connection at both ends. Do it only with someone you trust who also trusts you: their node sees every video it converts, and it runs the jobs your server sends it.

## If work does not reach the node

Check that the node is enabled, **Healthy**, and below its limit. A transcode node also needs its key: check that it shows **Key issued**. With **Library mount on the node**, check that it can read the file at the same path. For a grouped node, check that every enabled node in its [group](/docs/node-status#groups) is **Healthy**.

A transcode node that stays **Unhealthy** after it starts usually can't sign in to the main server. Check that the node can reach the address in `SILO_CORE_URL`, that `SILO_NODE_KEY` is the key you issued last, and that its clock is within 30 seconds of the main server's. A proxy node can show **Healthy** and still refuse work when its clock is that far off.

A transcode node whose transcode directory is 95% full is skipped while another node has room. If every transcode node is that full, Silo uses one anyway, and streams on it can fail once the disk fills. Silo never skips a node whose disk use it can't read.

To see which case you're in, filter **Admin > Logs > Server Log** by the `nodepool` component. `transcode scratch guard ignored: every eligible node is over the scratch threshold` means new sessions are going to a nearly full disk. To fix it, enlarge the node's transcode volume or clear old files from its transcode directory.

## Maintain a node

To stop or upgrade a transcode node without cutting playback, drain it first:

1. In **Admin > Playback > Nodes**, select the pause icon in the node's header. Silo sends the node no new work, and streams already on it keep playing. Its state changes to **Draining**, and the line under its address counts the work left, such as **Draining · 2 transcodes left**.
2. Wait for **Drained · safe to stop**. Streams play until they end, so this can take as long as the longest one left on the node.
3. Stop or upgrade the node. While it's stopped, it shows **Unhealthy**, and if it's in a [group](/docs/node-status#groups), Silo sends that group no new transcodes until the node is back.
4. Once the node is running again, select the play icon in its header to resume it. It stays drained after a restart until you resume it.

The [admin API](/docs/api) has the same actions: `POST /api/v2/admin/nodes/{id}/drain` and `POST /api/v2/admin/nodes/{id}/resume`.

You can also stop a transcode node directly, and it drains on its own. It takes no new work and keeps serving its streams until they end or `SILO_NODE_DRAIN_TIMEOUT` passes, then stops, and streams still on it move to another machine, as when a node [crashes](/docs/node-status#node-state). The timeout is `10m` by default. Set it on the node as a duration such as `15m` or a number of seconds, or set it to `0` to turn the drain off. A second stop signal stops the node at once. Docker kills a container 10 seconds after asking it to stop, so set the node's `SILO_STOP_GRACE_PERIOD` to the timeout plus a minute, as in [Nodes and stop timeouts](/docs/docker#nodes-and-stop-timeouts).

Proxy nodes don't drain. Turn a proxy node's switch off to stop new work while its current streams finish.

After changing a node's driver or devices, use its re-probe button. Silo refuses it while the node is transcoding, so drain the node first and resume it once the re-probe finishes. See [Set up transcoding](/docs/playback#after-a-driver-or-device-change).

To change a transcode node's encoder, select the pencil in the node's header, set **Hardware Acceleration** or **GPU Devices**, and select **Save**. New transcodes on the node use the change within about 30 seconds, and running sessions keep their old settings.

To replace a transcode node's key, drain the node first, then select **Rotate key** under its address. The old key stops working at once, so streams still on the node fail, and the node takes no work until you put the new key in its `.env` as `SILO_NODE_KEY` and restart it.

To make a node re-read its configuration straight away, use force reload in the [admin API](/docs/api): `POST /api/v2/admin/nodes/{id}/force-reload` for one node, or `POST /api/v2/admin/nodes/force-reload` for every enabled node. There is no button for it. On a transcode node it also ends every live playback session.

Update all nodes together with the main server when the release notes say so. The [1.0 update](/docs/updates#moving-from-alpha-to-10) is one of those: don't mix alpha and 1.0 nodes. Stop the transcode nodes first, and start them again only once the main server and proxy nodes run 1.0 and you've issued each transcode node its key. For other updates, if you update one machine at a time, update the transcode nodes first, then the proxy nodes, then the main server. Some releases change how the main server and proxy nodes talk to other nodes, and a node that hasn't been updated yet can't answer the new requests.

A transcode node on an older version than the main server can't send subtitles from inside a video file along with the converted video. Silo then converts that playback on the main server or an updated node instead. Only if **Routing** leaves no such machine does an older node convert it, and the apps then download the subtitle separately, which can take minutes on network storage.
