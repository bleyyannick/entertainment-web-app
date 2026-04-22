const fs = require("fs");

function publishCoverageSummary(config) {
  if (!process.env.GITHUB_STEP_SUMMARY) {
    throw new Error(
      "GITHUB_STEP_SUMMARY is not set. This script must run in GitHub Actions.",
    );
  }

  const fmt = (value) => `${Number(value || 0).toFixed(2)}%`;

  let markdown = `## ${config.title}\n\n`;
  markdown += "| Suite | Statements | Branches | Functions | Lines |\n";
  markdown += "| --- | ---: | ---: | ---: | ---: |\n";

  for (const file of config.files) {
    if (!fs.existsSync(file.path)) {
      markdown += `| ${file.label} | N/A | N/A | N/A | N/A |\n`;
      continue;
    }

    const summary = JSON.parse(fs.readFileSync(file.path, "utf8")).total;
    markdown += `| ${file.label} | ${fmt(summary.statements.pct)} | ${fmt(summary.branches.pct)} | ${fmt(summary.functions.pct)} | ${fmt(summary.lines.pct)} |\n`;
  }

  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
}

module.exports = { publishCoverageSummary };
