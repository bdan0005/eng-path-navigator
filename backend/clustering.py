import numpy as np
from sklearn.cluster import KMeans
import pandas as pd

def define_fuzzy_sets(values):
    values = np.array(values).reshape(-1, 1)
    kmeans = KMeans(n_clusters=3, random_state=0).fit(values)
    centers = np.sort(kmeans.cluster_centers_.flatten())
    return centers  

def assign_fuzzy_label(value, centers):
    if value <= (centers[0] + centers[1]) / 2:
        return "Low"
    elif value <= (centers[1] + centers[2]) / 2:
        return "Medium"
    else:
        return "High"
    
df = pd.read_excel("specialisation_data_clean.xlsx", engine="openpyxl")
    
df['extraversion_label'] = df['Extraversion'].apply(lambda v: assign_fuzzy_label(v, extraversion_centers))
df['emotionality_label'] = df['Emotionality'].apply(lambda v: assign_fuzzy_label(v, emotionality_centers))
df['conscientiousness_label'] = df['Conscientiousness'].apply(lambda v: assign_fuzzy_label(v, conscientiousness_centers))
df['agreeableness_label'] = df['Agreeableness'].apply(lambda v: assign_fuzzy_label(v, agreeableness_centers))
df['openness_label'] = df['Openness'].apply(lambda v: assign_fuzzy_label(v, openness_centers))

grouped = df.groupby(['extraversion_label', 'emotionality_label', 'specialisation']).size().reset_index(name='count')
grouped = grouped.sort_values('count', ascending=False)

rules = []
for _, row in grouped.iterrows():
    rule = f"IF Extraversion IS {row['extraversion_label']} AND Emotionality IS {row['emotionality_label']} THEN Recommend {row['specialisation']} (Count: {row['count']})"
    rules.append(rule)
