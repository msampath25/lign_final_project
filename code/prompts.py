import pandas as pd
from openai import ChatCompletion

# Load data
course_catalog = pd.read_csv("course_catalog.csv")
capes_data = pd.read_csv("capes.csv")

# Filter courses based on student's input
def recommend_courses(interests, workload_pref):
    filtered_courses = course_catalog[course_catalog["description"].str.contains('|'.join(interests))]
    matched_courses = capes_data.merge(filtered_courses, on="course_code")
    recommendations = matched_courses.sort_values(by=["instructor_rating", "workload"], ascending=[False, True])
    return recommendations.head(5)

# GPT-4 interaction
response = ChatCompletion.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are an academic advisor."},
        {"role": "user", "content": f"Recommend courses: {recommend_courses}"} 
    ]
)
print(response)