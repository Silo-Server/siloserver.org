---
slug: docs/media-folders
title: Prepare media folders and filenames
description: Arrange movie and series files so Silo can find and identify them.
---

Start with separate folders for movies and series. A clear title and year help Silo identify files; a provider ID helps when several titles share a name.

## Library Paths

Silo needs a filesystem directory it can read. It cannot use an `s3://`, `https://`, or `file://` URL as a library root.

With the default Docker setup, `MEDIA_ROOT=/srv/media` maps the host's media to `/mnt/media` in the container:

| Folder on the host | Folder entered in Silo |
| --- | --- |
| `/srv/media/movies` | `/mnt/media/movies` |
| `/srv/media/tv` | `/mnt/media/tv` |

Mount network shares on the host first. Check that the files are visible and readable before you [add the library](/docs/manage-libraries).

## Movies

Use one folder per movie when you have posters, subtitles, extras, or several versions:

```text
movies/
  Movie Name (2024)/
    Movie Name (2024).mkv
    Movie Name (2024).en.srt
    poster.jpg
```

Loose files like `movies/Movie Name (2024).mkv` also work. Replace the example names with the real title and year.

## Series

Keep every show inside its own parent folder. Include a season and episode number in each filename:

```text
tv/
  Show Name (2024)/
    Season 01/
      Show Name - S01E01.mkv
      Show Name - S01E02.mkv
    Specials/
      Show Name - S00E01.mkv
```

Use `S01E01` for ordinary episodes and `S00E01` for specials. Extra release information after the episode number is accepted. Daily shows can use an air date like `Show Name 2024-02-15.mkv`; dots, underscores, and spaces also work as date separators.

Do not put unrelated shows into one flat episode folder. Bare `E01`, `1x02`, and absolute numbers without season context are poor choices for reliable identification.

## Audiobooks

Audiobooks are beta. Their folder and chapter instructions live in the
[Beta audiobook guide](/docs/audiobook-libraries).

## Provider IDs

If a title matches incorrectly, an ID in its folder name can remove ambiguity:

```text
Movie Name (2024) {tmdb-12345}
Show Name (2024) {tvdb-12345}
Movie Name (2024) {imdb-tt1234567}
```

These IDs are placeholders. Use the ID for your actual title from the selected provider. Do not paste the sample numbers into your library.

## Editions and Parts

Silo reads edition tags like `{edition-Director's Cut}` in a folder or filename. Multipart names can use `cd`, `disc`, `part`, or `pt` followed by a number. Check the resulting versions and playback order on one item before renaming a whole collection.

## Sidecars and extras

Keep NFO files, posters, and subtitle sidecars with the item they describe. See [Local metadata](/docs/local-metadata) for what Silo reads.

For movie extras, use an item-level folder such as `Trailers`, `Featurettes`, or `Behind the Scenes`. An extras folder at the library root has no owning title. For series, files in `Extras` with a valid `S00E01`-style name retain the special-episode behavior.

## Avoid

Do not fix a missing network mount by deleting the library or moving all its files. Restore the mount and check the path first. Test naming changes on one representative title before applying them in bulk.

## Autoscan

Paths sent by another service must map to Silo's container-visible library root. For example, an import reported as `/tv/Show Name` may need a rewrite to `/mnt/media/tv/Show Name`. Configure the rewrite with the relevant [Autoscan source](/docs/autoscan).
