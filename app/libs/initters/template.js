export default (locals) => {
  return `
  <!DOCTYPE html>
  <html>
    ${locals.head}
    <body>
      <div id="app">${locals.body}</div>
      <script>
        window.__CHUNKS__ = ${locals.chunks};
        window.__DATA__ = ${locals.data};
      </script>
      <script src="${locals.vendorAsset}"></script>
      <script src="${locals.jsAsset}"></script>
    </body>
  </html>
`;
}
