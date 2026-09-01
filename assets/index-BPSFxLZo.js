const e={"cleaning-missing-data":{blocks:[{type:"md",md:`# Handling Missing Data in Pandas

## Introduction

Real-world sport science data is rarely perfect. GPS signals drop out in indoor facilities, heart rate monitors lose contact with skin, an athlete misses a testing session, or a column simply does not apply — a strength session has no running distance. **Missing data** appears in pandas DataFrames as \`NaN\` (Not a Number), and learning to detect and handle it correctly is essential for reliable analyses.

The training log you will work with throughout this lesson contains 236 session records for six athletes. Two columns have missing values: \`Distance_km\` is missing for every Strength session (71 rows — those sessions have no GPS), and \`Avg_HR\` is missing for 6 rows where the heart rate monitor lost contact.

> **Key idea:** Missing data is not random noise to be swept under the rug — it usually has a cause. Always understand the cause before choosing a strategy.`},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"Detecting missing values: isnull().sum() gives a column-by-column count.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

print("Shape:", df.shape)
print("\\nMissing values per column:")
print(df.isnull().sum())

# Percentage missing per column
pct = (df.isnull().sum() / len(df) * 100).round(1)
print("\\nPercentage missing:")
print(pct)

print(f"\\nTotal missing cells: {df.isnull().sum().sum()}")`},{type:"exercise",id:"ex-5-20",title:"Audit the Training Log for Missing Data",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:'Load `data/training_log.csv` (done for you). Store the count of missing values in `Distance_km` as `n_missing_dist` (integer) and the count in `Avg_HR` as `n_missing_hr` (integer). Print both as "Missing Distance_km: N" and "Missing Avg_HR: N".',initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert n_missing_dist == 71, f"Expected 71 missing Distance_km, got {n_missing_dist}"
assert n_missing_hr == 6, f"Expected 6 missing Avg_HR, got {n_missing_hr}"
print("PASS")`,hints:["df.isnull().sum() gives a Series of missing counts per column -- index it with the column name and wrap in int().",`missing = df.isnull().sum()
n_missing_dist = int(missing["Distance_km"])
n_missing_hr = int(missing["___"])

print(f"Missing Distance_km: {n_missing_dist}")
print(f"Missing Avg_HR: {n_missing_hr}")`]},{type:"md",md:"## Why Is the Distance Missing?\n\nBefore deciding how to handle missing data, ask *why* it is missing. In this log, `Distance_km` is `NaN` for **every** Strength session — athletes do not run during weight training, so there is nothing to record. This is called **Missing Not At Random (MNAR)**: the missingness is directly linked to the value of another variable (`Session_Type`). Dropping those rows would discard all strength data, which would be wrong.\n\nContrast this with the six missing `Avg_HR` values, which are much closer to random — the monitor simply lost contact, unrelated to the value it would have recorded. A simple audit confirms the pattern:\n\n```python\n# Are Strength sessions the only ones missing Distance_km?\nmissing_by_type = df.groupby('Session_Type')['Distance_km'].apply(lambda x: x.isna().sum())\nprint(missing_by_type)\n```\n\nUnderstanding the cause tells you the right strategy: for `Distance_km`, the missing values are **structurally correct** (there is nothing to fill). For `Avg_HR`, you might fill forward from the previous session of the same athlete or simply note the gap."},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"Pattern audit: which session types account for the missing Distance_km?",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# Missing Distance_km by session type
missing_by_type = df.groupby('Session_Type')['Distance_km'].apply(lambda x: x.isna().sum())
print("Missing Distance_km by Session_Type:")
print(missing_by_type)

# Confirm: Strength sessions have no distance at all
strength = df[df['Session_Type'] == 'Strength']
print(f"\\nAll Strength Distance_km NaN: {strength['Distance_km'].isna().all()}")`},{type:"exercise",id:"ex-5-21",title:"Identify Which Sessions Have Distance Data",domain:"physiology",packages:["pandas"],dataFiles:["training_log.csv"],description:"Create `df_cardio` by keeping only rows where `Distance_km` is NOT missing (use `.dropna(subset=[...])`). Store the number of rows in `n_cardio`, then print it; any clear format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert n_cardio == 165, f"Expected 165 sessions with distance data, got {n_cardio}"
print("PASS")`,hints:['dropna(subset=["column"]) keeps only rows where that specific column is not NaN. 236 total - 71 Strength = 165.',`df_cardio = df.dropna(subset=["___"])

n_cardio = len(df_cardio)
print(f"Sessions with distance data: {n_cardio}")`]},{type:"md",md:`## Strategy 1: Drop Rows or Columns

\`dropna()\` removes rows (or columns) that contain missing values. Use it when missing data is truly absent and cannot be recovered:

\`\`\`python
# Drop rows where ANY column is NaN
df_complete = df.dropna()

# Drop rows where SPECIFIC columns are NaN
df_with_dist = df.dropna(subset=['Distance_km'])

# Drop a whole column if it is mostly missing
df_no_dist = df.drop(columns=['Distance_km'])
\`\`\`

**When to use:** The missing pattern is genuinely random, you have enough data left, and the missing rows are not systematically different from the others. Never drop rows just because they are inconvenient — that is a form of selective reporting.`},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"dropna() with subset vs. without — the difference matters.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# Dropping ANY missing: removes both missing Distance_km and missing Avg_HR rows
df_any = df.dropna()
print(f"After dropna() any: {len(df_any)} rows  (lost {len(df) - len(df_any)})")

# Dropping only where Avg_HR is missing
df_hr = df.dropna(subset=['Avg_HR'])
print(f"After dropna(Avg_HR): {len(df_hr)} rows  (lost {len(df) - len(df_hr)})")

# Keeping only rows where Distance_km is present
df_cardio = df.dropna(subset=['Distance_km'])
print(f"Cardio sessions only: {len(df_cardio)} rows")`},{type:"exercise",id:"ex-5-22",title:"Complete Cases Only",domain:"teaching",packages:["pandas"],dataFiles:["training_log.csv"],description:'Create `df_complete` using `dropna()` with no arguments (drops rows with ANY missing value). Store the number of complete rows in `n_complete` and the number of columns in `n_cols`. Print "Complete rows: N" and "Columns: N".',initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert n_complete == 160, f"Expected 160 complete rows, got {n_complete}"
assert n_cols == 8, f"Expected 8 columns, got {n_cols}"
print("PASS")`,hints:["dropna() with no arguments drops every row containing at least one NaN; shape[1] gives the column count.",`df_complete = df.___()

n_complete = len(df_complete)
n_cols = df_complete.shape[1]
print(f"Complete rows: {n_complete}")
print(f"Columns: {n_cols}")`]},{type:"md",md:`## Strategy 2: Fill Missing Values

\`fillna()\` replaces NaN with a value you choose. Common choices:

| Fill value | When appropriate |
|------------|-----------------|
| Column mean/median | Random missing, numerical data |
| Constant (e.g. 0) | Structural absence (Strength has no distance) |
| Forward fill (\`.ffill()\`) | Time-series: use the last valid reading |
| Backward fill (\`.bfill()\`) | Time-series: use the next valid reading |

\`\`\`python
# Fill with column mean
mean_hr = df['Avg_HR'].mean()
df['Avg_HR_filled'] = df['Avg_HR'].fillna(mean_hr)

# Fill with constant
df['Distance_km_zero'] = df['Distance_km'].fillna(0)
\`\`\`

Note: always fill a **copy** of the column (or use \`df.copy()\`) rather than modifying the original so you can compare before and after.`},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"fillna() with the column mean vs. a constant — two common patterns.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# Fill Avg_HR with the column mean
hr_mean = round(float(df['Avg_HR'].mean()), 1)
df['Avg_HR_filled'] = df['Avg_HR'].fillna(hr_mean)

print(f"Avg_HR mean (non-null): {hr_mean}")
print(f"Remaining NaN in Avg_HR_filled: {df['Avg_HR_filled'].isna().sum()}")

# Strength sessions get 0 for Distance_km (no running)
df['Distance_km_filled'] = df['Distance_km'].fillna(0)
print(f"Remaining NaN in Distance_km_filled: {df['Distance_km_filled'].isna().sum()}")
print(f"Mean distance (all sessions, zeros included): {df['Distance_km_filled'].mean():.2f} km")`},{type:"exercise",id:"ex-5-23",title:"Fill Missing Heart Rate with Column Mean",domain:"physiology",packages:["pandas"],dataFiles:["training_log.csv"],description:"Fill the 6 missing `Avg_HR` values with the column mean:\n1. Store the mean (rounded to 1 decimal) in `hr_mean`.\n2. Store the filled Series in `avg_hr_filled`.\n3. Store the count of remaining NaN in `n_remaining`.\nThen print the mean and the remaining count; any clear format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert abs(hr_mean - 143.4) < 0.05, f"hr_mean should be 143.4, got {hr_mean}"
assert int(n_remaining) == 0, f"no NaN should remain, got {n_remaining}"
print("PASS")`,hints:["Compute the mean of the non-missing values first (mean() skips NaN automatically), then fillna(hr_mean).",`hr_mean = round(float(df["Avg_HR"].mean()), 1)

avg_hr_filled = df["Avg_HR"].fillna(___)

n_remaining = avg_hr_filled.isna().sum()
print(f"HR mean used: {hr_mean}")
print(f"Remaining NaN: {n_remaining}")`]},{type:"md",md:`## Strategy 3: Interpolate for Time-Series

When data is ordered (e.g. by date), \`interpolate()\` estimates missing values by drawing straight lines between the surrounding known points. This is ideal for heart rate, GPS speed, or any sensor signal with occasional dropouts.

\`\`\`python
# Linear interpolation along the column
df['Avg_HR_interp'] = df['Avg_HR'].interpolate(method='linear')
\`\`\`

Interpolation assumes the gap lies *between* two real readings, so it is inappropriate for gaps at the start or end of a series, or for very long gaps where the linear assumption breaks down.`},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"interpolate() fills gaps by drawing straight lines between known values.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# Before interpolation
print(f"Missing Avg_HR before: {df['Avg_HR'].isna().sum()}")

# Interpolate within each athlete's sorted sessions
df_sorted = df.sort_values(['Athlete', 'Date']).copy()
df_sorted['Avg_HR_interp'] = df_sorted.groupby('Athlete')['Avg_HR'].transform(
    lambda x: x.interpolate(method='linear', limit_direction='both')
)

