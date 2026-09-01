const e={"variables-and-types":{blocks:[{type:"md",md:"# Variables and Data Types\n\n## Introduction\n\nIn Module 1 you created your first variables and did arithmetic with them. This lesson completes the picture. In sport science you work with different types of data -- an athlete's name (text), their age (whole number), their VO2max (decimal number), whether they passed a fitness test (true/false) -- and Python has a **data type** for each.\n\n## Creating Variables\n\nIn Python, you create a variable by choosing a name and using the `=` sign to assign a value. Use **snake_case** for variable names (words separated by underscores, all lowercase):\n\n| Rule | Good Example | Bad Example |\n|------|-------------|-------------|\n| Start with a letter or underscore | `sprint_time` | `1st_sprint` |\n| Only letters, numbers, underscores | `vo2_max` | `vo2-max` |\n| Case-sensitive | `Speed` != `speed` | -- |\n| No Python keywords | `max_force` | `class`, `print` |"},{type:"example",code:`athlete_name = "Usain Bolt"   # str -- text in quotes
age = 25                       # int -- whole number
height_m = 1.95                # float -- decimal number
is_sprinter = True             # bool -- True or False
lactate_threshold = None       # None -- missing/unknown value

print(type(age))               # <class 'int'>
print(type(height_m))          # <class 'float'>`,caption:"Python has five fundamental data types. Use type() to check which one you have."},{type:"exercise",id:"ex-2-25",title:"Store Athlete Data",domain:"physiology",description:`Store this athlete in four variables of the right types:
1. name = "Erling Haaland" (string)
2. age = 24 (whole number)
3. height_m = 1.94 (decimal number)
4. is_captain = False (boolean)
Then print each one with an f-string; any clear label works.`,initialCode:"",testCode:`assert name == "Erling Haaland", "name should be the full name as a string"
assert age == 24 and isinstance(age, int), "age should be the whole number 24"
assert abs(height_m - 1.94) < 1e-9, "height_m should be 1.94"
assert is_captain is False, "is_captain should be the boolean False"
print("PASS")`,hints:["Strings need quotes; True and False are written without quotes.",`name = "Erling Haaland"
age = 24
height_m = ___
is_captain = ___
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height_m} m")
print(f"Captain: {is_captain}")`]},{type:"md",md:"## Type Conversion\n\nSometimes you need to convert between types. This is common when reading data from files, where all values arrive as strings.\n\nUse `int()` and `float()` to convert strings to numbers. Use `str()` to convert a number to text. Note that converting a float to int **truncates** (drops the decimal) rather than rounding: `int(58.7)` gives `58`, not `59`."},{type:"example",code:`age_str = "25"
age = int(age_str)
print(age + 1)        # 26

vo2max = 58.7
print(int(vo2max))    # 58  (truncates, does not round!)

reps = 10
print(float(reps))    # 10.0`,caption:"int(), float(), and str() convert between types. Truncation is a common source of bugs -- use round() if you need rounding."},{type:"exercise",id:"ex-2-26",title:"Type Conversions",domain:"physiology",description:"The CSV values below arrived as strings, so Python cannot calculate with them yet. Convert weight_str to a number stored in weight_kg, and height_str to a number stored in height_cm. Then print both values.",initialCode:`weight_str = "82.5"
height_str = "185"`,testCode:`assert not isinstance(weight_kg, str), "weight_kg is still a string - convert it with float()"
assert abs(weight_kg - 82.5) < 1e-9, f"weight_kg should be 82.5, got {weight_kg}"
assert not isinstance(height_cm, str), "height_cm is still a string - convert it with float()"
assert abs(height_cm - 185) < 1e-9, f"height_cm should be 185, got {height_cm}"
print("PASS")`,hints:["float() turns a numeric string into a number you can calculate with.",`weight_kg = float(weight_str)
height_cm = ___(height_str)
print(weight_kg)
print(height_cm)`]},{type:"md",md:"## Arithmetic with Variables\n\nIn Module 1 you calculated with `+`, `-`, `*`, and `/`, and two more operators were mentioned in passing: `**` (power) and `//` (whole-number division, which discards the remainder). Here is the full set in use. They chain, and parentheses control the order, just like in algebra.\n\nYou can also reassign a variable at any time. The old value is simply replaced. A common pattern is to update a variable using its own current value: `score = score + 10` or the shorthand `score += 10`.\n\nThe example below puts the operators to work on a real formula, the **free-fall equation** for estimating jump height from flight time:\n\n```\njump_height = (g × flight_time²) / 8\n```\n\nHere `g` = 9.81 m/s² is the acceleration due to gravity. The athlete rises for half the flight time and falls for the other half, and inserting t/2 into the free-fall distance formula h = ½ g t² is what produces the division by 8."},{type:"example",code:`# Jump height from flight time (free-fall formula)
GRAVITY_MS2 = 9.81
flight_time_s = 0.70
jump_height_m = (GRAVITY_MS2 * flight_time_s ** 2) / 8
print(f"Jump height: {jump_height_m:.2f} m")   # Jump height: 0.60 m

# Reassignment
score = 0
score += 10   # same as: score = score + 10
print(score)  # 10`,caption:"Arithmetic operators follow standard precedence. Use ** for powers and () to control order."},{type:"exercise",id:"ex-2-27",title:"Arithmetic with Variables",domain:"biomechanics",description:"Calculate vertical jump height from flight time using the free-fall formula shown above: jump_height_m = (9.81 * flight_time_s ** 2) / 8. Print the result rounded to 2 decimal places: round(___, 2).",initialCode:"flight_time_s = 0.52",expectedOutput:"0.33",hints:["** is the power operator; wrap the value in round(value, 2) when printing.",`jump_height_m = (9.81 * flight_time_s ** 2) / ___
print(round(jump_height_m, 2))`]},{type:"exercise",id:"ex-2-28",title:"Reassign and Update",domain:"coaching",description:"The first session load is calculated below. Update rpe to 8 and duration_min to 60 for the second session, recalculate session_load, and print it.",initialCode:`rpe = 6
duration_min = 45
session_load = rpe * duration_min

# Second session: update both variables, recalculate, print
`,expectedOutput:"480",hints:["Assign the new values to the same names, then recalculate the load.",`rpe = 8
duration_min = ___
session_load = rpe * duration_min
print(session_load)`]},{type:"md",md:'## Printing on Several Lines\n\nEvery call to `print()` produces exactly one line of output, so a multi-line report is simply several print calls in a row, printed top to bottom. Two small tricks make such reports look tidy:\n\n- A line of plain text works as a **header**. Something like `"=== Test Report ==="` is just a string; the equals signs are only decoration that makes the heading stand out in the output.\n- `print()` with nothing between the brackets prints an **empty line**, useful as a spacer between sections.'},{type:"example",code:`print("=== Test Report ===")
print("Athlete: Ingrid")
print()
print("CMJ: 34.2 cm")
print("Sprint 20 m: 3.21 s")`,caption:"Each print() is one line: a header, a blank spacer from print(), then the values."},{type:"md",md:'## f-Strings (Formatted String Literals)\n\nThe modern way to include variables in strings is the **f-string**: put an `f` before the opening quote and wrap any variable or expression in `{}`.\n\nLook back at the session load exercise above. `print(session_load)` prints a bare `480`, a number with no explanation. With one f-string, the print can say what the number is:\n\n```python\nsession_load = 480\nprint(f"Session load is {session_load}")   # Session load is 480\n```\n\nYou can also control formatting inside the `{}`: `:.1f` shows 1 decimal place, `:.0f` rounds to a whole number, `:.2f` shows 2 decimal places.'},{type:"example",code:`athlete = "Katie Ledecky"
event = "800m Freestyle"
time = 493.56

print(f"{athlete} swam the {event} in {time} seconds")
# Katie Ledecky swam the 800m Freestyle in 493.56 seconds

vo2max = 58.743
print(f"VO2max: {vo2max:.1f} mL/kg/min")   # VO2max: 58.7 mL/kg/min`,caption:"f-strings embed variables directly. Add :.Nf inside {} to control decimal places."},{type:"exercise",id:"ex-2-29",title:"f-String Formatting",domain:"physiology",description:"Use ONE f-string print to produce exactly: Kipchoge: VO2max 54.3 mL/kg/min, HRmax 185 bpm",initialCode:`vo2max = 54.3
hr_max = 185
name = "Kipchoge"`,expectedOutput:"Kipchoge: VO2max 54.3 mL/kg/min, HRmax 185 bpm",hints:["Put f before the opening quote and wrap each variable in {}.",'print(f"{name}: VO2max {vo2max} mL/kg/min, HRmax {___} bpm")']},{type:"exercise",id:"ex-2-30",title:"Athlete Profile",domain:"physiology",description:`Build a small athlete profile from the given data:
1. Calculate BMI from height_cm and weight_kg.
2. Estimate HRmax with the Tanaka formula (208 - 0.7 * age).
3. Print the profile exactly as shown in the expected output: the header line, the name, BMI to 1 decimal, and HRmax to 0 decimals.`,initialCode:`name = "Ada Hegerberg"
age = 29
height_cm = 175
weight_kg = 68.0`,expectedOutput:`=== Athlete Profile ===
Name: Ada Hegerberg
BMI: 22.2 kg/m2
HRmax: 188 bpm`,hints:["BMI = weight / (height in metres) squared; HRmax = 208 - 0.7 * age.",`bmi = weight_kg / (height_cm / 100) ** 2
hr_max = 208 - 0.7 * age
print("=== Athlete Profile ===")
print(f"Name: {name}")
print(f"BMI: {bmi:.1f} kg/m2")
print(f"HRmax: {hr_max:.___f} bpm")`]},{type:"md",md:'## Summary\n\n| Data Type | Example | Sport Science Use |\n|-----------|---------|-------------------|\n| `int` | `25` | Age, repetitions, squad size |\n| `float` | `58.7` | VO2max, sprint times, force |\n| `str` | `"Bolt"` | Names, labels, notes |\n| `bool` | `True` | Pass/fail, injured yes/no |\n| `None` | `None` | Missing data |\n\nKey takeaways:\n- Use descriptive variable names in snake_case\n- Check types with `type()`\n- Convert between types with `int()`, `float()`, and `str()`\n- Use f-strings for formatted output -- add `:.Nf` to control decimal places\n\nIn the next lesson, we work with text: strings and their methods.'}],quiz:null},strings:{blocks:[{type:"md",md:`# Working with Strings

## Introduction

Strings are sequences of characters used to represent text. In sport science, strings appear everywhere: athlete names, team names, test descriptions, equipment labels, data file paths, and clinical notes. Learning to manipulate strings effectively will help you process and present your data professionally.

## Creating Strings

You can create strings with either single or double quotes -- both work the same way. For text that spans multiple lines, use triple quotes (\`"""\`).`},{type:"example",code:`name = "Simone Biles"       # Double quotes
sport = 'Gymnastics'        # Single quotes -- identical

report = """
Athlete: Simone Biles
Date: 2025-03-15
Notes: Excellent vault execution.
"""
print(report)`,caption:"Use single or double quotes interchangeably. Triple quotes allow multiline strings."},{type:"md",md:"## Cleaning Strings\n\nData from files often has extra spaces or newlines. The `.strip()` method removes whitespace from both ends of a string. Use `.lstrip()` or `.rstrip()` to strip only one side.\n\nCase methods let you standardise text: `.upper()`, `.lower()`, `.title()` (Title Case), and `.capitalize()` (first letter only)."},{type:"example",code:`raw = "  Mo Farah  \\n"
clean = raw.strip()
print(clean)   # Mo Farah

name = "usain bolt"
print(name.upper())    # USAIN BOLT
print(name.title())    # Usain Bolt`,caption:".strip() removes surrounding whitespace. Case methods standardise text for display or comparison."},{type:"exercise",id:"ex-2-32",title:"Clean Messy Data",domain:"teaching",description:"An athlete name was read from a file with extra whitespace and a newline. Strip the whitespace and print the clean name.",initialCode:'raw = "  Mo Farah  \\n"',expectedOutput:"Mo Farah",hints:[".strip() removes spaces and newlines from both ends.",`clean = raw.___()
print(clean)`]},{type:"md",md:"## Searching and Checking Strings\n\nPython provides several ways to search within strings. The `in` operator checks whether a substring exists (returns `True` or `False`). `.find()` returns the index where a substring starts (-1 if not found). `.startswith()` and `.endswith()` check the beginning and end."},{type:"example",code:`note = "Athlete reported knee pain after training"

print("knee" in note)              # True
print(note.startswith("Athlete"))  # True
print(note.find("pain"))           # 22
print(note.count("a"))             # 3`,caption:"The in operator is the fastest way to check for a substring. find() gives you the position."},{type:"exercise",id:"ex-2-33",title:"String Methods",domain:"coaching",description:'Print True or False for whether "hamstring" appears in the physio note, then print the note in title case for the medical report.',initialCode:'note = "physio cleared hamstring for full training"',expectedOutput:`True
Physio Cleared Hamstring For Full Training`,hints:["The in operator answers the yes/no; .title() capitalises each word.",`print("hamstring" in ___)
print(note.___())`]},{type:"md",md:"## Replacing Text\n\n`.replace(old, new)` returns a new string with every occurrence of `old` swapped for `new`. The original string is left untouched; you get back a corrected copy, which is exactly what you want when fixing a recording error."},{type:"example",code:`session = "warmup, drills, warmup"
print(session.replace("warmup", "sprints"))   # sprints, drills, sprints`,caption:".replace() swaps every occurrence and returns the result as a new string."},{type:"exercise",id:"ex-2-34",title:"Injury Note Replacement",domain:"coaching",description:'The injury note below was recorded with the wrong side. Replace "Left" with "Right" and print the updated note.',initialCode:'note = "Left ACL strain - grade 2"',expectedOutput:"Right ACL strain - grade 2",hints:[".replace(old, new) returns a new string with every occurrence swapped.",`updated = note.replace("___", "Right")
print(updated)`]},{type:"md",md:"## String Indexing and Slicing\n\nStrings are sequences, so you can access individual characters by position (starting from 0). Negative indices count from the end. Extract a portion with `[start:stop]` -- `stop` is exclusive (the character at that position is not included)."},{type:"example",code:`name = "Kipchoge"
#        01234567

print(name[0])    # K   (first character)
print(name[-1])   # e   (last character)
print(name[0:3])  # Kip (indices 0, 1, 2)
print(name[3:])   # choge (from index 3 to end)`,caption:"Indexing starts at 0. Slicing [start:stop] extracts a substring; stop is exclusive."},{type:"exercise",id:"ex-2-35",title:"String Slicing",domain:"biomechanics",description:'The session ID below encodes the date and athlete. Slice it to extract the date "2026-03-15" (indices 4 to 13) and the athlete code "A01" (index 15 onwards), then print each on its own line.',initialCode:'session_id = "CMJ-2026-03-15-A01"',expectedOutput:`2026-03-15
A01`,hints:["Count positions from 0; the stop index is not included.",`date = session_id[4:___]
athlete = session_id[15:]
print(date)
print(athlete)`]},{type:"md",md:"## Splitting, Joining, and Replacing\n\n`.split(sep)` breaks a string on the separator and returns a list (you used it briefly for file paths in Module 1). `sep.join(list)` is the reverse -- it joins a list of strings with `sep` as the glue. `.replace(old, new)` substitutes all occurrences of `old` with `new`."},{type:"example",code:`data = "Bolt,100m,9.58,Berlin"
parts = data.split(",")
print(parts)   # ['Bolt', '100m', '9.58', 'Berlin']

sports = ["Football", "Basketball", "Tennis"]
result = ", ".join(sports)
print(result)  # Football, Basketball, Tennis`,caption:"split() and join() are inverses. split() is essential for reading CSV-formatted data."},{type:"exercise",id:"ex-2-31",title:"Split the Athlete Record",domain:"physiology",description:'The comma-separated record below came straight from a CSV file. Split it into its six parts with .split(",") and print the resulting list. (Working with the individual parts is what the next lesson, on lists, is all about.)',initialCode:'data = "Marta Vieira,38,Football,Forward,1.63,60.0"',expectedOutput:"['Marta Vieira', '38', 'Football', 'Forward', '1.63', '60.0']",hints:['.split(",") breaks the string at every comma and returns the pieces.',`parts = data.split("___")
print(parts)`]},{type:"md",md:'## Summary\n\nKey string operations for sport science:\n\n| Operation | Syntax | Use Case |\n|-----------|--------|----------|\n| Concatenation | `+` or f-strings | Building labels and messages |\n| Split | `str.split(",")` | Parsing CSV data |\n| Join | `", ".join(list)` | Creating CSV output |\n| Strip | `str.strip()` | Cleaning file data |\n| Replace | `str.replace()` | Correcting data entries |\n| Format | `f"{val:.2f}"` | Formatting numeric output |\n| Upper/Lower | `str.upper()` | Standardising text data |\n| Slice | `str[2:8]` | Extracting substrings |\n\nIn the next lesson, we move from single values to collections: lists and tuples.'}],quiz:null},"lists-and-tuples":{blocks:[{type:"md",md:`# Lists and Tuples

## Introduction

So far, each variable has held a single value. But in sport science, you almost always work with **collections of data**: a series of sprint times, a list of athletes on a team, heart rate values recorded every second during a test. Python provides two key sequence types for this: **lists** and **tuples**.

## Lists

A list is an **ordered, mutable** (changeable) collection of items. Lists are created with square brackets \`[]\`. They are zero-indexed (the first element is at position 0). Negative indices count from the end.`},{type:"example",code:`sprint_times = [4.52, 4.61, 4.48, 4.95, 4.33]

print(sprint_times[0])    # 4.52 (first element)
print(sprint_times[-1])   # 4.33 (last element)
print(len(sprint_times))  # 5
print(min(sprint_times))  # 4.33
print(max(sprint_times))  # 4.95
print(sum(sprint_times))  # 27.89`,caption:"Lists store ordered sequences. len(), min(), max(), and sum() are essential for quick summaries."},{type:"exercise",id:"ex-2-37",title:"Manage Sprint Times",domain:"coaching",description:`From the 40 m sprint times below:
1. Find the fastest time and store it in fastest.
2. Find the slowest time and store it in slowest.
3. Calculate the average and store it in average.
Then print all three; any clear format is fine.`,initialCode:`# 40m sprint times (seconds)
sprint_times_s = [5.21, 4.98, 5.45, 5.12, 4.87, 5.33]`,testCode:`assert abs(fastest - 4.87) < 1e-9, "fastest should be the minimum: 4.87"
assert abs(slowest - 5.45) < 1e-9, "slowest should be the maximum: 5.45"
assert abs(average - 5.16) < 0.005, "average should be about 5.16"
print("PASS")`,hints:["min(), max(), and sum()/len() give the three statistics.",`fastest = min(sprint_times_s)
slowest = max(sprint_times_s)
average = sum(sprint_times_s) / len(sprint_times_s)
print(f"Fastest: {fastest} s")
print(f"Slowest: {slowest} s")
print(f"Average: {average:.___f} s")`]},{type:"md",md:"## Slicing Lists\n\nSlicing works the same way as with strings: `list[start:stop]` extracts elements from `start` up to (but not including) `stop`. This is perfect for isolating phases in time-series data -- warm-up, exercise, cool-down."},{type:"example",code:`hr_data = [72, 85, 110, 135, 155, 170, 182, 188, 190, 185, 160, 120, 90]

warm_up = hr_data[:4]      # First 4 values
print(warm_up)             # [72, 85, 110, 135]

cool_down = hr_data[-3:]   # Last 3 values
print(cool_down)           # [160, 120, 90]

exercise = hr_data[4:9]    # Indices 4 through 8
print(exercise)            # [155, 170, 182, 188, 190]`,caption:"Use slicing to extract phases from time-series data. stop is exclusive."},{type:"exercise",id:"ex-2-38",title:"Training Session Data",domain:"physiology",description:`Heart rate was recorded every minute for 10 minutes. From the list:
1. Store the resting HR (the first value) in resting_hr.
2. Store the peak HR (the maximum) in peak_hr.
3. Store the average HR in avg_hr.
4. Store the steady-state phase (indices 3 through 7) in steady_state.
Then print all four; any clear format is fine.`,initialCode:"hr_bpm = [72, 95, 128, 155, 168, 172, 175, 171, 158, 130]",testCode:`assert resting_hr == 72, "resting_hr is the first value"
assert peak_hr == 175, "peak_hr is the maximum"
assert abs(avg_hr - 142.4) < 0.05, "avg_hr should be about 142.4"
assert steady_state == [155, 168, 172, 175, 171], "steady_state is the slice [3:8]"
print("PASS")`,hints:["The first value is index 0; the slice [3:8] covers indices 3 to 7.",`resting_hr = hr_bpm[0]
peak_hr = max(hr_bpm)
avg_hr = sum(hr_bpm) / len(hr_bpm)
steady_state = hr_bpm[3:___]
print(f"Resting HR: {resting_hr} bpm")
print(f"Peak HR: {peak_hr} bpm")
print(f"Average HR: {avg_hr:.1f} bpm")
print(f"Steady state: {steady_state}")`]},{type:"md",md:'## Modifying Lists\n\nLists are mutable -- you can change elements, add new ones, and remove existing ones:\n\n- **Change**: `team[1] = "Haaland"` -- assign to an index\n- **Add to end**: `team.append("Mbappe")`\n- **Insert at position**: `team.insert(0, "Putellas")`\n- **Remove by value**: `team.remove("Neymar")` -- removes first occurrence\n- **Remove by index**: `team.pop(1)` -- removes and returns the element'},{type:"example",code:`team = ["Messi", "Ronaldo", "Neymar"]

team[1] = "Haaland"        # Replace index 1
team.append("Mbappe")      # Add to end
team.remove("Neymar")      # Remove by value
print(team)                # ['Messi', 'Haaland', 'Mbappe']`,caption:"Lists support in-place modification. .remove() deletes by value; .pop() deletes by index."},{type:"exercise",id:"ex-2-39",title:"Modify a Squad List",domain:"coaching",description:`Update the squad list in three steps:
1. Replace De Bruyne (index 1) with "Rodri".
2. Add "Mbappe" to the end.
3. Remove "Foden".
Then print the final list.`,initialCode:'squad = ["Haaland", "De Bruyne", "Foden"]',testCode:`assert squad == ['Haaland', 'Rodri', 'Mbappe'], f"squad should end as ['Haaland', 'Rodri', 'Mbappe'], got {squad}"
print("PASS")`,hints:["Assign to an index to replace; .append() adds to the end; .remove() deletes by value.",`squad[1] = "Rodri"
squad.append("___")
squad.remove("Foden")
print(squad)`]},{type:"exercise",id:"ex-2-40",title:"Slicing Training Data",domain:"physiology",description:"From the 10 weeks of training data, extract the peak training block (weeks 5-8, which are indices 4 to 7) into peak_block, then print its maximum.",initialCode:"weekly_km = [55, 62, 70, 68, 75, 80, 72, 65, 58, 50]",testCode:`assert peak_block == [75, 80, 72, 65], f"peak_block should be the slice [4:8], got {peak_block}"
print("PASS")`,hints:["Indices 4 to 7 need the slice [4:8] -- the stop index is exclusive.",`peak_block = weekly_km[4:___]
print(f"Peak block max: {max(peak_block)} km")`]},{type:"md",md:`## Tuples

A tuple is an **ordered, immutable** (unchangeable) collection. Tuples are created with parentheses \`()\`. They work like lists for reading and indexing, but you cannot add, remove, or change elements after creation.

Use tuples for **fixed records** -- things like a (name, date, score) test result that should not be accidentally modified. Tuple **unpacking** lets you assign all elements to separate variables in one line.`},{type:"example",code:`# Tuple for a fixed test record
test_result = ("Haaland", "2025-03-15", 58.2)

print(test_result[0])   # Haaland
print(test_result[-1])  # 58.2

# Unpack into individual variables
name, date, vo2max = test_result
print(name)    # Haaland
print(vo2max)  # 58.2`,caption:"Tuples are immutable records. Unpacking assigns all elements to separate variables in one line."},{type:"exercise",id:"ex-2-41",title:"Tuple Unpacking",domain:"biomechanics",description:"Unpack the test-result tuple into three variables -- name, date, vo2max -- then print them together in one sentence.",initialCode:'test_result = ("Kipchoge", "2026-03-15", 58.2)',testCode:`assert name == "Kipchoge", "name should hold the first element"
assert date == "2026-03-15", "date should hold the second element"
assert abs(vo2max - 58.2) < 1e-9, "vo2max should hold the third element"
print("PASS")`,hints:["List the three names on the left of =, the tuple on the right.",`name, date, vo2max = ___
print(f"{name} tested on {date}: VO2max = {vo2max}")`]},{type:"exercise",id:"ex-2-42",title:"Training Summary",domain:"coaching",description:`Summarise the 10 weekly distances:
1. Store the total in total.
2. Store the average in average.
3. Store the peak in peak.
Then print all three; any clear format is fine.`,initialCode:"weekly_km = [85, 92, 78, 95, 88, 72, 90, 85, 98, 82]",testCode:`assert total == 865, "total should be the sum: 865"
assert abs(average - 86.5) < 0.05, "average should be 86.5"
assert peak == 98, "peak should be the maximum: 98"
print("PASS")`,hints:["sum(), len(), and max() do all three jobs.",`total = sum(weekly_km)
average = total / len(weekly_km)
peak = ___(weekly_km)
print(f"Total: {total} km")
print(f"Average: {average:.1f} km/week")
print(f"Peak: {peak} km")`]},{type:"md",md:"## Checking Membership\n\nThe `in` and `not in` operators check whether an item exists in a list (or any sequence). This is useful for filtering -- for example, checking whether an athlete is in an injured list before selecting them for a session."},{type:"exercise",id:"ex-2-43",title:"Membership Check",domain:"coaching",description:'Use the in operator to check the injury list: first print whether "Haaland" is in it, then whether "Walker" is in it.',initialCode:'injured = ["Walker", "Stones", "Grealish"]',expectedOutput:`False
True`,hints:["The in operator returns True or False directly, so you can print the check itself.",`print("Haaland" in injured)
print("___" in injured)`]},{type:"md",md:"## Summary\n\n| Feature | List `[]` | Tuple `()` |\n|---------|-----------|------------|\n| Mutable | Yes | No |\n| Use case | Data that changes | Fixed records |\n| Methods | Many (append, sort, ...) | Few (count, index) |\n\nKey built-ins for both:\n- `len()` -- count of elements\n- `min()` / `max()` -- smallest / largest value\n- `sum()` -- total of all elements\n- `sorted()` -- returns a new sorted list (does not modify original)\n- `x in lst` / `x not in lst` -- membership check\n\nIn the next lesson, we meet dictionaries -- key-value records for structured data."}],quiz:null},dictionaries:{blocks:[{type:"md",md:`# Dictionaries

## Introduction

A **dictionary** is an unordered collection of **key-value pairs**. While lists use numeric indices (0, 1, 2...) to access elements, dictionaries use descriptive **keys**. This makes dictionaries ideal for representing structured records like athlete profiles, test results, and configuration settings.

---

## Creating and Accessing Dictionaries

A dictionary is written with curly braces \`{}\`, and each entry inside them is a \`"key": value\` pair. The key is the label you look things up by, and the value can be of any type: a number, a string, even another list or dictionary. Reading a value back uses square brackets with the key, like \`athlete["age"]\`. There is also a safer alternative, the \`.get()\` method, which returns \`None\` when the key does not exist instead of crashing. \`.get()\` can also take a second argument, a fallback of your own choosing: \`athlete.get("salary", 0)\` returns the salary if it is recorded and \`0\` if it is not. That makes it useful whenever you are not certain a field was actually recorded:

\`\`\`python
athlete = {
    "name": "Erling Haaland",
    "age": 24,
    "sport": "Football",
    "height_cm": 194,
    "weight_kg": 88.0,
    "is_active": True,
}

print(athlete["name"])              # Erling Haaland
print(athlete.get("salary"))        # None  -- key doesn't exist, no error
print(athlete.get("age", "N/A"))    # 24
\`\`\``},{type:"example",caption:"Creating and accessing a sprint-splits dictionary.",code:`splits = {
    "10m": 1.83,
    "20m": 2.87,
    "30m": 3.78,
    "40m": 4.65,
}

print(splits["10m"])                      # 1.83
print(splits.get("50m", "not measured"))  # not measured`},{type:"exercise",id:"ex-2-60",title:"Access an Athlete Profile",domain:"physiology",description:"Using square-bracket access on the profile dictionary, print exactly: Eliud Kipchoge: VO2max 78.0, HR rest 38 bpm",initialCode:`profile = {
    "name": "Eliud Kipchoge",
    "age": 40,
    "vo2max": 78.0,
    "resting_hr": 38,
    "sport": "Marathon",
}
`,expectedOutput:"Eliud Kipchoge: VO2max 78.0, HR rest 38 bpm",hints:['profile["name"] fetches a value by its key. Inside an f-string, use single quotes around the key.',`print(f"{profile['name']}: VO2max {profile['vo2max']}, HR rest {profile['___']} bpm")`]},{type:"md",md:'---\n\n## Modifying Dictionaries\n\nDictionaries are not fixed once created; entries can be added, changed, and removed at any time. Assigning to a key does two jobs at once: if the key already exists, its value is replaced, and if it does not exist, a brand new entry is created. So `result["vo2max"] = 54.3` updates an existing test value, while `result["retest_date"] = "2026-09-01"` adds a field that was never there. Removal works two ways: `del` simply deletes an entry, while `.pop()` deletes it and hands you back its value, which is handy when you still need the number one last time:\n\n```python\nathlete = {"name": "Haaland", "goals": 36}\n\nathlete["assists"] = 8        # add\nathlete["goals"] = 38         # update\ndel athlete["assists"]        # delete\ngoals = athlete.pop("goals")  # remove and return\n```'},{type:"example",caption:"Adding BMI to an athlete dictionary after creation.",code:`athlete = {
    "name": "Viktor Axelsen",
    "height_cm": 194,
    "weight_kg": 93.0,
}

height_m = athlete["height_cm"] / 100
athlete["bmi"] = round(athlete["weight_kg"] / height_m ** 2, 1)

print(athlete["bmi"])   # 24.7`},{type:"exercise",id:"ex-2-61",title:"Update Test Results",domain:"coaching",description:'Make two updates to the result dictionary: change "vo2max" from 52.1 to 54.3, and add a new key "retest_date" with the value "2026-09-01". Then print both updated values on separate lines.',initialCode:`result = {
    "athlete": "Anna Berg",
    "vo2max": 52.1,
    "test_date": "2026-03-01",
}
`,expectedOutput:`54.3
2026-09-01`,hints:["Assign to an existing key to update it; assign to a new key to add it.",`result["vo2max"] = 54.3
result["retest_date"] = "___"
print(result["vo2max"])
print(result["retest_date"])`]},{type:"md",md:"---\n\n## Dictionary Methods\n\nThree methods let you look at a dictionary from different angles: `.keys()` gives every key, `.values()` gives every value, and `.items()` gives the key-value pairs. Wrapping them in `list()` turns each view into an ordinary list you can print, which is a quick way to see what a dictionary contains without reading its definition.\n\nThe `in` operator you know from lists works on dictionaries too, checking whether a **key** exists. This pairs naturally with `.get()` from earlier: both are ways of staying safe when you are not sure a field was recorded.\n\n(In Module 4 you will learn loops, which can walk through `.items()` one entry at a time and process each. For now, viewing everything at once is all we need.)"},{type:"example",caption:"The three dictionary views, plus in to check whether a key exists.",code:`test_result = {
    "athlete": "Kipchoge",
    "test": "VO2max",
    "value": 78.0,
    "unit": "mL/kg/min",
}

print(list(test_result.keys()))     # ['athlete', 'test', 'value', 'unit']
print(list(test_result.values()))   # ['Kipchoge', 'VO2max', 78.0, 'mL/kg/min']

print("value" in test_result)   # True
print("score" in test_result)   # False`},{type:"exercise",id:"ex-2-62",title:"Athlete Record Book",domain:"physiology",description:'Calculate BMI from the height and weight in the dictionary and add it under the key "bmi" (rounded to 1 decimal). Then print the list of keys to confirm the new field is in place, and print the new bmi value.',initialCode:`athlete = {
    "name": "Karsten Warholm",
    "sport": "Athletics",
    "age": 29,
    "height_cm": 187,
    "weight_kg": 80.0,
}
`,expectedOutput:`['name', 'sport', 'age', 'height_cm', 'weight_kg', 'bmi']
22.9`,hints:['Convert the height to metres first, then add the value with athlete["bmi"] = round(..., 1).',`height_m = athlete["height_cm"] / 100
athlete["bmi"] = round(athlete["weight_kg"] / height_m ** 2, 1)
print(list(athlete.___()))
print(athlete["bmi"])`]},{type:"md",md:'---\n\n## Nested Dictionaries\n\nBecause a dictionary\'s values can be of any type, a value can itself be another dictionary. This is called **nesting**, and it is how structured records stay organised as they grow: instead of one flat dictionary with fifteen keys, related fields live together under a sub-key, such as everything physical under `"physical"` and every test result under `"performance"`.\n\nReaching a value inside a nested dictionary works exactly like ordinary access, applied twice. The first set of square brackets picks the inner dictionary, and the second picks the value inside it:\n\n```python\nprint(athlete["physical"]["resting_hr"])    # 38\nprint(athlete["performance"]["vo2max"])     # 78.0\n```\n\nRead `athlete["physical"]["resting_hr"]` from left to right: from `athlete`, take the `"physical"` section, and from that, take `"resting_hr"`.'},{type:"example",caption:"Nested athlete profile with personal, physical, and performance sections.",code:`athlete = {
    "personal":     {"name": "Eliud Kipchoge", "age": 40},
    "physical":     {"height_cm": 167, "weight_kg": 52, "resting_hr": 38},
    "performance":  {"marathon_pb": "2:01:09", "vo2max": 78.0},
}

print(athlete["personal"]["name"])
print(athlete["physical"]["resting_hr"])
print(athlete["performance"]["marathon_pb"])`},{type:"exercise",id:"ex-2-63",title:"Nested Fitness Test Battery",domain:"physiology",description:"From the nested test-battery dictionary, print the vo2max value (52.3) and the sprint_20m percentile (75) on separate lines.",initialCode:`battery = {
    "athlete": "Anna Andersson",
    "tests": {
        "vo2max":      {"value": 52.3, "unit": "mL/kg/min", "percentile": 68},
        "sprint_20m":  {"value": 3.21, "unit": "s",         "percentile": 75},
        "cmj":         {"value": 35.2, "unit": "cm",        "percentile": 71},
    },
}
`,expectedOutput:`52.3
75`,hints:["Chain the square brackets: outer key first, then the inner keys.",`print(battery["tests"]["vo2max"]["___"])
print(battery["tests"]["sprint_20m"]["percentile"])`]},{type:"md",md:`---

## Lists of Dictionaries

Lists and dictionaries combine into the single most useful data shape in sport science: a **list where every element is a dictionary**. It behaves like a table. The list holds the rows, and each dictionary is one row with named fields. A squad, a season of sessions, a set of test results: they all fit this shape naturally.

Reaching into the table combines the two access styles you already know, one after the other. Index into the list first to pick a row, then use a key to pick a field from that row: \`team[0]["name"]\` is the name in the first row, and \`team[-1]["goals"]\` is the goals value in the last row.

(In Module 4, loops will let you process every row in turn, and in Module 5, pandas will treat this shape as a proper table. Both build directly on this picture.)`},{type:"example",caption:"A squad as a list of dictionaries: pick a row by index, then a field by key.",code:`team = [
    {"name": "Haaland",   "pos": "FW", "goals": 36, "assists": 8},
    {"name": "De Bruyne", "pos": "MF", "goals": 7,  "assists": 18},
    {"name": "Rodri",     "pos": "MF", "goals": 3,  "assists": 7},
    {"name": "Dias",      "pos": "DF", "goals": 1,  "assists": 2},
]

print(len(team))              # 4 rows
print(team[0]["name"])        # Haaland
print(team[-1]["goals"])      # 1
print(team[0]["goals"] + team[1]["goals"])   # 43`},{type:"md",md:'---\n\n## Summary\n\n| Operation | Syntax |\n|-----------|--------|\n| Create | `d = {"key": value}` |\n| Access | `d["key"]` or `d.get("key")` |\n| Add / Update | `d["key"] = value` |\n| Delete | `del d["key"]` or `d.pop("key")` |\n| Check key | `"key" in d` |\n| Nested access | `d["section"]["field"]` |\n\nDictionaries are one of the most important data structures in Python -- from athlete profiles to test batteries to configuration settings, you will use them constantly.\n\nIn the next lesson, we switch from Python collections to NumPy arrays, built for fast numerical work.'}],quiz:null},"numpy-arrays":{blocks:[{type:"md",md:`# NumPy: Fast Arrays for Measurement Data

## Introduction

In the previous lessons you stored collections in Python lists. Lists are flexible, but they are slow for numerical work. When you process an accelerometer signal with 10,000 data points or marker-based motion capture data from a full movement analysis, you need something faster.

**NumPy** (Numerical Python) provides the **array**, purpose-built for fast numerical computation. Operations on arrays can be 10 to 100 times faster than the equivalent list operations, and the syntax is far cleaner.

One thing to know before we start: this is a deliberately brief visit. In everyday sport science work you will mostly use **pandas**, the table library introduced in the coming lessons, and pandas is built directly on top of NumPy. Every column of a pandas table is a NumPy array underneath. Understanding what an array is and how it behaves is therefore the foundation for everything that follows, even if you rarely write raw NumPy yourself.

---

## Your First Library: import

So far, everything you have used has been built into Python. But much of Python's power comes from **libraries**: collections of ready-made functions written by others, which you bring into your script with the \`import\` statement. NumPy, pandas, and Matplotlib are the three libraries you will use throughout this course. A library needs to be installed on the computer once (the course environment already has them all), and then imported once at the top of every script that uses it.

\`\`\`python
import numpy as np
\`\`\`

This line reads: bring in the numpy library and give it the short nickname \`np\`. The \`as np\` part is called an **alias**. Instead of typing \`numpy.array(...)\` every time, you type \`np.array(...)\`. The nicknames are a near-universal convention: numpy is always \`np\`, pandas is \`pd\`, and Matplotlib's plotting module is \`plt\`. Follow the conventions and everyone reading your code will feel at home.

---

## Why Arrays?

With a list you need a loop or comprehension to apply maths to every element. With an array, one operation applies to every element at once. This is called **vectorisation**:

\`\`\`python
import numpy as np

force_list  = [0, 245, 510, 890, 1250]
force_array = np.array(force_list)

# List: must loop            Array: one expression
list_result  = [x + 100 for x in force_list]
array_result = force_array + 100
\`\`\``},{type:"example",caption:"Vectorised operation vs. list comprehension on force data.",packages:["numpy"],code:`import numpy as np

force_n = np.array([0, 245, 510, 890, 1250, 980, 420, 50])

# Subtract body weight (784.8 N) from every sample at once
net_force_n = force_n - 784.8
print(net_force_n)

# Every array can describe itself
print(force_n.shape)   # (8,)  -- 8 elements in 1 dimension
print(force_n.dtype)   # int32 -- whole numbers`},{type:"md",md:"---\n\n## Key Array Properties\n\nEvery array has three essential properties, readable at any time:\n\n| Property | Meaning | Example |\n|----------|---------|---------|\n| `.shape` | Dimensions as a tuple | `(8,)` |\n| `.dtype` | Data type of elements | `float64`, `int64` |\n| `.size` | Total element count | `15` |"},{type:"exercise",id:"ex-2-66",title:"Force Array Basics",domain:"biomechanics",packages:["numpy"],description:"Convert force_list to a NumPy array called force_n. Print its shape, its dtype, and the result of adding 50 to every element.",initialCode:`import numpy as np

force_list = [735, 780, 1250, 2800, 3500, 3100, 2200, 1500, 900, 750]`,expectedOutput:`(10,)
int32
[ 785  830 1300 2850 3550 3150 2250 1550  950  800]`,hints:["np.array() converts the list; .shape and .dtype are attributes (no parentheses).",`force_n = np.array(force_list)
print(force_n.shape)
print(force_n.dtype)
print(force_n + ___)`]},{type:"md",md:"---\n\n## Creating Time Vectors: np.arange and np.linspace\n\nMeasurement signals need a matching time axis. `np.arange(start, stop, step)` generates sequences with a known step, ideal for a fixed sampling rate. `np.linspace(start, stop, num)` generates exactly `num` evenly spaced points including the endpoint:\n\n| Function | Endpoint | You specify |\n|----------|----------|-------------|\n| `arange` | Excluded | Step size |\n| `linspace` | Included | Point count |"},{type:"example",caption:"Time vectors with arange (1000 Hz) and linspace (101 points).",packages:["numpy"],code:`import numpy as np

# 1-second recording at 1000 Hz
time_arange = np.arange(0, 1, 1/1000)
print(f"arange: {len(time_arange)} samples, last = {time_arange[-1]:.3f} s")

# Exactly 101 points from 0 to 1 s
time_linspace = np.linspace(0, 1, 101)
print(f"linspace: {len(time_linspace)} samples, last = {time_linspace[-1]:.3f} s")`},{type:"exercise",id:"ex-2-68",title:"Create Time Vectors",domain:"biomechanics",packages:["numpy"],description:`Create two time vectors for a 2-second signal:
1. time_arange with np.arange, sampling at 500 Hz.
2. time_linspace with np.linspace, exactly 51 evenly spaced points from 0 to 2 seconds.
Then print the length and last value of each; any clear format is fine.`,initialCode:"import numpy as np",testCode:`assert len(time_arange) == 1000, f"time_arange should have 1000 samples (2 s at 500 Hz), got {len(time_arange)}"
assert abs(float(time_arange[-1]) - 1.998) < 1e-9, "arange excludes the endpoint, so the last value is 1.998"
assert len(time_linspace) == 51, f"time_linspace should have exactly 51 points, got {len(time_linspace)}"
assert abs(float(time_linspace[-1]) - 2.0) < 1e-12, "linspace includes the endpoint 2.0"
print("PASS")`,hints:["arange takes a step (1/500) and excludes the endpoint; linspace takes a point count and includes it.",`time_arange = np.arange(0, 2, 1/500)
print(f"arange: {len(time_arange)} samples, last = {time_arange[-1]:.4f} s")
time_linspace = np.linspace(0, 2, ___)
print(f"linspace: {len(time_linspace)} samples, last = {time_linspace[-1]:.4f} s")`]},{type:"md",md:"---\n\n## Built-in Statistics\n\nArrays come with their statistics built in, no loops needed: `.mean()`, `.std()`, `.min()`, `.max()`. And because element-wise maths works on whole arrays, normalising a signal is a single expression, like dividing every force sample by body weight in the example below."},{type:"example",caption:"Describe a countermovement-jump force signal.",packages:["numpy"],code:`import numpy as np

force_n = np.array([420, 680, 1150, 1900, 2400, 2100, 1500, 800])
mass_kg = 68
GRAVITY_MS2 = 9.81
body_weight_n = mass_kg * GRAVITY_MS2

print(f"Mean force: {force_n.mean():.1f} N")
print(f"Peak force: {force_n.max():.1f} N")
print(f"Std dev:    {force_n.std():.1f} N")
print(f"Peak force: {(force_n / body_weight_n).max():.2f} BW")`},{type:"exercise",id:"ex-2-70",title:"Force Plate Statistics",domain:"biomechanics",packages:["numpy"],description:`Describe the drop-landing force recording:
1. Compute body weight in newtons: body_weight_n = mass_kg * GRAVITY_MS2.
2. Print the mean, peak, min, and standard deviation of the force (1 decimal each, in newtons).
3. Print the peak normalised to body weights (2 decimals).
Match the expected output exactly.`,initialCode:`import numpy as np

force_n = np.array([735, 780, 1250, 2800, 3500, 3100, 2200, 1500, 900, 750])
mass_kg = 75
GRAVITY_MS2 = 9.81`,expectedOutput:`Mean force: 1751.5 N
Peak force: 3500.0 N
Min force: 735.0 N
Std dev: 1009.8 N
Peak force: 4.76 BW`,hints:["body_weight_n = mass_kg * GRAVITY_MS2; then .mean(), .max(), .min(), .std(), and (force_n / body_weight_n).max().",`body_weight_n = mass_kg * GRAVITY_MS2
print(f"Mean force: {force_n.mean():.1f} N")
print(f"Peak force: {force_n.max():.1f} N")
print(f"Min force: {force_n.___():.1f} N")
print(f"Std dev: {force_n.std():.1f} N")
print(f"Peak force: {(force_n / body_weight_n).max():.2f} BW")`]},{type:"md",md:`---

## Slicing: Exactly Like Lists

Indexing and slicing work exactly as they do for lists and strings: zero-based positions, negative indices from the end, and \`array[start:stop]\` with the stop excluded. In signal work this is how you cut a recording into phases:

\`\`\`python
hr_bpm = np.array([72, 85, 110, 135, 155, 170, 182, 188, 190, 185, 160, 120])

hr_bpm[0]      # 72   (first)
hr_bpm[-1]     # 120  (last)
hr_bpm[2:6]    # [110 135 155 170]
hr_bpm[-3:]    # [185 160 120]  last 3
\`\`\``},{type:"example",caption:"Slicing a heart rate array into warm-up, main set, and cool-down.",packages:["numpy"],code:`import numpy as np

hr_bpm = np.concatenate([
    np.linspace(70, 140, 10),   # warm-up
    np.linspace(145, 175, 30),  # main set
    np.linspace(170, 90, 20),   # cool-down
])

warmup   = hr_bpm[:10]
main_set = hr_bpm[10:40]
cooldown = hr_bpm[40:]

print(f"Warm-up HR:  {warmup.mean():.0f} bpm")
print(f"Main set HR: {main_set.mean():.0f} bpm")
print(f"Cool-down HR:{cooldown.mean():.0f} bpm")`},{type:"exercise",id:"ex-2-71",title:"Extract EMG Segments",domain:"biomechanics",packages:["numpy"],description:"From the rectified EMG signal (20 values, millivolts), extract the activation phase (indices 8 to 14 inclusive) into activation_mv, then print the segment and its mean.",initialCode:`import numpy as np

emg_mv = np.array([0.02, 0.03, 0.01, 0.04, 0.02,
                   0.05, 0.12, 0.25, 0.48, 0.72,
                   0.85, 0.91, 0.78, 0.65, 0.42,
                   0.18, 0.08, 0.04, 0.03, 0.02])`,testCode:`assert len(activation_mv) == 7, f"activation_mv should hold 7 values (indices 8-14), got {len(activation_mv)}"
assert abs(float(activation_mv[0]) - 0.48) < 1e-9, "the segment should start at index 8 (0.48)"
assert abs(float(activation_mv.mean()) - 0.6871) < 0.001, "check the slice: its mean is about 0.6871"
print("PASS")`,hints:["The slice 8:15 covers indices 8 to 14, because the stop index is excluded.",`activation_mv = emg_mv[8:___]
print(f"Activation: {activation_mv}")
print(f"  Mean: {activation_mv.mean():.4f} mV")`]},{type:"md",md:`---

## Boolean Filtering

This is the most important idea to take from this lesson. A comparison on an array produces an array of \`True\`/\`False\` values, and using that inside square brackets keeps only the matching elements:

\`\`\`python
sprint_times_s = np.array([4.52, 4.61, 4.48, 4.95, 4.33, 4.71])

fast_times_s = sprint_times_s[sprint_times_s < 4.55]    # [4.52 4.48 4.33]
\`\`\`

Remember this pattern: filtering a pandas table, which you will do constantly from the next lessons on, works in exactly the same way, because pandas columns are NumPy arrays underneath.`},{type:"example",caption:"High-intensity heart rate analysis using boolean indexing.",packages:["numpy"],code:`import numpy as np

hr_bpm = np.array([72, 85, 110, 135, 155, 170, 182, 188, 190, 185, 160, 120])
hr_max_bpm = 195

hard_bpm = hr_bpm[hr_bpm >= 0.85 * hr_max_bpm]
print(f"Samples above 85% of max: {hard_bpm}")
print(f"Time above 85%: {len(hard_bpm)} samples")`},{type:"exercise",id:"ex-2-77",title:"Filter GPS High-Intensity Periods",domain:"physiology",packages:["numpy"],description:`Using boolean indexing on the GPS speed data (one sample per second):
1. Keep only the samples above 5.0 m/s in high_speed_ms.
2. Print how many seconds that is, the mean speed of those samples, and the total high-intensity distance (their sum).
Any clear print format is fine.`,initialCode:`import numpy as np

speed_ms = np.array([2.1, 3.5, 5.2, 6.1, 7.3, 5.8, 4.2, 3.1, 5.5, 6.8,
                     7.1, 5.3, 4.0, 2.8, 1.9, 3.2, 5.9, 6.5, 5.1, 3.8])
threshold_ms = 5.0`,testCode:`assert len(high_speed_ms) == 11, f"11 samples are above 5.0 m/s, got {len(high_speed_ms)}"
assert abs(float(high_speed_ms.mean()) - 6.0545) < 0.001, "mean of the fast samples should be about 6.05"
assert abs(float(high_speed_ms.sum()) - 66.6) < 0.01, "their sum (the distance) should be 66.6"
print("PASS")`,hints:["speed_ms[speed_ms > threshold_ms] keeps only the fast samples; len() is seconds, .sum() is metres.",`high_speed_ms = speed_ms[speed_ms > threshold_ms]
print(f"Time above {threshold_ms} m/s: {len(high_speed_ms)} seconds")
print(f"Mean high-intensity speed: {high_speed_ms.mean():.2f} m/s")
print(f"High-intensity distance: {high_speed_ms.___():.1f} m")`]},{type:"md",md:'---\n\n## Summary\n\n| Idea | Syntax | Why it matters |\n|------|--------|----------------|\n| Create an array | `np.array([...])` | Convert existing data |\n| Time vectors | `np.arange`, `np.linspace` | Match a signal to its time axis |\n| Element-wise maths | `force / bw` | One expression, every element |\n| Statistics | `.mean()`, `.std()`, `.min()`, `.max()` | No loops needed |\n| Slicing | `a[start:stop]` | Cut a signal into phases |\n| Boolean filter | `a[a > 5]` | The pattern pandas filtering is built on |\n\nTwo small notes for later. In Module 5 you will sometimes see `np.random.normal(mean, sd, n)` in examples; read it as "n random values around a mean", used to fabricate demonstration data. And the Module 7 projects introduce a few more NumPy tools (numerical derivatives, cumulative sums) exactly where a high-frequency signal calls for them.\n\nIn the next lesson, we step up from arrays to tables: importing real datasets with pandas.'}],quiz:{id:"quiz-2-8",title:"NumPy Quiz",questions:[{id:"q1",type:"multiple-choice",question:"What is the main advantage of NumPy arrays over Python lists for numerical computing?",options:[{value:"a",label:"Arrays can store mixed data types"},{value:"b",label:"Vectorized operations make them much faster for math"},{value:"c",label:"Arrays can change size dynamically"},{value:"d",label:"Arrays use more memory for better precision"}],correctAnswer:"b",explanation:"NumPy arrays use vectorized operations (implemented in C) that operate on entire arrays at once, making them 10-100x faster than equivalent Python list operations for numerical work."},{id:"q2",type:"multiple-choice",question:"What does np.arange(0, 1, 0.1) produce?",options:[{value:"a",label:"An array from 0 to 1 with 10 elements, including 1.0"},{value:"b",label:"An array from 0 to 0.9 with step 0.1 (endpoint excluded)"},{value:"c",label:"An array of 10 ones"},{value:"d",label:"An error because the step is a float"}],correctAnswer:"b",explanation:"np.arange(start, stop, step) excludes the stop value, just like Python's range(). So np.arange(0, 1, 0.1) produces [0.0, 0.1, 0.2, ..., 0.9]."},{id:"q3",type:"multiple-choice",question:"Given force = np.array([100, 500, 1200, 800, 300]), what does force[force > 500] return?",options:[{value:"a",label:"np.array([True, False, True, True, False])"},{value:"b",label:"np.array([1200, 800])"},{value:"c",label:"np.array([2, 3])"},{value:"d",label:"An error"}],correctAnswer:"b",explanation:"force > 500 creates a boolean mask [False, False, True, True, False]. Using this mask for indexing returns only the elements where the mask is True: [1200, 800]."}]}},"importing-data":{blocks:[{type:"md",md:`# Series and DataFrames

## From Arrays to Tabular Data

Earlier in this module, you learned how to work with NumPy arrays for numerical computing. Arrays are powerful for homogeneous numerical data, but sport science datasets are usually **tabular** -- they have rows and columns, with different data types in each column (names, dates, numbers, categories).

**Pandas** is the Python library built specifically for this kind of data. It gives us two core data structures:

| Structure | Analogy | Use Case |
|-----------|---------|----------|
| **Series** | A single column in a spreadsheet | One variable (e.g., all CMJ heights) |
| **DataFrame** | An entire spreadsheet/table | A full dataset (e.g., testing battery) |

By convention, pandas is imported with the alias \`pd\`:

\`\`\`python
import pandas as pd
\`\`\`

---

## Series: The Building Block

A **Series** is a one-dimensional labeled array. Think of it as a single column from a spreadsheet. Create one from a list -- every value gets an automatic integer index (0, 1, 2, ...):

\`\`\`python
cmj_heights = pd.Series([35.2, 38.1, 32.5, 40.3, 33.8])
print(cmj_heights)
\`\`\`

You can assign meaningful labels (an **index**) instead of the default integers:

\`\`\`python
cmj = pd.Series([35.2, 38.1, 32.5], index=['Oda', 'Erik', 'Maja'])
print(cmj['Oda'])       # 35.2
print(cmj.iloc[0])      # 35.2 -- by position
\`\`\`

Series support vectorized operations and built-in statistics, just like NumPy arrays:

\`\`\`python
print(f"Mean: {cmj.mean():.1f} cm")
print(f"Max: {cmj.max():.1f} cm")
above_mean = cmj[cmj > cmj.mean()]   # Boolean filtering
\`\`\``},{type:"example",caption:"Creating a Series of CMJ heights with athlete labels and computing descriptive stats.",packages:["pandas"],code:`import pandas as pd

cmj = pd.Series(
    [33.8, 42.2, 35.3, 37.0, 27.7, 38.5, 42.1, 29.4, 36.6, 30.2],
    index=['A01','A02','A03','A04','A05','A06','A07','A08','A09','A10']
)

print(f"Mean CMJ: {cmj.mean():.1f} cm")
print(f"Best: {cmj.max():.1f} cm ({cmj.idxmax()})")
print(f"Worst: {cmj.min():.1f} cm ({cmj.idxmin()})")
above_mean = cmj[cmj > cmj.mean()]
print(f"Above-average athletes: {len(above_mean)}")`},{type:"exercise",id:"ex-2-100",title:"Analyse a CMJ Series",domain:"physiology",packages:["pandas"],description:`The Series of 20 CMJ heights (cm) is created for you. Print:
1. The number of values.
2. The mean rounded to 1 decimal (wrap in float() before round()).
3. The number of athletes with CMJ above 35 cm.`,initialCode:`import pandas as pd

cmj = pd.Series([33.8, 42.2, 35.3, 37.0, 27.7, 38.5, 42.1, 29.4,
                 36.6, 30.2, 24.6, 36.9, 41.1, 26.9, 36.4, 27.7,
                 34.9, 31.3, 35.1, 35.6])
`,expectedOutput:`20
34.2
11`,hints:["len() counts; a comparison like cmj > 35 gives True/False values you can sum.",`print(len(cmj))
print(round(float(cmj.mean()), 1))
print((cmj > ___).sum())`]},{type:"md",md:`---

## DataFrames: The Full Picture

A **DataFrame** is a two-dimensional table with labeled rows and columns. Each column is a Series. The most common way to create one manually is from a dictionary -- each key becomes a column name and each value is a list of entries:

\`\`\`python
import pandas as pd

team = pd.DataFrame({
    'Name':      ['Oda', 'Erik', 'Maja'],
    'Position':  ['Forward', 'Midfielder', 'Defender'],
    'VO2max':    [52.3, 48.7, 54.1],
})
print(team)
\`\`\`

Inspect a DataFrame's structure with a few key attributes:

| Attribute / Method | What it returns |
|--------------------|-----------------|
| \`.shape\` | (rows, columns) as a tuple |
| \`.columns\` | list of column names |
| \`.dtypes\` | data type of each column |
| \`.head(n)\` | first n rows (default 5) |
| \`len(df)\` | number of rows |`},{type:"example",caption:"Build a 5-athlete DataFrame and inspect its structure.",packages:["pandas"],code:`import pandas as pd

team = pd.DataFrame({
    'Name':       ['Oda', 'Erik', 'Maja', 'Lars', 'Sigrid'],
    'Position':   ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Forward'],
    'Age':        [24, 27, 22, 30, 25],
    'Sprint_10m': [1.72, 1.81, 1.78, 1.89, 1.74],
    'VO2max':     [52.3, 48.7, 54.1, 45.2, 51.8],
})

print(team.shape)
print(list(team.columns))
print(team.dtypes)
print(team.head(3))`},{type:"exercise",id:"ex-2-101",title:"Build and Inspect a Team DataFrame",domain:"coaching",packages:["pandas"],description:"The team DataFrame is built for you. Inspect it: store the number of rows in n_rows (from .shape) and the column names as a list in col_names. Print n_rows, then col_names, then the first 3 rows using .head(3).",initialCode:`import pandas as pd

team = pd.DataFrame({
    'Name':       ['Haaland', 'De Bruyne', 'Rodri', 'Dias', 'Ederson'],
    'Position':   ['FW', 'MF', 'MF', 'DF', 'GK'],
    'Age':        [24, 33, 28, 27, 31],
    'Sprint_40m': [4.33, 4.81, 4.92, 4.95, 5.10],
    'CMJ_cm':     [62.1, 48.3, 45.7, 43.2, 41.5],
})
`,testCode:`assert n_rows == 5, "n_rows should be the number of rows (use team.shape)"
assert list(col_names) == ['Name', 'Position', 'Age', 'Sprint_40m', 'CMJ_cm'], "col_names should hold the column names (use team.columns)"
print("PASS")`,hints:[".shape is a (rows, columns) tuple; wrap .columns in list().",`n_rows = team.shape[0]
col_names = list(team.___)
print(n_rows)
print(col_names)
print(team.head(3))`]},{type:"md",md:"---\n\n## Reading CSV Files\n\nIn practice, you rarely type data into Python by hand. Sport science data comes from CSV files, Excel workbooks, force plates, GPS units, and more. **`pd.read_csv()`** is the workhorse:\n\n```python\ndf = pd.read_csv('data/training_log.csv')\n```\n\nCommon parameters:\n\n| Parameter | Purpose | Example |\n|-----------|---------|---------|\n| `sep` | Separator character | `sep=';'` for European files |\n| `skiprows` | Skip header metadata | `skiprows=5` |\n| `index_col` | Column to use as row index | `index_col='Athlete'` |\n| `usecols` | Read only selected columns | `usecols=['Date', 'Athlete', 'RPE']` |\n| `parse_dates` | Parse date columns | `parse_dates=['Date']` |\n\nAfter reading, **always inspect** what you loaded:\n\n```python\nprint(df.head())          # first 5 rows\nprint(df.shape)           # (rows, cols)\nprint(df.dtypes)          # column types\nprint(df.isnull().sum())  # missing values per column\n```"},{type:"example",caption:"Load the training log and run a quick structural inspection.",packages:["pandas"],dataFiles:["training_log.csv"],code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

print("=== Training Log ===")
print(df.head())
print(f"\\nShape: {df.shape}")
print(f"\\nColumn types:\\n{df.dtypes}")
print(f"\\nMissing values:\\n{df.isnull().sum()}")`},{type:"exercise",id:"ex-2-102",title:"Load and Inspect the Training Log",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:`Load data/training_log.csv into df. Print:
1. The shape.
2. The column names as a list.
3. The count of missing values per column using .isnull().sum().to_string().`,initialCode:"import pandas as pd",testCode:`assert df.shape == (236, 8), f"Expected (236, 8), got {df.shape}"
assert 'Athlete' in df.columns, "Missing Athlete column"
assert df['Distance_km'].isna().sum() == 71, "Expected 71 missing in Distance_km"
print("PASS")`,hints:["pd.read_csv loads the file; .isnull().sum() counts missing values per column.",`df = pd.read_csv('data/training_log.csv')
print(df.shape)
print(list(df.columns))
print(df.isnull().sum().___())`]},{type:"md",md:`---

## Viewing DataFrames Like a Spreadsheet

Printing with \`.head()\` works everywhere, but it is not the only way to look at your data. When you work in an external IDE, you can open a DataFrame in an interactive table that looks and behaves much like an Excel sheet: scroll through all the rows, sort by a column, and filter, all without writing any code.

- **VS Code**: the free Data Wrangler extension opens any DataFrame as an interactive table.
- **PyCharm**: while debugging, right-click a DataFrame in the variable list and choose View as DataFrame.
- **Spyder**: double-click a DataFrame in the Variable Explorer.
- **Jupyter notebooks**: DataFrames render as formatted tables automatically.

Many sport scientists keep a viewer like this open while exploring a new dataset. It is a quick way to sanity-check what you loaded before you start computing.

The code blocks in this course can do a light version of the same thing. End a block with a bare expression like \`df.head()\` (no \`print()\` around it) and the result is shown as a formatted table, exactly as a Jupyter notebook would show it. For the full scroll, sort, and filter experience on your own machine, the IDE viewers above are well worth setting up.`},{type:"md",md:`---

## Accessing Columns and Rows

Select a single column using bracket notation -- this returns a **Series**:

\`\`\`python
rpe = df['RPE']         # Series
\`\`\`

Select multiple columns by passing a list -- this returns a **DataFrame**:

\`\`\`python
cardio = df[['Date', 'Athlete', 'Avg_HR', 'Max_HR']]
\`\`\`

Access rows with \`iloc\` (by position) or \`loc\` (by label). Combine both to slice rows AND columns:

\`\`\`python
df.iloc[0]         # first row as a Series
df.iloc[0:5]       # first 5 rows
df.iloc[0, 2]      # element at row 0, column 2

df_indexed = df.set_index('Athlete')
df_indexed.loc['Ingrid']          # all of Ingrid's rows
df_indexed.loc['Ingrid', 'RPE']   # Ingrid's RPE values
\`\`\``},{type:"example",caption:"Select columns and rows from the training log. The bare expression on the last line is shown as a table.",packages:["pandas"],dataFiles:["training_log.csv"],code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# Single column as Series
rpe = df['RPE']
print(f"Mean RPE: {rpe.mean():.2f}")

# First row
print(df.iloc[0])

# Multiple columns -- ending the block with a bare expression
# (no print) shows the result as a formatted table
cardio = df[['Athlete', 'Avg_HR', 'Max_HR']]
cardio.head(3)`},{type:"exercise",id:"ex-2-103",title:"Column and Row Selection",domain:"physiology",packages:["pandas"],dataFiles:["training_log.csv"],description:`The training log is loaded for you.
1. Extract the RPE column as a Series and print its mean rounded to 2 decimals (wrap in float()).
2. Select only the columns Athlete, Session_Type, and RPE into a DataFrame called summary and print its shape.`,initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,expectedOutput:`6.51
(236, 3)`,hints:['One column with df["RPE"]; several columns with a list of names.',`rpe = df['RPE']
print(round(float(rpe.mean()), 2))
summary = df[['Athlete', 'Session_Type', '___']]
print(summary.shape)`]},{type:"md",md:"---\n\n## Reading Excel Files\n\nPandas reads Excel workbooks with `pd.read_excel()`. Pass `sheet_name` to select a specific sheet:\n\n```python\ntb = pd.read_excel('data/test_battery.xlsx', sheet_name='Testing')\nprint(tb.head())\n```\n\nReading Excel requires the `openpyxl` package (declare it in `packages` in course exercises; install once with `pip install openpyxl` on your own machine).\n\nYou can read all sheets at once:\n\n```python\nall_sheets = pd.read_excel('data/test_battery.xlsx', sheet_name=None)\nprint(list(all_sheets.keys()))   # sheet names\n```"},{type:"example",caption:"Load the testing battery from an Excel workbook and preview.",packages:["pandas","openpyxl"],dataFiles:["test_battery.xlsx"],code:`import pandas as pd

tb = pd.read_excel('data/test_battery.xlsx', sheet_name='Testing')

print(tb.shape)
print(list(tb.columns))
tb.head()`},{type:"exercise",id:"ex-2-104",title:"Load a Testing Battery",domain:"physiology",packages:["pandas"],dataFiles:["test_battery.csv"],description:`Load data/test_battery.csv into tb. Print:
1. The shape.
2. The mean CMJ_cm across all athletes (1 decimal, wrap in float()).
3. The number of male athletes (Sex == "M").`,initialCode:"import pandas as pd",expectedOutput:`(20, 8)
33.8
10`,hints:['(tb["Sex"] == "M").sum() counts the matching rows.',`tb = pd.read_csv('data/test_battery.csv')
print(tb.shape)
print(round(float(tb['CMJ_cm'].mean()), 1))
print((tb['Sex'] == '___').sum())`]},{type:"md",md:'---\n\n## Summary\n\n| Task | Code |\n|------|------|\n| Import pandas | `import pandas as pd` |\n| Create a Series | `pd.Series([v1, v2, ...], index=[...])` |\n| Create a DataFrame | `pd.DataFrame({"col": [...], ...})` |\n| Load a CSV | `pd.read_csv("path.csv")` |\n| Load Excel | `pd.read_excel("path.xlsx", sheet_name="Sheet")` |\n| Inspect | `.head()`, `.shape`, `.dtypes`, `.isnull().sum()` |\n| Select one column | `df["col"]` → Series |\n| Select multiple cols | `df[["col1", "col2"]]` → DataFrame |\n| Row by position | `df.iloc[0]` |\n| Row by label | `df.loc["label"]` |\n\nPandas builds on top of NumPy -- you can convert between them easily with `.values` or `.to_numpy()`. The next lesson covers how to get your results back out by exporting to files.'}],quiz:null},"exporting-data":{blocks:[{type:"md",md:`# Exporting Data

## Why Export at All?

So far you have learned to *read* data into Python. But analysis that stays trapped inside a script helps nobody. Eventually you have to get your results back *out* -- and exporting is how you do it. In a sport scientist's week, that happens constantly:

- **Sharing with a coach.** Your head coach does not run Python; they live in Excel. You filter the week's high-intensity sessions, calculate the loads, and hand them a tidy spreadsheet they can open and read.
- **Saving processed data for the next step.** You spend an hour cleaning a messy GPS export. You do not want to redo that every time -- you save the clean version once and load it instantly tomorrow.
- **Handing data to colleagues.** A statistician on your project uses R; a student uses SPSS; a collaborator uses Excel. A plain CSV file is the universal handshake that every one of those tools can read.

---

## Exporting with to_csv

The workhorse for exporting is \`to_csv\`. You call it on a DataFrame, pass a filename, and add **\`index=False\`**:

\`\`\`python
df.to_csv('results.csv', index=False)
\`\`\`

Why the extra argument? Every DataFrame has a row **index** (the 0, 1, 2 down the left side), and by default \`to_csv\` writes it into the file as an extra unnamed column. You almost never want that, so make \`index=False\` a habit.

**The rule:** unless you have deliberately set a meaningful index (like athlete names), always export with \`index=False\`. If you ever read a file back and find a mystery \`Unnamed: 0\` column, a missing \`index=False\` is where it came from.`},{type:"example",caption:"Export a DataFrame to CSV, then read it back to confirm it is clean.",packages:["pandas"],code:`import pandas as pd

df = pd.DataFrame({
    'Athlete': ['Ingrid', 'Jonas', 'Sofie'],
    'CMJ_cm':  [34.2, 38.7, 31.5],
})

df.to_csv('data/cmj_results.csv', index=False)

# Read it back: only the columns you intended, no Unnamed: 0
back = pd.read_csv('data/cmj_results.csv')
print(list(back.columns))
back`},{type:"md",md:`---

## Inspect What You Exported

Exporting is not finished until you know the file is right. After saving, take a moment to inspect the result: read it back and glance at the shape and columns, as in the example above, or simply open the file in Excel or a text editor. That ten-second look catches the things that quietly go wrong: a sneaky \`Unnamed: 0\` column, columns that did not come through, a file saved to the wrong folder.

---

## Exporting Part of a DataFrame

Often the person you are exporting for does not need every column. A coach who wants the week's RPE overview does not need GPS distances and heart rates. You already know how to select columns with a list of names; export the selection and nothing more:

\`\`\`python
overview = df[['Date', 'Athlete', 'Session_Type', 'RPE']]
overview.to_csv('rpe_overview.csv', index=False)
\`\`\`

(In the next lesson you will learn to filter *rows* with conditions too, which combines with column selection in exactly the same way.)`},{type:"example",caption:"Export a coach-friendly selection of columns from the training log.",packages:["pandas"],dataFiles:["training_log.csv"],code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')
overview = df[['Date', 'Athlete', 'Session_Type', 'RPE']]

overview.to_csv('data/rpe_overview.csv', index=False)
print(f"Exported {len(overview)} rows and {len(overview.columns)} columns")`},{type:"exercise",id:"ex-2-107",title:"Export Selected Columns",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:`The training log is loaded for you.
1. Keep only the columns Date, Athlete, and Duration_min.
2. Export them to data/duration_log.csv WITHOUT the index column.
3. Print the number of rows you exported.`,initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`import os, pandas as pd
assert os.path.exists('data/duration_log.csv'), "Export the file first"
check = pd.read_csv('data/duration_log.csv')
assert list(check.columns) == ['Date', 'Athlete', 'Duration_min'], f"Expected the columns ['Date', 'Athlete', 'Duration_min'], got {list(check.columns)}"
assert len(check) == 236, f"Expected 236 rows, got {len(check)}"
print("PASS")`,hints:["Select the three columns with a list of names, then export with index=False.",`duration_log = df[['Date', 'Athlete', '___']]
duration_log.to_csv('data/duration_log.csv', index=False)
print(len(duration_log))`]},{type:"md",md:"---\n\n## Exporting to Excel\n\nCoaches and colleagues often want a real Excel file, not a CSV. `to_excel` produces one, and it takes the same `index=False` argument. Writing Excel files needs the **`openpyxl`** package:\n\n```python\ndf.to_excel('results.xlsx', index=False)\n```\n\nYou can specify the sheet name:\n\n```python\ndf.to_excel('results.xlsx', index=False, sheet_name='Sprint Results')\n```"},{type:"example",caption:"Export a DataFrame to an Excel workbook.",packages:["pandas","openpyxl"],code:`import pandas as pd

df = pd.DataFrame({
    'Athlete': ['Ingrid', 'Jonas', 'Sofie'],
    'CMJ_cm':  [34.2, 38.7, 31.5],
    'Sprint_20m': [3.12, 2.98, 3.27],
})

df.to_excel('data/results.xlsx', index=False, sheet_name='Results')
print("Saved data/results.xlsx")`},{type:"md",md:"---\n\n## Norwegian and European Excel\n\nIf you open a normal CSV in a Norwegian (or German, French, or other European) copy of Excel, you may get a mess. The reason is a regional convention: in English-locale Excel the column separator is a comma and the decimal point is a dot (`34.2`). In much of Europe the decimal mark is a **comma** (`34,2`), so the column separator must be a **semicolon**.\n\nTo produce a CSV that Norwegian Excel opens correctly, set both:\n\n```python\ndf.to_csv('results.csv', sep=';', decimal=',', index=False)\n```\n\nThe resulting file uses semicolons between columns and commas inside the numbers -- the same `sep` and `decimal` you saw for *reading* European files."},{type:"exercise",id:"ex-2-108",title:"Export for Norwegian Excel",domain:"physiology",packages:["pandas"],dataFiles:["training_log.csv"],description:`The training log is loaded for you.
1. Export the whole DataFrame to data/training_log_norsk.csv so that Norwegian Excel opens it correctly: semicolon separator, comma decimals, and no index.
2. Print the number of rows you exported.`,initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`import os, pandas as pd
assert os.path.exists('data/training_log_norsk.csv'), "Export the file first"
first_line = open('data/training_log_norsk.csv').readline()
assert ';' in first_line, "Use sep=';' so the columns are separated by semicolons"
check = pd.read_csv('data/training_log_norsk.csv', sep=';', decimal=',')
assert check.shape == (236, 8), f"Expected (236, 8), got {check.shape}"
assert check['Duration_min'].dtype == float, "Also pass decimal=',' so the numbers are written with comma decimals"
print("PASS")`,hints:["to_csv takes sep and decimal arguments; the Norwegian combination is sep=';' and decimal=','.",`df.to_csv('data/training_log_norsk.csv', sep=';', decimal=',', index=___)
print(len(df))`]},{type:"md",md:`---

## Exporting Plain Arrays

Sometimes you are not working with a DataFrame at all, just a NumPy array -- a column of force values, a vector of times. NumPy has its own export function, \`np.savetxt\`:

\`\`\`python
import numpy as np

force = np.array([0.0, 152.4, 318.9, 412.7, 280.1])
np.savetxt('forces.csv', force, delimiter=',')
\`\`\`

For tabular data with column names a pandas DataFrame and \`to_csv\` is almost always the better choice, but for a quick dump of a raw numeric array, \`np.savetxt\` does the job.`},{type:"md",md:`---

## Summary

| Task | Code |
|------|------|
| Export CSV (clean) | \`df.to_csv('file.csv', index=False)\` |
| Export Excel | \`df.to_excel('file.xlsx', index=False)\` |
| European Excel | \`df.to_csv('file.csv', sep=';', decimal=',', index=False)\` |
| Export NumPy array | \`np.savetxt('f.csv', arr, delimiter=',')\` |
| Inspect an export | read the file back, or open it, and glance at it |

**The rule:** always \`index=False\` unless your index holds meaningful data you want to keep.

In the final lesson of this module, we explore, filter, sort, and summarise DataFrames.`}],quiz:{id:"quiz-2-10",title:"Exporting Data Quiz",questions:[{id:"q1",type:"multiple-choice",question:"You run df.to_csv('results.csv') and then read the file back with pd.read_csv. An extra column called Unnamed: 0 appears, full of numbers 0, 1, 2. What is it?",options:[{value:"a",label:"A column of corrupted data that means the file is broken"},{value:"b",label:"The DataFrame's row index, which to_csv wrote into the file as an unnamed first column by default"},{value:"c",label:"A hidden ID that pandas needs and you must keep"},{value:"d",label:"A bug in pandas that has no fix"}],correctAnswer:"b",explanation:"By default to_csv writes the DataFrame's row index (the 0, 1, 2 down the left side) into the file as a nameless first column. When you read it back, pandas labels that nameless column Unnamed: 0. It is not your data -- it is the index leaking into the file."},{id:"q2",type:"multiple-choice",question:"Which argument prevents the Unnamed: 0 column from appearing when you export a DataFrame?",options:[{value:"a",label:"index=False"},{value:"b",label:"header=False"},{value:"c",label:"sep=';'"},{value:"d",label:"encoding='utf-8'"}],correctAnswer:"a",explanation:"Passing index=False tells to_csv (and to_excel) not to write the row index into the file. The result is a clean file with exactly the columns you meant to save. header=False would instead drop the column names, which is not what you want."},{id:"q3",type:"multiple-choice",question:"You export with df.to_csv('results.csv', sep=';', decimal=',', index=False). What is this combination for?",options:[{value:"a",label:"Compressing the file to save space"},{value:"b",label:"Making the file open correctly in Norwegian/European Excel, which uses a comma as the decimal mark and a semicolon as the column separator"},{value:"c",label:"Encrypting the data so only Excel can read it"},{value:"d",label:"Removing all the decimal places from the numbers"}],correctAnswer:"b",explanation:"In much of Europe, Excel expects the decimal mark to be a comma (34,2) and therefore uses a semicolon to separate columns. sep=';' and decimal=',' produce a CSV that opens cleanly in a Norwegian or other European copy of Excel instead of cramming every row into one column."}]}},"data-exploration":{blocks:[{type:"md",md:`# Exploring Data: Selecting, Sorting, and Modifying

## Why Selection Matters

With a full dataset loaded, you rarely need to work with every row and column at once. In sport science, you constantly need to:

- Extract a specific athlete's records
- Select only the performance metrics
- Filter for high-intensity sessions
- Get data from a specific date range

Pandas offers powerful ways to select subsets of your data.

---

## Filtering Rows with Conditions

The most common selection operation is keeping only the rows that meet a condition: the hard sessions, one athlete, everything above a threshold. It works in two steps, and you have already met the idea when you filtered NumPy arrays with a boolean mask.

**Step 1: a comparison on a column checks every row at once.** The result is a Series of True/False values, one per row. This is the mask:

\`\`\`python
df['RPE'] >= 8
# 0    False
# 1     True
# 2    False
# ...          one True or False for every row
\`\`\`

**Step 2: put the mask inside the brackets.** \`df[...]\` keeps the rows marked True and drops the rest:

\`\`\`python
high_rpe = df[df['RPE'] >= 8]     # only the high-intensity sessions
\`\`\`

Read it from the inside out: the inner \`df['RPE'] >= 8\` marks each row, and the outer \`df[...]\` keeps the marked ones. The original \`df\` is untouched; you get a new, smaller DataFrame. Later in the course, once you have worked with conditions properly, you will also learn to combine several of them in one filter.`},{type:"example",caption:"Filter the training log for high-intensity and per-athlete sessions.",packages:["pandas"],dataFiles:["training_log.csv"],code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# High-intensity sessions (RPE >= 8)
high = df[df['RPE'] >= 8]
print(f"High-intensity sessions: {len(high)}")

# One athlete's sessions
ingrid = df[df['Athlete'] == 'Ingrid']
print(f"Ingrid sessions: {len(ingrid)}")
print(f"Ingrid mean RPE: {ingrid['RPE'].mean():.1f}")`},{type:"exercise",id:"ex-2-111",title:"Filter Training Sessions",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:`The training log is loaded for you.
1. Filter for Match sessions and print how many there are.
2. Filter for sessions where RPE is 8 or higher and print how many there are.`,initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,expectedOutput:`56
61`,hints:['One comparison per filter: Session_Type against "Match", then RPE against 8. len() counts the rows.',`matches = df[df['Session_Type'] == 'Match']
print(len(matches))
hard = df[df['RPE'] >= ___]
print(len(hard))`]},{type:"md",md:`---

## Sorting Data

Sort by a single column with \`.sort_values()\`. By default, order is ascending (lowest first):

\`\`\`python
fastest = df.sort_values('Sprint_10m')          # ascending -- fastest at top
highest_cmj = df.sort_values('CMJ_cm', ascending=False)  # descending -- highest at top

# Sort by multiple columns: first by Position, then by Sprint_10m within position
by_pos = df.sort_values(['Position', 'Sprint_10m'])
\`\`\``},{type:"example",caption:"Sort the test battery by CMJ height and by VO2max.",packages:["pandas"],dataFiles:["test_battery.csv"],code:`import pandas as pd

tb = pd.read_csv('data/test_battery.csv')

# Sort by VO2max ascending (lowest first)
vo2_sorted = tb.sort_values('VO2max_est')
print(f"Lowest VO2max: {vo2_sorted.iloc[0]['VO2max_est']} mL/kg/min")

# Top 3 jumpers -- the bare expression on the last line shows a table
top_jumpers = tb.sort_values('CMJ_cm', ascending=False).head(3)
top_jumpers[['Athlete', 'Sex', 'CMJ_cm']]`},{type:"exercise",id:"ex-2-113",title:"Sort the Test Battery",domain:"physiology",packages:["pandas"],dataFiles:["test_battery.csv"],description:`The test battery is loaded for you.
1. Store the top 3 athletes by CMJ height in top3, sorted best first, and print their Athlete codes and CMJ_cm values.
2. Store the mean VO2max_est rounded to 1 decimal in mean_vo2 and print it.
Any clear print format is fine.`,initialCode:`import pandas as pd

tb = pd.read_csv('data/test_battery.csv')`,testCode:`assert list(top3['Athlete']) == ['A02', 'A07', 'A14'], f"The top 3 by CMJ_cm should be A02, A07, A14; got {list(top3['Athlete'])}"
assert abs(mean_vo2 - 45.2) < 0.05, f"mean_vo2 should be 45.2, got {mean_vo2}"
print("PASS")`,hints:["sort_values with ascending=False, then .head(3); the mean comes straight from the VO2max_est column.",`top3 = tb.sort_values('CMJ_cm', ascending=___).head(3)
print(top3[['Athlete', 'CMJ_cm']])
mean_vo2 = round(tb['VO2max_est'].mean(), 1)
print(mean_vo2)`]},{type:"md",md:`---

## Adding Derived Columns

Creating new columns is as simple as assigning to a new column name. Pandas applies the formula to every row automatically:

\`\`\`python
df['BMI'] = df['Weight_kg'] / (df['Height_cm'] / 100) ** 2
df['session_load'] = df['RPE'] * df['Duration_min']
\`\`\``},{type:"example",caption:"Add a session load column to the training log.",packages:["pandas"],dataFiles:["training_log.csv"],code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# Derived column: session load = RPE x duration
df['session_load'] = df['RPE'] * df['Duration_min']

print(f"Mean session load: {df['session_load'].mean():.0f}")
df[['Athlete', 'Session_Type', 'RPE', 'session_load']].head(6)`},{type:"exercise",id:"ex-2-114",title:"Add Session Load Column",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:`The training log is loaded for you.
1. Add a column session_load = RPE * Duration_min.
2. Store the mean session load in mean_load and the highest single-session load in max_load.
3. Print both.
Any clear print format is fine.`,initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert 'session_load' in df.columns, "add the session_load column first"
assert abs(float(mean_load) - 432.04) < 0.5, f"mean_load should be about 432, got {mean_load}"
assert abs(float(max_load) - 3915.0) < 0.01, f"max_load should be 3915.0, got {max_load}"
print("PASS")`,hints:["Multiply the two columns to make session_load; .mean() and .max() on that column give the two numbers.",`df['session_load'] = df['RPE'] * df['Duration_min']
mean_load = df['session_load'].mean()
max_load = df['session_load'].___()
print(mean_load)
print(max_load)`]},{type:"md",md:`---

## Grouping and Aggregation

So far every summary has covered the whole table. Most sport science questions are per-group instead: mean RPE per athlete, total load per session type. \`.groupby()\` answers those in one line. To see exactly what it does, take a table of six sessions from two athletes:

| Athlete | RPE |
|---------|-----|
| Ingrid  | 5   |
| Jonas   | 8   |
| Ingrid  | 7   |
| Jonas   | 9   |
| Ingrid  | 6   |
| Jonas   | 7   |

\`df.groupby('Athlete')['RPE'].mean()\` works in three steps:

1. **Split** the rows into one group per unique value in the Athlete column: Ingrid's rows (RPE 5, 7, 6) and Jonas's rows (RPE 8, 9, 7).
2. **Apply** the calculation to each group separately: Ingrid's mean is 6.0, Jonas's mean is 8.0.
3. **Combine** the results into one output with one row per group:

\`\`\`python
df.groupby('Athlete')['RPE'].mean()
# Athlete
# Ingrid    6.0
# Jonas     8.0
\`\`\`

Read the line from left to right: group the rows by Athlete, take each group's RPE column, and compute its mean.

The same pattern answers any per-group question: swap \`.mean()\` for \`.max()\`, \`.min()\`, \`.sum()\`, or \`.count()\`, and swap the columns for whatever you are asking about. \`df.groupby('Session_Type')['Duration_min'].sum()\` gives the total minutes per session type. This is how you move from individual records to team-level or position-level insights.`},{type:"example",caption:"Watch groupby split six rows into two athletes and average each.",packages:["pandas"],code:`import pandas as pd

df = pd.DataFrame({
    'Athlete': ['Ingrid', 'Jonas', 'Ingrid', 'Jonas', 'Ingrid', 'Jonas'],
    'RPE':     [5, 8, 7, 9, 6, 7],
})

print(df)
print()
print(df.groupby('Athlete')['RPE'].mean())`},{type:"example",caption:"Group the training log by session type and by athlete.",packages:["pandas"],dataFiles:["training_log.csv"],code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# Mean RPE per session type
print(df.groupby('Session_Type')['RPE'].mean().round(1))

# Number of sessions per athlete
print()
print(df.groupby('Athlete')['RPE'].count())`},{type:"exercise",id:"ex-2-115",title:"Group by Athlete",domain:"physiology",packages:["pandas"],dataFiles:["training_log.csv"],description:`The training log is loaded for you.
1. Group by Athlete and store the mean RPE per athlete in mean_rpe, rounded to 2 decimals.
2. Print it sorted from highest to lowest.`,initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert len(mean_rpe) == 6, f"Expected one value per athlete (6), got {len(mean_rpe)}"
assert abs(float(mean_rpe['Jonas']) - 7.41) < 0.05, f"Jonas trains hardest at mean RPE 7.41, got {mean_rpe['Jonas']}"
assert abs(float(mean_rpe['Ingrid']) - 6.05) < 0.05, f"Ingrid's mean RPE should be 6.05, got {mean_rpe['Ingrid']}"
print("PASS")`,hints:['groupby("Athlete"), take the RPE column, then .mean(); sort_values(ascending=False) orders the result.',`mean_rpe = df.groupby('Athlete')['RPE'].mean().round(2)
print(mean_rpe.sort_values(ascending=___))`]},{type:"exercise",id:"ex-2-117",title:"Mini Analysis: Hardest Sessions",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:`Chain the skills from this lesson into one small analysis.
1. Add a derived column sRPE = Duration_min * RPE.
2. Filter to the hard sessions (RPE >= 8) and store how many there are in n_hard.
3. Sort the hard sessions by sRPE descending and store the three highest sRPE values in top3.
4. Print n_hard and top3.
Any clear print format is fine.`,initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')
`,testCode:`assert 'sRPE' in df.columns, "add the sRPE column first"
assert n_hard == 61, f"Expected 61 hard sessions, got {n_hard}"
assert list(top3) == [3915.0, 810.0, 810.0], f"Top 3 loads wrong: {list(top3)}"
print("PASS")`,hints:['Three steps in order: df["sRPE"] = ..., then hard = df[df["RPE"] >= 8], then hard.sort_values("sRPE", ascending=False).',`df["sRPE"] = df["Duration_min"] * df["RPE"]
hard = df[df["RPE"] >= 8]
n_hard = len(hard)
top = hard.sort_values("sRPE", ascending=___)
top3 = list(top["sRPE"].head(3))
print(n_hard)
print(top3)`]},{type:"md",md:`---

## Summary

| Operation | Syntax |
|-----------|--------|
| Single condition filter | \`df[df['col'] > value]\` |
| Select columns | \`df[['col1', 'col2']]\` |
| Sort ascending | \`df.sort_values('col')\` |
| Sort descending | \`df.sort_values('col', ascending=False)\` |
| Add derived column | \`df['new'] = df['a'] * df['b']\` |
| Group and summarise | \`df.groupby('col')['x'].mean()\` |

These tools form the core of everyday sport science data work: filtering the dataset down to what you care about, adding derived metrics, and summarising by group.

That completes Module 2. In the next module, we learn to read Python's error messages and debug systematically, skills you will use every single day from here on.`}],quiz:null}};export{e as lessons};
