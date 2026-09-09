import { describe, expect, it } from "vite-plus/test";

import { preferredEditorLaunchInput } from "./editorPreferences";

describe("preferredEditorLaunchInput", () => {
  it("reveals files when the preferred editor is the file manager", () => {
    expect(preferredEditorLaunchInput("/repo/file.ts", "file-manager", true)).toEqual({
      cwd: "/repo/file.ts",
      editor: "file-manager",
      reveal: true,
    });
  });

  it("does not request reveal for code editors", () => {
    expect(preferredEditorLaunchInput("/repo/file.ts", "cursor", true)).toEqual({
      cwd: "/repo/file.ts",
      editor: "cursor",
    });
  });
});
