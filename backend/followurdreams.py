import pandas as pd
import os

# -------------------------------
# Load and prepare the dataset
# -------------------------------

# loading file with specialisation data
file_path = os.path.join(os.path.dirname(__file__), "specialisation_data_clean.xlsx")
df = pd.read_excel(file_path, engine="openpyxl")

# replace minispecialisations with their main specialisation
df['Current specialisation'] = df['Current specialisation'].replace({
    'Robotics and mechatronics engineering in artificial intelligence': 'robotics and mechatronics engineering',
    'Robotics and mechatronics engineering in automation': 'robotics and mechatronics engineering'
})

# preferences are indicated with 1, not chosen with 0
specialisation_columns = [
    col for col in df.columns
    if col not in [
        'StudentID', 'Current specialisation',
        'Extraversion', 'Emotionality', 'Conscientiousness',
        'Agreeableness', 'Openness',
        'CAD', 'Design', '3D Printing',
        'Teamwork', 'Coding', 'Microcontrollers'
    ]
]

# final specialisations are indicated with 1, not chosen with 0
def get_all_indicated_specialisations(row):
    return [col for col in specialisation_columns if row.get(col, 0) == 1]

df['Indicated specialisations'] = df.apply(get_all_indicated_specialisations, axis=1)

# final spec that wasnt chosen as preferences
df['Changed'] = df.apply(
    lambda row: row['Current specialisation'].strip().lower()
    not in [s.strip().lower() for s in row['Indicated specialisations']],
    axis=1
)

# -------------------------------
# General statistics
# -------------------------------

total_students = len(df)
num_changed = df['Changed'].sum()
change_rate = 100 * num_changed / total_students

# -------------------------------
# Transition analysis
# -------------------------------

# filter for students who changed their specialisation
df_changed = df[df['Changed']].copy()
df_changed = df_changed.explode('Indicated specialisations')

# freq of indicated specialisations vs actual specialisation
transition_counts = df_changed.groupby(
    ['Indicated specialisations', 'Current specialisation']
).size().sort_values(ascending=False)

# -------------------------------
# Output transition statistics
# -------------------------------

print(f"\nTotal students: {total_students}")
print(f"Number of students who changed specialisation: {num_changed}")
print(f"Percentage who changed: {change_rate:.2f}%\n")

print("🔁 Most common transitions (Indicated ➝ Actual):")
print(transition_counts.head(20))

print(f"\nTotal transition instances (rows in exploded df): {len(df_changed)}")
print(f"Sum of all transition counts: {transition_counts.sum()}")

# -------------------------------
# Per-specialisation abandonment analysis
# -------------------------------

# row for each student with their indicated specialisations
df_transitions_full = df.copy()
df_transitions_full = df_transitions_full.explode('Indicated specialisations')

# drop any missing rows
df_transitions_full = df_transitions_full.dropna(subset=['Indicated specialisations'])

# true if the current specialisation matches the indicated one
# false if the student changed their specialisation
df_transitions_full['Stayed (this spec)'] = df_transitions_full.apply(
    lambda row: row['Current specialisation'].strip().lower() ==
                row['Indicated specialisations'].strip().lower(),
    axis=1
)

# calculates total indication and number times students changed for each specialisation
change_summary = df_transitions_full.groupby('Indicated specialisations')['Stayed (this spec)'].agg(
    total_indicated='count',
    num_changed=lambda x: (~x).sum()
)

# % change per specialisation
change_summary['% Changed (per spec)'] = 100 * change_summary['num_changed'] / change_summary['total_indicated']
change_summary = change_summary.sort_values('% Changed (per spec)', ascending=False)

# -------------------------------
# Output abandonment statistics
# -------------------------------

print("\n📉 Change count and percentage per specialisation (based on individual match):")
print(change_summary.head(20))
