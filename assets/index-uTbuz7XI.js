const e={"cleaning-missing-data":{blocks:[{type:"md",md:`# Data Cleaning: Inspection and Missing Data

## Introduction

Real sport science data is rarely perfect. Athletes forget to fill in a field, a value gets typed with an extra zero, or a column simply does not apply to every row. Before any analysis, you inspect the data and clean it. This lesson and the next walk through that process.

The dataset is the strength log you explored in the previous lesson: six athletes, eight weeks, one row per exercise in each session, with \`Added_Weight_kg\`, \`RPE\`, and \`RIR\` for every set.

> **Key idea:** Never analyse a dataset you have not looked at. Inspect first, then handle what you find.`},{type:"md",md:`---

## Cleaning Is Easier When You Can See the Data

In this course you inspect data by printing it, or by ending a code block with a bare expression such as \`df.head()\` to get a small table. On your own computer the same job can be much more visual. Editors such as VS Code have extensions that open a DataFrame as a spreadsheet you can scroll, sort, and filter by clicking, with no code at all. The free **Data Wrangler** extension for VS Code is the best known one. It shows every column with its type and its share of missing values, highlights the gaps, and lets you try cleaning steps such as dropping or filling missing values while it writes the matching pandas code for you.

![An illustration of the Data Wrangler view in VS Code: the strength log as a scrollable table, each column header showing its type and the percentage of missing values, and the missing cells highlighted](/images/module5/data-wrangler.svg)

Viewers like this are excellent for the first look at a dataset, and for checking that a cleaning step did what you expected. They do not replace the code, though. A viewer shows you *one* dataset *once*; the pandas code in this module can be rerun on next week's log, on another team's log, and on the log with 20 000 rows. Learn the code here, then use a viewer alongside it on your own machine. Module 2 lists similar viewers for PyCharm, Spyder, and Jupyter.`},{type:"md",md:"---\n\n## Inspect Before You Clean\n\nYou met the four inspection checks in the previous lesson: `head()`, `shape`, `dtypes`, and `describe()`. Run them again here, because they are the start of every cleaning job, and this time read two rows of the `describe()` output with a cleaner's eye. The `count` row reveals missing values: a count below 288 means gaps. The `min` and `max` rows reveal impossible values: an added weight of 1200 kg and an RPE of 45 are both waiting there. This lesson is about the gaps; the next one hunts the impossible values."},{type:"exercise",id:"ex-5-20",title:"Inspect the Strength Log",domain:"coaching",packages:["pandas"],dataFiles:["strength_log.csv"],description:"The strength log is loaded for you as `df`. Inspect it before doing anything else:\n1. Print the first rows with `.head()`.\n2. Store the shape in `shape` and print it.\n3. Print the column types with `.dtypes`.\n4. Store `df.describe()` in `summary` and print it.\nAny clear print format is fine. Look at the max row of `summary`: do those values look plausible?",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')`,testCode:`assert tuple(shape) == (288, 8), f"shape should be (288, 8), got {shape}"
assert 'Added_Weight_kg' in summary.columns and 'max' in summary.index, "summary should hold df.describe()"
assert float(summary.loc['max', 'Added_Weight_kg']) == 1200.0, "summary's max row should show the 1200 kg load"
print("PASS")`,hints:["The four checks are `.head()`, `.shape`, `.dtypes`, and `.describe()`. Two of them get stored in `shape` and `summary`, all four get printed.",`print(df.head())

shape = df.shape
print(shape)

print(df.dtypes)

summary = df.___()
print(summary)`]},{type:"md",md:"---\n\n## Finding Missing Values\n\nMissing values appear in pandas as `NaN` (Not a Number). `df.isnull()` marks every missing cell as True, and summing those marks column by column gives the count of gaps:\n\n```python\ndf.isnull().sum()\n```\n\nDividing by the number of rows turns the counts into percentages, which are easier to judge: 3% missing is a nuisance, 40% missing is a problem. `len(df)` gives the number of rows, and `.round(1)` rounds every value in a Series to one decimal. Summing the per-column counts once more, `df.isnull().sum().sum()`, gives the total number of missing cells in the whole table."},{type:"exercise",id:"ex-5-21",title:"Audit the Missing Values",domain:"coaching",packages:["pandas"],dataFiles:["strength_log.csv"],description:"The strength log is loaded for you.\n1. Store the number of missing values per column in `missing` and print it.\n2. Convert the counts to percentages of the rows, rounded to one decimal, store the result in `pct` and print it.\n3. Store the total number of missing cells in `total_missing` and print it.\nAny clear print format is fine. Which column has the most gaps?",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')`,testCode:`assert int(missing['Added_Weight_kg']) == 69, f"Expected 69 missing Added_Weight_kg, got {missing['Added_Weight_kg']}"
assert int(missing['RIR']) == 27, f"Expected 27 missing RIR, got {missing['RIR']}"
assert abs(float(pct['Added_Weight_kg']) - 24.0) < 0.06, f"Expected about 24.0% missing Added_Weight_kg, got {pct['Added_Weight_kg']}"
assert abs(float(pct['RIR']) - 9.4) < 0.06, f"Expected about 9.4% missing RIR, got {pct['RIR']}"
assert int(total_missing) == 105, f"Expected 105 missing cells in total, got {total_missing}"
print("PASS")`,hints:["`df.isnull()``.sum()` gives a Series of missing counts per column. Divide that Series by `len(df)` and multiply by 100 for percentages. Summing the Series once more gives the total.",`missing = df.isnull().sum()
print(missing)

pct = (missing / len(df) * 100).round(1)
print(pct)

total_missing = missing.___()
print(total_missing)`]},{type:"md",md:"---\n\n## Why Is the Added Weight Missing?\n\nBefore deciding how to handle missing data, ask *why* it is missing. In this log, `Added_Weight_kg` is missing for **every Pull-Up**. The column records the weight added to the bar, or to a weight belt for pull-ups. None of these athletes used a belt, so nothing was added and nothing was written down. The gap is not a typing error. Missingness that is tied to another variable like this, here the exercise, is called **Missing Not At Random (MNAR)**. Dropping those rows would throw away every pull-up session, which would be wrong.\n\nWhat to do with the gap depends on your question. If you care about the **added weight**, the pull-ups added nothing, so the honest value is 0, or you leave the pull-ups out of that analysis. If you care about the **load the athlete actually lifted**, a pull-up lifts the athlete's own bodyweight, and that number is stored in another table. Both approaches are shown later in this lesson.\n\nThe gaps in `RIR` (27 rows) and `RPE` (9 rows) are different: athletes occasionally left the field blank, unrelated to what the value would have been. That is much closer to random.\n\nUnderstanding the cause tells you the right strategy. For `Added_Weight_kg`, the gap is **structural** and the fix follows from your question. For `RIR` and `RPE`, you might fill the gaps from neighbouring sessions or simply note them."},{type:"md",md:`---

## Strategy 1: Drop Rows or Columns

\`dropna()\` removes rows (or columns) that contain missing values. Use it when the missing data is truly absent and cannot be recovered:

\`\`\`python
# Drop rows where ANY column is NaN
df_complete = df.dropna()

# Drop rows where SPECIFIC columns are NaN
df_with_rir = df.dropna(subset=['RIR'])

# Drop a whole column
df_no_rir = df.drop(columns=['RIR'])
\`\`\`

**When to use:** the missing pattern is genuinely random, you have enough data left, and the missing rows are not systematically different from the others. Never drop rows just because they are inconvenient; that is a form of selective reporting.`},{type:"exercise",id:"ex-5-23",title:"Complete Cases Only",domain:"teaching",packages:["pandas"],dataFiles:["strength_log.csv"],description:"Create `df_complete` using `dropna()` with no arguments, which drops every row with any missing value.\n1. Store the number of complete rows in `n_complete`.\n2. Store the number of columns in `n_cols`.\n3. Print both.\nAny clear print format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')`,testCode:`assert n_complete == 195, f"Expected 195 complete rows, got {n_complete}"
assert n_cols == 8, f"Expected 8 columns, got {n_cols}"
print("PASS")`,hints:["`dropna()` with no arguments drops every row containing at least one NaN; shape[1] gives the column count.",`df_complete = df.___()

n_complete = len(df_complete)
n_cols = df_complete.shape[1]
print(n_complete)
print(n_cols)`]},{type:"md",md:`---

## Strategy 2: Fill Missing Values

\`fillna()\` replaces NaN with a value you choose. Common choices:

| Fill value | When appropriate |
|------------|-----------------|
| Column mean or median | Random gaps in numerical data |
| A constant (e.g. 0) | Structural absence with a known meaning (a pull-up without a belt added 0 kg) |
| A value from another table | The number you need exists elsewhere (the athlete's bodyweight for a pull-up) |
| Forward fill (\`.ffill()\`) | Ordered data: reuse the last valid reading |
| Backward fill (\`.bfill()\`) | Ordered data: use the next valid reading |

\`\`\`python
# Fill with the column mean
rpe_mean = df['RPE'].mean()
df['RPE_filled'] = df['RPE'].fillna(rpe_mean)

# Fill with a constant
df['Added_Weight_filled'] = df['Added_Weight_kg'].fillna(0)
\`\`\`

Always fill into a **new column** (or work on a \`df.copy()\`) rather than overwriting the original, so you can compare before and after.`},{type:"exercise",id:"ex-5-24",title:"Fill Missing RPE with the Column Mean",domain:"physiology",packages:["pandas"],dataFiles:["strength_log.csv"],description:"Fill the missing RPE values with the column mean.\n1. Store the mean RPE, rounded to 1 decimal, in `rpe_mean`.\n2. Fill the gaps in the RPE column with `rpe_mean` and store the filled column in `rpe_filled`.\n3. Check whether `rpe_filled` still has any missing values, and store the number of missing values in `n_remaining`.\n4. Print `rpe_mean` and `n_remaining`.\nAny clear print format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')`,testCode:`assert abs(rpe_mean - 7.0) < 0.05, f"rpe_mean should be 7.0, got {rpe_mean}"
assert int(n_remaining) == 0, f"no NaN should remain, got {n_remaining}"
print("PASS")`,hints:["`mean()` skips NaN automatically. Compute it first, then `fillna(rpe_mean)`.",`rpe_mean = round(df["RPE"].mean(), 1)

rpe_filled = df["RPE"].fillna(___)

n_remaining = rpe_filled.isna().sum()
print(rpe_mean)
print(n_remaining)`]},{type:"md",md:"### Filling From Another Table\n\nFilling with 0 answers the added-weight question: the pull-ups added nothing. If you instead want the **load the athlete actually lifted**, a pull-up lifts the athlete's own bodyweight, and that number is not in this file. It is stored in `athletes.csv`, one row per athlete with a `Bodyweight_kg` column.\n\nTo use it, you first bring the two tables together. `pd.merge(df, athletes, on='Athlete')` looks up each row's athlete in the second table and attaches that athlete's columns to the row, so every row of the log now carries a `Bodyweight_kg`. Then you build a new column, the load lifted, from the added weight. `fillna()` accepts a whole column instead of a single number and replaces each NaN with the value on the **same row** of that column. Because the only gaps in the added weight are the pull-ups, `merged['Added_Weight_kg'].fillna(merged['Bodyweight_kg'])` keeps the added weight for every other exercise and puts the bodyweight into every pull-up: exactly the load lifted in each row, with the original column left untouched. One thing to know: `merge()` regroups the rows athlete by athlete, so if the date order matters, sort the merged table afterwards."},{type:"exercise",id:"ex-5-41",title:"Load Lifted in the Pull-Ups",domain:"coaching",packages:["pandas"],dataFiles:["strength_log.csv","athletes.csv"],description:"Both tables are loaded for you: the strength log in `df` and the athlete bodyweights in athletes.\n1. Merge the two tables on the Athlete column and store the result in `merged`.\n2. Add a new column `Load_Lifted_kg` to merged: the `Added_Weight_kg` column with its missing values filled from the `Bodyweight_kg` column. Leave `Added_Weight_kg` itself unchanged.\n3. Store the number of missing values in `Load_Lifted_kg` in `n_remaining` and print it.\n4. Print merged to inspect that everything now looks right.\nAny clear print format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')
athletes = pd.read_csv('data/athletes.csv')`,testCode:`assert 'Bodyweight_kg' in merged.columns, "merged should contain the Bodyweight_kg column from athletes"
assert len(merged) == 288, f"merged should still have 288 rows, got {len(merged)}"
assert 'Load_Lifted_kg' in merged.columns, "merged should have a Load_Lifted_kg column"
assert int(n_remaining) == 0, f"Load_Lifted_kg should have no missing values, got {n_remaining}"
assert int(merged['Added_Weight_kg'].isna().sum()) == 69, "Added_Weight_kg itself should be left unchanged (69 gaps)"
_pu = merged[merged['Exercise'] == 'Pull-Up']
_ot = merged[merged['Exercise'] != 'Pull-Up']
assert float(abs(_pu['Load_Lifted_kg'] - _pu['Bodyweight_kg']).max()) < 1e-6, "pull-up rows should get the bodyweight as the load lifted"
assert float(abs(_ot['Load_Lifted_kg'] - _ot['Added_Weight_kg']).max()) < 1e-6, "other exercises should keep their added weight as the load lifted"
assert float(_pu[_pu['Athlete'] == 'Emma']['Load_Lifted_kg'].max()) == 58.0, "Emma's pull-ups should show a load lifted of 58.0 kg"
print("PASS")`,hints:['`pd.merge(df, athletes, on="Athlete")` attaches `Bodyweight_kg` to every row. Then `fillna()` with the `Bodyweight_kg` column fills each pull-up gap with the bodyweight on the same row.',`merged = pd.merge(df, athletes, on="___")

merged["Load_Lifted_kg"] = merged["Added_Weight_kg"].fillna(merged["___"])

n_remaining = merged["Load_Lifted_kg"].isna().sum()
print(n_remaining)

print(merged)`]},{type:"md",md:`---

## Strategy 3: Interpolate Ordered Data

The mean fill and the constant fill ignore *where* a gap sits. When the rows are in a meaningful order, usually time, the neighbours of a gap carry real information about it. **Interpolation** uses that: it estimates each missing value from the known values on either side of it. Linear interpolation, the default, draws a straight line between the two neighbours and reads the missing value off that line. If an athlete logged RIR 3 in one session, left the next blank, and logged RIR 1 in the session after, linear interpolation fills the blank with 2. Two blanks in a row between 3 and 0 become 2 and 1.

\`\`\`python
df_sorted = df.sort_values(['Athlete', 'Date'])
df_sorted['RIR_interp'] = df_sorted['RIR'].interpolate(method='linear')
\`\`\`

Sorting comes first, because \`interpolate()\` only knows the order of the rows, not the dates. It also does not know where one athlete ends and the next begins, so for a log like ours, where a gap in Emma's RIR should be estimated from Emma's sessions, you interpolate within each athlete rather than across the whole column.

**The fill methods side by side.** Each answers a different question about what a gap most likely was:

| Method | What it puts in the gap | Typical use |
|--------|------------------------|-------------|
| \`interpolate(method='linear')\` | A point on the straight line between the neighbours | Smoothly changing measurements sampled often: position, velocity, heart rate, body mass across weeks |
| \`interpolate(method='nearest')\` | A copy of whichever neighbour is closest | Values that are whole numbers or categories, where a value halfway between two readings would be meaningless |
| \`interpolate(method='polynomial', order=2)\` or \`method='spline'\` | A point on a curve fitted through several neighbours | Curved signals such as a jump trajectory or a sprint velocity curve, where a straight line would cut the corner |
| \`.ffill()\` | The last known value, carried forward | Settings that stay in force until changed: the training phase, the equipment in use, a sensor that only reports when the value changes |
| \`.bfill()\` | The next known value, carried backwards | The same situations, when the later reading is the better guess, for example a missing pre-test filled from the first test |

**Where interpolation shines: trajectory and time-series data.** Motion capture systems lose a marker for a few frames when a limb hides it; GPS units drop a sample; a heart rate strap skips a beat. These gaps are short, the signal is smooth, and the sampling rate is high, so the surrounding frames pin the missing values down very well. Filling a 3-frame marker dropout at 200 Hz with linear or spline interpolation is standard practice. The same logic applies to slower series: an athlete's body mass on a missing weekly weigh-in, or a fitness score between two monthly tests, is reasonably estimated from the readings either side.

**Where it does not belong.** Interpolation assumes the gap lies *between* two real readings on a smooth path. That fails for gaps at the very start or end of a series (nothing on one side), for long runs of missing values (the straight line hides everything that happened in between), and for values that jump rather than drift, such as which exercise was performed or whether an athlete was injured. Pass \`limit=\` to \`interpolate()\` to fill at most that many consecutive gaps and leave longer runs as NaN, so you are forced to look at them.`},{type:"exercise",id:"ex-5-25",title:"Interpolate a Heart Rate Trace",domain:"physiology",packages:["pandas"],dataFiles:["hr_trace.csv"],description:'A chest strap recorded heart rate once per second for three minutes. It is loaded for you as `df` with the columns `Time_s` and `HR_bpm`. The strap dropped a few samples on the way.\n1. Store the number of missing values in `HR_bpm` in `n_missing` and print it.\n2. Interpolate `HR_bpm` with `interpolate(method="linear")` and store the result in a new column `HR_interp`.\n3. Store the number of missing values left in `HR_interp` in `n_remaining` and print it.\n4. The three-second gap sits at rows 121 to 123. Print rows 119 to 125 with `df.loc[119:125]`, so you also see the two real readings on either side of the gap and can judge whether the filled values sit sensibly between them.\nAny clear print format is fine.',initialCode:`import pandas as pd

df = pd.read_csv('data/hr_trace.csv')`,testCode:`assert int(n_missing) == 7, f"Expected 7 missing HR values, got {n_missing}"
assert 'HR_interp' in df.columns, "df should have a new column HR_interp"
assert int(n_remaining) == 0, f"Expected 0 missing values left, got {n_remaining}"
_ref = pd.read_csv('data/hr_trace.csv')['HR_bpm'].interpolate(method='linear')
assert float((df['HR_interp'] - _ref).abs().max()) < 1e-6, "HR_interp should be HR_bpm with the gaps filled by linear interpolation"
print("PASS")`,hints:['`.isna().sum()` counts the gaps. `interpolate(method="linear")` draws a straight line across each gap, so the three-second dropout gets three evenly spaced values between its neighbours.',`n_missing = df["HR_bpm"].isna().sum()
print(n_missing)

df["HR_interp"] = df["HR_bpm"].interpolate(method="___")

n_remaining = df["HR_interp"].isna().sum()
print(n_remaining)

print(df.loc[119:125])`]},{type:"md",md:`---

## Comparing Strategies

No single strategy is always right. The choice changes the numbers you report:

| Strategy | Effect on the mean | Effect on the spread | Use when |
|----------|--------------------|----------------------|----------|
| Drop rows | Can shift the mean if the gaps are not random | Unaffected | Few gaps, random missingness |
| Fill with the mean | The mean stays the same | Spread shrinks | Moderate random gaps |
| Fill with a constant | Pulls the mean towards the constant | Changes | Structural absence with a known meaning |
| Interpolate | Depends on the neighbours | Closer to reality | Ordered data |

> **Best practice:** document which strategy you chose and why.`},{type:"md",md:"---\n\n## Summary\n\n- Inspect before you analyse: `head()`, `shape`, `dtypes`, and `describe()` reveal the shape of the data, the gaps, and the impossible values.\n- Detect missing data with `isnull().sum()`, and always ask *why* a value is missing before choosing a strategy.\n- `dropna()` removes rows or columns; use it when the gaps are few and genuinely random.\n- `fillna()` replaces NaN with a mean, a constant, or a neighbouring value; `interpolate()` draws straight lines across gaps in ordered data.\n- Structural absence (the pull-ups' added weight) is not an error. Whether you fill it with 0, compute the load lifted from the bodyweight in another table using `pd.merge()`, or leave those rows out depends on the question you are asking.\n- Document which strategy you chose and why.\n\nIn the next lesson, we hunt the opposite problem: values that are present but should not be, starting with that 1200 kg squat."}],quiz:null},"cleaning-outliers":{blocks:[{type:"md",md:`# Data Cleaning: Outliers

## What an Outlier Is and Why It Matters

An **outlier** is a value that sits far away from the rest of your data. In sport science they appear constantly: a stopwatch read in minutes instead of seconds, a heart rate strap reporting 15 bpm, an RPE typed as 45 on a 0 to 10 scale, or a load logged with an extra zero. Some outliers are mistakes; some are real and important. Your job is to find them and then decide which kind each one is.

Why care? Because a single bad value can wreck a summary statistic. The mean is especially fragile: it adds every value up, so one absurd number drags the average towards itself. The strength log contains two planted examples, both of which you already spotted in the \`describe()\` output:

1. One squat has an \`Added_Weight_kg\` of **1200**, almost certainly 120 typed with an extra zero.
2. One row has an \`RPE\` of **45**, impossible on a scale that only runs 0 to 10.

> **Key idea:** An outlier is either an error or a genuine extreme performance, and you must tell the two apart before you decide what to do.`},{type:"exercise",id:"ex-5-27",title:"Spot the Outliers and What They Cost",domain:"coaching",packages:["pandas"],dataFiles:["strength_log.csv"],description:"The strength log is loaded for you as `df`. First confirm the impossible RPE, then measure what the mistyped load does to the mean.\n1. Store the number of rows where `RPE` is above 10 in `n_impossible_rpe`, and the largest RPE value in `max_rpe`.\n2. Store the mean of `Added_Weight_kg`, rounded to 1 decimal, in `mean_with`.\n3. Store the mean of `Added_Weight_kg` without the 1200 kg row, rounded to 1 decimal, in `mean_without`. A boolean filter that keeps only the values not equal to 1200 does it.\n4. Print all four values.\nAny clear print format is fine. One typo moves the average load by how much?",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')`,testCode:`assert int(n_impossible_rpe) == 1, f"exactly 1 row has RPE > 10, got {n_impossible_rpe}"
assert int(max_rpe) == 45, f"the maximum RPE is the impossible 45, got {max_rpe}"
assert abs(float(mean_with) - 107.0) < 0.06, f"mean_with should be 107.0, got {mean_with}"
assert abs(float(mean_without) - 102.0) < 0.06, f"mean_without should be 102.0, got {mean_without}"
print("PASS")`,hints:["A comparison creates a True/False Series: `.sum()` counts the True values, and using it inside `[]` keeps only the rows where it is True. `.max()` and `.mean()` do the rest.",`n_impossible_rpe = (df["RPE"] > ___).sum()
max_rpe = df["RPE"].max()

load = df["Added_Weight_kg"]
mean_with = round(load.mean(), 1)
mean_without = round(load[load != ___].mean(), 1)

print(n_impossible_rpe)
print(max_rpe)
print(mean_with)
print(mean_without)`]},{type:"md",md:`---

## Look Before You Compute

Numbers and pictures are two ways of inspecting the same data, and they help each other. \`describe()\` told you that the maximum load is 1200 kg; a plot shows you *where* that value sits relative to everything else, and whether it is alone. Sport scientists routinely plot a new dataset before they compute anything, because the eye catches in a second what a table hides in 288 rows.

A **box plot** draws the median, the quartiles (the box), and whiskers out to the normal range. Anything beyond the whiskers is drawn as an individual point, a visual outlier flag. Run the example and look at it.

We have not taught plotting yet. That comes in the visualisation lessons later in this module, where you will make this exact plot yourself. For now, read the code as a recipe: load the data, create a figure with one set of axes, draw a box plot of the load column on it, and label it.`},{type:"example",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],caption:"A box plot of the added weight: one lonely point far above the whisker.",code:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
load = df['Added_Weight_kg'].dropna()

fig, ax = plt.subplots()
ax.boxplot(load, labels=['All loaded sets'])
ax.set_ylabel('Added weight (kg)')
ax.set_title('Added weight per set, all exercises')
ax.grid(axis='y', alpha=0.3)`},{type:"md",md:"The box sits around 80 to 125 kg, where almost every set lives, but one point floats far above the whisker at 1200. That single dot is the mistyped squat. The plot tells you something is unusual; it does not tell you whether it is an error. That judgement still requires domain knowledge, and the rules below turn the visual impression into a number you can act on."},{type:"md",md:`---

## The Z-Score Rule

The **z-score** measures how many standard deviations a value sits from the mean:

\`\`\`
z = (x - mean) / std
\`\`\`

A common rule of thumb is to flag any value with **|z| > 3**. In our strength log:

- Mean load = 107.0 kg, std = 81.4 kg
- Z-score of the 1200 kg squat = (1200 - 107.0) / 81.4 = **13.4**

A z-score of 13.4 is enormous and clearly flags the error. But notice the trap: the std here (81.4 kg) is *itself* inflated by the 1200 value. **The very outlier you are hunting distorts the yardstick you measure it with.** When extreme values are present, the z-score rule can both miss borderline cases and overstate the spread, which is why a more robust method exists.

### The Formula in pandas

There is no dedicated z-score function in pandas, and you do not need one: the formula is three operations you already know. A column has a \`.mean()\` method and a \`.std()\` method for the standard deviation, and arithmetic on a whole column happens element by element, so subtracting a number from a column and dividing by another number gives you a new column with one z-score per row:

\`\`\`python
load = df['Added_Weight_kg']

mean = load.mean()
std = load.std()
z = (load - mean) / std          # one z-score per row
\`\`\`

The rule uses the *size* of the z-score, ignoring the sign, so \`z.abs()\` turns negative scores positive. Comparing that with 3 gives a True/False column, and \`.sum()\` counts the flagged rows, exactly as it did for the impossible RPE:

\`\`\`python
flagged = z.abs() > 3
print(flagged.sum())
\`\`\`

One detail worth knowing: pandas computes the *sample* standard deviation (it divides by n minus 1), which is what you want for data from a sample of athletes or sessions. NumPy's \`np.std()\` divides by n instead, so the two give slightly different numbers on the same data. Inside pandas, stick to \`.std()\`.`},{type:"exercise",id:"ex-5-28",title:"Flag Outliers with the Z-Score Rule",domain:"physiology",packages:["pandas"],dataFiles:["strength_log.csv"],description:"Compute z-scores for `Added_Weight_kg` (already extracted as load).\n1. Store the number of rows with |z| > 3 in `n_flagged`.\n2. Store the z-score of the 1200 kg squat, rounded to 1 decimal, in `z_1200`.\n3. Print both.\nAny clear print format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')
load = df['Added_Weight_kg']`,testCode:`assert int(n_flagged) == 1, f"exactly 1 set is beyond 3 SDs, got {n_flagged}"
assert abs(z_1200 - 13.4) < 0.05, f"z_1200 should be about 13.4, got {z_1200}"
print("PASS")`,hints:["z = (load - mean) / std; count the flags with (`z.abs()` > 3)`.sum()`. The 1200 kg squat scores about 13.4.",`mean = load.mean()
std = load.std()
z = (load - mean) / std

n_flagged = (z.abs() > ___).sum()
z_1200 = round((1200 - mean) / std, 1)

print(n_flagged)
print(z_1200)`]},{type:"md",md:`---

## The IQR Rule

The **interquartile range (IQR)** method does not use the mean or the std at all. Instead it uses quartiles, which barely move when a few extreme values are present.

- **Q1** is the 25th percentile: in pandas, \`load.quantile(0.25)\`.
- **Q3** is the 75th percentile: \`load.quantile(0.75)\`.
- **IQR = Q3 - Q1**, the spread of the middle half of the data.

You then build *fences*:

\`\`\`
lower fence = Q1 - 1.5 x IQR
upper fence = Q3 + 1.5 x IQR
\`\`\`

Anything below the lower fence or above the upper fence is flagged. For the strength log:
- Q1 = 80 kg, Q3 = 125 kg, IQR = 45 kg
- Upper fence = 125 + 1.5 x 45 = **192.5 kg**
- One set exceeds that: Emma's 1200 kg squat.

Why prefer this method? Because **quartiles resist extremes**. Pushing one value from 120 to 1200 does not move Q1 or Q3. The IQR rule measures spread with a ruler the outlier cannot bend.

Catching a value outside *either* fence takes two conditions in one filter, which is new. Pandas uses \`|\` for "or" and \`&\` for "and" (the row-by-row versions of the \`or\` and \`and\` you met in Module 4), and each condition sits in its own parentheses:

\`\`\`python
outliers = df[(load < lower_fence) | (load > upper_fence)]
\`\`\``},{type:"exercise",id:"ex-5-29",title:"Flag the Outliers with the IQR Rule",domain:"coaching",packages:["pandas"],dataFiles:["strength_log.csv"],description:"Apply the IQR rule to `Added_Weight_kg`, already extracted for you as `load`.\n1. Store Q1 in `q1` and Q3 in `q3`, using `.quantile()`.\n2. Store the interquartile range in `iqr`.\n3. Store the lower fence in `lower_fence` and the upper fence in `upper_fence`, both rounded to 1 decimal.\n4. Store the number of rows outside either fence in `n_outliers`.\n5. Print both fences and `n_outliers`.\nAny clear print format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')
load = df['Added_Weight_kg']`,testCode:`_q1 = df['Added_Weight_kg'].quantile(0.25)
_q3 = df['Added_Weight_kg'].quantile(0.75)
_iqr = _q3 - _q1
_uf = _q3 + 1.5 * _iqr
_lf = _q1 - 1.5 * _iqr
assert abs(float(q1) - _q1) < 1e-6 and abs(float(q3) - _q3) < 1e-6, f"q1/q3 should be the 25th and 75th percentiles, got {q1}, {q3}"
assert abs(float(iqr) - _iqr) < 1e-6, f"iqr should be q3 - q1, got {iqr}"
assert abs(float(lower_fence) - round(float(_lf), 1)) < 0.06, f"lower_fence should be {round(float(_lf), 1)}, got {lower_fence}"
assert abs(float(upper_fence) - round(float(_uf), 1)) < 0.06, f"upper_fence should be {round(float(_uf), 1)}, got {upper_fence}"
_expected = int(((load < _lf) | (load > _uf)).sum())
assert int(n_outliers) == _expected, f"n_outliers should be {_expected}, got {n_outliers}"
print("PASS")`,hints:["`quantile(0.25)` gives Q1 and `quantile(0.75)` gives Q3; the fences sit 1.5 IQR below Q1 and above Q3. With Q1 = 80 and Q3 = 125 they land at 12.5 and 192.5.",`q1 = load.quantile(0.25)
q3 = load.quantile(___)
iqr = q3 - q1

lower_fence = round(q1 - 1.5 * iqr, 1)
upper_fence = round(q3 + 1.5 * iqr, 1)

n_outliers = ((load < lower_fence) | (load > ___)).sum()

print(lower_fence)
print(upper_fence)
print(n_outliers)`]},{type:"md",md:`---

## Error vs Real Extreme

Flagging a value is not the same as deleting it. A flag only says "this is unusual"; it does not say "this is wrong." The decisive question is always: **could this value be possible?**

- An \`Added_Weight_kg\` of **1200** for a squat is beyond anything a human has ever lifted; the record is around 500 kg. Almost certainly 120 with an extra zero. **Error.**
- An \`RPE\` of **45** is *impossible by definition*: the scale only runs 0 to 10. **Error.**
- A deadlift of **177.5 kg** by the strongest athlete is far above the squad's typical loads, but entirely normal for a trained lifter. **Real extreme, keep it.**
- A pull-up set of **12 reps** when most sets are 5 to 8 is unusual, but perfectly possible on a good day. **Real extreme, keep it.**

Statistics tell you a value is *unusual*; only **domain knowledge** tells you whether it is *wrong*. A strong athlete is supposed to be an outlier. Deleting that data point would erase exactly the performance you most want to study.`},{type:"md",md:`---

## Flag, Don't Silently Delete

When you find an outlier, follow a disciplined process rather than reaching for the delete key:

1. **Flag it.** Add a column marking the row as suspicious. Never let it vanish without a trace.
2. **Investigate.** Check the raw record. Why is this value here? Can you verify it against the original session sheet?
3. **Correct if recoverable.** If the true value is knowable (the sheet says 120 kg and someone typed 1200), fix it and note the correction.
4. **Remove only with a recorded reason.** If the value is clearly an error and unrecoverable, you may drop it, but document what you removed and why.
5. **Otherwise keep and report.** If you cannot prove it is wrong, keep it. A genuine extreme is real data.

**Quietly deleting inconvenient data is one of the most common ways analyses end up lying.** Flagging keeps the decision visible, documented, and reproducible.

A flag column is simply a comparison stored in the DataFrame: \`df['flag_load'] = df['Added_Weight_kg'] > upper_fence\` gives every row a True or False. When you do decide to remove flagged rows, \`df.drop(rows.index)\` removes exactly those rows and nothing else, which matters here because comparisons on a column with missing values (like the pull-up loads) treat NaN as "not flagged", so the pull-ups stay.`},{type:"exercise",id:"ex-5-31",title:"Flag, Then Remove the Outliers",domain:"physiology",packages:["pandas"],dataFiles:["strength_log.csv"],description:"Flag the two outliers first, then remove exactly those rows.\n1. Add a True/False column `flag_load` that is True when `Added_Weight_kg` > 192.5 (the IQR upper fence).\n2. Add a True/False column `flag_rpe` that is True when `RPE` > 10.\n3. Store the number of rows flagged by either rule in `n_any_flagged`.\n4. Store the flagged rows in `bad_rows` and create `df_clean` by dropping them with `df.drop(bad_rows.index)`.\n5. Store the shape of `df_clean` in `clean_shape`.\n6. Print the two per-rule counts, `n_any_flagged`, and the shape before and after.\nAny clear print format is fine. In practice you would log the reason for the removal before this step.",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')`,testCode:`assert int(df['flag_load'].sum()) == 1, "the load rule should flag exactly 1 row"
assert int(df['flag_rpe'].sum()) == 1, "the RPE rule should flag exactly 1 row"
assert int(n_any_flagged) == 2, f"2 rows are flagged in total, got {n_any_flagged}"
assert len(bad_rows) == 2, f"bad_rows should hold the 2 flagged rows, got {len(bad_rows)}"
assert int(clean_shape[0]) == 286, f"Expected 286 rows after removal, got {clean_shape[0]}"
assert int(clean_shape[1]) == df.shape[1], "df_clean should keep all the columns of df, including the two flag columns"
assert len(df) == 288, "df itself should be left untouched; put the cleaned table in df_clean"
print("PASS")`,hints:["Each flag is a comparison stored as a column. Combine the two with `|` to select the flagged rows and to count them with `.sum()`; `df.drop(bad_rows.index)` then removes exactly those rows. 288 minus 2 leaves 286.",`df["flag_load"] = df["Added_Weight_kg"] > 192.5
df["flag_rpe"] = df["RPE"] > ___

n_any_flagged = (df["flag_load"] | df["flag_rpe"]).sum()

bad_rows = df[df["flag_load"] | df["___"]]
df_clean = df.drop(bad_rows.index)
clean_shape = df_clean.shape

print(df["flag_load"].sum())
print(df["flag_rpe"].sum())
print(n_any_flagged)
print(df.shape)
print(clean_shape)`]},{type:"md",md:`---

## Summary

- An outlier is either an error or a real extreme: statistics flag it, domain knowledge decides which.
- The z-score rule (|z| > 3) is simple, but the outlier inflates the very std it is measured against.
- The IQR rule (fences 1.5 IQR beyond the quartiles) resists that distortion, because quartiles barely move.
- A value outside its physical range (an RPE of 45, a 1200 kg squat) is an error; an exceptional but possible value is real data.
- Flag, investigate, correct or remove with a recorded reason, and never silently delete.

In the next lesson, we turn the numbers into pictures with Matplotlib: line plots, scatters, bars, boxes, and histograms, and use them to see the outliers you just flagged.`}],quiz:{id:"quiz-5-2",title:"Outliers Quiz",questions:[{id:"q1",type:"multiple-choice",question:"Using the z-score rule, what does a value with |z| > 3 indicate?",options:[{value:"a",label:"The value is definitely a data-entry error and should be deleted"},{value:"b",label:"The value is unusually extreme -- more than three standard deviations from the mean"},{value:"c",label:"The value is exactly three times the mean"},{value:"d",label:"The value is missing and must be imputed"}],correctAnswer:"b",explanation:"The z-score z = (x - mean) / std counts how many standard deviations a value lies from the mean. |z| > 3 flags a value as unusually extreme, but extreme is not the same as wrong -- it is a candidate to investigate, not an automatic error."},{id:"q2",type:"multiple-choice",question:"Why is the IQR rule generally more robust than the z-score rule for flagging outliers?",options:[{value:"a",label:"It uses more data points than the z-score rule"},{value:"b",label:"It always flags more outliers, so it catches everything"},{value:"c",label:"Quartiles are not distorted by the very outliers you are hunting, whereas the std is"},{value:"d",label:"It does not require sorting the data"}],correctAnswer:"c",explanation:"The z-score uses the mean and std, both of which are dragged toward an extreme value -- the outlier inflates the std and distorts its own score. The IQR rule uses Q1 and Q3, which are positions in the sorted data and barely move when a few extreme values are present."},{id:"q3",type:"multiple-choice",question:"You spot an outlier in your dataset. Should you delete it the instant you see it?",options:[{value:"a",label:"Yes -- outliers always distort the analysis, so remove them immediately"},{value:"b",label:"No -- investigate whether it is an error or a real extreme first, and remove it only with a recorded reason"},{value:"c",label:"Yes -- but only if it is above the mean"},{value:"d",label:"No -- you must always keep every value exactly as recorded"}],correctAnswer:"b",explanation:"A flag means a value is unusual, not that it is wrong. Investigate the raw record first: correct it if the true value is recoverable, remove it only with a documented reason, otherwise keep and report it. Silently deleting inconvenient data is how analyses end up lying."},{id:"q4",type:"multiple-choice",question:"An athlete posts a VO2max far above everyone else in the squad. What should you conclude?",options:[{value:"a",label:"It is an error: any value flagged as an outlier is wrong"},{value:"b",label:"It is correct: elite athletes are supposed to be outliers, so keep it as it is"},{value:"c",label:"Nothing yet: flag it, ask whether the value is physically possible, and check it against the raw test record before you keep or remove it"},{value:"d",label:"Remove it, because one extreme value distorts the mean"}],correctAnswer:"c",explanation:"An outlier is either an error or a genuine extreme, and being an elite athlete does not rule out a typing or measurement error. So the flag is where the work starts, not where it ends: ask whether the value is possible, verify it against the raw record, then keep and report it if it holds up, correct it if the true value is recoverable, and remove it only with a documented reason."}]}},"data-sumups":{blocks:[{type:"md",md:"# First Look and Summaries\n\n## First Steps with Any Dataset\n\nWhen you receive a new dataset, whether a fitness testing battery, GPS tracking data, or a season-long training log, the first thing to do is **look at it**. Before any cleaning or analysis you need to know:\n\n1. How big is the dataset?\n2. What columns (variables) are there?\n3. What data types are present?\n4. Are there missing values?\n5. What are the ranges and distributions of the numerical values?\n\nThis module works on one dataset most of the way through. `strength_log.csv` holds 288 rows: six athletes, eight weeks, two sessions a week, one row per exercise in each session. The columns are `Date`, `Athlete`, `Exercise` (Squat, Bench Press, Deadlift, or Pull-Up), `Sets`, `Reps`, `Added_Weight_kg` (the weight on the bar, or on a weight belt for pull-ups), `RPE` (rating of perceived exertion, 0 to 10), and `RIR` (reps in reserve: how many more reps the athlete could have done before failure).\n\nPandas provides a suite of methods for the first look. You know `head()`, `shape`, and `dtypes` from Module 2. The single most useful addition is `describe()`, which gives you count, mean, std, min, quartiles, and max for every numeric column in one call."},{type:"example",packages:["pandas"],dataFiles:["strength_log.csv"],caption:"Shape and columns, then describe() as a table: an instant snapshot of every numeric column.",code:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')

print("Shape:", df.shape)
print("Columns:", list(df.columns))

df.describe().round(1)`},{type:"md",md:"Two rows of that table deserve a second look. The `count` row says `Added_Weight_kg` has 219 values while the other columns have 288, so the load column has gaps. The `max` row shows an added weight of 1200 kg and an RPE of 45 on a 0 to 10 scale. Hold both thoughts: the next two lessons deal with exactly these problems. For now, the point is that `describe()` surfaced them in one call."},{type:"exercise",id:"ex-5-34",title:"First Look at the Strength Log",domain:"coaching",packages:["pandas"],dataFiles:["strength_log.csv"],description:"The strength log is loaded for you as `df`.\n1. Store the shape in `log_shape` and print it.\n2. Print the list of column names.\n3. Store the number of different athletes in `n_athletes`, using `.nunique()`, and print it.\n4. Store the number of rows per exercise in `sets_per_exercise`, using `.value_counts()`, and print it.\nAny clear print format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')`,testCode:`assert tuple(log_shape) == (288, 8), f"shape should be (288, 8), got {log_shape}"
assert int(n_athletes) == 6, f"n_athletes should be 6, got {n_athletes}"
assert int(sets_per_exercise['Squat']) == 76 and int(sets_per_exercise['Pull-Up']) == 69, "sets_per_exercise should be the value_counts() of the Exercise column"
print("PASS")`,hints:["`df.shape`, `list(df.columns)`, `.nunique()` on the Athlete column, and `.value_counts()` on the Exercise column cover the four facts.",`log_shape = df.shape
print(log_shape)
print(list(df.columns))

n_athletes = df["Athlete"].___()
print(n_athletes)

sets_per_exercise = df["Exercise"].___()
print(sets_per_exercise)`]},{type:"md",md:"## Individual Column Statistics\n\n`describe()` covers everything at once, but you often need one statistic for one column:\n\n```python\ndf['RPE'].mean()                # mean\ndf['RPE'].median()              # median (50th percentile)\ndf['RPE'].std()                 # standard deviation\ndf['RPE'].min()                 # minimum\ndf['RPE'].max()                 # maximum\ndf['RPE'].quantile(0.75)        # 75th percentile\n```\n\nFor text columns, `value_counts()` shows how often each category appears and `nunique()` counts the distinct values. `corr()` tells you whether two numeric columns move together: a value near 1 means they rise together, near -1 means one falls as the other rises, near 0 means no linear relationship."},{type:"md",md:"## Groupby: A Quick Recap\n\nYou met `groupby()` in Module 2: split the rows into groups, apply one calculation to each group, combine the results into one Series. Almost every summary a coach asks for is a groupby: mean load **per exercise**, mean RPE **per athlete**, total volume **per week**.\n\n```python\ndf.groupby('Exercise')['Added_Weight_kg'].mean()\n```\n\nSwap `.mean()` for `.sum()`, `.std()`, `.max()`, or `.count()` to answer a different question with the same line."},{type:"example",packages:["pandas"],dataFiles:["strength_log.csv"],caption:"Mean added weight per exercise, and the number of sets each athlete logged.",code:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')

print("Mean added weight per exercise:")
print(df.groupby('Exercise')['Added_Weight_kg'].mean().round(1))
print()
print("Sets logged per athlete:")
print(df.groupby('Athlete')['Exercise'].count())`},{type:"md",md:"Notice the `NaN` for Pull-Up in the first table: the mean of a column with no values is not a number. That is the missing added weight again, and it will follow us until the next lesson fixes it."},{type:"md",md:`## A New Column Before Grouping

Often the number you want to summarise does not exist as a column yet. In strength training, **volume load** is sets times reps times weight: the total kilograms moved in a set. Build it as a new column first, then group on it like any other:

\`\`\`python
df['Volume_kg'] = df['Sets'] * df['Reps'] * df['Added_Weight_kg']
df.groupby('Athlete')['Volume_kg'].sum()
\`\`\``},{type:"exercise",id:"ex-5-38",title:"Volume Load per Exercise",domain:"coaching",packages:["pandas"],dataFiles:["strength_log.csv"],description:"The strength log is loaded for you as `df`.\n1. Add a column `Volume_kg` equal to `Sets` times `Reps` times `Added_Weight_kg`.\n2. Group by `Exercise` and store the total `Volume_kg` per exercise, rounded to 0 decimals, in `total_volume`.\n3. Group by `Exercise` and store the mean `Volume_kg` per set, rounded to 0 decimals, in `mean_volume`.\n4. Print both.\nAny clear print format is fine. Pull-Up shows 0 total volume: the added weight is missing, so every pull-up volume is NaN and a sum of nothing is 0. The next lesson sorts that out.",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')`,testCode:`assert 'Volume_kg' in df.columns, "df should have a Volume_kg column"
assert abs(float(total_volume['Squat']) - 228888.0) < 1.0, f"Squat total volume should be 228888, got {total_volume['Squat']}"
assert abs(float(total_volume['Deadlift']) - 211110.0) < 1.0, f"Deadlift total volume should be 211110, got {total_volume['Deadlift']}"
_ref = df.groupby('Exercise')['Volume_kg'].mean()
assert abs(float(mean_volume['Squat']) - float(_ref['Squat'])) < 1.0, "mean_volume should be the mean Volume_kg per exercise"
print("PASS")`,hints:["Create the column first; then the same groupby line twice, once ending in `.sum()` and once in `.mean()`.",`df["Volume_kg"] = df["Sets"] * df["Reps"] * df["___"]

total_volume = df.groupby("Exercise")["Volume_kg"].sum().round(0)
mean_volume = df.groupby("Exercise")["Volume_kg"].___().round(0)

print(total_volume)
print()
print(mean_volume)`]},{type:"md",md:`## Grouping by Two Columns

So far every group has been defined by one column: one mean per exercise, or one total per athlete. Often the question needs two: what is the mean added weight for **each athlete in each exercise**? That is a group for every combination of athlete and exercise, six athletes times four exercises, 24 groups at most.

\`groupby()\` handles this if you pass it a **list** of columns instead of one name:

\`\`\`python
df.groupby(['Athlete', 'Exercise'])['Added_Weight_kg'].mean()
\`\`\`

To see what happens, start from a few raw rows of the log:

| Date | Athlete | Exercise | Added_Weight_kg |
|------|---------|----------|-----------------|
| 2026-01-05 | Emma | Deadlift | 97.5 |
| 2026-01-05 | Emma | Squat | 77.5 |
| 2026-01-05 | Martin | Squat | 137.5 |
| 2026-01-08 | Emma | Deadlift | 100.0 |
| 2026-01-08 | Martin | Deadlift | 167.5 |

The split step puts every row into the pile for its own (athlete, exercise) pair: both of Emma's deadlifts go into one pile, her squat into another, Martin's squat into a third, his deadlift into a fourth, and so on across all 288 rows. The apply step takes the mean of each pile. The combine step lists one number per pile, and this is what it looks like on the full log:

| Athlete | Exercise | Added_Weight_kg |
|---------|----------|-----------------|
| Emma | Bench Press | 45.0 |
| Emma | Deadlift | 98.6 |
| Emma | Pull-Up | NaN |
| Emma | Squat | 179.8 |
| Ingrid | Bench Press | 49.2 |
| Ingrid | Deadlift | 108.2 |
| Ingrid | Pull-Up | NaN |
| Ingrid | Squat | 81.3 |
| ... | ... | ... |
| Sofie | Squat | 94.5 |

The two left-hand columns are not ordinary columns. Together they form the **index** of the result, a two-level index, so each row is labelled by a *pair* rather than by a single name. Everything you know about a Series still works, with pairs where names used to be:

- \`combo_loads[('Martin', 'Deadlift')]\` looks up one cell, so \`165.6\`.
- \`.idxmax()\` returns the label of the largest value, which is now a pair such as \`('Martin', 'Deadlift')\`.
- \`.round(1)\`, \`.sum()\`, \`.max()\` behave exactly as before.

The result has 24 rows, one per pair. The pull-up rows show NaN: their added weight is missing for every set, so the mean of each pull-up pile is not a number. The gaps you spotted in the first look follow you into every summary until the next lesson deals with them.`},{type:"exercise",id:"ex-5-40",title:"Multi-column Groupby: Athlete and Exercise",domain:"coaching",packages:["pandas"],dataFiles:["strength_log.csv"],description:"The strength log is loaded for you as `df`.\n1. Group by both `Athlete` and `Exercise` (pass them as a list) and compute the mean `Added_Weight_kg`, rounded to 1 decimal; store the Series in `combo_loads`.\n2. Store the (athlete, exercise) pair with the highest mean in `top_combo`, using `.idxmax()`.\n3. Print the table and the pair.\nAny clear print format is fine. The pair at the top may surprise you: it is an artefact of the 1200 kg typo, which the outliers lesson removes.",initialCode:`import pandas as pd

df = pd.read_csv('data/strength_log.csv')`,testCode:`assert isinstance(top_combo, tuple), "top_combo should be an (Athlete, Exercise) tuple"
assert tuple(top_combo) == ('Emma', 'Squat'), f"Expected ('Emma', 'Squat') because of the 1200 kg typo, got {top_combo}"
assert abs(float(combo_loads[('Martin', 'Deadlift')]) - 165.6) < 0.06, "combo_loads should be the mean Added_Weight_kg per athlete and exercise"
print("PASS")`,hints:['Group by the list `["Athlete", "Exercise"]` to get a two-level index; `.idxmax()` on the result returns a tuple.',`combo_loads = df.groupby(["Athlete", "___"])["Added_Weight_kg"].mean().round(1)
print(combo_loads)

top_combo = combo_loads.___()
print(top_combo)`]},{type:"md",md:'---\n\n## Summary\n\n- `describe()` gives the full numeric snapshot; individual methods (`mean()`, `median()`, `quantile()`) target single columns.\n- `value_counts()` and `nunique()` summarise text columns.\n- `groupby()` answers any "X by Y" question in one line, and swapping the final method (`.mean()`, `.sum()`, `.std()`, `.count()`) changes the question. A list of columns groups by several at once.\n- Build a new column first when the number you want to summarise does not exist yet, such as volume load.\n\nThe first look also raised two questions that summaries cannot answer: why the load column has gaps, and what to do with an added weight of 1200 kg and an RPE of 45. In the next lesson, we start cleaning, beginning with the gaps.'}],quiz:{id:"quiz-5-3",title:"Summarising Data Quiz",questions:[{id:"q1",type:"multiple-choice",question:"describe() shows that Added_Weight_kg has a count of 219 while every other column has 288. What does that tell you?",options:[{value:"a",label:"The column has 69 missing values that need a closer look before any analysis"},{value:"b",label:"describe() only counts the first 219 rows of a column"},{value:"c",label:"The file was read incorrectly and should be reloaded"},{value:"d",label:"The column holds 219 different values"}],correctAnswer:"a",explanation:"The count row counts non-missing values. 288 minus 219 is 69 gaps, and the first look is exactly where you should notice them. Why they are missing, and what to do about them, is the job of the next lesson."},{id:"q2",type:"multiple-choice",question:"Which method would you use to see summary statistics (mean, std, min, max, quartiles) for all numerical columns in a DataFrame?",options:[{value:"a",label:"df.info()"},{value:"b",label:"df.summary()"},{value:"c",label:"df.describe()"},{value:"d",label:"df.statistics()"}],correctAnswer:"c",explanation:"df.describe() computes count, mean, std, min, 25%, 50%, 75%, and max for all numerical columns. df.info() shows column types and non-null counts but not statistics."},{id:"q3",type:"multiple-choice",question:"You have the mean added weight per exercise from df.groupby('Exercise')['Added_Weight_kg'].mean(). How do you get the heaviest set per exercise instead?",options:[{value:"a",label:"Change .mean() to .max() at the end of the same line"},{value:"b",label:"Multiply each mean by the number of sets"},{value:"c",label:"Loop over the rows and keep the largest value for each exercise by hand"},{value:"d",label:"You cannot; groupby only computes means"}],correctAnswer:"a",explanation:"The split and apply steps stay the same; only the statistic changes. Swapping the final method (.mean(), .sum(), .max(), .count()) asks a different question of the same groups. A manual loop redoes what groupby already does in one line."},{id:"q4",type:"multiple-choice",question:"What does df.groupby('Exercise')['Added_Weight_kg'].mean() return?",options:[{value:"a",label:"The overall mean added weight"},{value:"b",label:"A DataFrame with all columns averaged by exercise"},{value:"c",label:"A Series with the mean added weight for each exercise"},{value:"d",label:"An error because you can only group by numeric columns"}],correctAnswer:"c",explanation:"groupby('Exercise') splits the data by exercise, then ['Added_Weight_kg'].mean() computes the mean within each group. The result is a Series indexed by exercise name."}]}},"viz-basic-plots":{blocks:[{type:"md",md:"# Basic Plots\n\n## Why Visualisation Matters in Sport Science\n\nNumbers alone rarely tell the full story. A table of 180 heart rate values is hard to read, but a single line plot instantly shows the warm-up, the hard effort, and the recovery. In the cleaning lessons you found two outliers with `describe()` and saw one of them in a box plot. Plots and numbers inspect the same data from two sides: the numbers tell you *that* something is off, the plot shows you *where* and whether it is alone.\n\n**Matplotlib** is Python's foundational plotting library. A large share of the figures you see in sport science journals are made with Matplotlib, or with a library built on top of it. Every plot in this lesson is drawn from a dataset you import, the same files you cleaned and summarised earlier in the module.\n\n## Importing Matplotlib\n\n```python\nimport pandas as pd\nimport matplotlib.pyplot as plt\n```\n\nThe convention is to import the `pyplot` module as `plt`. This gives you access to all the common plotting functions. We also import pandas, because the data arrives as a DataFrame and a DataFrame column can be handed straight to a plotting function.\n\n## The Building Blocks of a Plot\n\nEvery plot in this module is built from the same five pieces, in the same order. Learn them once and every plot type becomes a variation.\n\n**1. Create a figure and an axes.** A **figure** is the whole canvas, the window or image that will be saved. An **axes** is one set of x and y axes drawn on that canvas, the area you actually plot in. One call creates both and hands them back as a pair:\n\n```python\nfig, ax = plt.subplots()\n```\n\nThe names `fig` and `ax` are the convention; almost everything you do next happens through `ax`. Pass `figsize=(8, 5)` to `plt.subplots()` to set the width and height in inches.\n\n**2. Draw the data on the axes.** Each plot type is a method of `ax` that takes the data as its arguments. A line plot takes an x column and a y column, here the torque recorded by an isokinetic dynamometer during a knee extension:\n\n```python\nax.plot(iso['Time'], iso['Torque'])\n```\n\nLater in this lesson you meet `ax.scatter()`, `ax.bar()`, `ax.boxplot()`, and `ax.hist()`. They differ only in what data they expect.\n\n**3. Label it.** A plot without labels is a puzzle. Three methods set the axis labels and the title, each taking a string:\n\n```python\nax.set_xlabel('Time (s)')\nax.set_ylabel('Torque (Nm)')\nax.set_title('Knee Extension Torque')\n```\n\n**4. Optional polish.** There are many ways to change how a plot looks: grid lines, legends, colours, line styles, markers, axis limits, annotations, and more. We focus on those later in the module. For now, the three steps above give you a complete, readable plot.\n\n**5. Show it.** In this course the figure appears under the code block automatically when the code runs. On your own computer, in a script, you end with `plt.show()` to open the window, or `fig.savefig('figure.png')` to save it to a file.\n\n| Step | Call | What it does |\n|------|------|--------------|\n| Create | `fig, ax = plt.subplots()` | One canvas with one set of axes |\n| Draw | `ax.plot(x, y)` | Draws the data (swap for scatter, bar, boxplot, hist) |\n| Label | `ax.set_xlabel()`, `ax.set_ylabel()`, `ax.set_title()` | Names the axes and the plot |\n| Polish | many options, covered later | Grid lines, legends, colours, styles |\n| Show | automatic here, `plt.show()` in a script | Displays the figure |\n\nThe example below is the whole recipe with one comment per step. Run it, then change a label or the figure size to see what each line controls."},{type:"example",packages:["pandas","matplotlib"],dataFiles:["isok30.csv"],caption:"The five building blocks in order: create, draw, label, polish, show. Torque from one isokinetic knee extension.",code:`import pandas as pd
import matplotlib.pyplot as plt

iso = pd.read_csv('data/isok30.csv')

# 1. Create a figure with one set of axes
fig, ax = plt.subplots(figsize=(8, 5))

# 2. Draw the data: torque against time
ax.plot(iso['Time'], iso['Torque'])

# 3. Label the axes and the plot
ax.set_xlabel('Time (s)')
ax.set_ylabel('Torque (Nm)')
ax.set_title('Knee Extension Torque')

# 4. Polish: a faint grid
ax.grid(True, alpha=0.3)

# 5. Show: happens automatically here (plt.show() in a script)`},{type:"md",md:"## Line Plots\n\nLine plots are ideal for **time series** data, anything measured over time: force-time curves, heart rate traces, velocity profiles, and loads across a season. The points are joined in the order they appear, so the x data must be in order, as time naturally is.\n\n`ax.plot()` accepts a few extra arguments that you will use constantly: `linewidth=2` makes the line thicker, `linestyle='--'` makes it dashed, and `label='Recorded'` names it for a legend."},{type:"exercise",id:"ex-5-50",title:"Plot the Heart Rate Trace",domain:"physiology",packages:["pandas","matplotlib"],dataFiles:["hr_trace.csv"],description:"The heart rate trace is loaded for you as `df`, and `fig, ax` are created. Plot `HR_bpm` against `Time_s` as a line on `ax`. Add the title 'Heart Rate Trace', the x-label 'Time (s)', and the y-label 'Heart rate (bpm)'.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/hr_trace.csv')
fig, ax = plt.subplots()`,testCode:`assert len(ax.lines) >= 1, "No line plotted"
assert len(ax.lines[0].get_xdata()) == 180, "The line should use all 180 samples from the file"
assert ax.get_title() == 'Heart Rate Trace', f"Title wrong: {ax.get_title()}"
assert ax.get_xlabel() == 'Time (s)', f"xlabel wrong: {ax.get_xlabel()}"
assert ax.get_ylabel() == 'Heart rate (bpm)', f"ylabel wrong: {ax.get_ylabel()}"
print("PASS")`,hints:["`ax.plot(x, y)` draws the line, with the two DataFrame columns as `x` and `y`; `set_title`, `set_xlabel`, and `set_ylabel` add the text.",`ax.plot(df["Time_s"], df["___"])
ax.set_title("Heart Rate Trace")
ax.set_xlabel("Time (s)")
ax.set_ylabel("___")`]},{type:"md",md:"## Multiple Lines on One Plot\n\nYou can call `ax.plot()` several times on the same axes, and each call adds another line. With two or more lines the reader needs to know which is which, and that is the job of a **legend**: a small box on the plot that pairs each line's colour with a name.\n\nBuilding one takes two steps. First, give each line a name when you draw it, with the `label` argument. Matplotlib stores the name with the line but does not show it yet. Second, call `ax.legend()` once, after all the lines are drawn. It collects every stored label and draws the box, picking a corner that covers as little data as possible. If you call `ax.legend()` without having given any line a label, the box has nothing to list and Matplotlib warns you.\n\nOne more thing you will meet in the exercise: when the x-axis holds **dates**, the labels are long and crowd into each other. `ax.tick_params(axis='x', labelrotation=45)` tilts them so they stay readable. The customisation lesson explains it properly; for now, use that line whenever dates sit on the x-axis.\n\n```python\nax.plot(df['Time_s'], df['HR_interp'], label='Interpolated')\nax.plot(df['Time_s'], df['HR_bpm'], label='Recorded')\nax.legend()\n```"},{type:"example",packages:["pandas","matplotlib"],dataFiles:["hr_trace.csv"],caption:"Recorded and interpolated heart rate on one axes. The dashed line bridges the gaps you filled in the cleaning lesson.",code:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/hr_trace.csv')
df['HR_interp'] = df['HR_bpm'].interpolate(method='linear')

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(df['Time_s'], df['HR_interp'], linestyle='--', label='Interpolated')
ax.plot(df['Time_s'], df['HR_bpm'], linewidth=2, label='Recorded')
ax.set_xlabel('Time (s)')
ax.set_ylabel('Heart rate (bpm)')
ax.set_title('Recorded vs Interpolated Heart Rate')
ax.legend()
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-51",title:"Squat Progression for Three Athletes",domain:"coaching",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"The strength log is loaded, the dates are converted, and the squat sets of three athletes are filtered into `martin`, `sofie`, and `jonas`. Plot `Added_Weight_kg` against `Date` for each athlete on `ax`, each with a `label` so the legend can tell them apart, then display the legend.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
df['Date'] = pd.to_datetime(df['Date'])
squats = df[df['Exercise'] == 'Squat']
martin = squats[squats['Athlete'] == 'Martin']
sofie = squats[squats['Athlete'] == 'Sofie']
jonas = squats[squats['Athlete'] == 'Jonas']

fig, ax = plt.subplots()
ax.tick_params(axis='x', labelrotation=45)   # tilts the date labels so they do not overlap`,testCode:`assert len(ax.lines) >= 3, f"Expected at least 3 lines, got {len(ax.lines)}"
legend = ax.get_legend()
assert legend is not None, "No legend found"
assert len(legend.texts) >= 3, "Legend should have at least 3 entries"
_n = sorted(len(l.get_xdata()) for l in ax.lines[:3])
assert _n == [13, 14, 14], f"Each line should hold one athlete's squat sets (13 or 14 points), got {_n}"
print("PASS")`,hints:["Call `ax.plot()` three times, once per athlete, each with the athlete's `Date` and `Added_Weight_kg` columns and a `label=`, then `ax.legend()`.",`ax.plot(martin["Date"], martin["Added_Weight_kg"], label="Martin")
ax.plot(sofie["Date"], sofie["Added_Weight_kg"], label="Sofie")
ax.plot(jonas["___"], jonas["___"], label="Jonas")
ax.legend()`]},{type:"md",md:"## Scatter Plots\n\nScatter plots show the **relationship between two variables**, one point per row. In sport science, use them to explore associations: height and jump height, grip strength and jump height, VO2max and race time.\n\nAt its simplest, `ax.scatter()` needs only the x column and the y column:\n\n```python\nax.scatter(tb['Height_cm'], tb['CMJ_cm'])\n```\n\nLike `ax.plot()`, it also accepts extra arguments that change the look of the points: `s` sets the marker size, `color` the fill colour, and `edgecolors` the outline colour. They are optional, and the example below uses them only to make the points easier to see:\n\n```python\nax.scatter(tb['Height_cm'], tb['CMJ_cm'], s=60, color='steelblue', edgecolors='black')\n```"},{type:"exercise",id:"ex-5-52",title:"Scatter Plot: Height vs Jump Height",domain:"physiology",packages:["pandas","matplotlib"],dataFiles:["test_battery.csv"],description:"The test battery is loaded for you as `tb`, and `fig, ax` are created. Create a scatter plot of `CMJ_cm` against `Height_cm` on `ax`, with height on the x-axis. Add the x-label 'Height (cm)', the y-label 'CMJ height (cm)', and the title 'Height vs Countermovement Jump'. Styling the points is optional.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

tb = pd.read_csv('data/test_battery.csv')
fig, ax = plt.subplots()`,testCode:`assert len(ax.collections) >= 1, "No scatter plot found"
_pts = ax.collections[0].get_offsets()
assert len(_pts) == 20, "The scatter should show all 20 athletes"
assert abs(float(max(p[0] for p in _pts)) - float(tb['Height_cm'].max())) < 1e-6, "Height_cm should be on the x-axis"
assert ax.get_xlabel() == 'Height (cm)', f"xlabel wrong: {ax.get_xlabel()}"
assert ax.get_ylabel() == 'CMJ height (cm)', f"ylabel wrong: {ax.get_ylabel()}"
assert ax.get_title() == 'Height vs Countermovement Jump', f"title wrong: {ax.get_title()}"
print("PASS")`,hints:["`ax.scatter(x, y)` plots one point per row; the height column is `x` and the jump column is `y`. Then add the two axis labels and the title.",`ax.scatter(tb["Height_cm"], tb["___"])
ax.set_xlabel("Height (cm)")
ax.set_ylabel("___")
ax.set_title("Height vs Countermovement Jump")`]},{type:"md",md:"## Bar Charts\n\nBar charts compare **categories**: positions, exercises, training phases, athletes. The categories usually come out of a `groupby()`, which gives you a Series whose index is the category names and whose values are the numbers to plot. Use `ax.bar(categories, values)` for vertical bars:\n\n```python\nmean_load = df.groupby('Exercise')['Added_Weight_kg'].mean()\nax.bar(mean_load.index, mean_load.values)\nax.set_ylabel('Mean added weight (kg)')\n```\n\nThe `.index` of the Series supplies the category names along the x-axis and `.values` supplies the bar heights."},{type:"exercise",id:"ex-5-53",title:"Bar Chart: Mean RPE per Exercise",domain:"coaching",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"The strength log is loaded for you as `df`.\n1. Group by `Exercise` and compute the mean `RPE`; store the Series in `mean_rpe`.\n2. Draw a bar chart of `mean_rpe` on `ax`, one bar per exercise.\n3. Add the y-label 'Mean RPE'.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
fig, ax = plt.subplots()`,testCode:`assert len(ax.patches) == 4, f"Expected 4 bars (one per exercise), got {len(ax.patches)}"
_ref = df.groupby('Exercise')['RPE'].mean()
assert abs(float(mean_rpe['Pull-Up']) - float(_ref['Pull-Up'])) < 1e-6, "mean_rpe should be the mean RPE per exercise"
_h = sorted(round(p.get_height(), 2) for p in ax.patches)
assert _h == sorted(round(v, 2) for v in _ref.values), f"Bar heights should be the mean RPE values, got {_h}"
assert ax.get_ylabel() == 'Mean RPE', f"ylabel wrong: {ax.get_ylabel()}"
print("PASS")`,hints:['`groupby("Exercise")["RPE"].mean()` gives a Series with the exercise names as its index; pass `.index` and `.values` to `ax.bar()`.',`mean_rpe = df.groupby("___")["RPE"].mean()
ax.bar(mean_rpe.index, mean_rpe.values)
ax.set_ylabel("___")`]},{type:"md",md:`## Box Plots

Box plots show the **distribution** of data: median, quartiles, and outliers. They are excellent for comparing groups because you can see the spread of each group at a glance, and any point beyond the whiskers is flagged for you.

Pass a list of columns, one per group, to \`ax.boxplot()\`. Filtering the DataFrame once per group is the usual way to build that list:

\`\`\`python
squat = df[df['Exercise'] == 'Squat']['Added_Weight_kg']
bench = df[df['Exercise'] == 'Bench Press']['Added_Weight_kg']
ax.boxplot([squat, bench], labels=['Squat', 'Bench Press'])
\`\`\`

The list decides the order of the boxes from left to right, and \`labels\` names them in the same order.`},{type:"exercise",id:"ex-5-54",title:"Box Plot: Added Weight per Exercise",domain:"coaching",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"The strength log is loaded for you as `df`, with the three loaded exercises filtered into `squat`, `bench`, and `deadlift` (the `Added_Weight_kg` column of each). Draw a box plot of the three on `ax` with the labels ['Squat', 'Bench Press', 'Deadlift'], and add the y-label 'Added weight (kg)'. Then look at the squat box: the 1200 kg typo from the outliers lesson is sitting far above it.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
squat = df[df['Exercise'] == 'Squat']['Added_Weight_kg']
bench = df[df['Exercise'] == 'Bench Press']['Added_Weight_kg']
deadlift = df[df['Exercise'] == 'Deadlift']['Added_Weight_kg']

fig, ax = plt.subplots()`,testCode:`assert len(ax.lines) >= 1, "No box plot found"
fig.canvas.draw()
_labels = [t.get_text() for t in ax.get_xticklabels()]
assert _labels == ['Squat', 'Bench Press', 'Deadlift'], f"Expected three boxes labelled Squat, Bench Press, Deadlift, got {_labels}"
assert ax.get_ylabel() == 'Added weight (kg)', f"ylabel wrong: {ax.get_ylabel()}"
print("PASS")`,hints:["Pass a LIST of the three columns to `ax.boxplot()`, plus `labels=[...]`, then set the y-label.",`ax.boxplot([squat, bench, ___],
           labels=["Squat", "Bench Press", "Deadlift"])
ax.set_ylabel("___")`]},{type:"md",md:"## Histograms\n\nHistograms show the **frequency distribution** of a single continuous variable. Choose the number of bins to control resolution:\n\n```python\nax.hist(data, bins=10)\n```\n\nThe data is the only required argument. `bins` sets how many equal-width intervals the range is cut into, and each bar shows how many values fall in that interval. Too few bins hide the shape; too many create noise. For a continuous measurement such as VO2max or jump height, ten bins is a good starting point.\n\nFor a **whole-number scale** such as RPE, equal-width bins look odd: the range 5 to 9 cut into ten slices gives bars with empty gaps between them. Instead, pass `bins` a list of the bin *edges*, placed halfway between the whole numbers, so every bar is centred on one value:\n\n```python\nax.hist(rpe_clean, bins=[4.5, 5.5, 6.5, 7.5, 8.5, 9.5])\n```\n\nSix edges give five bars: one for 5, one for 6, and so on up to 9. The bars of a histogram touch each other by design, since the bins share their edges; `edgecolor='white'` draws a thin white line between them if you want them easier to tell apart.\n\nTwo things must be true of the data first. It must contain no missing values, because a NaN cannot be placed in any bin, so `dropna()` comes before `hist()`. And it should contain no wild outliers, because the bins span the full range of the data: one value of 45 on a 0 to 10 scale stretches the axis to 45 and squashes every real value into the first bar. Clean, then plot."},{type:"exercise",id:"ex-5-55",title:"Histogram: RPE Distribution",domain:"coaching",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"The strength log is loaded for you as `df`, and the RPE values without gaps are stored in `rpe`. One of them is the impossible 45 from the outliers lesson; left in, it would stretch the x-axis to 45 and squash every real value into a single bar. So clean first, then plot.\n1. Store only the values of `rpe` that are 10 or below in `rpe_clean`, using a boolean filter.\n2. Plot a histogram of `rpe_clean` on `ax`, with the bin edges [4.5, 5.5, 6.5, 7.5, 8.5, 9.5] so each bar is one RPE value.\n3. Add the x-label 'RPE' and the y-label 'Number of sets'.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
rpe = df['RPE'].dropna()

fig, ax = plt.subplots()`,testCode:`assert len(rpe_clean) == 278, f"rpe_clean should hold the 278 valid RPE values, got {len(rpe_clean)}"
assert float(rpe_clean.max()) <= 10, "rpe_clean should not contain the impossible 45"
assert len(ax.patches) == 5, f"Expected 5 bars (one per RPE value), got {len(ax.patches)}"
assert int(sum(p.get_height() for p in ax.patches)) == 278, "The histogram should count all 278 clean RPE values"
assert [int(p.get_height()) for p in ax.patches] == [27, 82, 93, 56, 20], "Each bar should count one RPE value: 27, 82, 93, 56, 20"
assert ax.get_xlabel() == 'RPE', f"xlabel wrong: {ax.get_xlabel()}"
assert ax.get_ylabel() == 'Number of sets', f"ylabel wrong: {ax.get_ylabel()}"
print("PASS")`,hints:["A comparison inside square brackets keeps only the rows where it is True: `rpe[rpe <= 10]`. Then `ax.hist(data, bins=[...edges...])` and the two labels.",`rpe_clean = rpe[rpe <= ___]

ax.hist(rpe_clean, bins=[4.5, 5.5, 6.5, 7.5, 8.5, ___])
ax.set_xlabel("RPE")
ax.set_ylabel("___")`]},{type:"md",md:"## Summary\n\n| Plot Type | Best For | Key Method |\n|-----------|----------|------------|\n| Line plot | Time series, continuous data | `ax.plot(x, y)` |\n| Scatter plot | Relationships between variables | `ax.scatter(x, y)` |\n| Bar chart | Comparing categories | `ax.bar(categories, values)` |\n| Box plot | Distributions across groups | `ax.boxplot([g1, g2, ...])` |\n| Histogram | Distribution of one variable | `ax.hist(data, bins=N)` |\n\nEvery plot benefits from:\n- `ax.set_xlabel()` / `ax.set_ylabel()` for axis labels\n- `ax.set_title()` for a descriptive title\n- `ax.legend()` when multiple series are present\n- `ax.grid(True, alpha=0.3)` for readability\n\nPlots are an inspection tool as much as a presentation tool. The box plot in this lesson showed the 1200 kg squat in one glance, and the histogram only made sense once the impossible RPE was removed first. Cleaning and plotting go together.\n\nIn the next lesson, we polish these plots to publication quality: colours, markers, annotations, and reference lines."}],quiz:null},"viz-customization":{blocks:[{type:"md",md:`# Figure Customisation

## Making Publication-Ready Figures

A basic plot gets the data on screen, but presenting results in a thesis, journal paper, or team report requires professional styling. This lesson covers the customisation options you need. Every figure is drawn from an imported DataFrame, mostly the strength log and the heart rate trace you already know, so the styling is the only new thing on each page.

## Colours

Matplotlib accepts colours in several forms. Pass one as the \`color\` argument of any plotting call:

\`\`\`python
ax.plot(x, y, color='steelblue')            # a named colour
ax.plot(x, y, color='#c60c30')              # a hex code
ax.plot(x, y, color=(0.2, 0.7, 0.3))        # an RGB tuple, each value 0 to 1
\`\`\`

Named colours are quickest to write. Hex codes let you match a club's or a journal's palette exactly.

You do not need to memorise any of them: there are lists online of all the named colours and of the hex codes, with the colour shown next to each. You will use all three forms in the exercise after the next section.`},{type:"md",md:"## Line Styles, Markers, and Format Strings\n\nA line plot of a handful of sessions is clearer with a **marker** on each data point. Markers, line style, and colour can be set as separate keyword arguments or packed into a compact **format string**:\n\n```python\nax.plot(x, y, marker='o', linestyle='--', markersize=8)   # keyword arguments\nax.plot(x, y, 'o--')                                       # the same as a format string\n```\n\n**Common markers**\n\n- `'o'` circle\n- `'s'` square\n- `'^'` triangle\n- `'D'` diamond\n- `'x'` cross\n\n**Line styles**\n\n- `'-'` solid\n- `'--'` dashed\n- `':'` dotted\n- `'-.'` dash-dot\n\nA format string can also start with a one-letter colour: `'ro-'` is red circles joined by a solid line.\n\n**Date labels that overlap.** Most plots in this lesson have dates on the x-axis, and a label such as `2026-01-05` is long, so with more than a handful of them the labels run into each other. Tilting them fixes it, and every dated plot from here on does so:\n\n```python\nax.tick_params(axis='x', labelrotation=45)\n```\n\n`tick_params` adjusts the ticks of one axis and `labelrotation` is the angle in degrees; it can be called before or after the plotting. `fig.autofmt_xdate()`, called after the plotting, is a one-line shortcut that does the same and also right-aligns the labels."},{type:"example",packages:["pandas","matplotlib"],dataFiles:["training_log.csv"],caption:"Ingrid's RPE per session with circle markers on a solid line.",code:`import pandas as pd
import matplotlib.pyplot as plt

log = pd.read_csv('data/training_log.csv')
log['Date'] = pd.to_datetime(log['Date'])
ingrid = log[log['Athlete'] == 'Ingrid']

fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(ingrid['Date'], ingrid['RPE'], 'o-', color='steelblue', markersize=6, linewidth=1.5, label='RPE')
ax.tick_params(axis='x', labelrotation=45)
ax.set_xlabel('Date')
ax.set_ylabel('RPE (0 to 10)')
ax.set_title('Session RPE, Ingrid')
ax.legend()
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-57",title:"Colours and Markers: Three Lifts",domain:"coaching",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"Martin's squat, deadlift, and bench press sets are filtered for you into `squat`, `deadlift`, and `bench`, with the dates converted. Plot `Added_Weight_kg` against `Date` for all three on `ax`:\n1. The squat with circle markers on a solid line and a named colour.\n2. The deadlift with square markers on a dashed line and a hex-code colour.\n3. The bench press with triangle markers on a dotted line and an RGB-tuple colour.\n4. Tilt the date labels with `ax.tick_params(axis='x', labelrotation=45)` so they do not overlap.\nGive each line a `label` and display the legend.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
df['Date'] = pd.to_datetime(df['Date'])
martin = df[df['Athlete'] == 'Martin']
squat = martin[martin['Exercise'] == 'Squat']
deadlift = martin[martin['Exercise'] == 'Deadlift']
bench = martin[martin['Exercise'] == 'Bench Press']

fig, ax = plt.subplots()`,testCode:`assert len(ax.lines) >= 3, f"Expected 3 lines, got {len(ax.lines)}"
_markers = sorted(l.get_marker() for l in ax.lines[:3])
assert _markers == ['^', 'o', 's'], f"Expected circle, square, and triangle markers, got {_markers}"
_styles = sorted(l.get_linestyle() for l in ax.lines[:3])
assert _styles == ['--', '-', ':'] or _styles == sorted(['-', '--', ':']), f"Expected solid, dashed, and dotted lines, got {_styles}"
import matplotlib.colors as _mc
_cols = set(_mc.to_hex(l.get_color()) for l in ax.lines[:3])
assert len(_cols) == 3, "The three lines should have three different colours"
assert ax.get_legend() is not None and len(ax.get_legend().texts) >= 3, "Label each line and call ax.legend()"
fig.canvas.draw()
assert abs(ax.get_xticklabels()[0].get_rotation()) > 0, "Tilt the date labels with ax.tick_params(axis='x', labelrotation=45)"
print("PASS")`,hints:['One `ax.plot()` per lift with a format string for marker and line style ("o-", "s--", "^:"), a `color=` in a different form each time (a name, a hex code such as "#c60c30", a tuple such as (0.2, 0.7, 0.3)), and a `label=`; then `ax.legend()`.',`ax.plot(squat["Date"], squat["Added_Weight_kg"], "o-", color="steelblue", label="Squat")
ax.plot(deadlift["Date"], deadlift["Added_Weight_kg"], "s--", color="#c60c30", label="Deadlift")
ax.plot(bench["Date"], bench["Added_Weight_kg"], "___", color=(0.2, 0.7, 0.3), label="Bench Press")
ax.tick_params(axis="x", labelrotation=___)
ax.legend()`]},{type:"md",md:"## Axis Limits and Ticks\n\nTwo things about each axis are worth controlling. The **limits** are where the axis starts and ends: on a time axis running from 0 to 180 seconds, 0 and 180 are the limits. The **ticks** are the small marks along the axis with a number written at each one; they are what lets a reader read a value off the plot. By default Matplotlib fits the limits to the data and picks the tick positions itself, and that automatic choice is often perfectly good. Sometimes you want to control it yourself: to make two figures share the same range, or to put the ticks where the reader expects them, such as every 30 seconds rather than every 25.\n\n![An axis from 0 to 180 seconds with a tick mark and a number every 30 seconds. The limits are marked as where the axis starts and ends, one tick mark and one tick label are pointed out, and below it the same axis with the ticks Matplotlib chooses on its own, every 25 seconds, for comparison.](/images/module5/axis-ticks.svg)\n\n`set_xlim` and `set_ylim` fix the limits. `set_xticks` and `set_yticks` take a list of positions and put a tick at each one, and nowhere else:\n\n```python\nax.set_xlim(0, 180)                              # the x-axis runs from 0 to 180\nax.set_ylim(100, 170)                            # the y-axis runs from 100 to 170\nax.set_xticks([0, 30, 60, 90, 120, 150, 180])   # a tick and a number every 30 seconds\n```\n\nFixing the limits matters when several figures must be comparable: two heart rate plots with the same y-range can be read against each other at a glance. Choosing the ticks matters when a particular spacing means something to the reader, such as whole minutes on a time axis or the zone boundaries on a heart rate axis. When neither applies, leave both to Matplotlib."},{type:"example",packages:["pandas","matplotlib"],dataFiles:["hr_trace.csv"],caption:"The heart rate trace with fixed limits and a tick every 30 seconds.",code:`import pandas as pd
import matplotlib.pyplot as plt

hr = pd.read_csv('data/hr_trace.csv')

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(hr['Time_s'], hr['HR_bpm'], color='#c60c30', linewidth=2)

ax.set_xlim(0, 180)
ax.set_ylim(100, 170)
ax.set_xticks([0, 30, 60, 90, 120, 150, 180])
ax.set_yticks([100, 120, 140, 160])

ax.set_xlabel('Time (s)')
ax.set_ylabel('Heart rate (bpm)')
ax.set_title('Heart Rate Trace')
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-58",title:"Axis Limits and Ticks",domain:"biomechanics",packages:["pandas","matplotlib"],dataFiles:["isok30.csv"],description:"The isokinetic torque recording is loaded as `iso` and already plotted. The recording starts about a second before the athlete pushes, so the first part of the plot is flat and wastes space. Zoom in on the extension itself: set the x-limits to (1, 4.5) and the y-limits to (-5, 120), so the curve fills the axes and the small negative values just before the push stay visible. Put x-ticks at every whole second from 1 to 4, and add the x-label 'Time (s)', the y-label 'Torque (Nm)', and the title 'Knee Extension Torque'.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

iso = pd.read_csv('data/isok30.csv')

fig, ax = plt.subplots()
ax.plot(iso['Time'], iso['Torque'], linewidth=2)`,testCode:`xlim = ax.get_xlim()
ylim = ax.get_ylim()
assert abs(xlim[0] - 1.0) < 0.01 and abs(xlim[1] - 4.5) < 0.01, f"xlim should be (1, 4.5), got {xlim}"
assert abs(ylim[0] + 5.0) < 0.01 and abs(ylim[1] - 120.0) < 0.01, f"ylim should be (-5, 120), got {ylim}"
assert [round(t) for t in ax.get_xticks()] == [1, 2, 3, 4], f"x-ticks should be 1, 2, 3, 4, got {list(ax.get_xticks())}"
assert ax.get_xlabel() == 'Time (s)', f"xlabel wrong: {ax.get_xlabel()}"
assert ax.get_ylabel() == 'Torque (Nm)', f"ylabel wrong: {ax.get_ylabel()}"
assert ax.get_title() == 'Knee Extension Torque', f"title wrong: {ax.get_title()}"
print("PASS")`,hints:["`set_xlim` and `set_ylim` fix the visible ranges; `set_xticks` takes a list of positions; the labels and title use the other set_* methods.",`ax.set_xlim(1, 4.5)
ax.set_ylim(-5, ___)
ax.set_xticks([1, 2, 3, 4])
ax.set_xlabel("Time (s)")
ax.set_ylabel("Torque (Nm)")
ax.set_title("Knee Extension Torque")`]},{type:"md",md:"## Annotations\n\nAn **annotation** is a piece of text placed at a point on the plot. At its simplest, `ax.annotate()` needs only the text and the point, given as `xy=(x, y)` in data coordinates:\n\n```python\nax.annotate('Peak', xy=(peak_t, peak_torque))\n```\n\nThe text appears with its lower-left corner at that point. Finding the point is pandas work: `.idxmax()` on a column gives the row label of its largest value, and `.loc[row, column]` reads the values at that row."},{type:"example",packages:["pandas","matplotlib"],dataFiles:["isok30.csv"],caption:"The simplest annotation: a label placed at the peak of the torque curve.",code:`import pandas as pd
import matplotlib.pyplot as plt

iso = pd.read_csv('data/isok30.csv')

peak_idx = iso['Torque'].idxmax()
peak_t = iso.loc[peak_idx, 'Time']
peak_torque = iso.loc[peak_idx, 'Torque']

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(iso['Time'], iso['Torque'], linewidth=2)
ax.annotate(f'Peak: {peak_torque:.0f} Nm', xy=(peak_t, peak_torque))

ax.set_xlabel('Time (s)')
ax.set_ylabel('Torque (Nm)')
ax.set_title('Knee Extension Torque')
ax.set_ylim(-5, 130)
ax.grid(True, alpha=0.3)`},{type:"md",md:"That works, but the label sits on top of the curve. Three optional arguments give you control over where the text goes and how it points back to the data:\n\n- `xytext=(x, y)` moves the text to another position, again in data coordinates. The point in `xy` stays the point being annotated.\n- `arrowprops=dict(arrowstyle='->')` draws an arrow from the text to the point. Add `color='red'` inside the `dict` to colour the arrow.\n- `color` and `fontsize` style the text itself, as on any label.\n\n```python\nax.annotate(\n    'Peak: 105 Nm',\n    xy=(peak_t, peak_torque),                 # the point the arrow points TO\n    xytext=(peak_t + 0.6, peak_torque + 8),   # where the text sits\n    arrowprops=dict(arrowstyle='->', color='red'),\n    color='red', fontsize=12\n)\n```\n\nTry it in the exercise: place the plain label first, run it, then add the arguments one at a time and watch what each one changes."},{type:"exercise",id:"ex-5-59",title:"Annotate the Peak Heart Rate",domain:"physiology",packages:["pandas","matplotlib"],dataFiles:["hr_trace.csv"],description:"The heart rate trace is loaded as `hr` and plotted.\n1. Store the row label of the highest `HR_bpm` in `peak_idx` using `.idxmax()`.\n2. Store the time and heart rate at that row in `peak_t` and `peak_hr` using `.loc`.\n3. Add an annotation with an arrow pointing at the peak. The text should include the peak value; any wording is fine.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

hr = pd.read_csv('data/hr_trace.csv')

fig, ax = plt.subplots()
ax.plot(hr['Time_s'], hr['HR_bpm'], linewidth=2)`,testCode:`assert int(peak_idx) == int(hr['HR_bpm'].idxmax()), "peak_idx should be the row label of the highest HR_bpm"
assert float(peak_hr) == 165.0 and float(peak_t) == 103.0, f"peak should be 165 bpm at 103 s, got {peak_hr} at {peak_t}"
assert len(ax.texts) >= 1, "No annotation found on the axes"
_ann = ax.texts[0]
assert abs(_ann.xy[0] - 103.0) < 0.01 and abs(_ann.xy[1] - 165.0) < 0.01, "The arrow should point at the peak"
assert '165' in _ann.get_text(), "The annotation text should include the peak value 165"
print("PASS")`,hints:['`hr["HR_bpm"].idxmax()` gives the row; `hr.loc[row, "Time_s"]` and `hr.loc[row, "HR_bpm"]` read the two values. Then `ax.annotate(text, xy=the_point, xytext=where_the_text_sits, arrowprops=dict(arrowstyle="->"))`.',`peak_idx = hr["HR_bpm"].idxmax()
peak_t = hr.loc[peak_idx, "Time_s"]
peak_hr = hr.loc[peak_idx, "___"]

ax.annotate(f"Peak: {peak_hr:.0f} bpm",
    xy=(peak_t, peak_hr),
    xytext=(peak_t + 15, peak_hr - 20),
    arrowprops=dict(arrowstyle="->", color="red"))`]},{type:"md",md:"## Horizontal and Vertical Reference Lines\n\n`ax.axhline(y=...)` draws a horizontal line across the full width of the axes, and `ax.axvline(x=...)` a vertical one across the full height. `ax.axhspan(y1, y2)` fills a horizontal band. They mark thresholds, targets, and zones:\n\n```python\nax.axhline(y=150, color='orange', linestyle='--', alpha=0.7, label='Threshold')\nax.axhspan(150, 165, alpha=0.1, color='orange', label='Hard zone')\n```"},{type:"exercise",id:"ex-5-60",title:"Target Line and Working Range",domain:"coaching",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"Martin's deadlift sets are filtered into `martin` and plotted. His target for the block is 170 kg.\n1. Add a dashed horizontal line at 170 with `ax.axhline()`, labelled 'Target'.\n2. Shade the working range from 160 to 180 with `ax.axhspan()` and a low alpha.\n3. Set the y-limits to (140, 190) and add a title and axis labels of your choice.\n4. Display the legend.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
df['Date'] = pd.to_datetime(df['Date'])
deadlifts = df[df['Exercise'] == 'Deadlift']
martin = deadlifts[deadlifts['Athlete'] == 'Martin']

fig, ax = plt.subplots()
ax.plot(martin['Date'], martin['Added_Weight_kg'], 'o-', label='Deadlift')
ax.tick_params(axis='x', labelrotation=45)`,testCode:`assert len(ax.lines) >= 2, "Add the horizontal target line with ax.axhline()"
_h = [l for l in ax.lines[1:] if abs(l.get_ydata()[0] - 170) < 0.01]
assert _h, "The horizontal line should sit at y = 170"
assert len(ax.patches) >= 1, "Shade the working range with ax.axhspan()"
ylim = ax.get_ylim()
assert abs(ylim[0] - 140.0) < 0.1 and abs(ylim[1] - 190.0) < 0.1, f"ylim wrong: {ylim}"
assert ax.get_title() != "" and ax.get_xlabel() != "" and ax.get_ylabel() != "", "Add a title and both axis labels"
assert ax.get_legend() is not None, "Display the legend"
print("PASS")`,hints:['`ax.axhline(y=170, linestyle="--", label="Target")` draws the line; `ax.axhspan(160, 180, alpha=0.15)` shades the band; then `set_ylim`, the labels, and `ax.legend()`.',`ax.axhline(y=___, color="red", linestyle="--", label="Target")
ax.axhspan(160, ___, alpha=0.15, color="red")
ax.set_ylim(140, 190)
ax.set_xlabel("Date")
ax.set_ylabel("Added weight (kg)")
ax.set_title("Deadlift Progression, Martin")
ax.legend()`]},{type:"md",md:"## Legend Placement and Saving\n\n`ax.legend()` picks a corner on its own. Take control with `loc` when the automatic choice covers data, and soften the box with `framealpha`:\n\n```python\nax.legend(loc='upper left', framealpha=0.9, fontsize=11)\n# Common loc values: 'upper left', 'upper right', 'lower left', 'lower right', 'best'\n```\n\nWhen the figure is finished, save it to a file. A PNG at 300 dots per inch is right for a report or a slide; a PDF is a vector file that scales without blurring, which journals might prefer:\n\n```python\nfig.savefig('figure.png', dpi=300, bbox_inches='tight')\nfig.savefig('figure.pdf', bbox_inches='tight')\n```\n\n`bbox_inches='tight'` trims the white margins around the plot."},{type:"exercise",id:"ex-5-61",title:"Legend Placement",domain:"coaching",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"Three bench press progressions (Ingrid, Sofie, Emma) are already plotted with labels. Display the legend in the lower right with `framealpha` 0.9, and set the x-label 'Date', the y-label 'Added weight (kg)', and the title 'Bench Press Progression'.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
df['Date'] = pd.to_datetime(df['Date'])
bench = df[df['Exercise'] == 'Bench Press']
ingrid = bench[bench['Athlete'] == 'Ingrid']
sofie = bench[bench['Athlete'] == 'Sofie']
emma = bench[bench['Athlete'] == 'Emma']

fig, ax = plt.subplots()
ax.plot(ingrid['Date'], ingrid['Added_Weight_kg'], 'o-', label='Ingrid')
ax.plot(sofie['Date'], sofie['Added_Weight_kg'], 's-', label='Sofie')
ax.plot(emma['Date'], emma['Added_Weight_kg'], '^-', label='Emma')
ax.tick_params(axis='x', labelrotation=45)`,testCode:`_leg = ax.get_legend()
assert _leg is not None, "No legend found"
assert len(_leg.texts) >= 3, "Legend should have at least 3 entries"
assert _leg._loc == 4, "The legend should be in the lower right (loc='lower right')"
assert abs(_leg.get_frame().get_alpha() - 0.9) < 0.01, "framealpha should be 0.9"
assert ax.get_xlabel() == 'Date', f"xlabel wrong: {ax.get_xlabel()}"
assert ax.get_ylabel() == 'Added weight (kg)', f"ylabel wrong: {ax.get_ylabel()}"
assert ax.get_title() == 'Bench Press Progression', f"title wrong: {ax.get_title()}"
print("PASS")`,hints:["`ax.legend(loc=..., framealpha=...)` places the legend; the labels and title use the set_* methods.",`ax.legend(loc="___", framealpha=0.9)
ax.set_xlabel("Date")
ax.set_ylabel("Added weight (kg)")
ax.set_title("Bench Press Progression")`]},{type:"md",md:"## Summary\n\n| Customisation | Code |\n|--------------|------|\n| Figure size | `plt.subplots(figsize=(w, h))` |\n| Line colour | `color='steelblue'`, `color='#c60c30'`, or an RGB tuple |\n| Line style | `linestyle='--'` / `'-'` / `':'` / `'-.'` |\n| Line width | `linewidth=2` |\n| Markers | `marker='o'`, `'s'`, `'^'`, `'D'`, or a format string such as `'o-'` |\n| Axis limits | `ax.set_xlim(min, max)` / `ax.set_ylim()` |\n| Custom ticks | `ax.set_xticks([0, 30, 60, ...])` |\n| Tilted date labels | `ax.tick_params(axis='x', labelrotation=45)` |\n| Annotation | `ax.annotate(text, xy=..., xytext=..., arrowprops=...)` |\n| Finding the point | `col.idxmax()` then `df.loc[row, 'column']` |\n| Reference lines | `ax.axhline(y=...)`, `ax.axvline(x=...)` |\n| Shaded band | `ax.axhspan(y1, y2, alpha=0.1)` |\n| Font size | `fontsize=14` on set_xlabel, set_title, and so on |\n| Legend | `ax.legend(loc='upper right', framealpha=0.9)` |\n| Save | `fig.savefig('file.png', dpi=300, bbox_inches='tight')` |\n\nIn the next lesson, we combine several panels into one figure: dashboards, shared axes, error bars, and twin axes."}],quiz:null},"viz-subplots-advanced":{blocks:[{type:"md",md:`# Multiple Subplots and Advanced Features

## Why Subplots?

In sport science reporting, you often need to show related data side by side:

- Torque and joint angle from the same isokinetic test
- Heart rate and speed from the same training session
- Several exercises for the same athlete on one dashboard
- Pre-test and post-test comparisons

\`plt.subplots(rows, cols)\` creates a grid of axes, one panel per cell, inside a single figure. As before, every figure in this lesson is drawn from an imported DataFrame.

## Creating a Basic Subplot Grid

With more than one panel, \`plt.subplots()\` returns the figure and an **array** of axes instead of a single one. Index it to reach each panel:

\`\`\`python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))   # 1 row, 2 columns

axes[0].plot(iso['Time'], iso['Torque'])          # left panel
axes[0].set_title('Torque')

axes[1].plot(iso['Time'], iso['Angle'])           # right panel
axes[1].set_title('Angle')

plt.tight_layout()
\`\`\`

\`plt.tight_layout()\` adjusts the spacing so labels and titles of neighbouring panels do not overlap. End every multi-panel figure with it.`},{type:"example",packages:["pandas","matplotlib"],dataFiles:["isok30.csv"],caption:"Side by side from one isokinetic test: torque on the left, knee angle on the right.",code:`import pandas as pd
import matplotlib.pyplot as plt

iso = pd.read_csv('data/isok30.csv')

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

axes[0].plot(iso['Time'], iso['Torque'], color='steelblue', linewidth=2)
axes[0].set_xlabel('Time (s)')
axes[0].set_ylabel('Torque (Nm)')
axes[0].set_title('Knee Extension Torque')
axes[0].grid(True, alpha=0.3)

axes[1].plot(iso['Time'], iso['Angle'], color='#c60c30', linewidth=2)
axes[1].set_xlabel('Time (s)')
axes[1].set_ylabel('Knee angle (degrees)')
axes[1].set_title('Knee Angle')
axes[1].grid(True, alpha=0.3)

plt.suptitle('Isokinetic Knee Extension', fontsize=14, fontweight='bold')
plt.tight_layout()`},{type:"md",md:`**Sharing an axis.** Torque and angle come from the same recording, so the two panels above have the same time axis. Side by side, the reader's eye has to jump between two separate axes to compare a moment in one panel with the same moment in the other. Stacking the panels and passing \`sharex=True\` links them: they line up exactly in time, zooming one zooms the other, and only the bottom panel needs the x-label and its tick labels. With two panels it is convenient to unpack the axes array straight into two names:

\`\`\`python
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6), sharex=True)

ax1.plot(iso['Time'], iso['Torque'])
ax2.plot(iso['Time'], iso['Angle'])
ax2.set_xlabel('Time (s)')   # only the bottom panel
\`\`\`

Whenever two panels share a variable along one axis, share that axis.`},{type:"example",packages:["pandas","matplotlib"],dataFiles:["isok30.csv"],caption:"Torque above, knee angle below, on one shared time axis.",code:`import pandas as pd
import matplotlib.pyplot as plt

iso = pd.read_csv('data/isok30.csv')

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6), sharex=True)

ax1.plot(iso['Time'], iso['Torque'], color='steelblue', linewidth=1.5)
ax1.set_ylabel('Torque (Nm)')
ax1.set_title('Torque')
ax1.grid(True, alpha=0.3)

ax2.plot(iso['Time'], iso['Angle'], color='#c60c30', linewidth=1.5)
ax2.set_ylabel('Knee angle (degrees)')
ax2.set_xlabel('Time (s)')
ax2.set_title('Knee Angle')
ax2.grid(True, alpha=0.3)

plt.suptitle('Isokinetic Knee Extension', fontsize=14, fontweight='bold')
plt.tight_layout()`},{type:"exercise",id:"ex-5-64",title:"Shared X-Axis: Load and RPE",domain:"physiology",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"Martin's squat sets are filtered into `martin`, and two stacked panels with a shared x-axis are created as `ax1` and `ax2`. Plot `Added_Weight_kg` against `Date` on `ax1` and `RPE` against `Date` on `ax2`, both with circle markers. Label each y-axis, and put the x-label 'Date' on the bottom panel only.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
df['Date'] = pd.to_datetime(df['Date'])
squats = df[df['Exercise'] == 'Squat']
martin = squats[squats['Athlete'] == 'Martin']

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6), sharex=True)
ax2.tick_params(axis='x', labelrotation=45)   # the shared date axis is drawn on the bottom panel`,testCode:`assert len(fig.axes) == 2, f"Expected 2 axes, got {len(fig.axes)}"
assert len(ax1.lines) >= 1 and len(ax2.lines) >= 1, "Plot one series on each panel"
assert ax1.lines[0].get_marker() == 'o' and ax2.lines[0].get_marker() == 'o', "Use circle markers on both lines"
assert ax1.get_ylabel() != "" and ax2.get_ylabel() != "", "Label both y-axes"
assert ax2.get_xlabel() == 'Date', f"The bottom x-label should be 'Date', got '{ax2.get_xlabel()}'"
assert ax1.get_xlabel() == "", "Only the bottom panel should carry the x-label"
print("PASS")`,hints:['`ax1` and `ax2` are separate panels sharing the x-axis; plot one column on each with the format string "o-", label the y-axes, and set the x-label on `ax2` only.',`ax1.plot(martin["Date"], martin["Added_Weight_kg"], "o-")
ax1.set_ylabel("Added weight (kg)")
ax2.plot(martin["Date"], martin["___"], "o-")
ax2.set_ylabel("RPE")
ax2.set_xlabel("___")`]},{type:"md",md:`## Twin Axes

Sharing an axis is one way to show torque and angle together. The other is to put both on **one** set of axes. They have different units, newton metres and degrees, so they cannot share a y-axis, but \`ax1.twinx()\` creates a second axes that shares the x-axis and draws its own y-axis on the right:

\`\`\`python
fig, ax1 = plt.subplots(figsize=(9, 5))
ax1.plot(iso['Time'], iso['Torque'], color='steelblue')
ax1.set_ylabel('Torque (Nm)', color='steelblue')

ax2 = ax1.twinx()                          # shares x, own y on the right
ax2.plot(iso['Time'], iso['Angle'], color='#c60c30')
ax2.set_ylabel('Knee angle (degrees)', color='#c60c30')
\`\`\`

Colour-match each y-axis label to its series, so the reader knows which scale belongs to which. Twin axes put the two curves on top of each other, which makes their timing easy to compare; stacked panels keep each curve clean. Choose by what the reader needs to see.`},{type:"example",packages:["pandas","matplotlib"],dataFiles:["isok30.csv"],caption:"The same recording on twin axes: torque on the left y-axis, knee angle on the right.",code:`import pandas as pd
import matplotlib.pyplot as plt

iso = pd.read_csv('data/isok30.csv')

fig, ax1 = plt.subplots(figsize=(9, 5))
ax1.plot(iso['Time'], iso['Torque'], color='steelblue', linewidth=1.5, label='Torque')
ax1.set_xlabel('Time (s)')
ax1.set_ylabel('Torque (Nm)', color='steelblue')
ax1.tick_params(axis='y', labelcolor='steelblue')

ax2 = ax1.twinx()
ax2.plot(iso['Time'], iso['Angle'], color='#c60c30', linewidth=1.5, label='Knee angle')
ax2.set_ylabel('Knee angle (degrees)', color='#c60c30')
ax2.tick_params(axis='y', labelcolor='#c60c30')

ax1.set_title('Isokinetic Knee Extension: Torque and Angle')
ax1.legend(loc='upper left')
ax2.legend(loc='upper right')
ax1.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-68",title:"Twin Axes: Volume and RPE",domain:"coaching",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"From the strength log, the total weekly volume load is prepared as `weekly_volume` and the mean weekly RPE as `weekly_rpe`, both Series indexed by week.\n1. Draw `weekly_volume` as bars on `ax1` and label its y-axis.\n2. Create a second y-axis with `ax1.twinx()`, store it in `ax2`, and draw `weekly_rpe` on it as a red line with circle markers.\n3. Label the right y-axis and set its limits to (0, 10).",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
df['Volume_kg'] = df['Sets'] * df['Reps'] * df['Added_Weight_kg']
df['Week'] = pd.to_datetime(df['Date']).dt.isocalendar().week.astype(int)
weekly_volume = df.groupby('Week')['Volume_kg'].sum()
weekly_rpe = df.groupby('Week')['RPE'].mean()

fig, ax1 = plt.subplots(figsize=(9, 5))`,testCode:`assert len(fig.axes) == 2, f"Expected 2 axes (primary + twin), got {len(fig.axes)}"
assert len(ax1.patches) == 8, f"Expected 8 volume bars on ax1, got {len(ax1.patches)}"
assert len(ax2.lines) >= 1, "No RPE line on the twin axis"
assert ax2.lines[0].get_marker() == 'o', "Use circle markers on the RPE line"
assert ax1.get_ylabel() != "" and ax2.get_ylabel() != "", "Label both y-axes"
_yl = ax2.get_ylim()
assert abs(_yl[0]) < 0.01 and abs(_yl[1] - 10) < 0.01, f"The RPE axis should run 0 to 10, got {_yl}"
print("PASS")`,hints:['`ax1.bar()` draws the volume; `ax1.twinx()` creates the right-hand axis that shares x but has its own y scale; plot the RPE there with the format string "ro-".',`ax1.bar(weekly_volume.index, weekly_volume.values, color="steelblue", alpha=0.7)
ax1.set_ylabel("Weekly volume (kg)", color="steelblue")
ax2 = ax1.___()
ax2.plot(weekly_rpe.index, weekly_rpe.values, "ro-")
ax2.set_ylabel("Mean RPE", color="red")
ax2.set_ylim(0, ___)`]},{type:"md",md:`## A 2 by 2 Dashboard

For a 2 by 2 grid, \`axes\` becomes a two-dimensional array indexed by \`[row, col]\`:

\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(...)   # top left
axes[0, 1].plot(...)   # top right
axes[1, 0].plot(...)   # bottom left
axes[1, 1].bar(...)    # bottom right

plt.suptitle('Dashboard', fontsize=14)
plt.tight_layout()
\`\`\`

\`plt.suptitle()\` writes one title above the whole figure, separate from the four panel titles.`},{type:"example",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],caption:"One athlete, four panels: three lifts as lines over the block, pull-up reps as bars.",code:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
df['Date'] = pd.to_datetime(df['Date'])
martin = df[df['Athlete'] == 'Martin']
squat = martin[martin['Exercise'] == 'Squat']
bench = martin[martin['Exercise'] == 'Bench Press']
deadlift = martin[martin['Exercise'] == 'Deadlift']
pullup = martin[martin['Exercise'] == 'Pull-Up']

