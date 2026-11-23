---
slug: docs/recommendations
keywords: ["because you watched", "recommended for you", "AI recommendations", "machine learning", "collaborative filtering", "taste"]
questions: ["How do I turn on personalized movie suggestions?", "Can I switch embedding models after setup?", "Why are suggestions so generic for a new profile?", "Why did my suggestion jobs fail?"]
title: Set up recommendations
description: Connect an embedding provider, run the jobs that produce recommendations, and switch embedding models.
---

Recommendations suggest titles from your catalog and each profile's activity. They are optional and need PostgreSQL with pgvector and an embedding model from a provider connected in [AI Services](/docs/ai-services). The rows that show them are set up in [Home Sections](/docs/home-sections).

Pick the embedding model carefully: Silo locks it after the first successful embedding, and changing it later deletes every embedding.

## Configure the model

1. Open **Admin > Integrations > Recommendations**.
2. Under **Embedding Model**, choose the **Embedding provider**, or choose **Connect a provider...** to add one. A ChatGPT plan doesn't include embedding models.
3. Enter the **Model**, or pick one of the provider's suggestions. The field saves when you leave it; wait for the save result.
4. Choose **Check Connection**. It must report the model's dimensions; a chat-only model won't work.
5. Under **General**, turn on **Enable Recommendations**, then restart the server. Silo applies the recommendation settings only after a restart.

To set these from your deployment instead, declare a provider that serves embeddings in your [deployment document](/docs/provision-plugins#connect-ai-providers). A provider added in the admin pages gets a generated id that the admin pages don't show. Then add three variables to the [server's environment](/docs/configuration#server-settings-from-the-environment): `SILO_RECOMMENDATIONS_ENABLED=true`, `SILO_RECOMMENDATIONS_PROVIDER` set to that provider's id, and `SILO_RECOMMENDATIONS_MODEL` set to the model. After Silo starts, **Enable Recommendations**, **Embedding provider**, and **Model** show read-only on this page. Choose **Check Connection** and confirm it reports the model's dimensions before you run **Embeddings**.

The variables take effect on the start that reads them; no second restart is needed. If the provider isn't connected or doesn't serve embeddings, Silo doesn't start and logs an error such as `the recommendation embeddings provider "local-embed" is not connected`. Give every API server the same values, because the last one to start wins.

A hosted embedding model receives catalog text from Silo, so review the provider's charges and data policy first. Leave the advanced ranking settings at their defaults until you have results to judge.

With **Enable Recommendations** off, no profile gets personal rows. **For You** still shows rows every profile gets, such as **Highly Rated in Your Library** and **Recently Added**. On Home, the **Recommended for You** shelf shows shared picks under their own row name, or is left out when there are none.

## Generate and inspect results

In **Job status**, run **Embeddings** first. After it finishes, run **Taste Profiles**, **Co-Watch Matrix**, and **Recommendations** in that order, checking each for errors.

Open **For You** with a profile that has watched, liked, or favorited a few titles. A new profile sees only rows every profile gets, such as **Popular on This Server** and **Highly Rated in Your Library**, until Silo learns what it likes; in the web app, [Pick what you love](/docs/home-and-calendar#find-your-next-title) gives it a start. Silo then updates a profile's personal rows in the background after it watches or rates something on any device, without waiting for the scheduled jobs. Every row respects the profile's library access and rating limit.

If a job fails, check the provider in AI Services, the model, and the job's error.

The **Schedule** section sets when jobs run again. Change it after a manual run works.

## Change the embedding model

The **Embedding Lock** card shows the model Silo is locked to. To move to a different model:

1. Choose an **Embedding provider** that serves the new model, and enter the new **Model**. If the variables set them, change `SILO_RECOMMENDATIONS_PROVIDER` and `SILO_RECOMMENDATIONS_MODEL` instead.
2. Restart the server.
3. Choose **Reset embeddings** and confirm. This deletes every embedding and personal recommendation row and clears taste profiles. Personal recommendations and semantic search stay unavailable until the embeddings are rebuilt. If an embedding job is running, Silo refuses the reset until it finishes.
4. Run **Embeddings** again. Taste profiles rebuild as their titles are embedded.

To keep your embeddings, switch only the provider: choose another **Embedding provider** that serves the same model with the same dimensions, choose **Check Connection**, and restart once it passes. When `SILO_RECOMMENDATIONS_PROVIDER` sets the provider, change that variable instead, restart, and then choose **Check Connection**. If the provider is only down for a while, wait for it to come back rather than resetting.
