# Your landing page

**Step 0 — is this repo yours?**

Look at the name at the very top of this page. If it says **coltonsharp-dev / …** you are still
looking at Mr. Sharp's copy and nothing you do will save.

Go back to his repo, click the green **Use this template** button → **Create a new repository**,
choose **Public**, and create it. Then come back here — the name at the top should be
**your username**.

### Name it exactly like this

```
ala2627-firstnamelastnameCTE-AD
```

All one word for the name, no spaces, no punctuation. So Colton Sharp would be:

```
ala2627-coltonsharpCTE-AD
```

Type it carefully — **this name becomes part of your web address**, and it is a nuisance to change
later.

Everything below assumes you are in **your own** repo.

---

## What is in here — two projects, one codespace

| Folder | Project | Run it by |
|---|---|---|
| **root** — `index.html`, `styles.css` | Your landing page. This is what GitHub Pages puts on the internet. | Terminal: `python -m http.server 8000` |
| **`game/`** — `game.py` | The Vault, a text adventure. Its own README is in that folder. | Open the file, click **▶ Run** — or `python game/game.py` |

One codespace opens both. The `game/` folder is invisible to your website — Pages only serves
`index.html` from the root, so the two never interfere.

---

## 1. Open your codespace

A codespace is a real computer that runs in your browser. You get a terminal, Python, and a live
preview — none of which a normal text editor has.

1. Click the green **`< > Code`** button (top right of the file list).
2. Click the **Codespaces** tab.
3. Click **Create codespace on main**.

The first one takes a few minutes — it is building a machine from scratch. After that, the same
button reopens it in seconds.

> **You get a limited number of free hours each month, and it is plenty** — but when you are done
> for the day, go to **github.com/codespaces** and **Stop** it. It also stops itself after 30
> minutes of you not touching it.

---

## 2. Make it yours

Open `index.html` and change, in this order:

1. The `<title>` — this is the browser tab, and what a search engine shows.
2. The `<h1>` — your name.
3. The tagline under it.
4. Everything marked `CHANGE THIS` in a comment.

Then open `styles.css` and change `--accent` to a colour you actually like. One value, and the
whole page changes. That is what those variables are for.

---

## 3. See it while you work

In the terminal at the bottom of the screen, type:

```
python -m http.server 8000
```

A box pops up saying a port is available — click **Open in Browser**. Your page loads in a new tab.
Change a file, save, reload that tab, and your change is there.

**That terminal is now busy running the server.** To type another command, press **Ctrl+C** to stop
it, or click **+** to open a second terminal. It is not frozen.

---

## 4. Save it properly — this is the part people skip

Editing is not saving to GitHub. Your work is on that machine until you **commit** it.

1. Click **Source Control** in the left bar — the branch-looking icon. It shows a number: how many
   files you changed.
2. Type a message in the box. Say **what you changed**, not "update":
   - bad → `update`
   - good → `Change heading to my name and set the accent colour`
3. Click **Commit**, then **Sync Changes** (or the **…** menu → Push).

Now it is on GitHub with your name and a timestamp on it, permanently.

**Commit often** — every time you finish one thing. A commit is free and it is the only way back
if you break something.

---

## 5. Put it on the internet

Once, at the start:

1. Your repo → **Settings** → **Pages** (left sidebar).
2. **Source: Deploy from a branch**, Branch **main**, folder **/ (root)** → **Save**.
3. Wait a minute, refresh, and a URL appears.

Your page is then at:

```
https://YOUR-USERNAME.github.io/ala2627-firstnamelastnameCTE-AD/
```

so Colton Sharp's would be `https://coltonsharp.github.io/ala2627-coltonsharpCTE-AD/` — your
username first, then the repo name, spelled and capitalised **exactly** as you created it.

After that, every commit updates it automatically. Give it a minute. **Open it on your phone** —
that is the real test.

---

## Just need to fix one word?

You do not have to start a codespace. On your repo press **`.`** (period) — a lightweight editor
opens instantly.

It edits and commits, and that is all: **no terminal, no `python -m http.server`, no preview.**
Good for a typo. Use the codespace for real work.

---

## When something goes wrong

| What you see | What it actually is |
|---|---|
| Nothing saves / repo is not yours | Still in Mr. Sharp's copy. See Step 0. |
| Live URL 404s and the file is right | The repo name in the address is misspelled or mis-capitalised. It must match exactly. |
| Page is blank | A tag you never closed. Look for a `<p>` with no `</p>`. |
| Terminal will not take a command | The server is running in it. **Ctrl+C**, or open a second terminal with **+**. |
| Changes not on the live URL | You edited but did not **commit and push**. Check Source Control for a number. |
| Still not showing after pushing | Give it a minute, then hard-reload: **Ctrl+Shift+R**. |
| **404** on your Pages URL | The filename. It must be `index.html` — all lower case. `Index.html` will not serve. |
| Page loads with no styling | `styles.css` is missing or renamed. The name in the `<link>` must match the file exactly. |
| Codex will not sign in | It needs a **Plus, Pro, Business, Edu or Enterprise** ChatGPT plan. A free account cannot sign in. |

---

## What this is for

You will leave ALA. This page will not. It is not tied to a class, a school account, or a grade —
it is a URL you own and can hand to anyone. Keep committing to it.