print(f"Missing Avg_HR after interpolation: {df_sorted['Avg_HR_interp'].isna().sum()}")`},{type:"exercise",id:"ex-5-24",title:"Interpolate Missing Heart Rate",domain:"physiology",packages:["pandas"],dataFiles:["training_log.csv"],description:'Apply `interpolate(method="linear")` to the `Avg_HR` column and store the result in `avg_hr_interp`. Store the number of remaining NaN values in `n_remaining`. Print the missing count before and after.',initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert int(n_remaining) == 0, f"Expected 0 remaining NaN, got {n_remaining}"
print("PASS")`,hints:['interpolate(method="linear") estimates each gap by drawing a straight line between the surrounding known values.',`before = df["Avg_HR"].isna().sum()
print(f"Before: {before} missing")

avg_hr_interp = df["Avg_HR"].interpolate(method="___")

n_remaining = avg_hr_interp.isna().sum()
print(f"After interpolation: {n_remaining} missing")`]},{type:"md",md:`## Comparing Strategies

No single strategy is always best. Compare them side-by-side on the same column to see how they differ:

| Strategy | Effect on mean | Effect on variance | Use when |
|----------|---------------|--------------------|---------|
| Drop rows | May shift mean if missing is MNAR | Unaffected | Few gaps, random missingness |
| Fill with mean | Mean stays the same | Variance decreases | Moderate random gaps |
| Interpolate | Depends on neighbours | Closer to reality | Ordered time-series |

> **Best practice:** Document which strategy you chose and why. Sensitivity analysis — running your analysis with two strategies and checking if conclusions change — is good scientific hygiene.`},{type:"exercise",id:"ex-5-25",title:"Compare Fill Strategies on Distance",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:"Create two filled versions of `Distance_km`: `dist_mean_fill` (filled with the column mean) and `dist_zero_fill` (filled with 0 -- Strength sessions have no running). Print the mean of each, rounded to 2 decimals. The means will differ -- explain why in a comment.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert abs(float(dist_mean_fill.mean()) - 10.42) < 0.05, f"Mean-fill mean wrong: {dist_mean_fill.mean()}"
assert abs(float(dist_zero_fill.mean()) - 7.27) < 0.05, f"Zero-fill mean wrong: {dist_zero_fill.mean()}"
print("PASS")`,hints:["fillna(col_mean) leaves the overall mean unchanged (~10.42); fillna(0) adds 71 zeros that drag it down (~7.27).",`col_mean = df["Distance_km"].mean()
dist_mean_fill = df["Distance_km"].fillna(___)
dist_zero_fill = df["Distance_km"].fillna(0)

print(f"Mean (fill with mean): {round(float(dist_mean_fill.mean()), 2)}")
print(f"Mean (fill with 0): {round(float(dist_zero_fill.mean()), 2)}")
# The zero-fill mean is lower because 71 zeros pull the average down.`]},{type:"exercise",id:"ex-5-26",title:"Full Missing-Data Audit Report",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:`Build a concise audit:
1. Store total_rows and total_cols.
2. Store missing (the per-column isnull().sum() Series) and cols_with_missing (only columns with more than 0 missing).
3. Store pct_complete: the percentage of fully complete rows, rounded to 1 decimal.
Then print the rows/cols line, the columns with gaps, and the complete-row percentage.`,initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert total_rows == 236
assert total_cols == 8
assert int(missing['Distance_km']) == 71
assert abs(pct_complete - 67.8) < 0.5, f"pct_complete={pct_complete}"
print("PASS")`,hints:["isnull().sum() gives the per-column counts (filter with missing[missing > 0]); len(df.dropna()) / len(df) gives the complete-row share.",`total_rows = len(df)
total_cols = df.shape[1]

missing = df.isnull().sum()
cols_with_missing = missing[missing > 0]

n_complete = len(df.___())
pct_complete = round(n_complete / total_rows * 100, 1)

print(f"Rows: {total_rows}  Cols: {total_cols}")
print()
print("Missing values (columns with gaps):")
print(cols_with_missing)
print()
print(f"Complete rows: {pct_complete}%")`]},{type:"md",md:"## Summary\n\n- Detect missing data with `isnull().sum()` — and always ask *why* a value is missing before choosing a strategy.\n- `dropna()` removes rows (or columns); use it when the gaps are few and genuinely random.\n- `fillna()` replaces NaN with a mean, a constant, or a neighbouring value; `interpolate()` draws straight lines across gaps in ordered data.\n- Structural absence (a strength session has no running distance) is not an error — do not fill or drop it blindly.\n- Document which strategy you chose and why; rerunning the analysis with a second strategy is good scientific hygiene.\n\nIn the next lesson, we hunt the opposite problem: values that are present but should not be — outliers."}],quiz:null},"cleaning-outliers":{blocks:[{type:"md",md:`# Data Cleaning: Outliers

## What an Outlier Is and Why It Matters

An **outlier** is a value that sits far away from the rest of your data. In sport science they appear constantly: a stopwatch read in minutes instead of seconds, a heart rate strap reporting 15 bpm, an RPE typed as 45 on a 0–10 scale, or a GPS unit that logs a single 80 km/h sprint. Some outliers are mistakes; some are real and important. Your job is to find them and then decide which kind each one is.

Why care? Because a single bad value can wreck a summary statistic. The mean is especially fragile — it adds every value up, so one absurd number drags the average toward itself. The training log contains two planted examples:

1. One session has a \`Duration_min\` of **480.0** — an eight-hour session that is almost certainly a data-entry error.
2. One session has an \`RPE\` of **45** — impossible, since the RPE scale only runs 0–10.

> **Key idea:** An outlier is either an error or a genuine extreme performance, and you must tell the two apart before you decide what to do.`},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"One bad Duration value shifts the group mean by 1.7 minutes.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')
dur = df['Duration_min']

mean_with    = round(float(dur.mean()), 1)
mean_without = round(float(dur[dur != 480.0].mean()), 1)

print(f"Mean WITH the 480 value:    {mean_with} min")
print(f"Mean WITHOUT the 480 value: {mean_without} min")
print(f"Sessions total: {len(dur)}")
print(f"Difference: {round(mean_with - mean_without, 1)} min")`},{type:"exercise",id:"ex-5-27",title:"Spot the Impossible RPE",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:"The RPE scale runs 0-10.\n1. Store the count of rows where RPE > 10 in `n_impossible_rpe` (integer).\n2. Store the maximum RPE value in `max_rpe` (integer).\nThen print both; any clear format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert n_impossible_rpe == 1, f"exactly 1 row has RPE > 10, got {n_impossible_rpe}"
assert max_rpe == 45, f"the maximum RPE is the impossible 45, got {max_rpe}"
print("PASS")`,hints:["A comparison creates a boolean Series and .sum() counts the True values; .max() gives the largest value.",`n_impossible_rpe = int((df["RPE"] > ___).sum())
max_rpe = int(df["RPE"].max())

print(f"Impossible RPE values (> 10): {n_impossible_rpe}")
print(f"Maximum RPE recorded: {max_rpe}")`]},{type:"md",md:`## Spot Them Visually First

Before any formula, *look* at the data. A **box plot** draws the median, the quartiles (the box), and "whiskers" out to the normal range. Anything beyond the whiskers is drawn as an individual point — a visual outlier flag. A **histogram** shows the same pattern differently: a populated cluster on the left, a wide gap, then a single isolated bar.

Both plots tell you something is unusual; they do not tell you whether it is an error. That judgement requires domain knowledge.

\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/training_log.csv')
dur = df['Duration_min']

plt.boxplot(dur, labels=['Duration_min'])
plt.ylabel('Duration (min)')
plt.title('Session Duration — Box Plot')
plt.grid(axis='y', alpha=0.3)
plt.show()
\`\`\`

The box sits around 50–90 minutes where almost every session lives, but one lonely point floats near the top at 480. That single dot, far above the whisker, is the 8-hour session screaming for attention.`},{type:"md",md:`## The Z-Score Rule

The **z-score** measures how many standard deviations a value sits from the mean:

\`\`\`
z = (x − mean) / std
\`\`\`

A common rule of thumb is to flag any value with **|z| > 3**. In our training log:

- Mean duration = 65.7 min, std = 33.3 min
- Z-score of the 480-minute session = (480 − 65.7) / 33.3 = **12.4**

A z-score of 12.4 is enormous and clearly flags the error. But notice the trap: the std here (33.3 min) is *itself* inflated by the 480 value. **The very outlier you are hunting distorts the yardstick you measure it with.** When extreme values are present, the z-score rule can both miss borderline cases and overstate the spread — which is why a more robust method exists.`},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"Z-score rule on Duration_min — the 480-minute session scores 12.4.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')
dur = df['Duration_min']

mean = dur.mean()
std  = dur.std()
z    = (dur - mean) / std

print(f"Mean: {mean:.1f} min,  Std: {std:.1f} min")
print(f"Z-score of 480 min session: {(480.0 - mean) / std:.1f}")
print(f"Sessions with |z| > 3: {int((z.abs() > 3).sum())}")`},{type:"exercise",id:"ex-5-28",title:"Flag Outliers with the Z-Score Rule",domain:"physiology",packages:["pandas"],dataFiles:["training_log.csv"],description:"Compute z-scores for `Duration_min` (already extracted as `dur`).\n1. Store the number of rows with |z| > 3 in `n_flagged`.\n2. Store the z-score of the 480-minute session (rounded to 1 decimal) in `z_480`.\nThen print both; any clear format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')
dur = df['Duration_min']`,testCode:`assert n_flagged == 1, f"exactly 1 session is beyond 3 SDs, got {n_flagged}"
assert abs(z_480 - 12.4) < 0.05, f"z_480 should be about 12.4, got {z_480}"
print("PASS")`,hints:["z = (dur - mean) / std; count the flags with (z.abs() > 3).sum(). The 480-minute session scores about 12.4.",`mean = dur.mean()
std = dur.std()
z = (dur - mean) / std

n_flagged = int((z.abs() > ___).sum())
z_480 = round(float((480.0 - mean) / std), 1)

print(f"Flagged (|z| > 3): {n_flagged}")
print(f"Z-score of 480 min session: {z_480}")`]},{type:"md",md:`## The IQR Rule

The **interquartile range (IQR)** method does not use the mean or the std at all. Instead it uses quartiles, which barely move when a few extreme values are present.

- **Q1** is the 25th percentile.
- **Q3** is the 75th percentile.
- **IQR = Q3 − Q1** — the spread of the middle half of the data.

You then build *fences*:

\`\`\`
lower fence = Q1 − 1.5 × IQR
upper fence = Q3 + 1.5 × IQR
\`\`\`

Anything below the lower fence or above the upper fence is flagged. For our training log:
- Q1 = 47.75 min, Q3 = 89.0 min, IQR = 41.25 min
- Upper fence = 89.0 + 1.5 × 41.25 = **150.9 min**
- One session exceeds that: Martin's 480-minute Endurance session.

Why prefer this method? Because **quartiles resist extremes**. Pushing one value from 90 to 480 does not move Q1 or Q3. The IQR rule measures spread with a ruler the outlier cannot bend.

Catching a value outside *either* fence takes two conditions in one filter, which is new. Pandas uses \`|\` for "or" and \`&\` for "and" (the row-by-row versions of the \`or\` and \`and\` you met in Module 4), and each condition sits in its own parentheses:

\`\`\`python
outliers = df[(dur < lower_fence) | (dur > upper_fence)]
\`\`\``},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"IQR fences on Duration_min — robust because quartiles resist extreme values.",code:`import pandas as pd

df  = pd.read_csv('data/training_log.csv')
dur = df['Duration_min']

q1  = dur.quantile(0.25)
q3  = dur.quantile(0.75)
iqr = q3 - q1
lower_fence = q1 - 1.5 * iqr
upper_fence = q3 + 1.5 * iqr

print(f"Q1: {q1}, Q3: {q3}, IQR: {iqr}")
print(f"Fences: {lower_fence:.1f} to {upper_fence:.1f}")

outliers = df[(dur < lower_fence) | (dur > upper_fence)]
print(f"\\nOutlier rows: {len(outliers)}")
print(outliers[['Date', 'Athlete', 'Session_Type', 'Duration_min']])`},{type:"exercise",id:"ex-5-29",title:"Flag the Outliers with the IQR Rule",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:"Apply the IQR rule to `Duration_min` (already extracted as `dur`). Store the upper fence (rounded to 1 decimal) in `upper_fence` and the count of outlier rows (outside either fence) in `n_outliers`. Print each on its own line.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')
dur = df['Duration_min']`,testCode:`q1 = df['Duration_min'].quantile(0.25)
q3 = df['Duration_min'].quantile(0.75)
iqr = q3 - q1
uf = q3 + 1.5 * iqr
lf = q1 - 1.5 * iqr
expected_outliers = int(((dur < lf) | (dur > uf)).sum())
assert abs(upper_fence - round(float(uf), 1)) < 0.1, f"upper_fence={upper_fence}"
assert n_outliers == expected_outliers, f"n_outliers={n_outliers}"
assert expected_outliers >= 1
print("PASS")`,hints:["Q1 = quantile(0.25), Q3 = quantile(0.75); the fences sit 1.5 IQR beyond the quartiles. Upper fence = 89.0 + 61.875 = 150.9.",`q1 = dur.quantile(0.25)
q3 = dur.quantile(0.75)
iqr = q3 - q1

lower_fence = q1 - 1.5 * iqr
upper_fence = round(float(q3 + 1.5 * iqr), 1)

n_outliers = int(((dur < lower_fence) | (dur > ___)).sum())

print(round(upper_fence, 1))
print(n_outliers)`]},{type:"md",md:`## Error vs Real Extreme

Flagging a value is not the same as deleting it. A flag only says "this is unusual" — it does not say "this is wrong." The decisive question is always: **is this value physically possible?**

- A \`Duration_min\` of **480** — an eight-hour training session — is implausible for the athletes in this log. Almost certainly a clock left running. **Error.**
- An \`RPE\` of **45** is *impossible by definition*: the scale only runs 0–10. No legitimate measurement could produce 45. **Error.**
- A VO2max of **85 ml/kg/min** is extraordinarily high, but within the range of genuinely elite endurance athletes. **Real extreme — keep it.**
- A 95-minute match when most sessions are 60 minutes is long, but a match that ran to extra time really can be 95 minutes. **Real extreme — keep it.**

Statistics tell you a value is *unusual*; only **domain knowledge** tells you whether it is *wrong*. An elite athlete is supposed to be an outlier. Deleting that data point would erase exactly the performance you most want to study.`},{type:"exercise",id:"ex-5-30",title:"Domain-Knowledge Filter on RPE",domain:"teaching",packages:["pandas"],dataFiles:["training_log.csv"],description:"Flag rows where RPE is outside the valid 0-10 range (the bounds are given). Store the flagged rows in `flagged_rpe` (a DataFrame) and the count in `n_flagged`. Print the count, then the flagged rows showing only the Date, Athlete, Session_Type, and RPE columns.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# Valid RPE range is 0 to 10
valid_min, valid_max = 0, 10`,testCode:`assert n_flagged == 1, f"Expected 1 flagged row, got {n_flagged}"
assert int(flagged_rpe['RPE'].iloc[0]) == 45, "The impossible RPE should be 45"
print("PASS")`,hints:["Combine the two comparisons with | (or) inside df[...] to keep the out-of-range rows.",`flagged_rpe = df[(df["RPE"] < valid_min) | (df["RPE"] > ___)]
n_flagged = len(flagged_rpe)

print(f"Flagged rows: {n_flagged}")
print(flagged_rpe[["Date", "Athlete", "Session_Type", "RPE"]])`]},{type:"md",md:`## Flag, Don't Silently Delete

When you find an outlier, follow a disciplined process rather than reaching for the delete key:

1. **Flag it.** Add a column marking the row as suspicious. Never let it vanish without a trace.
2. **Investigate.** Check the raw record. Why is this value here? Can you verify against the original source?
3. **Correct if recoverable.** If the true value is knowable (the session sheet says 48 min and someone typed 480), fix it and note the correction.
4. **Remove only with a recorded reason.** If the value is clearly an error and unrecoverable, you may drop it — but document what you removed and why.
5. **Otherwise keep and report.** If you cannot prove it is wrong, keep it. A genuine extreme is real data.

**Quietly deleting inconvenient data is one of the most common ways analyses end up lying.** Flagging keeps the decision visible, documented, and reproducible.`},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"Flag suspicious rows with a boolean column — no silent deletion.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# IQR upper fence for Duration_min
q1 = df['Duration_min'].quantile(0.25)
q3 = df['Duration_min'].quantile(0.75)
upper_fence = q3 + 1.5 * (q3 - q1)

# Add a flag column instead of dropping
df['duration_outlier'] = df['Duration_min'] > upper_fence
df['rpe_impossible']   = df['RPE'] > 10

print(f"Duration outliers flagged: {df['duration_outlier'].sum()}")
print(f"Impossible RPE flagged: {df['rpe_impossible'].sum()}")
print("\\nFlagged rows:")
print(df[df['duration_outlier'] | df['rpe_impossible']][['Date','Athlete','Session_Type','Duration_min','RPE']])`},{type:"exercise",id:"ex-5-31",title:"Build a Full Outlier Flag Report",domain:"physiology",packages:["pandas"],dataFiles:["training_log.csv"],description:"Add two boolean columns and count the flags:\n1. `flag_duration`: True when Duration_min > 150.9 (the IQR upper fence).\n2. `flag_rpe`: True when RPE > 10.\n3. Store the number of rows flagged by EITHER rule in `n_any_flagged`.\nThen print the two per-rule counts and the combined total; any clear format is fine.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert int(df['flag_duration'].sum()) == 1, "the duration rule should flag exactly 1 row"
assert int(df['flag_rpe'].sum()) == 1, "the RPE rule should flag exactly 1 row"
assert n_any_flagged == 2, f"2 rows are flagged in total, got {n_any_flagged}"
print("PASS")`,hints:["Each flag is a boolean comparison stored as a column; combine them with | and count with .sum().",`df["flag_duration"] = df["Duration_min"] > 150.9
df["flag_rpe"] = df["RPE"] > ___

n_any_flagged = int((df["flag_duration"] | df["flag_rpe"]).sum())

n_dur = int(df["flag_duration"].sum())
n_rpe = int(df["flag_rpe"].sum())
print(f"Rows flagged by duration rule: {n_dur}")
print(f"Rows flagged by RPE rule: {n_rpe}")
print(f"Total rows flagged by either: {n_any_flagged}")`]},{type:"exercise",id:"ex-5-32",title:"IQR Rule on Avg_HR",domain:"biomechanics",packages:["pandas"],dataFiles:["training_log.csv"],description:"Apply the IQR rule to `Avg_HR` (the non-null values are already extracted as `hr`). Store the lower fence in `hr_lower` and the upper fence in `hr_upper` (each rounded to 1 decimal), and the number of outliers in `n_hr_outliers`. Print the fences and the outlier count.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')
hr = df['Avg_HR'].dropna()`,testCode:`hr = df['Avg_HR'].dropna()
q1 = float(hr.quantile(0.25)); q3 = float(hr.quantile(0.75)); iqr = q3 - q1
expected_upper = round(q3 + 1.5*iqr, 1)
expected_lower = round(q1 - 1.5*iqr, 1)
assert abs(hr_upper - expected_upper) < 0.2, f"hr_upper={hr_upper}"
assert abs(hr_lower - expected_lower) < 0.2, f"hr_lower={hr_lower}"
print("PASS")`,hints:["Same IQR recipe as for duration, applied to the non-null heart rates.",`q1 = hr.quantile(0.25)
q3 = hr.quantile(0.75)
iqr = q3 - q1

hr_lower = round(float(q1 - 1.5 * iqr), 1)
hr_upper = round(float(q3 + 1.5 * ___), 1)

n_hr_outliers = int(((hr < hr_lower) | (hr > hr_upper)).sum())

print(f"HR fences: {hr_lower} to {hr_upper}")
print(f"HR outliers: {n_hr_outliers}")`]},{type:"exercise",id:"ex-5-33",title:"Clean Dataset: Remove Both Outlier Rows",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:"Create `df_clean` by removing rows where Duration_min > 150.9 OR RPE > 10. Store the shape of `df_clean` in `clean_shape`. Print the original shape and the cleaned shape. (This models the documented-removal step -- in practice you would log the reason before dropping.)",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert clean_shape == (234, 8), f"Expected (234, 8), got {clean_shape}"
print("PASS")`,hints:["Build a keep-mask: duration within the fence AND RPE within the scale. 236 - 2 outlier rows = 234.",`mask_ok = (df["Duration_min"] <= 150.9) & (df["RPE"] <= ___)
df_clean = df[mask_ok]

clean_shape = df_clean.shape
print(f"Original: {df.shape}")
print(f"After removing outliers: {clean_shape}")`]},{type:"md",md:`## Summary

- An outlier is either an error or a real extreme — statistics flag it, domain knowledge decides which.
- The z-score rule (|z| > 3) is simple, but the outlier inflates the very std it is measured against.
- The IQR rule (fences 1.5 IQR beyond the quartiles) resists that distortion — quartiles barely move.
- A value outside its physical range (an RPE of 45) is an error by definition; an exceptional but possible value is real data.
- Flag, investigate, correct or remove with a recorded reason — never silently delete.

In the next lesson, we summarise the cleaned data: \`describe()\`, \`value_counts()\`, and the split-apply-combine power of \`groupby()\`.`}],quiz:{id:"quiz-5-2",title:"Outliers Quiz",questions:[{id:"q1",type:"multiple-choice",question:"Using the z-score rule, what does a value with |z| > 3 indicate?",options:[{value:"a",label:"The value is definitely a data-entry error and should be deleted"},{value:"b",label:"The value is unusually extreme -- more than three standard deviations from the mean"},{value:"c",label:"The value is exactly three times the mean"},{value:"d",label:"The value is missing and must be imputed"}],correctAnswer:"b",explanation:"The z-score z = (x - mean) / std counts how many standard deviations a value lies from the mean. |z| > 3 flags a value as unusually extreme, but extreme is not the same as wrong -- it is a candidate to investigate, not an automatic error."},{id:"q2",type:"multiple-choice",question:"Why is the IQR rule generally more robust than the z-score rule for flagging outliers?",options:[{value:"a",label:"It uses more data points than the z-score rule"},{value:"b",label:"It always flags more outliers, so it catches everything"},{value:"c",label:"Quartiles are not distorted by the very outliers you are hunting, whereas the std is"},{value:"d",label:"It does not require sorting the data"}],correctAnswer:"c",explanation:"The z-score uses the mean and std, both of which are dragged toward an extreme value -- the outlier inflates the std and distorts its own score. The IQR rule uses Q1 and Q3, which are positions in the sorted data and barely move when a few extreme values are present."},{id:"q3",type:"multiple-choice",question:"You spot an outlier in your dataset. Should you delete it the instant you see it?",options:[{value:"a",label:"Yes -- outliers always distort the analysis, so remove them immediately"},{value:"b",label:"No -- investigate whether it is an error or a real extreme first, and remove it only with a recorded reason"},{value:"c",label:"Yes -- but only if it is above the mean"},{value:"d",label:"No -- you must always keep every value exactly as recorded"}],correctAnswer:"b",explanation:"A flag means a value is unusual, not that it is wrong. Investigate the raw record first: correct it if the true value is recoverable, remove it only with a documented reason, otherwise keep and report it. Silently deleting inconvenient data is how analyses end up lying."},{id:"q4",type:"multiple-choice",question:"A genuinely elite athlete posts a VO2max far above everyone else in the squad. Is that value an error?",options:[{value:"a",label:"Yes -- any value flagged as an outlier is by definition an error"},{value:"b",label:"Yes -- it is too far from the mean to be real"},{value:"c",label:"No -- extreme is not the same as wrong; an elite performance is real data worth keeping"},{value:"d",label:"It cannot be determined without deleting it first"}],correctAnswer:"c",explanation:'Extreme is not the same as wrong. A VO2max that is physically possible -- even if exceptional -- is a real extreme, not an error. Deleting it would erase exactly the elite performance you most want to study. The question is always "is this value possible?"'}]}},"data-sumups":{blocks:[{type:"md",md:`# Exploring and Summarising Data

## First Steps with Any Dataset

When you receive a new dataset — a fitness testing battery, GPS tracking data, or a season-long training log — the first thing to do is **explore** it. You need to understand:

1. How big is the dataset?
2. What columns (variables) are there?
3. What data types are present?
4. Are there missing values?
5. What are the ranges and distributions of numerical values?

Pandas provides a suite of methods for exactly this purpose. The single most useful is \`describe()\`, which gives you count, mean, std, min, quartiles, and max for every numeric column in one call.`},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"describe() gives an instant snapshot of every numeric column.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print()
print(df.describe().round(1))`},{type:"exercise",id:"ex-5-34",title:"First Look at the Training Log",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:`Explore the training log:
1. Store the shape in log_shape and print it.
2. Print the list of column names.
3. Store the number of unique athletes in n_athletes and print it.
4. Print the count of sessions per Session_Type using .value_counts().`,initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert log_shape == (236, 8), f"shape {log_shape}"
assert n_athletes == 6, f"n_athletes {n_athletes}"
print("PASS")`,hints:["df.shape, list(df.columns), .nunique(), and .value_counts() cover all four facts.",`log_shape = df.shape
n_athletes = df["Athlete"].nunique()

print(f"Shape: {log_shape}")
print(f"Columns: {list(df.columns)}")
print(f"Unique athletes: {n_athletes}")
print()
print("Sessions per type:")
print(df["Session_Type"].___())`]},{type:"md",md:"## Individual Column Statistics\n\n`describe()` covers everything at once, but you often need specific statistics for specific columns:\n\n```python\ndf['RPE'].mean()      # mean\ndf['RPE'].median()    # median (50th percentile)\ndf['RPE'].std()       # standard deviation\ndf['RPE'].min()       # minimum\ndf['RPE'].max()       # maximum\ndf['RPE'].quantile(0.75)  # 75th percentile\n```\n\nFor categorical columns, `value_counts()` shows how often each category appears, and `nunique()` counts distinct values. Use `corr()` to check whether two numeric columns move together."},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"Individual statistics on RPE and Duration, plus a session-type count.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

print(f"Mean RPE:       {df['RPE'].mean():.2f}")
print(f"Median duration: {df['Duration_min'].median():.0f} min")
print(f"Max duration:    {df['Duration_min'].max():.0f} min")
print(f"HR-RPE correlation: {df['Avg_HR'].corr(df['RPE']):.3f}")
print()
print("Session type counts:")
print(df['Session_Type'].value_counts())`},{type:"exercise",id:"ex-5-35",title:"Summarise the Test Battery",domain:"physiology",packages:["pandas"],dataFiles:["test_battery.csv"],description:'Using `data/test_battery.csv` (loaded as `tb`):\n1. Store the shape in `tb_shape`.\n2. Store the mean CMJ height (1 decimal) in `cmj_mean`.\n3. Store the number of male athletes (Sex == "M") in `n_male`.\nThen print all three; any clear format is fine.',initialCode:`import pandas as pd

tb = pd.read_csv('data/test_battery.csv')`,testCode:`assert tb_shape == (20, 8), f"tb_shape should be (20, 8), got {tb_shape}"
assert abs(cmj_mean - 33.8) < 0.05, f"cmj_mean should be 33.8, got {cmj_mean}"
assert n_male == 10, f"n_male should be 10, got {n_male}"
print("PASS")`,hints:['Round the mean with round(float(...), 1); count males by summing the boolean tb["Sex"] == "M".',`tb_shape = tb.shape
cmj_mean = round(float(tb["CMJ_cm"].mean()), 1)
n_male = int((tb["Sex"] == "___").sum())

print(f"Shape: {tb_shape}")
print(f"Mean CMJ: {cmj_mean} cm")
print(f"Male athletes: {n_male}")`]},{type:"md",md:"## Groupby: Split-Apply-Combine\n\nOne of the most powerful patterns in data analysis is **grouping** — splitting data into groups, applying a calculation to each group, and combining the results. In sport science this appears everywhere:\n\n- Average sprint time **by position**\n- Total training volume **per athlete per week**\n- CMJ mean **by sex**\n\nPandas makes this easy with `groupby()`:\n\n```python\n# Mean of all numeric columns per Session_Type\ndf.groupby('Session_Type').mean(numeric_only=True)\n\n# Single column, single statistic\ndf.groupby('Session_Type')['RPE'].mean()\n```\n\nSwap `.mean()` for `.sum()`, `.std()`, `.max()`, or `.count()` to answer a different question with the same line."},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"groupby() splits on Session_Type and computes mean Duration and RPE per group.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# Mean duration and RPE by session type
summary = df.groupby('Session_Type')[['Duration_min', 'RPE']].mean().round(1)
print("Mean by session type:")
print(summary)

# Number of sessions of each type
print("\\nSessions per type:")
print(df.groupby('Session_Type')['Duration_min'].count())`},{type:"exercise",id:"ex-5-36",title:"Compare Athletes by Mean Duration",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:"Group by `Athlete` and compute the mean `Duration_min` per athlete, rounded to 1 decimal, stored in `athlete_dur`. Find which athlete has the highest mean duration and store their name in `hardest_trainer`. Print the per-athlete table, then the name.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert hardest_trainer == 'Martin', f"Expected Martin, got {hardest_trainer}"
assert abs(float(athlete_dur['Martin']) - 76.7) < 0.5, f"Martin mean={athlete_dur['Martin']}"
print("PASS")`,hints:['groupby("Athlete")["Duration_min"].mean() gives a Series; idxmax() returns the index label (the name) of its largest value.',`athlete_dur = df.groupby("Athlete")["Duration_min"].mean().round(1)
print("Mean session duration by athlete:")
print(athlete_dur)

hardest_trainer = athlete_dur.___()
print()
print(f"Hardest trainer: {hardest_trainer}")`]},{type:"exercise",id:"ex-5-37",title:"CMJ Performance by Sex",domain:"physiology",packages:["pandas"],dataFiles:["test_battery.csv"],description:"Using the test battery (loaded as `tb`), group by `Sex`:\n1. Store the mean CMJ_cm per sex in `cmj_mean_by_sex`, rounded to 2 decimals.\n2. Store the standard deviation of CMJ_cm per sex in `cmj_sd_by_sex`, rounded to 2 decimals.\n3. Print both.",initialCode:`import pandas as pd

tb = pd.read_csv('data/test_battery.csv')`,testCode:`assert abs(float(cmj_mean_by_sex['M']) - 36.98) < 0.5, f"Male CMJ mean should be 36.98, got {cmj_mean_by_sex['M']}"
assert abs(float(cmj_mean_by_sex['F']) - 30.52) < 0.5, f"Female CMJ mean should be 30.52, got {cmj_mean_by_sex['F']}"
assert abs(float(cmj_sd_by_sex['M']) - 5.42) < 0.5, f"Male CMJ sd should be 5.42, got {cmj_sd_by_sex['M']}"
assert abs(float(cmj_sd_by_sex['F']) - 4.24) < 0.5, f"Female CMJ sd should be 4.24, got {cmj_sd_by_sex['F']}"
print("PASS")`,hints:["The same groupby line twice: once ending in .mean(), once ending in .std().",`cmj_mean_by_sex = tb.groupby("Sex")["CMJ_cm"].mean().round(2)
cmj_sd_by_sex = tb.groupby("Sex")["CMJ_cm"].___().round(2)
print("Mean CMJ by sex:")
print(cmj_mean_by_sex)
print()
print("SD of CMJ by sex:")
print(cmj_sd_by_sex)`]},{type:"example",packages:["pandas"],dataFiles:["training_log.csv"],caption:"One statistic per line: total duration and mean RPE per athlete.",code:`import pandas as pd

df = pd.read_csv('data/training_log.csv')

# sRPE load = duration * RPE
df['sRPE'] = df['Duration_min'] * df['RPE']

total_duration = df.groupby('Athlete')['Duration_min'].sum()
mean_rpe = df.groupby('Athlete')['RPE'].mean().round(1)

print("Total minutes per athlete:")
print(total_duration)
print("\\nMean RPE per athlete:")
print(mean_rpe)`},{type:"exercise",id:"ex-5-38",title:"Session Load by Session Type",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:"Add a column `sRPE` = Duration_min * RPE. Then group by `Session_Type`:\n1. Store the mean sRPE per type in `mean_load`, rounded to 0 decimals.\n2. Store the total sRPE per type in `total_load`, rounded to 0 decimals.\n3. Print both.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert abs(float(total_load['Match']) - 40230.0) < 10, f"Match total load should be 40230, got {total_load['Match']}"
assert abs(float(mean_load['Endurance']) - 374.0) < 5, f"Endurance mean load should be about 374, got {mean_load['Endurance']}"
print("PASS")`,hints:["Create the sRPE column first; then the same groupby line ending in .mean() and .sum().",`df["sRPE"] = df["Duration_min"] * df["RPE"]

mean_load = df.groupby("Session_Type")["sRPE"].mean().round(0)
total_load = df.groupby("Session_Type")["sRPE"].___().round(0)

print(mean_load)
print()
print(total_load)`]},{type:"md",md:"## Pivot Tables\n\nA pivot table crosses two categorical variables into one summary grid: athletes as rows, weeks as columns, total minutes in each cell. `pivot_table()` takes the values to summarise, the row and column variables, and the statistic to compute for each cell (`aggfunc`):\n\n```python\ndf.pivot_table(values='Duration_min', index='Athlete',\n               columns='Session_Type', aggfunc='mean')\n```\n\nThis is the pandas equivalent of a pivot table in Excel, but reproducible and scriptable."},{type:"exercise",id:"ex-5-39",title:"Weekly Training Volume Pivot",domain:"coaching",packages:["pandas"],dataFiles:["training_log.csv"],description:"Extract the week number from the `Date` column into a `Week` column using `pd.to_datetime` and `.dt.isocalendar().week`. Then build `weekly_pivot`: a pivot table of total `Duration_min` per athlete (rows) per week (columns). Print the pivot shape and the first 3 rows.",initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert weekly_pivot.shape[0] == 6, f"Expected 6 athletes (rows), got {weekly_pivot.shape[0]}"
assert weekly_pivot.shape[1] >= 4, f"Expected at least 4 weeks (cols), got {weekly_pivot.shape[1]}"
print("PASS")`,hints:['pd.to_datetime(df["Date"]).dt.isocalendar().week gives the ISO week; pivot_table takes values=, index=, columns=, and aggfunc=.',`df["Week"] = pd.to_datetime(df["Date"]).dt.isocalendar().week

weekly_pivot = df.pivot_table(
    values="Duration_min",
    index="Athlete",
    columns="Week",
    aggfunc="___"
)

print(f"Pivot shape: {weekly_pivot.shape}")
print(weekly_pivot.head(3))`]},{type:"exercise",id:"ex-5-40",title:"Multi-column Groupby: Athlete × Session Type",domain:"physiology",packages:["pandas"],dataFiles:["training_log.csv"],description:'Group by BOTH Athlete and Session_Type and compute the mean Duration_min and mean RPE, rounded to 1 decimal, stored in `combo_stats`. Then store `combo_stats["Duration_min"].idxmax()` -- the (Athlete, Session_Type) pair with the highest mean duration -- in `top_combo`. Print the table and the pair.',initialCode:`import pandas as pd

df = pd.read_csv('data/training_log.csv')`,testCode:`assert isinstance(top_combo, tuple), "top_combo should be a (Athlete, Session_Type) tuple"
assert top_combo[0] == 'Martin', f"Expected Martin, got {top_combo[0]}"
print("PASS")`,hints:['Group by the LIST ["Athlete", "Session_Type"] to get a two-level index; idxmax() then returns a tuple.',`combo_stats = df.groupby(["Athlete", "Session_Type"])[["Duration_min", "RPE"]].mean().round(1)

top_combo = combo_stats["Duration_min"].___()

print(combo_stats)
print()
print(f"Highest mean duration: {top_combo}")`]},{type:"md",md:'## Summary\n\n- `describe()` gives the full numeric snapshot; individual methods (`mean()`, `median()`, `quantile()`) target single columns.\n- `value_counts()` and `nunique()` summarise categorical columns.\n- `groupby()` implements split-apply-combine: one line answers any "average X by Y" question, and swapping the final method (`.mean()`, `.sum()`, `.std()`, `.count()`) changes the question.\n- `pivot_table()` crosses two categorical variables into a reproducible Excel-style table.\n\nIn the next lesson, we turn these numbers into pictures — line plots, scatters, bars, boxes, and histograms with Matplotlib.'}],quiz:{id:"quiz-5-3",title:"Summarising Data Quiz",questions:[{id:"q1",type:"multiple-choice",question:"Your training log has NaN for Distance_km in every Strength session (athletes do not run in the gym). What is the right way to handle those missing values?",options:[{value:"a",label:"Fill them with the column mean so every row is complete"},{value:"b",label:"Recognise them as structurally absent -- there is nothing to record -- and neither fill nor drop them blindly"},{value:"c",label:"Delete the Strength rows so the dataset has no gaps"},{value:"d",label:"Replace them with the longest distance in the log"}],correctAnswer:"b",explanation:"The distance is missing because the quantity does not exist for a strength session, not because a measurement failed. Filling with a mean would invent kilometres that were never run, and dropping the rows would discard all the strength data. Understand the cause first -- here the NaN is the correct value."},{id:"q2",type:"multiple-choice",question:"Which method would you use to see summary statistics (mean, std, min, max, quartiles) for all numerical columns in a DataFrame?",options:[{value:"a",label:"df.info()"},{value:"b",label:"df.summary()"},{value:"c",label:"df.describe()"},{value:"d",label:"df.statistics()"}],correctAnswer:"c",explanation:"df.describe() computes count, mean, std, min, 25%, 50%, 75%, and max for all numerical columns. df.info() shows column types and non-null counts but not statistics."},{id:"q3",type:"multiple-choice",question:"You have the mean duration per athlete from df.groupby('Athlete')['Duration_min'].mean(). How do you get the TOTAL duration per athlete instead?",options:[{value:"a",label:"Change .mean() to .sum() at the end of the same line"},{value:"b",label:"Multiply each mean by the number of athletes"},{value:"c",label:"Loop over the rows and add up each athlete's minutes by hand"},{value:"d",label:"You cannot; groupby only computes means"}],correctAnswer:"a",explanation:"The split and apply steps stay the same; only the statistic changes. Swapping the final method (.mean(), .sum(), .max(), .count()) asks a different question of the same groups. Multiplying a mean by the athlete count mixes the groups up, and a manual loop redoes what groupby already does in one line."},{id:"q4",type:"multiple-choice",question:"What does df.groupby('Session_Type')['Duration_min'].mean() return?",options:[{value:"a",label:"The overall mean duration"},{value:"b",label:"A DataFrame with all columns averaged by session type"},{value:"c",label:"A Series with the mean duration for each session type"},{value:"d",label:"An error because you can only group by numeric columns"}],correctAnswer:"c",explanation:"groupby('Session_Type') splits the data by session type, then ['Duration_min'].mean() computes the mean within each group. The result is a Series indexed by session type."},{id:"q5",type:"multiple-choice",question:"Which call produces a table of total Duration_min with one row per Athlete and one column per Week?",options:[{value:"a",label:"df.groupby('Athlete').sum()"},{value:"b",label:"df.pivot_table(values='Duration_min', index='Athlete', columns='Week', aggfunc='sum')"},{value:"c",label:"df.describe()"},{value:"d",label:"df.sort_values(['Athlete', 'Week'])"}],correctAnswer:"b",explanation:"pivot_table crosses two categorical variables: index gives the rows, columns gives the columns, and aggfunc says how to combine the values in each cell -- here the summed minutes per athlete per week."}]}},"viz-basic-plots":{blocks:[{type:"md",md:`# Basic Plots

## Why Visualisation Matters in Sport Science

Numbers alone rarely tell the full story. A table of 500 heart rate values is hard to interpret, but a single line plot instantly reveals the warm-up, steady state, intervals, and cool-down phases of a training session.

**Matplotlib** is Python's foundational plotting library. A large share of the figures you see in sport science journals are made with Matplotlib (or a library built on top of it).

## Importing Matplotlib

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np
\`\`\`

The convention is to import the \`pyplot\` module as \`plt\`. This gives you access to all the common plotting functions.

## Line Plots

Line plots are ideal for **time series** data — anything measured over time. In sport science, this includes force-time curves, heart rate traces, velocity profiles, and much more.

The object-oriented approach (using \`fig, ax = plt.subplots()\`) gives you fine-grained control and is the style used throughout this module:

\`\`\`python
fig, ax = plt.subplots()
ax.plot(time, velocity)
ax.set_xlabel('Time (s)')
ax.set_ylabel('Velocity (m/s)')
ax.set_title('Sprint Velocity Profile')
plt.show()
\`\`\``},{type:"example",packages:["matplotlib"],caption:"A single sprint velocity curve modelled with an exponential — the object-oriented style.",code:`import matplotlib.pyplot as plt
import numpy as np

time = np.linspace(0, 12, 100)                      # 100 points over 12 seconds
velocity = 12.0 * (1 - np.exp(-0.5 * time))         # Exponential sprint model

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(time, velocity, 'b-', linewidth=2)
ax.set_xlabel('Time (s)')
ax.set_ylabel('Velocity (m/s)')
ax.set_title('100m Sprint Velocity Profile')
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-50",title:"Plot a Sprint Velocity Curve",domain:"biomechanics",packages:["matplotlib"],description:"Plot velocity against time as a line on `ax`. Add the title 'Sprint Velocity Profile', x-label 'Time (s)', and y-label 'Velocity (m/s)'.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
time = np.linspace(0, 12, 50)
velocity = 11.5 * (1 - np.exp(-0.45 * time))`,testCode:`assert len(ax.lines) >= 1, "No lines plotted"
assert ax.get_title() == 'Sprint Velocity Profile', f"Title wrong: {ax.get_title()}"
assert ax.get_xlabel() == 'Time (s)', f"xlabel wrong: {ax.get_xlabel()}"
assert ax.get_ylabel() == 'Velocity (m/s)', f"ylabel wrong: {ax.get_ylabel()}"
print("PASS")`,hints:["ax.plot(x, y) draws the line; set_title, set_xlabel, and set_ylabel add the text.",`ax.plot(time, velocity)
ax.set_title("Sprint Velocity Profile")
ax.set_xlabel("Time (s)")
ax.set_ylabel("___")`]},{type:"md",md:"## Multiple Lines on One Plot\n\nYou can call `ax.plot()` multiple times to overlay lines. Pass a `label` argument to each so a legend can identify them:\n\n```python\nax.plot(time, athlete_a, label='Athlete A')\nax.plot(time, athlete_b, label='Athlete B')\nax.legend()\n```"},{type:"example",packages:["matplotlib"],caption:"Three sprint curves on one axes — each with a distinct colour and label.",code:`import matplotlib.pyplot as plt
import numpy as np

time = np.linspace(0, 12, 100)
athlete_a = 12.0 * (1 - np.exp(-0.5 * time))
athlete_b = 11.5 * (1 - np.exp(-0.4 * time))
athlete_c = 11.0 * (1 - np.exp(-0.35 * time))

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(time, athlete_a, label='Athlete A')
ax.plot(time, athlete_b, label='Athlete B')
ax.plot(time, athlete_c, label='Athlete C')
ax.set_xlabel('Time (s)')
ax.set_ylabel('Velocity (m/s)')
ax.set_title('Sprint Velocity Comparison')
ax.legend()
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-51",title:"Multi-athlete Sprint Comparison",domain:"coaching",packages:["matplotlib"],description:"Plot all 3 athlete velocity curves on `ax` with distinct labels so the legend can distinguish them, then display the legend.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
time = np.linspace(0, 12, 100)
athleteA = 12.0*(1-np.exp(-0.5*time))
athleteB = 11.5*(1-np.exp(-0.4*time))
athleteC = 11.0*(1-np.exp(-0.35*time))`,testCode:`assert len(ax.lines) >= 3, f"Expected at least 3 lines, got {len(ax.lines)}"
legend = ax.get_legend()
assert legend is not None, "No legend found"
assert len(legend.texts) >= 3, "Legend should have at least 3 entries"
print("PASS")`,hints:["Call ax.plot three times, each with a label= argument, then ax.legend().",`ax.plot(time, athleteA, label="Athlete A")
ax.plot(time, athleteB, label="Athlete B")
ax.plot(time, athleteC, label="___")
ax.legend()`]},{type:"md",md:"## Scatter Plots\n\nScatter plots show the **relationship between two variables**. In sport science, use them to explore correlations — height vs jump height, sprint speed vs power, VO2max vs race time.\n\n```python\nax.scatter(x, y, s=60, color='steelblue', edgecolors='black')\n```"},{type:"example",packages:["matplotlib"],caption:"Height vs vertical jump — a scatter with a slight positive correlation.",code:`import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
n = 20
height = np.random.normal(178, 8, n)
jump = 0.3 * height + np.random.normal(0, 3, n)

fig, ax = plt.subplots(figsize=(7, 5))
ax.scatter(height, jump, s=60, color='steelblue', edgecolors='black', linewidth=0.5)
ax.set_xlabel('Height (cm)')
ax.set_ylabel('Vertical Jump (cm)')
ax.set_title('Height vs. Vertical Jump')
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-52",title:"Scatter Plot: Height vs Jump",domain:"physiology",packages:["matplotlib"],description:"Create a scatter plot of `height` against `jump` on `ax`. Add the x-label 'Height (cm)' and y-label 'Vertical Jump (cm)'.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
np.random.seed(42)
n = 20
height = np.random.normal(178, 8, n)
jump = 0.3*height + np.random.normal(0,3,n)`,testCode:`assert len(ax.collections) >= 1, "No scatter plot found"
assert ax.get_xlabel() != "", "Missing xlabel"
assert ax.get_ylabel() != "", "Missing ylabel"
print("PASS")`,hints:["ax.scatter(x, y) plots the points; then add both axis labels.",`ax.scatter(height, jump)
ax.set_xlabel("Height (cm)")
ax.set_ylabel("___")`]},{type:"md",md:"## Bar Charts\n\nBar charts compare **categories** — positions, training phases, athletes. Use `ax.bar(categories, values)` for vertical bars:\n\n```python\nax.bar(positions, mean_sprint, color='steelblue')\nax.set_ylabel('10m Sprint Time (s)')\nax.set_title('Mean Sprint Time by Position')\n```"},{type:"example",packages:["matplotlib"],caption:"Mean 10 m sprint time per playing position — a four-bar chart.",code:`import matplotlib.pyplot as plt

positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper']
mean_sprint = [1.73, 1.79, 1.81, 1.89]

fig, ax = plt.subplots(figsize=(7, 5))
ax.bar(positions, mean_sprint, color=['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b'])
ax.set_xlabel('Position')
ax.set_ylabel('10m Sprint Time (s)')
ax.set_title('Mean Sprint Time by Position')
ax.grid(axis='y', alpha=0.3)`},{type:"exercise",id:"ex-5-53",title:"Bar Chart: Mean Sprint by Position",domain:"coaching",packages:["matplotlib"],description:"Create a bar chart of `mean_sprint` by `positions` on `ax`. The chart must have exactly 4 bars.",initialCode:`import matplotlib.pyplot as plt

fig, ax = plt.subplots()
positions = ['Forward','Midfielder','Defender','Goalkeeper']
mean_sprint = [1.73, 1.79, 1.81, 1.89]`,testCode:`assert len(ax.patches) == 4, f"Expected 4 bars, got {len(ax.patches)}"
print("PASS")`,hints:["ax.bar(categories, values) draws one bar per category.","ax.bar(___, mean_sprint)"]},{type:"md",md:`## Box Plots

Box plots show the **distribution** of data — median, quartiles, and outliers. They are excellent for comparing groups because you can see spread at a glance.

Pass a list of arrays to \`ax.boxplot()\`:

\`\`\`python
data = [forwards, midfielders, defenders]
ax.boxplot(data, labels=['Fwd', 'Mid', 'Def'])
\`\`\``},{type:"example",packages:["matplotlib"],caption:"Sprint time distribution per position — four box plots side by side.",code:`import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
forwards     = np.random.normal(1.73, 0.04, 15)
midfielders  = np.random.normal(1.79, 0.05, 15)
defenders    = np.random.normal(1.81, 0.04, 15)
goalkeepers  = np.random.normal(1.89, 0.06, 8)

data   = [forwards, midfielders, defenders, goalkeepers]
labels = ['Forwards', 'Midfielders', 'Defenders', 'Goalkeepers']

fig, ax = plt.subplots(figsize=(8, 5))
ax.boxplot(data, labels=labels)
ax.set_ylabel('10m Sprint Time (s)')
ax.set_title('Sprint Time Distribution by Position')
ax.grid(axis='y', alpha=0.3)`},{type:"exercise",id:"ex-5-54",title:"Box Plot: Sprint Distribution by Position",domain:"biomechanics",packages:["matplotlib"],description:"Create a box plot of the sprint times for the 3 positions on `ax`, with the labels ['Forwards', 'Midfielders', 'Defenders'].",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
np.random.seed(42)
forwards = np.random.normal(1.73, 0.04, 15)
midfielders = np.random.normal(1.79, 0.05, 15)
defenders = np.random.normal(1.81, 0.04, 15)`,testCode:`assert len(ax.lines) >= 1, "No box plot lines found"
print("PASS")`,hints:["Pass a LIST of the three arrays to ax.boxplot, plus labels=[...].",`ax.boxplot([forwards, midfielders, ___],
           labels=["Forwards", "Midfielders", "Defenders"])`]},{type:"md",md:`## Histograms

Histograms show the **frequency distribution** of a single continuous variable. Choose the number of bins to control resolution:

\`\`\`python
ax.hist(data, bins=10, color='steelblue', edgecolor='white')
\`\`\`

Too few bins hide the shape; too many create noise. Ten bins is a good starting point.`},{type:"example",packages:["matplotlib"],caption:"VO2max histogram with 10 bins and a vertical mean line.",code:`import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
vo2max = np.random.normal(50, 5, 50)   # 50 athletes

fig, ax = plt.subplots(figsize=(7, 5))
ax.hist(vo2max, bins=10, color='steelblue', edgecolor='white')
ax.axvline(vo2max.mean(), color='red', linestyle='--', label=f'Mean: {vo2max.mean():.1f}')
ax.set_xlabel('VO2max (ml/kg/min)')
ax.set_ylabel('Frequency')
ax.set_title('VO2max Distribution in Squad')
ax.legend()`},{type:"exercise",id:"ex-5-55",title:"Histogram: VO2max Distribution",domain:"physiology",packages:["matplotlib"],description:"Plot a histogram of `vo2max` with exactly 10 bins on `ax`.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
np.random.seed(42)
vo2max = np.random.normal(50, 5, 50)`,testCode:`assert len(ax.patches) == 10, f"Expected 10 bins, got {len(ax.patches)}"
print("PASS")`,hints:["ax.hist(data, bins=N) -- each bin becomes one bar (patch).","ax.hist(vo2max, bins=___)"]},{type:"md",md:"## Summary\n\n| Plot Type | Best For | Key Method |\n|-----------|----------|------------|\n| Line plot | Time series, continuous data | `ax.plot(x, y)` |\n| Scatter plot | Relationships between variables | `ax.scatter(x, y)` |\n| Bar chart | Comparing categories | `ax.bar(categories, values)` |\n| Box plot | Distributions across groups | `ax.boxplot([g1, g2, ...])` |\n| Histogram | Distribution of one variable | `ax.hist(data, bins=N)` |\n\nEvery plot benefits from:\n- `ax.set_xlabel()` / `ax.set_ylabel()` — axis labels\n- `ax.set_title()` — descriptive title\n- `ax.legend()` — when multiple series are present\n- `ax.grid(True, alpha=0.3)` — readability\n\nIn the next lesson, we polish these plots to publication quality — colours, markers, annotations, and reference lines."}],quiz:null},"viz-customization":{blocks:[{type:"md",md:`# Figure Customisation

## Making Publication-Ready Figures

A basic plot gets the data on screen, but presenting results in a thesis, journal paper, or team report requires professional styling. This lesson covers all the customisation options you need.

## Colours, Line Styles, and Markers

Matplotlib accepts colours in several forms:

\`\`\`python
ax.plot(t, y, color='steelblue')           # Named color
ax.plot(t, y, color='#c60c30')             # Hex code
ax.plot(t, y, color=(0.2, 0.7, 0.3))      # RGB tuple (0–1)
\`\`\`

Line styles and markers can be set in a compact **format string** or as separate keyword arguments:

\`\`\`python
ax.plot(t, y, 'ro-')     # red, circle marker, solid line
ax.plot(t, y, 'b^--')    # blue, triangle, dashed
ax.plot(t, y, marker='o', linestyle='--', markersize=8)
\`\`\``},{type:"example",packages:["matplotlib"],caption:"Three athletes plotted with different named and hex colours.",code:`import matplotlib.pyplot as plt
import numpy as np

t = np.linspace(0, 10, 100)
ingrid = 310 + 8*np.sin(t*1.5) + t*1.0
jonas  = 285 + 6*np.sin(t*1.2+1) + t*0.5
sofie  = 260 + 7*np.sin(t*1.8+2) + t*1.5

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(t, ingrid, color='steelblue', linewidth=2, label='Ingrid')   # named color
ax.plot(t, jonas,  color='#c60c30',  linewidth=2, label='Jonas')    # hex color
ax.plot(t, sofie,  color=(0.2, 0.7, 0.3), linewidth=2, label='Sofie') # RGB tuple

ax.set_xlabel('Time (min)')
ax.set_ylabel('Power (W)')
ax.set_title('Power Output — Three Athletes')
ax.legend()
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-56",title:"Coloured Heart Rate Lines",domain:"physiology",packages:["matplotlib"],description:"Plot the three athletes (ingrid, jonas, sofie) on `ax`, each with a different colour and a label, then display the legend.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
t = np.linspace(0, 10, 100)
ingrid = 310 + 8*np.sin(t*1.5) + t*1.0
jonas = 285 + 6*np.sin(t*1.2+1) + t*0.5
sofie = 260 + 7*np.sin(t*1.8+2) + t*1.5`,testCode:`assert len(ax.lines) >= 3, f"Expected at least 3 lines, got {len(ax.lines)}"
print("PASS")`,hints:["Give each ax.plot call a different color= (a name, a hex code, or an RGB tuple) and a label=, then ax.legend().",`ax.plot(t, ingrid, color="steelblue", label="Ingrid")
ax.plot(t, jonas, color="#c60c30", label="Jonas")
ax.plot(t, sofie, color=(0.2, 0.7, 0.3), label="___")
ax.legend()`]},{type:"md",md:"## Markers and Format Strings\n\nUse markers to emphasise individual data points — essential for session-by-session RPE or weekly training data:\n\n```python\nsessions = np.arange(1, 9)\nrpe = [5, 7, 8, 6, 9, 4, 7, 8]\n\nax.plot(sessions, rpe, 'o-', color='steelblue', markersize=8, label='RPE')\n# 'o-' means circle markers + solid line\n```\n\nCommon markers: `'o'` circle, `'s'` square, `'^'` triangle, `'D'` diamond, `'x'` cross."},{type:"example",packages:["matplotlib"],caption:'Weekly RPE with circle markers — the format string "o-" is the shorthand.',code:`import matplotlib.pyplot as plt
import numpy as np

sessions = np.arange(1, 9)
rpe = [5, 7, 8, 6, 9, 4, 7, 8]

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(sessions, rpe, 'o-', color='steelblue', markersize=8, linewidth=2, label='RPE')
ax.set_xlabel('Session')
ax.set_ylabel('RPE (0–10)')
ax.set_title('Training RPE Over 8 Sessions')
ax.legend()
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-57",title:"Custom Line Styles",domain:"teaching",packages:["matplotlib"],description:"Plot `rpe` against `sessions` on `ax` using circle markers joined by a solid line, marker size 8, the label 'RPE', and the colour steelblue.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
sessions = np.arange(1, 9)
rpe = [5,7,8,6,9,4,7,8]`,testCode:`assert len(ax.lines) >= 1, "No line plotted"
assert ax.lines[0].get_marker() == 'o', f"Expected 'o' marker, got '{ax.lines[0].get_marker()}'"
print("PASS")`,hints:['The format string "o-" means circle markers plus a solid line.',`ax.plot(sessions, rpe, "___", color="steelblue", markersize=8, label="RPE")
ax.legend()`]},{type:"md",md:"## Axis Limits and Ticks\n\nControl exactly what range is shown with `set_xlim` / `set_ylim`, and where tick marks land with `set_xticks` / `set_yticks`:\n\n```python\nax.set_xlim(0, 12)\nax.set_ylim(0, 13)\nax.set_xticks(np.arange(0, 13, 2))   # ticks every 2 seconds\nax.set_yticks(np.arange(0, 14, 2))\n```"},{type:"example",packages:["matplotlib"],caption:"Sprint velocity with explicit xlim, ylim, and tick spacing.",code:`import matplotlib.pyplot as plt
import numpy as np

t = np.linspace(0, 12, 100)
velocity = 11.5 * (1 - np.exp(-0.45 * t))

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(t, velocity, 'b-', linewidth=2)

ax.set_xlim(0, 12)
ax.set_ylim(0, 13)
ax.set_xticks(np.arange(0, 13, 2))
ax.set_yticks(np.arange(0, 14, 2))

ax.set_xlabel('Time (s)')
ax.set_ylabel('Velocity (m/s)')
ax.set_title('Sprint Velocity Profile')
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-58",title:"Axis Limits and Ticks",domain:"biomechanics",packages:["matplotlib"],description:"The velocity curve is already plotted. Set the x-limits to (0, 12) and y-limits to (0, 13), the x-label 'Time (s)', y-label 'Velocity (m/s)', and title 'Sprint Velocity Profile'.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
t = np.linspace(0, 12, 100)
velocity = 11.5*(1-np.exp(-0.45*t))
ax.plot(t, velocity, 'b-', linewidth=2)`,testCode:`xlim = ax.get_xlim()
ylim = ax.get_ylim()
assert abs(xlim[0] - 0.0) < 0.01 and abs(xlim[1] - 12.0) < 0.01, f"xlim wrong: {xlim}"
assert abs(ylim[0] - 0.0) < 0.01 and abs(ylim[1] - 13.0) < 0.01, f"ylim wrong: {ylim}"
assert ax.get_xlabel() != "", "Missing xlabel"
assert ax.get_ylabel() != "", "Missing ylabel"
print("PASS")`,hints:["set_xlim / set_ylim fix the visible ranges; the labels and title use the other set_* methods.",`ax.set_xlim(0, 12)
ax.set_ylim(0, ___)
ax.set_xlabel("Time (s)")
ax.set_ylabel("Velocity (m/s)")
ax.set_title("Sprint Velocity Profile")`]},{type:"md",md:`## Annotations

\`ax.annotate()\` draws an arrow pointing to a specific data point with a text label — essential for marking peaks, onsets, or events on force-time curves:

\`\`\`python
ax.annotate(
    'Peak: 680 N',
    xy=(peak_t, peak_f),          # the point the arrow points TO
    xytext=(peak_t + 1, peak_f + 50),  # where the text sits
    arrowprops=dict(arrowstyle='->', color='red'),
    color='red', fontsize=11
)
\`\`\``},{type:"example",packages:["matplotlib"],caption:"Annotated force pulse — the arrow lands exactly on the peak.",code:`import matplotlib.pyplot as plt
import numpy as np

t = np.linspace(0, 5, 200)
force = 800 * (1 - np.exp(-3*t)) * np.exp(-0.3*t)

peak_idx = np.argmax(force)
peak_t = t[peak_idx]
peak_f = force[peak_idx]

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(t, force, 'b-', linewidth=2)
ax.annotate(
    f'Peak: {peak_f:.0f} N',
    xy=(peak_t, peak_f),
    xytext=(peak_t + 1, peak_f + 50),
    fontsize=12,
    arrowprops=dict(arrowstyle='->', color='red'),
    color='red'
)
ax.set_xlabel('Time (s)')
ax.set_ylabel('Force (N)')
ax.set_title('Isometric Force Pulse')
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-59",title:"Annotate a Peak Force",domain:"biomechanics",packages:["matplotlib"],description:"The force curve and the peak variables (`peak_t`, `peak_f`) are already set up. Add an annotation with an arrow pointing at the peak using `ax.annotate()`.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
t = np.linspace(0, 5, 200)
force = 800*(1-np.exp(-3*t))*np.exp(-0.3*t)
ax.plot(t, force, 'b-', linewidth=2)
peak_idx = np.argmax(force)
peak_t = t[peak_idx]
peak_f = force[peak_idx]`,testCode:`assert len(ax.texts) >= 1, "No annotation/text found on axes"
print("PASS")`,hints:['ax.annotate(text, xy=the_point, xytext=where_the_text_sits, arrowprops=dict(arrowstyle="->")).',`ax.annotate(f"Peak: {peak_f:.0f} N",
    xy=(peak_t, peak_f),
    xytext=(peak_t + 1, peak_f + 50),
    arrowprops=dict(arrowstyle="->", color="___"))`]},{type:"md",md:"## Horizontal and Vertical Reference Lines\n\n`ax.axhline(y=...)` draws a horizontal line spanning the full width. `ax.axhspan()` fills a horizontal band. These are perfect for marking training zones:\n\n```python\nax.axhline(y=150, color='orange', linestyle='--', alpha=0.7, label='Threshold')\nax.axhspan(150, 180, alpha=0.1, color='orange', label='Zone 3')\n```"},{type:"example",packages:["matplotlib"],caption:"Heart rate over a session with three zone boundaries marked.",code:`import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
time_min = np.linspace(0, 45, 300)
hr = 70 + 80*(1 - np.exp(-0.15*time_min)) + np.random.normal(0, 3, len(time_min))

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(time_min, hr, 'r-', linewidth=1.5, alpha=0.8)

ax.axhline(y=120, color='green',  linestyle='--', alpha=0.6, label='Zone 1/2 (120 bpm)')
ax.axhline(y=150, color='orange', linestyle='--', alpha=0.6, label='Zone 2/3 (150 bpm)')
ax.axhline(y=180, color='red',    linestyle='--', alpha=0.6, label='Zone 3/4 (180 bpm)')

ax.set_ylim(60, 200)
ax.set_xlabel('Time (min)', fontsize=13)
ax.set_ylabel('Heart Rate (bpm)', fontsize=13)
ax.set_title('Training Session Heart Rate')
ax.legend(loc='lower right', fontsize=9)
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-60",title:"HR Zones with axhline",domain:"physiology",packages:["matplotlib"],description:"The HR data is already plotted. Add horizontal reference lines at 120, 150, and 180 bpm, set the y-limits to (60, 200), and add a non-empty title plus axis labels.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
np.random.seed(42)
time_min = np.linspace(0,45,300)
hr = 70 + 80*(1-np.exp(-0.15*time_min)) + np.random.normal(0,3,len(time_min))
ax.plot(time_min, hr, 'r-', linewidth=1.5)`,testCode:`ylim = ax.get_ylim()
assert abs(ylim[0] - 60.0) < 0.1 and abs(ylim[1] - 200.0) < 0.1, f"ylim wrong: {ylim}"
assert ax.get_title() != "", "Missing title"
print("PASS")`,hints:["ax.axhline(y=...) draws each zone line across the full width; then set_ylim and the labels.",`ax.axhline(y=120, color="green", linestyle="--")
ax.axhline(y=150, color="orange", linestyle="--")
ax.axhline(y=___, color="red", linestyle="--")
ax.set_ylim(60, 200)
ax.set_title("Training Session Heart Rate")
ax.set_xlabel("Time (min)")
ax.set_ylabel("Heart Rate (bpm)")`]},{type:"md",md:"## Legends\n\n`ax.legend()` displays a legend for all plotted series that have a `label`. Control placement with the `loc` parameter:\n\n```python\nax.legend(loc='upper right', framealpha=0.9, fontsize=11)\n# Common loc values: 'upper left', 'lower right', 'best'\n```\n\nSaving figures for publication:\n\n```python\nfig.savefig('figure.png', dpi=300, bbox_inches='tight')   # 300 DPI PNG\nfig.savefig('figure.pdf', bbox_inches='tight')             # Vector PDF\n```"},{type:"example",packages:["matplotlib"],caption:'Three HR lines with a placed legend — loc="upper right" keeps it away from the data.',code:`import matplotlib.pyplot as plt
import numpy as np

t = np.linspace(0, 10, 100)

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(t, 150 + 20*np.sin(0.5*t), 'r-', linewidth=2, label='Athlete A')
ax.plot(t, 145 + 15*np.sin(0.5*t+1), 'b-', linewidth=2, label='Athlete B')
ax.plot(t, 155 + 25*np.sin(0.5*t+2), 'g-', linewidth=2, label='Athlete C')

ax.legend(loc='upper right', framealpha=0.9, edgecolor='gray', fontsize=11)
ax.set_xlabel('Time (min)')
ax.set_ylabel('Heart Rate (bpm)')
ax.set_title('Heart Rate During Training')`},{type:"exercise",id:"ex-5-61",title:"Legend Placement",domain:"coaching",packages:["matplotlib"],description:"The three athlete lines are already plotted with labels. Display the legend in the upper right with framealpha 0.9, and set the x-label, y-label, and a title.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
t = np.linspace(0,10,100)
ax.plot(t, 150+20*np.sin(0.5*t), 'r-', linewidth=2, label='Athlete A')
ax.plot(t, 145+15*np.sin(0.5*t+1), 'b-', linewidth=2, label='Athlete B')
ax.plot(t, 155+25*np.sin(0.5*t+2), 'g-', linewidth=2, label='Athlete C')`,testCode:`assert ax.get_legend() is not None, "No legend found"
assert len(ax.get_legend().texts) >= 3, "Legend should have at least 3 entries"
assert ax.get_xlabel() != "", "Missing xlabel"
assert ax.get_ylabel() != "", "Missing ylabel"
print("PASS")`,hints:["ax.legend(loc=..., framealpha=...) places the legend; the labels and title use set_*.",`ax.legend(loc="___", framealpha=0.9)
ax.set_xlabel("Time (min)")
ax.set_ylabel("Heart Rate (bpm)")
ax.set_title("Heart Rate During Training")`]},{type:"md",md:"## Summary\n\n| Customisation | Code |\n|--------------|------|\n| Figure size | `plt.subplots(figsize=(w, h))` |\n| Line color | `color='steelblue'` or `color='#3b82f6'` |\n| Line style | `linestyle='--'` / `'-'` / `':'` / `'-.'` |\n| Line width | `linewidth=2` |\n| Markers | `marker='o'`, `'s'`, `'^'`, `'D'` |\n| Axis limits | `ax.set_xlim(min, max)` / `ax.set_ylim()` |\n| Custom ticks | `ax.set_xticks([0, 2, 4, ...])` |\n| Annotation | `ax.annotate(text, xy=..., xytext=..., arrowprops=...)` |\n| Reference lines | `ax.axhline(y=...)`, `ax.axvline(x=...)` |\n| HR zone band | `ax.axhspan(y1, y2, alpha=0.1)` |\n| Font size | `fontsize=14` on set_xlabel, set_title, etc. |\n| Legend | `ax.legend(loc='upper right', framealpha=0.9)` |\n| Save | `fig.savefig('file.png', dpi=300, bbox_inches='tight')` |\n\nIn the next lesson, we combine several panels into one figure — dashboards, shared axes, error bars, and twin axes."}],quiz:null},"viz-subplots-advanced":{blocks:[{type:"md",md:`# Multiple Subplots and Advanced Features

## Why Subplots?

In sport science reporting, you often need to show related data side by side:

- Force-time AND velocity-time curves from the same jump
- Heart rate AND speed data from a training session
- Pre-test AND post-test comparisons
- Multiple athletes on the same dashboard

Matplotlib's \`subplots()\` function creates a grid of axes (individual plot panels) within a single figure.

## Creating a Basic Subplot Grid

\`plt.subplots(rows, cols)\` returns a figure and an array of axes:

\`\`\`python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))   # 1 row, 2 columns

axes[0].plot(t, force, 'b-')                       # left panel
axes[0].set_title('Force')

axes[1].plot(t, velocity, 'r-')                    # right panel
axes[1].set_title('Velocity')

plt.tight_layout()
\`\`\``},{type:"example",packages:["matplotlib"],caption:"Side-by-side jump analysis: GRF on the left, CoM velocity on the right.",code:`import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

t = np.linspace(0, 1, 200)
force = 2000 * np.sin(np.pi * t) ** 2

axes[0].plot(t, force, 'b-', linewidth=2)
axes[0].set_xlabel('Time (s)')
axes[0].set_ylabel('Force (N)')
axes[0].set_title('Ground Reaction Force')
axes[0].grid(True, alpha=0.3)

velocity = np.cumsum(force / 80) * (t[1] - t[0])
axes[1].plot(t, velocity, 'r-', linewidth=2)
axes[1].set_xlabel('Time (s)')
axes[1].set_ylabel('Velocity (m/s)')
axes[1].set_title('Center of Mass Velocity')
axes[1].grid(True, alpha=0.3)

plt.suptitle('Countermovement Jump Analysis', fontsize=14, fontweight='bold')
plt.tight_layout()`},{type:"exercise",id:"ex-5-62",title:"Side-by-Side Jump Analysis",domain:"biomechanics",packages:["matplotlib"],description:"Plot force on `axes[0]` with the title 'Ground Reaction Force' and velocity on `axes[1]` with the title 'Center of Mass Velocity'. Label the time axis on both panels.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
t = np.linspace(0, 1, 200)
force = 2000*np.sin(np.pi*t)**2
velocity = np.cumsum(force/80)*(t[1]-t[0])`,testCode:`assert len(fig.axes) == 2, f"Expected 2 axes, got {len(fig.axes)}"
assert len(fig.axes[0].lines) >= 1, "Nothing plotted on the left panel"
assert len(fig.axes[1].lines) >= 1, "Nothing plotted on the right panel"
assert fig.axes[0].get_title() == 'Ground Reaction Force', f"Left title wrong: {fig.axes[0].get_title()}"
assert fig.axes[1].get_title() == 'Center of Mass Velocity', f"Right title wrong: {fig.axes[1].get_title()}"
print("PASS")`,hints:["Index the axes array: axes[0] is the left panel, axes[1] the right. Each panel has its own set_title and set_xlabel.",`axes[0].plot(t, force, "b-")
axes[0].set_title("Ground Reaction Force")
axes[0].set_xlabel("Time (s)")
axes[1].plot(t, velocity, "r-")
axes[1].set_title("___")
axes[1].set_xlabel("Time (s)")`]},{type:"md",md:`## 2×2 Dashboard

For a 2×2 grid, \`axes\` becomes a 2D array indexed by \`[row, col]\`:

\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(...)   # top-left
axes[0, 1].plot(...)   # top-right
axes[1, 0].plot(...)   # bottom-left
axes[1, 1].bar(...)    # bottom-right

plt.suptitle('Dashboard', fontsize=14)
plt.tight_layout()
\`\`\``},{type:"example",packages:["matplotlib"],caption:"A 2×2 athlete weekly dashboard — HR, speed, distance, RPE.",code:`import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(10, 8))
np.random.seed(42)
time = np.linspace(0, 60, 300)

hr = 140 + 20*np.sin(0.3*time) + np.random.normal(0, 3, len(time))
axes[0, 0].plot(time, hr, 'r-', linewidth=1)
axes[0, 0].set_ylabel('HR (bpm)')
axes[0, 0].set_title('Heart Rate')
axes[0, 0].grid(True, alpha=0.3)

speed = np.clip(4 + 2*np.sin(0.3*time) + np.random.normal(0,0.3,len(time)), 0, None)
axes[0, 1].plot(time, speed, 'b-', linewidth=1)
axes[0, 1].set_ylabel('Speed (m/s)')
axes[0, 1].set_title('Running Speed')
axes[0, 1].grid(True, alpha=0.3)

distance = np.cumsum(speed) * (time[1] - time[0])
axes[1, 0].plot(time, distance/1000, 'g-', linewidth=2)
axes[1, 0].set_xlabel('Time (min)')
axes[1, 0].set_ylabel('Distance (km)')
axes[1, 0].set_title('Cumulative Distance')
axes[1, 0].grid(True, alpha=0.3)

sessions = ['Mon','Tue','Wed','Thu','Fri']
rpe = [6, 8, 4, 7, 9]
colors = ['green' if r<=5 else 'orange' if r<=7 else 'red' for r in rpe]
axes[1, 1].bar(sessions, rpe, color=colors)
axes[1, 1].set_ylabel('RPE')
axes[1, 1].set_title('Weekly RPE')
axes[1, 1].set_ylim(0, 10)

plt.suptitle('Athlete Weekly Dashboard', fontsize=14, fontweight='bold')
plt.tight_layout()`},{type:"exercise",id:"ex-5-63",title:"2×2 Athlete Dashboard",domain:"coaching",packages:["matplotlib"],description:`Build the four-panel dashboard from the prepared data:
1. Top-left: hr as a line.
2. Top-right: speed as a line.
3. Bottom-left: distance in km as a line.
4. Bottom-right: the weekly rpe as a bar chart.
Give each panel a title.`,initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(10, 8))
np.random.seed(42)
time = np.linspace(0, 60, 300)
hr = 140 + 20*np.sin(0.3*time) + np.random.normal(0, 3, len(time))
speed = np.clip(4 + 2*np.sin(0.3*time) + np.random.normal(0, 0.3, len(time)), 0, None)
distance = np.cumsum(speed) * (time[1] - time[0])
sessions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
rpe = [6, 8, 4, 7, 9]`,testCode:`assert len(fig.axes) == 4, f"Expected 4 axes, got {len(fig.axes)}"
assert len(fig.axes[0].lines) >= 1, "Nothing plotted top-left"
assert len(fig.axes[1].lines) >= 1, "Nothing plotted top-right"
assert len(fig.axes[2].lines) >= 1, "Nothing plotted bottom-left"
assert len(fig.axes[3].patches) >= 5, "No RPE bars bottom-right"
print("PASS")`,hints:["A 2x2 grid is indexed axes[row, col]: [0,0] is top-left, [1,1] is bottom-right.",`axes[0, 0].plot(time, hr, "r-")
axes[0, 0].set_title("Heart Rate")
axes[0, 1].plot(time, speed, "b-")
axes[0, 1].set_title("Running Speed")
axes[1, 0].plot(time, distance / 1000, "g-")
axes[1, 0].set_title("Cumulative Distance")
axes[1, 1].bar(sessions, ___)
axes[1, 1].set_title("Weekly RPE")`]},{type:"md",md:"## Shared Axes\n\nUse `sharex=True` (or `sharey=True`) to link axes — zooming one panel zooms the other. Only the bottom panel needs an x-label:\n\n```python\nfig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6), sharex=True)\n\nax1.plot(t, hr, 'r-')\nax2.plot(t, speed, 'b-')\nax2.set_xlabel('Time (min)')   # only bottom panel needs x-label\n```"},{type:"example",packages:["matplotlib"],caption:"HR and speed with a shared x-axis — the panels always align in time.",code:`import matplotlib.pyplot as plt
import numpy as np

