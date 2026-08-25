# The Vault — a text adventure

**This game already works.** Your job is not to build one from nothing — it is to take one that
runs and make it yours. That is how real software actually gets written.

---

## Run it

Open `game.py`, then either:

- Click the **▶ Run** button, top right of the editor, **or**
- In the terminal: `python game/game.py`

Output shows up in the terminal panel at the bottom. Play all the way through — **win it, and lose
it.** You cannot improve something you have not seen work.

> Commands: `look`, `take key`, `north`, `south`, `open vault`, `help`, `quit`

---

## Make it yours

The list at the bottom of `game.py` tells you what to do, in order:

1. Rewrite the descriptions so it is **your** world
2. Add a third room
3. Add something to pick up
4. Add a move limit
5. Give the player two different endings

**Run it after every single change.** If it breaks you know exactly which change broke it. Change
five things and then run it, and you are hunting.

**Commit after each one** — Source Control → message → Commit → Sync. That is your undo button.

---

## When it breaks

| Python says | It means |
|---|---|
| `IndentationError` | Your spaces are wrong. Everything inside an `if` or `while` is indented **4 spaces**. |
| `SyntaxError: invalid syntax` | Usually a missing `:` at the end of an `if`/`elif`/`else`/`while`, or a missing quote. |
| `NameError: name 'x' is not defined` | A variable you never made, or spelled differently than when you made it. |
| Nothing happens when I type | Your `elif` never matched. Check spelling, and that it is lower case. |
| It never stops | Your `while` has no reachable `break`. |

**Read the last line of the error first** — it gives you the line number. Python is being helpful.
