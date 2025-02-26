import type { Plugin, Transformer } from "unified";
import type { Code, Root } from "mdast";
import { visit } from "unist-util-visit";
import fetch from "node-fetch";

function extractLines(
  content: string,
  fromLine?: number,
  hasDash?: boolean,
  toLine?: number,
  preserveTrailingNewline = false
) {
  const lines = content.split(/\r\n|\n/);
  const start = fromLine || 1;
  let end;
  if (!hasDash) {
    end = start;
  } else if (toLine) {
    end = toLine;
  } else if (lines[lines.length - 1] === "" && !preserveTrailingNewline) {
    end = lines.length - 1;
  } else {
    end = lines.length;
  }
  return lines.slice(start - 1, end).join("\n");
}

export type PluginOptons = {
  preserveTrailingNewline?: boolean;
};

const plugin: Plugin<PluginOptons[], Root> = (options = {}) => {
  const transformer: Transformer<Root> = async (tree, file) => {
    const codes: Code[] = [];
    visit(tree, "code", (node: Code) => {
      codes.push(node);
    });

    for (const node of codes) {
      const codeMeta = (node.meta || "")
        .split(" ")
        .find((meta) => meta.startsWith("raw_url="));

      if (!codeMeta) {
        continue;
      }

      const res =
        /^raw_url=(?<rawUrl>.+?)(?:(?:#(?:L(?<from>\d+)(?<dash>-)?)?)(?:L(?<to>\d+))?)?$/.exec(
          codeMeta
        );

      if (!res || !res.groups || !res.groups.rawUrl) {
        throw new Error(`Unable to parse raw url path ${codeMeta}`);
      }

      const rawUrl = res.groups.rawUrl;
      const fromLine = res.groups.from
        ? Number.parseInt(res.groups.from, 10)
        : undefined;
      const hasDash = !!res.groups.dash || fromLine === undefined;
      const toLine = res.groups.to
        ? Number.parseInt(res.groups.to, 10)
        : undefined;
      const response = await fetch(rawUrl);
      const fileContent = await response.text();

      node.value = extractLines(
        fileContent,
        fromLine,
        hasDash,
        toLine,
        options.preserveTrailingNewline
      );
      // FIX: warn unable to find prism language
      node.meta = undefined;
    }
  };
  return transformer;
};

export default plugin;