fig, axes = plt.subplots(2, 2, figsize=(11, 8))

axes[0, 0].plot(squat['Date'], squat['Added_Weight_kg'], 'o-', color='steelblue')
axes[0, 0].set_title('Squat')
axes[0, 0].set_ylabel('Added weight (kg)')

axes[0, 1].plot(bench['Date'], bench['Added_Weight_kg'], 'o-', color='#c60c30')
axes[0, 1].set_title('Bench Press')

axes[1, 0].plot(deadlift['Date'], deadlift['Added_Weight_kg'], 'o-', color='green')
axes[1, 0].set_title('Deadlift')
axes[1, 0].set_ylabel('Added weight (kg)')

axes[1, 1].bar(pullup['Date'], pullup['Reps'], width=2, color='gray')
axes[1, 1].set_title('Pull-Up reps per set')
axes[1, 1].set_ylabel('Reps')

for ax in axes.flat:
    ax.tick_params(axis='x', labelrotation=45)
    ax.grid(True, alpha=0.3)

plt.suptitle('Martin: eight-week block', fontsize=14, fontweight='bold')
plt.tight_layout()`},{type:"md",md:"One new thing in that example: `axes.flat` walks through the four panels one by one, so the loop rotates the date labels and adds a grid to each without repeating four lines. Anything you would do to one panel can go inside that loop."},{type:"md",md:"## Error Bars\n\nA bar of group means says nothing about how spread out the group is. Error bars add that: pass `yerr` to `ax.bar()` with one value per bar, usually the standard deviation, and `capsize` for the little horizontal caps at the ends:\n\n```python\nmeans = log.groupby('Session_Type')['Duration_min'].mean()\nsds = log.groupby('Session_Type')['Duration_min'].std()\nax.bar(means.index, means.values, yerr=sds.values, capsize=5)\n```\n\nTwo groupby lines, one ending in `.mean()` and one in `.std()`, give both Series in the same order, so they line up bar by bar."},{type:"example",packages:["pandas","matplotlib"],dataFiles:["training_log.csv"],caption:"Mean session duration per session type, with one standard deviation as error bars.",code:`import pandas as pd
import matplotlib.pyplot as plt

