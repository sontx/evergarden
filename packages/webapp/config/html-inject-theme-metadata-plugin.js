const HtmlWebpackPlugin = require("html-webpack-plugin");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class HtmlInjectThemeMetadataPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "HtmlInjectThemeMetadataPlugin",
      (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          "HtmlInjectThemeMetadataPlugin",
          (data, cb) => {
            const assets = JSON.parse(data.plugin.assetJson);
            const themes =
              assets.filter((asset) =>
                /(dark|light)\.[a-z0-9].+\.css/.test(asset),
              ) || [];
            const dom = new JSDOM(data.html);
            const metaTags = themes
              .map((theme) => {
                if (/(dark)\.[a-z0-9].+\.css/.test(theme)) {
                  return {
                    name: "dark",
                    value: theme,
                  };
                }
                return {
                  name: "light",
                  value: theme,
                };
              })
              .map(
                (tag) =>
                  `<meta theme-name="${tag.name}" value="${tag.value}"/>`,
              );
            dom.window.document.head.innerHTML += metaTags.join(" ");
            data.html = dom.window.document.documentElement.innerHTML;
            cb(null, data);
          },
        );
      },
    );
  }
}

module.exports = HtmlInjectThemeMetadataPlugin;
