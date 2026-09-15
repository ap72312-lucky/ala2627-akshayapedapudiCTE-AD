// console-panel.js — a console you can see without the browser's developer tools.
//
// School Chromebooks block right-click > Inspect, so the browser's own console is out of
// reach. This file shows everything console.log prints, and every error, in a panel along
// the bottom of your page. Leave this file alone — your code goes in script.js.
(function () {
  var panel = document.createElement("section");
  panel.id = "console-panel";
  panel.setAttribute("aria-label", "Console");
  panel.innerHTML = '<div class="cp-head">Console</div><div class="cp-body"></div>';

  var css = document.createElement("style");
  css.textContent =
    "#console-panel{position:fixed;left:12px;right:12px;bottom:12px;max-height:28vh;overflow:auto;" +
    "background:#0b0f18;color:#e5e7eb;font:13px/1.55 ui-monospace,Menlo,Consolas,monospace;" +
    "border:1px solid #2a3142;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.35);z-index:9999}" +
    "#console-panel .cp-head{position:sticky;top:0;background:#141a28;padding:6px 10px;font-size:11px;" +
    "letter-spacing:.12em;text-transform:uppercase;color:#9aabd0}" +
    "#console-panel .cp-body{padding:6px 10px;min-height:1.6em}" +
    "#console-panel .cp-row{padding:2px 0;white-space:pre-wrap}" +
    "#console-panel .cp-err{color:#fca5a5}" +
    "body{padding-bottom:30vh}";

  function add(text, bad) {
    var row = document.createElement("div");
    row.className = bad ? "cp-row cp-err" : "cp-row";
    row.textContent = text;
    panel.querySelector(".cp-body").appendChild(row);
    panel.scrollTop = panel.scrollHeight;
  }

  function words(args) {
    return Array.prototype.map.call(args, function (a) {
      if (typeof a === "string") return a;
      try { return JSON.stringify(a); } catch (e) { return String(a); }
    }).join(" ");
  }

  var realLog = console.log, realError = console.error;
  console.log = function () { add(words(arguments), false); realLog.apply(console, arguments); };
  console.error = function () { add(words(arguments), true); realError.apply(console, arguments); };

  window.addEventListener("error", function (e) {
    var where = e.filename ? " (" + e.filename.split("/").pop() + ", line " + e.lineno + ")" : "";
    add(e.message + where, true);
  });

  function mount() { document.head.appendChild(css); document.body.appendChild(panel); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
