# ============================================================
#  THE VAULT — a text adventure
#
#  This already works. Run it before you change anything:
#
#      python game.py
#
#  You are not building a game from nothing. You are taking one
#  that runs and making it yours. That is how real software gets
#  written — you almost never start from an empty file.
#
#  Everything in here uses only what you already know from last
#  week: print(), input(), if / elif / else, and a while loop.
#  There is nothing new to learn before you can start.
# ============================================================


# ---- 1. STATE ------------------------------------------------
# "State" is just the stuff the game has to remember while it runs.
# Change these and the game starts differently — try it.

player_name = ""          # we ask for this at the start
room = "hall"             # where the player is right now
has_key = False           # True or False — do they have the key?
moves = 0                 # how many turns they have taken


# ---- 2. HELPERS ----------------------------------------------
# A function is a name for some lines you want to use more than
# once. `def` makes one. Writing this once beats pasting it into
# every room.

def say(text):
    """Print a message, then one blank line, so the screen breathes.

    Use plain print() for lines that belong TOGETHER, and say() for the
    last line of the thought. Calling say() on every line puts a gap
    between each one and the screen looks broken.
    """
    print(text)
    print()


def ask():
    """Ask the player what they want to do and hand back a tidy answer.

    .strip() removes spaces they typed by accident.
    .lower() means GO NORTH, go north and Go North all work the same.
    Without these two, your game feels broken even when your logic is right.
    """
    return input("> ").strip().lower()


# ---- 3. THE OPENING ------------------------------------------

print("=" * 44)
print("           THE VAULT")
print("=" * 44)
print()

player_name = input("What is your name, explorer? ").strip()
if player_name == "":
    player_name = "Nobody"          # they just pressed enter

print()
print("Welcome, " + player_name + ".")
print("You are standing in a dusty hall. There is a door NORTH")
print("and a rug on the floor you could LOOK under.")
say("Type HELP if you get stuck, or QUIT to give up.")


# ---- 4. THE GAME LOOP ----------------------------------------
# while True means "keep going forever". The only way out is break.
# Every turn: ask, then decide what that answer means.

while True:
    command = ask()
    moves = moves + 1

    # -- commands that work anywhere ------------------------
    if command == "quit":
        say("You walk away. " + player_name + " lasted " + str(moves) + " moves.")
        break

    elif command == "help":
        say("Try: LOOK, NORTH, SOUTH, TAKE KEY, OPEN VAULT, QUIT")

    # -- the hall -------------------------------------------
    elif room == "hall":
        if command == "look":
            if has_key:
                say("Just a rug, and the hole where the key was.")
            else:
                say("Under the rug: a small brass KEY.")

        elif command == "take key":
            if has_key:
                say("You already have it.")
            else:
                has_key = True
                say("You pocket the key. It is colder than it should be.")

        elif command == "north":
            room = "vault"
            print("You step into a room with a huge steel door. The VAULT.")
            say("There is a way back SOUTH.")

        else:
            say("You cannot do that here.")

    # -- the vault ------------------------------------------
    elif room == "vault":
        if command == "look":
            say("A steel door with a small keyhole. It is shut.")

        elif command == "south":
            room = "hall"
            say("Back in the dusty hall.")

        elif command == "open vault":
            if has_key:
                print("The key turns. The door swings open.")
                print("Inside: absolutely nothing. Someone beat you here.")
                say("You win anyway, " + player_name + " — in " + str(moves) + " moves.")
                break
            else:
                say("It is locked. You need a key.")

        else:
            say("You cannot do that here.")


# ============================================================
#  NOW MAKE IT YOURS
#
#  Do these in order. Run the game after EVERY one — if it
#  breaks you will know exactly which change did it.
#
#  1. Change the room descriptions so it is your world, not mine.
#
#  2. Add a third room. Copy the `elif room == "vault":` block,
#     change the room name, and give the hall a way to reach it.
#
#  3. Add something to pick up, the way has_key works. A lamp?
#     Then make one room too dark to LOOK in without it.
#
#  4. Add a limit: if moves gets past 20, something happens.
#
#  5. Give the player a real choice with two different endings.
#
#  COMMIT AFTER EACH ONE. That is your undo button.
# ============================================================
