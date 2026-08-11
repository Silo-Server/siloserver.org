---
title: Jellyfin compatibility
description: How Silo approaches Jellyfin-compatible client support.
---

Silo includes a compatibility API for clients that expect Jellyfin or Emby-style endpoints.

## Endpoint

The default Docker stack exposes the compatibility endpoint at:

```text
http://localhost:8096
```

Use this endpoint when connecting compatible third-party clients.

Silo also keeps this endpoint for Jellyfin-style integrations such as the legacy [Autoscan](/docs/integrations/autoscan) Jellyfin target. For new Sonarr/Radarr scan triggers, prefer Silo's built-in Autoscan implementation instead.

## Signing in

A Jellyfin app gives you only two boxes to fill in: **Username** and **Password**.

Silo needs to know a bit more than that. One Silo account can hold several profiles — one for each person in the house — and a profile can have its own PIN. That is three or four things to say, using only two boxes.

The answer is to type them together, joined by a `#`. That character is called the pound sign, hash, or number sign, and on most keyboards you get it with **Shift + 3**.

### The two boxes

Put your **profile name** after your username, and your **PIN** after your password:

| Box | What to type |
| --- | --- |
| Username | your username, then `#`, then your profile name |
| Password | your password, then `#`, then your PIN |

Here is a full example. Say the account is `smith`, the profile is `Dad`, the password is `applesauce`, and the PIN on that profile is `1234`. You would type:

| Box | What to type |
| --- | --- |
| Username | `smith#Dad` |
| Password | `applesauce#1234` |

A few things worth knowing:

- Type it all as one run of characters, with **no spaces** around the `#`.
- Capital letters in the profile name do not matter. `smith#dad` works just as well.
- A PIN is always 4 digits.
- The app will not offer you a list of profiles to choose from, so type the whole thing yourself.

### If your profile has no PIN

Then there is nothing to add to the password. Type it the normal way:

| Box | What to type |
| --- | --- |
| Username | `smith#Dad` |
| Password | `applesauce` |

### If you would rather not type the profile name

Silo can sometimes work out the profile on its own. It manages that when either:

- one of your profiles has the same name as your account — account `smith`, profile `Smith`; or
- you have exactly one profile with no PIN on it.

In those cases you can type just `smith` in the username box. If neither is true, Silo has no way to know which person you are, and it will refuse to sign you in. Typing the profile name always works, so when in doubt, type it.

### If it says your username or password is wrong

Jellyfin apps show that same message for every kind of sign-in problem, even when your password is perfectly fine. Check these first:

- Is the profile name spelled the way it is spelled in Silo?
- Did you leave out the `#` and profile name when Silo cannot guess it?
- Does the profile have a PIN you forgot to add, or did you mistype it?
- Any stray spaces before or after the `#`?

Silo does record the real reason in the server log, so an administrator can look there if none of the above explains it.

### Two smaller details

**If your password itself contains a `#`,** everything still works. Type your password exactly as it is, and add `#` plus your PIN on the end if you need one.

**If a profile name contains a `#`,** that profile cannot be used from a Jellyfin app, because Silo cannot tell where the name starts. Rename the profile in Silo and it will work.

### Switching to another profile

Signing in picks one profile and stays there. What you have watched, where you left off, and your favorites all belong to that one profile.

Jellyfin apps have no way to switch profiles, so to use a different one, sign out of the app and sign back in with that profile's name and PIN.

## Reverse Proxy

If you expose Silo publicly and want to use Jellyfin-compatible clients, create a separate reverse proxy hostname for the compatibility endpoint.

Recommended shape:

```text
https://silo.example.com    -> Silo web app on port 8090
https://silojf.example.com  -> Jellyfin-compatible endpoint on port 8096
```

Use the Jellyfin hostname when signing in from Jellyfin-compatible clients. In Silo settings, set the Jellyfin compatibility public URL to that same hostname.

## Scope

Compatibility is focused on practical client support, not exact server identity. Some Jellyfin clients may depend on behavior that Silo does not yet implement.

When reporting compatibility issues, include:

- Client name and version
- The endpoint URL shape you used
- The screen or action that failed
- Logs or request details when available
- Whether the same flow works in the Silo web app

## Source notes

- Default Jellyfin-compatible port in Compose: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml).
- Jellyfin compatibility default listen/public URL settings: [`db_loader.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/config/db_loader.go#L358-L365).
- Compatibility server starts in `integrated` or `api` mode: [`main.go`](https://github.com/Silo-Server/silo-server/blob/main/cmd/silo/main.go#L1544-L1545).
- `username#profile` and `password#pin` resolution, including the full-password-first fallback: [`login.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/login.go#L60-L172).
- Profile selection when the username has no suffix: [`login.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/login.go#L174-L210).
- `/Users/Public` returns an empty list: [`handlers_auth.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/handlers_auth.go#L133-L136).
- Quick Connect reports disabled: [`handlers_system.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/handlers_system.go#L57-L60).
