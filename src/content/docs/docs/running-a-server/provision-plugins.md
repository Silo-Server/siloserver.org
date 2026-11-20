---
slug: docs/provision-plugins
keywords: ["GitOps", "declarative plugin setup", "SILO_CONFIG_FILE", "SILO_CONFIG", "SILO_PLUGINS", "SILO_PLUGINS_FILE", "Authelia", "OpenAI API key", "Ollama"]
questions: ["How do I install plugins from Docker Compose?", "Can I configure OIDC before Silo starts?", "Can I add an AI provider without the admin pages?", "Why is plugin provisioning held after a restore?"]
title: Configure Silo from a deployment document
description: Install signed plugins, connect AI providers, and set up OpenID Connect from one document and secret files in Compose, Kubernetes, or NixOS.
---

Use a deployment document to install and configure official plugins and connect AI providers on a fresh server or redeploy. Upgrade all API and proxy instances before mounting the file.

## Prepare the declaration

At API startup, supply one document. Set `SILO_CONFIG_FILE` to a YAML or JSON file path, or put JSON in `SILO_CONFIG`. The older names, `SILO_PLUGINS_FILE` and `SILO_PLUGINS`, still work and read the same document. Set only one of the four: if two are set, Silo doesn't start. Empty variables count as unset. With all four unset, the API reads the stored configuration. Proxy and transcode processes ignore these variables.

