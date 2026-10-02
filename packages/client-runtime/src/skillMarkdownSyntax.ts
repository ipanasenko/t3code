import { collectComposerSkillTokens } from "@t3tools/shared/composerInlineTokens";
import { markdownLineEnding, markdownSpace, unicodeWhitespace } from "micromark-util-character";
import type { Extension, Tokenizer } from "micromark-util-types";
import type { Processor } from "unified";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    quotedSkill: "quotedSkill";
  }
}

const tokenize: Tokenizer = function (effects, ok, nok) {
  let token: ReturnType<typeof effects.enter>;
  let escaped = false;

  const start = (code: number | null) => {
    if (
      code !== 36 ||
      (this.previous !== null &&
        !markdownLineEnding(this.previous) &&
        !markdownSpace(this.previous) &&
        !unicodeWhitespace(this.previous))
    ) {
      return nok(code);
    }
    token = effects.enter("quotedSkill");
    effects.consume(code);
    return openingQuote;
  };

  const openingQuote = (code: number | null) => {
    if (code !== 34) return nok(code);
    effects.consume(code);
    return content;
  };

  const content = (code: number | null) => {
    if (code === null || markdownLineEnding(code)) return nok(code);
    effects.consume(code);
    if (escaped) {
      escaped = false;
    } else if (code === 92) {
      escaped = true;
    } else if (code === 34) {
      effects.exit("quotedSkill");
      return afterQuote;
    }
    return content;
  };

  const afterQuote = (code: number | null) => {
    if (
      code !== null &&
      !markdownLineEnding(code) &&
      !markdownSpace(code) &&
      !unicodeWhitespace(code)
    )
      return nok(code);
    return collectComposerSkillTokens(this.sliceSerialize(token)).length === 1
      ? ok(code)
      : nok(code);
  };
  return start;
};

const syntax: Extension = { text: { 36: { tokenize } } };

/** Preserve quoted skill source before Markdown consumes escapes or emphasis. */
function attachSkillTokens(this: Processor) {
  const data = this.data();
  (data.micromarkExtensions ??= []).push(syntax);
  (data.fromMarkdownExtensions ??= []).push({
    enter: {
      quotedSkill(token) {
        this.enter({ type: "text", value: this.sliceSerialize(token) }, token);
      },
    },
    exit: {
      quotedSkill(token) {
        this.exit(token);
      },
    },
  });
}

export const remarkSkillTokens = attachSkillTokens;
