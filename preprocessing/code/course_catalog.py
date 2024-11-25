import requests
import re

courses = ['LING', 'BENG', 'CSE', 'DSC', 'ECE', 'PSYC', 'BIOL', 'MAE']
for c in courses:
    html_file = requests.get(f"https://catalog.ucsd.edu/courses/{c}.html")
    f = open(f'../{c}_catalog.txt', 'w')
    for line in html_file.iter_lines():
        line = line.decode('utf-8')
        print(line)
        if "course-name" in line:
            pattern = r'"course-name">(.*?)</p>'
            match = re.search(pattern, line)
            if match:
                f.write('>' + match.group(1) + '\n')
        elif "course-descriptions" in line:
            pattern = r'course-descriptions">(.*?)</p>'
            match = re.search(pattern, line)
            if match:
                f.write(match.group(1) + '\n')
    f.close()