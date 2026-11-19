---
slug: docs/provision-plugins
keywords: ["GitOps", "declarative plugin setup", "SILO_PLUGINS", "SILO_PLUGINS_FILE", "Authelia"]
questions: ["How do I install plugins from Docker Compose?", "Can I configure OIDC before Silo starts?", "Why is plugin provisioning held after a restore?"]
title: Provision plugins from deployment configuration
description: Install signed plugins, configure them from secret files, and set up OpenID Connect in Compose, Kubernetes, or NixOS.
---

Put plugin settings in a deployment file when you want the same official plugins and settings on a fresh server or after a redeploy. Upgrade every API and proxy instance to a release that supports plugin provisioning before you mount the file.

## Prepare the declaration

Set `SILO_PLUGINS_FILE` to a YAML or JSON file, or set `SILO_PLUGINS` to the JSON document itself. Choose one variable. Silo reads it when the API starts. An API instance with neither variable uses the settings already in the database. Proxy and transcode processes ignore both variables.

This example pins version `0.1.2` of the official OpenID Connect plugin. Replace the issuer, client ID and groups with your identity provider's settings. The `media` group can sign in and create accounts on first sign-in. Members of `media-admins` can get administrator access, so check that group's membership before you deploy. [Set up single sign-on](/docs/single-sign-on) explains how Silo uses these settings.

Set `SILO_PUBLIC_URL=https://media.example.org` and register `https://media.example.org/api/v2/auth/oauth/callback` as a redirect URI at the identity provider. If your public URL has a path prefix, include it in the redirect URI. If an existing installation already uses a numbered redirect URI, add the stable URI alongside it before changing the declaration. Create the local Owner through initial setup. External sign-in becomes available once the Owner exists, the public URL is set, and the binding is ready.

Save the following as `plugins.yaml` for Compose or Kubernetes:

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

For each secret, use a single `fromFile` reference to a file the Silo process can read, or a `fromEnv` reference to an environment variable containing the secret. Silo removes one final line ending from a secret file and preserves the contents of an environment variable as supplied. The declaration and the combined referenced secrets each have a 1 MiB limit. Keep secret contents in your secret store.

## Mount the file with Compose

Add this to the `silo` service in your Compose configuration. Create `./secrets/oidc_client_secret` outside version control and give the user that runs Silo permission to read it.

```yaml
services:
  silo:
    environment:
      SILO_PUBLIC_URL: https://media.example.org
      SILO_PLUGINS_FILE: /run/silo-provisioning/plugins.yaml
    volumes:
      - ./plugins.yaml:/run/silo-provisioning/plugins.yaml:ro
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
kubectl create configmap silo-plugin-declaration --from-file=plugins.yaml
kubectl create secret generic silo-oidc --from-file=oidc_client_secret=./secrets/oidc_client_secret
```

Create a separate Deployment for the API instance that submits the declaration. Start from your regular API Deployment so it has the same database, Redis, secret key, storage, and API settings. Give it the name `silo-api-provisioning` and a selector unique to that Deployment. Add these fields to its spec:

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
            - name: SILO_PLUGINS_FILE
              value: /run/silo-provisioning/plugins.yaml
          volumeMounts:
            - name: plugin-declaration
              mountPath: /run/silo-provisioning
              readOnly: true
            - name: oidc-secret
              mountPath: /run/secrets
              readOnly: true
      volumes:
        - name: plugin-declaration
          configMap:
            name: silo-plugin-declaration
        - name: oidc-secret
          secret:
            secretName: silo-oidc
```

Mount the declaration and its secrets only in this Deployment. Keep the other API replicas running while Kubernetes replaces the provisioning replica. After updating the ConfigMap or Secret, run `kubectl rollout restart deployment/silo-api-provisioning`. If a second instance has already claimed provisioning authority, stop it before restarting the designated instance.

## Generate the file with NixOS

Add the following to the configuration for an existing systemd service named `silo.service`. Have your secret manager write the OIDC client secret to `/run/secrets/silo-oidc-client-secret` before the service starts. Systemd makes it available to Silo at the runtime credential path.

```nix
{ pkgs, ... }:
let
  pluginsFile = pkgs.writeText "silo-plugins.json" (builtins.toJSON {
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
      SILO_PLUGINS_FILE = pluginsFile;
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
- Remove a field or plugin from the document to release its ownership and keep its last saved value. To release everything, submit a document with `apiVersion: 1` and `plugins: {}`. Once a secret's ownership is released, an administrator can clear it in the plugin settings.

## If a declaration is pending or held

Check **Admin > Integrations > Plugins**. During a catalog or download outage, Silo can serve the last configuration it accepted. A missing plugin stays unavailable while Silo retries. If Silo rejects a document because of a field or package, correct the reported problem and restart the provisioning instance.

If a full restore restricted a plugin release, sign-in, or automatic account creation, Silo can start with the declaration mounted and keep those restrictions. Sign in with the local Owner account. [Review and acknowledge the restore hold](/docs/restore#resume-plugin-provisioning-after-a-restore) before you reapply the declaration.

## Validate a document in CI

Use the schema comment in the YAML example to check the document in an editor with YAML language server support. To check a JSON declaration in CI, download the [version 1 schema](https://raw.githubusercontent.com/Silo-Server/silo-server/main/contracts/plugins/provisioning/v1/schema.json) and run:

```sh
npx --yes ajv-cli@5 validate --spec=draft2020 --strict=false -s schema.json -d plugins.json
```

Silo also checks plugin fields against the installed release's manifest and reads the referenced secrets when it starts.
