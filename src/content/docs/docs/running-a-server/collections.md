---
slug: docs/manage-collections
keywords: ["box set", "boxset", "dynamic collection", "auto-updating list", "holiday movies", "group movies together", "genre collections", "movie page", "series page", "title page"]
questions: ["How do I make a holiday movie shelf for everyone?", "Can I follow an MDBList list in my library?", "Why does my synced list show fewer movies than the original?", "Why can't one profile see a collection?", "Why is a collection's poster a grid of other posters?", "Which collections show on a movie's page?"]
title: Create server collections
description: Build a server collection by hand, from rules, or from a list, arrange shelves, and add starter packs.
---

Server collections belong to one or more libraries and appear for everyone who can use them, on each library's **Collections** tab, for example a set of short films or a seasonal selection. You can also show one as a row on Home or a library page.

In the web app, a collection also shows on the page of each movie or series it holds, as a row of its other titles or as a card in an **Also in** row. See [Collections on movie and series pages](#collections-on-movie-and-series-pages).

## Create a collection

1. Open **Admin > Libraries > Collections** and choose **New collection**.
2. Choose **Manual** to pick the titles, **Smart** to fill it from rules, or **Synced list** to follow a list from MDBList or TMDB.
3. Enter a **Name** and choose the libraries it belongs to: under **Titles from** for a manual collection, in the **Rules** sentence for a smart collection, or under **Match into** for a synced list.
4. Fill it in: titles for a manual collection, rules for a smart collection, or the list a synced list follows. For a smart collection, check **Live preview** for the titles that match.
5. Choose **Create collection**.

The editor works as it does for [personal collections](/docs/collections#make-a-collection-in-the-web-app), with these server parts under **Where it shows** and **Look**:

- **Libraries**: **Change** takes you to where you pick them. If unticking a library would drop titles from a manual collection that are only in that library, the editor names them before you save.
- **Shelf**: the heading the collection sits under on the library's **Collections** tab. Choose **Arrange** to move it.
- **Show on the Collections tab**: turn it off to hide the collection from the tab and from movie and series pages. A hidden collection cannot be added as a row.
- **Rows that show it**: the Home and library page rows that show this collection. **Add as a row** adds one to Home or a library page.
- **Look**: a poster and a backdrop. Without a poster of its own, a collection shows a collage of up to four posters from its first titles, or from a smart collection's first matches in the collection's order. Each profile's collage uses only titles that profile can open. A poster you add replaces the collage for everyone. To bring the collage back, open the pencil button on the poster, choose **Use the collage**, then **Save**. A new or edited smart collection's collage can take a moment to appear, and it can take about 15 minutes to catch up with titles that match later.

To change a collection later, select it in the list, edit it, and choose **Save**.

## Follow a list with a synced list

A synced list reads a published list again on a schedule. Under **The list it follows**, choose:

- **MDBList**: pick from **Popular picks** or paste any public MDBList link. With an MDBList API key under **Lists** on **Admin > Integrations > Providers**, you can also search MDBList.
- **TMDB chart**: trending, popular, top rated, now playing, upcoming, airing today, or on the air, for movies, TV shows, or both. These work without setup, because Silo includes a TMDB key.
- **TMDB list**: paste a public TMDB list's link, such as `https://www.themoviedb.org/list/310-my-movie-list`. TMDB has no list search, so find the list on themoviedb.org first.

Choose under **Sync** how often Silo reads the list again, from **Every hour** to monthly, or **No automatic sync** to sync only when you ask. **Custom schedule…** takes a cron schedule in server time.

The list syncs for the first time when you create it. The collection shows only titles that are already in your library, so a list of 100 trending movies may show far fewer. To sync again, open **More actions** in the editor and choose **Sync now**. Save your changes first, because a sync runs the saved list.

Genre shelves and TMDB franchise collections come from [starter packs](#add-a-starter-pack).

## Find and change collections

**Admin > Libraries > Collections** opens on **List**, which shows every collection. Choose a library at the top, search, or filter by **Type**. A row's switch shows or hides the collection on its libraries' **Collections** tabs. Select a row to edit the collection, or open its action menu to **Sync now**, add it to Home or a library page, or delete it.

To change several at once, open **More**, choose **Select collections**, and tick up to 100. The bar at the bottom syncs the selected lists, or has **Show on tabs**, **Hide from tabs**, and **Delete…**. Syncing skips manual and smart collections.

## Arrange shelves

Choose a library, then **Arrange**. Shelves are the headings on that library's **Collections** tab, top to bottom as viewers see them, and each library has its own.

- Drag shelves and collections into place. Changes save right away.
- **New shelf** adds a heading. A shelf's action menu renames, moves, or deletes it, and its **Order** sorts the collections on it.
- A collection's action menu has **Move to shelf**, **Pin to the start of its shelf**, and **Hide from Collections tab**. A pinned collection also comes first under **Server collections** on each viewer's Collections page.
- **No heading** holds collections that are not on a shelf.
- **My collections** is where each viewer's own collections appear when they turn on **Show on the Collections tab**. You can rename or move it, and its contents are different for each viewer.

## Collections on movie and series pages

In the web app, the page of a movie or series lists the collections that hold it and that the profile can see, with the same parental controls and library access as the **Collections** tab:

- When one collection holds the title, the page shows up to six of that collection's other titles under the collection's name. **Explore all** opens the collection.
- When several collections hold it, an **Also in** row shows a card for each. The row also shows when the only collection holding the title has no other titles the profile can open.

Manual collections and synced lists count, and so do the viewer's personal collections, including ones other profiles on the account share with them. Another profile's shared collection shows only on titles that profile can see too. Smart collections don't count, and neither does a server collection with **Show on the Collections tab** turned off. When a movie's page already shows its franchise as a row of its own, a synced list that follows the same TMDB collection is left out, so the franchise doesn't show twice.

## Add a starter pack

A starter pack adds a ready-made set of synced lists to your libraries, such as trending and top-rated lists or a shelf for each genre.

1. Open **Admin > Libraries > Collections**, then **More > Starter packs…**.
2. Choose a pack. **All Defaults** adds every pack.
3. Under **Add to these libraries**, choose the libraries to fill. Each library gets only the lists that fit its type.
4. Check **What will happen**. For each library it counts the lists that are new, already there, and not for that library.
5. Leave **Also use the pack's hero banners** off to keep the hero banners you have now. Turn it on to let the pack set the hero banner on Home and on each library page.
6. Choose **Add**. The button counts what it adds, for example **Add 15 collections**.

New lists land under **No heading** on each library's **Collections** tab, ready to move into a shelf in **Arrange**. Each one syncs for the first time right after, and shows only titles that are already in your library. Adding a pack again leaves the lists already there alone.

## Delete a collection

Open the collection's action menu and choose **Delete…**. If Home or library page rows show it, the dialog lists them, and a button such as **Delete it and its 2 rows** removes both. To keep a row, open it from the dialog and point it at another collection first.

## If a collection looks empty or is missing

Check its rules or list, and its libraries. Each viewer sees only the items their libraries and profile restrictions allow.

If a collection is missing for one profile, check that profile's [parental controls](/docs/profiles#set-parental-controls): **Maximum content rating**, **Maximum advisory age**, **Hide titles without an advisory age**, and **Restrict libraries**. Then check the account's [library access](/docs/manage-access) under **Access & limits** in **Admin > Users**. A collection does not appear for a profile that can open none of its titles, in the web app, the mobile and TV apps, or Jellyfin-compatible apps. One with no titles yet still appears. The same checks decide which collections a movie or series page shows in the web app. A restricted profile's count on each card includes only the titles it can open, so it can be lower than the count in **Admin > Libraries > Collections**.

## If a synced list does not sync

The **Franchise Collections** and **All Defaults** packs add a **TMDB Franchise** list that does not follow a franchise yet. Its editor says `This list doesn't follow a TMDB collection yet. Add its ID so it can sync.` Enter the number from the collection's TMDB link under **TMDB collection ID**, for example `119` from `themoviedb.org/collection/119`, and choose **Save**.

MDBList lists are kept by MDBList users, and a list can be removed there. The collection's sync then fails, and its editor shows the error while keeping the titles it already has. Choose **Change link** to follow another list, or delete the collection.
