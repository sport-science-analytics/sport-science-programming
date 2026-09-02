const e={"how-python-reports-errors":{blocks:[{type:"md",md:`# Reading Error Messages

## Errors Are Python Talking to You

When your code breaks, Python prints a block of red text called a **traceback**. It is easy to read that wall of text as a telling-off -- a sign that you are not cut out for this. It is nothing of the sort. A traceback is the single most helpful thing Python does for you. It is a **map to the problem**: it tells you what went wrong, where it went wrong, and which line to look at. Without it you would be guessing in the dark.

Here is the part nobody mentions: professional programmers read tracebacks every single day. They do not memorise every error and avoid them; they make mistakes constantly, read the traceback, and fix the line it points to. That loop -- run, read the error, fix, run again -- *is* programming. The skill you are building in this module is not "never cause an error". It is "read the error calmly and know what to do next".

So when the red text appears, take a breath. Python is talking to you. This lesson teaches you to listen.

---

## Anatomy of a Traceback

Let us look at one real error from start to finish. Suppose you are estimating an athlete's VO2max from a 12-minute Cooper test, and you make a small typo:

\`\`\`python
# Estimate VO2max from a 12-minute Cooper test distance
distance_m = 2900
vo2max = (distance_m - 504.9) / 44.73
print(f"Estimated VO2max: {vo2nax:.1f} mL/kg/min")
\`\`\`

You created \`vo2max\` but typed \`vo2nax\` (an n instead of an m) in the print line. Run it, and Python prints:

\`\`\`
Traceback (most recent call last):
  File "script.py", line 4, in <module>
    print(f"Estimated VO2max: {vo2nax:.1f} mL/kg/min")
                               ^^^^^^
NameError: name 'vo2nax' is not defined. Did you mean: 'vo2max'?
\`\`\`

That is four pieces of information, and every piece earns its place:

- **\`Traceback (most recent call last):\`** -- the header. It simply announces "an error happened, here is the report".
- **\`File "script.py", line 4, in <module>\`** -- the **location**. It names the file and the exact line number where Python tripped.
- **\`print(f"...")\`** -- the **echo of the failing line**, with \`^^^^^^\` arrows pointing at the precise piece that caused the trouble.
- **\`NameError: name 'vo2nax' is not defined. Did you mean: 'vo2max'?\`** -- the **bottom line**, and the most important one. It gives the error *type* and a plain-English *message*.

Read those four pieces together and the story is complete: on line 4, you used a name \`vo2nax\` that was never created, and Python suspects you meant \`vo2max\`. The fix writes itself.

---

## Read From the Bottom Up

The traceback above is short. Real ones can be longer -- a dozen lines deep when the error happens inside a library. **Don't** read top to bottom. The habit that makes tracebacks easy is to read them **from the bottom up**:

1. **Last line first.** The very last line is the error *type* and *message*. This is what actually went wrong. Ninety percent of the time, it tells you everything you need.
2. **Then the line number.** Just above, find the \`File "...", line N\` that belongs to *your* code. That is *where* it went wrong.
3. **Then go up, only if needed.** If the error happened deep inside a library, the middle lines trace the path that led there. Start at the bottom, and only climb if the bottom two pieces are not enough.

Think of it like a detective arriving at a scene. You do not start by reading everyone's life story. You ask "what happened?" (the last line) and "where?" (the line number) first.

Here is a working example that computes VO2max correctly -- run it to see what clean output looks like before you see errors:`},{type:"example",caption:"Working Cooper-test VO2max estimate -- no error, clean output.",code:`# Estimate VO2max from a 12-minute Cooper test distance
distance_m = 2900
vo2max = (distance_m - 504.9) / 44.73
print(f"Estimated VO2max: {vo2max:.1f} mL/kg/min")`},{type:"md",md:`---

## The Errors You Will Meet

Every error has a **type**, and a handful of types cover almost everything you will see. You do not need to memorise them -- you need to *recognise* them.

### SyntaxError and IndentationError

A **SyntaxError** means Python could not even understand your code as Python -- the grammar is wrong. A classic case is a quote that never closes:

\`\`\`
SyntaxError: unterminated string literal
\`\`\`

An **IndentationError** is a close cousin, specifically about whitespace -- for example a line that starts with spaces Python did not expect:

\`\`\`
IndentationError: unexpected indent
\`\`\`

The key thing about both: they are caught **before the program runs**. Python reads your whole file first, and if the grammar is broken it refuses to start -- so *none* of your code executes.

### NameError

A **NameError** means you used a name that does not exist -- almost always a typo in a variable name, or using a variable before you created it. You met it in the walkthrough above. Compare the name in the message letter by letter against the name you defined.

### TypeError

A **TypeError** means you tried to do an operation on the wrong *type* of value -- like adding a number to a piece of text. This happens constantly when a value arrives from a CSV file as a string instead of a number:

\`\`\`
TypeError: can only concatenate str (not "int") to str
\`\`\`

Python will not guess whether you meant "glue text together" or "add numbers". The fix is to convert the text to a number first with \`int()\` or \`float()\`.`},{type:"exercise",id:"ex-4-28",title:"Fix the TypeError",domain:"physiology",description:"A height arrived from a CSV file as text. Fix the TypeError by converting it before the calculation.",initialCode:`height_cm = "191"   # arrived as a string from a CSV
extra_cm = 4
total = height_cm + extra_cm
print(total)`,expectedOutput:"195",hints:["Convert the text to a number before adding -- int() does the conversion.",`total = ___(height_cm) + extra_cm
print(total)`]},{type:"md",md:'### ValueError\n\nA **ValueError** means the *type* was right but the *value* itself was unacceptable. The classic case is trying to turn text that is not a number into a number: `int("42")` works, but `int("abstain")` gives\n\n```\nValueError: invalid literal for int() with base 10: \'abstain\'\n```\n\n### IndexError\n\nAn **IndexError** means you asked a list for a position that does not exist. Remember that list positions start at **0**, so a list of 8 items has indices 0 through 7 -- there is no index 8:\n\n```\nIndexError: list index out of range\n```\n\nThe fix: use a valid index. The last item is always at index `-1`, or `len(mylist) - 1`.'},{type:"exercise",id:"ex-4-30",title:"Fix the IndexError",domain:"biomechanics",description:"CMJ heights from 5 trials are stored in a list (indices 0-4). The code asks for index 5 (which does not exist). Fix it to correctly print the last trial.",initialCode:`cmj_heights = [38.2, 39.5, 40.1, 38.8, 41.0]
print(f"Last trial: {cmj_heights[5]} cm")`,expectedOutput:"Last trial: 41.0 cm",hints:["A 5-item list has indices 0-4. The last item is at index 4 -- or at index -1 from the end.",'print(f"Last trial: {cmj_heights[___]} cm")']},{type:"md",md:`### KeyError

A **KeyError** is the dictionary cousin of a NameError: you asked a dictionary for a key it does not have, almost always a mismatch between the key you typed and the key the data actually contains.

\`\`\`python
session = {"date": "2026-06-10", "sport": "Running", "avg_hr": 148}
print(session['avg_heartrate'])  # -> KeyError: 'avg_heartrate'
\`\`\`

The cure: print the real keys with \`session.keys()\`, compare, and use the one that exists (\`avg_hr\`).`},{type:"exercise",id:"ex-4-32",title:"Find the Missing Key",domain:"coaching",description:`A coach's dictionary has the RPE stored as "rpe_score", but the code looks for "rpe". Fix the key lookup so it calculates and prints the correct session load.`,initialCode:`session = {"athlete": "Nora", "duration_min": 80, "rpe_score": 6}
srpe = session["duration_min"] * session["rpe"]
print(f"Load: {srpe} AU")`,expectedOutput:"Load: 480 AU",hints:["The KeyError names the missing key; the dictionary on line 1 shows what that key is really called.",`srpe = session["duration_min"] * session["___"]
print(f"Load: {srpe} AU")`]},{type:"md",md:'---\n\n## Three Kinds of Problems\n\nThe errors above fall into three distinct families:\n\n- **Syntax errors** happen **before the program runs.** Python reads your file, finds grammar it cannot parse, and refuses to start. Nothing executes. `SyntaxError` and `IndentationError` live here.\n- **Runtime errors** (also called **exceptions**) happen **while the program runs.** The grammar was fine, so Python started executing -- and then hit something it could not do. `NameError`, `TypeError`, `ValueError`, `IndexError`, `KeyError` are all runtime errors.\n- **Logic errors** are the sneaky third kind: **the program runs perfectly and produces a wrong answer.** There is no traceback at all -- Python did exactly what you told it, but what you told it was not what you meant. No red text warns you; only checking the answer does.\n\nLogic errors are the hardest to catch precisely because Python does not flag them. Finding them is what the **debugging** lesson is about.\n\n## Summary\n\n| Error | Typical cause | First thing to check |\n|-------|---------------|----------------------|\n| `SyntaxError` | Missing bracket, quote, or other grammar | The line in the message (and the one above it) |\n| `IndentationError` | A line indented where Python did not expect it | The spaces at the start of the flagged line |\n| `NameError` | Typo in a variable, or used before defined | Spelling of the name against what you defined |\n| `TypeError` | Mixing types, e.g. text + number | The type of each value -- use `type()` |\n| `ValueError` | Right type, impossible value, e.g. `int("abstain")` | The actual value you passed in |\n| `IndexError` | List position that does not exist | The list\'s length vs the index (0-based!) |\n| `KeyError` | Dictionary key that does not exist | The real keys with `.keys()` |\n\nIn the next lesson, we learn to hunt down bugs systematically -- including the ones that give no error message at all.'}],quiz:{id:"quiz-4-1",title:"Reading Errors Quiz",questions:[{id:"q1",type:"multiple-choice",question:"When you read a traceback, where should you start?",options:[{value:"a",label:'At the very top, with the "Traceback (most recent call last)" header'},{value:"b",label:"At the very bottom -- the last line, which gives the error type and message"},{value:"c",label:"In the middle, wherever the longest line is"},{value:"d",label:"It does not matter; tracebacks are random"}],correctAnswer:"b",explanation:"Read from the bottom up. The last line gives the error type and a plain-English message -- what actually went wrong -- and is usually all you need. Then look just above for the line number to find where it happened."},{id:"q2",type:"multiple-choice",question:`In the last line "NameError: name 'vo2nax' is not defined", what does the part before the colon (NameError) tell you?`,options:[{value:"a",label:"The exact variable you should use instead"},{value:"b",label:"The line number where the error happened"},{value:"c",label:"The category of problem -- here, a name that does not exist -- while the message after the colon gives the specific details"},{value:"d",label:"Nothing useful; only the message after the colon matters"}],correctAnswer:"c",explanation:'The error TYPE (before the colon) tells you the category of problem -- a NameError is always "a name that does not exist". The MESSAGE (after the colon) fills in the specifics, such as which name. Together they tell you both what kind of mistake it is and exactly where to look.'},{id:"q3",type:"multiple-choice",question:'Your code crashes with: TypeError: can only concatenate str (not "int") to str. What went wrong?',options:[{value:"a",label:"A file could not be found on disk"},{value:"b",label:"You tried to combine a string and a number, e.g. a height read as text plus a number -- convert with int() or float() first"},{value:"c",label:"You misspelled a variable name"},{value:"d",label:"You used a list index that does not exist"}],correctAnswer:"b",explanation:'A TypeError means an operation was applied to the wrong type. "can only concatenate str ... to str" means you tried to add a number to text. The usual culprit is a value that came from a CSV as a string; convert it with int() or float() before doing arithmetic.'},{id:"q4",type:"multiple-choice",question:"Which error type is caught BEFORE the program starts running?",options:[{value:"a",label:"NameError"},{value:"b",label:"TypeError"},{value:"c",label:"SyntaxError"},{value:"d",label:"KeyError"}],correctAnswer:"c",explanation:"A SyntaxError (and its cousin IndentationError) is caught during parsing, before any code executes. If the grammar is broken, Python refuses to start -- none of your script runs. Runtime errors like NameError, TypeError, and KeyError happen while the program is executing."},{id:"q5",type:"multiple-choice",question:"Your script runs with no error message at all, but the average heart rate it prints is clearly wrong. What kind of problem is this?",options:[{value:"a",label:"A SyntaxError -- the grammar is broken"},{value:"b",label:"A logic error -- the code runs fine and produces no traceback, but does the wrong thing; you only notice by checking the answer"},{value:"c",label:"A FileNotFoundError -- the data file is missing"},{value:"d",label:"It is not a problem; if there is no traceback the answer must be correct"}],correctAnswer:"b",explanation:"This is a logic error. The code is valid Python and runs without complaint, but it does not do what you meant -- so there is no traceback to warn you. The only way to catch logic errors is to check whether the result actually makes sense, which is what systematic debugging is for."}]}},"debugging-strategies":{blocks:[{type:"md",md:`# Debugging

You can now read a traceback and recognise the common error types. This lesson is about the hardest case of all: the bug that gives you **no traceback** -- the code runs perfectly and hands you a confident, wrong answer. Catching those is a craft, and like any craft it has a method.

---

## Debugging Is Detective Work

A bug feels like magic when you first meet it: the computer is "doing something weird". It is not. The computer did exactly what you told it -- the gap is between what you told it and what you meant. **The bug is always explainable.** There is a specific line, a specific value, a specific assumption that is wrong, and it can be found.

The difference between hours of frustration and a five-minute fix is *method*. Guessing -- changing a line, re-running, changing another, re-running -- occasionally works, but mostly it just shuffles the problem around. **Systematic beats guessing every time.** A detective does not randomly accuse people; they gather evidence, narrow the suspects, and follow the trail to the one explanation that fits. Debugging is the same.

---

## Read the Error First

If there *is* a traceback, your first move costs nothing and is covered in full by the previous lesson: read it from the bottom up. The last line gives the error type and message (*what*); the line just above gives the file and line number (*where*). Most bugs that produce a traceback are solved right there, before any other technique. Only when there is no traceback -- a logic error -- do you need the heavier tools below.

---

## Print Debugging: The Workhorse

When the code runs but the answer is wrong, your most reliable tool is also the simplest: \`print()\`. You scatter a few print statements through the code to watch the values as they flow, and the bug reveals itself at the step where a value stops making sense.

Here is a worked example of the pattern -- correct code that prints intermediate checkpoints:`},{type:"example",caption:"Print debugging: add checkpoints to trace a calculation step by step.",code:`# session-RPE training load = duration (minutes) x RPE
duration_hours = 1.5
rpe = 6

print(f"[check] duration_hours = {duration_hours}")

# Convert hours to minutes before calculating
duration_min = duration_hours * 60
print(f"[check] duration_min = {duration_min}")

srpe = duration_min * rpe
print(f"[check] srpe = {srpe}")

print(f"Training load (sRPE): {srpe}")`},{type:"exercise",id:"ex-4-39",title:"Debug the Speed Formula",domain:"biomechanics",description:"This code should print average speed in m/s, but a 100 m sprinter is apparently slower than walking pace (the result is 0.11 m/s). The formula has numerator and denominator swapped. Fix it so it prints 9.52 m/s.",initialCode:`distance_m = 100
time_s = 10.5

speed = time_s / distance_m   # something is off here...
print(f"{speed:.2f} m/s")`,expectedOutput:"9.52 m/s",hints:["Speed is distance divided by time -- check which one is on top.",`speed = ___ / time_s
print(f"{speed:.2f} m/s")`]},{type:"md",md:`---

## Isolate the Problem

When a bug hides in a long script, do not stare at all of it at once. **Shrink the search space.** Two reliable moves:

- **Comment out and run smaller pieces.** Temporarily disable the lower half of your script and check that the first half produces what you expect. The bug is in the last piece you re-enabled before the output went wrong.
- **Test with tiny data you can verify by hand.** Do not hunt a bug on a dataset of 300 athletes whose correct answer you do not know. Run the same code on **3 athletes you can check by hand** -- compute the expected result on paper, then see whether the code agrees.

A mean of \`[10.5, 11.0, 10.0]\` should be \`10.5\`; if the code says something else, the bug is right in front of you, on data small enough to reason about completely. **Three athletes you can verify beats 300 you cannot.**`},{type:"example",caption:"Tiny test data: verify a mean calculation on 3 values you can check by hand.",code:`# Verify the mean on tiny data before scaling up
times = [10.5, 11.0, 10.0]
mean = sum(times) / len(times)
print(f"Mean: {mean}")

# By hand: (10.5 + 11.0 + 10.0) / 3 = 31.5 / 3 = 10.5
# Code agrees -- this piece is correct`},{type:"exercise",id:"ex-4-40",title:"Find the Logic Error",domain:"physiology",description:"The mean of three countermovement jump trials is calculated below. The code runs without any error, but the printed mean (58.6 cm) is higher than every single trial, which is impossible for a mean. Find the logic error and fix it so the correct mean prints.",initialCode:`cmj_1 = 38.2
cmj_2 = 40.1
cmj_3 = 39.0

mean_cmj = (cmj_1 + cmj_2 + cmj_3) / 2   # something is off here...
print(f"Mean CMJ: {mean_cmj:.1f} cm")`,expectedOutput:"Mean CMJ: 39.1 cm",hints:["A mean must lie between the smallest and the largest value. Count how many trials are summed, then check the division.",`mean_cmj = (cmj_1 + cmj_2 + cmj_3) / ___
print(f"Mean CMJ: {mean_cmj:.1f} cm")`]},{type:"md",md:`---

## Explain It Out Loud

There is a debugging technique with a silly name and a serious track record: **rubber-duck debugging**. You explain your code, line by line, out loud -- traditionally to a rubber duck on your desk, but a colleague, a pet, or the empty room works just as well. It sounds absurd, and it works disturbingly well. The reason is that talking forces a precision that silent reading lets you skip. When you have to *say it out loud*, the moment you reach the line where your spoken description does not match what the code actually does, you hear it. Before you ask anyone else for help, explain the problem aloud to yourself -- you will solve a surprising share of bugs mid-sentence.

---

## AI-Assisted Debugging

When you are genuinely stuck, an AI assistant is a powerful debugging partner -- but only if you give it what it needs. Paste **three things together**:

1. **The full traceback** -- all of it, copied verbatim.
2. **The relevant code** -- the block that failed.
3. **What you expected versus what you got** -- "this should print a speed around 9.5 m/s, but it prints 0.1".

With all three, an AI can usually pinpoint the problem fast. But here is the rule: **verify the suggested fix before you trust it.** Run the fix, and then check the number makes physical sense -- a sprint speed of 9.5 m/s is plausible; one of 950 m/s is not.

---

## Summary: The Debugging Checklist

When a bug appears, run this routine instead of guessing:

1. **Read the error.** If there is a traceback, read it from the bottom up.
2. **Reproduce it.** Make the bug happen reliably.
3. **Isolate it.** Shrink the search space -- comment out pieces, switch to tiny data.
4. **Inspect with prints.** Add \`print()\` checkpoints and find the first wrong value.
5. **Form a hypothesis.** State in one sentence what you believe the bug is.
6. **Fix it and re-run.** Apply the fix, run again, confirm the result is correct *and physically sensible*. Then remove your debug prints.

This six-step routine is the whole lesson in miniature. Follow it in order and debugging stops being magic and becomes method.

That completes this module. In the next module, Basics II, your code starts making decisions and repeating work: conditionals, loops, and functions, with your new debugging skills close at hand.`}],quiz:{id:"quiz-4-4",title:"Debugging Quiz",questions:[{id:"q1",type:"multiple-choice",question:"Your code stops with a traceback. What is the first thing you should do?",options:[{value:"a",label:"Start changing lines at random and re-running until it works"},{value:"b",label:"Read the error message -- from the bottom up -- for the error type, the message, and the line number"},{value:"c",label:"Delete the code and rewrite the whole script from scratch"},{value:"d",label:"Ignore the red text and run the code again in case it fixes itself"}],correctAnswer:"b",explanation:"When there is a traceback, reading it is the cheapest and most effective first move. Read from the bottom up: the last line gives the error type and message (what went wrong), and the line just above gives the line number (where). Most bugs that produce a traceback are solved right there."},{id:"q2",type:"multiple-choice",question:"What does print debugging reveal?",options:[{value:"a",label:"The Python version you are running"},{value:"b",label:"The intermediate values as the code runs, so you can find the first step where a value stops making sense"},{value:"c",label:"A guaranteed automatic fix for any bug"},{value:"d",label:"Nothing useful; print() is only for final output"}],correctAnswer:"b",explanation:"Print debugging lets you watch the values flowing through your code. By printing intermediate results at a few checkpoints, you find the first value that is wrong -- which pinpoints the step where the bug lives."},{id:"q3",type:"multiple-choice",question:"When you ask an AI assistant for help with a bug, what should you include?",options:[{value:"a",label:'Just the words "it does not work", with no other detail'},{value:"b",label:"The full traceback, the relevant code, and what you expected versus what you got -- and then verify the suggested fix before trusting it"},{value:"c",label:"Only the line number, nothing else"},{value:"d",label:"The whole project zipped up, with no explanation of the problem"}],correctAnswer:"b",explanation:"Give the AI the full traceback (verbatim), the relevant code, and your expected-versus-actual result so it understands both what happened and what you intended. Then verify the suggested fix yourself: run it and check the number makes physical sense. The AI proposes; you confirm."},{id:"q4",type:"multiple-choice",question:"Do logic errors produce a traceback?",options:[{value:"a",label:"Yes -- every bug always produces a traceback"},{value:"b",label:"No -- a logic error runs without any error message and simply produces a wrong answer; you only catch it by checking the result"},{value:"c",label:"Yes, but only on the second run"},{value:"d",label:"No -- logic errors stop Python from running the file at all"}],correctAnswer:"b",explanation:"A logic error is valid Python that runs cleanly but does the wrong thing, so there is no traceback to warn you -- only a confident, wrong number. That is exactly why they are the hardest bugs to catch and why techniques like print debugging, isolating with tiny data, and sanity-checking the result against the real world matter so much."}]}}};export{e as lessons};
