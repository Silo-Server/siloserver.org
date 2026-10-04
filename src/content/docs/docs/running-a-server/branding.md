---
slug: docs/branding
title: Customize your server's appearance
description: Set your server's logos, accent color, poster badges, and login background for the web app and emails.
---

Use **Admin > Settings > Appearance** to change how your server looks in a browser and in the emails it sends. These settings don't change the Apple or Android app icons.

## Change the logos and colors

1. Under **Logos and icons**, upload a **Logo (wordmark)**, **Logo (icon)**, **Favicon**, or **Login background**. Silo saves uploads in [artwork storage](/docs/s3-storage), on local disk or in S3. The **Logo (wordmark)** also appears at the top of every email the server sends, such as invitations and password resets. Without one, emails show the Silo wordmark.
2. Under **Colors**, choose an **Accent color** for buttons, focus outlines, and the sidebar. Emails use it for their main button, such as the one in an invitation.
3. Save, then look at a normal page and the signed-out sign-in page. To see the logo in an email, [send a test email](/docs/notification-delivery#set-up-email).

Use artwork you have permission to publish, and make sure text and controls stay readable against your colors and background.

## Adjust poster badges

Under **Card overlays**, use **Show badges on poster art** and choose the **Badge style** and where each badge appears. These are defaults; people who have chosen their own badge style keep it. Save and look at a library.

## Advanced changes

**Individual colors and fonts** and **Custom CSS** give finer control over the Cinema Dark theme for everyone. Change one small area at a time and keep a copy of your previous values: custom CSS can hide controls or break after an interface update. **Reset to Cinema Dark** removes the accent color, color and font overrides, and custom CSS.
