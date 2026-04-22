const { publishCoverageSummary } = require("./publish-coverage-summary.cjs");

publishCoverageSummary({
  title: "Coverage - Frontend",
  files: [
    { label: "Unit", path: "frontend/coverage/unit/coverage-summary.json" },
    {
      label: "Integration",
      path: "frontend/coverage/integration/coverage-summary.json",
    },
  ],
});
