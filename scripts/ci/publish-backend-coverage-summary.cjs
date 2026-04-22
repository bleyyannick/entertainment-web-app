const { publishCoverageSummary } = require("./publish-coverage-summary.cjs");

publishCoverageSummary({
  title: "Coverage - Backend",
  files: [
    { label: "Unit", path: "backend/coverage/unit/coverage-summary.json" },
    {
      label: "Integration",
      path: "backend/coverage/integration/coverage-summary.json",
    },
  ],
});
