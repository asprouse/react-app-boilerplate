import meta from './meta';

export default (c) => {
  c = meta(c);

  const css = !__DEV__ ? `<link rel="stylesheet" href="${c.cssAsset}" />` : '';

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <base href="/" />
      <meta charSet="utf-8" />
      <title>${c.title}</title>

      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="description"content="${c.description}" />
      <meta name="keywords" content="${c.keywords}" />
      <meta property="og:type" content="${c.type}" />
      <meta property="og:title" content="${c.title}" />
      <meta property="og:site_name" content="${c.siteName}" />
      <meta property="og:url" content="${c.url}" />
      <meta property="og:description" content="${c.description}" />
      <meta property="og:image" content="${c.image}" />
      <meta property="fb:app_id" content="${c.facebookAppId}" />

      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      <link rel="image_src" href="${c.appHost}/images/apple-touch-icon.png" />
      ${css}
    </head>
    <body>
      <div id="app">${c.body}</div>
      <script>
        window.__CHUNKS__ = ${c.chunks};
        window.__DATA__ = ${c.data};
      </script>
      <script src="${c.vendorAsset}"></script>
      <script src="${c.jsAsset}"></script>
    </body>
  </html>
`;
}
