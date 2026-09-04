const e={"why-programming":{blocks:[{type:"md",md:`# Why is Coding Important in Sport Science?

## Introduction

Modern sport science increasingly relies on data to drive decisions about training, performance, and athlete health. From daily perceived-load ratings collected across a whole squad, to injury reports and wellness questionnaires accumulating season after season, to force plates sampling at 1000 Hz, the sheer volume and complexity of data in sport science has outpaced what can be handled with spreadsheets alone.

Programming gives sport scientists the power to **automate repetitive tasks**, **analyse large datasets**, and **create reproducible research workflows**.

## Why Python?

Python has become the most popular programming language in science and data analysis. Here is why it is especially well-suited for sport science:

| Feature | Benefit for Sport Science |
|---------|--------------------------|
| Easy to learn | Readable syntax lets you focus on the science, not the code |
| Rich ecosystem | Libraries like NumPy, Pandas, and Matplotlib cover all your needs |
| Free and open-source | No expensive software licenses |
| Large community | Thousands of tutorials, forums, and packages available |
| Cross-platform | Works on Windows, Mac, and Linux |
| Integration | Connects with R, Excel, databases, and APIs |

## Real-World Applications

Below are examples from different corners of sport science. Keep in mind that these are just some of the many methods in each field that benefit from programming. Whatever your specialisation, there will be far more uses than we can list here.

### Biomechanics
Force plates, motion capture systems, and inertial measurement units (IMUs) generate enormous datasets. A force plate can sometimes record at up to 1000 Hz, meaning 1000 measurements per second, but with Python you can:

- Calculate peak force, rate of force development, and impulse automatically
- Process hundreds of trials in seconds
- Create publication-ready force-time curves

### Exercise Physiology
Metabolic carts, heart rate monitors, and lactate analysers produce time-series data that benefits from automated processing:

- Determine VO2max from incremental exercise tests
- Identify ventilatory thresholds
- Analyse heart rate variability (HRV) from R-R intervals
- Calculate training impulse (TRIMP) from session data

### Coaching and Performance Analysis
GPS and accelerometer data from team sports contain millions of data points per match:

- Calculate total distance, high-speed running distance, and sprint counts
- Analyse tactical patterns and formations
- Monitor weekly training load across a season with rolling summaries

### Sport Psychology
Survey data and behavioural observations can be analysed efficiently:

- Score and analyse questionnaires (e.g., CSAI-2, POMS, SMS-6)
- Perform statistical comparisons between groups or time points
- Visualise longitudinal changes in psychological constructs

### Teaching and Physical Education
Assessment and observation data from teaching contexts generate the kind of records that quickly outgrow a spreadsheet. With Python, a PE teacher can:

- Analyse class fitness-test batteries across a whole school year
- Score and summarise PE motivation surveys
- Build evidence for curriculum and lesson-plan choices
- Produce fair, transparent grading from objective test data

## What You Will Learn

In this course, you will progress from zero programming knowledge to being able to:

1. **Write Python scripts** to process and analyse sport science data
2. **Use NumPy** for efficient numerical computation with arrays
3. **Use Pandas** to work with tabular data like athlete databases
4. **Create visualisations** with Matplotlib for reports and publications
5. **Complete capstone projects** analysing real biomechanics and GPS data

## Comparing Approaches

Let us compare how a simple analysis task differs between a spreadsheet and Python.

**Task:** A CSV file holds 40 m sprint times for 20 athletes. Calculate the mean and standard deviation, then identify which athletes are more than 1 SD above the mean.

**Spreadsheet approach:**

- Open the file and check the data is in column A
- Use \`=AVERAGE(A1:A20)\` and \`=STDEV(A1:A20)\` in cells
- Create a helper column with \`=IF(A1 > mean + sd, "Slow", "OK")\`
- Copy the formula down 20 rows
- Manually adjust if new data arrives

**Python approach:** read the CSV file straight into Python, then ask for the mean, the standard deviation, and every athlete above the threshold. That is the whole job, a few short lines, shown in the runnable example below. The Python approach is **reproducible** (run it again with new data), **scalable** (works with 20 or 2000 athletes), and **documentable** (the code explains exactly what was done). The \`import pandas as pd\` line at the top brings in pandas, a library of ready-made data tools; what libraries are and how importing works is explained properly in Module 2:`},{type:"example",packages:["pandas"],dataFiles:["sprint_times.csv"],caption:"Complete sprint analysis: read the CSV, get mean and SD, flag athletes above the threshold.",code:`import pandas as pd                            # Import pandas, the standard library for data tables

df = pd.read_csv('data/sprint_times.csv')      # Read the whole CSV file into Python

mean = df['Sprint_40m_s'].mean()               # Mean of the sprint time column
sd = df['Sprint_40m_s'].std()                  # Standard deviation of the same column

slow = df[df['Sprint_40m_s'] > mean + sd]      # Keep only rows more than 1 SD above the mean
print(f"Mean: {mean:.2f} s, SD: {sd:.2f} s")
print()
print("Athletes more than 1 SD above the mean:")
print(slow.to_string(index=False))`},{type:"exercise",id:"ex-1-16",title:"Weekly Training Distance",domain:"coaching",description:"A runner's daily distances (km) for one week are stored in the list below. Use the built-in `sum()` function to add them up, then print the total.",initialCode:"distances_km = [8, 0, 11, 6, 0, 14, 5]",expectedOutput:"44",hints:["`sum()` adds up every number in a list.",`total_km = sum(___)
print(total_km)`]},{type:"exercise",id:"ex-1-17",title:"Training Intensity",domain:"coaching",description:"Training intensity is often expressed as a fraction of maximum heart rate: divide the session heart rate by the maximum heart rate. Both values are given below. Print the fraction rounded to 2 decimal places -- `round(value, 2)` does the rounding.",initialCode:`hr_bpm = 162
hr_max_bpm = 190`,expectedOutput:"0.85",hints:["Intensity is the session heart rate divided by the maximum heart rate.",`intensity = hr_bpm / ___
print(round(intensity, 2))`]},{type:"md",md:`## Summary

Programming is not about replacing your sport science expertise -- it is about amplifying it. By learning Python, you gain a tool that handles the tedious data processing so you can focus on interpreting results and making evidence-based decisions.

In the next lesson, we look at how to store, organise, and find your data files -- the foundation everything else in this course builds on.`}],quiz:null},"file-paths":{blocks:[{type:"md",md:`# File Paths: Storing, Organising, and Finding Data

## Why Files Rule a Sport Scientist's Life

Almost everything you do as a sport scientist ends up as a file. The timing gates save a \`.csv\` of sprint splits after every testing day. The lactate analyser produces a new export for each athlete's step test. The wellness questionnaire spits out a spreadsheet every Monday morning. Over a single season you can easily accumulate thousands of files across a dozen folders.

The problem is rarely producing the data -- it is **finding it again**. Picture this: it is three days before a squad meeting and your head coach asks for the countermovement jump trend for one athlete since pre-season. The data exists. Somewhere. But it is spread across folders called \`New folder\`, \`Stuff\`, and \`Final_DATA_use_this_one\`, half of it with names like \`export(3).csv\`. You lose an afternoon hunting for files instead of analysing them.

Programming makes this worse if you are disorganised, because **your code has to tell the computer exactly where each file lives**. A tidy file system is not housekeeping -- it is the foundation that lets your scripts run today, next month, and on a colleague's laptop. This lesson teaches you how paths work and how to organise your data so that you (and your code) can always find it.

---

## What a Path Is

A **path** is the address of a file. Just as a postal address narrows down from country to street to house number, a file path narrows down from drive to folder to file name.

![The four parts of a file path: drive, folders, file name, and extension](/images/module1/path-anatomy.svg)

A path has three parts:

- **Drive** -- the storage device, like \`C:\` on Windows. Mac and Linux do not show a drive letter; everything starts from \`/\`.
- **Folders** -- the nested directories you click through to reach the file.
- **File name and extension** -- the file itself. The part after the final dot (\`.csv\`) is the **extension**, and it tells you (and your programs) what kind of file it is.

The extension matters enormously. Python decides how to read a file partly based on it, and so do you at a glance. Here are the ones you will meet constantly in sport science:

| Extension | What it is | Sport science example |
|-----------|-----------|------------------------|
| \`.csv\` | Comma-separated values; plain-text table | Force plate export, GPS summary, training log |
| \`.xlsx\` | Excel workbook (can hold multiple sheets) | Wellness questionnaire with one tab per week |
| \`.json\` | Structured, nested text data | API response from a wearable platform |
| \`.txt\` | Plain text, no fixed structure | A README describing how data was collected |
| \`.py\` | A Python script | Your analysis code itself |

Of these, \`.csv\` is the friendliest for analysis because it is plain text -- any program can open it and it never gets locked into one vendor's format.

---

## Absolute vs Relative Paths

There are two ways to write a path, and choosing the right one will save you real pain.

An **absolute path** spells out the full address from the drive or root all the way down. It works only on the exact machine where that file lives.

\`\`\`
Windows:    C:\\Users\\petter\\projects\\cmj_study\\data\\athlete01.csv
Mac/Linux:  /Users/petter/projects/cmj_study/data/athlete01.csv
\`\`\`

Notice two differences between operating systems:

- Windows uses a **backslash** (\`\\\`) between folders; Mac and Linux use a **forward slash** (\`/\`).
- Windows starts from a drive letter (\`C:\`); Mac and Linux start from \`/\`.

A **relative path** describes where a file is *relative to where your code is currently running*. It does not mention the drive or your home folder at all:

\`\`\`
data/athlete01.csv
\`\`\`

This single line means "look inside the \`data\` folder next to me, and find \`athlete01.csv\`."

**Your code should almost always use relative paths with forward slashes.** Here is why:

- **It works on every machine.** \`C:\\Users\\petter\\...\` exists only on your computer. \`data/athlete01.csv\` works on yours, on your supervisor's Mac, and on a lab PC -- as long as the \`data\` folder travels with the project.
- **It survives sharing.** When you zip up a project and email it, or push it to a shared drive, absolute paths break instantly because nobody else has your exact folder layout. Relative paths keep working.
- **Forward slashes work everywhere.** Python accepts forward slashes on Windows too, so writing \`data/athlete01.csv\` is safe on every operating system. Backslashes also have a special meaning in Python text, which causes confusing errors -- another reason to avoid them.

If you ever see a path starting with \`C:\\\` or \`/Users/\` inside a script, treat it as a warning sign that the code will break the moment it leaves your computer.

---

## The Working Directory

Relative paths only make sense once you know what they are relative *to*. That reference point is called the **working directory** -- the folder your program considers "here" while it runs.

When you write \`pd.read_csv('data/training_log.csv')\`, Python does not search your whole hard drive. It starts from the working directory, looks for a folder called \`data\` inside it, and then for \`training_log.csv\` inside that. If your working directory is \`cmj_study\`, the file it actually opens is \`cmj_study/data/training_log.csv\`.

This is why the same script can run unchanged on three different computers: each person's working directory is different in absolute terms, but the *relative* journey from there to the data is identical. Get the working directory right and your relative paths just work. Get it wrong and Python complains it cannot find a file that is sitting right there -- it was simply looking from the wrong starting point.

---

## Organising a Research Project

A consistent folder structure makes every project predictable. You always know where the raw data is, where your scripts live, and where the outputs go. Here is a structure that scales from a small study to a full PhD:

\`\`\`
project/
├── data/
│   ├── raw/          <- original exports, never edited
│   └── processed/    <- cleaned data your scripts produce
├── scripts/          <- your Python (.py) files
├── figures/          <- plots and charts for reports
└── results/          <- tables, statistics, summaries
\`\`\`

The single most important rule:

**Raw data is read-only.**

The files in \`data/raw/\` are your ground truth -- the exact exports that came off the force plate or GPS unit. You never edit them, never overwrite them, never "just fix" a value by hand. Your scripts read from \`raw/\`, clean and transform the data, and write the results into \`processed/\`. If a cleaning step goes wrong, you can always start again from the untouched raw files. The day you accidentally overwrite a raw export with a half-cleaned version is the day you lose data you can never get back.

This separation also makes your work **reproducible**: anyone can take your raw data and your scripts and regenerate every processed file, figure, and result exactly.

---

## File-Naming Conventions

How you name files is as important as where you put them. Good names are readable by both humans and code, and they sort sensibly. Follow these rules:

- **No spaces.** Spaces cause problems in code and on the command line. Use underscores (\`_\`) or hyphens (\`-\`) instead.
- **ISO dates** (\`YYYY-MM-DD\`). Writing the date as \`2026-06-12\` means files sort into chronological order automatically. \`12-06-2026\` does not, and is also ambiguous between day-month and month-day.
- **Zero-padded numbers.** Use \`athlete01\`, not \`athlete1\`. Otherwise \`athlete10\` sorts before \`athlete2\`.
- **Descriptive, not cryptic.** A name should tell you what is inside without opening it.

Compare these real-world examples:

| Bad name | Why it is bad | Good name |
|----------|---------------|-----------|
| \`final_v2_REAL.xlsx\` | Version chaos; which one is actually final? | \`2026-06-12_wellness_squad.xlsx\` |
| \`CMJ data (copy).csv\` | Spaces and a meaningless "(copy)" | \`2026-06-12_cmj_athlete01.csv\` |
| \`test1.csv\` | Tells you nothing | \`2026-03-04_gps_match_vs_united.csv\` |
| \`Athlete 3 jump.csv\` | Space, no zero-padding, no date | \`2026-06-12_cmj_athlete03.csv\` |

A name like \`2026-06-12_cmj_athlete01.csv\` reads cleanly: the date, the test (countermovement jump), and the athlete. A folder full of names like this sorts itself by date, groups by test, and never leaves you guessing.

---

## Files in This Course

The code editor in this course ships with a \`data/\` folder holding the datasets you will analyse, and every time you load one you will write a **relative path** like \`data/training_log.csv\`, exactly the kind you will use in your own projects. You get to build one yourself in the exercise below.

In Python, paths are just strings. You can build them with ordinary string operations. Run the example below to see how simple it is:`},{type:"example",caption:"Building a file path from its parts using string concatenation.",code:`folder = "data/raw"
filename = "2026-06-12_cmj_athlete01.csv"

# Join folder and filename with a forward slash
full_path = folder + "/" + filename

print(full_path)`},{type:"exercise",id:"ex-1-20",title:"Build a Data File Path",domain:"teaching",description:"Build the relative path to a GPS export file from the folder and filename below. Store the full path in a variable called `file_path` and print it.",initialCode:`folder = "data/raw"
filename = "2026-06-18_gps_athlete03.csv"`,expectedOutput:"data/raw/2026-06-18_gps_athlete03.csv",hints:['Join the two strings with + and put "/" between them.',`file_path = folder + ___ + filename
print(file_path)`]},{type:"md",md:'Extracting just the filename from a longer path is equally straightforward. A path is a string of folder names separated by `/`. Splitting on `/` gives a list of parts, and the last part is always the filename. (Lists and the `[-1]` indexing below are covered properly in Module 2 -- for now, read `[-1]` as "the last item.")'},{type:"example",caption:"Extracting the filename from a full path by splitting on the separator.",code:`full_path = "data/raw/2026-06-12_cmj_athlete01.csv"

# Split on "/" and take the last element
parts = full_path.split("/")
filename = parts[-1]   # -1 means the last item in the list

print(filename)`},{type:"exercise",id:"ex-1-21",title:"Extract the Filename",domain:"teaching",description:'Given the path below, extract just the filename (the part after the final "/") and print it.',initialCode:'path = "data/processed/2026-06-18_gps_athlete03_clean.csv"',expectedOutput:"2026-06-18_gps_athlete03_clean.csv",hints:['Split the path on "/" -- the filename is the last piece of the result.',`filename = path.split("/")[___]
print(filename)`]},{type:"md",md:`## Summary

Files are the raw material of sport science, and a path is simply the address of a file. In this lesson you learned that:

- A path is made of a **drive**, **folders**, and a **file name with an extension**, and the extension tells you what kind of file it is.
- **Absolute paths** spell out the full address and only work on one machine; **relative paths** describe the route from your working directory and work everywhere.
- Always write **relative paths with forward slashes** so your code runs on any operating system and survives being shared.
- The **working directory** is the "here" your relative paths start from.
- Organise projects into \`data/raw\`, \`data/processed\`, \`scripts\`, \`figures\`, and \`results\`, and treat **raw data as read-only**.
- Name files with **no spaces, ISO dates, and zero-padded numbers** so they sort and read cleanly.

Good file habits feel like extra effort on day one and save you days of frustration by the end of a season. In the next lesson, we look at AI tools and how to use them well.`}],quiz:{id:"quiz-1-2",title:"File Paths Quiz",questions:[{id:"q1",type:"multiple-choice",question:"Which of these is a relative path?",options:[{value:"a",label:"C:\\Users\\petter\\data\\athlete01.csv"},{value:"b",label:"/Users/petter/data/athlete01.csv"},{value:"c",label:"data/athlete01.csv"},{value:"d",label:"C:\\data\\athlete01.csv"}],correctAnswer:"c",explanation:"A relative path describes where a file is relative to the working directory and does not include a drive letter or root slash. Options starting with C:\\ or / are absolute paths that only work on one machine."},{id:"q2",type:"multiple-choice",question:"Which is the best file name for a countermovement jump test recorded for athlete 1 on 12 June 2026?",options:[{value:"a",label:"final_v2_REAL.xlsx"},{value:"b",label:"CMJ data (copy).csv"},{value:"c",label:"Athlete 1 jump.csv"},{value:"d",label:"2026-06-12_cmj_athlete01.csv"}],correctAnswer:"d",explanation:"A good name uses no spaces, an ISO date (2026-06-12) so files sort chronologically, a zero-padded athlete number (01), and a clear description of the test. The other options have spaces, version chaos, or no date."},{id:"q3",type:"multiple-choice",question:"When you run pd.read_csv('data/training_log.csv'), what is the working directory?",options:[{value:"a",label:"The folder where Python is installed on your computer"},{value:"b",label:'The folder your program treats as "here", which relative paths start from'},{value:"c",label:"The C: drive on a Windows machine"},{value:"d",label:"The folder where the CSV file was originally exported"}],correctAnswer:"b",explanation:'The working directory is the folder your program considers "here" while it runs. Relative paths like data/training_log.csv are resolved starting from it, which is why the same script works on different machines.'},{id:"q4",type:"multiple-choice",question:"In a well-organised research project, where do the original force plate and GPS export files belong?",options:[{value:"a",label:"data/raw/"},{value:"b",label:"data/processed/"},{value:"c",label:"figures/"},{value:"d",label:"results/"}],correctAnswer:"a",explanation:"Original exports go in data/raw/, which must be treated as read-only. Keeping raw data untouched means you can always regenerate processed files from scratch, so a bad cleaning step never loses the underlying measurements forever."}]}},"what-is-ai":{blocks:[{type:"md",md:`# What is AI and Which One to Use

## What a Large Language Model Actually Is

The "AI" tools you have heard about -- ChatGPT, Claude, and the rest -- are built on something called a **large language model**, or LLM. Stripped of the hype, an LLM does one thing: it predicts likely text. Given some words, it works out what words tend to come next, and produces them one piece at a time.

It learned to do this by being trained on an enormous collection of text -- books, articles, websites, code, and more. From all that text it picked up the patterns of how language fits together, including the patterns of how working code is written and how concepts are explained. That is genuinely useful, and it is why these tools can help you.

But it is important to be clear about what an LLM is **not**:

- It does **not** have a database of facts it looks things up in. It generates plausible text, and plausible is not the same as correct.
- It has **no understanding of your data**. It has never seen your force plate exports or your squad's wellness scores. If you ask about "the data", it will guess at what is typical, not describe what is actually in your files.
- It does **not** know whether it is right. It produces its best-sounding answer with the same confidence whether that answer is correct or completely made up.

Hold onto that picture: a very capable pattern-completer, not an all-knowing oracle. Everything else in this lesson follows from it.

---

## The Main Assistants

A handful of assistants dominate, each built on an LLM but wrapped in a different product. What matters in practice is where each one meets you while you work:

| Assistant | Made by | Where you use it |
|-----------|---------|------------------|
| **ChatGPT** | OpenAI | A chat window in the browser (chatgpt.com) and in mobile and desktop apps. You paste in your code or question and talk it through. |
| **Claude** | Anthropic | A chat window in the browser (claude.ai) and in mobile and desktop apps, with the same paste-and-discuss workflow. |
| **Copilot** | GitHub / Microsoft | Inside your code editor (for example VS Code), suggesting and completing code directly in the file as you type. |
| **Gemini** | Google | A chat window in the browser (gemini.google.com), and built into Google tools such as Docs, Sheets, and Gmail. |

A note that matters: **this landscape changes fast.** New models appear every few months, rankings shuffle, and features you read about today may be standard everywhere tomorrow. Do not get attached to one tool's current quirks. The skills this course teaches -- writing clear prompts, reading code critically, and verifying answers -- transfer to whichever assistant you end up using.

---

## What They Are Good At for Sport Scientists

Used well, these assistants are a genuine accelerator for the kind of work you do. They are particularly strong at:

- **Explaining code line by line.** Paste a snippet you found in a paper or a colleague's script and ask what each line does. This is one of the fastest ways to learn.
- **Drafting code from a description.** Describe what you want in plain English -- "read a CSV of sprint times and return the mean and fastest time" -- and get a working first draft to adapt.
- **Translating between tools.** You know an Excel formula but not its Python equivalent? Ask the assistant to convert \`=AVERAGE(B2:B20)\` into Pandas. It bridges the gap from what you know to what you are learning.
- **Summarising documentation.** Library documentation can be dense. An assistant can condense the relevant part of the Pandas or Matplotlib docs into something you can act on.
- **Building whole tools from scratch ("vibe-coding").** Modern assistants can generate an entire app or a small piece of analysis software from a plain-language description, an approach popularly called vibe-coding. It is genuinely impressive, but treat it with care: if you do not understand the code behind the tool, it is hard to trust what it produces or to judge whether its results are right. That is exactly why this course teaches you to read code, not just request it.

In each case the assistant is doing the thing it is genuinely good at: working with the patterns of language and code. Notice that none of these tasks require it to know anything about *your* specific dataset.

---

## Where They Fail

Because an LLM generates plausible text rather than looking up facts, it fails in characteristic ways. Knowing them is what separates a useful tool from a dangerous one:

- **Hallucinated functions.** The assistant may confidently use a function that does not exist, because it *sounds* like it should. \`np.calculate_rfd(force)\` reads perfectly plausibly, but there is no such function in NumPy.
- **Outdated syntax.** It learned from a snapshot of text that includes old code, so it may suggest a deprecated approach that no longer works in current library versions.
- **Confident wrong answers.** It never signals doubt. A wrong formula is delivered with exactly the same assurance as a correct one.
- **No knowledge of your dataset.** Unless you describe your data, it is guessing at the structure. Ask "what is the average jump height in my data?" and it cannot answer -- it has never seen your file.

A concrete sport example: ask an assistant for "the standard formula to estimate VO2max from a 1.5-mile run time" and it may produce a clean-looking equation with specific coefficients. It looks authoritative. But the coefficients may be subtly wrong, or blended from two different published equations. If you plug it into an athlete report without checking the original paper, you have just shipped a confident, plausible, **wrong** number into a real decision.

The rule that follows: treat every answer as a draft to verify, never a fact to trust. Test code with values you can check by hand, and look up any formula against its source.

---

## Data Privacy

This section stands on its own because getting it wrong has consequences far beyond a buggy script.

**Never paste participant data into a public AI tool.**

That means names, dates of birth, health and injury data, questionnaire responses, or anything else that could identify a real person. When you type something into a public chat assistant, you are sending it to a company's servers, often to be stored and potentially used to improve their models. Participant data does not belong there.

For sport scientists this is not just etiquette -- it is a legal and ethical obligation:

- **GDPR** (and equivalent data protection law) governs how personal and health data may be processed. Pasting an athlete's medical history into a public chatbot can be a serious breach.
- **Research ethics** approvals almost always specify that participant data stays within approved systems. Sending it to a third-party AI tool violates the consent your participants gave.

The good news is you almost never need the real data to get help. The assistant is helping you with **code**, not with your specific values. So **describe the structure instead.** Show the assistant the *shape* of your data with column names and a couple of made-up rows. Anonymising the real data is also a possibility, but it is more dangerous than it sounds: seemingly harmless details (a birth date, a club, an injury history) can still identify a person in combination, so an anonymised dataset must be checked carefully before it goes anywhere near a public tool. When in doubt, describe rather than share. Here is what a safe prompt looks like in practice:

\`\`\`text
My CSV has these columns:
  athlete_id, test_date, jump_height_cm, peak_force_n

Example rows (made up, not real athletes):
  A01, 2026-06-12, 34.2, 2180
  A02, 2026-06-12, 31.8, 2050

Write Pandas code to calculate the mean jump height per athlete.
\`\`\`

This gives the assistant everything it needs without exposing real data.`},{type:"md",md:`## Which One to Use

For this course, the practical answer is reassuring: **any of the major assistants is fine.** ChatGPT, Claude, Copilot, and Gemini will all happily explain Python concepts, draft sport science code, and help you debug. The skills you build transfer between them.

A few things to keep in mind:

- **Check your institution's guidelines.** Your university or organisation may have rules about which AI tools are approved, especially around data handling. Those rules override any preference.
- **Your institution may already provide access.** Many universities and organisations have agreements that give staff and students access to particular assistants, often with better models than the free tiers and clearer data-handling terms. Check what is available to you before paying for anything yourself.
- **Free tiers are enough for learning.** You do not need a paid subscription to follow this course. The free version of any major assistant is more than capable for the kind of help you will be asking for.

Pick one, get comfortable with it, and remember that the assistant is a tutor to learn from -- not a replacement for understanding your own code.

## Summary

AI assistants are powerful tools for learning to program, as long as you understand what they really are:

- A **large language model** predicts likely text. It has no database of facts and no knowledge of your specific data.
- The **main assistants** are ChatGPT, Claude, Copilot, and Gemini; the landscape changes fast, but the skills transfer.
- They are **good at** explaining code, drafting from descriptions, translating between tools, and summarising documentation.
- They **fail** by hallucinating functions, using outdated syntax, and giving confident wrong answers -- always verify.
- **Never paste participant data** into a public AI tool; it breaches GDPR and research ethics. Describe the structure with made-up rows instead.
- **Any major assistant works** for this course; check your institution's rules and use the free tier.

In the next lesson, we go deeper into the practical craft of using AI for coding -- writing good prompts and verifying what comes back.`}],quiz:{id:"quiz-1-3",title:"AI Basics Quiz",questions:[{id:"q1",type:"multiple-choice",question:"What does a large language model fundamentally do?",options:[{value:"a",label:"It looks up verified facts in a built-in database"},{value:"b",label:"It predicts likely text based on patterns it learned from training data"},{value:"c",label:"It runs your Python code and reports the exact results"},{value:"d",label:"It stores and analyses your personal datasets automatically"}],correctAnswer:"b",explanation:"An LLM predicts likely text one piece at a time based on patterns in the huge collection of text it was trained on. It has no fact database, does not run your code, and has no knowledge of your data unless you describe it."},{id:"q2",type:"multiple-choice",question:"You are writing code to analyse your squad's wellness questionnaire. What should you do before asking an AI assistant for help?",options:[{value:"a",label:"Paste the full spreadsheet, including athlete names and health responses, so the AI has context"},{value:"b",label:"Describe the column names with a couple of made-up example rows, and keep the real data on your machine"},{value:"c",label:"Email the data to the AI company first to get permission"},{value:"d",label:"Upload only the athletes' names, since names alone are not sensitive"}],correctAnswer:"b",explanation:"Never paste real participant data into a public AI tool -- it breaches GDPR and research ethics. The assistant only needs the structure of your data to help with code, so describe the columns with made-up rows and keep the real values on your machine."},{id:"q3",type:"multiple-choice",question:"An AI assistant gives you code using a function called np.calculate_rfd() that you cannot find anywhere in the NumPy documentation. What is the most likely explanation and the right response?",options:[{value:"a",label:"The docs are out of date; use the function anyway since the AI is reliable"},{value:"b",label:"The AI hallucinated a function that does not exist; do not use it and find a real approach"},{value:"c",label:"You need to install an extra package to unlock the function"},{value:"d",label:"NumPy hides advanced functions from the public documentation"}],correctAnswer:"b",explanation:"AI assistants sometimes hallucinate plausible-sounding functions that do not actually exist. If you cannot find a function in the official documentation, do not use it -- verify against the real docs and use a function you can confirm exists."},{id:"q4",type:"multiple-choice",question:"Which statement best describes how to treat an AI assistant's answer?",options:[{value:"a",label:"As a verified fact you can use directly without checking"},{value:"b",label:"As a draft to verify, since it can be confidently wrong"},{value:"c",label:"As always outdated and therefore useless"},{value:"d",label:"As correct only if it sounds confident"}],correctAnswer:"b",explanation:"An LLM produces its best-sounding answer with the same confidence whether it is right or wrong. Treat every answer as a draft to verify -- test code with values you can check and look up any formula against its source."}]}},"ai-for-coding":{blocks:[{type:"md",md:`# How to Use AI for Coding

## Introduction

The previous lesson covered what AI assistants are and which one to pick. This lesson is about the practical craft: how to actually use them well when you are programming -- writing good prompts, verifying what comes back, and staying on the right side of academic integrity.

So far you have only written a few lines of Python, and that is all you need. The examples below show code you will learn to write in the coming modules. Here, focus on the **workflow** around the code, not on understanding every line. The habits you build now are exactly the ones that will make AI genuinely useful once you are writing your own analyses.

## What AI Can Help With

### 1. Explaining Concepts

You can ask AI to explain programming concepts in the context of sport science:

**Prompt:** "Explain Python for loops using an example with heart rate data from a training session."

**Prompt:** "What is the difference between a list and a tuple? When would I use each one for sport science data?"

### 2. Debugging Code

You will start hitting errors once you write your own code in the coming modules. When that happens, paste the error message and your code:

**Prompt:** "I'm getting this error. What's wrong and how do I fix it?"

\`\`\`python
sprint_times = [4.52, 4.61, 4.48]
average = sum(sprint_times) / len(sprint)
# NameError: name 'sprint' is not defined
\`\`\`

The AI will likely spot that \`sprint\` should be \`sprint_times\`.

### 3. Generating Starter Code

Ask for a template to start from:

**Prompt:** "Write a Python function that takes a list of heart rate values and returns the time spent in each of the 5 HR training zones."

### 4. Converting Formulas to Code

**Prompt:** "Convert this formula to Python: speed_kmh = distance_km / (time_min / 60), where distance is in kilometres and time is in minutes."

### 5. Explaining Someone Else's Code

Paste code you found in a paper or online:

**Prompt:** "Explain what this code does line by line:"
\`\`\`python
rfd = np.gradient(force, 1/sampling_rate)
onset = np.argmax(rfd > threshold)
\`\`\`

## How to Write Good Prompts

The quality of AI output depends heavily on your prompt. Follow these guidelines:

### Be Specific

\`\`\`
BAD:  "Write code to analyse data"
GOOD: "Write a Python function that takes a list of sprint times (in seconds)
       and returns the fastest time, the average time, and the coefficient
       of variation."
\`\`\`

### Provide Context

\`\`\`
BAD:  "How do I calculate this?"
GOOD: "I have spirometry data sampled at 100 Hz stored in a NumPy array
       of expiratory flow values in litres per second. How do I calculate
       the forced expiratory volume in the first second (FEV1) by
       integrating flow over time?"
\`\`\`

### Specify the Desired Output Format

\`\`\`
GOOD: "Write a function that returns a dictionary with keys 'mean', 'std',
       'min', 'max' for a given list of VO2max values."
\`\`\`

### Ask for Explanations

\`\`\`
GOOD: "Write this function and add comments explaining each step."
GOOD: "Explain why you chose this approach over alternatives."
\`\`\`

## Critical Thinking: Verifying AI Output

AI-generated code is not always correct. You **must** verify it. Here is what that looks like. Run the example below -- it shows a snippet an AI might produce, complete with the kind of comments a good AI assistant adds to explain what each line does:`},{type:"example",caption:"AI-style commented code: read it, run it, then check the maths yourself.",code:`# AI-generated snippet to convert mechanical work from kilojoules to kilocalories.
# Each line is commented to explain what it does -- a habit worth keeping.

work_kj = 500          # total mechanical work in kilojoules
kcal_per_kj = 0.239    # conversion factor

# Convert: kilojoules multiplied by the factor gives kilocalories
work_kcal = work_kj * kcal_per_kj

# Display result rounded to 1 decimal place
print(f"Work: {work_kcal:.1f} kcal")

# Verify by hand: 500 * 0.239 = 119.5
# The printed value should match -- if it doesn't, the formula is wrong.`},{type:"exercise",id:"ex-1-30",title:"Use AI to Find the Bug",domain:"teaching",description:`The code below should calculate a runner's pace in minutes per km, but it prints the wrong number. This time, let an AI assistant do the debugging for you:
1. Copy the code into your assistant of choice and ask it to find the error.
2. Apply the suggested fix here.
3. Press Check Answer to verify that the suggestion actually works.

Distance: 10 km. Time: 45 minutes.`,initialCode:`distance_km = 10
time_min = 45

# This prints the wrong pace -- ask an AI assistant why
pace = distance_km / time_min

print(f"Pace: {pace} min/km")`,testCode:`assert abs(pace - 4.5) < 1e-9, "pace should be minutes divided by kilometres: 4.5"
print("PASS")`,hints:['Paste the whole snippet into your assistant and ask: "This should print the pace in minutes per km, but the number looks wrong. What is the bug?"',"The assistant should point out that the division is upside down: pace = time_min / ___"]},{type:"exercise",id:"ex-1-31",title:"Adapt the Snippet",domain:"coaching",description:"The AI snippet below calculates training intensity (fraction of max heart rate) for athlete A. Adapt it in place for athlete B: session heart rate = 162 bpm, maximum heart rate = 188 bpm.",initialCode:`# AI snippet written for athlete A -- adapt the values for athlete B
hr_bpm = 150
hr_max_bpm = 195
intensity = hr_bpm / hr_max_bpm
print(round(intensity, 2))`,expectedOutput:"0.86",hints:["Only the two heart rate values need to change -- the calculation lines stay the same.",`hr_bpm = 162
hr_max_bpm = ___`]},{type:"md",md:`## Academic Integrity

### What is Acceptable

- Using AI to **understand** a concept you are struggling with
- Using AI to **debug** a specific error in code you wrote
- Using AI to **explore** different approaches before writing your own solution
- Asking AI to **explain** code from a textbook or lecture

### What is NOT Acceptable (in most academic settings)

- Submitting AI-generated code as your own work without attribution
- Using AI to complete assignments without understanding the solution
- Copying AI output without testing and adapting it

### Best Practice

1. **Attempt the problem yourself first** -- struggle is part of learning
2. **Use AI as a tutor**, not a homework machine
3. **Always understand** every line of code you submit
4. **Cite AI assistance** when required by your institution
5. **Learn from AI explanations** -- do not just copy the output

## Practical Workflow

Here is a recommended workflow for using AI alongside your learning:

1. **Read the lesson material** and try the exercises yourself
2. **If stuck**, formulate a specific question and ask the AI
3. **Compare** the AI's approach with what you tried
4. **Test** the AI's suggestion with your own test cases
5. **Adapt** the code to fit your specific needs
6. **Document** any AI assistance you received

## Summary

AI tools are valuable assistants for learning Python and doing sport science analysis, but they require careful, critical use:

- **Be specific** in your prompts
- **Verify** all generated code
- **Understand** every line before using it
- **Test** with known values
- **Maintain academic integrity**
- **Use AI as a tutor**, not a replacement for learning

The goal is to use AI to **accelerate** your learning, not to **bypass** it. The athletes you work with deserve sport scientists who truly understand their tools.

In the next lesson, we assemble the full toolkit for getting unstuck: asking Python itself, reading documentation, searching well, and asking for help.`}],quiz:{id:"quiz-1-4",title:"AI for Coding Quiz",questions:[{id:"q1",type:"multiple-choice",question:"Which of these is the better prompt to ask an AI assistant for coding help?",options:[{value:"a",label:'"Write code to analyse data"'},{value:"b",label:'"Write a function that returns the fastest and average of a list of sprint times in seconds"'},{value:"c",label:'"How do I calculate this?"'},{value:"d",label:'"Fix my code, it does not work and I need it quickly"'}],correctAnswer:"b",explanation:"A good prompt is specific: it states exactly what you want, the inputs, and the expected output. The vague prompts give the assistant nothing to work with and produce vague or wrong code in return."},{id:"q2",type:"multiple-choice",question:"An AI assistant gives you a snippet that converts work from kilojoules to kilocalories. What should you do before using it in your analysis?",options:[{value:"a",label:"Use it straight away -- AI code is always correct"},{value:"b",label:"Test it with values you can check by hand and make sure you understand every line"},{value:"c",label:"Submit it without reading it, as long as it runs"},{value:"d",label:"Assume it is wrong and never use AI code at all"}],correctAnswer:"b",explanation:"AI-generated code can be confidently wrong -- a bad formula, a hallucinated function, or outdated syntax. Always verify it: test with known values you can check by hand, and read every line so you understand what it does before trusting it."},{id:"q3",type:"multiple-choice",question:"Which use of an AI assistant is acceptable in most academic settings?",options:[{value:"a",label:"Submitting AI-generated code as your own work without understanding it"},{value:"b",label:"Using AI to complete an assignment so you do not have to learn the material"},{value:"c",label:"Using AI to explain a concept you are struggling with, then writing and understanding your own solution"},{value:"d",label:"Copying AI output directly into your submission without testing or attribution"}],correctAnswer:"c",explanation:"Using AI as a tutor -- to explain concepts, debug, or explore approaches -- is acceptable when you still understand and write your own work. Submitting AI output as your own without understanding it, or to avoid learning, is not, and your institution may require you to cite AI assistance."},{id:"q4",type:"multiple-choice",question:"You hit an error and want to ask an AI assistant for help. What should you include?",options:[{value:"a",label:'Just the words "my code does not work"'},{value:"b",label:"The full error message, the code that produced it, and what you expected to happen"},{value:"c",label:"Only the line number where it broke"},{value:"d",label:"Your real participant data so the assistant has full context"}],correctAnswer:"b",explanation:"Give the assistant the full error message, the relevant code, and what you expected -- with all three it can usually pinpoint the problem. Never paste real participant data into a public AI tool; describe the structure with made-up rows instead."}]}},"getting-help":{blocks:[{type:"md",md:`# How Can I Get Help While Learning to Program?

## Being Stuck Is Normal

Here is something the polished tutorials rarely tell you: every programmer is stuck several times a day. Not occasionally, not just beginners -- everyone, constantly. The professional with twenty years of experience hits the same wall you do; they have simply built up a toolkit for getting over it quickly. That toolkit is the real skill. Programming is not about never getting stuck, it is about getting *unstuck* efficiently. So when your code does not work and Python prints a wall of red text, you have not failed -- you have arrived at the ordinary, everyday state of writing code. An error message is **information**, not a verdict. It is Python telling you exactly where it got confused so you can fix it. We will treat errors in depth in Module 4; for now, just hold onto the calm: being stuck means you are programming, and this lesson gives you the tools to get moving again.

The toolkit has four layers: asking Python itself, reading the official documentation, searching well, and asking for help, whether from a person or from an AI assistant as discussed earlier in this module. We take them in that order.`},{type:"md",md:"## Asking Python Itself: `help()` and Docstrings\n\nYour first and fastest source of help is built into Python. The `help()` function prints the documentation for almost anything -- a function, a method, a whole library. No internet required.\n\nTry it on the `round()` function. In a few lines you learn that `round` takes a `number`, accepts an optional second argument `ndigits`, and what each does. That built-in description is called a **docstring** -- a short block of documentation attached to the function itself.\n\nWhen you are mid-task and cannot quite remember how a function is called, `help()` is faster than opening a browser. Some help outputs are long (try `help(str)` and you will get pages); when that happens, skim for the part you need and ignore the rest."},{type:"example",code:"help(round)",caption:"help() prints the docstring for any built-in function -- no internet needed."},{type:"md",md:'## What Is This Thing? `type()` and `dir()`\n\nTwo more built-ins answer the questions "what is this?" and "what can it do?".\n\n`type()` tells you what kind of value you are holding. This is invaluable when a calculation misbehaves -- very often the cause is a value being a string when you thought it was a number, and `type()` reveals it instantly.\n\n`dir()` lists everything you can *do* with a value -- all its available methods. The output starts with names wrapped in double underscores (`__add__`, `__class__`, and so on) -- you can safely ignore those for now. The useful part is the plain names at the end: `upper`, `lower`, `strip`, `split`, `replace`, `find`. Pair `dir()` with `help()` -- `dir` shows you what is available, `help` explains how one of them works.'},{type:"example",code:`print(type(9.58))     # <class 'float'>
print(type("Bolt"))   # <class 'str'>
print(type(100))      # <class 'int'>

# dir() lists all methods available on a string
print(dir("Haaland"))  # [..., 'lower', 'replace', 'split', 'upper', ...]`,caption:"type() identifies what kind of value you have; dir() lists what it can do."},{type:"exercise",id:"ex-1-40",title:"Inspect a Value's Type",domain:"teaching",description:"A peak ground reaction force of 1847.5 N from a drop jump is stored below. Print the type of `peak_force`.",initialCode:"peak_force = 1847.5",expectedOutput:"<class 'float'>",hints:["`type()` tells you what kind of value you are holding.","print(type(___))"]},{type:"md",md:`## The Official Documentation

Beyond the built-in help, every library has official documentation on the web -- the authoritative reference. The three you will use most: **Python** at docs.python.org, **pandas** at pandas.pydata.org/docs, and **NumPy** at numpy.org/doc. Each has a searchable reference for every function, and because libraries change between versions, the current official docs beat an old blog post.

## Searching Well and Asking for Help

When the built-in help is not enough, a search engine is the next stop -- but *how* you search makes all the difference.

- **Search the exact error message, in quotes.** If Python prints \`KeyError: 'Athlete'\`, paste \`"KeyError"\` and the relevant part into the search box. The quotes tell the search engine to match those words exactly.
- **Add the library name.** Searching \`pandas read_csv encoding error\` is far more precise than \`python file won't open\`.
- **Prefer recent results.** pandas changes from version to version, and an answer from many years ago may use an approach that no longer works.

## Asking a Person or an AI Assistant

When the tools above are not enough, ask someone: a classmate, a supervisor, or an **AI assistant**. The AI lessons earlier in this module covered how to use assistants well while learning to code, and everything from them applies every time you are stuck from here on. AI assistants are often the fastest route to an explanation, as long as you use them properly.

Whoever you ask, paste **three things**: the *full* error message, the *code* that produced it, and *what you expected to happen*. With all three, the helper can usually pinpoint the problem. With only "my code does not work", they cannot. And remember the rules from the AI lessons: verify what comes back, test the suggested fix, make sure you understand it, and never paste real participant data into a public tool.

## Summary

Getting unstuck quickly is the core skill of programming, and you have a whole toolkit for it:

- **Being stuck is normal** -- every programmer is, several times a day. Errors are information, not failure.
- **\`help()\`** prints a function's docstring right in your editor; **\`type()\`** tells you what a value is and **\`dir()\`** lists what it can do (ignore the underscored names for now).
- The **official docs** for Python, pandas, and NumPy are the authoritative reference.
- **Search** the exact error in quotes, add the library name, and prefer recent results.
- **AI assistants** help fast when you give them the full error, the code, and what you expected -- then verify the answer.

With these tools, "I am stuck" stops being a wall and becomes just the next small step.

In the next lesson, we wrap up the module with the habits that make your work reproducible and readable: best practices.`}],quiz:{id:"quiz-1-8",title:"Getting Help Quiz",questions:[{id:"q1",type:"multiple-choice",question:"What does running help(round) show you in the editor?",options:[{value:"a",label:"The result of rounding the number you last used"},{value:"b",label:"The function's documentation (docstring), including its signature round(number, ndigits=None)"},{value:"c",label:"A list of every function available in Python"},{value:"d",label:"Nothing -- help() only works with an internet connection"}],correctAnswer:"b",explanation:"help() prints the function's docstring: a short description plus its signature. For round, that signature is round(number, ndigits=None), which tells you it takes a required number and an optional ndigits argument. It works offline, right in the editor."},{id:"q2",type:"multiple-choice",question:"You want the authoritative reference for a pandas function like read_csv. Where should you look?",options:[{value:"a",label:"The official pandas documentation at pandas.pydata.org/docs"},{value:"b",label:"Any blog post, regardless of how old it is"},{value:"c",label:"The NumPy documentation, since pandas is built on NumPy"},{value:"d",label:"There is no documentation for pandas; you have to guess"}],correctAnswer:"a",explanation:"Each library has its own official documentation, and pandas lives at pandas.pydata.org/docs. It has a searchable reference for every function. Because pandas changes between versions, the current official docs are more reliable than an old blog post."},{id:"q3",type:"multiple-choice",question:"You are stuck on an error and want to ask a classmate or an AI assistant for help. What makes a good help request?",options:[{value:"a",label:'Just "my code does not work" -- they can figure out the rest'},{value:"b",label:"Your entire 200-line script with no explanation"},{value:"c",label:"The full error message, the code that produced it, and what you expected to happen"},{value:"d",label:"A screenshot of your desktop"}],correctAnswer:"c",explanation:"A good help request pastes three things: the exact error copied in full, the code that produced it, and what you expected to happen. With all three a human or AI helper can usually pinpoint the problem -- and writing it out often reveals the answer yourself."}]}},"best-practices":{blocks:[{type:"md",md:`# Best Practices

## Reproducibility Is the Goal

Everything in this lesson serves a single aim: **reproducibility**. A piece of work is reproducible when the same data and the same code always produce the same result -- next week, next year, on your laptop or on a colleague's. That is not a nice-to-have in sport science; it is the difference between a finding you can defend and a number you cannot explain.

The key shift in thinking is this: **your script is your lab journal.** It is the complete, exact record of what you did to the data -- every filter, every formula, every decision -- written in a language the computer can re-run. If a reviewer, a coach, or future-you asks "how did you get this VO2max value?", the answer is not a vague memory. It is a file you can open and run again.

Contrast this with the spreadsheet way of working. You open the force plate export in Excel, sort a column, delete a couple of rows that "looked wrong", type a formula into a cell, copy it down, then tweak a value by hand. Three months later you reopen the file and you have **no idea** what you changed or why. The point-and-click edits left no trace. Nobody -- not even you -- can reproduce how you got from the raw export to the final number. A script never has this problem, because every step is written down.

This is also the heart of **open science**. More and more journals and institutions expect you to share your data and your code alongside your findings, so that anyone, anywhere, can run the same analysis and reach the same result. Working reproducibly from day one means you can share your work openly and stand behind every number in it, because nothing about how it was produced is hidden, not even from yourself.

---

## Never Edit Raw Data

The most important rule in this whole lesson:

**Never edit your raw data. Work on copies, in code.**

The file that came off the measurement device is your ground truth, and once you change it by hand it can never be recreated. So the original stays untouched forever: your code **reads** the raw file and every cleaning step happens on a copy. If the cleaning goes wrong, you start again from the pristine original, and next season's re-test still compares cleanly against the first.

---

## Document as You Go

Code that runs is not the same as code you will understand in six months. Document while the work is fresh, not "later" (later never comes).

- **Comments** in your code explain the *why* behind a step: why you dropped those trials, why that threshold, which paper a formula came from.
- **A README per project** -- a short plain-text file in the project folder -- explains what the project is, where the data came from, and how to run the analysis. Anyone opening the folder (including future-you) starts there.
- **Metadata for every measurement session.** The raw numbers are useless if you cannot remember how they were collected. Record it at the time, every time.

A short metadata checklist, here shown for a questionnaire round:

- **Instrument and version** -- which questionnaire (for example a wellness or motivation scale), which version, and in which language.
- **Response scale** -- what the numbers mean, for example 1 to 5 where 5 is strongly agree, and which items are reverse-scored.
- **Date and time** the questionnaire was answered.
- **Athlete / participant ID** (anonymised, not a name).
- **Conditions** -- anything unusual: answered in a hurry after training, items left blank, a group session where athletes could see each other's answers.

Five minutes of notes at the time saves an afternoon of guesswork later.

### Comments Explain WHY, Not WHAT

Python ignores everything on a line after a \`#\` symbol. These lines are **comments**: notes written for the humans reading the code, not for the computer.

\`\`\`python
# This whole line is a comment. Python skips it entirely.
mass_kg = 75  # a comment can also sit at the end of a line of code
\`\`\`

A good comment tells the reader something the code cannot say for itself. The code already shows *what* it does; a comment that just restates it is noise. What the code cannot show is *why*: the reason, the source, the decision behind the line. Comment the why.

\`\`\`python
# BAD: the comment just repeats what the code plainly says
hr_max = 208 - 0.7 * age  # subtract 0.7 times age from 208

# GOOD: the comment explains why this formula and where it comes from
hr_max = 208 - 0.7 * age  # Tanaka formula (Tanaka, Monahan & Seals, 2001)
\`\`\`

If you find yourself writing a comment that just narrates the code, delete it and spend the effort on a better variable name instead. In sport science this habit matters more than in most fields, because your analyses lean on published formulas and measurement conventions that a reader cannot guess from the arithmetic alone.

---

## Be Consistent with Units

Unit confusion is one of the most common -- and most embarrassing -- sources of error in sport science analysis. Two habits prevent almost all of it.

**Store in SI units, convert only for display.** Keep your underlying data in standard units (metres, seconds, kilograms, Newtons) and convert to friendlier units (centimetres, km/h) only at the moment you print or plot. This way every calculation runs on consistent quantities, and a conversion mistake can only ever affect what you show, never what you compute.

**Put the unit in the name.** A variable called \`height\` is a trap -- is it metres or centimetres? A variable called \`height_cm\` answers the question for you and for anyone reading your code. Make this automatic:

- \`height_cm\`, not \`height\`
- \`time_s\`, not \`time\`
- \`force_n\`, not \`force\`
- \`mass_kg\`, \`speed_ms\`, \`jump_height_cm\`

One more naming habit worth making automatic: a variable that holds True or False reads best as a yes/no question, like \`is_injured\` or \`has_consented\`. Then \`if is_injured:\` reads like plain English.

What a unit mix-up costs: suppose you record jump height in centimetres for most athletes but type one value in metres by mistake -- \`0.34\` instead of \`34\`. If your variable is just called \`height\`, nothing flags it, and that athlete now appears to have jumped a third of a centimetre. The group mean is wrong, the report is wrong, and you may not catch it until someone asks why one athlete looks broken. Had the column been \`jump_height_cm\`, the stray \`0.34\` stands out immediately as not-in-centimetres.

The contrast between cryptic and readable code is worth seeing side by side. Run the example below:`},{type:"example",caption:"Same output, very different readability. The clean version explains itself.",code:`# --- Cryptic version (hard to read, unit unclear) ---
p = 310
m = 72
x = p / m
print(f"Result: {x:.1f}")

# --- Readable version (same calculation, self-documenting) ---
power_w = 310    # mean power from a cycling test
mass_kg = 72     # athlete body mass

# Power-to-mass ratio, the standard way to compare cyclists
power_to_mass_wkg = power_w / mass_kg
print(f"Power-to-mass: {power_to_mass_wkg:.1f} W/kg")`},{type:"exercise",id:"ex-1-6",title:"Fix the Style",domain:"physiology",description:"The code below works, but the style hides its meaning. Rewrite it below the original with descriptive `snake_case` names (`height_m`, `mass_kg`, bmi) and clear spacing. Keep the same values (height = 1.85 m, mass = 68 kg) and the same final print.",initialCode:`# This code works, but the style makes it hard to read.
# Rewrite it below with descriptive names and clear spacing.
a=1.85
b=68
c=b/(a**2)
print(f"BMI: {c:.1f}")

# Your improved version (use height_m, mass_kg, bmi):
`,testCode:`assert 'height_m' in dir(), "Create a variable called height_m"
assert 'mass_kg' in dir(), "Create a variable called mass_kg"
assert 'bmi' in dir(), "Create a variable called bmi"
assert abs(bmi - 19.9) < 0.1, "bmi should be mass_kg / height_m ** 2"
print("PASS")`,hints:["Give each value a descriptive `snake_case` name with its unit -- the calculation itself stays the same.",`height_m = 1.85
mass_kg = ___
bmi = mass_kg / (height_m ** 2)
print(f"BMI: {bmi:.1f}")`]},{type:"md",md:`---

## Readable Code: Spacing and Constants

Python has an official style guide called **PEP 8**. You do not need all of it, but a few spacing rules make an immediate difference to readability:

| Rule | What it means | Example |
|------|---------------|---------|
| Spaces around operators | Put a space on each side of \`=\`, \`+\`, \`*\`, etc. | \`bmi = mass / height ** 2\` not \`bmi=mass/height**2\` |
| Blank lines between blocks | Separate logical chunks with a blank line | A blank line between loading data and analysing it |
| ~79-character lines | Keep lines short enough to read without scrolling | Wrap long expressions onto the next line |
| 4-space indentation | Indent blocks with four spaces, never tabs | \`    speed = dist / time\` |

Compare these two lines. They do the same thing, but one is far easier to parse:

\`\`\`python
# Cramped, easy to misread
vo2=0.2*speed_m_min+3.5

# PEP 8 style, each element stands out
vo2 = 0.2 * speed_m_min + 3.5   # ACSM running equation
\`\`\``},{type:"exercise",id:"ex-1-8",title:"Fix the Spacing",domain:"physiology",description:"The code below calculates a session load (RPE x duration). It works but violates PEP 8 spacing. Rewrite it below the original with correct spacing (spaces around operators and assignment). Keep the same variable names and values (`rpe_score` = 7, `duration_min` = 60). Your rewritten code must store the result in `session_load` and print it.",initialCode:`# Cramped version -- fix the spacing below
rpe_score=7
duration_min=60
session_load=rpe_score*duration_min
print(session_load)

# Your PEP 8 version (same names, same values, spaces around operators):
`,testCode:`assert 'rpe_score' in dir(), "use rpe_score"
assert 'duration_min' in dir(), "use duration_min"
assert 'session_load' in dir(), "use session_load"
assert abs(rpe_score - 7) < 1e-6, "rpe_score should be 7"
assert abs(duration_min - 60) < 1e-6, "duration_min should be 60"
assert abs(session_load - 420) < 1e-6, "session_load = rpe_score * duration_min = 420"
print("PASS")`,hints:["Add a single space on each side of = and *.",`rpe_score = 7
duration_min = ___
session_load = rpe_score * duration_min
print(session_load)`]},{type:"md",md:`### Constants in CAPS

Some values never change while your program runs: physical constants, fixed coefficients, conversion factors. By convention these get names in **ALL_CAPS_WITH_UNDERSCORES**, which tells any reader "this is a fixed value, set once." Naming them also removes **magic numbers**, bare unexplained values sitting in a formula:

\`\`\`python
GRAVITY_MS2 = 9.81      # acceleration due to gravity, m/s^2
MS_TO_KMH = 3.6         # multiply m/s by this to get km/h

speed_kmh = speed_ms * MS_TO_KMH
\`\`\`

The value gets a name, its source can be noted where it is defined, and changing it means changing exactly one place.`},{type:"md",md:`---

## Version Your Work

As an analysis evolves, you will want to keep earlier versions -- to compare results, or to go back when a change makes things worse. The **minimum** habit is to put a date in the filename, in ISO format so versions sort in order:

\`\`\`
2026-06-12_analysis.py
2026-06-18_analysis.py
2026-06-25_analysis.py
\`\`\`

This is crude but it works: you can always see which version is newest and open an older one if you need to.

The professional tool for this job is **git**, a version-control system that records every change you make, lets you label them with messages, and lets you step back to any earlier state without keeping a pile of dated files. This course does not teach git -- it is a topic in its own right -- but it is worth knowing it exists, because it is how real research code and software is managed. Once you are comfortable with Python, learning the basics of git is one of the highest-value next steps you can take.

---

## Back Up Your Work

Data you have only one copy of is data you are about to lose. The standard rule is **3-2-1**: keep at least **3** copies of your data, on **2** different types of storage (for example your laptop drive and an external disk or cloud service), with **1** copy kept off-site (so a fire, theft, or flood cannot take everything at once). For most students and researchers the easiest path is institutional storage -- the university's managed drive or cloud, which is backed up automatically and also keeps participant data inside approved systems. Set it up once, let it run, and a dead laptop becomes an inconvenience instead of a catastrophe.

---

## Summary

Good practice in sport science programming all points at one thing -- being able to reproduce your own work:

- **Reproducibility is the goal:** same data plus same code equals the same result, and your **script is your lab journal**.
- **Never edit raw data.** Work on copies in code; the original measurement file stays untouched forever.
- **Document as you go** with a per-project README, a metadata record (instrument, scale, date) for every measurement round, and comments that explain WHY, not what.
- **Be consistent with units:** store SI, convert for display, and put the unit in the name (\`height_cm\`, \`force_n\`).
- **Write readable code:** descriptive snake_case names, PEP 8 spacing, and constants in CAPS instead of magic numbers.
- **Version your work** with dated filenames at minimum; git is the professional tool, worth learning later.
- **Back up** using the 3-2-1 rule, ideally on institutional storage.

These habits cost a little effort up front and save you from disasters that cost data, time, and credibility.

This is the last lesson of Module 1. You now understand why programming matters in sport science, how to organise your files, how to use AI well, and the habits that make your work reproducible and readable. In the next module, we start building: variables and the data structures of sport science.`}],quiz:{id:"quiz-1-5",title:"Best Practices Quiz",questions:[{id:"q1",type:"multiple-choice",question:"A force plate exports a raw CSV after a jump session. Some values look too high. What should you do?",options:[{value:"a",label:"Open the raw CSV and delete or edit the suspect values by hand, then save over it"},{value:"b",label:"Leave the raw file untouched and do any cleaning in a script that writes a separate copy"},{value:"c",label:"Delete the raw file so the bad values cannot cause problems later"},{value:"d",label:"Email the raw file to a colleague and ask them to fix it for you"}],correctAnswer:"b",explanation:"Raw data is your ground truth and must never be edited by hand. Your code reads the raw file, cleans a copy, and writes the result somewhere else, so the original measurement stays intact and every cleaning step is recorded and reproducible."},{id:"q2",type:"multiple-choice",question:"Which piece of information belongs in the metadata you record for a measurement session?",options:[{value:"a",label:"The colour of the athlete's training kit"},{value:"b",label:"The device used and its sampling rate, plus the date of the session"},{value:"c",label:"Your personal opinion of how the athlete performed"},{value:"d",label:"Nothing -- the raw numbers speak for themselves"}],correctAnswer:"b",explanation:"Metadata makes raw numbers interpretable later: record the device and model, the sampling rate, the date and time, the anonymised participant ID, and any unusual conditions. Without this, the same numbers can be impossible to make sense of months later."},{id:"q3",type:"multiple-choice",question:"You see the value 0.34 in a column of jump heights where every other value is around 34. What does this most likely indicate?",options:[{value:"a",label:"That athlete genuinely jumped a third of a centimetre"},{value:"b",label:"A units mix-up: 0.34 looks like metres in a list that is otherwise in centimetres"},{value:"c",label:"A spelling mistake in the column name"},{value:"d",label:"Nothing unusual; jump heights naturally vary that much"}],correctAnswer:"b",explanation:"A value of 0.34 among values near 34 is the classic signature of a units mix-up -- one value entered in metres where the rest are in centimetres. Naming the variable jump_height_cm makes the stray value obvious immediately, which is why units belong in names."},{id:"q4",type:"multiple-choice",question:"Why does running a script make an analysis more reproducible than doing the same edits by hand in a spreadsheet?",options:[{value:"a",label:"Scripts run faster, and speed is what reproducibility means"},{value:"b",label:"A script records every step exactly, so the same data and code always give the same result; hand edits leave no trace"},{value:"c",label:"Spreadsheets cannot do mathematics, so they are always wrong"},{value:"d",label:"Scripts automatically back themselves up, so no data is ever lost"}],correctAnswer:"b",explanation:"A script is a complete, re-runnable record of exactly what was done to the data -- your lab journal in code. Point-and-click spreadsheet edits leave no trace, so months later nobody can tell what was changed or reproduce how the final number was reached."},{id:"q5",type:"multiple-choice",question:"A good comment explains WHY, not WHAT. Which comment is the good one?",options:[{value:"a",label:"hr_max = 208 - 0.7 * age  # subtract 0.7 times age from 208"},{value:"b",label:"hr_max = 208 - 0.7 * age  # Tanaka formula (Tanaka, Monahan & Seals, 2001)"},{value:"c",label:"hr_max = 208 - 0.7 * age  # set hr_max"},{value:"d",label:"hr_max = 208 - 0.7 * age  # this is a calculation"}],correctAnswer:"b",explanation:"The code already shows what it does; a good comment adds what the code cannot say -- here, which formula it is and where it comes from. The other comments just restate the obvious and add no information."},{id:"q6",type:"multiple-choice",question:"Which of these lines violates PEP 8 style?",options:[{value:"a",label:"bmi = mass_kg / height_m ** 2"},{value:"b",label:"speed_ms = distance_m / time_s"},{value:"c",label:"load=rpe_score*duration_min"},{value:"d",label:"hr_max = 208 - 0.7 * age"}],correctAnswer:"c",explanation:"load=rpe_score*duration_min has no spaces around the = and * operators, violating PEP 8. The other lines put a single space around each operator, which is the recommended style."}]}},"coding-environment":{blocks:[{type:"md",md:`# The Coding Environment

## Introduction

In this course you write and run Python **directly in your browser**. There is nothing to install, nothing to configure, and nothing that can break before you have even begun. Everything happens on this page, so you can focus entirely on learning to code.

By the end of this lesson you will know your way around the editor, and you will have used Python as a calculator -- which is already useful in sport science.

Do not worry if something feels unfamiliar along the way. Everything you see in this lesson will be covered in far more detail later in the course. This is just to get us started.

## The Editor

Every lesson with code gives you the same simple tools. Here is what each part does:

- **The code area** -- the box where you type and edit Python. It is just a text editor; click in it and start writing.
- **Run Code** -- runs whatever is in the code area and shows the result. Press it as often as you like; running code costs nothing and is how you find out what your code actually does.
- **Check Answer** -- appears on exercises. It runs your code and checks it against what the exercise expects, then tells you whether you passed. The plain lessons use **Run Code**; the exercises add **Check Answer**.
- **Reset** -- puts the code area back to how it started. If you experiment yourself into a mess, Reset gives you a clean slate -- nothing you do is permanent.
- **Hint** -- on exercises, reveals a nudge in the right direction when you are stuck. Try the problem first; the hint is there for when you need it, not instead of thinking.
- **The output panel** -- the area below the code where results appear. Everything you \`print()\`, and any error messages, show up here.
- **The \`data/\` folder** -- a folder of real course datasets that ships with the editor. When a lesson asks you to load \`data/training_log.csv\`, that file is already there, waiting. You will use it from the data lessons onwards.

The loop you will repeat hundreds of times is simple: type some code, press **Run Code**, read the output, adjust, run again. That is what programming feels like.

## Your First Program: print()

The \`print()\` function displays text on the screen. You will use it constantly to check your results. Let us start with the classic first program.`},{type:"example",caption:"This is the editor you will use throughout the course. Press Run.",code:'print("Hello, sport science!")'},{type:"exercise",id:"ex-1-1",title:"Your First Run",description:"Write a line of code that prints exactly: Hello, coach. Note that the text you want to print must be placed inside the brackets of `print()`, wrapped in quotation marks. We will go into detail about how this works later in the course.",initialCode:"",expectedOutput:"Hello, coach",hints:["`print()` displays whatever text you put between quotation marks.",'print("Hello, ___")']},{type:"md",md:"## Printing Numbers and Arithmetic\n\nPython is a calculator that never tires. You can print the result of a calculation directly. Python works as a sport scientist's calculator -- the four basic operations and a few extras cover most formulas you will encounter:\n\n- `+` addition, `-` subtraction, `*` multiplication, `/` division\n- `**` exponentiation (e.g. `2 ** 10` is 1024)\n- `//` whole-number division (discards the remainder), `%` the remainder itself\n\nPython follows standard mathematical order of operations -- parentheses first, then exponents, then multiplication and division, then addition and subtraction. Use parentheses whenever you want to make the order explicit."},{type:"example",caption:"Python evaluates the maths, then prints the result.",code:`print(2 + 5)
print(100 / 4)`},{type:"exercise",id:"ex-1-2",title:"Weekly Training Volume",domain:"coaching",description:"A runner trains 8, 10, 6, and 12 km on four days. Print the total distance for the week.",initialCode:"",expectedOutput:"36",hints:["You can add the numbers directly inside `print()`.","print(8 + 10 + ___ + ___)"]},{type:"exercise",id:"ex-1-3",title:"Average Pace",domain:"physiology",description:"A 400 m runner finishes in 50 seconds. Print the average speed in metres per second (distance divided by time).",initialCode:"",expectedOutput:"8.0",hints:["Speed is distance divided by time.","print(400 / ___)"]},{type:"md",md:'## Storing Values in Variables\n\nTyping the same number again and again is error-prone. A **variable** gives a value a name you can reuse.\n\nGive variables descriptive `snake_case` names (lowercase words joined by underscores) and put the unit in the name (e.g. `distance_m`, `time_s`) -- a habit the rest of this module builds on. Python uses a single equals sign `=` to assign a value to a name -- read it as "distance_m is set to 400".'},{type:"example",caption:"Create a variable, then use its name.",code:`distance_m = 400
time_s = 50
print(distance_m / time_s)`},{type:"exercise",id:"ex-1-4",title:"Name Your Data",domain:"biomechanics",description:"Store a jump height of 0.42 metres in a variable called `height_m`, then print it.",initialCode:"",expectedOutput:"0.42",hints:["Assign the value with =, then print the variable name.",`height_m = ___
print(height_m)`]},{type:"exercise",id:"ex-1-5",title:"Reuse a Variable",domain:"coaching",description:"An athlete body mass of 75 kg is already stored in `mass_kg`. Print `mass_kg` multiplied by 2.",initialCode:"mass_kg = 75",expectedOutput:"150",hints:["Multiply the variable by 2 inside `print()`.","print(mass_kg * ___)"]},{type:"md",md:`## Summary

You now know how to:
- Find your way around the in-browser editor: the code area, Run Code, Check Answer, Reset, the hint button, and the output panel
- Use \`print()\` to display output
- Perform arithmetic calculations
- Store values in variables and reuse them by name

**Setting up Python on your own computer:** this course runs entirely in the browser, but one day you will want Python on your own machine for real projects. Install Python from [python.org](https://www.python.org/downloads/) (on Windows, tick the "Add Python to PATH" box on the first screen). Then install **VS Code** and its **Python extension**. That is the whole setup -- everything you learn here works exactly the same there.

In the next lesson, we step back and ask why programming is worth learning for a sport scientist in the first place.`}],quiz:null}};export{e as lessons};
