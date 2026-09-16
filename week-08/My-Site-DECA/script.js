// script.js — your Week 8 project. One file, four days.
// Work on ONE day's section at a time. Save (commit and push) at every save point.

// ─────────────── DAY 1 · Say hello ───────────────
// TODO: make JavaScript print a message in the console.
//       Your message shows in the Console panel at the bottom of your page.
//       Remove the two slashes at the start of the next line, then save and reload.
 console.log("Hello, World!");


// ─────────────── DAY 2 · Wire the click ───────────────
const button = document.querySelector("#action");
const output = document.querySelector("#output");

button.addEventListener("click", function () {
  const isVisible = output.classList.toggle("visible");
  button.textContent = isVisible ? "Hide links" : "Show links";
});


// ─────────────── DAY 3 · Make it YOUR thing ───────────────
// TODO 1: a variable that remembers something between clicks.
//         Put it HERE, at the top of this section, not inside a function.

// TODO 2: a function that changes the variable and shows the new value on the page.

// TODO 3: make the button run your function (you can replace the Day 2 listener).


// ─────────────── DAY 4 · Level up ───────────────
// ONE upgrade. Retype it and be able to explain every line.
