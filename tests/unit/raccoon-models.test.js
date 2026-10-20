import { describe, it, expect } from "vitest";

import raccoon from "../../open-sse/providers/registry/raccoon.js";
import { getModelsByProviderId } from "../../open-sse/config/providerModels.js";
import {
  isModelAllowedForProvider,
  isStrictModelProvider,
} from "../../open-sse/services/model.js";
import { getCapabilitiesForModel } from "../../open-sse/providers/capabilities.js";

const MODEL_IDS = [
  "raccoon-8c4485",
  "raccoon-19b265",
  "raccoon-405a1c",
  "raccoon-chat-ml-5-5",
  "sn-sensenova-6-8-flash-lite",
];

describe("raccoon registry", () => {
  it("is an apikey OpenAI-compatible provider pointed at the web LLM port", () => {
    expect(raccoon.id).toBe("raccoon");
    expect(raccoon.category).toBe("apikey");
    expect(raccoon.transport.format).toBe("openai");
    expect(raccoon.transport.baseUrl).toBe(
      "https://xiaohuanxiong.com/api/web/llm/v2/chat/completions"
    );
    expect(raccoon.features).toMatchObject({ usage: true, usageApikey: true });
  });

  it("carries the Rust static catalog with its advertised limits", () => {
    const models = getModelsByProviderId("raccoon");
    expect(models.map((model) => model.id)).toEqual(MODEL_IDS);

    const byId = Object.fromEntries(models.map((model) => [model.id, model]));
    expect(byId["raccoon-8c4485"]).toMatchObject({
      contextWindow: 1_000_000,
      maxOutput: 100_000,
      vision: true,
    });
    expect(byId["raccoon-chat-ml-5-5"]).toMatchObject({
      contextWindow: 180_000,
      maxOutput: 80_000,
      reasoning: true,
    });
    expect(byId["sn-sensenova-6-8-flash-lite"]).toMatchObject({
      contextWindow: 256_000,
      maxOutput: 63_999,
    });
  });

  it("resolves capabilities from the provider table rather than the 200K/64K floor", () => {
    const caps = getCapabilitiesForModel("raccoon", "raccoon-8c4485");
    expect(caps).toMatchObject({
      vision: true,
      contextWindow: 1_000_000,
      maxOutput: 100_000,
    });
    expect(getCapabilitiesForModel("raccoon", "raccoon-chat-ml-5-5").contextWindow).toBe(180_000);
  });
});

describe("raccoon model gate", () => {
  it("opts into strictModels and does not opt into passthroughModels", () => {
    expect(raccoon.strictModels).toBe(true);
    expect(raccoon.passthroughModels).not.toBe(true);
    expect(isStrictModelProvider("raccoon")).toBe(true);
  });

  it("accepts every catalog id", () => {
    for (const id of MODEL_IDS) {
      expect(isModelAllowedForProvider("raccoon", id)).toBe(true);
    }
  });

  it("rejects an unknown model instead of letting upstream fall back to its default", () => {
    // This is the failure the plan calls out: the upstream answers 200 with a
    // different model, so the gate must reject it locally (chat.js returns 400).
    expect(isModelAllowedForProvider("raccoon", "gpt-4o")).toBe(false);
    expect(isModelAllowedForProvider("raccoon", "raccoon-does-not-exist")).toBe(false);
    expect(isModelAllowedForProvider("raccoon", "")).toBe(false);
  });

  it("still passes through models for providers without strictModels", () => {
    expect(isStrictModelProvider("openrouter")).toBe(false);
    expect(isModelAllowedForProvider("openrouter", "anything/at-all")).toBe(true);
  });
});
