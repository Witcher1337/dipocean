"use strict";

module.exports = {
  plugins: [
    "scss",
    {
      name: "typescript",
      options: {
        // useEslint: true,
        useBabel: true,
      },
    },
  ],
};
