import type { Intent, ScoredResource } from "./types";
import { resources } from "./resources";

export function routeResources(intent: Intent): ScoredResource[] {
  return resources
    .map((resource) => {
      let score = 0;

      if (resource.communities.some((c) => intent.communities.includes(c)))
        score += 3;
      if (resource.problems.includes(intent.problem)) score += 3;
      if (resource.urgency === intent.urgency) score += 1;
      if (intent.wantsHumanHelp && resource.humanSupport) score += 2;

      return { resource, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
