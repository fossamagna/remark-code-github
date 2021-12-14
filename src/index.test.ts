import codeGitHub from "./index";
import { remark } from "remark";

describe("remark-code-github", () => {
  it("import from raw_url using line numbers", async () => {

    const input = `\`\`\`ts raw_url=https://raw.githubusercontent.com/fossamagna/amplify-category-console-notification/c465b778a0defed9c046e349174bc2c3c8f35b0b/src/index.ts#L1-L3
\`\`\``;

    const expected = `\`\`\`ts raw_url=https://raw.githubusercontent.com/fossamagna/amplify-category-console-notification/c465b778a0defed9c046e349174bc2c3c8f35b0b/src/index.ts#L1-L3
import { $TSContext } from 'amplify-cli-core';
import * as path from 'path';

\`\`\`
`;

    const file = await remark()
      .use(codeGitHub)
      .process(input);

    expect(String(file)).toEqual(expected);
  });

  it("import from raw_url without line numbers", async () => {

    const input = `\`\`\`ts raw_url=https://raw.githubusercontent.com/fossamagna/amplify-category-console-notification/c465b778a0defed9c046e349174bc2c3c8f35b0b/src/index.ts
\`\`\``;

    const expected = `\`\`\`ts raw_url=https://raw.githubusercontent.com/fossamagna/amplify-category-console-notification/c465b778a0defed9c046e349174bc2c3c8f35b0b/src/index.ts
import { $TSContext } from 'amplify-cli-core';
import * as path from 'path';

export async function executeAmplifyCommand(context: $TSContext) {
  const commandsDirPath = path.normalize(path.join(__dirname, 'commands'));
  const commandPath = path.join(commandsDirPath, context.input.command);
  const commandModule = require(commandPath);
  await commandModule.run(context);
}

export async function handleAmplifyEvent(context: $TSContext, args: any) {
  const eventHandlersDirPath = path.normalize(path.join(__dirname, 'event-handlers'));
  const eventHandlerPath = path.join(eventHandlersDirPath, \`handle-\${args.event}\`);
  const eventHandlerModule = require(eventHandlerPath);
  await eventHandlerModule.run(context, args);
}
\`\`\`
`;

    const file = await remark()
      .use(codeGitHub)
      .process(input);

    expect(String(file)).toEqual(expected);
  });
});
