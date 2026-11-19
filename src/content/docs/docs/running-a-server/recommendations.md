---
slug: docs/recommendations
keywords: ["because you watched", "recommended for you", "AI recommendations", "machine learning", "collaborative filtering", "taste", "embeddings", "pgvector"]
questions: ["How do I turn on personalized movie suggestions?", "Can I switch embedding models after setup?", "Why are suggestions so generic for a new profile?", "Why did my suggestion jobs fail?"]
title: Set up recommendations
description: Choose the embedding provider and model, then run and inspect the jobs that produce results.
---

Recommendations suggest titles from your catalog and each profile's activity. They are optional and need PostgreSQL with pgvector and an embedding model from a provider connected in [AI Services](/docs/ai-services). The rows that show them are set up in [Home Sections](/docs/home-sections).

Pick the embedding model carefully: Silo locks it after the first successful embedding, and changing it later deletes every embedding.

## Configure the model

1. Open **Admin > Integrations > Recommendations**.
2. Under **Embedding Model**, choose the **Embedding provider**. The list shows the providers connected in AI Services; choose **Connect a provider...** to add one here. A provider marked **(no embedding models)** can't be chosen, and a ChatGPT plan doesn't include embedding models.
3. Enter the **Model**, or pick one of the provider's suggestions. The field saves when you leave it; wait for the save result.
4. Choose **Check Connection**. It must report the model's dimensions; a chat-only model won't work.
5. Under **General**, turn on **Enable Recommendations**. Restart the server when the page asks. Changes on this page take effect only after a restart.

A hosted embedding model receives catalog text from Silo, so review the provider's charges and data policy first. Leave the advanced ranking settings at their defaults until you have results to judge.

With **Enable Recommendations** off, **For You** still shows rows every profile gets, such as **Highly Rated in Your Library** and **Recently Added**, and Home leaves out **Recommended for You**.

## Generate and inspect results

In **Job status**, run **Embeddings** first. After it finishes, run **Taste Profiles**, **Co-Watch Matrix**, and **Recommendations** in that order, checking each for errors.

Open the app with a profile that has some watch history or ratings. A profile with no history sees only rows every profile gets, such as **Popular on This Server** and **Highly Rated in Your Library**. Its own rows, such as **For You** and **Because you enjoy**, appear once it watches, rates, or favorites titles, or picks a few on [Pick what you love](/docs/home-and-calendar#find-your-next-title) in the web app. After that, Silo updates a profile's rows in the background whenever it watches or rates something on any device, without waiting for the scheduled jobs. Every row respects the profile's library access and rating limit.

If a job fails, check the provider in AI Services, the model, and the job's error.

The **Schedule** section sets when jobs run again. Change it after a manual run works.

## Change the embedding model

The **Embedding Lock** card shows the model Silo is locked to. To move to a different model:

1. Choose **Reset embeddings** and confirm. This deletes every embedding and personal recommendation row and clears taste profiles. Personal rows stay unavailable until the embeddings are rebuilt.
2. Choose the new **Model**, then restart the server.
3. Run **Embeddings** again. Taste profiles rebuild as their titles are embedded.

Another provider serving the same model needs no reset; choose it under **Embedding provider** and restart. Don't reset to get around a temporary outage: a reset throws away every embedding, and the **Embeddings** job then has to embed your whole catalog again.
