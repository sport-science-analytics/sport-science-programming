const e={"basic-statistics":{blocks:[{type:"md",md:`# Basic Statistics

## Why Describe Data

Imagine a coach hands you a spreadsheet of fitness-test results for 200 athletes and asks a simple question: "How is the squad doing?" You cannot answer by reading 200 rows of numbers — your eye cannot hold that much, and scrolling through raw values tells you nothing about the group as a whole. You need a way to **compress** the data into a handful of numbers that describe it honestly.

That is what **descriptive statistics** do. A single mean, a standard deviation, and a few percentiles can summarise a column of 200 jump heights so faithfully that you barely need the raw data to understand it. The skill is choosing the *right* summaries and reading them correctly — a mean alone can mislead, and a standard deviation answers a different question than a standard error.

We will work with a real fitness-testing battery throughout this lesson. Load it once and look at what we have:`},{type:"example",packages:["pandas"],dataFiles:["test_battery.csv"],caption:"Load the test battery and inspect its shape and columns.",code:`import pandas as pd

df = pd.read_csv('data/test_battery.csv')
print(df.shape)            # (20, 8)
print(list(df.columns))
print(df.head(3))`},{type:"md",md:`The battery has 20 athletes with their sex, height, grip strength, countermovement jump height (CMJ), a beep-test level, an estimated VO2max, and a sit-and-reach flexibility score.

---

## Centre: Where Does the Data Sit?

The first question about any column is "what is a typical value?" There are three classic answers.

The **mean** is the arithmetic average. The **median** is the middle value when the data is sorted. The **mode** is the value that occurs most often.`},{type:"example",packages:["pandas"],dataFiles:["test_battery.csv"],caption:"Mean, median, and mode for CMJ jump height.",code:`import pandas as pd

df = pd.read_csv('data/test_battery.csv')
cmj = df['CMJ_cm']

print(f"Mean CMJ:   {cmj.mean():.1f} cm")
print(f"Median CMJ: {cmj.median():.1f} cm")
print(f"Mode CMJ:   {cmj.mode()[0]:.1f} cm")`},{type:"exercise",id:"ex-6-20",title:"Describe the Squad",domain:"physiology",packages:["pandas"],dataFiles:["test_battery.csv"],description:"Load the test battery. Store the mean CMJ in `mean_cmj`, the sample SD in `sd_cmj`, and the median in `median_cmj` — each rounded to 1 decimal. Print each on its own line.",initialCode:`import pandas as pd

df = pd.read_csv('data/test_battery.csv')
cmj = df['CMJ_cm']`,testCode:`assert abs(mean_cmj   - round(cmj.mean(),   1)) < 0.05, f"mean_cmj wrong: {mean_cmj}"
assert abs(sd_cmj     - round(cmj.std(),    1)) < 0.05, f"sd_cmj wrong: {sd_cmj}"
assert abs(median_cmj - round(cmj.median(), 1)) < 0.05, f"median_cmj wrong: {median_cmj}"
print("PASS")`,hints:["cmj.mean(), cmj.std() (sample SD by default), and cmj.median() -- wrap each in round(x, 1).",`mean_cmj = round(cmj.mean(), 1)
sd_cmj = round(cmj.___(), 1)
median_cmj = round(cmj.median(), 1)

print(mean_cmj)
print(sd_cmj)
print(median_cmj)`]},{type:"md",md:`### When the Median Beats the Mean

Notice that the mean sits *below* the median for CMJ. That gap is a clue: the data is **skewed**. A few low jumpers pull the mean down, while the median — which only cares about the middle position — barely moves.

> **Rule of thumb:** when the mean and median agree, either is fine. When they disagree, the median is usually the more honest description of "typical."

---

## Spread: How Much Do Athletes Differ?

The **standard deviation (SD)** quantifies how far values typically sit from the mean.

### Sample vs Population SD

- **Sample SD** (pandas \`.std()\`, divides by n−1): use when your data is a sample.
- **Population SD** (numpy \`np.std()\`, divides by n): use when your data is the whole population.

In sport science you almost always have a **sample**, so pandas \`.std()\` is the default choice.`},{type:"example",packages:["pandas"],dataFiles:["test_battery.csv"],caption:"pandas .std() vs numpy np.std() — same data, different divisors.",code:`import pandas as pd
import numpy as np

df = pd.read_csv('data/test_battery.csv')
grip = df['Grip_Strength_kg']

print(f"pandas .std()  (sample, ddof=1):  {grip.std():.3f} kg")
print(f"numpy np.std() (pop,    ddof=0):   {np.std(grip):.3f} kg")
print(f"numpy ddof=1  (sample):           {np.std(grip, ddof=1):.3f} kg")`},{type:"md",md:`---

## SD vs SEM: Two Different Questions

- The **SD** describes the spread of the *athletes*.
- The **SEM** describes the precision of the *mean estimate*: SEM = SD / sqrt(n).

Report the SD when you want to say "athletes vary by about this much." Report the SEM when you want to say "our estimate of the mean is good to about this much." Mixing them up is one of the most common errors in published sport science.`},{type:"example",packages:["pandas"],dataFiles:["test_battery.csv"],caption:"SEM = SD / sqrt(n) — precision of the mean, not spread of athletes.",code:`import pandas as pd
import numpy as np

df = pd.read_csv('data/test_battery.csv')
cmj = df['CMJ_cm']

n   = len(cmj)
sd  = cmj.std()
sem = sd / np.sqrt(n)

print(f"n:   {n}")
print(f"SD:  {sd:.2f} cm  (spread of athletes)")
print(f"SEM: {sem:.2f} cm  (precision of the mean)")`},{type:"exercise",id:"ex-6-21",title:"SD vs SEM on Grip Strength",domain:"coaching",packages:["pandas"],dataFiles:["test_battery.csv"],description:"Load the test battery. For `Grip_Strength_kg`: store the sample SD (rounded to 2 decimals) in `sd_grip` and the SEM (rounded to 2 decimals) in `sem_grip`. Print both.",initialCode:`import pandas as pd
import numpy as np

df = pd.read_csv('data/test_battery.csv')
grip = df['Grip_Strength_kg']`,testCode:`import numpy as np
_sd  = grip.std()
_sem = _sd / np.sqrt(len(grip))
assert abs(sd_grip  - round(_sd,  2)) < 0.02, f"sd_grip={sd_grip}"
assert abs(sem_grip - round(_sem, 2)) < 0.02, f"sem_grip={sem_grip}"
print("PASS")`,hints:["SEM = SD / sqrt(n): use grip.std() and np.sqrt(len(grip)).",`sd_grip = round(grip.std(), 2)
sem_grip = round(grip.std() / np.sqrt(___(grip)), 2)

print(f"SD:  {sd_grip} kg")
print(f"SEM: {sem_grip} kg")`]},{type:"md",md:`---

## Percentiles and Quartiles

A **percentile** is a value below which a given percentage of the data falls. The 25th, 50th, and 75th percentiles are the **quartiles**. Use \`.quantile()\` — it takes a proportion (0.25, not 25):`},{type:"example",packages:["pandas"],dataFiles:["test_battery.csv"],caption:"Quartiles and the 90th percentile for CMJ.",code:`import pandas as pd

df = pd.read_csv('data/test_battery.csv')
cmj = df['CMJ_cm']

print(f"Q1  (25th pct): {cmj.quantile(0.25):.1f} cm")
print(f"Q2  (median):   {cmj.quantile(0.50):.1f} cm")
print(f"Q3  (75th pct): {cmj.quantile(0.75):.1f} cm")
print(f"90th pct:       {cmj.quantile(0.90):.1f} cm")`},{type:"md",md:`---

## Distribution Shape and Normality

Many statistical tests assume the data is approximately **normal** (bell-shaped). The **Shapiro-Wilk test** checks this formally:

- **p < 0.05** — evidence *against* normality.
- **p ≥ 0.05** — no significant evidence against normality (consistent with normal).

Always pair the test with a histogram — the eye and the number together are more trustworthy than either alone.`},{type:"example",packages:["scipy"],dataFiles:["test_battery.csv"],caption:"Shapiro-Wilk normality test on sit-and-reach flexibility scores.",code:`import pandas as pd
from scipy import stats

df = pd.read_csv('data/test_battery.csv')

stat, p = stats.shapiro(df['Sit_Reach_cm'])
print(f"Shapiro-Wilk statistic: {stat:.3f}")
print(f"p-value: {p:.3f}")

if p >= 0.05:
    print("No evidence against normality.")
else:
    print("Evidence against normality.")`},{type:"exercise",id:"ex-6-22",title:"Is It Normal?",domain:"teaching",packages:["scipy"],dataFiles:["test_battery.csv"],description:"Run a Shapiro-Wilk normality test on `Sit_Reach_cm`. Store the p-value (rounded to 3 decimals) in `p` and a boolean `is_normal` that is True when p ≥ 0.05. Print each.",initialCode:`import pandas as pd
from scipy import stats

df = pd.read_csv('data/test_battery.csv')`,testCode:`_stat, _p = stats.shapiro(df['Sit_Reach_cm'])
assert abs(p - round(_p, 3)) < 1e-3, f"p={p}"
assert is_normal == (round(_p, 3) >= 0.05), f"is_normal={is_normal}"
print("PASS")`,hints:["stats.shapiro(column) returns (statistic, p_value); compare the rounded p against 0.05.",`stat, pval = stats.shapiro(df["Sit_Reach_cm"])
p = round(pval, 3)
is_normal = p >= ___

print(p)
print(is_normal)`]},{type:"md",md:`---

## A 95% Confidence Interval for a Mean

A **confidence interval (CI)** turns the SEM into a *range* of plausible values for the true mean. For small samples, use the t-distribution critical value:`},{type:"example",packages:["scipy"],dataFiles:["test_battery.csv"],caption:"Exact t-based 95% CI for mean CMJ (n=20).",code:`import pandas as pd
import numpy as np
from scipy import stats

df = pd.read_csv('data/test_battery.csv')
cmj = df['CMJ_cm']

mean  = cmj.mean()
n     = len(cmj)
sem   = cmj.std() / np.sqrt(n)
t_crit = stats.t.ppf(0.975, df=n - 1)   # two-sided 95%

lower = mean - t_crit * sem
upper = mean + t_crit * sem
print(f"Mean CMJ: {mean:.1f} cm")
print(f"t critical (n={n}): {t_crit:.3f}")
print(f"95% CI: {lower:.1f} to {upper:.1f} cm")`},{type:"exercise",id:"ex-6-23",title:"Confidence Interval for Mean VO2max",domain:"physiology",packages:["scipy"],dataFiles:["test_battery.csv"],description:"Compute the t-based 95% CI for mean `VO2max_est`. Store the lower bound in `ci_lower` and upper bound in `ci_upper` (both rounded to 1 decimal). Print both.",initialCode:`import pandas as pd
import numpy as np
from scipy import stats

df = pd.read_csv('data/test_battery.csv')
vo2 = df['VO2max_est']`,testCode:`import numpy as np
_m = vo2.mean(); _n = len(vo2); _sem = vo2.std() / np.sqrt(_n)
_tc = stats.t.ppf(0.975, df=_n - 1)
_lo = round(_m - _tc * _sem, 1)
_hi = round(_m + _tc * _sem, 1)
assert abs(ci_lower - _lo) < 0.15, f"ci_lower={ci_lower}"
assert abs(ci_upper - _hi) < 0.15, f"ci_upper={ci_upper}"
print("PASS")`,hints:["CI = mean ± t_crit × SEM, with SEM = SD / sqrt(n) and t_crit = stats.t.ppf(0.975, df=n-1).",`mean = vo2.mean()
n = len(vo2)
sem = vo2.std() / np.sqrt(n)
t_crit = stats.t.ppf(0.975, df=n - ___)

ci_lower = round(mean - t_crit * sem, 1)
ci_upper = round(mean + t_crit * sem, 1)

print(f"95% CI: {ci_lower} to {ci_upper}")`]},{type:"md",md:`---

## Full describe() Summary

pandas \`.describe()\` computes count, mean, std, min, quartiles, and max in one call — a fast first pass on any column:`},{type:"example",packages:["pandas"],dataFiles:["test_battery.csv"],caption:".describe() gives an instant snapshot of every numeric column.",code:`import pandas as pd

df = pd.read_csv('data/test_battery.csv')
print(df[['CMJ_cm', 'Grip_Strength_kg', 'VO2max_est']].describe().round(1))`},{type:"exercise",id:"ex-6-24",title:"Percentile Profile",domain:"biomechanics",packages:["pandas"],dataFiles:["test_battery.csv"],description:"Load the test battery. For `CMJ_cm`, compute Q1 (25th pct), Q3 (75th pct), and IQR = Q3 − Q1. Store each rounded to 2 decimals in `q1`, `q3`, and `iqr`. Print all three.",initialCode:`import pandas as pd

df = pd.read_csv('data/test_battery.csv')
cmj = df['CMJ_cm']`,testCode:`_q1  = float(cmj.quantile(0.25))
_q3  = float(cmj.quantile(0.75))
_iqr = _q3 - _q1
assert abs(q1  - round(_q1,  2)) < 0.05, f"q1={q1}"
assert abs(q3  - round(_q3,  2)) < 0.05, f"q3={q3}"
assert abs(iqr - round(_iqr, 2)) < 0.05, f"iqr={iqr}"
print("PASS")`,hints:[".quantile() takes a proportion: 0.25 for Q1, 0.75 for Q3. IQR = Q3 - Q1.",`q1 = round(cmj.quantile(0.25), 2)
q3 = round(cmj.quantile(___), 2)
iqr = round(q3 - q1, 2)

print(f"Q1:  {q1} cm")
print(f"Q3:  {q3} cm")
print(f"IQR: {iqr} cm")`]},{type:"md",md:"---\n\n## Summary\n\n| Statistic | What it tells you | pandas / scipy call |\n|-----------|-------------------|---------------------|\n| Mean | Arithmetic average (sensitive to extremes) | `col.mean()` |\n| Median | Middle value (robust to skew) | `col.median()` |\n| SD (sample) | Typical distance from the mean | `col.std()` (ddof=1) |\n| SEM | Precision of the mean estimate | `col.std() / np.sqrt(n)` |\n| Percentile | Value below which a given % falls | `col.quantile(0.25)` |\n| Shapiro-Wilk | Normality test | `scipy.stats.shapiro(col)` |\n| 95% CI (t-based) | Plausible range for the true mean | `mean ± stats.t.ppf(0.975, n-1) × SEM` |\n\nIn the next lesson, we combine raw questionnaire items and physical test results into usable scores."}],quiz:{id:"quiz-6-1",title:"Basic Statistics Quiz",questions:[{id:"q1",type:"multiple-choice",question:'A column of jump heights is skewed because a few very low jumpers pull the average down. Which centre is the more honest description of a "typical" athlete?',options:[{value:"a",label:"The mean, because it uses every single value in the data"},{value:"b",label:"The median, because it is robust to skew and extreme values"},{value:"c",label:"The mode, because the most frequent value is always the most typical"},{value:"d",label:"The range, because it captures the full extent of the data"}],correctAnswer:"b",explanation:"The median is the middle value, so it barely moves when a few extreme values are present. The mean adds every value up, so skew and outliers drag it toward the tail."},{id:"q2",type:"multiple-choice",question:"What does the standard deviation of a column measure?",options:[{value:"a",label:"How precise the estimate of the mean is"},{value:"b",label:"The gap between the largest and smallest value"},{value:"c",label:"How far individual values typically sit from the mean"},{value:"d",label:"The percentage of values that are above average"}],correctAnswer:"c",explanation:"The standard deviation quantifies the spread of individual values around the mean. The precision of the mean is the SEM, and the largest-minus-smallest gap is the range."},{id:"q3",type:"multiple-choice",question:"How do the standard deviation (SD) and the standard error of the mean (SEM) differ?",options:[{value:"a",label:"They are the same thing measured in different units"},{value:"b",label:"SD describes the spread of the athletes; SEM describes the precision of the mean estimate (SD / sqrt(n))"},{value:"c",label:"SEM describes the spread of the athletes; SD describes the precision of the mean"},{value:"d",label:"SD is for samples and SEM is for populations"}],correctAnswer:"b",explanation:"The SD describes how much individual athletes vary; the SEM = SD / sqrt(n) describes how much the sample mean would bounce around if you re-sampled."},{id:"q4",type:"multiple-choice",question:"You run a Shapiro-Wilk test on a column and get a p-value of 0.01. What does this indicate?",options:[{value:"a",label:"There is evidence against normality — the data is probably not normally distributed"},{value:"b",label:"The data is definitely perfectly normal"},{value:"c",label:"Exactly 1% of the values are outliers"},{value:"d",label:"The test failed and should be re-run"}],correctAnswer:"a",explanation:"A Shapiro-Wilk p-value below 0.05 is evidence against the null hypothesis of normality. A large p-value (≥ 0.05) means only that there is no significant evidence against normality."},{id:"q5",type:"multiple-choice",question:"When you call .std() on a pandas Series, which standard deviation do you get by default?",options:[{value:"a",label:"The population SD (dividing by n), the same as numpy np.std() by default"},{value:"b",label:"The sample SD (dividing by n - 1), which differs from numpy np.std() default"},{value:"c",label:"Neither — pandas raises an error unless you specify ddof"},{value:"d",label:"It depends on the size of the Series"}],correctAnswer:"b",explanation:"pandas .std() uses ddof=1 by default, giving the sample SD. numpy np.std() defaults to ddof=0 (population SD), so the two libraries return different numbers on the same data."}]}},"test-scores":{blocks:[{type:"md",md:`# Gathering Scores from Tests

## From Raw Answers to a Usable Score

When you measure something psychological or physical, the data almost never arrives as a single tidy number. A motivation questionnaire hands you twelve separate answers per student; a fitness battery gives you a grip-strength reading, a jump height, a flexibility score, and more. The job of this lesson is the step that sits *between* the raw answers and any statistics: **combining many columns into one meaningful score per person**.

We will work with two real files: a PE-motivation survey of 60 secondary-school students and the 20-athlete fitness battery.`},{type:"example",packages:["pandas"],dataFiles:["pe_motivation_survey.csv"],caption:"Load the motivation survey and inspect the first few rows.",code:`import pandas as pd

survey = pd.read_csv('data/pe_motivation_survey.csv')
print(survey.shape)                  # (60, 15)
print(list(survey.columns)[:6])
print(survey[['Student_ID', 'Q1', 'Q2', 'Q3']].head(3))`},{type:"md",md:`---

## Likert Items

The survey questions are **Likert items** — the familiar 1-to-5 scale. Strictly speaking, ordinal data only tells you the *order* of responses, not the *distance* between them. Yet in practice treating Likert numbers as ordinary measurements — averaging them, taking standard deviations — is the standard pragmatic approach for five-point scales with several items combined.

> **The gaps between Likert points are not guaranteed to be equal.** Treat Likert-based scores as approximate and do not over-interpret a difference of a tenth of a point.

---

## Reverse-Coded Items

Some questions are **reverse-coded**: a low answer signals *high* motivation. In our survey, items **Q3, Q7, and Q11** are reverse-coded. Before combining items, flip these so a higher number always means more motivation:

\`\`\`
reversed = 6 - original
\`\`\`

The 6 is simply *(scale minimum + scale maximum)* = 1 + 5.`},{type:"example",packages:["pandas"],dataFiles:["pe_motivation_survey.csv"],caption:"Reversing Q3 flips its correlation with the positive items from negative to positive.",code:`import pandas as pd

survey = pd.read_csv('data/pe_motivation_survey.csv')
items    = [f'Q{i}' for i in range(1, 13)]
pos_items = [c for c in items if c not in ('Q3', 'Q7', 'Q11')]

positive_score = survey[pos_items].mean(axis=1)

r_before = survey['Q3'].corr(positive_score)
r_after  = (6 - survey['Q3']).corr(positive_score)
print(f"corr(raw Q3,      positive items): {r_before:.2f}")
print(f"corr(reversed Q3, positive items): {r_after:.2f}")`},{type:"exercise",id:"ex-6-25",title:"Score the Motivation Survey",domain:"psychology",packages:["pandas"],dataFiles:["pe_motivation_survey.csv"],description:"Compute each student's overall PE-motivation score on the 1-5 scale. Reverse-code items Q3, Q7 and Q11 (reversed = 6 − original), then take the mean of all 12 items per student (ignoring missing answers). Store the result in `motivation` (a Series) and print the squad mean rounded to 2 decimals.",initialCode:`import pandas as pd

df = pd.read_csv('data/pe_motivation_survey.csv')
items = [f'Q{i}' for i in range(1, 13)]`,testCode:`_s = df[[f'Q{i}' for i in range(1,13)]].copy()
for c in ['Q3','Q7','Q11']:
    _s[c] = 6 - _s[c]
_expected = _s.mean(axis=1)
assert abs(motivation.mean() - _expected.mean()) < 0.01, "Reverse-code Q3/Q7/Q11 then row-mean all 12 items"
print("PASS")`,hints:["Copy the item columns, reverse the three reverse items with 6 - value, then take the row-mean with .mean(axis=1).",`scored = df[items].copy()
for col in ["Q3", "Q7", "Q11"]:
    scored[col] = ___ - scored[col]

motivation = scored.mean(axis=1)
print(round(motivation.mean(), 2))`]},{type:"md",md:`---

## Composite and Subscale Scores

Once every item points the same way, combining them is easy. A **composite score** is the sum or mean across items — computed *after* reversing. The **mean** keeps the score on the original 1-to-5 scale, making it directly interpretable.

pandas' \`.mean(axis=1)\` **skips NaN automatically** — it averages over the items a student *did* answer. But only compute a score when the person answered enough items (a common threshold is **≥ 80%**; below that the score is too thin to trust).`},{type:"exercise",id:"ex-6-26",title:"Check Reverse Correlations",domain:"psychology",packages:["pandas"],dataFiles:["pe_motivation_survey.csv"],description:"Confirm that all three reverse items (Q3, Q7, Q11) have a *negative* correlation with the mean of the nine positive items when left raw. Store the correlation of raw Q7 with the positive score in `r_q7_raw` (rounded to 2 decimals). Print it.",initialCode:`import pandas as pd

df = pd.read_csv('data/pe_motivation_survey.csv')
items = [f'Q{i}' for i in range(1, 13)]
pos_items = [c for c in items if c not in ('Q3', 'Q7', 'Q11')]`,testCode:`_pos = df[[c for c in [f'Q{i}' for i in range(1,13)] if c not in ('Q3','Q7','Q11')]].mean(axis=1)
_r = round(float(df['Q7'].corr(_pos)), 2)
assert abs(r_q7_raw - _r) < 0.03, f"r_q7_raw={r_q7_raw}, expected ~{_r}"
assert r_q7_raw < 0, "Raw Q7 should correlate negatively with the positive items"
print("PASS")`,hints:["Build the positive score with .mean(axis=1) over the nine positive items, then correlate raw Q7 against it with .corr().",`positive_score = df[pos_items].mean(axis=1)

r_q7_raw = round(df["Q7"].corr(___), 2)
print(r_q7_raw)`]},{type:"md",md:`---

## Physical Test Batteries

In a physical battery, tests are measured in **different units on different scales** (grip in kg, jump in cm, flexibility in cm). A naive average would let the test with the largest spread **dominate**. The fix: convert each test to a **z-score** first:

\`\`\`
z = (value − mean) / standard deviation
\`\`\`

A z-score is unitless, centred on 0, and has SD = 1. Average the z-scores and each test contributes **equally** to the composite.`},{type:"example",packages:["pandas"],dataFiles:["test_battery.csv"],caption:"Z-score composite: grip, CMJ, and flexibility each contribute equally.",code:`import pandas as pd

battery = pd.read_csv('data/test_battery.csv')
tests   = ['Grip_Strength_kg', 'CMJ_cm', 'Sit_Reach_cm']

z = pd.DataFrame()
for col in tests:
    z[col] = (battery[col] - battery[col].mean()) / battery[col].std()

battery['fitness_z'] = z.mean(axis=1)
ranked = battery[['Athlete'] + tests + ['fitness_z']].sort_values('fitness_z', ascending=False)
print(ranked.head(4).round(2).to_string(index=False))`},{type:"exercise",id:"ex-6-27",title:"Build a Z-Score Fitness Composite",domain:"physiology",packages:["pandas"],dataFiles:["test_battery.csv"],description:"Load the test battery. Z-score `Grip_Strength_kg`, `CMJ_cm`, and `Sit_Reach_cm`. Average the three z-scores per athlete into a column `fitness_z`. Store the athlete with the highest composite in `top_athlete` (use `.idxmax()` on the fitness_z Series indexed by Athlete). Print `top_athlete`.",initialCode:`import pandas as pd

df = pd.read_csv('data/test_battery.csv')
tests = ['Grip_Strength_kg', 'CMJ_cm', 'Sit_Reach_cm']`,testCode:`_tests = ['Grip_Strength_kg', 'CMJ_cm', 'Sit_Reach_cm']
_z = pd.DataFrame()
for _c in _tests:
    _z[_c] = (df[_c] - df[_c].mean()) / df[_c].std()
df['fitness_z'] = _z.mean(axis=1)
_top = df.set_index('Athlete')['fitness_z'].idxmax()
assert top_athlete == _top, f"Expected {_top}, got {top_athlete}"
print("PASS")`,hints:["z = (value - mean) / SD per column; average the three z-columns with .mean(axis=1); then idxmax() on the Athlete-indexed Series.",`z = pd.DataFrame()
for col in tests:
    z[col] = (df[col] - df[col].mean()) / df[col].___()

df["fitness_z"] = z.mean(axis=1)

top_athlete = df.set_index("Athlete")["fitness_z"].idxmax()
print(top_athlete)`]},{type:"md",md:`---

## A Reliability Note

Do the items actually **belong together**? A motivation scale only makes sense if its twelve items tap the same underlying thing. The **mean inter-item correlation** gives a quick feel:`},{type:"example",packages:["pandas"],dataFiles:["pe_motivation_survey.csv"],caption:"Mean inter-item correlation — confirms items move together after reversing.",code:`import pandas as pd
import numpy as np

survey = pd.read_csv('data/pe_motivation_survey.csv')
items  = [f'Q{i}' for i in range(1, 13)]
scored = survey[items].copy()
for col in ['Q3', 'Q7', 'Q11']:
    scored[col] = 6 - scored[col]

corr   = scored.corr()
n      = corr.shape[0]
upper  = np.triu(np.ones((n, n), dtype=bool), k=1)
print(f"Mean inter-item correlation: {corr.values[upper].mean():.2f}")`},{type:"exercise",id:"ex-6-28",title:"Mean Inter-Item Correlation",domain:"psychology",packages:["pandas"],dataFiles:["pe_motivation_survey.csv"],description:"After reverse-coding Q3, Q7, Q11, compute the mean inter-item correlation across all 12 items. Store it (rounded to 2 decimals) in `mean_iic`. Print it.",initialCode:`import pandas as pd
import numpy as np

df = pd.read_csv('data/pe_motivation_survey.csv')
items = [f'Q{i}' for i in range(1, 13)]`,testCode:`import numpy as np
_s = df[[f'Q{i}' for i in range(1,13)]].copy()
for _c in ['Q3','Q7','Q11']:
    _s[_c] = 6 - _s[_c]
_corr = _s.corr()
_n    = _corr.shape[0]
_up   = np.triu(np.ones((_n, _n), dtype=bool), k=1)
_expected = round(float(_corr.values[_up].mean()), 2)
assert abs(mean_iic - _expected) < 0.03, f"mean_iic={mean_iic}, expected ~{_expected}"
assert mean_iic > 0, "Mean inter-item correlation should be positive after reversing"
print("PASS")`,hints:["Reverse-code first, then scored.corr(); np.triu(..., k=1) selects the upper triangle above the diagonal.",`scored = df[items].copy()
for col in ["Q3", "Q7", "Q11"]:
    scored[col] = 6 - scored[col]

corr = scored.corr()
n = corr.shape[0]
upper = np.triu(np.ones((n, n), dtype=bool), k=___)
mean_iic = round(float(corr.values[upper].mean()), 2)
print(mean_iic)`]},{type:"md",md:`---

## Summary

| Step | What it does | Key tool |
|------|--------------|----------|
| Recognise Likert items | Treat 1-5 ordinal answers as numbers | — |
| Reverse-code | Flip negatively-worded items | \`6 - original\` (1-5 scale) |
| Verify the fix | A reverse item should correlate *positively* after reversing | \`col.corr(other)\` |
| Composite | Combine items into one score after reversing | \`scored.mean(axis=1)\` |
| Standardise | Put tests on a common scale so each counts equally | \`(x - x.mean()) / x.std()\` |
| Reliability | Confirm items belong together | mean inter-item correlation |

In the next lesson, we model how one measurement predicts another — linear regression.`}],quiz:{id:"quiz-6-2",title:"Test Scoring Quiz",questions:[{id:"q1",type:"multiple-choice",question:"Why do questionnaire designers deliberately include some negatively-worded (reverse-coded) items?",options:[{value:"a",label:"To make the survey longer so it looks more thorough"},{value:"b",label:"To catch inattentive respondents and reduce the habit of agreeing with everything"},{value:"c",label:"Because negatively-worded items are always more accurate than positive ones"},{value:"d",label:"So that the final score is guaranteed to come out higher"}],correctAnswer:"b",explanation:'Mixing in reverse-worded items flags careless "tick every 5" responding and counters acquiescence bias. It is a data-quality safeguard.'},{id:"q2",type:"multiple-choice",question:"To reverse-code an item on a 1-to-5 Likert scale you compute 6 - original. Where does the 6 come from?",options:[{value:"a",label:"It is the number of items in the questionnaire"},{value:"b",label:"It is an arbitrary constant that happens to work"},{value:"c",label:"It is the scale minimum plus the scale maximum (1 + 5), which mirrors the scale end-to-end"},{value:"d",label:"It is the mean of the scale plus one"}],correctAnswer:"c",explanation:"On a 1-to-5 scale, 6 = minimum (1) + maximum (5). Subtracting each value mirrors the scale: 1 becomes 5, 5 becomes 1, 3 stays in the middle."},{id:"q3",type:"multiple-choice",question:"Why should you convert physical tests (grip in kg, jump in cm, flexibility in cm) to z-scores before averaging them into one fitness composite?",options:[{value:"a",label:"Z-scores make the numbers smaller and easier to read"},{value:"b",label:"Without standardising, the test with the largest numbers and spread dominates the average, so each test would not contribute equally"},{value:"c",label:"Averaging raw scores is impossible in pandas"},{value:"d",label:"Z-scores remove the need to handle missing data"}],correctAnswer:"b",explanation:"Tests on different units and ranges contribute unequally to a raw average. A z-score puts every test on a common unitless scale centred on 0 with spread 1, so each counts equally in the composite."},{id:"q4",type:"multiple-choice",question:"What is a composite (or subscale) score?",options:[{value:"a",label:"The single highest answer a person gave across all items"},{value:"b",label:"A score combining several individual items (by sum or mean) into one number per person, after any reverse items are flipped"},{value:"c",label:"The correlation between two questionnaire items"},{value:"d",label:"The number of questions a person left unanswered"}],correctAnswer:"b",explanation:"A composite or subscale score aggregates several related items into a single value per person — typically their sum or mean — computed after reverse-coded items have been flipped."}]}},"linear-regression":{blocks:[{type:"md",md:"# Linear Regression\n\n## The Question Regression Answers\n\n**Linear regression** fits a straight line through a cloud of points:\n\n```\ny = a + b * x\n```\n\nThe **slope** b tells you how much y changes for each one-unit increase in x — the headline finding, stated in real sport units. The **intercept** a positions the line at x = 0 (often physically meaningless).\n\nThis lesson uses **three different tools** for the same line, because each is the right choice for a different job: `scipy` for a quick fit, `statsmodels` for a publication-style report, and `scikit-learn` for prediction."},{type:"example",packages:["pandas"],dataFiles:["strength.csv"],caption:"Load the strength dataset — muscle cross-section vs squat one-rep max.",code:`import pandas as pd

df = pd.read_csv('data/strength.csv')
print(df.shape)                                  # (17, 9)
print(df[['muscle_csa', 'squat_strength']].head(3))`},{type:"md",md:`---

## A Quick Line with scipy

\`scipy.stats.linregress(x, y)\` returns slope, intercept, Pearson r, R², and p-value in one call. Note: x comes first.`},{type:"example",packages:["scipy"],dataFiles:["strength.csv"],caption:"linregress fits the line and reports slope, r, R², and p in one object.",code:`import pandas as pd
from scipy import stats

df = pd.read_csv('data/strength.csv')
result = stats.linregress(df['muscle_csa'], df['squat_strength'])

print(f"slope:     {result.slope:.3f} kg per cm^2")
print(f"intercept: {result.intercept:.1f} kg")
print(f"r:         {result.rvalue:.3f}")
print(f"R-squared: {result.rvalue ** 2:.3f}")
print(f"p-value:   {result.pvalue:.2e}")`},{type:"exercise",id:"ex-6-29",title:"Strength from Muscle Size",domain:"physiology",packages:["scipy"],dataFiles:["strength.csv"],description:"Fit a linear regression of `squat_strength` on `muscle_csa` with `scipy.stats.linregress`. Store the slope (rounded to 3 decimals) in `slope_value` and R² (rounded to 3 decimals) in `r2_value`. Print each.",initialCode:`import pandas as pd
from scipy import stats

df = pd.read_csv('data/strength.csv')`,testCode:`_r = stats.linregress(df['muscle_csa'], df['squat_strength'])
assert abs(slope_value - round(_r.slope,        3)) < 1e-3, f"slope_value={slope_value}"
assert abs(r2_value    - round(_r.rvalue ** 2,  3)) < 1e-3, f"r2_value={r2_value}"
print("PASS")`,hints:["stats.linregress(x, y) -- x comes first. R² is result.rvalue squared.",`result = stats.linregress(df["muscle_csa"], df["squat_strength"])
slope_value = round(result.slope, 3)
r2_value = round(result.rvalue ** ___, 3)

print(slope_value)
print(r2_value)`]},{type:"md",md:`---

## Visualise the Fit

Always look at the data — numbers can hide a bad fit. Plot the raw points as a scatter, then draw the fitted line on top:`},{type:"example",packages:["scipy"],dataFiles:["strength.csv"],caption:"Scatter + fitted line: a visual sanity check before trusting any statistic.",code:`import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats

df = pd.read_csv('data/strength.csv')
x  = df['muscle_csa']
y  = df['squat_strength']

result = stats.linregress(x, y)
line   = result.intercept + result.slope * x

plt.scatter(x, y, color='steelblue', label='Athletes')
plt.plot(x, line, color='crimson', label='Fitted line')
plt.xlabel('Muscle cross-sectional area (cm^2)')
plt.ylabel('Squat strength (kg)')
plt.title('Squat Strength vs Muscle Size')
plt.legend()
plt.show()`},{type:"md",md:"---\n\n## Publication-Style Output with statsmodels\n\n`statsmodels` OLS produces the publication table: coefficient, standard error, p-value, and 95% CI. It needs an explicit constant column for the intercept (use `sm.add_constant`). Note the argument order: `OLS(y, X)` — outcome first."},{type:"example",packages:["statsmodels"],dataFiles:["strength.csv"],caption:"statsmodels OLS: the inference table with p-values and 95% confidence intervals.",code:`import pandas as pd
import statsmodels.api as sm

df = pd.read_csv('data/strength.csv')

X     = sm.add_constant(df['muscle_csa'])
model = sm.OLS(df['squat_strength'], X).fit()
print(model.summary())`},{type:"exercise",id:"ex-6-30",title:"statsmodels Regression Report",domain:"physiology",packages:["statsmodels"],dataFiles:["strength.csv"],description:"Fit a statsmodels OLS regression of `squat_strength` on `muscle_csa` (with a constant). Store the R² of the model (rounded to 3 decimals) in `ols_r2` and the p-value for `muscle_csa` (rounded to 4 decimals) in `ols_p`. Print both.",initialCode:`import pandas as pd
import statsmodels.api as sm

df = pd.read_csv('data/strength.csv')`,testCode:`_X = sm.add_constant(df['muscle_csa'])
_m = sm.OLS(df['squat_strength'], _X).fit()
assert abs(ols_r2 - round(_m.rsquared,              3)) < 0.002, f"ols_r2={ols_r2}"
assert abs(ols_p  - round(_m.pvalues['muscle_csa'], 4)) < 0.001, f"ols_p={ols_p}"
print("PASS")`,hints:["sm.OLS(y, X) with X = sm.add_constant(...). R² is model.rsquared; the slope p-value lives in model.pvalues.",`X = sm.add_constant(df["muscle_csa"])
model = sm.OLS(df["squat_strength"], X).fit()

ols_r2 = round(model.rsquared, 3)
ols_p = round(model.pvalues["___"], 4)

print(ols_r2)
print(ols_p)`]},{type:"md",md:'---\n\n## Prediction with scikit-learn\n\n**scikit-learn** is the prediction library. Its interface is built for machine learning, not inference, which brings one rule: X must be **two-dimensional** — use double brackets `df[["col"]]`, not single `df["col"]`.\n\nCoefficients live in `.coef_[0]` (slope) and `.intercept_`. Predict with `.predict([[new_value]])`.'},{type:"example",packages:["scikit-learn"],dataFiles:["test_battery.csv"],caption:"scikit-learn predicts CMJ from height — note the 2-D X requirement.",code:`import pandas as pd
from sklearn.linear_model import LinearRegression

df = pd.read_csv('data/test_battery.csv')

X = df[['Height_cm']]       # 2-D: double brackets
y = df['CMJ_cm']

model = LinearRegression().fit(X, y)
print(f"slope:     {model.coef_[0]:.3f} cm per cm of height")
print(f"intercept: {model.intercept_:.2f}")

pred = model.predict([[185]])
print(f"Predicted CMJ at 185 cm: {pred[0]:.1f} cm")`},{type:"exercise",id:"ex-6-31",title:"Predict a New Athlete",domain:"biomechanics",packages:["scikit-learn"],dataFiles:["test_battery.csv"],description:"Fit a scikit-learn `LinearRegression` predicting `CMJ_cm` from `Height_cm`. Predict the jump height for an athlete who is 185 cm tall. Store the prediction (rounded to 1 decimal) in `pred`. Print it.",initialCode:`import pandas as pd
from sklearn.linear_model import LinearRegression

df = pd.read_csv('data/test_battery.csv')`,testCode:`_m = LinearRegression().fit(df[['Height_cm']], df['CMJ_cm'])
_p = round(_m.predict([[185]])[0], 1)
assert abs(pred - _p) < 0.15, f"pred={pred}, expected ~{_p}"
print("PASS")`,hints:['X must be 2-D -- double brackets df[["Height_cm"]]. Fit, then predict for [[185]].',`X = df[["Height_cm"]]
y = df["CMJ_cm"]

model = LinearRegression().fit(X, y)
pred = round(model.predict([[___]])[0], 1)
print(pred)`]},{type:"md",md:`---

## Residuals, Assumptions, and a Caution

The **residual** for each athlete is the gap between their actual y and the line's prediction:

\`\`\`
residual = actual y − predicted y
\`\`\`

A good residual plot looks like a **patternless cloud** around zero. Patterns signal problems:

- **Curved residuals** — the true relationship bends; a straight line is wrong.
- **Fan-shaped residuals** — the spread grows with x (non-constant variance).

> **A relationship is not proof of cause.** Regression shows that two measurements move together — it does **not** show that one causes the other.`},{type:"example",packages:["scipy"],dataFiles:["strength.csv"],caption:"Residual plot — a patternless cloud around zero confirms the linear fit.",code:`import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats

df = pd.read_csv('data/strength.csv')
x  = df['muscle_csa']
y  = df['squat_strength']

result    = stats.linregress(x, y)
predicted = result.intercept + result.slope * x
residuals = y - predicted

plt.scatter(x, residuals, color='steelblue')
plt.axhline(0, color='crimson', linestyle='--')
plt.xlabel('Muscle cross-sectional area (cm^2)')
plt.ylabel('Residual (kg)')
plt.title('Residual Plot')
plt.show()`},{type:"exercise",id:"ex-6-32",title:"Residual Analysis",domain:"physiology",packages:["scipy"],dataFiles:["strength.csv"],description:"Fit the scipy regression of `squat_strength` on `muscle_csa`. Compute residuals (actual − predicted). Store the maximum absolute residual (rounded to 1 decimal) in `max_abs_residual`. Print it.",initialCode:`import pandas as pd
import numpy as np
from scipy import stats

df = pd.read_csv('data/strength.csv')
x = df['muscle_csa']
y = df['squat_strength']`,testCode:`_r  = stats.linregress(df['muscle_csa'], df['squat_strength'])
_pred = _r.intercept + _r.slope * df['muscle_csa']
_res  = df['squat_strength'] - _pred
_expected = round(float(_res.abs().max()), 1)
assert abs(max_abs_residual - _expected) < 0.15, f"max_abs_residual={max_abs_residual}, expected ~{_expected}"
print("PASS")`,hints:["residual = actual - predicted, with predicted = intercept + slope * x. Then .abs().max().",`result = stats.linregress(x, y)
predicted = result.intercept + result.slope * x
residuals = y - ___

max_abs_residual = round(float(residuals.abs().max()), 1)
print(max_abs_residual)`]},{type:"md",md:"---\n\n## Summary\n\n| Tool | Call | Best for |\n|------|------|----------|\n| scipy | `stats.linregress(x, y)` | Quick fit: slope, r, R², p |\n| statsmodels | `sm.OLS(y, sm.add_constant(X)).fit()` | Inference: p-values + 95% CIs |\n| scikit-learn | `LinearRegression().fit(X, y).predict()` | Prediction for new inputs (X must be 2-D) |\n\nUse `scipy` to fit and eyeball fast, `statsmodels` to defend the relationship in a results section, `scikit-learn` when the goal is to forecast a new athlete. Read the slope in real units, check R² and the residuals, and never mistake association for causation.\n\nIn the next lesson, we move from relationships to group comparisons — t-tests and ANOVA."}],quiz:{id:"quiz-6-3",title:"Linear Regression Quiz",questions:[{id:"q1",type:"multiple-choice",question:"In a regression of squat strength (kg) on muscle cross-sectional area (cm squared), the slope is 1.18. What does that slope mean?",options:[{value:"a",label:"Each extra 1 cm squared of muscle predicts about 1.18 kg more squat strength"},{value:"b",label:"The squat strength is always 1.18 times the muscle area"},{value:"c",label:"1.18% of athletes have above-average muscle size"},{value:"d",label:"The model explains 1.18 of the variation in squat strength"}],correctAnswer:"a",explanation:"The slope is the change in y for a one-unit increase in x. With y in kg and x in cm², a slope of 1.18 means each additional 1 cm² of muscle is associated with about 1.18 kg more squat."},{id:"q2",type:"multiple-choice",question:"A regression reports an R squared of 0.99. What does this tell you?",options:[{value:"a",label:"The slope of the line is 0.99"},{value:"b",label:"About 99% of the variation in the outcome is explained by the predictor"},{value:"c",label:"99% of the data points lie exactly on the line"},{value:"d",label:"The p-value of the model is 0.99"}],correctAnswer:"b",explanation:"R squared is the proportion of the variance in y explained by x, on a 0-to-1 scale. An R squared of 0.99 means the line accounts for about 99% of the spread in y."},{id:"q3",type:"multiple-choice",question:'Why must the input X be two-dimensional (df[["Height_cm"]] rather than df["Height_cm"]) when fitting a scikit-learn LinearRegression?',options:[{value:"a",label:"scikit-learn expects X as a 2-D table of samples by features, even when there is only one feature; a 1-D Series raises an error"},{value:"b",label:"Two-dimensional data trains the model twice as fast"},{value:"c",label:"It is only needed when there are at least two predictors"},{value:"d",label:"A 1-D input would make the predictions twice as large"}],correctAnswer:"a",explanation:'scikit-learn always treats X as a 2-D array of shape (n_samples, n_features). df[["Height_cm"]] (double brackets) returns a 2-D DataFrame; df["Height_cm"] (single brackets) returns a 1-D Series and raises an error.'},{id:"q4",type:"multiple-choice",question:"You need a regression coefficient together with its p-value and 95% confidence interval for a results section. Which tool is built for that?",options:[{value:"a",label:"scipy.stats.linregress"},{value:"b",label:"scikit-learn LinearRegression"},{value:"c",label:"statsmodels OLS, whose .summary() reports coefficients, p-values, and confidence intervals"},{value:"d",label:"None of them can report a confidence interval"}],correctAnswer:"c",explanation:"statsmodels OLS is the inference tool: its .summary() prints the publication-style table with each coefficient, its standard error, p-value, and 95% CI. scipy gives a quick slope/r/p but no interval table; scikit-learn is built for prediction."},{id:"q5",type:"multiple-choice",question:"A regression shows a strong, statistically significant relationship between two measurements. What can you correctly conclude?",options:[{value:"a",label:"One measurement definitely causes the other"},{value:"b",label:"The two measurements are associated and one predicts the other, but this alone does not prove causation"},{value:"c",label:"The relationship must be a coincidence"},{value:"d",label:"Changing one variable will always change the other by the slope amount"}],correctAnswer:"b",explanation:"A significant slope and high R squared show that the variables move together and that x predicts y, but association is not causation. A third factor could drive both."}]}},"ttest-anova":{blocks:[{type:"md",md:`# t-Tests and ANOVA

## Comparing Groups

Regression asked how one measurement tracks another. The other great question in sport science is about **groups**: do the men squat more than the women? Did the plyometric block actually raise jump height? Does heart rate really differ between session types? In every case you have two or more sets of numbers and one nagging worry — **is the difference I see real, or just noise?**

The worry is justified. Pull any two samples of athletes and their means will differ *a little* purely by chance, even if the groups are identical underneath. So a raw gap between means — "the men averaged 137 kg, the women 81 kg" — is not enough on its own. You need a way to ask whether a gap that size could plausibly have appeared by luck alone. That is exactly what a **hypothesis test** does.

Every test in this lesson follows the same logic. You start by assuming the boring possibility — the **null hypothesis** — that there is genuinely *no* difference between the groups; any gap you see is just sampling noise. The test then computes a **p-value**:

> **The p-value is the probability of seeing a difference at least as big as the one you observed, *if the null hypothesis were true* (i.e. if there were truly no real difference).**

A small p-value means your data would be very surprising in a world with no real difference — so you doubt that world. By convention, **p < 0.05** is the usual threshold for calling a result "statistically significant": a gap this big would happen less than 5% of the time by chance alone, so you provisionally reject the null and conclude the difference is real.

That convention is genuinely useful, but the p-value is *also* one of the most misread numbers in science. Three things it does **not** mean:

- It is **not** the probability that the null hypothesis is true. The p-value is computed *assuming* the null is true; it cannot also tell you the chance that it is.
- It is **not** the size of the effect. A tiny, trivial difference can have a tiny p-value if your sample is large enough. Significance answers "is it real?", not "is it big?" — those are different questions.
- It is **not** a measure of how important or interesting the finding is. Statistical significance and practical importance are not the same thing.

Keep that straight and the rest of the lesson is just choosing the right test for the shape of your question.`},{type:"example",packages:["scipy"],dataFiles:["strength.csv"],caption:"Independent t-test: is the squat difference between men and women real?",code:`import pandas as pd
from scipy import stats

df = pd.read_csv('data/strength.csv')
men   = df[df['sex'] == 'M']['squat_strength']
women = df[df['sex'] == 'F']['squat_strength']

t, p = stats.ttest_ind(men, women)

print(f"Men:   n={len(men)}, mean={men.mean():.1f} kg")
print(f"Women: n={len(women)}, mean={women.mean():.1f} kg")
print(f"t = {t:.2f},  p = {p:.4f}")`},{type:"md",md:`---

## Independent t-Test: Two Separate Groups

The test above compared **two separate groups of different individuals** — men and women in the strength dataset. These are two *independent* samples: no athlete appears in both groups. The right tool is \`scipy.stats.ttest_ind\`.

Reading the result:
- Men average **137.5 kg** (n = 10), women **80.7 kg** (n = 7) — a raw gap of about 57 kg.
- **t ≈ 3.92.** The t-statistic is, roughly, the size of the gap measured in units of its own uncertainty; bigger absolute values mean the groups are further apart relative to their scatter.
- **p ≈ 0.0014.** Well below 0.05 — a gap this large would arise by chance less than two times in a thousand. We reject the null: men squat significantly more than the women in this sample.

> **Report the means *and* the test.** Always pair the p-value with the two group means and their direction so the sentence carries both the evidence and the finding.`},{type:"exercise",id:"ex-6-50",title:"Men vs Women: Squat Strength",domain:"physiology",packages:["scipy"],dataFiles:["strength.csv"],description:"Test whether `squat_strength` differs between the sexes. Run an independent-samples t-test, store the p-value (rounded to 4 decimals) in `p` and a boolean `significant` that is True when p < 0.05. Print each.",initialCode:`import pandas as pd
from scipy import stats

df = pd.read_csv('data/strength.csv')
men = df[df['sex'] == 'M']['squat_strength']
women = df[df['sex'] == 'F']['squat_strength']`,testCode:`_t, _p = stats.ttest_ind(df[df['sex']=='M']['squat_strength'], df[df['sex']=='F']['squat_strength'])
assert abs(p - round(_p, 4)) < 1e-4, f"p={p}"
assert significant == (round(_p, 4) < 0.05), f"significant={significant}"
print("PASS")`,hints:["stats.ttest_ind(group1, group2) returns (t, p). Round to 4 decimals and compare with 0.05.",`t, pval = stats.ttest_ind(men, ___)
p = round(pval, 4)
significant = p < 0.05

print(p)
print(significant)`]},{type:"md",md:`---

## Effect Size: Cohen's d

A significant p-value tells you a difference is **real**; it says nothing about whether it is **big**. With a large enough sample, a difference of no practical interest can still be "statistically significant". To describe the *magnitude* of a difference you need an **effect size**, and the standard one for comparing two means is **Cohen's d**.

Cohen's d expresses the gap between the two means in units of the typical scatter — "the groups differ by *d* standard deviations":

\`\`\`
d = (mean1 − mean2) / pooled_sd

pooled_sd = sqrt( ((n1 − 1) × s1² + (n2 − 1) × s2²) / (n1 + n2 − 2) )
\`\`\`

The **pooled standard deviation** is a sample-size-weighted blend of the two groups' SDs. Conventional rough bands: d ≈ 0.2 small, d ≈ 0.5 medium, d ≈ 0.8 large.

> **Significance and magnitude are two separate questions.** Always report an effect size alongside the p-value. A result can be significant but trivial (large sample, tiny d) or non-significant but suggestive (small sample, sizeable d) — you only see which by reporting both.`},{type:"example",packages:["pandas"],dataFiles:["strength.csv"],caption:"Cohen's d for the squat sex difference — a nearly 2 SD gap.",code:`import pandas as pd
import numpy as np

df    = pd.read_csv('data/strength.csv')
men   = df[df['sex'] == 'M']['squat_strength']
women = df[df['sex'] == 'F']['squat_strength']

n1, n2 = len(men), len(women)
s1, s2 = men.std(ddof=1), women.std(ddof=1)   # sample SDs

pooled_sd = np.sqrt(((n1-1)*s1**2 + (n2-1)*s2**2) / (n1+n2-2))
d         = (men.mean() - women.mean()) / pooled_sd

print(f"pooled SD: {pooled_sd:.2f} kg")
print(f"Cohen's d: {d:.2f}")`},{type:"exercise",id:"ex-6-51",title:"Cohen's d: Squat Sex Difference",domain:"physiology",packages:["pandas"],dataFiles:["strength.csv"],description:"Compute Cohen's d for the squat strength difference between men and women (men minus women). Store the pooled SD (rounded to 2 decimals) in `pooled_sd` and Cohen's d (rounded to 2 decimals) in `cohens_d`. Print both.",initialCode:`import pandas as pd
import numpy as np

df = pd.read_csv('data/strength.csv')
men = df[df['sex'] == 'M']['squat_strength']
women = df[df['sex'] == 'F']['squat_strength']`,testCode:`import numpy as np
_n1,_n2 = len(men),len(women)
_s1,_s2 = men.std(ddof=1), women.std(ddof=1)
_ps = float(np.sqrt(((_n1-1)*_s1**2 + (_n2-1)*_s2**2) / (_n1+_n2-2)))
_d  = float((men.mean() - women.mean()) / _ps)
assert abs(pooled_sd - round(_ps, 2)) < 0.05, f"pooled_sd={pooled_sd}, expected ~{round(_ps,2)}"
assert abs(cohens_d  - round(_d,  2)) < 0.05, f"cohens_d={cohens_d}, expected ~{round(_d,2)}"
print("PASS")`,hints:["The pooled SD blends the two sample SDs weighted by n-1; d = (mean difference) / pooled SD.",`n1, n2 = len(men), len(women)
s1, s2 = men.std(ddof=1), women.std(ddof=1)

pooled_sd = round(float(np.sqrt(((n1-1)*s1**2 + (n2-1)*s2**2) / (n1+n2-___))), 2)
cohens_d = round(float((men.mean() - women.mean()) / pooled_sd), 2)

print(f"Pooled SD: {pooled_sd} kg")
print(f"Cohen's d: {cohens_d}")`]},{type:"md",md:'---\n\n## Paired t-Test: The Same Athletes Twice\n\nNow change the design. Instead of two separate groups, suppose you measure the **same athletes twice** — before and after an intervention. Each "after" value belongs to a specific athlete who also has a "before" value. The measurements are **paired**. The right tool is `scipy.stats.ttest_rel` (`rel` for *related* samples).\n\nThe paired test is stronger because it never compares one athlete to another. It looks only at each athlete\'s **own change** (`post − pre`), so the large differences *between* athletes cancel out entirely. This removes between-athlete nuisance variation and exposes the within-athlete effect.\n\n> **Match the test to the design.** Two separate groups → `ttest_ind`. The same people measured twice (pre/post, left/right, two conditions) → `ttest_rel`. Using an independent test on paired data throws away the pairing and can hide a real effect.'},{type:"example",packages:["scipy"],dataFiles:[],caption:"Paired t-test on 10 athletes before and after a plyometric block.",code:`from scipy import stats
import numpy as np

# CMJ height (cm) for 10 athletes — same athlete at each index
pre  = [31.2, 35.8, 29.4, 38.1, 33.0, 36.5, 30.7, 34.2, 32.9, 37.4]
post = [34.0, 38.1, 32.7, 40.5, 36.2, 38.0, 33.9, 37.5, 35.1, 40.2]

t, p = stats.ttest_rel(post, pre)

print(f"Mean pre:         {np.mean(pre):.2f} cm")
print(f"Mean post:        {np.mean(post):.2f} cm")
print(f"Mean improvement: {np.mean(post)-np.mean(pre):.2f} cm")
print(f"t = {t:.2f},  p = {p:.2e}")`},{type:"exercise",id:"ex-6-52",title:"Paired t-Test on CMJ Pre/Post",domain:"coaching",packages:["scipy"],dataFiles:[],description:"A 6-week plyometric block was run on 10 athletes. Their CMJ heights (cm) were: `pre = [31.2, 35.8, 29.4, 38.1, 33.0, 36.5, 30.7, 34.2, 32.9, 37.4]` and `post = [34.0, 38.1, 32.7, 40.5, 36.2, 38.0, 33.9, 37.5, 35.1, 40.2]`. Run a paired t-test. Store the mean improvement (post − pre, rounded to 2 decimals) in `mean_diff` and a boolean `improved` that is True when the paired p-value < 0.05. Print both.",initialCode:`from scipy import stats
import numpy as np

pre  = [31.2, 35.8, 29.4, 38.1, 33.0, 36.5, 30.7, 34.2, 32.9, 37.4]
post = [34.0, 38.1, 32.7, 40.5, 36.2, 38.0, 33.9, 37.5, 35.1, 40.2]`,testCode:`import numpy as np
_t, _p = stats.ttest_rel(post, pre)
_md = round(float(np.mean(post) - np.mean(pre)), 2)
assert abs(mean_diff - _md) < 0.02, f"mean_diff={mean_diff}, expected {_md}"
assert improved == (_p < 0.05), f"improved={improved}"
print("PASS")`,hints:["The same athletes measured twice means paired data -- stats.ttest_rel(post, pre).",`t, pval = stats.ttest_rel(post, ___)
mean_diff = round(float(np.mean(post) - np.mean(pre)), 2)
improved = pval < 0.05

print(mean_diff)
print(improved)`]},{type:"md",md:`---

## One-Way ANOVA: Three or More Groups

The t-test compares exactly **two** groups. The training log records average heart rate across **four** session types — Endurance, Interval, Strength, and Match. The tool for comparing three or more group means at once is **one-way ANOVA** (Analysis of Variance), \`scipy.stats.f_oneway\`.

Build one array of values per session type and pass them all to the function using \`*groups\` (the splat unpacks the list so each group becomes a separate argument). ANOVA returns an **F-statistic** and a **p-value**.

The F-statistic is, loosely, the ratio of *between-group* variation to *within-group* variation: when the groups are spread far apart relative to the scatter inside each, F is large and p is small.

### Why not just run lots of t-tests?

With four groups you could run a t-test on every pair — that is six separate tests. **Don't.** Every test carries a 5% false-positive risk. With six independent tests the probability of at least one false alarm climbs to about **26%**, not 5%. This is the **multiple-comparisons problem**.

ANOVA solves this by asking **one** combined question — "do *any* of these groups differ?" — in a single test at a single 5% risk.

> **For three or more groups, start with one ANOVA, not a pile of t-tests.** After a significant ANOVA, follow with a post-hoc test (e.g. Tukey's HSD) that corrects for multiple comparisons to find *which* pairs differ.`},{type:"example",packages:["scipy"],dataFiles:["training_log.csv"],caption:"One-way ANOVA: does mean HR differ across session types?",code:`import pandas as pd
from scipy import stats

df = pd.read_csv('data/training_log.csv').dropna(subset=['Avg_HR'])

groups = [g['Avg_HR'].values for _, g in df.groupby('Session_Type')]
F, p   = stats.f_oneway(*groups)

print(df.groupby('Session_Type')['Avg_HR'].mean().round(1))
print(f"\\nF = {F:.1f},  p = {p:.2e}")`},{type:"exercise",id:"ex-6-53",title:"Heart Rate Across Session Types",domain:"coaching",packages:["scipy"],dataFiles:["training_log.csv"],description:"Use one-way ANOVA to test whether mean `Avg_HR` differs across the four session types in the training log. Drop missing `Avg_HR` rows first. Store the F-statistic (rounded to 2 decimals) in `F` and a boolean `sig` that is True when the ANOVA p-value < 0.05. Print both.",initialCode:`import pandas as pd
from scipy import stats

df = pd.read_csv('data/training_log.csv').dropna(subset=['Avg_HR'])`,testCode:`_g = [g['Avg_HR'].values for _, g in df.groupby('Session_Type')]
_F, _p = stats.f_oneway(*_g)
assert abs(F - round(_F, 2)) < 0.05, f"F={F}, expected ~{round(_F,2)}"
assert sig == (_p < 0.05), f"sig={sig}"
print("PASS")`,hints:["Build one array per session type with groupby, then unpack the list into f_oneway with the * splat.",`groups = [g["Avg_HR"].values for _, g in df.groupby("Session_Type")]

Fval, pval = stats.f_oneway(*___)
F = round(Fval, 2)
sig = pval < 0.05

print(F)
print(sig)`]},{type:"md",md:`---

## Checking the Assumptions

t-tests and ANOVA are **parametric** tests that trust two assumptions:

- **Approximate normality** — values within each group should be roughly normally distributed. Check with \`scipy.stats.shapiro(group)\`: p < 0.05 is evidence *against* normality.
- **Similar spread (homogeneity of variance)** — groups should have roughly comparable standard deviations.

When these assumptions are clearly violated, switch to a **non-parametric** alternative:

| Parametric test | Non-parametric alternative |
|-----------------|----------------------------|
| Independent t-test (2 groups) | **Mann-Whitney U** (\`stats.mannwhitneyu\`) |
| One-way ANOVA (3+ groups) | **Kruskal-Wallis** (\`stats.kruskal\`) |`},{type:"example",packages:["scipy"],dataFiles:["strength.csv"],caption:"Shapiro-Wilk test on each squat group before trusting the t-test.",code:`import pandas as pd
from scipy import stats

df    = pd.read_csv('data/strength.csv')
men   = df[df['sex'] == 'M']['squat_strength']
women = df[df['sex'] == 'F']['squat_strength']

sm, pm = stats.shapiro(men)
sf, pf = stats.shapiro(women)

print(f"Men:   Shapiro p = {pm:.3f}  {'normal' if pm >= 0.05 else 'NOT normal'}")
print(f"Women: Shapiro p = {pf:.3f}  {'normal' if pf >= 0.05 else 'NOT normal'}")`},{type:"exercise",id:"ex-6-54",title:"Normality Check Before t-Test",domain:"teaching",packages:["scipy"],dataFiles:["strength.csv"],description:"Run Shapiro-Wilk normality tests on the men's and women's `squat_strength` groups. Store the men's p-value (rounded to 3 decimals) in `p_men` and the women's (rounded to 3 decimals) in `p_women`. Store booleans `men_normal` and `women_normal` (True when p ≥ 0.05). Print all four.",initialCode:`import pandas as pd
from scipy import stats

df = pd.read_csv('data/strength.csv')
men = df[df['sex'] == 'M']['squat_strength']
women = df[df['sex'] == 'F']['squat_strength']`,testCode:`_sm, _pm = stats.shapiro(men)
_sf, _pf = stats.shapiro(women)
assert abs(p_men   - round(_pm, 3)) < 0.005, f"p_men={p_men}"
assert abs(p_women - round(_pf, 3)) < 0.005, f"p_women={p_women}"
assert men_normal   == (round(_pm, 3) >= 0.05), f"men_normal={men_normal}"
assert women_normal == (round(_pf, 3) >= 0.05), f"women_normal={women_normal}"
print("PASS")`,hints:["Run stats.shapiro on each group; a group counts as normal when its rounded p is at least 0.05.",`_, pm = stats.shapiro(men)
_, pf = stats.shapiro(___)

p_men = round(pm, 3)
p_women = round(pf, 3)
men_normal = p_men >= 0.05
women_normal = p_women >= 0.05

print(p_men, men_normal)
print(p_women, women_normal)`]},{type:"md",md:`---

## Summary

| Situation | Test | scipy function |
|-----------|------|----------------|
| Two separate groups of different people | Independent t-test | \`stats.ttest_ind(a, b)\` |
| Same people measured twice (pre/post) | Paired t-test | \`stats.ttest_rel(after, before)\` |
| How big is the difference? | Cohen's d | \`(m1 − m2) / pooled_sd\` (by hand) |
| Three or more groups at once | One-way ANOVA | \`stats.f_oneway(*groups)\` |
| Two groups, normality broken | Mann-Whitney U | \`stats.mannwhitneyu(a, b)\` |
| Several groups, normality broken | Kruskal-Wallis | \`stats.kruskal(*groups)\` |

Group comparison comes down to two decisions: **match the test to the design** (separate groups vs the same people twice; two groups vs several), and **report magnitude alongside significance** (an effect size next to every p-value). A p-value tells you a difference is unlikely to be chance; an effect size tells you whether it matters.

In the next lesson, we model outcomes that arrive as counts — injuries, goals, illnesses — with Poisson regression.`}],quiz:{id:"quiz-6-4",title:"t-Tests and ANOVA Quiz",questions:[{id:"q1",type:"multiple-choice",question:"You measure the same 12 athletes before and after a training block and want to know if their sprint times improved. Which test fits this design?",options:[{value:"a",label:"An independent-samples t-test (ttest_ind), because you are comparing before against after"},{value:"b",label:"A paired-samples t-test (ttest_rel), because each after value belongs to the same athlete as a before value"},{value:"c",label:"A one-way ANOVA, because there is more than one measurement per athlete"},{value:"d",label:"No test is needed; just compare the two means directly"}],correctAnswer:"b",explanation:"The same athletes are measured twice, so the two columns are paired — each after value is matched to the same athlete's before value. ttest_rel uses that pairing, comparing each athlete to themselves and cancelling out between-athlete variation."},{id:"q2",type:"multiple-choice",question:"A t-test comparing two groups returns p = 0.03. What does this p-value mean?",options:[{value:"a",label:"There is a 3% probability that the two groups are actually the same"},{value:"b",label:"If there were truly no difference between the groups, a gap at least this large would occur about 3% of the time by chance"},{value:"c",label:"The difference between the groups is 3% of the larger mean"},{value:"d",label:"97% of the athletes differ between the two groups"}],correctAnswer:"b",explanation:"The p-value is computed assuming the null hypothesis (no real difference) is true, and gives the probability of seeing a difference at least this big by chance. It is NOT the probability that the null is true."},{id:"q3",type:"multiple-choice",question:"Why should you report an effect size such as Cohen's d alongside the p-value?",options:[{value:"a",label:"The p-value tells you whether a difference is real but not how big it is; the effect size measures the magnitude"},{value:"b",label:"The effect size is just another name for the p-value, so it confirms the result"},{value:"c",label:"Cohen's d replaces the p-value and makes the significance test unnecessary"},{value:"d",label:"Effect sizes are required only when the p-value is above 0.05"}],correctAnswer:"a",explanation:"Significance and magnitude are different questions. A p-value answers 'is the difference real?' but a trivial difference can be significant with a large enough sample. Cohen's d expresses the gap in standard-deviation units."},{id:"q4",type:"multiple-choice",question:"You have four groups to compare. Why run a single one-way ANOVA rather than a separate t-test on every pair of groups?",options:[{value:"a",label:"ANOVA is the only test that can handle continuous data"},{value:"b",label:"Each t-test carries a false-positive risk, and running many of them inflates the overall chance of a false positive; ANOVA asks one combined question at a controlled error rate"},{value:"c",label:"Pairwise t-tests are mathematically impossible with more than two groups"},{value:"d",label:"ANOVA always produces a smaller p-value, so it is more likely to find significance"}],correctAnswer:"b",explanation:"Every test at p < 0.05 has a 5% false-positive risk, and the more tests you run the higher the chance that at least one fires by luck (six pairwise tests give roughly a 26% family-wise error rate). ANOVA asks 'do any groups differ?' in one test at one controlled 5% risk."},{id:"q5",type:"multiple-choice",question:"A one-way ANOVA across four session types comes back significant (p < 0.05). What does a post-hoc test such as Tukey's HSD add?",options:[{value:"a",label:"It re-checks whether the ANOVA p-value was calculated correctly"},{value:"b",label:"It tells you which specific pairs of groups differ, since ANOVA only shows that at least one group differs somewhere"},{value:"c",label:"It converts the F-statistic into an effect size"},{value:"d",label:"It tests whether the data is normally distributed"}],correctAnswer:"b",explanation:"A significant ANOVA says at least one group mean differs but not which one(s). A post-hoc test like Tukey's HSD compares the pairs of groups — while correcting for multiple comparisons — to pinpoint where the differences actually lie."}]}},"poisson-regression":{blocks:[{type:"md",md:`# Poisson Regression

## Count Outcomes

A lot of the most important numbers in sport are **counts**: injuries in a season, goals in a match, illnesses across a squad, falls in a gymnastics routine, line breaks in a rugby game. A count is a whole number that starts at zero — you can record 0, 1, 2, 3 injuries, but never 2.4 of them and never −1.

Counts have three features that set them apart from the continuous measurements (jump height, VO2max, squat strength) you have modelled so far:

- They are **discrete** — only the whole numbers 0, 1, 2, … are possible.
- They are **non-negative** — the floor is zero.
- They are usually **right-skewed with many zeros** — in a single season most players pick up no injuries at all, a handful pick up one or two, and the occasional unlucky athlete picks up several.

> **Why counts are not normally distributed.** A normal distribution is continuous, symmetric, and runs from minus infinity to plus infinity. Injury counts are none of those things: they are whole numbers, they cannot go below zero, and they are lopsided. Forcing a method that assumes normality onto count data is the mistake the rest of this lesson exists to avoid.`},{type:"example",packages:["pandas"],dataFiles:["team_injuries.csv"],caption:"Load the injury data and see the typical count distribution.",code:`import pandas as pd

df = pd.read_csv('data/team_injuries.csv')
print(df.shape)                                      # (84, 6)
print(df[['Position', 'Exposure_hours', 'Injuries']].head(4))
print("\\nInjury distribution:")
print(df['Injuries'].value_counts().sort_index())`},{type:"exercise",id:"ex-6-55",title:"Explore the Injury Data",domain:"coaching",packages:["pandas"],dataFiles:["team_injuries.csv"],description:"Load `team_injuries.csv`. For each position, compute the mean injury count per player-season (mean of `Injuries`). Store the **Goalkeeper** mean (rounded to 3 decimals) in `gk_mean`. Print it.",initialCode:`import pandas as pd

df = pd.read_csv('data/team_injuries.csv')`,testCode:`_m = df.groupby('Position')['Injuries'].mean()
_gk = round(float(_m['Goalkeeper']), 3)
assert abs(gk_mean - _gk) < 0.005, f"gk_mean={gk_mean}, expected ~{_gk}"
print("PASS")`,hints:['groupby("Position")["Injuries"].mean() gives one mean per position -- index the result with the position name.',`pos_means = df.groupby("Position")["Injuries"].mean()
gk_mean = round(float(pos_means["___"]), 3)
print(gk_mean)`]},{type:"md",md:`---

## Why Linear Regression Is Wrong for Counts

You already know how to fit a straight line with linear regression, so why not just regress the injury count on your predictors? Because a straight line makes two promises that count data cannot keep.

**First, a line runs off to negative infinity.** Linear regression fits \`y = a + b × x\` with no floor, so for small enough \`x\` it will predict a *negative* count. That is a logical impossibility.

**Second, a line mis-models the variance.** Linear regression assumes the scatter around the line is *constant*. Counts do not behave that way — variability is tied to the average: when the expected count is near zero the values barely vary; when the expected count is larger the values spread out more.

> **A line is the wrong shape for a count.** We need a model that keeps predictions non-negative and ties the variance to the mean — and that is exactly what Poisson regression does.`},{type:"example",packages:["statsmodels"],dataFiles:["team_injuries.csv"],caption:"A linear model predicts negative injury counts — impossible.",code:`import pandas as pd
import statsmodels.api as sm

df = pd.read_csv('data/team_injuries.csv')
gk = df[df['Position'] == 'Goalkeeper']

X      = sm.add_constant(gk[['Exposure_hours']])
linfit = sm.OLS(gk['Injuries'], X).fit()

pred_90h = linfit.params['const'] + linfit.params['Exposure_hours'] * 90
print(f"intercept: {linfit.params['const']:.3f}")
print(f"Predicted injuries at 90 h: {pred_90h:.2f}  <- impossible!")`},{type:"md",md:`---

## The Poisson Model and Exposure Offset

**Poisson regression** is a type of **generalised linear model (GLM)** built for counts. Its central trick is to model the expected count on a **log scale**:

\`\`\`
log(expected count) = a + b × x
\`\`\`

Recovering the expected count by exponentiating — \`exp(a + b × x)\` — guarantees it is always **positive**. The Poisson distribution also has its variance equal to its mean, so the spread grows with the expected count exactly as real counts do.

### Accounting for exposure

A defender who played **300 hours** had far more opportunity to get hurt than a substitute who played only **90 hours**. Comparing raw counts is unfair. We want to model the **injury rate per hour of exposure**.

The fix is an **offset**: compute \`log(Exposure_hours)\` and hand it to the model as a term whose coefficient is **fixed at exactly 1**. This converts the model of the *count* into a model of the *rate*:

\`\`\`
log(expected count) = a + b × x + 1 × log(exposure)
  → log(count / exposure) = a + b × x
  → models the rate per hour
\`\`\`

> **An offset models a rate, not a count.** When the opportunity to record an event differs between rows, put the log of exposure in as an offset. It turns the Poisson GLM into a model of the event *rate* per unit of exposure.`},{type:"example",packages:["statsmodels"],dataFiles:["team_injuries.csv"],caption:"Poisson GLM: injury rate per hour by position (Defender is the baseline).",code:`import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf

df = pd.read_csv('data/team_injuries.csv')
df['log_exposure'] = np.log(df['Exposure_hours'])

model = smf.glm("Injuries ~ C(Position)", data=df,
                family=sm.families.Poisson(),
                offset=df['log_exposure']).fit()
print(model.summary())`},{type:"exercise",id:"ex-6-56",title:"Fit the Poisson Rate Model",domain:"coaching",packages:["statsmodels"],dataFiles:["team_injuries.csv"],description:"Fit a Poisson GLM of `Injuries` on `C(Position)` using `log(Exposure_hours)` as an offset. Store the rate ratio (exp of the coefficient) for **Forwards** relative to the Defender baseline (rounded to 2 decimals) in `rr_forward`. Print it.",initialCode:`import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf

df = pd.read_csv('data/team_injuries.csv')
df['log_exposure'] = np.log(df['Exposure_hours'])`,testCode:`_m = smf.glm("Injuries ~ C(Position)", data=df, family=sm.families.Poisson(), offset=df['log_exposure']).fit()
_fwd = [k for k in _m.params.index if 'Forward' in k][0]
_rr = round(float(np.exp(_m.params[_fwd])), 2)
assert abs(rr_forward - _rr) < 0.03, f"rr_forward={rr_forward}, expected ~{_rr}"
print("PASS")`,hints:['smf.glm with family=sm.families.Poisson() and offset=df["log_exposure"]; exponentiate the Forward coefficient with np.exp to get the rate ratio.',`model = smf.glm("Injuries ~ C(Position)", data=df,
                family=sm.families.Poisson(),
                offset=df["log_exposure"]).fit()

fwd_key = [k for k in model.params.index if "Forward" in k][0]
rr_forward = round(float(np.___(model.params[fwd_key])), 2)
print(rr_forward)`]},{type:"md",md:`---

## Interpreting Rate Ratios

The coefficients are on the **log scale** — awkward to read directly. The trick that makes a Poisson model interpretable: **exponentiate a coefficient to turn it into a rate ratio**.

A **rate ratio** is a multiplier on the baseline group's rate, for the same exposure. With \`C(Position)\`, statsmodels uses the **alphabetically first** level as the reference — here **Defender**. The real rate ratios from this model are approximately:

- **Forward: 1.04** — injured at essentially the same rate as Defenders.
- **Goalkeeper: 0.31** — injured at only about one-third the rate of Defenders.
- **Midfielder: 0.94** — near-identical to Defenders.

The real story: **goalkeepers get injured far less often than outfield players**, while defenders, midfielders, and forwards have broadly similar injury rates. This matches football intuition — keepers spend far less time in the high-impact running and tackling that hurts field players.

The p-values back this up: Forward and Midfielder coefficients are nowhere near significant (p ≈ 0.93 and 0.88), and even the Goalkeeper effect is only borderline (p ≈ 0.06) given how few injuries the 17 keepers accumulated.

> **Exponentiate to get a rate ratio.** Raw Poisson coefficients live on the log scale; \`exp(coef)\` converts each into a rate ratio — a multiplier on the baseline rate. A rate ratio of 1 means "no difference from the baseline"; above 1 means a higher rate; below 1 a lower rate. Always state the baseline explicitly, or your ratios have no anchor.`},{type:"exercise",id:"ex-6-57",title:"Goalkeeper Rate Ratio",domain:"physiology",packages:["statsmodels"],dataFiles:["team_injuries.csv"],description:"Using the same Poisson model (Injuries ~ C(Position) with log_exposure offset), extract the rate ratio for **Goalkeepers** relative to Defenders (rounded to 2 decimals) and store it in `rr_gk`. Also extract the Goalkeeper p-value (rounded to 3 decimals) into `p_gk`. Print both.",initialCode:`import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf

df = pd.read_csv('data/team_injuries.csv')
df['log_exposure'] = np.log(df['Exposure_hours'])`,testCode:`_m = smf.glm("Injuries ~ C(Position)", data=df, family=sm.families.Poisson(), offset=df['log_exposure']).fit()
_gk = [k for k in _m.params.index if 'Goalkeeper' in k][0]
_rr = round(float(np.exp(_m.params[_gk])), 2)
_p  = round(float(_m.pvalues[_gk]), 3)
assert abs(rr_gk - _rr) < 0.03, f"rr_gk={rr_gk}, expected ~{_rr}"
assert abs(p_gk  - _p)  < 0.01, f"p_gk={p_gk}, expected ~{_p}"
print("PASS")`,hints:["Same model as before; np.exp(coefficient) gives the rate ratio and model.pvalues holds the p-value.",`model = smf.glm("Injuries ~ C(Position)", data=df,
                family=sm.families.Poisson(),
                offset=df["log_exposure"]).fit()

gk_key = [k for k in model.params.index if "Goalkeeper" in k][0]
rr_gk = round(float(np.exp(model.params[gk_key])), 2)
p_gk = round(float(model.___[gk_key]), 3)

print(rr_gk)
print(p_gk)`]},{type:"md",md:`---

## A Variable That Looks Plausible but Isn't

It is tempting to add every plausible predictor and assume each one matters. **Age** is an obvious candidate — you might expect older players to break down more often. Let us add it and see what the model says.

The model will answer this question honestly, and the answer here is sobering: once exposure and position are accounted for, age tells us **nothing** about injury rate in this dataset. A variable being *plausible* does not make it a *predictor*. The model is how you find out which hunches the data actually supports.

> **Not every plausible variable predicts the outcome.** A non-significant p-value on a sensible-sounding variable is a real finding, not a failure. Let the model — not your expectations — decide which variables earn their place.`},{type:"example",packages:["statsmodels"],dataFiles:["team_injuries.csv"],caption:"Adding Age: a plausible predictor that turns out to be non-significant.",code:`import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf

df = pd.read_csv('data/team_injuries.csv')
df['log_exposure'] = np.log(df['Exposure_hours'])

model_age = smf.glm("Injuries ~ C(Position) + Age", data=df,
                    family=sm.families.Poisson(),
                    offset=df['log_exposure']).fit()

print(f"Age coefficient: {model_age.params['Age']:.4f}")
print(f"Age p-value:     {model_age.pvalues['Age']:.3f}")
print("(p >> 0.05 — Age adds nothing once exposure and position are in the model)")`},{type:"exercise",id:"ex-6-58",title:"Test Age as a Predictor",domain:"teaching",packages:["statsmodels"],dataFiles:["team_injuries.csv"],description:"Fit a Poisson GLM of `Injuries ~ C(Position) + Age` with `log_exposure` as an offset. Store the Age coefficient (rounded to 4 decimals) in `age_coef` and the Age p-value (rounded to 3 decimals) in `age_p`. Store a boolean `age_significant` that is True when age_p < 0.05. Print all three.",initialCode:`import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf

df = pd.read_csv('data/team_injuries.csv')
df['log_exposure'] = np.log(df['Exposure_hours'])`,testCode:`_m = smf.glm("Injuries ~ C(Position) + Age", data=df, family=sm.families.Poisson(), offset=df['log_exposure']).fit()
_ac = round(float(_m.params['Age']), 4)
_ap = round(float(_m.pvalues['Age']), 3)
assert abs(age_coef - _ac) < 0.001, f"age_coef={age_coef}, expected ~{_ac}"
assert abs(age_p    - _ap) < 0.01,  f"age_p={age_p}, expected ~{_ap}"
assert age_significant == (_ap < 0.05), f"age_significant={age_significant}"
print("PASS")`,hints:['Add + Age to the formula; read the coefficient from model.params["Age"] and the p-value from model.pvalues["Age"].',`model_age = smf.glm("Injuries ~ C(Position) + ___", data=df,
                    family=sm.families.Poisson(),
                    offset=df["log_exposure"]).fit()

age_coef = round(float(model_age.params["Age"]), 4)
age_p = round(float(model_age.pvalues["Age"]), 3)
age_significant = age_p < 0.05

print(age_coef)
print(age_p)
print(age_significant)`]},{type:"exercise",id:"ex-6-59",title:"All Rate Ratios",domain:"biomechanics",packages:["statsmodels"],dataFiles:["team_injuries.csv"],description:"Fit the Poisson position model (no Age) with log_exposure offset. Compute rate ratios for all four positions: Defender (exp of Intercept gives the baseline rate per hour — **not** a rate ratio), Forward, Goalkeeper, and Midfielder. Store the Midfielder rate ratio (rounded to 2 decimals) in `rr_mid`. Also compute the ratio of rr_gk to rr_mid (i.e. how many times lower is the goalkeeper rate relative to midfielders), rounded to 2 decimals, stored in `gk_vs_mid`. Print both.",initialCode:`import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf

df = pd.read_csv('data/team_injuries.csv')
df['log_exposure'] = np.log(df['Exposure_hours'])`,testCode:`_m = smf.glm("Injuries ~ C(Position)", data=df, family=sm.families.Poisson(), offset=df['log_exposure']).fit()
_mk = [k for k in _m.params.index if 'Midfielder' in k][0]
_gk = [k for k in _m.params.index if 'Goalkeeper' in k][0]
_rm = round(float(np.exp(_m.params[_mk])), 2)
_gm = round(float(np.exp(_m.params[_gk])) / float(np.exp(_m.params[_mk])), 2)
assert abs(rr_mid    - _rm) < 0.03, f"rr_mid={rr_mid}, expected ~{_rm}"
assert abs(gk_vs_mid - _gm) < 0.05, f"gk_vs_mid={gk_vs_mid}, expected ~{_gm}"
print("PASS")`,hints:["Exponentiate both coefficients; the goalkeeper-vs-midfielder comparison is the ratio of their two rate ratios.",`model = smf.glm("Injuries ~ C(Position)", data=df,
                family=sm.families.Poisson(),
                offset=df["log_exposure"]).fit()

mid_key = [k for k in model.params.index if "Midfielder" in k][0]
gk_key = [k for k in model.params.index if "Goalkeeper" in k][0]

rr_mid = round(float(np.exp(model.params[mid_key])), 2)
gk_vs_mid = round(float(np.exp(model.params[gk_key])) / float(np.exp(model.params[___])), 2)

print(rr_mid)
print(gk_vs_mid)`]},{type:"md",md:`---

## Summary

| Idea | What it means |
|------|---------------|
| When to use Poisson | The outcome is a **count** (injuries, goals, illnesses) — whole numbers ≥ 0, right-skewed, many zeros — or a **rate** of such events |
| Why not linear regression | A line predicts impossible negative or fractional counts; counts have variance tied to the mean |
| The model | Poisson regression models \`log(expected count)\`, so \`exp(...)\` keeps every prediction positive |
| Offset | \`log(exposure)\` added as an offset (coefficient fixed at 1) converts a count model into a **rate** model — events per unit of exposure |
| Rate ratio | \`exp(coef)\` is a **rate ratio**: a multiplier on the baseline rate (1 = no difference, >1 higher, <1 lower), relative to the reference category |
| Fitting | \`smf.glm("y ~ C(group)", family=sm.families.Poisson(), offset=log_exp).fit()\` |

Poisson regression is the right tool whenever your outcome is a count or a rate of events. Model the log of the expected count so predictions stay non-negative, use a log-exposure offset to turn counts into fair per-hour rates, and exponentiate the coefficients to read them as rate ratios against a stated baseline. And remember: the model, not your intuition, decides which predictors actually matter — a plausible variable that comes back non-significant has told you something real.

That completes Module 6. In the final module, you put everything together in complete projects — from raw data files to finished analyses.`}],quiz:{id:"quiz-6-5",title:"Poisson Regression Quiz",questions:[{id:"q1",type:"multiple-choice",question:"For which kind of outcome is Poisson regression the right choice rather than ordinary linear regression?",options:[{value:"a",label:"A continuous, symmetric measurement such as jump height in centimetres"},{value:"b",label:"A count or rate of events — whole numbers >= 0 such as injuries per season or goals per match"},{value:"c",label:"A yes/no outcome such as whether an athlete passed a fitness test"},{value:"d",label:"A ranking of athletes from first to last place"}],correctAnswer:"b",explanation:"Poisson regression is built for count outcomes — whole numbers from zero upward, often right-skewed with many zeros — and for rates of such events."},{id:"q2",type:"multiple-choice",question:"In a Poisson model you add log(Exposure_hours) as an offset. What does that offset accomplish?",options:[{value:"a",label:"It models the rate of events per unit of exposure by fixing the exposure coefficient at 1, instead of modelling the raw count"},{value:"b",label:"It removes any rows where exposure is missing"},{value:"c",label:"It standardises exposure to a z-score so positions are comparable"},{value:"d",label:"It lets the model estimate a free coefficient for exposure like any other predictor"}],correctAnswer:"a",explanation:"An offset is a term whose coefficient is fixed at 1 rather than estimated. Putting log(exposure) in as an offset turns the model into a model of the rate per unit of exposure."},{id:"q3",type:"multiple-choice",question:"After exponentiating a Poisson coefficient you get a rate ratio of 2.0 for one group relative to the baseline. What does that mean?",options:[{value:"a",label:"That group has exactly 2 more events than the baseline group"},{value:"b",label:"That group is injured at twice the rate of the baseline group, for the same exposure"},{value:"c",label:"The model explains twice as much variance for that group"},{value:"d",label:"The p-value for that group is 2.0"}],correctAnswer:"b",explanation:"A rate ratio is a multiplier on the baseline rate. A rate ratio of 2.0 means the group experiences events at twice the baseline rate for the same exposure."},{id:"q4",type:"multiple-choice",question:"Why are injury counts not well described by a normal distribution?",options:[{value:"a",label:"They are always large numbers far from zero"},{value:"b",label:"They are discrete whole numbers that cannot go below zero and are typically right-skewed, with their variance tied to the mean"},{value:"c",label:"They are measured on a continuous scale with a fixed upper limit"},{value:"d",label:"They are perfectly symmetric around their average"}],correctAnswer:"b",explanation:"A normal distribution is continuous, symmetric, and unbounded with a constant variance. Counts are discrete whole numbers with a hard floor at zero, are usually right-skewed, and have a variance that grows with the mean."}]}}};export{e as lessons};
