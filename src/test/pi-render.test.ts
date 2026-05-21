import { describe, expect, it } from "vitest";
import { renderPiIntraLineDiff } from "../pi-render.js";

function mark(text: string): string {
  return `<${text}>`;
}

describe("renderPiIntraLineDiff", () => {
  it("keeps punctuation boundaries when highlighting code-token edits", () => {
    expect(renderPiIntraLineDiff("x=1", "x=2", mark)).toEqual({
      removedLine: "x=<1>",
      addedLine: "x=<2>",
    });
    expect(renderPiIntraLineDiff("foo.bar", "foo.baz", mark)).toEqual({
      removedLine: "foo.<bar>",
      addedLine: "foo.<baz>",
    });
    expect(renderPiIntraLineDiff("function foo()", "function bar()", mark)).toEqual({
      removedLine: "function <foo>()",
      addedLine: "function <bar>()",
    });
  });

  it("falls back to whole-line highlighting for very large token matrices", () => {
    const oldLine = Array.from({ length: 150 }, (_, index) => `a${index}`).join(".");
    const newLine = Array.from({ length: 150 }, (_, index) => `b${index}`).join(".");

    expect(renderPiIntraLineDiff(oldLine, newLine, mark)).toEqual({
      removedLine: `<${oldLine}>`,
      addedLine: `<${newLine}>`,
    });
  });
});
