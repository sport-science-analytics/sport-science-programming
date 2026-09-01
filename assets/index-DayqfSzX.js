const e={conditionals:{blocks:[{type:"md",md:'# Conditional Statements\n\n## Introduction\n\nIn sport science, decisions are everywhere: Is an athlete\'s heart rate in the correct training zone? Is their injury risk score above a threshold? Did they pass the fitness test? **Conditional statements** let your program make decisions based on data, executing different code depending on whether a condition is true or false.\n\n---\n\n## The `if` Statement and Comparison Operators\n\nThe simplest conditional runs a block of code only when a condition is true:\n\n```python\nif condition:\n    # this indented block runs only when condition is True\n```\n\n> **Key syntax rules:**\n> - The condition ends with a colon `:`\n> - The code block below it is **indented by 4 spaces**. In this editor, pressing the Tab key inserts exactly those 4 spaces.\n> - The indented block runs only when the condition is `True`\n\n**Comparison operators:**\n\n| Operator | Meaning | Sport science example |\n|----------|---------|----------------------|\n| `==` | Equal to | `sport == "Football"` |\n| `!=` | Not equal to | `position != "GK"` |\n| `<` | Less than | `time_s < 10.0` |\n| `>` | Greater than | `vo2max > 50` |\n| `<=` | Less than or equal | `rpe <= 7` |\n| `>=` | Greater than or equal | `lactate >= 4.0` |\n\nA common use: checking whether a measurement sets a new personal best. Run the example to see the verdict:'},{type:"example",caption:"Simple if: flag a sprint time as a new personal best.",code:`current_sprint_s = 4.51   # today's 40 m sprint time
personal_best_s  = 4.58   # previous best

if current_sprint_s < personal_best_s:
    print("New personal best!")`},{type:"exercise",id:"ex-3-10",title:"Heart Rate Ceiling Alert",domain:"coaching",description:'During a recovery session an athlete must keep their heart rate below the zone ceiling. Write an if statement that prints "Slow down!" when current_hr_bpm is above zone_ceiling_bpm, and nothing otherwise.',initialCode:`zone_ceiling_bpm = 152
current_hr_bpm = 168`,expectedOutput:"Slow down!",hints:["Compare current_hr_bpm with zone_ceiling_bpm using >.",`if current_hr_bpm > ___:
    print("Slow down!")`]},{type:"md",md:"---\n\n## `if`/`else` — Two Paths\n\nAn `else` branch runs when the `if` condition is false. Together they form a clean pass/fail decision:\n\n```python\nif condition:\n    # runs when True\nelse:\n    # runs when False\n```\n\nExample: applying a VO2max fitness standard to clear or flag an athlete:"},{type:"example",caption:"if/else: classify a VO2max against a minimum threshold.",code:`vo2max = 48.5          # mL/kg/min
threshold = 50.0       # minimum standard for the squad

if vo2max >= threshold:
    print("PASS: meets aerobic fitness standard")
else:
    print("FAIL: below aerobic fitness standard")`},{type:"exercise",id:"ex-3-11",title:"Fitness Threshold Pass/Fail",domain:"physiology",description:'A squad fitness test requires athletes to complete a 3-km time trial in 14 minutes or less. Write an if/else that prints "PASS" when the time is within the cutoff and "FAIL" otherwise.',initialCode:`time_trial_min = 14.3
cutoff_min = 14.0`,expectedOutput:"FAIL",hints:["PASS requires time_trial_min <= cutoff_min. Since 14.3 > 14.0, the else branch should run.",`if time_trial_min <= ___:
    print("PASS")
else:
    print("FAIL")`]},{type:"md",md:`---

## \`elif\` Chains — Multiple Categories

When you need more than two outcomes, add \`elif\` (else-if) branches. Python checks them **top to bottom** and stops at the first match:

\`\`\`python
if condition_1:
    ...
elif condition_2:
    ...
elif condition_3:
    ...
else:
    ...          # fallback if nothing matched
\`\`\`

**Order matters:** Python stops at the first condition that matches, so arrange the thresholds in order. Blood lactate is a classic example: below 2 mmol/L is easy work, 2 to 4 is threshold work, and above 4 is hard:`},{type:"example",caption:"elif chain: classify session intensity from blood lactate.",code:`lactate_mmol = 3.1

if lactate_mmol < 2.0:
    intensity = "Easy"
elif lactate_mmol < 4.0:
    intensity = "Threshold"
else:
    intensity = "Hard"

print(f"Lactate {lactate_mmol} mmol/L -> {intensity} session")`},{type:"exercise",id:"ex-3-1",title:"Heart Rate Zone Classifier",domain:"physiology",description:`Write a program that classifies a heart rate into one of 5 training zones:
1. Calculate max HR with the Tanaka formula (208 - 0.7 * age) and store it in hr_max.
2. Calculate the percentage of max HR and store it in hr_percentage.
3. Classify it into zone: Zone 1 <60%, Zone 2 60-69%, Zone 3 70-79%, Zone 4 80-89%, Zone 5 90%+.
4. Print the percentage and the zone.
Any clear print format is fine.`,initialCode:`age = 28
current_hr_bpm = 168`,testCode:`assert abs(hr_max - 188.4) < 0.01, f"hr_max should be 188.4 (Tanaka), got {hr_max}"
assert abs(hr_percentage - 89.17) < 0.05, f"hr_percentage should be about 89.2, got {hr_percentage}"
assert zone == 4, f"89.2% of max falls in Zone 4, got {zone}"
print("PASS")`,hints:["Calculate hr_max = 208 - 0.7 * age and hr_percentage = current_hr_bpm / hr_max * 100, then use an if-elif-else chain on hr_percentage.",`hr_max = 208 - 0.7 * age
hr_percentage = current_hr_bpm / hr_max * 100

if hr_percentage < 60:
    zone = 1
elif hr_percentage < 70:
    zone = 2
elif hr_percentage < 80:
    zone = ___
elif hr_percentage < 90:
    zone = 4
else:
    zone = 5

print(hr_percentage)
print(zone)`]},{type:"md",md:'---\n\n## Boolean Logic: `and`, `or`, `not`\n\nCombine conditions with the three boolean operators:\n\n| Operator | Meaning | Example |\n|----------|---------|---------|\n| `and` | **Both** must be true | `is_fit and is_available` |\n| `or` | **At least one** must be true | `high_rpe or injured` |\n| `not` | **Flips** true/false | `not is_injured` |\n\nUse parentheses to make compound conditions easy to read:\n\n```python\nif (rpe_score > 8) and (sleep_hours < 6):\n    print("High combined risk")\n```\n\nA condition does not have to live inside an `if`. A comparison such as `sleep_hours < 6` evaluates to `True` or `False`, which is a value like any other, so you can store it in a variable:\n\n```python\nis_ready = (wellness_score >= 6) and (not is_injured)\nprint(is_ready)   # True or False\n```\n\nBooleans stored this way make good named flags: the variable name states the question, and the value holds the answer.\n\nRun the example to see a readiness rule that combines them:'},{type:"example",caption:"Boolean logic: one readiness rule combining and with not.",code:`wellness_score = 7      # 1-10 self-report
sleep_hours = 7.5
is_injured = False

if (wellness_score >= 6) and (sleep_hours >= 7) and (not is_injured):
    print("Green light: full training")`},{type:"exercise",id:"ex-3-12",title:"Training Readiness Flag",domain:"psychology",description:"An athlete is ready to train if their wellness score is at least 6 AND they are not carrying a reported injury. Write an if/else that checks both conditions in one boolean expression and sets ready_to_train to True or False, then print it.",initialCode:`wellness_score = 7      # 1-10 self-report
has_injury = False`,testCode:`assert ready_to_train is True, f"Expected True, got {ready_to_train}"
print("PASS")`,hints:["Two conditions joined with and: the wellness check and the absence of injury (use not).",`if (wellness_score >= 6) and (not ___):
    ready_to_train = True
else:
    ready_to_train = False
print(ready_to_train)`]},{type:"md",md:"---\n\n## Nested Conditions — Decisions Inside Decisions\n\nAny conditional can be placed inside another: a plain `if`, or a whole `if`/`elif`/`else` chain, can sit inside an `if` branch, an `elif` branch, or an `else` branch. This is useful when a second decision only makes sense after the first one has been made:\n\n```python\nif outer_condition:\n    if inner_condition:\n        # both conditions true\n    else:\n        # outer true, inner false\nelse:\n    # outer condition false\n```\n\n**Tip:** limit nesting to 2-3 levels. Deeper nesting is hard to read; consider refactoring into separate conditions or a function.\n\nA realistic example: squad selection requires the athlete to be medically cleared **and** either be a veteran **or** pass a performance test:"},{type:"example",caption:"Nested if: squad selection with medical and performance gates.",code:`medically_cleared = True
is_veteran        = False
performance_score = 82     # out of 100

if medically_cleared:
    if is_veteran or performance_score >= 80:
        status = "Selected"
    else:
        status = "Not selected (performance)"
else:
    status = "Not selected (medical hold)"

print(status)`},{type:"exercise",id:"ex-3-13",title:"Squad Selection Gate",domain:"biomechanics",description:'An athlete can be selected for the squad if they are medically cleared AND their CMJ height is above 35 cm. Print "Selected" if both hold. If cleared but CMJ is too low, print "Needs strength work". If not cleared, print "Medical hold". Use a nested if.',initialCode:`medically_cleared = True
cmj_cm = 33.5`,expectedOutput:"Needs strength work",hints:['The outer if checks medically_cleared; the inner if checks cmj_cm > 35. An outer else handles "Medical hold".',`if medically_cleared:
    if cmj_cm > ___:
        print("Selected")
    else:
        print("Needs strength work")
else:
    print("Medical hold")`]},{type:"md",md:`---

## Membership Testing with \`in\`

The \`in\` operator checks whether a value is a member of a collection (list, tuple, set, or string). It pairs naturally with conditionals:

\`\`\`python
high_load_positions = ["Centre-back", "Centre-mid", "Forward"]
position = "Centre-mid"

if position in high_load_positions:
    print("Apply high-load monitoring protocol")
\`\`\`

\`not in\` is the inverse — true when the value is *not* in the collection.

This is much cleaner than chaining multiple \`or\` comparisons:

\`\`\`python
# Verbose (avoid)
if position == "Centre-back" or position == "Centre-mid" or position == "Forward":
    ...

# Clean (prefer)
if position in ["Centre-back", "Centre-mid", "Forward"]:
    ...
\`\`\`

Run the example to see membership testing in a real team-sport context:`},{type:"example",caption:"Membership testing: flag a high-load position.",code:`high_load_positions = ["Centre-back", "Centre-mid", "Forward", "Wing-back"]

position = "Centre-mid"
if position in high_load_positions:
    print(f"{position}: HIGH load monitoring")
else:
    print(f"{position}: standard monitoring")

position = "Goalkeeper"
if position in high_load_positions:
    print(f"{position}: HIGH load monitoring")
else:
    print(f"{position}: standard monitoring")`},{type:"exercise",id:"ex-3-14",title:"High-Load Position Check",domain:"coaching",description:`A GPS monitoring protocol applies to players in high-load positions. Write an if/else that prints "Fit GPS vest" when the player's position is in the gps_positions list and "No GPS required" otherwise.`,initialCode:`gps_positions = ["Centre-mid", "Forward", "Wing-back"]
player_position = "Forward"`,expectedOutput:"Fit GPS vest",hints:["The in operator tests whether a value is in a list.",`if player_position in ___:
    print("Fit GPS vest")
else:
    print("No GPS required")`]},{type:"md",md:`---

## Putting It All Together

The real power comes from combining these tools. A single decision can check membership, use boolean logic, and classify with an \`elif\` chain — all in a clean, readable flow.

### The Ternary Operator (Bonus)

For very simple one-line decisions, Python has a compact inline form:

\`\`\`python
# result = value_if_true if condition else value_if_false
label = "Fast" if sprint_s < 5.0 else "Slow"
\`\`\`

Use it sparingly, only when the condition is genuinely simple. For anything more complex, a regular \`if\`/\`else\` is clearer.

Three more exercises follow to consolidate what you have learned:`},{type:"exercise",id:"ex-3-15",title:"VO2max Fitness Category",domain:"physiology",description:'Classify a VO2max score into one of three categories using a simple (age-independent) standard: "Elite" for >= 60, "Good" for >= 50, and "Developing" for anything below 50. Assign the label to a variable category and print it.',initialCode:"vo2max = 53.4   # mL/kg/min",expectedOutput:"Good",hints:["Check >= 60 first (Elite), then >= 50 (Good), then let else handle Developing. 53.4 falls in the 50-59 range.",`if vo2max >= 60:
    category = "Elite"
elif vo2max >= ___:
    category = "Good"
else:
    category = "Developing"

print(category)`]},{type:"exercise",id:"ex-3-16",title:"Overreaching Flag",domain:"psychology",description:"An athlete is showing overreaching symptoms. Set the variable overreaching to True if BOTH of the following are true: perceived_fatigue >= 8 AND mood_score <= 3. Then print it.",initialCode:`perceived_fatigue = 9   # 1-10 scale (higher = more fatigue)
mood_score = 2          # 1-10 scale (lower = worse mood)`,testCode:`assert overreaching is True, f"Expected True, got {overreaching}"
print("PASS")`,hints:["Join the two comparisons with and -- both must be True for the flag to be True.",`overreaching = (perceived_fatigue >= 8) and (mood_score <= ___)
print(overreaching)`]},{type:"exercise",id:"ex-3-17",title:"Class Register Check",domain:"teaching",description:`A PE teacher keeps a register of enrolled students.
1. Check whether student is in class_list.
2. If they are enrolled and assignment_delivered is True, print "Approved".
3. If they are enrolled but the assignment is not delivered, print "Missing assignment".
4. If they are not enrolled at all, print "Not enrolled".`,initialCode:`class_list = ["Emma", "Jonas", "Sofie", "Martin", "Ingrid",
              "Sander", "Nora", "Oskar", "Maja", "Lars",
              "Sigrid", "Erik", "Thea", "Henrik", "Amalie"]
student = "Jonas"
assignment_delivered = False`,expectedOutput:"Missing assignment",hints:["Use in for the membership check, then a second condition for the assignment. A nested if inside the enrolled branch works well.",`if student in class_list:
    if assignment_delivered:
        print("Approved")
    else:
        print("___")
else:
    print("Not enrolled")`]},{type:"md",md:`---

## Common Pitfalls

**Using \`=\` instead of \`==\`:**

\`\`\`python
# Correct: == compares
if score == 10:

# Wrong: = assigns, so this is a SyntaxError
if score = 10:
\`\`\`

**Forgetting the colon:**

\`\`\`python
# Correct:
if age > 18:

# Wrong: missing colon, SyntaxError
if age > 18
\`\`\`

**Inconsistent indentation:**

\`\`\`python
# Correct: both prints inside the if
if hr > 180:
    print("High HR")
    print("Take a break")

# Wrong: the second print drifts, IndentationError
if hr > 180:
    print("High HR")
      print("Take a break")
\`\`\``},{type:"md",md:"---\n\n## Summary\n\n| Concept | Syntax | When to use |\n|---------|--------|-------------|\n| Simple if | `if condition:` | Run code only when a condition is met |\n| if/else | `if ...: else:` | Choose between two paths |\n| elif chain | `if ...: elif ...: else:` | Classify into multiple categories |\n| Boolean and | `if a and b:` | Both conditions must be true |\n| Boolean or | `if a or b:` | At least one must be true |\n| Boolean not | `if not a:` | Flip a boolean flag |\n| Nested if | `if a: if b:` | Decisions that depend on earlier decisions |\n| Membership | `if x in collection:` | Check group membership |\n| Ternary | `x = a if cond else b` | One-line simple assignment |\n\nConditionals are the foundation of decision-making in code. In the next lesson, you will learn about loops, which let you repeat actions, like processing every athlete on a team or every data point in a time series."}],quiz:{id:"quiz-3-1",title:"Conditionals Quiz",questions:[{id:"q1",type:"multiple-choice",question:"How does Python work through an if/elif/else chain?",options:[{value:"a",label:"It runs every branch whose condition is true"},{value:"b",label:"It checks the conditions top to bottom and runs only the first branch whose condition is true"},{value:"c",label:"It always runs the else branch as well"},{value:"d",label:"It automatically picks the branch with the strictest condition"}],correctAnswer:"b",explanation:"Python checks the conditions from the top and stops at the first one that is true; the remaining conditions are never even checked. The else branch runs only when nothing above it matched. This is why the order of the conditions matters."},{id:"q2",type:"multiple-choice",question:"A readiness rule should trigger when at least one of two warning signs is present. Which boolean operator belongs between the two conditions?",options:[{value:"a",label:"and"},{value:"b",label:"or"},{value:"c",label:"not"},{value:"d",label:"=="}],correctAnswer:"b",explanation:'or is true when at least one side is true, which matches "at least one warning sign". and would demand both warning signs at the same time, and not flips a single condition rather than combining two.'},{id:"q3",type:"multiple-choice",question:"What will this code print?",code:`hr = 165

if hr > 180:
    print("Zone 5")
elif hr > 160:
    print("Zone 4")
else:
    print("Zone 3")`,options:[{value:"a",label:"Zone 5"},{value:"b",label:"Zone 4"},{value:"c",label:"Zone 3"},{value:"d",label:"Error"}],correctAnswer:"b",explanation:'165 is not above 180, so the first branch is skipped. 165 is above 160, so the elif branch runs and prints "Zone 4". The else branch never gets a turn.'}]}},"for-loops":{blocks:[{type:"md",md:`# Loops

## Introduction

Loops repeat work for you. This lesson covers both of Python's loops: the **for loop**, which does most of the everyday work, and the **while loop**, which repeats until a condition is met.

A **for loop** repeats a block of code for each item in a sequence. This is essential in sport science where you need to process every athlete on a team, every measurement in a time series, or every trial in an experiment. The loop variable takes on each value in turn; you never have to track an index by hand.

---

## Iterating Over a List

The basic pattern iterates over any sequence (list, tuple, string):

\`\`\`python
for item in collection:
    # this block runs once per item
\`\`\`

> **Syntax rules:**
> - The loop header ends with a colon \`:\`
> - The body is indented (4 spaces, or one press of the Tab key)
> - The loop variable (\`item\`) is created automatically and updated each iteration

A classic first use: printing every athlete in a squad roster.`},{type:"example",caption:"Basic for loop: greet every athlete in a squad.",code:`squad = ["Haaland", "De Bruyne", "Foden", "Rodri", "Walker"]

for athlete in squad:
    print(f"Processing data for {athlete}")`},{type:"exercise",id:"ex-3-20",title:"Print Sprint Times",domain:"coaching",description:'A coach recorded 40 m sprint times for five athletes. Loop through the list and print each time formatted to 2 decimal places with the label "Sprint: X.XX s".',initialCode:"sprint_times_s = [4.52, 4.68, 4.41, 4.77, 4.55]",expectedOutput:`Sprint: 4.52 s
Sprint: 4.68 s
Sprint: 4.41 s
Sprint: 4.77 s
Sprint: 4.55 s`,hints:["Use for time in sprint_times_s: and an f-string with the :.2f format specifier.",`for time in sprint_times_s:
    print(f"Sprint: {___:.2f} s")`]},{type:"md",md:`---

## The Accumulator Pattern

A loop body runs once per item and then forgets everything, so how do you compute something that spans the *whole* list, like a total or a count? The answer is the **accumulator pattern**: create a variable **before** the loop, update it a little on every iteration, and read the final result **after** the loop.

\`\`\`python
total = 0
for value in data:
    total += value
average = total / len(data)
\`\`\`

This is one of the most important ideas in all of programming, because it is how a loop builds up an answer instead of just repeating an action. Sums, counts, running totals, maxima, collected lists: they are all the same three-step shape. Start with an empty accumulator (0 for a sum, an empty list for collecting), let every item contribute its small part, and the answer is waiting for you when the loop ends. Once you recognise the shape, you will see it everywhere: it is also exactly what pandas shortcuts like \`.mean()\` and \`.sum()\` do for you under the bonnet.`},{type:"example",caption:"Accumulator: total and average weekly running distance.",code:`daily_km = [8.5, 12.0, 0, 10.5, 6.0, 15.0, 0]  # 0 = rest day

total_km = 0
training_days = 0

for km in daily_km:
    total_km += km
    if km > 0:
        training_days += 1

avg_per_day = total_km / training_days
print(f"Total: {total_km} km")
print(f"Training days: {training_days}")
print(f"Average per training day: {avg_per_day:.1f} km")`},{type:"exercise",id:"ex-3-21",title:"Process Training Sessions",domain:"coaching",description:`Given a list of training sessions (each a dict with "day", "duration", and "rpe" keys):
1. Loop over the sessions and compute each session's sRPE (duration * RPE), collecting the values in a list srpe_values.
2. Accumulate the total into weekly_load.
3. Print the per-session values and the weekly total.
Any clear print format is fine.`,initialCode:`sessions = [
    {"day": "Monday",    "duration": 75,  "rpe": 7},
    {"day": "Tuesday",   "duration": 60,  "rpe": 9},
    {"day": "Wednesday", "duration": 40,  "rpe": 3},
    {"day": "Thursday",  "duration": 90,  "rpe": 6},
    {"day": "Friday",    "duration": 85,  "rpe": 8},
]`,testCode:`assert list(srpe_values) == [525, 540, 120, 540, 680], f"srpe_values should be [525, 540, 120, 540, 680], got {list(srpe_values)}"
assert weekly_load == 2405, f"weekly_load should be 2405, got {weekly_load}"
print("PASS")`,hints:['Two accumulators: an empty list for the values and a total starting at 0. Inside the loop: srpe = session["duration"] * session["rpe"], append it, and add it to the total.',`srpe_values = []
weekly_load = 0

for session in sessions:
    srpe = session["duration"] * session["___"]
    srpe_values.append(srpe)
    weekly_load += srpe
    print(session["day"], srpe)

print(weekly_load)`]},{type:"md",md:"---\n\n## `enumerate()` — Index and Value Together\n\nWhen you need both the position and the value, use `enumerate()`:\n\n```python\nfor i, value in enumerate(my_list):\n    print(i, value)   # i starts at 0\n```\n\nAdd a second argument to start the index at a different number: `enumerate(my_list, 1)` starts at 1 — perfect for trial or athlete numbering."},{type:"example",caption:"enumerate(): number each sprint trial from 1.",code:`sprint_times = [4.52, 4.61, 4.48, 4.95, 4.33]

for trial, t in enumerate(sprint_times, 1):
    flag = " <- BEST" if t == min(sprint_times) else ""
    print(f"Trial {trial}: {t} s{flag}")`},{type:"exercise",id:"ex-3-23",title:"Rank Jumpers",domain:"biomechanics",description:`A list of CMJ heights (cm) is already sorted best-to-worst. Use enumerate() starting at 1 to print each athlete's rank and height. Format: "Rank N: XX.X cm".`,initialCode:"cmj_heights = [45.2, 42.8, 41.0, 38.5, 36.1]",expectedOutput:`Rank 1: 45.2 cm
Rank 2: 42.8 cm
Rank 3: 41.0 cm
Rank 4: 38.5 cm
Rank 5: 36.1 cm`,hints:["enumerate(list, 1) yields (rank, value) pairs starting the count at 1.",`for rank, height in enumerate(cmj_heights, ___):
    print(f"Rank {rank}: {height} cm")`]},{type:"md",md:"---\n\n## Looping Over Dictionaries\n\nA dictionary's `.items()` method gives you `(key, value)` pairs. Looping over items lets you process every field in an athlete profile or every metric in a test result:\n\n```python\nfor key, value in my_dict.items():\n    print(key, value)\n```\n\nUse `.keys()` if you only need keys, and `.values()` if you only need values."},{type:"example",caption:"Loop over dict.items(): print an athlete's test battery.",code:`test_results = {
    "CMJ height":    "35.2 cm",
    "20m sprint":    "3.05 s",
    "Yo-Yo IR1":     "1840 m",
    "Grip strength": "52.3 kg",
}

for test, result in test_results.items():
    print(f"{test:<20} {result:>10}")`},{type:"md",md:`---

## Looping Over Real Data

Loops and pandas belong together. A DataFrame column can be looped over just like a list, so everything from this lesson applies directly to imported data:

\`\`\`python
import pandas as pd

df = pd.read_csv('data/sprint_times.csv')

for time_s in df['Sprint_40m_s']:
    print(time_s)
\`\`\`

(Pandas has built-in shortcuts like \`.mean()\` for the common cases, as you saw in Module 2, but writing the loop yourself shows exactly what those shortcuts do, and keeps your pandas skills warm.)`},{type:"exercise",id:"ex-3-24",title:"Loop Over Real Sprint Data",domain:"coaching",packages:["pandas"],dataFiles:["sprint_times.csv"],description:`The 40 m sprint times of 20 athletes are imported for you as a DataFrame.
1. Loop over the Sprint_40m_s column with an accumulator to compute the team mean, stored in mean_time_s. No .mean() here: build it yourself.
2. Loop again and count how many athletes are faster (lower) than the mean, stored in n_faster.
3. Print both.
Any clear print format is fine.`,initialCode:`import pandas as pd

df = pd.read_csv('data/sprint_times.csv')
print(df.head(3))`,testCode:`assert abs(mean_time_s - 4.605) < 0.005, f"mean_time_s should be 4.605, got {mean_time_s}"
assert n_faster == 11, f"11 athletes are faster than the mean, got {n_faster}"
print("PASS")`,hints:['A for loop iterates over df["Sprint_40m_s"] just like a list. Accumulate a total, then divide by len(df).',`total = 0
for t in df["Sprint_40m_s"]:
    total += t
mean_time_s = total / len(df)

n_faster = 0
for t in df["Sprint_40m_s"]:
    if t < ___:
        n_faster += 1

print(mean_time_s)
print(n_faster)`]},{type:"md",md:`---

## \`break\` and \`continue\`

Two keywords let you control the loop body mid-iteration:

| Keyword | Effect |
|---------|--------|
| \`break\` | Exit the loop immediately |
| \`continue\` | Skip the rest of this iteration; go to the next |

These are useful in sport science for stopping a simulation when a physiological limit is reached, or skipping invalid sensor readings.`},{type:"example",caption:"break + continue: process HR readings, skip artifacts, stop on max.",code:`hr_readings = [72, 85, -1, 110, 135, 155, 198, 175]

valid = []
for hr in hr_readings:
    if hr < 0:          # artifact
        continue
    if hr > 195:        # exceeded max: stop monitoring
        print(f"ALERT: HR = {hr} bpm - stopping")
        break
    valid.append(hr)

print(f"Valid readings: {valid}")
print(f"Average: {sum(valid) / len(valid):.0f} bpm")`},{type:"exercise",id:"ex-3-25",title:"Skip Missing GPS Values",domain:"physiology",description:'A GPS device recorded speeds (m/s) but some readings are None (signal lost). Use a for loop with continue to skip None values and collect the valid speeds in a list called valid_speeds. Then print "Valid readings: N" and "Mean speed: X.X m/s" (1 decimal place).',initialCode:"gps_speeds_ms = [3.2, None, 4.1, 3.8, None, 5.0, 4.6, None, 3.5]",expectedOutput:`Valid readings: 6
Mean speed: 4.0 m/s`,hints:["Inside the loop: if speed is None, continue -- the append below is then skipped. After the loop, use len() and sum()/len().",`valid_speeds = []
for speed in gps_speeds_ms:
    if speed is None:
        ___
    valid_speeds.append(speed)

print(f"Valid readings: {len(valid_speeds)}")
print(f"Mean speed: {sum(valid_speeds) / len(valid_speeds):.1f} m/s")`]},{type:"md",md:`---

## List Comprehensions (Compact Loops)

A list comprehension creates a new list in one line:

\`\`\`python
# Traditional:
result = []
for x in data:
    result.append(expression)

# Comprehension:
result = [expression for x in data]
\`\`\`

Add an optional filter: \`[expr for x in data if condition]\`. Use comprehensions for simple transformations; a regular loop is clearer for complex logic.`},{type:"example",caption:"List comprehension: convert sprint times from seconds to km/h.",code:`# 100 m sprint times in seconds
times_s = [9.58, 10.12, 10.45, 9.83, 10.30]

# Convert to km/h: speed = 100m / time_s * 3.6
speeds_kmh = [round(100 / t * 3.6, 1) for t in times_s]
print(speeds_kmh)

# Filter: only keep times under 10.0 s
elite = [t for t in times_s if t < 10.0]
print(f"Elite times (< 10 s): {elite}")`},{type:"exercise",id:"ex-3-26",title:"Convert GPS Speeds",domain:"biomechanics",packages:["pandas"],dataFiles:["gps_speeds.csv"],description:"A small GPS recording is imported for you as a DataFrame with speeds in m/s. Use a list comprehension over the Speed_ms column to convert every value to km/h (multiply by 3.6), rounded to 1 decimal place. Assign the result to speeds_kmh and print it.",initialCode:`import pandas as pd

df = pd.read_csv('data/gps_speeds.csv')
print(df.head(3))`,testCode:`expected = [round(float(s) * 3.6, 1) for s in df['Speed_ms']]
assert list(speeds_kmh) == expected, f"Expected {expected}, got {list(speeds_kmh)}"
print("PASS")`,hints:['A comprehension iterates over a DataFrame column just like a list: [expression for s in df["Speed_ms"]].',`speeds_kmh = [round(s * ___, 1) for s in df["Speed_ms"]]
print(speeds_kmh)`]},{type:"md",md:`## Dictionary Comprehensions

The same compact syntax builds dictionaries. Swap the square brackets for curly braces and write each entry as \`key_expr: value_expr\`:

\`\`\`python
# Traditional:
times_ms = {}
for split, t in times_s.items():
    times_ms[split] = t * 1000

# Comprehension:
times_ms = {split: t * 1000 for split, t in times_s.items()}
\`\`\`

One companion tool is worth knowing here: when the keys and the values start out as two separate lists, \`zip(keys, values)\` pairs them element by element, first with first, second with second, giving the comprehension exactly the pairs it needs.`},{type:"example",caption:"Dictionary comprehensions: transform an existing dict, or build one from two lists with zip().",code:`# Transform: sprint splits from seconds to milliseconds
times_s  = {"10m": 1.83, "20m": 2.87, "30m": 3.78, "40m": 4.65}
times_ms = {split: round(t * 1000) for split, t in times_s.items()}
print(times_ms)

# Build from two lists: pair test names with percentiles
tests = ["cmj", "sprint_20m", "yo_yo", "grip"]
percentiles = [75, 68, 82, 71]
lookup = {test: pct for test, pct in zip(tests, percentiles)}
print(lookup["cmj"])`},{type:"md",md:`---

## While Loops: Repeat Until a Condition

A **while loop** repeats a block of code as long as a condition is true. Unlike a for loop, which walks through a known sequence, a while loop is the right tool when you cannot know the number of iterations in advance: monitoring an athlete until they reach exhaustion, or repeating a calculation until a target is reached.

\`\`\`python
counter = 0
while counter < 5:
    print(counter)
    counter += 1
\`\`\`

> **Key rule:** something inside the loop must eventually make the condition False. Forgetting to update the condition variable creates an **infinite loop** that never stops.

\`break\` and \`continue\` work in while loops exactly as they do in for loops.`},{type:"example",caption:"While: how many training weeks to reach 10 000 km lifetime.",code:`weekly_km = 60     # km per training week
total_km = 0
weeks = 0

while total_km < 10000:
    weeks += 1
    total_km += weekly_km

print(f"Weeks to 10 000 km: {weeks}")
print(f"Total after {weeks} weeks: {total_km} km")`},{type:"exercise",id:"ex-3-27",title:"Ramp Up Speed",domain:"physiology",description:'A treadmill starts at 8 km/h and increases by 1 km/h each stage until it reaches 14 km/h. Use a while loop to print each stage speed in the format "Stage: X km/h".',initialCode:"speed_kmh = 8",expectedOutput:`Stage: 8 km/h
Stage: 9 km/h
Stage: 10 km/h
Stage: 11 km/h
Stage: 12 km/h
Stage: 13 km/h
Stage: 14 km/h`,hints:["Loop while speed_kmh <= 14: print, then increase speed_kmh by 1. Without the increment the loop never ends.",`while speed_kmh <= 14:
    print(f"Stage: {speed_kmh} km/h")
    speed_kmh += ___`]},{type:"exercise",id:"ex-3-28",title:"Recovery Time Calculator",domain:"physiology",description:'Simulate heart rate recovery after exercise. Starting at 185 bpm, HR decreases by 7% each minute. Use a while loop to count how many minutes it takes to drop below 100 bpm. Print "Minute N: X bpm" (whole bpm) for each minute, then a blank line and "Recovery time: N minutes".',initialCode:`hr_bpm = 185
target_bpm = 100
decay = 0.07
minutes = 0`,expectedOutput:`Minute 1: 172 bpm
Minute 2: 160 bpm
Minute 3: 149 bpm
Minute 4: 138 bpm
Minute 5: 129 bpm
Minute 6: 120 bpm
Minute 7: 111 bpm
Minute 8: 104 bpm
Minute 9: 96 bpm

Recovery time: 9 minutes`,hints:["Loop while hr_bpm > target_bpm: increment minutes, update hr_bpm = hr_bpm * (1 - decay), and print with the :.0f format specifier.",`while hr_bpm > target_bpm:
    minutes += 1
    hr_bpm = hr_bpm * (1 - ___)
    print(f"Minute {minutes}: {hr_bpm:.0f} bpm")

print()
print(f"Recovery time: {minutes} minutes")`]},{type:"md",md:`---

## For or While?

| Scenario | Best choice |
|---------|------------|
| Iterating over a known list | \`for\` |
| Repeating until a threshold is reached | \`while\` |
| Converging on a value (unknown iterations) | \`while\` |

When in doubt: if you already know the collection to iterate over, use \`for\`. If the stopping condition depends on a changing value, use \`while\`.

---

## Summary

| Concept | Syntax | Use case |
|---------|--------|---------|
| Basic for | \`for x in list:\` | Process every item |
| Accumulator | \`total += value\` | Running sums and counts |
| enumerate() | \`for i, x in enumerate(list, 1):\` | Need index and value |
| dict.items() | \`for k, v in d.items():\` | Loop over key-value pairs |
| break | \`break\` | Exit loop early |
| continue | \`continue\` | Skip current iteration |
| Comprehension | \`[expr for x in list]\` | Compact list building |
| Dict comprehension | \`{k: expr for k, v in d.items()}\` | Compact dictionary building |
| Basic while | \`while condition:\` | Repeat until the condition turns False |

Loops are among the most used tools in sport science programming: the same few lines process an entire team, season, or dataset.

In the next lesson, we wrap calculations in functions: named, reusable, and testable.`}],quiz:{id:"quiz-3-2",title:"Loops Quiz",questions:[{id:"q1",type:"true-false",question:"A for loop is the best choice when you do not know in advance how many times the loop should execute.",options:[{value:"true",label:"True"},{value:"false",label:"False"}],correctAnswer:"false",explanation:"A while loop is better for unknown iteration counts. For loops are best when iterating over a known sequence or a fixed number of times."}]}},functions:{blocks:[{type:"md",md:`# Functions

## Introduction

A **function** is a reusable block of code that performs a specific task. Functions let you name a calculation, call it from anywhere, and never write the same logic twice. In sport science you will write functions to calculate VO2max, estimate training load, convert units, classify performance, and more.

---

## Defining and Calling a Function

\`\`\`python
def function_name(parameter1, parameter2):
    """Docstring: what this function does."""
    # function body
    return result
\`\`\`

**Components:**
- \`def\` keyword starts the definition
- Name in snake_case
- **Parameters** (inputs) in parentheses
- Optional **docstring** (triple-quoted description)
- **return** sends a value back to the caller

Call it by name, passing actual **arguments**:

\`\`\`python
result = function_name(value1, value2)
\`\`\``},{type:"example",caption:"Define and call: calculate BMI from weight and height.",code:`def calculate_bmi(weight_kg, height_m):
    """Calculate Body Mass Index."""
    bmi = weight_kg / height_m ** 2
    return bmi

result = calculate_bmi(85, 1.82)
print(f"BMI: {result:.1f}")`},{type:"exercise",id:"ex-3-34",title:"Max Heart Rate Function",domain:"physiology",description:'Write a function called max_hr(age) that returns the estimated maximum heart rate using the Tanaka formula: 208 - 0.7 * age. Call it for ages 20, 30, and 40, and print each result rounded to 1 decimal place in the format "Age XX: XXX.X bpm".',initialCode:"",expectedOutput:`Age 20: 194.0 bpm
Age 30: 187.0 bpm
Age 40: 180.0 bpm`,hints:["Define the function with def and return the Tanaka formula, then loop over the three ages and print with :.1f.",`def max_hr(age):
    """Estimate max HR using the Tanaka formula."""
    return 208 - ___ * age

for age in [20, 30, 40]:
    print(f"Age {age}: {max_hr(age):.1f} bpm")`]},{type:"md",md:`---

## Parameters, Arguments, and Return Values

A function can return any value — a number, string, list, or even nothing (\`None\`). To return **multiple values**, list them after \`return\` separated by commas — Python packs them into a tuple, which you can unpack on the caller side:

\`\`\`python
def stats(values):
    return min(values), max(values), sum(values) / len(values)

lo, hi, avg = stats([4.5, 4.8, 4.2])
\`\`\``},{type:"example",caption:"Multiple return values: fastest, slowest, and average sprint time.",code:`def analyze_sprints(times):
    """Return (fastest, slowest, average) for a list of sprint times."""
    fastest = min(times)
    slowest = max(times)
    average = sum(times) / len(times)
    return fastest, slowest, average

fast, slow, avg = analyze_sprints([4.52, 4.61, 4.48, 4.95, 4.33])
print(f"Fastest: {fast} s")
print(f"Slowest: {slow} s")
print(f"Average: {avg:.2f} s")`},{type:"exercise",id:"ex-3-35",title:"Sprint Statistics",domain:"coaching",description:'Write a function sprint_stats(times) that returns a tuple of (fastest, slowest, mean). Call it on [5.42, 4.98, 5.21, 5.65, 5.10] and print all three values formatted to 2 decimal places as "Fastest: X.XX s", "Slowest: X.XX s", and "Mean:    X.XX s".',initialCode:"",testCode:`fast2, slow2, avg2 = sprint_stats([5.42, 4.98, 5.21, 5.65, 5.10])
assert abs(fast2 - 4.98) < 0.001, f"fastest wrong: {fast2}"
assert abs(slow2 - 5.65) < 0.001, f"slowest wrong: {slow2}"
assert abs(avg2 - 5.272) < 0.001, f"mean wrong: {avg2}"
print("PASS")`,hints:["Inside the function, use min(times), max(times), and sum(times) / len(times), and return all three separated by commas.",`def sprint_stats(times):
    """Return (fastest, slowest, mean) for a list of sprint times."""
    fastest = min(times)
    slowest = ___(times)
    mean = sum(times) / len(times)
    return fastest, slowest, mean

fast, slow, avg = sprint_stats([5.42, 4.98, 5.21, 5.65, 5.10])
print(f"Fastest: {fast:.2f} s")
print(f"Slowest: {slow:.2f} s")
print(f"Mean:    {avg:.2f} s")`]},{type:"md",md:`---

## Default Parameter Values

A default parameter value is used when the caller does not supply that argument. Default values make functions flexible without forcing callers to always specify every option:

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

greet("Petter")           # uses default: "Hello, Petter!"
greet("Petter", "Hi")     # overrides: "Hi, Petter!"
\`\`\`

**Rule:** parameters with defaults must come **after** parameters without defaults.`},{type:"example",caption:"Default parameters: max HR estimate with an adjustable coefficient.",code:`def estimate_hr_max(age, coefficient=0.7):
    """Tanaka formula by default; adjust the coefficient if needed."""
    return 208 - coefficient * age

print(estimate_hr_max(30))                   # default: 187.0
print(estimate_hr_max(30, coefficient=0.8))  # custom:  184.0`},{type:"exercise",id:"ex-3-36",title:"VO2max Cooper Test Function",domain:"physiology",description:'Write a function vo2max_cooper(distance_m) that estimates VO2max from the Cooper 12-minute run test: VO2max = (distance_m - 504.9) / 44.73. Test it with distances of 2400, 2800, and 3200 metres, printing each result as "Distance: XXXXm -> VO2max: XX.X mL/kg/min" (1 decimal place).',initialCode:"",expectedOutput:`Distance: 2400m -> VO2max: 42.4 mL/kg/min
Distance: 2800m -> VO2max: 51.3 mL/kg/min
Distance: 3200m -> VO2max: 60.3 mL/kg/min`,hints:["The function body is a single return line using the given formula. Then loop over the three distances.",`def vo2max_cooper(distance_m):
    """Estimate VO2max from the Cooper 12-min run test."""
    return (distance_m - 504.9) / ___

for d in [2400, 2800, 3200]:
    print(f"Distance: {d}m -> VO2max: {vo2max_cooper(d):.1f} mL/kg/min")`]},{type:"md",md:`---

## The DRY Principle — Don't Repeat Yourself

If you write the same logic twice, extract it into a function. DRY code:
- has one authoritative place for each calculation
- is easier to update (change one function, not many copies)
- is easier to test

**The rule of three:** when you write the same logic a third time, it is time to make a function.`},{type:"example",caption:"DRY: extract BMI calculation and classification into two functions.",code:`def calculate_bmi(weight_kg, height_m):
    return weight_kg / height_m ** 2

def classify_bmi(bmi):
    if bmi < 18.5: return "Underweight"
    if bmi < 25.0: return "Normal"
    if bmi < 30.0: return "Overweight"
    return "Obese"

athletes = [
    ("Haaland",  88.0, 1.94),
    ("Messi",    72.0, 1.70),
    ("O'Neal",  147.0, 2.16),
]

for name, w, h in athletes:
    bmi = calculate_bmi(w, h)
    cat = classify_bmi(bmi)
    print(f"{name}: BMI = {bmi:.1f} ({cat})")`},{type:"exercise",id:"ex-3-37",title:"Classify VO2max",domain:"physiology",description:'Write a function classify_vo2max(vo2max) that returns "Elite" for >= 60, "Good" for >= 50, "Average" for >= 40, and "Poor" for anything below. Test it by looping over [72.3, 54.1, 43.8, 38.2] and printing "X.X: Category".',initialCode:"",testCode:`assert classify_vo2max(72.3) == "Elite", f"72.3 wrong: {classify_vo2max(72.3)}"
assert classify_vo2max(54.1) == "Good", f"54.1 wrong: {classify_vo2max(54.1)}"
assert classify_vo2max(43.8) == "Average", f"43.8 wrong: {classify_vo2max(43.8)}"
assert classify_vo2max(38.2) == "Poor", f"38.2 wrong: {classify_vo2max(38.2)}"
print("PASS")`,hints:["Use an if-elif-else chain inside the function, returning the string label from each branch.",`def classify_vo2max(vo2max):
    """Classify VO2max into performance categories."""
    if vo2max >= 60:
        return "Elite"
    elif vo2max >= 50:
        return "___"
    elif vo2max >= 40:
        return "Average"
    else:
        return "Poor"

for v in [72.3, 54.1, 43.8, 38.2]:
    print(f"{v}: {classify_vo2max(v)}")`]},{type:"md",md:`---

## Functions That Call Other Functions

Functions are most powerful when they are composed — one function calls another. This is how you build up analysis pipelines from small, testable pieces.`},{type:"example",caption:"Composition: session_load and weekly_load build on each other.",code:`def session_load(duration_min, rpe):
    """Session RPE training load."""
    return duration_min * rpe

def weekly_load(sessions):
    """Total training load for a list of (duration, rpe) tuples."""
    total = 0
    for duration, rpe in sessions:
        total += session_load(duration, rpe)
    return total

week = [(75, 7), (60, 9), (40, 3), (90, 6), (85, 8)]
total = weekly_load(week)
print(f"Weekly load: {total} AU")`},{type:"exercise",id:"ex-3-38",title:"Training Load Calculator",domain:"coaching",description:`Write two functions:
1. session_load(duration, rpe): returns duration * rpe.
2. weekly_load(sessions): takes a list of (duration, rpe) tuples and returns the total.
Then print each session as "Duration: D min, RPE: R -> Load: L AU", a blank line, and "Total weekly load: N AU".`,initialCode:"week = [(75, 7), (60, 9), (40, 3), (90, 6), (85, 8)]",expectedOutput:`Duration: 75 min, RPE: 7 -> Load: 525 AU
Duration: 60 min, RPE: 9 -> Load: 540 AU
Duration: 40 min, RPE: 3 -> Load: 120 AU
Duration: 90 min, RPE: 6 -> Load: 540 AU
Duration: 85 min, RPE: 8 -> Load: 680 AU

Total weekly load: 2405 AU`,hints:["session_load is a one-line return. weekly_load loops through the tuples, calls session_load for each, and accumulates a total.",`def session_load(duration, rpe):
    return duration * rpe

def weekly_load(sessions):
    total = 0
    for duration, rpe in sessions:
        total += ___(duration, rpe)
    return total

for duration, rpe in week:
    load = session_load(duration, rpe)
    print(f"Duration: {duration} min, RPE: {rpe} -> Load: {load} AU")

print()
print(f"Total weekly load: {weekly_load(week)} AU")`]},{type:"md",md:`---

## Refactoring: Replace Repeated Code with Functions

When you see the same block of code copy-pasted, extract it. Spot the repeated pattern, wrap it in a \`def\`, and replace all copies with a call.`},{type:"example",caption:"Refactor: extract classify_intensity to avoid repeating if-elif-else.",code:`def classify_intensity(rpe):
    if rpe <= 3: return "Low"
    if rpe <= 6: return "Moderate"
    return "High"

def session_summary(duration, rpe):
    load = duration * rpe
    intensity = classify_intensity(rpe)
    return load, intensity

sessions = [(75, 7), (60, 4), (40, 2)]
for i, (dur, rpe) in enumerate(sessions, 1):
    load, intensity = session_summary(dur, rpe)
    print(f"Session {i}: Load={load}, Intensity={intensity}")`},{type:"exercise",id:"ex-3-39",title:"Refactor Repeated Code",domain:"coaching",description:`The commented-out code shows the repeated pattern you are replacing.
1. Write session_load(duration, rpe).
2. Write classify_intensity(rpe): "Low" for RPE 1-3, "Moderate" for 4-6, "High" for 7-10.
3. Use one loop with enumerate(sessions, 1) to print "Session N: Load=L, Intensity=I" for each session.`,initialCode:`# BEFORE: repeated code (shown for reference -- do not uncomment)
# load_1 = 75 * 7
# intensity_1 = "High"
# print(f"Session 1: Load={load_1}, Intensity={intensity_1}")
# ...the same three lines repeat for sessions 2 and 3...

sessions = [(75, 7), (60, 4), (40, 2)]`,expectedOutput:`Session 1: Load=525, Intensity=High
Session 2: Load=240, Intensity=Moderate
Session 3: Load=80, Intensity=Low`,hints:["Write the two small functions, then a single loop with enumerate(sessions, 1) replaces all three repeated blocks.",`def session_load(duration, rpe):
    return duration * rpe

def classify_intensity(rpe):
    if rpe <= 3:
        return "Low"
    elif rpe <= ___:
        return "Moderate"
    else:
        return "High"

for i, (duration, rpe) in enumerate(sessions, 1):
    load = session_load(duration, rpe)
    intensity = classify_intensity(rpe)
    print(f"Session {i}: Load={load}, Intensity={intensity}")`]},{type:"md",md:`---

## Scope — Local vs Global Variables

A variable created **inside** a function is **local** — it only exists while that function runs. A variable created **outside** any function is **global** — it is visible everywhere.

\`\`\`python
squad_name = "Red Squad"   # global

def greet_squad():
    msg = "Ready!"         # local — disappears after function returns
    print(f"{squad_name}: {msg}")

greet_squad()
# print(msg)  # NameError — msg does not exist here
\`\`\`

Best practice: pass data in through parameters and receive it back through \`return\` rather than relying on global variables.`},{type:"example",caption:"Scope: local result lives only inside the function.",code:`TANAKA_A = 208     # global constant (conventional UPPER_CASE)
TANAKA_B = 0.7

def hr_max(age):
    result = TANAKA_A - TANAKA_B * age   # local variable
    return result

print(hr_max(25))
print(hr_max(35))
# print(result)   # would raise NameError`},{type:"exercise",id:"ex-3-40",title:"Percent of Best Function",domain:"physiology",description:'Write a function percent_of_best(current_cm, previous_cms) that expresses the current jump height as a percentage of the best previous jump: current / max(previous) * 100. Return 0.0 if previous_cms is empty. Test with current_cm = 36.4 and previous_cms = [38.1, 40.0, 37.5]. Print the result as "Percent of best: X.X%" (1 decimal place).',initialCode:"",testCode:`assert abs(percent_of_best(36.4, [38.1, 40.0, 37.5]) - 91.0) < 0.001, "36.4 against a best of 40.0 should be 91.0"
assert percent_of_best(35.0, []) == 0.0, "an empty history should return 0.0"
print("PASS")`,hints:["Guard the empty-list case first (return 0.0), then find the best with max() and return the percentage.",`def percent_of_best(current_cm, previous_cms):
    """Return the current jump as a percentage of the season best."""
    if len(previous_cms) == 0:
        return 0.0
    best = ___(previous_cms)
    return current_cm / best * 100

result = percent_of_best(36.4, [38.1, 40.0, 37.5])
print(f"Percent of best: {result:.1f}%")`]},{type:"exercise",id:"ex-3-41",title:"Fitness Report Function",domain:"coaching",description:`Write a function print_athlete_report(name, vo2max, sprint_s, cmj_cm) that prints a formatted three-line report:
  Athlete: NAME
  VO2max: X.X mL/kg/min
  Sprint: X.XX s | CMJ: X.X cm
Call it for "Lena" with vo2max=56.3, sprint_s=4.71, cmj_cm=38.5.`,initialCode:"",expectedOutput:`Athlete: Lena
VO2max: 56.3 mL/kg/min
Sprint: 4.71 s | CMJ: 38.5 cm`,hints:["The function body is three print() calls with f-strings, using :.1f and :.2f format specifiers.",`def print_athlete_report(name, vo2max, sprint_s, cmj_cm):
    """Print a three-line formatted athlete report."""
    print(f"Athlete: {name}")
    print(f"VO2max: {vo2max:.1f} mL/kg/min")
    print(f"Sprint: {sprint_s:.2f} s | CMJ: {___:.1f} cm")

print_athlete_report("Lena", 56.3, 4.71, 38.5)`]},{type:"md",md:`---

## Type Hints and Docstrings (Best Practice)

Type hints (optional) tell readers what types to expect. Docstrings (strongly recommended) explain what the function does, its parameters, and what it returns.

\`\`\`python
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Calculate Body Mass Index.

    Parameters:
        weight_kg: Body mass in kilograms
        height_m: Standing height in metres

    Returns:
        BMI in kg/m²
    """
    return weight_kg / height_m ** 2
\`\`\`

Well-documented functions make your code usable by colleagues — and by future you.`},{type:"example",caption:"Full-quality function: hr_recovery_time with docstring and type hints.",code:`def hr_recovery_time(hr_start: float, hr_target: float, decay: float = 0.08) -> int:
    """Estimate minutes to recover from hr_start to hr_target.

    Parameters:
        hr_start:  Starting (post-exercise) heart rate in bpm
        hr_target: Target (recovery) heart rate in bpm
        decay:     Proportional HR drop per minute (default 0.08)

    Returns:
        Number of whole minutes to reach hr_target
    """
    minutes = 0
    hr = hr_start
    while hr > hr_target:
        hr *= (1 - decay)
        minutes += 1
    return minutes

print(hr_recovery_time(190, 130))           # default decay
print(hr_recovery_time(190, 130, decay=0.1)) # faster recovery`},{type:"exercise",id:"ex-3-42",title:"Speed Conversion Functions",domain:"biomechanics",description:`Write two functions with type hints and docstrings:
- ms_to_kmh(speed_ms: float) -> float: multiply by 3.6
- kmh_to_ms(speed_kmh: float) -> float: divide by 3.6

Test by converting 5.0 m/s to km/h and 18.0 km/h to m/s. Print the results to 1 decimal place as "18.0 km/h" and "5.0 m/s".`,initialCode:"",testCode:`assert abs(ms_to_kmh(5.0) - 18.0) < 0.001, f"ms_to_kmh wrong: {ms_to_kmh(5.0)}"
assert abs(kmh_to_ms(18.0) - 5.0) < 0.001, f"kmh_to_ms wrong: {kmh_to_ms(18.0)}"
print("PASS")`,hints:["Each function is a single return line: multiply by 3.6 one way, divide by 3.6 the other.",`def ms_to_kmh(speed_ms: float) -> float:
    """Convert speed from m/s to km/h."""
    return speed_ms * 3.6

def kmh_to_ms(speed_kmh: float) -> float:
    """Convert speed from km/h to m/s."""
    return speed_kmh / ___

print(f"{ms_to_kmh(5.0):.1f} km/h")
print(f"{kmh_to_ms(18.0):.1f} m/s")`]},{type:"exercise",id:"ex-3-43",title:"Putting It Together: Team VO2max Report",domain:"physiology",description:`Write two functions:
1. vo2max_category(v) -- returns "Elite" (>=60), "Good" (>=50), "Average" (>=40), or "Poor" (below 40)
2. team_report(athletes) -- loops through a list of {"name": ..., "vo2max": ...} dicts and prints "NAME: X.X mL/kg/min (Category)" for each athlete.

Call team_report on the provided squad list.`,initialCode:`squad = [
    {"name": "Kwame",  "vo2max": 63.2},
    {"name": "Ingrid", "vo2max": 52.7},
    {"name": "Tomasz", "vo2max": 44.1},
    {"name": "Lena",   "vo2max": 38.5},
]`,expectedOutput:`Kwame: 63.2 mL/kg/min (Elite)
Ingrid: 52.7 mL/kg/min (Good)
Tomasz: 44.1 mL/kg/min (Average)
Lena: 38.5 mL/kg/min (Poor)`,hints:["vo2max_category is a chain of if-returns checking the thresholds from highest down. team_report loops over the dicts, looks up the category, and prints.",`def vo2max_category(v):
    if v >= 60:
        return "Elite"
    if v >= ___:
        return "Good"
    if v >= 40:
        return "Average"
    return "Poor"

def team_report(athletes):
    for a in athletes:
        cat = vo2max_category(a["vo2max"])
        name = a["name"]
        vo2 = a["vo2max"]
        print(f"{name}: {vo2:.1f} mL/kg/min ({cat})")

team_report(squad)`]},{type:"md",md:`---

## Summary

| Concept | Syntax | Purpose |
|---------|--------|---------|
| Define | \`def name(params):\` | Create a reusable block |
| Return single value | \`return value\` | Send result to caller |
| Return multiple | \`return a, b, c\` | Returns a tuple |
| Default parameter | \`def f(x, y=10):\` | Optional argument |
| Docstring | \`"""Description"""\` | Document intent |
| Type hints | \`def f(x: float) -> str:\` | Clarify expected types |
| DRY | Extract repeated logic | One function, many calls |

Functions are the foundation of organized, reusable sport science code. Start small — one function per calculation — and compose them into larger analyses.

That completes this module. In the next module, we take our first full pass at real data analysis: cleaning missing data, describing datasets, and building plots.`}],quiz:{id:"quiz-3-4",title:"Functions Quiz",questions:[{id:"q1",type:"multiple-choice",question:"A function is defined as def hr_zone(hr, hr_max, num_zones=5). What does the =5 mean?",options:[{value:"a",label:"num_zones must always be exactly 5"},{value:"b",label:"Callers may omit num_zones, in which case it defaults to 5"},{value:"c",label:"The function always returns 5"},{value:"d",label:"num_zones is a global variable set to 5"}],correctAnswer:"b",explanation:"A default parameter value is used when the caller does not supply that argument. hr_zone(155, 190) uses num_zones=5; hr_zone(155, 190, num_zones=3) overrides it."},{id:"q2",type:"true-false",question:"What is a docstring?",options:[{value:"true",label:"A triple-quoted description at the top of a function explaining what it does"},{value:"false",label:"A string value that every function must return"}],correctAnswer:"true",explanation:"A docstring is the triple-quoted text on the first line inside a function body. It documents what the function does, its parameters, and its return value -- help() displays it."},{id:"q3",type:"multiple-choice",question:"What does the DRY principle stand for?",options:[{value:"a",label:"Do Repeat Yourself"},{value:"b",label:"Don't Repeat Yourself"},{value:"c",label:"Data Requires Yielding"},{value:"d",label:"Debug, Refactor, Yield"}],correctAnswer:"b",explanation:`DRY stands for "Don't Repeat Yourself." It means extracting repeated code into reusable functions to avoid duplication.`},{id:"q4",type:"multiple-choice",question:"What will this function return? def analyze(times): return min(times), max(times) -- then result = analyze([4.5, 4.8, 4.2])",options:[{value:"a",label:"A list: [4.2, 4.8]"},{value:"b",label:"A tuple: (4.2, 4.8)"},{value:"c",label:"Just the first value: 4.2"},{value:"d",label:"An error"}],correctAnswer:"b",explanation:"When a function returns multiple values separated by commas, Python automatically packs them into a tuple. The result is (4.2, 4.8)."},{id:"q5",type:"true-false",question:"A variable defined inside a function is accessible from outside that function.",options:[{value:"true",label:"True"},{value:"false",label:"False"}],correctAnswer:"false",explanation:"Variables defined inside a function are local. They only exist while the function is running and cannot be accessed from outside."}]}}};export{e as lessons};
