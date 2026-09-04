const e={"project-overview":{blocks:[{type:"md",md:`# Project Overview

## Putting It All Together

Throughout Modules 1-6, you have learned the core Python tools used in sport science research and practice:

| Module | Skills |
|--------|--------|
| **Module 1** | Why coding matters, file paths, using AI, the coding environment |
| **Module 2** | Variables, data types, lists, dictionaries, NumPy arrays, importing and exporting data |
| **Module 3** | Reading errors, error types, debugging |
| **Module 4** | Conditionals, loops, and functions |
| **Module 5** | Cleaning data, summarising it, and Matplotlib visualisation |
| **Module 6** | Descriptive and inferential statistics (t-tests, ANOVA, regression) |

In this final module, you will apply **all of these skills** to two real sport science analysis projects. These are simplified versions of analyses that sport scientists perform routinely in research labs and professional sport settings.

---

## Project 1: Rate of Torque Development (RTD) Analysis

### Background

**Rate of Torque Development (RTD)** measures how quickly an athlete can produce force during a contraction. It is an important metric in sport science because:

- It reflects the ability to produce force rapidly, which is critical for explosive movements (sprinting, jumping, change of direction)
- It is sensitive to neuromuscular fatigue and can be used to monitor training adaptation
- It helps distinguish between athletes who produce the same peak force but at different speeds

You will work with a **real recording** exported from an isokinetic dynamometer (\`data/isok30.csv\`): a single knee-extension trial in which the machine moves the knee from 86 degrees of flexion toward full extension at a fixed speed while measuring the torque the athlete produces.

### What You Will Do

1. **Load** a real torque-time recording from a CSV file and inspect it
2. **Write helper functions** to find indices and thresholds in the signal
3. **Detect the onset** of the contraction using a threshold method
4. **Calculate RTD** at fixed early time windows (0-50ms, 0-100ms, 0-200ms from onset)
5. **Find peak RTD** from the first derivative of the torque signal
6. **Create a publication-quality visualisation** with annotations

### Key Concepts

- **Isokinetic contraction**: The dynamometer moves the joint at a constant angular velocity while the athlete pushes; torque is recorded as the limb travels through its range
- **Torque onset**: The moment the athlete begins to push — defined as when the torque signal rises a set amount above the resting baseline
- **RTD**: The slope of the torque-time curve (change in torque / change in time), typically reported in Nm/s
- **Peak RTD**: The maximum instantaneous RTD, found from the first derivative of the torque signal

---

## Project 2: GPS Trail Analysis

### Background

**GPS tracking** is ubiquitous in team sports and endurance activities. GPS units (worn by athletes or embedded in watches) record an athlete's position at regular intervals, from which we can calculate:

- **Displacement** between time points
- **Speed** (instantaneous and average)
- **Total distance** covered
- **Movement patterns** and activity zones

You will work with a **real session** exported from a GPS unit (\`data/gps_session.csv\`): 272 fixes recorded every 10 seconds over about 45 minutes, as the athlete moved along a winding point-to-point route roughly 4.6 km long. The positions are already **projected into metres** (Easting and Northing), so no latitude/longitude trigonometry is needed — the straight-line distance between two fixes is a plain Euclidean distance.

### What You Will Do

1. **Load** the real GPS file with pandas and inspect it — including discovering that its Speed and Distance columns shipped empty
2. **Calculate displacement** between consecutive fixes as a straight-line (Euclidean) distance in metres
3. **Derive speed** from displacement and time, and the cumulative distance
4. **Create visualisations**: a movement path plot and a speed-time plot

### Key Concepts

- **Projected coordinates**: This unit reports position as Easting/Northing in metres on a flat map grid, rather than raw latitude/longitude — so distances are computed directly with the Pythagorean theorem
- **Displacement**: The straight-line distance between two consecutive GPS fixes, \`sqrt(dEast^2 + dNorth^2)\`
- **Deriving missing metrics**: Real exports are often incomplete — this file's Speed and Distance columns are empty, so we compute them ourselves from position and time
- **Sampling rate**: This session was logged at 0.1 Hz (one fix every 10 s); team-sport units run faster (1-10 Hz) for finer speed estimates

---

## What Makes These Capstone Projects Different

Unlike the exercises in previous modules where you practiced one skill at a time, these projects require you to:

1. **Combine multiple skills** in a single workflow
2. **Think about the analysis pipeline** from raw data to final result
3. **Write helper functions** that you then use in later steps
4. **Create multi-panel figures** that tell a complete story
5. **Interpret the results** in a sport science context

Each project is broken into sequential steps. The code you write in early steps is needed in later steps, just like in real analysis work.

A note on tools: these projects deliberately use NumPy beyond the brief introduction in Module 2. High-frequency signals like a 2000 Hz torque trace are exactly where NumPy, rather than pandas, is the right tool, and each new function is explained at the moment it is needed.

---

## Tips for Success

- **Read each step carefully** before writing code
- **Test your code at each step** before moving to the next
- **Use print statements** to verify intermediate results
- **Refer back to previous modules** if you need to review a specific skill
- **The exercises build on each other** — make sure each step works before proceeding

Good luck! These projects represent the kind of work that sport scientists do every day using Python.`},{type:"md",md:"## Preview: The RTD Dataset\n\nBefore diving into the full project, here is a quick look at the isokinetic recording you will be analysing. The file `data/isok30.csv` contains three columns — Time (s), Torque (Nm), and Angle (degrees) — recorded at 2000 Hz for about 4.27 seconds."},{type:"example",packages:["numpy","matplotlib"],dataFiles:["isok30.csv"],caption:"Quick preview of the isokinetic torque-time recording — the raw signal you will analyse in Project 1.",code:`import numpy as np
import matplotlib.pyplot as plt

# Load the real isokinetic recording
data = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time   = data[:, 0]   # Time in seconds
torque = data[:, 1]   # Torque in Nm
angle  = data[:, 2]   # Knee angle in degrees

print(f"Samples: {len(time)},  Duration: {time[-1]:.2f} s")
print(f"Sampling rate: {1/np.median(np.diff(time)):.0f} Hz")
print(f"Peak torque: {torque.max():.1f} Nm  at t = {time[np.argmax(torque)]:.3f} s")
print(f"Angle sweep: {angle[0]:.0f} deg -> {angle[-1]:.0f} deg")

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6), sharex=True)

ax1.plot(time, torque, 'b-', linewidth=1.2)
ax1.set_ylabel('Torque (Nm)')
ax1.set_title('Isokinetic Recording: Preview')
ax1.grid(True, alpha=0.3)

ax2.plot(time, angle, 'g-', linewidth=1.2)
ax2.set_ylabel('Knee Angle (deg)')
ax2.set_xlabel('Time (s)')
ax2.grid(True, alpha=0.3)

plt.tight_layout()`},{type:"md",md:"## Preview: The GPS Dataset\n\nThe second project uses `data/gps_session.csv` — 272 GPS fixes recorded every 10 seconds. The athlete moved along a winding route from the origin (0, 0) to about (3004, 1682) m. Notice how the Speed and Distance columns shipped empty — you will derive them from the East/North positions."},{type:"example",packages:["pandas","matplotlib"],dataFiles:["gps_session.csv"],caption:"Quick look at the GPS session: the route plotted from East/North coordinates, with empty Speed/Distance columns confirmed.",code:`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/gps_session.csv')

# Which columns are entirely empty?
empty_cols = [c for c in df.columns if df[c].isna().all()]
print(f"Shape: {df.shape}")
print(f"Empty columns: {empty_cols}")
print(f"Fixes: {len(df)},  Duration: {df['Time'].iloc[-1]/60:.1f} min")
print(f"East range:  {df['East'].min()} to {df['East'].max()} m")
print(f"North range: {df['North'].min()} to {df['North'].max()} m")

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(df['East'], df['North'], 'b-', linewidth=1.2, alpha=0.7)
ax.plot(df['East'].iloc[0],  df['North'].iloc[0],  'g^', markersize=12, label='Start')
ax.plot(df['East'].iloc[-1], df['North'].iloc[-1], 'rs', markersize=10, label='End')
ax.set_xlabel('East (m)')
ax.set_ylabel('North (m)')
ax.set_title('GPS Route Preview')
ax.set_aspect('equal')
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()`},{type:"md",md:"Both datasets are real, warts and all — that is the point. When you are ready, head into the next lesson to begin Project 1 with the torque recording."}],quiz:null},"rtd-analysis":{blocks:[{type:"md",md:`# Project: Rate of Torque Development Analysis

## Introduction

In this project, you will analyse a **real torque-time recording** from a knee-extension test. The athlete was seated in an isokinetic dynamometer, which moves the knee from 86 degrees of flexion toward full extension at a fixed angular velocity while the athlete pushes as hard and as fast as possible. The torque sensor records the moment produced at the knee throughout the movement.

The recording lives in \`data/isok30.csv\` and has three columns:
- **Time** (seconds)
- **Torque** (newton-metres, Nm) — the moment produced at the knee joint
- **Angle** (degrees) — the knee-joint angle, which sweeps from ~86 degrees down to 0 as the leg extends

Because this is a single real trial rather than a generated curve, every number you compute is a genuine measurement — and you will see real-world details (a small pre-contraction dip, a torque peak partway through the range, a decline as the leg approaches full extension) that simulated data never shows.

Your goal is to:
1. Load and inspect the data
2. Write helper functions for signal analysis
3. Detect the onset of the contraction
4. Calculate Rate of Torque Development (RTD) at multiple time windows
5. Find peak RTD
6. Create a publication-quality annotated figure`},{type:"md",md:`---

## Step 1: Load and Inspect the Data

The first step in any analysis is loading the data and performing an initial inspection. We load the CSV with \`np.loadtxt()\`, skipping the header row, and split it into three named arrays.

### Understanding the Signal

A knee-extension torque signal has these phases:
1. **Baseline**: Near-zero torque before the contraction, while the leg rests against the lever
2. **Onset**: The moment the athlete begins to push
3. **Rising phase**: Torque increases rapidly
4. **Peak**: Maximum torque is reached partway through the range of motion
5. **Decline**: Torque falls as the knee approaches full extension

We load the file, split the columns, compute sampling characteristics, and characterise the baseline — all directly from the data, rather than assuming any fixed values.`},{type:"example",packages:["numpy"],dataFiles:["isok30.csv"],caption:"Loading the real isokinetic recording and printing a summary of its key properties.",code:`import numpy as np

# Load the real isokinetic recording (columns: Time, Torque, Angle)
data   = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time   = data[:, 0]      # Time in seconds
torque = data[:, 1]      # Torque in Nm
angle  = data[:, 2]      # Knee angle in degrees

# Sampling characteristics computed directly from the time column
n  = len(time)
dt = np.median(np.diff(time))   # Sampling interval (robust to tiny jitter)
fs = 1.0 / dt                   # Sampling rate in Hz

# Resting baseline: the first second of the recording is quiet
baseline_samples = 2000                            # 2000 samples = 1 s at 2000 Hz
baseline_mean    = torque[:baseline_samples].mean()
baseline_sd      = torque[:baseline_samples].std()

print(f"Number of samples: {n}")
print(f"Sampling interval: {dt*1000:.3f} ms  ->  {fs:.0f} Hz")
print(f"Duration: {time[-1]:.2f} s")
print(f"Baseline torque (first {baseline_samples} samples): {baseline_mean:.2f} +/- {baseline_sd:.3f} Nm")
print(f"Angle sweep: {angle[0]:.0f} deg -> {angle[-1]:.0f} deg")
print(f"Peak torque: {torque.max():.1f} Nm at t = {time[np.argmax(torque)]:.3f} s")`},{type:"exercise",id:"ex-7-20",title:"Import and Prepare Data",domain:"biomechanics",packages:["numpy"],dataFiles:["isok30.csv"],description:"The recording is loaded for you with `np`.loadtxt (columns Time, Torque, Angle).\n1. Split it into time, torque, and angle arrays.\n2. Compute n (number of samples), dt = `np.median(np.diff(time))`, and fs = 1/dt.\n3. Compute the baseline mean and SD from the first 2000 samples.\nThe print lines then report the number of samples, sampling rate, duration, baseline torque, and peak torque.",initialCode:`import numpy as np

# Load the real isokinetic recording (skip the header row)
data = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)`,testCode:`import numpy as np
assert n == 8540, f"Expected 8540 samples, got {n}"
assert abs(fs - 2000) < 1, f"Sampling rate should be ~2000 Hz, got {fs}"
assert abs(time[-1] - 4.27) < 0.05, "Duration should be ~4.27 s"
assert abs(baseline_mean - (-0.60)) < 0.2, f"Baseline mean should be near -0.60 Nm, got {baseline_mean}"
assert abs(torque.max() - 105.0) < 0.5, f"Peak torque should be ~105.0 Nm, got {torque.max()}"
print("PASS")`,hints:["Slice columns with data[:, i]. Sampling: dt = `np.median(np.diff(time))`, fs = 1/dt. The baseline statistics come from torque[:2000].",`time = data[:, 0]
torque = data[:, 1]
angle = data[:, 2]

n = len(time)
dt = np.median(np.diff(time))
fs = 1.0 / dt

baseline_mean = torque[:2000].___()
baseline_sd = torque[:2000].std()

print(f"Number of samples: {n}")
print(f"Sampling interval: {dt*1000:.3f} ms -> {fs:.0f} Hz")
print(f"Duration: {time[-1]:.2f} s")
print(f"Baseline torque (first 2000 samples): {baseline_mean:.2f} +/- {baseline_sd:.3f} Nm")
print(f"Peak torque: {torque.max():.1f} Nm at t = {time[np.argmax(torque)]:.3f} s")`]},{type:"md",md:`---

## Step 2: Helper Functions

Before we analyze the signal, we need a few utility functions we will reuse. These are common building blocks in signal analysis.

### get_index_at(time_array, target_time)

Given a time array, find the index of the sample closest to a target time. This is essential because we often need to look up data at specific time points.

### nearest(array, value)

Find the value in an array that is closest to a given target value.

### get_threshold(signal, baseline_samples, offset)

Calculate a threshold for onset detection from the baseline period. A **fixed offset** above the baseline mean (5 Nm) is more robust here than a noise-based SD method, because the baseline SD is tiny (~0.035 Nm) and there is a small pre-contraction dip that would otherwise fire a noise-based threshold prematurely.`},{type:"example",packages:["numpy"],dataFiles:["isok30.csv"],caption:"The three helper functions in action on the real recording.",code:`import numpy as np

data   = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time   = data[:, 0]
torque = data[:, 1]

def get_index_at(time_array, target_time):
    """Return the index of the sample closest to target_time."""
    return np.argmin(np.abs(time_array - target_time))

def nearest(array, value):
    """Return the element of array closest to value."""
    idx = np.argmin(np.abs(array - value))
    return array[idx]

def get_threshold(signal, baseline_samples=2000, offset=5.0):
    """Onset threshold = baseline mean + a fixed offset (Nm)."""
    baseline = signal[:baseline_samples]
    return baseline.mean() + offset

# Test all three
idx = get_index_at(time, 1.5)
print(f"Index at t=1.5s: {idx}  (time={time[idx]:.3f} s, torque={torque[idx]:.1f} Nm)")
print(f"Nearest torque to 50 Nm: {nearest(torque, 50):.1f} Nm")
threshold = get_threshold(torque, baseline_samples=2000, offset=5.0)
print(f"Onset threshold (baseline_mean + 5 Nm): {threshold:.2f} Nm")`},{type:"exercise",id:"ex-7-21",title:"Write Helper Functions",domain:"biomechanics",packages:["numpy"],dataFiles:["isok30.csv"],description:"Write the three helper functions used throughout the project:\n1. `get_index_at(time_array, target_time)`: the index of the sample closest to `target_time`.\n2. `nearest(array, value)`: the element of the array closest to value.\n3. `get_threshold(signal, baseline_samples=2000, offset=5.0)`: baseline mean + offset.\nThe test prints below try out each one.",initialCode:`import numpy as np

# Load the real isokinetic recording (skip the header row)
data = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time = data[:, 0]
torque = data[:, 1]`,testCode:`import numpy as np
_i = get_index_at(time, 1.5)
assert abs(time[_i] - 1.5) <= 0.0006, "get_index_at should land within one sample of t=1.5s"
assert get_index_at(time, 0.0) == 0, "get_index_at(time, 0.0) should return 0"
assert isinstance(nearest(torque, 50.0), (float, np.floating)), "nearest should return a number"
assert abs(nearest(torque, 50.0) - 50.0) < 1.0, "nearest(torque, 50) should be ~50 Nm on this signal"
_thr = get_threshold(torque, baseline_samples=2000, offset=5.0)
assert abs(_thr - 4.40) < 0.3, f"Threshold (baseline_mean + 5 Nm) should be ~4.40 Nm, got {_thr}"
print("PASS")`,hints:["All three functions build on the same tricks: `np.argmin(np.abs(...))` finds the closest sample, and the threshold is the baseline slice's mean plus the offset.",`def get_index_at(time_array, target_time):
    """Return the index of the sample closest to target_time."""
    return np.argmin(np.abs(time_array - target_time))

def nearest(array, value):
    """Return the element of array closest to value."""
    idx = np.argmin(np.abs(array - value))
    return array[idx]

def get_threshold(signal, baseline_samples=2000, offset=5.0):
    """Onset threshold = baseline mean + a fixed offset (Nm)."""
    baseline = signal[:baseline_samples]
    return baseline.mean() + ___

idx_15 = get_index_at(time, 1.5)
print(f"Index at t=1.5s: {idx_15}, time at that index = {time[idx_15]:.3f} s")
print(f"Nearest torque to 50 Nm: {nearest(torque, 50.0):.1f} Nm")
print(f"Onset threshold (baseline_mean + 5 Nm): {get_threshold(torque):.2f} Nm")`]},{type:"md",md:`---

## Step 3: Detect Contraction Onset

The onset is the first time point where the torque rises above the threshold. This is a critical step because all RTD calculations are referenced to the onset time.

We scan forward through the signal and find the first sample that exceeds the threshold. Because the rise is very steep in this recording, the exact onset is not sensitive to small changes in the threshold offset — shifting it by a couple of Nm moves the detected onset by only a sample or two.

\`\`\`python
threshold = get_threshold(torque, baseline_samples=2000, offset=5.0)
onset_idx = np.where(torque > threshold)[0][0]   # [0] = index array, [0] = first hit
onset_time   = time[onset_idx]
onset_torque = torque[onset_idx]
\`\`\`

This detects onset at **index 2279, t = 1.140 s** — right at the foot of the steep rise where the athlete starts pushing.`},{type:"example",packages:["numpy"],dataFiles:["isok30.csv"],caption:"Onset detection: finding the first sample where torque crosses above the baseline threshold.",code:`import numpy as np

data   = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time   = data[:, 0]
torque = data[:, 1]

def get_threshold(signal, baseline_samples=2000, offset=5.0):
    return signal[:baseline_samples].mean() + offset

# Detect onset
threshold    = get_threshold(torque, baseline_samples=2000, offset=5.0)
onset_idx    = np.where(torque > threshold)[0][0]
onset_time   = time[onset_idx]
onset_torque = torque[onset_idx]

# Also find peak torque to measure the onset-to-peak interval
peak_idx     = np.argmax(torque)
time_to_peak = time[peak_idx] - onset_time

print(f"Threshold: {threshold:.2f} Nm")
print(f"Onset: index {onset_idx},  t = {onset_time:.3f} s,  torque = {onset_torque:.1f} Nm")
print(f"Peak torque: {torque[peak_idx]:.1f} Nm at t = {time[peak_idx]:.3f} s")
print(f"Time from onset to peak: {time_to_peak*1000:.0f} ms")`},{type:"exercise",id:"ex-7-22",title:"Detect Contraction Onset",domain:"biomechanics",packages:["numpy"],dataFiles:["isok30.csv"],description:"The onset threshold (baseline mean + 5 Nm) is computed for you.\n1. Find `onset_idx`: the first sample where torque exceeds the threshold.\n2. Read off `onset_time` and `onset_torque`.\n3. Find `peak_idx` with `np`.argmax and compute `time_to_peak`.\nThe print statements are already in place.",initialCode:`import numpy as np

# Load the real isokinetic recording (skip the header row)
data = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time = data[:, 0]
torque = data[:, 1]

def get_threshold(signal, baseline_samples=2000, offset=5.0):
    bl = signal[:baseline_samples]
    return bl.mean() + offset

# The threshold: a fixed 5 Nm above the resting baseline
threshold = get_threshold(torque, baseline_samples=2000, offset=5.0)
print(f"Baseline mean: {torque[:2000].mean():.2f} Nm")
print(f"Baseline SD: {torque[:2000].std():.3f} Nm")
print(f"Onset threshold (mean + 5 Nm): {threshold:.2f} Nm")`,testCode:`import numpy as np
assert abs(threshold - 4.40) < 0.3, f"Threshold should be ~4.40 Nm, got {threshold}"
assert 2200 < onset_idx < 2360, f"Onset index should be ~2279, got {onset_idx}"
assert abs(onset_time - 1.140) < 0.01, f"Onset time should be ~1.140 s, got {onset_time}"
assert abs(time_to_peak - 0.733) < 0.02, f"Time onset->peak should be ~733 ms, got {time_to_peak*1000:.0f} ms"
print("PASS")`,hints:["`np.where(torque > threshold)`[0][0] gives the first sample above the threshold; `np.argmax(torque)` gives the peak index.",`onset_idx = np.where(torque > ___)[0][0]
onset_time = time[onset_idx]
onset_torque = torque[onset_idx]

print()
print("Onset detected at:")
print(f"  Index: {onset_idx}")
print(f"  Time: {onset_time:.3f} s")
print(f"  Torque: {onset_torque:.1f} Nm")

peak_idx = np.argmax(torque)
time_to_peak = time[peak_idx] - onset_time

print()
print(f"Peak torque: {torque[peak_idx]:.1f} Nm at t = {time[peak_idx]:.3f} s")
print(f"Time from onset to peak: {time_to_peak*1000:.0f} ms")`]},{type:"md",md:`---

## Step 4: Calculate RTD at Time Windows

RTD is typically calculated over fixed early time windows measured from onset: 0-50ms, 0-100ms, and 0-200ms. The formula is simple:

**RTD = (Torque at onset+window − Torque at onset) / window_duration**

The results increase across the windows (50ms → 100ms → 200ms) because the torque is still accelerating through the first 200 ms — the steepest part of the rise sits inside the largest window.

| Window | Approximate RTD |
|--------|----------------|
| 0-50ms | ~233 Nm/s |
| 0-100ms | ~299 Nm/s |
| 0-200ms | ~350 Nm/s |`},{type:"example",packages:["numpy"],dataFiles:["isok30.csv"],caption:"Computing windowed RTD at 50ms, 100ms, and 200ms from contraction onset.",code:`import numpy as np

data   = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time   = data[:, 0]
torque = data[:, 1]

def get_index_at(time_array, target_time):
    return np.argmin(np.abs(time_array - target_time))

def get_threshold(signal, baseline_samples=2000, offset=5.0):
    return signal[:baseline_samples].mean() + offset

threshold  = get_threshold(torque)
onset_idx  = np.where(torque > threshold)[0][0]
onset_time = time[onset_idx]

windows       = [0.050, 0.100, 0.200]
window_labels = ['0-50ms', '0-100ms', '0-200ms']

print("RTD at fixed time windows:")
print("-" * 45)
rtd_values = {}
for win, label in zip(windows, window_labels):
    end_idx   = get_index_at(time, onset_time + win)
    t_onset   = torque[onset_idx]
    t_end     = torque[end_idx]
    rtd       = (t_end - t_onset) / win
    rtd_values[label] = rtd
    print(f"  {label}: {rtd:7.1f} Nm/s  ({t_onset:.1f} -> {t_end:.1f} Nm)")

best_win = max(rtd_values, key=rtd_values.get)
print(f"\\nHighest RTD: {rtd_values[best_win]:.1f} Nm/s at {best_win}")`},{type:"exercise",id:"ex-7-23",title:"Calculate RTD Metrics",domain:"biomechanics",packages:["numpy"],dataFiles:["isok30.csv"],description:"Calculate RTD over three early time windows after onset: 0-50ms, 0-100ms, and 0-200ms. RTD = (`torque_at_end` - `torque_at_onset`) / `window_duration`. Store the results in a dictionary keyed by label and print each value, then print which window has the highest RTD.",initialCode:`import numpy as np

# Load the real isokinetic recording (skip the header row)
data = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time = data[:, 0]
torque = data[:, 1]

def get_index_at(time_array, target_time):
    return np.argmin(np.abs(time_array - target_time))

def get_threshold(signal, baseline_samples=2000, offset=5.0):
    return signal[:baseline_samples].mean() + offset

# Onset (from the previous step)
threshold = get_threshold(torque)
onset_idx = np.where(torque > threshold)[0][0]
onset_time = time[onset_idx]

# The three standard early windows (seconds)
windows = [0.050, 0.100, 0.200]
window_labels = ['0-50ms', '0-100ms', '0-200ms']
rtd_values = {}`,testCode:`import numpy as np
assert len(rtd_values) == 3, "Should have 3 RTD windows"
assert abs(rtd_values['0-50ms'] - 233.1) < 8.0, f"RTD 0-50ms should be ~233 Nm/s, got {rtd_values['0-50ms']}"
assert abs(rtd_values['0-100ms'] - 298.7) < 8.0, f"RTD 0-100ms should be ~299 Nm/s, got {rtd_values['0-100ms']}"
assert abs(rtd_values['0-200ms'] - 349.9) < 8.0, f"RTD 0-200ms should be ~350 Nm/s, got {rtd_values['0-200ms']}"
assert best_window == '0-200ms', f"0-200ms should have the highest RTD, got {best_window}"
print("PASS")`,hints:["For each window: find the end index with `get_index_at(time, onset_time + win)`, take the torque change from onset to that index, divide by the window length, and store it under the label.",`print("RTD at fixed time windows:")
print("-" * 45)

for win, label in zip(windows, window_labels):
    end_idx = get_index_at(time, onset_time + win)
    t_onset = torque[onset_idx]
    t_end = torque[end_idx]
    rtd = (t_end - t_onset) / ___
    rtd_values[label] = rtd
    print(f"  {label}: {rtd:8.1f} Nm/s  ({t_onset:.1f} -> {t_end:.1f} Nm)")

best_window = max(rtd_values, key=rtd_values.get)
print()
print(f"Highest RTD: {rtd_values[best_window]:.1f} Nm/s at {best_window}")`]},{type:"md",md:`---

## Step 5: Find Peak RTD

Peak RTD is the maximum instantaneous rate of torque change. We compute the first derivative of the torque signal with \`np.gradient(torque, time)\`, which gives the rate of change in Nm/s at every sample.

This recording is exceptionally clean (baseline SD ~ 0.035 Nm), so the raw gradient is smooth and we can read the peak directly — **no smoothing needed**. On a noisier signal you would smooth the derivative first, because differentiation amplifies noise.

\`\`\`python
rtd_signal    = np.gradient(torque, time)   # d(torque)/d(time) in Nm/s
peak_rtd_idx  = np.argmax(rtd_signal)
peak_rtd_value = rtd_signal[peak_rtd_idx]
peak_rtd_time  = time[peak_rtd_idx]
\`\`\`

Peak RTD comes out at about **437 Nm/s at t = 1.270 s** — roughly 130 ms after onset, while the torque is passing through ~47 Nm on its way up. That is exactly where you would expect the steepest slope: partway through the rise, not at onset and not at the peak.`},{type:"example",packages:["numpy"],dataFiles:["isok30.csv"],caption:"Computing peak RTD from the first derivative of the torque signal.",code:`import numpy as np

data   = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time   = data[:, 0]
torque = data[:, 1]

def get_threshold(signal, baseline_samples=2000, offset=5.0):
    return signal[:baseline_samples].mean() + offset

threshold  = get_threshold(torque)
onset_idx  = np.where(torque > threshold)[0][0]
onset_time = time[onset_idx]

# First derivative: d(torque)/d(time) at every sample
rtd_signal     = np.gradient(torque, time)
peak_rtd_idx   = np.argmax(rtd_signal)
peak_rtd_value = rtd_signal[peak_rtd_idx]
peak_rtd_time  = time[peak_rtd_idx]

print(f"Peak RTD:           {peak_rtd_value:.1f} Nm/s")
print(f"Time of peak RTD:   {peak_rtd_time:.3f} s")
print(f"Time after onset:   {(peak_rtd_time - onset_time)*1000:.0f} ms")
print(f"Torque at peak RTD: {torque[peak_rtd_idx]:.1f} Nm")`},{type:"exercise",id:"ex-7-24",title:"Find Peak RTD",domain:"biomechanics",packages:["numpy"],dataFiles:["isok30.csv"],description:"Compute the first derivative of the real torque signal with `rtd_signal` = `np.gradient(torque, time)` (Nm/s). This recording is clean enough that no smoothing is needed, so find the peak directly: `peak_rtd_idx` = `np.argmax(rtd_signal)`. Print the peak RTD value, the time it occurs, the time after onset in milliseconds, and the torque at that instant.",initialCode:`import numpy as np

# Load the real isokinetic recording (skip the header row)
data = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time = data[:, 0]
torque = data[:, 1]

def get_threshold(signal, baseline_samples=2000, offset=5.0):
    bl = signal[:baseline_samples]
    return bl.mean() + offset

threshold = get_threshold(torque)
onset_idx = np.where(torque > threshold)[0][0]
onset_time = time[onset_idx]
print(f"Onset time: {onset_time:.3f} s")`,testCode:`import numpy as np
assert isinstance(rtd_signal, np.ndarray), "rtd_signal should be a numpy array"
assert len(rtd_signal) == len(torque), "rtd_signal should have the same length as torque"
assert abs(peak_rtd_value - 437.3) < 5.0, f"Peak RTD should be ~437 Nm/s, got {peak_rtd_value}"
assert abs(peak_rtd_time - 1.270) < 0.01, f"Peak RTD should occur near t=1.270 s, got {peak_rtd_time}"
assert peak_rtd_time > onset_time, "Peak RTD should occur after onset"
print("PASS")`,hints:["`np.gradient(torque, time)` gives the instantaneous slope in Nm/s at every sample; `np`.argmax finds where it peaks. No smoothing is needed on this clean signal.",`rtd_signal = np.gradient(torque, ___)

peak_rtd_idx = np.argmax(rtd_signal)
peak_rtd_value = rtd_signal[peak_rtd_idx]
peak_rtd_time = time[peak_rtd_idx]

print(f"Peak RTD: {peak_rtd_value:.1f} Nm/s")
print(f"Time of peak RTD: {peak_rtd_time:.3f} s")
print(f"Time after onset: {(peak_rtd_time - onset_time)*1000:.0f} ms")
print(f"Torque at peak RTD: {torque[peak_rtd_idx]:.1f} Nm")`]},{type:"md",md:`---

## Step 6: Create the Final Visualisation

A publication-quality figure for RTD analysis typically shows the torque-time curve with onset and peak marked, the RTD time windows shaded, and the RTD signal (derivative) with peak RTD annotated.

We use a two-panel figure with a shared x-axis. The top panel gets more height (height_ratios [2, 1]) since the torque curve is the primary display:

\`\`\`python
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True,
                                gridspec_kw={'height_ratios': [2, 1]})
\`\`\`

**Top panel**: Torque curve + onset marker + peak marker + threshold line + colored window shading.
**Bottom panel**: RTD signal (gradient) + peak RTD annotation.

Scaffold tip: \`fig\` and the named axes (\`ax1\`, \`ax2\`) are graded via \`testCode\`, so make sure to name them exactly as shown.`},{type:"example",packages:["numpy","matplotlib"],dataFiles:["isok30.csv"],caption:"Complete two-panel RTD figure: torque curve on top, derivative signal on bottom.",code:`import numpy as np
import matplotlib.pyplot as plt

data   = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time   = data[:, 0];  torque = data[:, 1]

def get_index_at(arr, val): return np.argmin(np.abs(arr - val))
def get_threshold(sig, baseline_samples=2000, offset=5.0):
    return sig[:baseline_samples].mean() + offset

threshold   = get_threshold(torque)
onset_idx   = np.where(torque > threshold)[0][0]
onset_time  = time[onset_idx];  onset_torque = torque[onset_idx]
rtd_signal  = np.gradient(torque, time)
peak_rtd_idx = np.argmax(rtd_signal)
peak_rtd_value = rtd_signal[peak_rtd_idx];  peak_rtd_time = time[peak_rtd_idx]
peak_idx    = np.argmax(torque)
windows     = [0.050, 0.100, 0.200]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True,
                                gridspec_kw={'height_ratios': [2, 1]})

# Top panel: torque curve
ax1.plot(time, torque, 'b-', linewidth=1.5, label='Torque')
ax1.plot(onset_time, onset_torque, 'go', markersize=10, zorder=5)
ax1.annotate(f'Onset: {onset_time:.3f} s',
             xy=(onset_time, onset_torque),
             xytext=(onset_time - 0.4, onset_torque + 22), fontsize=10, color='green',
             arrowprops=dict(arrowstyle='->', color='green', lw=1.5))
ax1.plot(time[peak_idx], torque[peak_idx], 'rv', markersize=12, zorder=5)
ax1.annotate(f'Peak: {torque[peak_idx]:.0f} Nm',
             xy=(time[peak_idx], torque[peak_idx]),
             xytext=(time[peak_idx] + 0.25, torque[peak_idx] - 12), fontsize=10, color='red',
             arrowprops=dict(arrowstyle='->', color='red', lw=1.5))
ax1.axhline(y=threshold, color='gray', linestyle='--', alpha=0.5,
            label=f'Threshold: {threshold:.1f} Nm')
colors_w = ['#fde68a', '#fed7aa', '#fecaca']
for i, win in enumerate(windows):
    ax1.axvspan(onset_time, onset_time + win, alpha=0.18, color=colors_w[i])
ax1.set_ylabel('Torque (Nm)', fontsize=12)
ax1.set_title('Isokinetic Knee Extension: Torque-Time Curve', fontsize=13, fontweight='bold')
ax1.legend(loc='lower right', fontsize=10);  ax1.grid(True, alpha=0.3)
ax1.set_xlim(0.8, 3.0)

# Bottom panel: RTD signal
ax2.plot(time, rtd_signal, 'r-', linewidth=1.2, label='RTD = d(torque)/dt')
ax2.plot(peak_rtd_time, peak_rtd_value, 'rv', markersize=10, zorder=5)
ax2.annotate(f'Peak RTD: {peak_rtd_value:.0f} Nm/s',
             xy=(peak_rtd_time, peak_rtd_value),
             xytext=(peak_rtd_time + 0.25, peak_rtd_value * 0.72), fontsize=10, color='red',
             arrowprops=dict(arrowstyle='->', color='red', lw=1.5))
ax2.axhline(y=0, color='gray', linestyle='-', alpha=0.3)
ax2.set_xlabel('Time (s)', fontsize=12);  ax2.set_ylabel('RTD (Nm/s)', fontsize=12)
ax2.set_title('Rate of Torque Development', fontsize=13, fontweight='bold')
ax2.legend(loc='upper right', fontsize=10);  ax2.grid(True, alpha=0.3)
plt.tight_layout()`},{type:"exercise",id:"ex-7-25",title:"Create Final Visualisation",domain:"biomechanics",packages:["numpy","matplotlib"],dataFiles:["isok30.csv"],description:"Create a two-panel figure of the recording (stacked, sharing the x-axis), with the `axes` named `ax1` (top) and `ax2` (bottom):\n1. Top panel: the torque-time curve with onset marker (green dot), peak torque marker (red triangle), threshold line, and shaded RTD windows.\n2. Bottom panel: the RTD signal (`np`.gradient) with peak RTD annotated.\nAdd labels, titles, and legends.",initialCode:`import numpy as np
import matplotlib.pyplot as plt

# Load the recording and recompute everything from the previous steps
data = np.loadtxt('data/isok30.csv', delimiter=',', skiprows=1)
time = data[:, 0]
torque = data[:, 1]

def get_index_at(arr, val):
    return np.argmin(np.abs(arr - val))

def get_threshold(sig, baseline_samples=2000, offset=5.0):
    return sig[:baseline_samples].mean() + offset

threshold = get_threshold(torque)
onset_idx = np.where(torque > threshold)[0][0]
onset_time = time[onset_idx]
onset_torque = torque[onset_idx]

rtd_signal = np.gradient(torque, time)
peak_rtd_idx = np.argmax(rtd_signal)
peak_rtd_value = rtd_signal[peak_rtd_idx]
peak_rtd_time = time[peak_rtd_idx]
peak_idx = np.argmax(torque)

windows = [0.050, 0.100, 0.200]
window_labels = ['0-50ms', '0-100ms', '0-200ms']`,testCode:`assert len(fig.axes) == 2, f"Expected 2 axes (shared x), got {len(fig.axes)}"
assert len(ax1.lines) >= 1, "No lines on ax1 (torque panel)"
assert len(ax2.lines) >= 1, "No lines on ax2 (RTD panel)"
assert len(ax1.patches) >= 1, "No axvspan shading on ax1 (axvspan adds Polygon patches)"
print("PASS")`,hints:['Two stacked panels sharing x: `plt.subplots(2, 1, sharex=True, gridspec_kw={"height_ratios": [2, 1]})`. Torque trace, onset/peak markers, threshold line, and axvspan window shading go on `ax1`; the gradient signal and its peak marker go on `ax2`.',`fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True,
                                gridspec_kw={"height_ratios": [2, 1]})

ax1.plot(time, torque, "b-", linewidth=1.5, label="Torque")
ax1.plot(onset_time, onset_torque, "go", markersize=10)
ax1.plot(time[peak_idx], torque[peak_idx], "rv", markersize=12)
ax1.axhline(y=threshold, color="gray", linestyle="--", alpha=0.5)
colors_w = ["#fde68a", "#fed7aa", "#fecaca"]
for i, win in enumerate(windows):
    ax1.axvspan(onset_time, onset_time + win, alpha=0.18, color=colors_w[i])
ax1.set_ylabel("Torque (Nm)")
ax1.set_title("Isokinetic Knee Extension: Torque-Time Curve")
ax1.set_xlim(0.8, 3.0)

ax2.plot(time, rtd_signal, "r-", linewidth=1.2, label="RTD")
ax2.plot(peak_rtd_time, ___, "rv", markersize=10)
ax2.set_xlabel("Time (s)")
ax2.set_ylabel("RTD (Nm/s)")

plt.tight_layout()`]},{type:"md",md:`---

## Interpreting the Results

Running the full analysis on this real trial, you should see:

- **Onset detection** at ~1.14 s, catching the moment the athlete starts pushing, just above the resting level
- **RTD increasing across the early windows** (~233 → ~299 → ~350 Nm/s from 0-50ms to 0-200ms), because the torque is still accelerating through the first 200 ms
- **Peak RTD of ~437 Nm/s at ~1.27 s**, about 130 ms after onset — the steepest single point of the rise, occurring while torque passes ~47 Nm
- **Peak torque of ~105 Nm at ~1.87 s**, reached partway through the range, after which torque declines as the knee approaches full extension

### Clinical Relevance

| Metric | This trial | What it reflects |
|--------|-----------|------------------|
| Peak torque | ~105 Nm | Maximum strength capacity in this range |
| RTD 0-50ms | ~233 Nm/s | Very early force production |
| RTD 0-100ms | ~299 Nm/s | Early rapid force production |
| RTD 0-200ms | ~350 Nm/s | Most commonly reported window |
| Peak RTD | ~437 Nm/s | Steepest instantaneous rate |

Absolute values depend heavily on the joint, the device, and the contraction mode, so compare an athlete to their own history rather than to fixed cut-offs. What matters is the shape: a fast, early-peaking RTD curve indicates strong rapid force production, while a flatter rise (even to the same peak torque) points to slower force development — often a target for training or a marker of fatigue.

## Summary

In this project you:
1. Loaded a real isokinetic torque-time recording from CSV and inspected it
2. Wrote reusable helper functions (\`get_index_at\`, \`nearest\`, \`get_threshold\`)
3. Detected contraction onset with a fixed-offset threshold above the resting baseline
4. Calculated RTD over standard early time windows
5. Computed peak RTD from the first derivative of the torque signal
6. Created a two-panel annotated publication figure

In the next lesson, you tackle Project 2 — reconstructing a training session from raw GPS positions.`}],quiz:null},"gps-analysis":{blocks:[{type:"md",md:`# Project: GPS Trail Analysis

## Introduction

In this project, you will analyse a **real GPS session** exported from a tracking unit. The unit recorded the athlete's position every 10 seconds for about 45 minutes as they travelled along a winding point-to-point route. From these positions we reconstruct how the athlete moved — their path, speed, and total distance covered.

This type of analysis is used in:
- **Team sports**: Monitoring player workloads, movement patterns, and high-speed running distances
- **Endurance sports**: Analysing pacing strategies, elevation profiles, and route selection
- **Rehabilitation**: Tracking return-to-play progression through movement volume

Because this is a single real export rather than a generated path, you will meet a very common real-world detail right away: **the file's Speed and Distance columns are empty**. Rather than treat that as a dead end, we detect it explicitly and derive those quantities ourselves from the raw position and time.`},{type:"md",md:`---

## Step 1: Load and Inspect the Data

The session lives in \`data/gps_session.csv\`. We load it with pandas and look at what we actually received before computing anything.

### What the File Contains

The export has eight columns:
- **Time** (seconds) — 0, 10, 20, ... one fix every 10 seconds
- **East** (metres) — Easting, the position along the map's west-to-east axis
- **North** (metres) — Northing, the position along the south-to-north axis
- **East Displacement, North Displacement, Resultant Distance, Speed, Distance Traveled** — formula columns that were *meant* to hold per-step distance and speed

A key thing to notice: this unit reports position as **projected coordinates in metres** (Easting/Northing on a flat map grid), not raw latitude/longitude. That makes our life easier — the straight-line distance between two fixes is just the Pythagorean theorem on the East/North differences.

### The Empty-Columns Surprise

Look carefully at \`df.info()\`. The Time, East, and North columns are fully populated, but the five derived columns report **0 non-null values** — they are entirely empty. This is the data-quality catch of the session: the columns we would most like to read straight off (Speed, Distance) shipped with no data in them. We detect this explicitly and move on to compute those quantities ourselves.`},{type:"example",packages:["pandas"],dataFiles:["gps_session.csv"],caption:"Loading the GPS export and confirming which columns are trustworthy vs empty.",code:`import pandas as pd

df = pd.read_csv('data/gps_session.csv')

print("First few rows:")
print(df.head())
print()

# Which columns are completely empty (all NaN)?
empty_cols = [c for c in df.columns if df[c].isna().all()]
print(f"Empty columns: {empty_cols}")

# The trustworthy columns
time  = df['Time'].values    # seconds
east  = df['East'].values    # metres (Easting)
north = df['North'].values   # metres (Northing)

n_points = len(df)
duration = time[-1] - time[0]
dt       = pd.Series(time).diff().median()

print(f"\\nNumber of fixes: {n_points}")
print(f"Sampling interval: {dt:.0f} s")
print(f"Duration: {duration} s ({duration/60:.1f} min)")
print(f"East range:  {east.min()} to {east.max()} m")
print(f"North range: {north.min()} to {north.max()} m")
print(f"Start (E, N): ({east[0]}, {north[0]})  ->  End: ({east[-1]}, {north[-1]})")`},{type:"exercise",id:"ex-7-26",title:"Import GPS Data",domain:"coaching",packages:["pandas","numpy"],dataFiles:["gps_session.csv"],description:"The GPS export is loaded for you.\n1. Detect which columns are completely empty (all NaN) into `empty_cols`; you should find the five derived columns.\n2. Keep Time, East, and North as arrays: time, east, north.\n3. Compute `n_points`, duration (last Time minus first), and dt (the median of the Time differences).\nThe print lines then report the fixes, sampling interval, duration, coordinate ranges, and empty columns.",initialCode:`import pandas as pd
import numpy as np

# Load the real GPS export and inspect what we received
df = pd.read_csv('data/gps_session.csv')
print(df.head())
df.info()`,testCode:`import numpy as np
assert n_points == 272, f"Expected 272 fixes, got {n_points}"
assert duration == 2710, f"Duration should be 2710 s, got {duration}"
assert dt == 10, f"Sampling interval should be 10 s, got {dt}"
assert int(east.max()) == 3006, f"East max should be 3006 m, got {east.max()}"
assert int(north.max()) == 1686, f"North max should be 1686 m, got {north.max()}"
assert set(empty_cols) == {'East Displacement', 'North Displacement', 'Resultant Distance', 'Speed', 'Distance Traveled'}, f"The five derived columns should be all-NaN, got {empty_cols}"
print("PASS")`,hints:["A column is empty when `df`[c]`.isna()``.all()`. Extract arrays with `.values`; the sampling interval is the median of the Time differences.",`empty_cols = [c for c in df.columns if df[c].isna().___()]

time = df["Time"].values
east = df["East"].values
north = df["North"].values

n_points = len(df)
duration = time[-1] - time[0]
dt = pd.Series(time).diff().median()

print()
print(f"Number of fixes: {n_points}")
print(f"Sampling interval: {dt:.0f} s")
print(f"Duration: {duration} s ({duration/60:.1f} min)")
print(f"East range:  {east.min()} to {east.max()} m")
print(f"North range: {north.min()} to {north.max()} m")
print(f"Empty columns: {empty_cols}")`]},{type:"md",md:`---

## Step 2: Calculate Displacement, Speed, and Distance

Since the Speed and Distance columns came through empty, we derive them from the positions. The coordinates are already projected into metres, so the straight-line distance between two consecutive fixes is a plain Euclidean distance:

\`\`\`
dEast = East2 - East1
dNorth = North2 - North1
step_distance = sqrt(dEast^2 + dNorth^2)
\`\`\`

Note that \`np.diff\` returns one fewer value than the number of fixes: 272 fixes give **271** step distances and speeds.

### Speed Zones

We classify movement into speed zones sized honestly for this walking-pace session. The usual team-sport bands (jogging, running, sprinting) run past 5 m/s, but every step here sits below ~2 m/s, so we use zones that fit the actual data:

| Zone | Speed range |
|------|------------|
| Standing/very slow | 0 – 0.5 m/s |
| Slow | 0.5 – 1.0 m/s |
| Steady | 1.0 – 1.5 m/s |
| Brisk | 1.5 – 2.5 m/s |

Almost all of the session falls in the "Brisk" zone (~87%).`},{type:"example",packages:["pandas","numpy"],dataFiles:["gps_session.csv"],caption:"Deriving step distance, speed, and cumulative distance from the GPS coordinates.",code:`import pandas as pd
import numpy as np

df    = pd.read_csv('data/gps_session.csv')
time  = df['Time'].values
east  = df['East'].values
north = df['North'].values

# Euclidean step distances from consecutive projected coordinates
d_east  = np.diff(east)
d_north = np.diff(north)
step_dist    = np.sqrt(d_east**2 + d_north**2)
dt           = np.diff(time)        # 10 s per step throughout
speed        = step_dist / dt       # m/s
total_distance = step_dist.sum()
cum_distance   = np.cumsum(step_dist)

print(f"Total distance: {total_distance:.0f} m ({total_distance/1000:.2f} km)")
print(f"Mean speed: {speed.mean():.2f} m/s ({speed.mean()*3.6:.1f} km/h)")
print(f"Max speed:  {speed.max():.2f} m/s")
print(f"Min speed:  {speed.min():.2f} m/s")

zones = {
    'Standing/very slow (0-0.5 m/s)': (0, 0.5),
    'Slow (0.5-1.0 m/s)':             (0.5, 1.0),
    'Steady (1.0-1.5 m/s)':           (1.0, 1.5),
    'Brisk (1.5-2.5 m/s)':            (1.5, 2.5),
}
print("\\nTime in speed zones:")
for zone_name, (low, high) in zones.items():
    count = np.sum((speed >= low) & (speed < high))
    print(f"  {zone_name}: {count*10}s ({count/len(speed)*100:.1f}%)")`},{type:"exercise",id:"ex-7-27",title:"Calculate Displacements and Speed",domain:"coaching",packages:["pandas","numpy"],dataFiles:["gps_session.csv"],description:"The export's Speed and Distance columns are empty, so derive them from the positions (already in metres):\n1. `step_dist`: the straight-line (Euclidean) distance `sqrt(dEast^2 + dNorth^2)` between consecutive fixes.\n2. speed: each step distance divided by the 10-second interval.\n3. `total_distance` (the sum) and `cum_distance` (`np`.cumsum).\nThe print lines then report the distance, speed summary, and time in each speed zone (each fix is 10 s).",initialCode:`import pandas as pd
import numpy as np

# Load the session; keep the trustworthy columns as arrays
df = pd.read_csv('data/gps_session.csv')
time = df['Time'].values
east = df['East'].values
north = df['North'].values

# Speed zones sized for this walking-pace session
zones = {
    'Standing/very slow (0-0.5 m/s)': (0, 0.5),
    'Slow (0.5-1.0 m/s)': (0.5, 1.0),
    'Steady (1.0-1.5 m/s)': (1.0, 1.5),
    'Brisk (1.5-2.5 m/s)': (1.5, 2.5)
}`,testCode:`import numpy as np
assert len(step_dist) == 271, f"Should have 271 step distances, got {len(step_dist)}"
assert len(speed) == 271, f"Should have 271 speed values, got {len(speed)}"
assert len(cum_distance) == 271, f"cum_distance should have 271 values, got {len(cum_distance)}"
assert abs(total_distance - 4558.6) < 1.0, f"Total distance should be ~4558.6 m, got {total_distance:.1f}"
assert abs(cum_distance[-1] - total_distance) < 1e-6, "cum_distance[-1] should equal total_distance"
assert abs(speed.mean() - 1.68) < 0.05, f"Mean speed should be ~1.68 m/s, got {speed.mean():.3f}"
assert abs(speed.max() - 2.01) < 0.05, f"Max speed should be ~2.01 m/s, got {speed.max():.3f}"
assert abs(speed.min() - 0.22) < 0.05, f"Min speed should be ~0.22 m/s, got {speed.min():.3f}"
print("PASS")`,hints:["Each step is `sqrt(dEast² + dNorth²)` using `np`.diff on the positions; speed divides by `np.diff(time)`; the cumulative distance is `np`.cumsum of the steps.",`d_east = np.diff(east)
d_north = np.diff(north)
step_dist = np.sqrt(d_east**2 + d_north**___)

speed = step_dist / np.diff(time)
total_distance = step_dist.sum()
cum_distance = np.cumsum(step_dist)

print("Distance and Speed Summary:")
print(f"  Total distance: {total_distance:.0f} m ({total_distance/1000:.2f} km)")
print(f"  Mean speed: {speed.mean():.2f} m/s ({speed.mean()*3.6:.1f} km/h)")
print(f"  Max speed:  {speed.max():.2f} m/s ({speed.max()*3.6:.1f} km/h)")
print(f"  Min speed:  {speed.min():.2f} m/s")

print()
print("Time in speed zones:")
for zone_name, (low, high) in zones.items():
    count = np.sum((speed >= low) & (speed < high))
    pct = count / len(speed) * 100
    print(f"  {zone_name}: {count*10}s ({pct:.1f}%)")`]},{type:"md",md:`---

## Step 3: Create Movement Visualisations

### Path Plot

A path plot shows the athlete's trajectory on a 2-D plane, colour-coded by speed. Because the coordinates are already in metres, we plot North against East directly — no coordinate conversion is needed.

Since speed has one fewer value than there are fixes (from \`np.diff\`), we colour each step at the **midpoint** of the two fixes it connects:

\`\`\`python
east_mid  = (east[:-1] + east[1:]) / 2
north_mid = (north[:-1] + north[1:]) / 2
scatter = axes[0].scatter(east_mid, north_mid, c=speed, cmap='RdYlGn_r', s=18)
\`\`\`

### Speed-Time Plot

The right panel shows how speed varied over time. We add both the raw instantaneous speed and a 5-fix (50-second) rolling average for the overall trend, plus shaded speed zone backgrounds.`},{type:"example",packages:["pandas","numpy","matplotlib"],dataFiles:["gps_session.csv"],caption:"Complete side-by-side GPS figure: path coloured by speed (left) and speed-time profile (right).",code:`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df    = pd.read_csv('data/gps_session.csv')
time  = df['Time'].values;  east = df['East'].values;  north = df['North'].values
step_dist = np.sqrt(np.diff(east)**2 + np.diff(north)**2)
speed     = step_dist / np.diff(time)

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Left panel: path colored by speed
axes[0].plot(east, north, '-', color='gray', alpha=0.3, linewidth=0.8, zorder=1)
east_mid  = (east[:-1] + east[1:]) / 2
north_mid = (north[:-1] + north[1:]) / 2
scatter = axes[0].scatter(east_mid, north_mid, c=speed, cmap='RdYlGn_r',
                          s=18, vmin=0, vmax=speed.max())
axes[0].plot(east[0], north[0],   'g^', markersize=14, label='Start', zorder=5)
axes[0].plot(east[-1], north[-1], 'rs', markersize=12, label='End',   zorder=5)
axes[0].set_xlabel('East (m)');  axes[0].set_ylabel('North (m)')
axes[0].set_title('Movement Path (colored by speed)', fontsize=13, fontweight='bold')
axes[0].set_aspect('equal');  axes[0].grid(True, alpha=0.3);  axes[0].legend(fontsize=10)
plt.colorbar(scatter, ax=axes[0], label='Speed (m/s)')

# Right panel: speed over time
time_min = time[1:] / 60
axes[1].plot(time_min, speed, 'b-', linewidth=1.0, alpha=0.7, label='Speed')
window = 5
smooth_speed = np.convolve(speed, np.ones(window)/window, mode='valid')
smooth_time  = time_min[window//2:window//2+len(smooth_speed)]
axes[1].plot(smooth_time, smooth_speed, 'r-', linewidth=2, label='50s average')
axes[1].axhspan(0, 0.5,   alpha=0.10, color='gray')
axes[1].axhspan(0.5, 1.0, alpha=0.10, color='green')
axes[1].axhspan(1.0, 1.5, alpha=0.10, color='yellow')
axes[1].axhspan(1.5, 2.5, alpha=0.10, color='orange')
axes[1].set_xlabel('Time (min)');  axes[1].set_ylabel('Speed (m/s)')
axes[1].set_title('Speed Over Time', fontsize=13, fontweight='bold')
axes[1].legend(fontsize=10);  axes[1].grid(True, alpha=0.3)
axes[1].set_xlim(0, time[-1]/60)
plt.suptitle('GPS Training Session Analysis', fontsize=15, fontweight='bold')
plt.tight_layout()`},{type:"exercise",id:"ex-7-28",title:"Create Movement Visualisations",domain:"coaching",packages:["pandas","numpy","matplotlib"],dataFiles:["gps_session.csv"],description:'Create a side-by-side figure of the session, stored as `fig` and the `axes` array:\n1. Left panel: the movement path, North against East in metres, coloured by speed at the step midpoints, with start (green triangle) and end (red square) markers and equal aspect.\n2. Right panel: speed over time with a 5-fix (50-second) rolling average and shaded speed zone backgrounds.\nAdd the suptitle "GPS Training Session Analysis".',initialCode:`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load the session and derive speed/distance (from the previous step)
df = pd.read_csv('data/gps_session.csv')
time = df['Time'].values
east = df['East'].values
north = df['North'].values

step_dist = np.sqrt(np.diff(east)**2 + np.diff(north)**2)
speed = step_dist / np.diff(time)
total_distance = step_dist.sum()`,testCode:`assert len(fig.axes) >= 2, f"Expected at least 2 axes, got {len(fig.axes)}"
assert len(axes[0].collections) >= 1, "Left panel: no scatter/collections (speed-colored path)"
assert len(axes[1].lines) >= 1, "Right panel: no speed line plotted"
assert len(axes[1].patches) >= 1, "Right panel: no axhspan speed zones (axhspan adds Polygon patches)"
print("PASS")`,hints:["`fig`, `axes` = `plt.subplots(1, 2)`. Left: scatter the step midpoints coloured by speed, add start/end markers and equal aspect. Right: plot speed against time[1:]/60, add a 5-fix `np`.convolve rolling average and axhspan zone bands.",`fig, axes = plt.subplots(1, 2, figsize=(14, 6))

east_mid = (east[:-1] + east[1:]) / 2
north_mid = (north[:-1] + north[1:]) / 2
scatter = axes[0].scatter(east_mid, north_mid, c=___, cmap="RdYlGn_r", s=18)
axes[0].plot(east[0], north[0], "g^", markersize=14, label="Start")
axes[0].plot(east[-1], north[-1], "rs", markersize=12, label="End")
axes[0].set_aspect("equal")
axes[0].set_xlabel("East (m)")
axes[0].set_ylabel("North (m)")
plt.colorbar(scatter, ax=axes[0], label="Speed (m/s)")

time_min = time[1:] / 60
axes[1].plot(time_min, speed, "b-", alpha=0.7, label="Speed")
smooth_speed = np.convolve(speed, np.ones(5)/5, mode="valid")
smooth_time = time_min[2:2+len(smooth_speed)]
axes[1].plot(smooth_time, smooth_speed, "r-", linewidth=2, label="50s average")
axes[1].axhspan(1.5, 2.5, alpha=0.10, color="orange")
axes[1].set_xlabel("Time (min)")
axes[1].set_ylabel("Speed (m/s)")
axes[1].legend()

plt.suptitle("GPS Training Session Analysis")
plt.tight_layout()

print(f"Total distance: {total_distance:.0f} m ({total_distance/1000:.2f} km)")
print(f"Mean speed: {speed.mean():.2f} m/s ({speed.mean()*3.6:.1f} km/h)")
print(f"Max speed: {speed.max():.2f} m/s ({speed.max()*3.6:.1f} km/h)")`]},{type:"md",md:`---

## Interpreting the Results

### What to Look For

1. **Total distance**: A key workload metric. Here it is ~4.6 km over 45 minutes; in soccer, outfield players typically cover 9-13 km per match.
2. **Speed profile**: Shows when the athlete was moving steadily vs. slowing. This session is continuous walking-pace movement — the speed trace stays in a narrow band rather than spiking.
3. **Intensity distribution**: How time and distance split across the zones. Almost all of this session is "brisk" walking; a session built around running would shift mass into the higher zones.
4. **Path shape**: Reveals the route — here a single winding point-to-point trail rather than laps or shuttles.

### Limitations

- **GPS accuracy**: Consumer GPS units have ~2-5 m accuracy; sport-grade units achieve ~1 m. At a 10 s sampling interval, small position errors get smoothed out across each step.
- **Sampling rate**: This session was logged at one fix every 10 s, which captures the overall route and pace well but misses brief accelerations within a step; team sports prefer 10 Hz.
- **Derived speed**: Speed and distance here are computed from position, because the export's own columns were empty — so they inherit any position noise.
- **Indoor use**: GPS does not work indoors; local positioning systems (LPS) are used instead.

## Summary

In this project you:
1. Loaded a real GPS export with pandas and inspected it — discovering that its Speed and Distance columns shipped empty
2. Computed straight-line (Euclidean) displacements directly from the projected East/North metres
3. Derived instantaneous speed and cumulative distance from displacement and time
4. Classified movement into speed zones sized honestly for a walking-pace session
5. Created a two-panel visualisation: path plot (coloured by speed) and speed-time profile

This workflow — load, inspect, repair what is missing, then derive the metrics — is the foundation of all GPS-based training analysis in sport science, whether you are monitoring a football team, analysing a marathon runner's pacing, or tracking rehabilitation progress.

That completes Module 7 — and the course. You now own the complete workflow: load, inspect, repair, derive, analyse, and visualise real sport science data with Python.`}],quiz:{id:"quiz-7-3",title:"Module 7 Quiz: Capstone Projects",questions:[{id:"q1",type:"multiple-choice",question:"What does Rate of Torque Development (RTD) measure?",options:[{value:"a",label:"The maximum torque an athlete can produce"},{value:"b",label:"How quickly an athlete can produce force during a contraction"},{value:"c",label:"The time it takes for an athlete to fully relax after a contraction"},{value:"d",label:"The ratio of torque to body mass"}],correctAnswer:"b",explanation:"RTD measures the rate of change of torque over time (Nm/s), reflecting how quickly an athlete can develop force. This is critical for explosive movements like sprinting and jumping, where rapid force production matters more than peak force alone."},{id:"q2",type:"true-false",question:"In onset detection, the threshold is typically set as the baseline mean minus 3 standard deviations of the baseline signal.",options:[{value:"true",label:"True"},{value:"false",label:"False"}],correctAnswer:"false",explanation:"The threshold is set ABOVE the baseline (mean PLUS an offset), not below it. Common choices are a fixed offset in Nm (this project uses baseline mean + 5 Nm) or the baseline mean plus a few standard deviations. Either way it must sit above the resting noise so we detect when the signal rises, not falls."},{id:"q3",type:"multiple-choice",question:"Why are speed zones used in GPS-based training analysis?",options:[{value:"a",label:"To convert GPS coordinates from degrees to meters"},{value:"b",label:"To smooth out GPS measurement noise"},{value:"c",label:"To classify movement into intensity categories for workload monitoring"},{value:"d",label:"To calculate the total distance covered during a session"}],correctAnswer:"c",explanation:"Speed zones classify each moment of a session into intensity bands (e.g., walking, jogging, running, high-speed). This allows coaches and sport scientists to quantify how much time and distance an athlete spent at different intensities, which is essential for monitoring workload and managing injury risk."},{id:"q4",type:"multiple-choice",question:"The GPS file in this project reports position as projected Easting/Northing in metres, and its Speed and Distance columns are empty. How do you get the distance between two consecutive fixes?",options:[{value:"a",label:"Read it from the Resultant Distance column in the file"},{value:"b",label:"Convert latitude and longitude to metres with the equirectangular approximation"},{value:"c",label:"Take the straight-line (Euclidean) distance sqrt(dEast^2 + dNorth^2) on the projected metres"},{value:"d",label:"Multiply the speed column by the time between fixes"}],correctAnswer:"c",explanation:"Because the coordinates are already projected into metres, the distance between two fixes is just the Pythagorean theorem on the East and North differences — no latitude/longitude trigonometry is needed. Options that rely on the file's Speed or Distance columns fail here because those columns shipped empty, which is exactly why we derive distance and speed ourselves from East, North, and Time."},{id:"q5",type:"multiple-choice",question:"On a noisy torque signal, why might you smooth the RTD signal (the derivative) before finding peak RTD?",options:[{value:"a",label:"To make the signal longer so there are more data points to analyze"},{value:"b",label:"Because differentiation amplifies noise, and smoothing reduces spurious peaks"},{value:"c",label:"To convert the signal from Nm/s to Nm"},{value:"d",label:"To shift the peak RTD to occur earlier in time"}],correctAnswer:"b",explanation:"Taking the derivative (gradient) of a signal amplifies high-frequency noise, creating many small, meaningless spikes that can mask the true peak RTD. Smoothing with a moving average filters out this noise. The recording in this project is exceptionally clean, so its raw gradient can be read directly — but on a typical noisy dynamometer trace, smoothing the derivative first is essential."}]}}};export{e as lessons};
