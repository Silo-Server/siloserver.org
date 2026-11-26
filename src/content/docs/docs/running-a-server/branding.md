---
slug: docs/branding
keywords: ["white label", "rebrand", "custom theme", "theme color", "background image", "server title", "rename server", "clearlogo"]
questions: ["How do I put my own logo on the sign-in page?", "Can I change the name shown in the browser tab?", "How do I change the button color of the web app?", "Can I show plain movie names instead of logo images?", "Why is text lighter than the accent color I picked?"]
title: Customize your server's appearance
description: Set your server's logos, accent color, poster badges, title art, and login background for the web app and emails.
---

Name your server under **Admin > Server > General**, and use **Admin > Server > Appearance** to change how it looks in a browser and in the emails it sends. The Apple and Android apps keep their own name and icon.

## Name your server

1. Under **Identity** on **Admin > Server > General**, enter a **Server name**. It appears as the browser tab title and the heading on the sign-in page, and in the sidebar when you haven't uploaded a wordmark. The emails your server sends and the apps' sign-in screens use it too. Without one, your server is called Silo.
2. Enter a **Login subtitle** to show a line of your own under the server name on the sign-in page, in place of "Sign in with an existing account."
3. Save, then open the signed-out sign-in page. Neither change needs a restart.

The setup wizard asks for the server name when you first install, so this is where you change it later.

## Change how your server looks

Everything in this section is on **Admin > Server > Appearance**.

### Change the logos and colors

1. Under **Logos and icons**, upload a **Logo (wordmark)**, **Logo (icon)**, **Favicon**, or **Login background**. Silo saves uploads in [artwork storage](/docs/s3-storage), on local disk or in S3. The **Logo (wordmark)** also appears at the top of every email the server sends, such as invitations and password resets. Without one, emails show the Silo wordmark.
2. Under **Colors**, choose an **Accent color** for buttons, focus outlines, and the sidebar. Emails use it for their main button, such as the one in an invitation.
3. Save, then look at a normal page and the signed-out sign-in page. To see the logo in an email, [send a test email](/docs/notification-delivery#set-up-email).

If your accent is too dark to read as text, the web app draws accent-colored text, such as links and the current page in the admin and settings sidebars, in a lighter shade. Buttons and the bar beside the current page keep your exact color. For anyone who sets **Contrast** to **High Contrast** under [**Settings > Accessibility**](/docs/preferences#change-a-profile-preference-in-the-web-app), accent text can be lighter still, and focus outlines are white instead of your accent.

Use artwork you have permission to publish, and check that your logos stand out and the sign-in page stays readable over your login background. Focus outlines use your exact accent, so if you pick a dark one, press Tab on a page and check that you can still see the outline.

### Adjust poster badges

Under **Card overlays**, use **Show badges on poster art** and choose the **Badge style** and where each badge appears. These are defaults; people who have chosen their own badge style keep it. Save and look at a library.

**Availability**, under **Status & Awards**, is off by default. When it's on, series and season posters show how much of each is in the library. See [Show availability on series posters](/docs/find-something#show-availability-on-series-posters) for what it counts.

### Choose title art or plain titles

Under **Title pages**, turn off **Show title art** to name each movie or show at the top of its page in plain text instead of its logo artwork. It applies to everyone who hasn't chosen their own, and anyone can still change it in their settings. Titles without logo artwork always show their name as text. Save and open a movie.

### Advanced changes

**Individual colors and fonts** and **Custom CSS** give finer control over the Cinema Dark theme for everyone. Change one small area at a time and keep a copy of your previous values: custom CSS can hide controls or break after an interface update. **Reset to Cinema Dark** removes the accent color, color and font overrides, and custom CSS.
