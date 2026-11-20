---
slug: docs/recommendations
keywords: ["because you watched", "recommended for you", "AI recommendations", "machine learning", "collaborative filtering", "taste", "similar to"]
questions: ["How do I turn on personalized movie suggestions?", "Can I switch embedding models after setup?", "Why are suggestions so generic for a new profile?", "Why did my suggestion jobs fail?", "Can Silo suggest movies we don't own yet?"]
title: Set up recommendations
description: Connect an embedding provider, run the jobs that produce recommendations, recommend titles you don't have on Discover, and switch embedding models.
---

Recommendations suggest titles from your catalog and each profile's activity. They are optional and need PostgreSQL with pgvector and an embedding model from a provider connected in [AI Services](/docs/ai-services). The rows that show them are set up in [Home Sections](/docs/home-sections).

Pick the embedding model carefully: Silo locks it after the first successful embedding, and changing it later deletes every embedding.

## Configure the model

1. Open **Admin > Integrations > Recommendations**.
2. Under **Embedding Model**, choose the **Embedding provider**, or choose **Connect a provider...** to add one. A ChatGPT plan doesn't include embedding models.
3. Enter the **Model**, or pick one of the provider's suggestions. The field saves when you leave it; wait for the save result.
4. Choose **Check Connection**. It must report the model's dimensions; a chat-only model won't work.
5. Under **General**, turn on **Enable Recommendations**, then restart the server. Silo applies the recommendation settings only after a restart.

A hosted embedding model receives catalog text from Silo, so review the provider's charges and data policy first. Leave the advanced ranking settings at their defaults until you have results to judge.

With **Enable Recommendations** off, no profile gets personal rows. **For You** still shows rows every profile gets, such as **Highly Rated in Your Library** and **Recently Added**. On Home, the **Recommended for You** shelf shows shared picks under their own row name, or is left out when there are none.

## Generate and inspect results

In **Job status**, run **Embeddings** first. After it finishes, run **Taste Profiles**, **Co-Watch Matrix**, and **Recommendations** in that order, checking each for errors.

Open **For You** with a profile that has watched, liked, or favorited a few titles. A new profile sees only rows every profile gets, such as **Popular on This Server** and **Highly Rated in Your Library**, until Silo learns what it likes; in the web app, [Pick what you love](/docs/home-and-calendar#find-your-next-title) gives it a start. Silo then updates a profile's personal rows in the background after it watches or rates something on any device, without waiting for the scheduled jobs. Every row respects the profile's library access and rating limit.

If a job fails, check the provider in AI Services, the model, and the job's error.

The **Schedule** section sets when jobs run again. Change it after a manual run works.

## Recommend titles you don't have on Discover

Discover recommendations add **Recommended movies for you** and **Recommended series for you** to the Requests page's **Discover** tab. Each profile gets its own titles that aren't in your library yet, picked from what it watches. They need recommendations working as above, with **Embeddings** run at least once, and [requests](/docs/manage-requests) turned on.

1. In **Admin > Integrations > Recommendations**, under **Discover Recommendations**, turn on **Enable Discover Recommendations**. It applies without a restart.
2. Set **Maximum Titles to Recommend From**, the number of titles you don't have that Silo keeps to pick from. The default is 5000, and it accepts 500 to 50000. Silo looks up each one on TMDB and embeds it with your embedding provider, so a higher number takes longer, uses more storage, and can cost more with a hosted provider.
3. In **Job status**, choose **Run** on the **Discover Recommendations** card. The first run fills the rows. The card then shows how many titles Silo has to recommend from and how many rows it built.

After that, the job runs daily at the time in **Discover Recommendations Cron**, under **Schedule**. A change to that schedule takes effect after a restart. A new profile has no rows until it watches or rates something, and a profile's rows update after each watch or rating.

If you've changed your Discover page in **Admin > Requests > Discover Page**, the rows aren't added for you. [Add them there](/docs/manage-requests#add-recommendation-rows-to-discover). Turning **Enable Discover Recommendations** off removes the rows from Discover.

## Change the embedding model

The **Embedding Lock** card shows the model Silo is locked to. To move to a different model:

1. Choose an **Embedding provider** that serves the new model, and enter the new **Model**.
2. Restart the server.
3. Choose **Reset embeddings** and confirm. This deletes every embedding and personal recommendation row, including the Discover rows, and clears taste profiles. Personal recommendations and semantic search stay unavailable until the embeddings are rebuilt. If an embedding job is running, Silo refuses the reset until it finishes.
4. Run **Embeddings** again. Taste profiles rebuild as their titles are embedded, and the next **Discover Recommendations** run rebuilds the Discover rows.

To keep your embeddings, switch only the provider: choose another **Embedding provider** that serves the same model with the same dimensions, choose **Check Connection**, and restart once it passes. If the provider is only down for a while, wait for it to come back rather than resetting.
