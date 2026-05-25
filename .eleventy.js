// Malperdy Labs — Eleventy config.
//
// Content lives as markdown in src/. Adding a note is: drop a .md file in
// src/notes/ with front matter (title, date) and it appears in the notes
// index and gets its own page. That's the whole "content management" loop.
//
// Build:   npx @11ty/eleventy
// Serve:   npx @11ty/eleventy --serve   (live preview at localhost:8080)
// Output:  _site/  (static; deploy to GitHub Pages or any static host)

module.exports = function (eleventyConfig) {
  // Pass CSS and any static assets straight through.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // Custom-domain marker — lands at _site/CNAME so the apex domain
  // survives every redeploy (Actions deploys replace the whole output).
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  // A "notes" collection — every markdown file under src/notes/, newest first.
  eleventyConfig.addCollection("notes", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/notes/*.md")
      .sort((a, b) => b.date - a.date)
  );

  // Readable date filter, e.g. "23 May 2026".
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  });

  // ISO date for <time datetime="...">.
  eleventyConfig.addFilter("isoDate", (dateObj) =>
    new Date(dateObj).toISOString().slice(0, 10)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // Set in GitHub Pages deploy if served from a subpath; "" for a custom
    // domain at the root (malperdy.dev).
    pathPrefix: "/",
  };
};
