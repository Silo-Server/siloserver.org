---
title: Set up recommendations
description: Configure the recommendation model and inspect the jobs that produce results.
---

Recommendations use catalog information and profile activity to build suggestions. They are separate from the rows you choose in [Sections](/docs/running-a-server/home-sections).

This is an optional advanced setup. It needs PostgreSQL with pgvector and an OpenAI-compatible embedding endpoint. Choose the model before generating data: Silo locks the embedding configuration after its first successful embedding.

## Configure the model

1. Open **Admin > Recommendations**.
2. Under **Embedding Configuration**, choose a provider preset or enter **Base URL**, **Model**, and **Auth Token**. Edited fields save when you leave them; wait for the save result.
3. Use the connection check and read the result. Confirm that the endpoint accepts embeddings, not just chat requests.
4. Turn on **Enable Recommendations** and follow any restart notice.

Review your provider's data handling and charges first. A hosted embedding endpoint receives the text Silo sends for recommendation processing. Leave the advanced ranking settings at their defaults until you have results to judge.

## Generate and inspect results

In **Job status**, run **Embeddings** first. After it finishes, run **Taste Profiles**, **Co-Watch Matrix**, and **Recommendations** in that order. Check each job for errors before continuing.

Open the app with a profile that has some watch history or ratings and inspect its recommendations. A new profile has less personal history, so its results need not resemble an established profile's results.

If a job fails, check the embedding endpoint, credentials, and job error. Do not switch models to fix a temporary outage after the **Embedding Lock** appears. A different model can produce incompatible stored data.

The **Schedule** section controls recurring jobs. Change schedules only after a manual run works.