t = np.linspace(0, 60, 600)
np.random.seed(42)
hr = 140 + 20*np.sin(0.3*t) + np.random.normal(0, 2, len(t))
speed = 4 + 2*np.sin(0.3*t) + np.random.normal(0, 0.2, len(t))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6), sharex=True)

ax1.plot(t, hr, 'r-', linewidth=1)
ax1.set_ylabel('Heart Rate (bpm)')
ax1.set_title('Heart Rate')
ax1.grid(True, alpha=0.3)

ax2.plot(t, speed, 'b-', linewidth=1)
ax2.set_ylabel('Speed (m/s)')
ax2.set_xlabel('Time (min)')
ax2.set_title('Running Speed')
ax2.grid(True, alpha=0.3)

plt.suptitle('Training Session: HR and Speed', fontsize=14, fontweight='bold')
plt.tight_layout()`},{type:"exercise",id:"ex-5-64",title:"Shared X-Axis HR and Speed",domain:"physiology",packages:["matplotlib"],description:"Plot `hr` on `ax1` and `speed` on `ax2` (the shared x-axis is already set up). Label each y-axis, and put the x-label on the bottom panel only.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

t = np.linspace(0, 60, 600)
np.random.seed(42)
hr = 140+20*np.sin(0.3*t)+np.random.normal(0,2,len(t))
speed = 4+2*np.sin(0.3*t)+np.random.normal(0,0.2,len(t))
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10,6), sharex=True)`,testCode:`assert len(fig.axes) == 2, f"Expected 2 axes, got {len(fig.axes)}"
assert len(ax1.lines) >= 1, "No line on ax1"
assert len(ax2.lines) >= 1, "No line on ax2"
print("PASS")`,hints:["ax1 and ax2 are separate panels that share the x-axis; plot one series on each.",`ax1.plot(t, hr, "r-")
ax1.set_ylabel("Heart Rate (bpm)")
ax2.plot(t, ___, "b-")
ax2.set_ylabel("Speed (m/s)")
ax2.set_xlabel("Time (min)")`]},{type:"md",md:"## Error Bars\n\nError bars show variability (standard deviation, standard error, confidence intervals). Pass `yerr` to `ax.bar()` or `ax.errorbar()`:\n\n```python\nax.bar(positions, mean_sprint, yerr=std_sprint, capsize=5,\n       color='steelblue', edgecolor='black')\n```\n\n`capsize` controls the width of the horizontal caps at the ends of each error bar."},{type:"example",packages:["matplotlib"],caption:"Mean sprint time per position with ±1 SD error bars.",code:`import matplotlib.pyplot as plt

positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper']
mean_sprint = [1.73, 1.79, 1.81, 1.89]
std_sprint   = [0.04, 0.05, 0.03, 0.06]

fig, ax = plt.subplots(figsize=(8, 5))
ax.bar(positions, mean_sprint, yerr=std_sprint, capsize=5,
       color=['#3b82f6','#8b5cf6','#ef4444','#f59e0b'],
       edgecolor='black', linewidth=0.5)
ax.set_ylabel('10m Sprint Time (s)')
ax.set_title('Sprint Performance by Position (Mean ± SD)')
ax.set_ylim(1.5, 2.1)
ax.grid(axis='y', alpha=0.3)`},{type:"exercise",id:"ex-5-65",title:"Error Bars: Sprint by Position",domain:"coaching",packages:["matplotlib"],description:"Create a bar chart of the mean sprint times with ±1 SD error bars on `ax`, using `yerr` and `capsize=5`.",initialCode:`import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8,5))
positions = ['Forward','Midfielder','Defender','Goalkeeper']
mean_sprint = [1.73, 1.79, 1.81, 1.89]
std_sprint = [0.04, 0.05, 0.03, 0.06]`,testCode:`assert len(ax.patches) == 4, f"Expected 4 bars, got {len(ax.patches)}"
print("PASS")`,hints:["yerr= adds the vertical error bars; capsize sets the width of the caps at their ends.","ax.bar(positions, mean_sprint, yerr=___, capsize=5)"]},{type:"md",md:"## Fill Between (SD Bands)\n\n`ax.fill_between()` shades the area between two curves. Use it to visualise ±1 SD around a mean line:\n\n```python\nax.plot(weeks, mean_load, 'b-o', linewidth=2, label='Mean')\nax.fill_between(weeks, mean_load - std_load, mean_load + std_load,\n                alpha=0.2, color='blue', label='±1 SD')\n```"},{type:"example",packages:["matplotlib"],caption:"Weekly training load with a shaded ±1 SD band.",code:`import matplotlib.pyplot as plt
import numpy as np

weeks = np.arange(1, 9)
mean_load = np.array([2200,2400,2600,2500,2800,3000,2700,2900])
std_load  = np.array([300, 350, 400, 280, 420, 380, 350, 310])

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(weeks, mean_load, 'b-o', linewidth=2, markersize=6, label='Mean')
ax.fill_between(weeks, mean_load - std_load, mean_load + std_load,
                alpha=0.2, color='blue', label='±1 SD')
ax.set_xlabel('Week')
ax.set_ylabel('sRPE Load (AU)')
ax.set_title('Weekly Training Load Progression')
ax.legend()
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-66",title:"Fill Between: Training Load SD Band",domain:"physiology",packages:["matplotlib"],description:"Plot the mean load line, then shade a ±1 SD band around it with `ax.fill_between()` and a low alpha. Add a legend.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(figsize=(8,5))
weeks = np.arange(1, 9)
mean_load = np.array([2200,2400,2600,2500,2800,3000,2700,2900])
std_load = np.array([300,350,400,280,420,380,350,310])`,testCode:`assert len(ax.lines) >= 1, "No line plotted"
assert len(ax.collections) >= 1, "No fill_between found"
print("PASS")`,hints:["Plot the mean line first, then fill between mean - std and mean + std.",`ax.plot(weeks, mean_load, "b-o", label="Mean")
ax.fill_between(weeks, mean_load - std_load, mean_load + ___,
                alpha=0.2, color="blue", label="±1 SD")
ax.legend()`]},{type:"md",md:`## Annotated Force-Time Curves

Biomechanics figures often need multiple simultaneous annotations: a peak marker, an onset marker, and a shaded rate-of-force-development (RFD) window.

Key tools:
- \`ax.plot(t[peak_idx], force[peak_idx], 'rv', markersize=12)\` — triangle at peak
- \`ax.annotate(..., arrowprops=dict(arrowstyle='->', color='red'))\` — arrow annotation
- \`ax.axvspan(t_start, t_end, alpha=0.15, color='orange')\` — shaded window`},{type:"example",packages:["matplotlib"],caption:"Full annotated isometric force-time curve with peak, onset, and RFD window.",code:`import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
t = np.linspace(0, 3, 600)
force = np.where(t < 0.5, 20,
        20 + 800*(1 - np.exp(-5*(t-0.5)))) * (t >= 0.5).astype(float) + 20
force = np.minimum(force, 750)
force += np.random.normal(0, 5, len(force))

fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(t, force, 'b-', linewidth=1.5)

peak_idx = np.argmax(force)
ax.plot(t[peak_idx], force[peak_idx], 'rv', markersize=12)
ax.annotate(f'Peak: {force[peak_idx]:.0f} N',
            xy=(t[peak_idx], force[peak_idx]),
            xytext=(t[peak_idx]+0.3, force[peak_idx]+30),
            fontsize=11, color='red',
            arrowprops=dict(arrowstyle='->', color='red', lw=1.5))

threshold = 50
onset_idx = np.where(force > threshold)[0][0]
ax.plot(t[onset_idx], force[onset_idx], 'go', markersize=10)
ax.annotate(f'Onset: {t[onset_idx]:.3f} s',
            xy=(t[onset_idx], force[onset_idx]),
            xytext=(t[onset_idx]-0.5, force[onset_idx]+100),
            fontsize=11, color='green',
            arrowprops=dict(arrowstyle='->', color='green', lw=1.5))

t_start = t[onset_idx]
ax.axvspan(t_start, t_start+0.2, alpha=0.15, color='orange', label='RTD window (0-200ms)')

ax.set_xlabel('Time (s)', fontsize=13)
ax.set_ylabel('Force (N)', fontsize=13)
ax.set_title('Isometric Force-Time Curve with Annotations', fontsize=14, fontweight='bold')
ax.legend(loc='lower right', fontsize=11)
ax.grid(True, alpha=0.3)
ax.set_xlim(0, 3)`},{type:"exercise",id:"ex-5-67",title:"Annotated Force-Time Curve",domain:"biomechanics",packages:["matplotlib"],description:`The force curve is plotted and peak_idx / onset_idx are computed. Add:
1. A red triangle marker at the peak, with an arrow annotation.
2. A green circle at the onset, with an arrow annotation.
3. An axvspan shading the 200 ms RTD window from the onset.`,initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(figsize=(10,6))
np.random.seed(42)
t = np.linspace(0, 3, 600)
force = np.where(t < 0.5, 10, 10 + 700*(1-np.exp(-6*(t-0.5))))*(t>=0.5).astype(float)+10
force = np.minimum(force, 650)
force += np.random.normal(0, 5, len(force))
ax.plot(t, force, 'b-', linewidth=1.5)
peak_idx = np.argmax(force)
onset_idx = np.where(force > 50)[0][0]`,testCode:`assert len(ax.texts) >= 2, "Expected two annotations (peak and onset)"
assert len(ax.patches) >= 1, "No axvspan window found"
print("PASS")`,hints:['Three tools: ax.plot on a single point ("rv" / "go") for the markers, ax.annotate with arrowprops for the arrows, ax.axvspan for the shaded window.',`ax.plot(t[peak_idx], force[peak_idx], "rv", markersize=12)
ax.annotate(f"Peak: {force[peak_idx]:.0f} N",
    xy=(t[peak_idx], force[peak_idx]),
    xytext=(t[peak_idx] + 0.3, force[peak_idx] + 30),
    arrowprops=dict(arrowstyle="->", color="red"))
ax.plot(t[onset_idx], force[onset_idx], "go", markersize=10)
ax.annotate(f"Onset: {t[onset_idx]:.3f} s",
    xy=(t[onset_idx], force[onset_idx]),
    xytext=(t[onset_idx] - 0.5, force[onset_idx] + 100),
    arrowprops=dict(arrowstyle="->", color="green"))
ax.axvspan(t[onset_idx], t[onset_idx] + ___, alpha=0.15, color="orange")`]},{type:"md",md:`## Twin Axes

When two variables have different units but share a time axis, use \`ax1.twinx()\` to create a second y-axis on the right:

\`\`\`python
fig, ax1 = plt.subplots(figsize=(9, 5))
ax1.bar(weeks, load, color='steelblue', alpha=0.7, label='Load')
ax1.set_ylabel('sRPE Load (AU)', color='steelblue')

ax2 = ax1.twinx()                          # shares x-axis, right y-axis
ax2.plot(weeks, rpe, 'ro-', linewidth=2, label='Avg RPE')
ax2.set_ylabel('Average RPE (0-10)', color='red')
\`\`\`

Colour-match the y-axis labels and tick marks to each series to make the two scales clear.`},{type:"example",packages:["matplotlib"],caption:"Load bars (left y-axis) + average RPE line (right y-axis) on one figure.",code:`import matplotlib.pyplot as plt
import numpy as np

weeks = np.arange(1, 9)
load = np.array([2200,2400,2600,2500,2800,3000,2700,2900])
rpe = np.array([5.2,5.5,6.1,5.9,6.8,7.2,6.3,6.7])

fig, ax1 = plt.subplots(figsize=(9, 5))
ax1.bar(weeks, load, color='steelblue', alpha=0.7, label='Load')
ax1.set_xlabel('Week', fontsize=12)
ax1.set_ylabel('sRPE Load (AU)', fontsize=12, color='steelblue')
ax1.tick_params(axis='y', labelcolor='steelblue')

ax2 = ax1.twinx()
ax2.plot(weeks, rpe, 'ro-', linewidth=2, markersize=8, label='Avg RPE')
ax2.set_ylabel('Average RPE (0-10)', fontsize=12, color='red')
ax2.tick_params(axis='y', labelcolor='red')
ax2.axhline(y=7, color='red', linestyle='--', alpha=0.5)

ax1.set_title('Training Load and Average RPE', fontsize=13, fontweight='bold')
ax1.legend(loc='upper left')
ax2.legend(loc='upper right')`},{type:"exercise",id:"ex-5-68",title:"Twin Axes: Load and RPE",domain:"coaching",packages:["matplotlib"],description:"Create a twin-axes figure: bars of the weekly load on `ax1`, then a second y-axis with `ax1.twinx()` carrying the average RPE as a red line with circle markers.",initialCode:`import matplotlib.pyplot as plt
import numpy as np

fig, ax1 = plt.subplots(figsize=(9,5))
weeks = np.arange(1,9)
load = np.array([2200,2400,2600,2500,2800,3000,2700,2900])
rpe = np.array([5.2,5.5,6.1,5.9,6.8,7.2,6.3,6.7])`,testCode:`assert len(fig.axes) == 2, f"Expected 2 axes (primary + twin), got {len(fig.axes)}"
assert len(fig.axes[0].patches) >= 8, "No load bars on the primary axis"
assert len(fig.axes[1].lines) >= 1, "No RPE line on the twin axis"
print("PASS")`,hints:["ax1.bar draws the load; ax1.twinx() creates the right-hand axis that shares x but has its own y scale.",`ax1.bar(weeks, load, color="steelblue", alpha=0.7)
ax1.set_ylabel("sRPE Load (AU)", color="steelblue")
ax2 = ax1.___()
ax2.plot(weeks, rpe, "ro-")
ax2.set_ylabel("Average RPE (0-10)", color="red")`]},{type:"md",md:"## Summary\n\n| Task | Code |\n|------|------|\n| Create 1×2 grid | `fig, axes = plt.subplots(1, 2, figsize=(12, 5))` |\n| Create 2×2 grid | `fig, axes = plt.subplots(2, 2, figsize=(10, 8))` |\n| Access panel (2D) | `axes[row, col]` |\n| Access panel (1D) | `axes[i]` |\n| Share x-axis | `plt.subplots(2, 1, sharex=True)` |\n| Overall title | `plt.suptitle('Title')` |\n| Panel label (a,b,c) | `ax.text(0.02, 0.95, '(a)', transform=ax.transAxes)` |\n| Error bars | `ax.bar(x, y, yerr=err, capsize=5)` |\n| SD band | `ax.fill_between(x, y-err, y+err, alpha=0.2)` |\n| Annotation | `ax.annotate(text, xy=..., arrowprops={...})` |\n| Shaded region | `ax.axvspan(x1, x2, alpha=0.15)` |\n| Twin y-axis | `ax2 = ax1.twinx()` |\n| Prevent overlap | `plt.tight_layout()` |\n\nIn the next lesson, we plot straight from DataFrames — pandas' .plot() shortcut for everyday figures."}],quiz:null},"viz-dataframes":{blocks:[{type:"md",md:`# Plotting from DataFrames

## Pandas + Matplotlib Integration

Pandas has built-in plotting methods that use Matplotlib under the hood. This makes it very convenient to go from data analysis directly to visualisation without manually extracting arrays.

## The .plot() Method

Every Pandas DataFrame and Series has a \`.plot()\` method. The key pattern is to pass \`ax=\` to direct the plot into a specific Matplotlib axes object:

\`\`\`python
fig, ax = plt.subplots()
df.plot(ax=ax, linewidth=2, marker='o')   # plots all columns as lines
\`\`\`

Pandas automatically uses the DataFrame index as the x-axis, column names as legend labels, and assigns different colours.`},{type:"example",packages:["matplotlib","pandas"],caption:"Weekly training load for 3 athletes — one df.plot() call draws all lines.",code:`import pandas as pd
import matplotlib.pyplot as plt
import io

csv_data = """Week,Oda,Erik,Maja
1,2200,1800,2100
2,2400,2000,2300
3,2600,2200,2500
4,2500,2100,2200
5,2800,2400,2600
6,3000,2500,2800
7,2700,2300,2500
8,2900,2600,2700"""

df = pd.read_csv(io.StringIO(csv_data), index_col='Week')

fig, ax = plt.subplots(figsize=(8, 5))
df.plot(ax=ax, linewidth=2, marker='o')
ax.set_ylabel('sRPE Load (AU)')
ax.set_title('Weekly Training Load by Athlete')
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-69",title:"Line Plot from DataFrame",domain:"coaching",packages:["matplotlib","pandas"],description:"Load the CSV into a DataFrame with `Week` as the index, then plot all three athlete columns as lines with markers on `ax` using `df.plot`.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt
import io

fig, ax = plt.subplots(figsize=(8,5))
csv_data = """Week,Oda,Erik,Maja
1,2200,1800,2100
2,2400,2000,2300
3,2600,2200,2500
4,2500,2100,2200
5,2800,2400,2600
6,3000,2500,2800
7,2700,2300,2500
8,2900,2600,2700"""`,testCode:`assert len(ax.lines) >= 3, f"Expected at least 3 lines (one per athlete), got {len(ax.lines)}"
print("PASS")`,hints:['io.StringIO(csv_data) makes the string readable by pd.read_csv; index_col="Week" puts the weeks on the x-axis.',`df = pd.read_csv(io.StringIO(csv_data), index_col="___")
df.plot(ax=ax, linewidth=2, marker="o")`]},{type:"md",md:"## Bar Chart from DataFrame\n\nUse `df.plot(kind='bar', ax=ax)` to create vertical bars. Selecting a single column produces a simple bar chart:\n\n```python\ndf[['Sprint_10m']].plot(kind='bar', ax=ax, color='steelblue', legend=False)\n```\n\nSelecting multiple columns automatically creates **grouped bars** — Pandas handles the offset logic for you."},{type:"example",packages:["matplotlib","pandas"],caption:"Sprint time bar chart — one column, four bars.",code:`import pandas as pd
import matplotlib.pyplot as plt
import io

csv_data = """Position,Sprint_10m,CMJ_cm,VO2max
Forward,1.73,34.4,52.4
Midfielder,1.79,37.4,49.6
Defender,1.81,35.2,50.7
Goalkeeper,1.89,40.3,45.2"""

df = pd.read_csv(io.StringIO(csv_data), index_col='Position')

fig, ax = plt.subplots(figsize=(8, 5))
df[['Sprint_10m']].plot(kind='bar', ax=ax, color='steelblue', legend=False)
ax.set_ylabel('Time (s)')
ax.set_title('Mean Sprint Time by Position')
ax.tick_params(axis='x', rotation=0)
ax.grid(axis='y', alpha=0.3)`},{type:"exercise",id:"ex-5-70",title:"Bar Chart from DataFrame",domain:"physiology",packages:["matplotlib","pandas"],description:'Load the position CSV with `Position` as the index, then draw a bar chart of the `Sprint_10m` column (4 bars) on `ax` using `df.plot` with kind="bar".',initialCode:`import pandas as pd
import matplotlib.pyplot as plt
import io

fig, ax = plt.subplots(figsize=(8,5))
csv_data = """Position,Sprint_10m,CMJ_cm,VO2max
Forward,1.73,34.4,52.4
Midfielder,1.79,37.4,49.6
Defender,1.81,35.2,50.7
Goalkeeper,1.89,40.3,45.2"""`,testCode:`assert len(ax.patches) == 4, f"Expected 4 bars, got {len(ax.patches)}"
print("PASS")`,hints:['Select the column as a one-column DataFrame with double brackets, then .plot(kind="bar", ax=ax).',`df = pd.read_csv(io.StringIO(csv_data), index_col="Position")
df[["Sprint_10m"]].plot(kind="___", ax=ax, color="steelblue", legend=False)`]},{type:"md",md:"## Grouped Bar Chart\n\nWhen the DataFrame has multiple columns and you call `.plot(kind='bar')`, Pandas draws grouped bars automatically — one group per row, one bar per column.\n\n```python\ndf.plot(kind='bar', ax=ax, color=['#94a3b8', '#3b82f6'])\nax.legend(['Pre-season', 'Post-season'])\nax.tick_params(axis='x', rotation=0)\n```"},{type:"example",packages:["matplotlib","pandas"],caption:"Pre/Post sprint comparison — two columns produce automatically grouped bars.",code:`import pandas as pd
import matplotlib.pyplot as plt
import io

csv_data = """Position,Pre_Sprint,Post_Sprint
Forward,1.75,1.71
Midfielder,1.80,1.76
Defender,1.82,1.79
Goalkeeper,1.91,1.87"""

df = pd.read_csv(io.StringIO(csv_data), index_col='Position')

fig, ax = plt.subplots(figsize=(8, 5))
df.plot(kind='bar', ax=ax, color=['#94a3b8', '#3b82f6'])
ax.set_ylabel('10m Sprint Time (s)')
ax.set_title('Sprint Performance: Pre vs. Post')
ax.tick_params(axis='x', rotation=0)
ax.legend(['Pre-season', 'Post-season'])
ax.grid(axis='y', alpha=0.3)`},{type:"exercise",id:"ex-5-71",title:"Grouped Bar from DataFrame",domain:"coaching",packages:["matplotlib","pandas"],description:'Load the Pre/Post sprint CSV with `Position` as the index, then call `df.plot` with kind="bar" so the two columns produce grouped bars -- 8 bars in total (4 positions × 2 time points).',initialCode:`import pandas as pd
import matplotlib.pyplot as plt
import io

fig, ax = plt.subplots(figsize=(8,5))
csv_data = """Position,Pre_Sprint,Post_Sprint
Forward,1.75,1.71
Midfielder,1.80,1.76
Defender,1.82,1.79
Goalkeeper,1.91,1.87"""`,testCode:`assert len(ax.patches) == 8, f"Expected 8 bars (4 positions x 2 periods), got {len(ax.patches)}"
print("PASS")`,hints:['With multiple columns, kind="bar" groups the bars automatically -- no offset maths needed.',`df = pd.read_csv(io.StringIO(csv_data), index_col="Position")
df.plot(kind="bar", ax=___)`]},{type:"md",md:"## Scatter from DataFrame\n\n`df.plot(kind='scatter', x='col1', y='col2', ax=ax)` creates a scatter plot. Adding `c='col3'` colours points by a third variable:\n\n```python\ndf.plot(kind='scatter', x='Sprint_10m', y='CMJ_cm',\n        c='VO2max', cmap='RdYlGn_r', s=80, ax=ax, edgecolors='black')\n```"},{type:"example",packages:["matplotlib","pandas"],caption:"Sprint vs CMJ scatter, coloured by VO2max — three variables in one plot.",code:`import pandas as pd
import matplotlib.pyplot as plt
import io

csv_data = """Name,Sprint_10m,CMJ_cm,VO2max
Oda,1.72,35.2,52.3
Erik,1.81,38.1,48.7
Maja,1.78,32.5,54.1
Lars,1.89,40.3,45.2
Sigrid,1.74,33.8,51.8
Kari,1.76,36.7,50.5
Nils,1.83,37.9,47.3
Ingrid,1.73,34.1,53.2"""

df = pd.read_csv(io.StringIO(csv_data))

fig, ax = plt.subplots(figsize=(8, 6))
df.plot(kind='scatter', x='Sprint_10m', y='CMJ_cm',
        c='VO2max', cmap='RdYlGn_r', s=80, ax=ax,
        edgecolors='black', linewidth=0.5)
ax.set_xlabel('10m Sprint (s)')
ax.set_ylabel('CMJ Height (cm)')
ax.set_title('Sprint vs. Jump (colored by VO2max)')
ax.grid(True, alpha=0.3)`},{type:"exercise",id:"ex-5-72",title:"Scatter from DataFrame",domain:"physiology",packages:["matplotlib","pandas"],description:'Load the athlete CSV, then create a scatter of `Sprint_10m` (x) against `CMJ_cm` (y) on `ax` using `df.plot` with kind="scatter".',initialCode:`import pandas as pd
import matplotlib.pyplot as plt
import io

fig, ax = plt.subplots(figsize=(8,6))
csv_data = """Name,Sprint_10m,CMJ_cm,VO2max
Oda,1.72,35.2,52.3
Erik,1.81,38.1,48.7
Maja,1.78,32.5,54.1
Lars,1.89,40.3,45.2
Sigrid,1.74,33.8,51.8
Kari,1.76,36.7,50.5
Nils,1.83,37.9,47.3
Ingrid,1.73,34.1,53.2"""`,testCode:`assert len(ax.collections) >= 1, "No scatter plot collections found"
print("PASS")`,hints:['kind="scatter" needs explicit x= and y= column names.',`df = pd.read_csv(io.StringIO(csv_data))
df.plot(kind="scatter", x="Sprint_10m", y="___", ax=ax, s=80)`]},{type:"md",md:`## Box Plot from DataFrame

\`df.plot(kind='box', ax=ax)\` draws side-by-side box plots for every column. Perfect for comparing load distributions across athletes:

\`\`\`python
import numpy as np

data = {
    'Oda':  np.random.normal(2400, 300, 20),
    'Erik': np.random.normal(2100, 350, 20),
}
df = pd.DataFrame(data)
df.plot(kind='box', ax=ax)
\`\`\``},{type:"example",packages:["matplotlib","pandas"],caption:"Box plots of weekly load for three athletes from a DataFrame.",code:`import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
data = {
    'Oda':  np.random.normal(2400, 300, 20),
    'Erik': np.random.normal(2100, 350, 20),
    'Maja': np.random.normal(2300, 250, 20),
}
df = pd.DataFrame(data)

fig, ax = plt.subplots(figsize=(7, 5))
df.plot(kind='box', ax=ax)
ax.set_ylabel('Weekly sRPE Load (AU)')
ax.set_title('Training Load Distribution by Athlete')
ax.grid(axis='y', alpha=0.3)`},{type:"exercise",id:"ex-5-73",title:"Box Plot from DataFrame",domain:"psychology",packages:["matplotlib","pandas"],description:"The DataFrame with 20 weekly load values for each of 3 athletes is built for you. Draw side-by-side box plots -- one per athlete -- on `ax` using `df.plot`.",initialCode:`import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(figsize=(7,5))
np.random.seed(42)
data = {
    'Oda':  np.random.normal(2400, 300, 20),
    'Erik': np.random.normal(2100, 350, 20),
    'Maja': np.random.normal(2300, 250, 20),
}
df = pd.DataFrame(data)`,testCode:`assert len(ax.lines) >= 1, "No box plot lines found"
print("PASS")`,hints:['kind="box" draws one box per column of the DataFrame.','df.plot(kind="___", ax=ax)']},{type:"md",md:`## Team Dashboard from DataFrame

Combine everything: use \`df.plot(ax=axes[r,c])\` to direct each plot into a specific panel of a 2×2 grid.

\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(12, 9))

df.set_index('Name')['Sprint_10m'].plot(kind='bar', ax=axes[0, 0], color='steelblue')
df.set_index('Name')['VO2max'].plot(kind='barh', ax=axes[0, 1], color='coral')
df.set_index('Name')['Training_Load'].plot(kind='bar', ax=axes[1, 0], color='seagreen')
df.plot(kind='scatter', x='Sprint_10m', y='VO2max', ax=axes[1, 1], s=80, c='steelblue', edgecolors='black')
\`\`\``},{type:"example",packages:["matplotlib","pandas"],caption:"Full team dashboard — four Pandas plots directed to four panels.",code:`import pandas as pd
import matplotlib.pyplot as plt
import io

csv_data = """Name,Position,Sprint_10m,CMJ_cm,VO2max,Training_Load
Oda,Forward,1.72,35.2,52.3,2800
Erik,Midfielder,1.81,38.1,48.7,2400
Maja,Defender,1.78,32.5,54.1,2600
Lars,Goalkeeper,1.89,40.3,45.2,2100
Sigrid,Forward,1.74,33.8,51.8,2700"""

df = pd.read_csv(io.StringIO(csv_data))
fig, axes = plt.subplots(2, 2, figsize=(12, 9))

df.set_index('Name')['Sprint_10m'].plot(kind='bar', ax=axes[0,0], color='steelblue')
axes[0,0].set_title('10m Sprint Time')
axes[0,0].set_ylabel('Time (s)')
axes[0,0].tick_params(axis='x', rotation=0)

df.set_index('Name')['VO2max'].plot(kind='barh', ax=axes[0,1], color='coral')
axes[0,1].set_title('VO2max')
axes[0,1].set_xlabel('ml/kg/min')

df.set_index('Name')['Training_Load'].plot(kind='bar', ax=axes[1,0], color='seagreen')
axes[1,0].set_title('Weekly Training Load')
axes[1,0].set_ylabel('sRPE (AU)')
axes[1,0].tick_params(axis='x', rotation=0)

df.plot(kind='scatter', x='Sprint_10m', y='VO2max', ax=axes[1,1],
        s=80, c='Training_Load', cmap='YlOrRd', edgecolors='black')
axes[1,1].set_title('Sprint vs. VO2max')

plt.suptitle('Team Performance Dashboard', fontsize=15, fontweight='bold')
plt.tight_layout()`},{type:"exercise",id:"ex-5-74",title:"Team Dashboard from DataFrame",domain:"coaching",packages:["matplotlib","pandas"],description:`Complete the 2x2 team dashboard:
1. Top-left: Sprint_10m bars.
2. Top-right: VO2max horizontal bars.
3. Bottom-left: Training_Load bars.
4. Bottom-right: a Sprint_10m vs VO2max scatter.
Give each panel a title.`,initialCode:`import pandas as pd
import matplotlib.pyplot as plt
import io

fig, axes = plt.subplots(2, 2, figsize=(12,9))
csv_data = """Name,Position,Sprint_10m,CMJ_cm,VO2max,Training_Load
Oda,Forward,1.72,35.2,52.3,2800
Erik,Midfielder,1.81,38.1,48.7,2400
Maja,Defender,1.78,32.5,54.1,2600
Lars,Goalkeeper,1.89,40.3,45.2,2100
Sigrid,Forward,1.74,33.8,51.8,2700"""
df = pd.read_csv(io.StringIO(csv_data))`,testCode:`assert len(fig.axes) == 4, f"Expected 4 axes, got {len(fig.axes)}"
assert len(fig.axes[0].patches) >= 5, "No bars in the top-left panel"
assert len(fig.axes[1].patches) >= 5, "No bars in the top-right panel"
assert len(fig.axes[2].patches) >= 5, "No bars in the bottom-left panel"
assert len(fig.axes[3].collections) >= 1, "No scatter in the bottom-right panel"
print("PASS")`,hints:['For the bar panels, set_index("Name") first and select the column; each call takes ax=axes[row, col].',`df.set_index("Name")["Sprint_10m"].plot(kind="bar", ax=axes[0, 0], color="steelblue")
axes[0, 0].set_title("10m Sprint Time")
df.set_index("Name")["VO2max"].plot(kind="barh", ax=axes[0, 1], color="coral")
axes[0, 1].set_title("VO2max")
df.set_index("Name")["Training_Load"].plot(kind="bar", ax=axes[1, 0], color="seagreen")
axes[1, 0].set_title("Weekly Training Load")
df.plot(kind="scatter", x="Sprint_10m", y="___", ax=axes[1, 1], s=80)
axes[1, 1].set_title("Sprint vs. VO2max")`]},{type:"md",md:"## Summary\n\n| Pandas Plot | Code |\n|-------------|------|\n| Line plot | `df.plot(ax=ax)` or `df.plot(kind='line', ax=ax)` |\n| Bar chart | `df.plot(kind='bar', ax=ax)` |\n| Horizontal bar | `df.plot(kind='barh', ax=ax)` |\n| Box plot | `df.plot(kind='box', ax=ax)` |\n| Scatter plot | `df.plot(kind='scatter', x='c1', y='c2', ax=ax)` |\n| Histogram | `df['col'].plot(kind='hist', ax=ax)` |\n| Target subplot | Pass `ax=axes[row, col]` |\n\n> **Tip**: Use Pandas `.plot()` for quick exploration and standard plots. Switch to the Matplotlib object-oriented API when you need fine-grained control over annotations, twin axes, or complex layouts.\n\nThat completes Module 5. In the next module, we move from describing data to testing hypotheses — statistics for sport science."}],quiz:{id:"quiz-5-7",title:"Module 5 Quiz: Data Visualization",questions:[{id:"q1",type:"multiple-choice",question:"Which plot type is best for showing how a variable changes over time (e.g., heart rate during exercise)?",options:[{value:"a",label:"Bar chart"},{value:"b",label:"Line plot"},{value:"c",label:"Scatter plot"},{value:"d",label:"Histogram"}],correctAnswer:"b",explanation:"Line plots connect data points in order, making them ideal for time series data. The x-axis represents time, and the connected line shows trends and patterns over that time period."},{id:"q2",type:"multiple-choice",question:"What does plt.subplots(2, 3) create?",options:[{value:"a",label:"2 figures, each with 3 plots"},{value:"b",label:"A single figure with 6 subplot panels arranged in 2 rows and 3 columns"},{value:"c",label:"5 subplot panels total"},{value:"d",label:"3 figures, each with 2 plots"}],correctAnswer:"b",explanation:"plt.subplots(rows, cols) creates a single figure with a grid of axes. (2, 3) means 2 rows by 3 columns = 6 panels. You access them with axes[row, col]."},{id:"q3",type:"multiple-choice",question:"How do you add error bars to a bar chart in Matplotlib?",options:[{value:"a",label:"plt.errorbar(x, y, err)"},{value:"b",label:"plt.bar(x, y, yerr=err, capsize=5)"},{value:"c",label:"plt.bar(x, y).add_errors(err)"},{value:"d",label:"plt.bar(x, y, error=err)"}],correctAnswer:"b",explanation:"The yerr parameter on plt.bar() adds vertical error bars. The capsize parameter controls the width of the horizontal caps at the ends of the error bars."},{id:"q4",type:"multiple-choice",question:'What does fig.savefig("plot.png", dpi=300, bbox_inches="tight") do?',options:[{value:"a",label:"Displays the plot at 300% zoom"},{value:"b",label:"Saves the figure as a 300x300 pixel image"},{value:"c",label:"Saves a high-resolution PNG with no extra whitespace around the figure"},{value:"d",label:"Compresses the image to 300 bytes"}],correctAnswer:"c",explanation:'dpi=300 sets the resolution to 300 dots per inch (publication quality). bbox_inches="tight" trims any extra whitespace around the figure, preventing clipped labels.'},{id:"q5",type:"multiple-choice",question:"When using Pandas df.plot(), how do you direct the plot to a specific subplot axis?",options:[{value:"a",label:"df.plot(subplot=axes[0])"},{value:"b",label:"df.plot(axis=axes[0])"},{value:"c",label:"df.plot(ax=axes[0])"},{value:"d",label:"axes[0].plot(df)"}],correctAnswer:"c",explanation:"The ax parameter in Pandas .plot() specifies which Matplotlib axes object to draw on. This lets you place Pandas plots into specific panels of a multi-subplot figure."}]}}};export{e as lessons};
