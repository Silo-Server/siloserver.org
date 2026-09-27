---
slug: docs/recommendations
title: Set up recommendations
description: Configure the recommendation model and inspect the jobs that produce results.
---

Recommendations suggest titles from your catalog and each profile's activity. They are optional and need PostgreSQL with pgvector and an OpenAI-compatible embedding endpoint. The rows that show them are set up in [Sections](/docs/home-sections).

Recommendations have their own model settings, separate from the text and speech models in [AI Services](/docs/ai-services). Pick the embedding model carefully: Silo locks it after the first successful embedding.

## Configure the model

1. Open **Admin > Recommendations**.
2. Under **Embedding Configuration**, choose a provider preset or enter **Base URL**, **Model**, and **Auth Token**. Edited fields save when you leave them; wait for the save result.
3. Run the connection check. The endpoint must accept embedding requests; a chat-only endpoint won't work.
4. Turn on **Enable Recommendations**, then restart the server when prompted.

A hosted embedding endpoint receives catalog text from Silo, so review the provider's charges and data policy first. Leave the advanced ranking settings at their defaults until you have results to judge.

## Generate and inspect results

In **Job status**, run **Embeddings** first. After it finishes, run **Taste Profiles**, **Co-Watch Matrix**, and **Recommendations** in that order, checking each for errors.

Open the app with a profile that has some watch history or ratings. A new profile has little history, so its suggestions are less personal.

If a job fails, check the embedding endpoint, credentials, and the job's error. Once the **Embedding Lock** appears, don't switch models to get around a temporary outage: stored data from a different model isn't compatible.

The **Schedule** section sets when jobs run again. Change it after a manual run works.
