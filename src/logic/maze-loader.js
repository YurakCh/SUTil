/**
 * SUTil Usability Engine (Maze Loader)
 * Inyecta dinámicamente el script de Maze solo tras consentimiento explícito del usuario.
 */
export function injectMaze() {
  if (window.mazeUniversalSnippetApiKey) return; // Ya cargado

  const apiKey = '3abaf64d-c2e8-45a7-b271-3e3b11cb09a5';
  const loaderUrl = 'https://snippet.maze.co/maze-universal-loader.js';

  (function (m, a, z, e) {
    var s, t, u, v;
    try {
      t = m.sessionStorage.getItem('maze-us');
    } catch (err) {}

    if (!t) {
      t = new Date().getTime();
      try {
        m.sessionStorage.setItem('maze-us', t);
      } catch (err) {}
    }

    u = document.currentScript || (function () {
      var w = document.getElementsByTagName('script');
      return w[w.length - 1];
    })();
    v = u && u.nonce;

    s = a.createElement('script');
    s.src = z + '?apiKey=' + e;
    s.async = true;
    if (v) s.setAttribute('nonce', v);
    a.getElementsByTagName('head')[0].appendChild(s);
    m.mazeUniversalSnippetApiKey = e;
  })(window, document, loaderUrl, apiKey);
}
