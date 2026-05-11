import type antfu from "@antfu/eslint-config";

// Default export will be the return type of antfu()
export default function antfuExtended(...args: Parameters<typeof antfu>): ReturnType<typeof antfu>;