The document has a `plugins` section for official plugins and an `ai_providers` section for [AI providers](#connect-ai-providers). Both are optional. If you leave a section out, Silo keeps what it would set up as it is.

This example pins version `0.1.2` of the official OpenID Connect plugin. Replace the issuer, client ID and groups with your identity provider's settings. The `media` group can sign in and create accounts on first sign-in. Members of `media-admins` can get administrator access, so check that group's membership before you deploy. [Set up single sign-on](/docs/single-sign-on) explains how Silo uses these settings.

Set `SILO_PUBLIC_URL=https://media.example.org` and register `https://media.example.org/api/v2/auth/oauth/callback` as a redirect URI at the identity provider. If your public URL has a path prefix, include it in the redirect URI. If an existing installation already uses a numbered redirect URI, add the stable URI alongside it before changing the declaration. Create the local Owner through initial setup. External sign-in becomes available once the Owner exists, the public URL is set, and the binding is ready.

Save the following as `deployment.yaml` for Compose or Kubernetes:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Silo-Server/silo-server/main/contracts/plugins/provisioning/v1/schema.json
apiVersion: 1
plugins:
  silo.auth.oidc:
    catalog: silo
    version: "0.1.2"
    config:
      connection:
        issuer_url: https://auth.example.org
        client_id: silo
        client_secret:
          fromFile: /run/secrets/oidc_client_secret
        request_groups_scope: true
      access:
        allowed_groups: media
        admin_groups: media-admins
    auth_binding:
      capability_id: oidc
      enabled: true
      auto_provision: true
      callback: stable
```

The catalog defaults to `silo`. Omit `version` to install the current release and follow the installation's update policy. An exact version keeps Silo from updating that plugin until you change the pin.

Reference each secret with `fromFile` or `fromEnv`. Silo strips one final line ending from a secret file and preserves environment variable contents exactly. The declaration and the combined secrets each have a 1 MiB limit.

## Connect AI providers

Add an `ai_providers` section to connect the providers that [AI services](/docs/ai-services) and [recommendations](/docs/recommendations) use. Key each provider by an id you choose: up to 64 lowercase letters, digits, and hyphens. Recommendations refer to a provider by this id.

```yaml
apiVersion: 1
ai_providers:
  openai-main:
    type: openai
    api_key:
      fromFile: /run/secrets/openai_key
  local-embed:
    type: custom
    name: Local embeddings
    base_url: http://ollama:11434/v1
    capabilities: [embeddings]
```

- Set `type` to `openai`, `gemini`, `openrouter`, `groq`, `ollama`, `whisper`, or `custom` for an OpenAI-compatible endpoint. Without `name` or `base_url`, Silo uses the type's own, as when you add the provider in the admin pages. A `custom` provider needs a `base_url`.
- Give `api_key` as `fromFile` or `fromEnv`, like a plugin secret. The document can't hold the key itself. The `openai`, `gemini`, `openrouter`, and `groq` types need a key.
- `capabilities` lists what a `custom` provider serves: `chat`, `embeddings`, `speech`, or more than one. The other types serve a fixed set, so Silo doesn't start if you give one `capabilities`.
- Each provider needs a name no other provider uses. If the type's default name, such as `OpenAI`, belongs to a provider an administrator connected, Silo doesn't start and the error names both. Give the declared provider a `name` of its own.
- If an id matches a provider that's already connected, the declared one replaces it, key included.

If an entry is wrong, Silo doesn't start and logs the variable and the entry, such as `SILO_CONFIG_FILE: ai_providers.local-embed: choose at least one thing the provider serves`.

On **Admin > Integrations > AI Services**, a declared provider opens read-only, with a note such as **Set by SILO_CONFIG_FILE in the server's environment.** It has no **Save** or **Remove**, and **Test** still works. Choose it under **Models** as you would any other provider. To have recommendations use it, see [Set up recommendations](/docs/recommendations#configure-the-model).

Each API server that reads the document saves its providers when it starts, and the last one to start wins, so give every API server that reads it the same document.

## Mount the file with Compose

Add this to the `silo` service in your Compose configuration. Create `./secrets/oidc_client_secret` outside version control and give the user that runs Silo permission to read it. Add a secret for each AI provider key the same way.

```yaml
services:
  silo:
    environment:
      SILO_PUBLIC_URL: https://media.example.org
      SILO_CONFIG_FILE: /run/silo-config/deployment.yaml
    volumes:
      - ./deployment.yaml:/run/silo-config/deployment.yaml:ro
    secrets:
      - oidc_client_secret
secrets:
  oidc_client_secret:
    file: ./secrets/oidc_client_secret
```

Run `docker compose up -d --force-recreate --no-deps silo` after adding the mounts or changing the files.

## Mount the file on one Kubernetes API replica

Create these resources in the namespace that runs Silo. Keep the secret file outside version control.

```sh
kubectl create configmap silo-deployment --from-file=deployment.yaml
kubectl create secret generic silo-oidc --from-file=oidc_client_secret=./secrets/oidc_client_secret
```

Set the same `SILO_PUBLIC_URL` on every API replica to protect the registered redirect URL. Copy your regular API Deployment to `silo-api-provisioning` to share its database, Redis, secret key, storage, and API settings. Give it a unique selector and add the following fields.

```yaml
spec:
  replicas: 1
  strategy:
    type: Recreate
  template:
    spec:
      containers:
        - name: silo
          env:
            - name: SILO_PUBLIC_URL
              value: https://media.example.org
            - name: SILO_CONFIG_FILE
              value: /run/silo-config/deployment.yaml
          volumeMounts:
            - name: deployment-document
              mountPath: /run/silo-config
              readOnly: true
            - name: oidc-secret
              mountPath: /run/secrets/oidc_client_secret
              subPath: oidc_client_secret
              readOnly: true
      volumes:
        - name: deployment-document
          configMap:
            name: silo-deployment
        - name: oidc-secret
          secret:
            secretName: silo-oidc
```

Mount the document and its secrets only here. After updating the ConfigMap or Secret, keep the other replicas running and run `kubectl rollout restart deployment/silo-api-provisioning`.

If another instance holds the writer lock at startup, the provisioning pod reports a refusal. Check the refusal with `kubectl logs deployment/silo-api-provisioning`. Stop the other writer. If its node died, wait for PostgreSQL to release its session lock. Then restart the provisioning pod.

## Generate the file with NixOS

Add the following to the configuration for an existing systemd service named `silo.service`. Have your secret manager write the OIDC client secret to `/run/secrets/silo-oidc-client-secret` before the service starts. Systemd makes it available to Silo at the runtime credential path.

```nix
{ pkgs, ... }:
let
  deploymentFile = pkgs.writeText "silo-deployment.json" (builtins.toJSON {
    apiVersion = 1;
    plugins."silo.auth.oidc" = {
      version = "0.1.2";
      config.connection = {
        issuer_url = "https://auth.example.org";
        client_id = "silo";
        client_secret.fromFile = "/run/credentials/silo.service/oidc_client_secret";
        request_groups_scope = true;
      };
      config.access = {
        allowed_groups = "media";
        admin_groups = "media-admins";
      };
      auth_binding = {
        capability_id = "oidc";
        enabled = true;
        auto_provision = true;
        callback = "stable";
      };
    };
  });
in {
  systemd.services.silo = {
    environment = {
      SILO_PUBLIC_URL = "https://media.example.org";
      SILO_CONFIG_FILE = deploymentFile;
    };
    serviceConfig.LoadCredential = [
      "oidc_client_secret:/run/secrets/silo-oidc-client-secret"
    ];
  };
}
```

Apply the configuration with your usual NixOS deployment command. After rotating the secret, run `systemctl restart silo.service`.

## Change settings or hand control back to an administrator

- Change a setting or rotate a secret, then restart the instance that reads the declaration. To roll back, redeploy the previous document and, if you rotated a credential, restore the matching secret if the provider still accepts it.
- The declaration owns each config field or sign-in option it names. An administrator can edit the other fields and turn off an installation. To turn off the declared sign-in binding, set `auth_binding.enabled: false`.
- Remove a field or plugin from the document to release its ownership and keep its last saved value. To release every plugin, set `plugins: {}`. Leaving the `plugins` section out releases nothing. Once a secret's ownership is released, an administrator can clear it in the plugin settings.
- Remove a provider from `ai_providers` to release it. It stays connected, and an administrator can edit or remove it again. To release every provider, set `ai_providers: {}`. Leaving the section out releases nothing.

## If a declaration is pending or held

Check **Admin > Integrations > Plugins**. During a catalog or download outage, Silo can serve the last configuration it accepted. A missing plugin stays unavailable while Silo retries. If Silo rejects a document because of a field or package, correct the reported problem and restart the provisioning instance.

If a full restore restricted a plugin release, sign-in, or automatic account creation, Silo can start with the declaration mounted and keep those restrictions. Sign in with the local Owner account. [Review and acknowledge the restore hold](/docs/restore#resume-plugin-provisioning-after-a-restore) before you reapply the declaration.

## Validate a document in CI

Use the schema comment in the YAML example to check the document in an editor with YAML language server support. To check a JSON declaration in CI, download the [version 1 schema](https://raw.githubusercontent.com/Silo-Server/silo-server/main/contracts/plugins/provisioning/v1/schema.json) and run:

```sh
npx --yes ajv-cli@5 validate --spec=draft2020 --strict=false -s schema.json -d deployment.json
```

Silo also checks plugin fields against the installed release's manifest and reads the referenced secrets when it starts.