log = pd.read_csv('data/training_log.csv')

means = log.groupby('Session_Type')['Duration_min'].mean()
sds = log.groupby('Session_Type')['Duration_min'].std()

fig, ax = plt.subplots(figsize=(8, 5))
ax.bar(means.index, means.values, yerr=sds.values, capsize=5,
       color=['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b'], edgecolor='black', linewidth=0.5)
ax.set_ylabel('Duration (min)')
ax.set_title('Session Duration by Type (mean and SD)')
ax.grid(axis='y', alpha=0.3)`},{type:"exercise",id:"ex-5-65",title:"Error Bars: Added Weight per Exercise",domain:"coaching",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"The loaded sets of the strength log, with the pull-ups and the 1200 kg typo removed, are in `loaded`.\n1. Group by `Exercise` and store the mean `Added_Weight_kg` in `means` and the standard deviation in `sds`.\n2. Draw a bar chart of the means on `ax` with the standard deviations as error bars, using `yerr` and `capsize=5`.\n3. Add the y-label 'Added weight (kg)'.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
loaded = df[(df['Exercise'] != 'Pull-Up') & (df['Added_Weight_kg'] < 1000)]

fig, ax = plt.subplots(figsize=(8, 5))`,testCode:`assert len(ax.patches) == 3, f"Expected 3 bars, got {len(ax.patches)}"
_ref_sd = loaded.groupby('Exercise')['Added_Weight_kg'].std()
assert abs(float(sds['Squat']) - float(_ref_sd['Squat'])) < 1e-6, "sds should be the standard deviation per exercise"
assert len(ax.collections) >= 1, "Pass yerr= to ax.bar() to draw the error bars"
assert ax.get_ylabel() == 'Added weight (kg)', f"ylabel wrong: {ax.get_ylabel()}"
print("PASS")`,hints:["Two groupby lines, one ending in `.mean()` and one in `.std()`; then `ax.bar(means.index, means.values, yerr=sds.values, capsize=5)`.",`means = loaded.groupby("Exercise")["Added_Weight_kg"].mean()
sds = loaded.groupby("Exercise")["Added_Weight_kg"].___()
ax.bar(means.index, means.values, yerr=___, capsize=5)
ax.set_ylabel("Added weight (kg)")`]},{type:"md",md:`## Fill Between (SD Bands)

For a value that changes over time, such as a weekly load, the same idea becomes a **band**: a mean line with a shaded region one standard deviation above and below it. \`ax.fill_between()\` shades the area between two curves:

\`\`\`python
ax.plot(weeks, mean_load, 'o-', label='Mean')
ax.fill_between(weeks, mean_load - sd_load, mean_load + sd_load,
                alpha=0.2, label='1 SD')
\`\`\`

Getting the mean and SD per week across athletes takes two groupby steps: first the total per week *and* athlete, then the mean and SD of those totals per week.`},{type:"example",packages:["pandas","matplotlib"],dataFiles:["training_log.csv"],caption:"Weekly session-RPE load across the six athletes: the mean line with a one-SD band.",code:`import pandas as pd
import matplotlib.pyplot as plt

log = pd.read_csv('data/training_log.csv')
log['sRPE'] = log['Duration_min'] * log['RPE']
log['Week'] = pd.to_datetime(log['Date']).dt.isocalendar().week.astype(int)

# Total load per week for each athlete, then mean and SD across athletes per week
per_athlete = log.groupby(['Week', 'Athlete'])['sRPE'].sum()
mean_load = per_athlete.groupby('Week').mean()
sd_load = per_athlete.groupby('Week').std()

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(mean_load.index, mean_load.values, 'o-', color='steelblue', linewidth=2, label='Mean')
ax.fill_between(mean_load.index, mean_load.values - sd_load.values, mean_load.values + sd_load.values,
                alpha=0.2, color='steelblue', label='1 SD')
ax.set_xlabel('Week')
ax.set_ylabel('Weekly sRPE load (AU)')
ax.set_title('Weekly Training Load')
ax.legend()
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-66",title:"Fill Between: Weekly Volume Band",domain:"physiology",packages:["pandas","matplotlib"],dataFiles:["strength_log.csv"],description:"From the strength log, the mean and standard deviation of the weekly volume load across the six athletes are prepared as two Series, `mean_vol` and `sd_vol`, indexed by week. Plot the mean as a line with circle markers, then shade a band one SD above and below it with `ax.fill_between()` and a low alpha. Label both series and display the legend.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/strength_log.csv')
df['Volume_kg'] = df['Sets'] * df['Reps'] * df['Added_Weight_kg']
df['Week'] = pd.to_datetime(df['Date']).dt.isocalendar().week.astype(int)
per_athlete = df.groupby(['Week', 'Athlete'])['Volume_kg'].sum()
mean_vol = per_athlete.groupby('Week').mean()
sd_vol = per_athlete.groupby('Week').std()

fig, ax = plt.subplots(figsize=(8, 5))`,testCode:`assert len(ax.lines) >= 1, "No mean line plotted"
assert ax.lines[0].get_marker() == 'o', "Use circle markers on the mean line"
assert len(ax.collections) >= 1, "No fill_between band found"
_alpha = ax.collections[0].get_alpha()
assert _alpha is not None and _alpha <= 0.5, "Give the band a low alpha so the line stays visible"
assert ax.get_legend() is not None and len(ax.get_legend().texts) >= 2, "Label the line and the band, then call ax.legend()"
print("PASS")`,hints:["Plot `mean_vol.index` against `mean_vol.values` first, then fill between the mean minus SD and the mean plus SD, using `.values` on both Series.",`ax.plot(mean_vol.index, mean_vol.values, "o-", label="Mean")
ax.fill_between(mean_vol.index, mean_vol.values - sd_vol.values, mean_vol.values + ___,
                alpha=0.2, label="1 SD")
ax.set_xlabel("Week")
ax.set_ylabel("Weekly volume (kg)")
ax.legend()`]},{type:"md",md:"## Summary\n\n| Task | Code |\n|------|------|\n| Create a 1 by 2 grid | `fig, axes = plt.subplots(1, 2, figsize=(12, 5))` |\n| Create a 2 by 2 grid | `fig, axes = plt.subplots(2, 2, figsize=(10, 8))` |\n| Access a panel (2D) | `axes[row, col]` |\n| Access a panel (1D) | `axes[i]` |\n| Every panel in turn | `for ax in axes.flat:` |\n| Share the x-axis | `plt.subplots(2, 1, sharex=True)` |\n| Overall title | `plt.suptitle('Title')` |\n| Error bars | `ax.bar(x, y, yerr=err, capsize=5)` |\n| SD band | `ax.fill_between(x, y - err, y + err, alpha=0.2)` |\n| Twin y-axis | `ax2 = ax1.twinx()` |\n| Prevent overlap | `plt.tight_layout()` |\n\nOne shortcut you will meet in other people's code: pandas can draw a quick plot straight from a column, `df['RPE'].plot()`, or a DataFrame, `df.plot(x='Date', y='Added_Weight_kg')`. It uses Matplotlib underneath, so everything in these three lessons still applies to the result, and for anything beyond a quick look you are better served by the axes methods you now know.\n\nThat completes Module 5. In the next module, we move from describing data to testing hypotheses: statistics for sport science."}],quiz:null}};export{e as lessons};
