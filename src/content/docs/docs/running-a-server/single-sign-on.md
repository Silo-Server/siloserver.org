---
slug: docs/single-sign-on
title: Set up single sign-on
description: Let people sign in with your OpenID Connect provider or LDAP directory, and decide whether Silo passwords still work.
---

Single sign-on lets people sign in to Silo with the account they already have at your identity provider. Silo supports two kinds, each through its own plugin:

- [OpenID Connect](#connect-an-openid-connect-provider) providers, such as authentik, Authelia, Keycloak, Pocket ID, Zitadel, or Entra ID. People select the provider's button and sign in on its own page.
- [LDAP](#connect-an-ldap-directory) directories, such as Active Directory, lldap, FreeIPA, or OpenLDAP. People type their directory username and password into Silo's sign-in form.

A server uses one of these at a time. Both work in the web app and the Silo apps. Silo passwords keep working alongside the provider until you [turn them off](#turn-off-silo-passwords).

## Install the sign-in plugin

1. Open **Admin > Plugins** and choose the **Catalog** tab.
2. Install **OpenID Connect Sign-in** or **LDAP Sign-in**. See [Install and maintain plugins](/docs/plugins) for catalog details.
3. Open **Admin > Settings > Sign-in**. Under **Single sign-on**, select the plugin's card to show its setup steps.

The sections below follow the page's steps in order. The page also has a **Button icon** step and, for OpenID Connect, **Claim mapping**, which most setups can leave as they are. Every change saves from the save bar at the bottom of the page, except **Turn on** and **Turn off**, which apply at once.

## Connect an OpenID Connect provider

Set the **Silo public URL** in **Admin > Settings > General** first. The provider sends people back to that address after they sign in, and the **Redirect URI** doesn't appear until it's set.

1. Under **Register Silo at your provider**, copy the **Redirect URI**. At your provider, create a confidential client for Silo and add that URI as its redirect (or callback) URL.
2. Under **Client**, enter the **Issuer URL**, **Client ID**, and **Client secret** from the provider. Enter the issuer exactly as the provider shows it, including any trailing slash; authentik's has one.
3. Under **Sign-in request**, turn on **Request the groups scope** if your provider needs it to send groups. The field's description lists which ones do. To let Silo [re-check people](#re-check-access-at-the-provider), turn on **Request offline access** too.
4. Under **Access rules**, enter **Allowed groups** to limit who can sign in, and **Admin groups** for people who should be Silo admins. Enter one group per line. Leave **Admin groups** empty to manage roles in Silo instead. Below them, choose whether to keep **Create accounts on first sign-in** on (see [Choose who gets an account](#choose-who-gets-an-account)), then save.
5. Under **Test the connection**, select **Test connection**. It checks the saved settings and any unsaved changes without saving them.
6. Under **Login button**, enter the **Provider name** people know, such as `authentik` or `Company SSO`. The preview shows the button as **Sign in with** and that name. Save.
7. Select **Turn on**. The provider's card shows **On**.

Sign out, or open a private window, and sign in through the new button to check it. Some providers need extra settings for groups or for re-checks, such as a group mapper in Keycloak or a scope for Zitadel roles. The plugin's [provider notes](https://github.com/Silo-Server/silo-plugin-auth-oidc#provider-notes) list them.

To end the provider's session when someone signs out of the web app, turn on **Sign out at the provider** under **Sign-in request**. Register the **Post-logout redirect URI** from step 1 at the provider as well. Authelia, Kanidm, and Tinyauth can't end their session this way.

In the iPhone, iPad, Mac, and Android apps, signing in with the provider opens the device's browser and returns to the app afterwards. On a TV, people [sign in with a phone](/docs/tv-sign-in).

## Connect an LDAP directory

1. Under **Directory connection**, choose your **Directory type**. It fills in the filters and attribute names for common directories.
2. Enter the **Directory URLs** (`ldap://` or `ldaps://`, one per line). Enter a **Service account DN** and **Service account password** for the account Silo searches the directory with, or leave them blank to search anonymously.
3. Under **Users**, enter the **User base DN**: the part of the directory to search for people. Leave the other user settings blank unless your directory differs from the type you chose.
4. Under **Groups and access**, enter **Allowed groups** and **Admin groups**, one per line. Each field's description says when a group needs its full DN. Below them, choose whether to keep **Create accounts on first sign-in** on, then save.
5. Under **Test the connection**, select **Test connection**. To check one person's groups and the role they'd get, enter them as **Test username** under **Users** first. No password is used.
6. Under **Login button**, enter a **Directory name** such as `Company directory`, then save.
7. Select **Turn on**.

People then sign in with their directory username and password in the usual sign-in form. An account that still has its own Silo password keeps signing in with that password until it's [connected to the directory](#choose-who-gets-an-account).

## Choose who gets an account

With **Create accounts on first sign-in** on, which is the default, anyone the provider lets in gets a Silo account the first time they sign in. Their role follows **Admin groups** when you set it; everyone else becomes a regular user. Turn it off to let in only people whose Silo account is already connected to the provider.

Connect existing Silo accounts before their owners sign in with the provider. If the provider sends the email their Silo account already uses, Silo refuses the sign-in and asks them to have an admin connect it. If the email is different, they get a second, separate account. There are three ways to connect one:

- The person connects it in their own account settings. See [Connect a sign-in provider](/docs/accounts#connect-a-sign-in-provider).
- An admin connects it on the account's **Sign-in** tab with **Connect identity**. See [Sign-in and break-glass accounts](/docs/manage-accounts#sign-in-and-break-glass-accounts).
- **Match existing accounts by email**, under **Accounts and sessions**, connects a first sign-in to the regular account with the same email, when the provider says the address is verified. It's off by default. Whoever controls that address at the provider takes over the Silo account, and matching signs the account out everywhere and deletes its API keys. Turn it on only if the provider verifies every email and people can't change their own. Admin, owner, and break-glass accounts are never matched.

Connecting a provider turns off the account's Silo password, unless it's a break-glass account. The person signs in with the provider from then on.

## Re-check access at the provider

Silo asks the provider again whether each person may still sign in. Someone you remove, disable, or take out of the allowed groups at the provider is signed out of Silo at the next check, and their Silo API keys are removed. When you set **Admin groups**, each check updates the person's role too.

Set how often under **Accounts and sessions**:

- **Re-check access every** is 12 hours by default.
- **If the provider is unreachable** decides what happens during an outage. **Keep people signed in**, the default, lets sessions carry on and asks again later. **Stop sessions from renewing** stops apps from working until the provider answers again.

An LDAP directory is always re-checked. An OpenID Connect provider can be re-checked only when **Request offline access** is on and the provider grants it. Some providers, such as Authelia, also need **Refresh token lifetime** under **Sign-in request**; its description says which. If you leave it blank, someone removed at the provider keeps their Silo sessions until the age limit below.

Without re-checks, a session started through the provider ends after the **Refresh token expiry** set in **Admin > Settings > Security & Access**, 30 days by default, and the person signs in with the provider again.

## Turn off Silo passwords

Turn off **Allow password sign-in** under **Silo passwords** when everyone should sign in with the provider. The switch can't be turned off until a provider is on.

Silo keeps password sign-in for break-glass admins, so someone can still get in if the provider is down. The server owner is a break-glass account by default, and the setting lists the break-glass admins under its switch. To make another admin one, see [Sign-in and break-glass accounts](/docs/manage-accounts#sign-in-and-break-glass-accounts). Silo won't turn passwords off unless at least one break-glass admin can still sign in with a password.

While password sign-in is off:

- Everyone else signs in with the provider. The web sign-in page goes straight to an OpenID Connect provider when it's the only option.
- Invitations can't be sent or accepted, because they create accounts with a Silo password. People join by signing in with the provider instead.
- TVs don't offer **Sign in with a password** unless the provider is an LDAP directory. People sign in on a TV [with a phone or the QR code](/docs/tv-sign-in).
- [Jellyfin-compatible apps](/docs/jellyfin-apps) accept only break-glass accounts and, with an LDAP directory, directory accounts.

## If you're locked out

A break-glass admin can open `/login?local=1` on the server to get the password form when the page only offers the provider.

If no admin can sign in, turn password sign-in back on from the server's command line. With the standard Docker setup, run this in the folder with your `docker-compose.yml`:

```sh
docker compose exec silo silo auth local-login enable
```

Connecting a provider also turns off each connected account's own password. To turn it back on for one account, add its username or email. An account created through the provider never had a Silo password, so also add `-temporary-password`:

```sh
docker compose exec silo silo auth local-login enable -user alex -temporary-password
```

The command prints the temporary password once and signs the account out everywhere. The person must change the password at their next sign-in.

## Switch or remove the provider

To stop using the provider, select **Turn off** on its card and confirm. People can't sign in with it until it's back on. Their Silo accounts and their connections to the provider stay. If password sign-in is also off, only break-glass admins can sign in until you turn one of them back on.

To use a different provider, turn off the current one first, then set up and turn on the other.
