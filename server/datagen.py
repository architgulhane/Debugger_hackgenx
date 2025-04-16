import pandas as pd
import random
import json


ministries = [
    "Health", "Education", "Defense", "Agriculture", "Railways",
    "Environment", "Women & Child Welfare", "Science & Tech",
    "Home Affairs", "Sports", "Finance", "External Affairs",
    "Road Transport", "Power", "Housing & Urban Affairs"
]
priority_levels = ["Very High", "High", "Medium", "Low"]
region_impacts = ["National", "Rural", "Urban", "Multi-State", "Select States"]


priority_weights = {
    "Very High": 1.0,
    "High": 0.8,
    "Medium": 0.6,
    "Low": 0.4
}


def generate_allocated_budget(prev_budget, dev_index, priority_weight, gdp_impact):
    noise = random.uniform(-0.05, 0.1)  # ±5% to +10% noise
    return round(prev_budget * (1 + 0.3 * dev_index + 0.2 * priority_weight + 0.1 * gdp_impact + noise), 2)


rows = []
for _ in range(1000000):
    ministry = random.choice(ministries)
    priority = random.choice(priority_levels)
    projects = random.randint(10, 200)
    region = random.choice(region_impacts)
    dev_index = round(random.uniform(0.3, 0.9), 2)
    prev_budget = round(random.uniform(10000, 150000), 2)
    expected_budget = prev_budget * (1 + 0.3 * dev_index + 0.2 * priority_weights[priority])
    gdp_impact = round(random.uniform(0.5, 4.0), 2)
    alloc_budget = generate_allocated_budget(prev_budget, dev_index, priority_weights[priority], gdp_impact)

    rows.append([
        ministry, priority, projects, region, dev_index,
        prev_budget, gdp_impact, alloc_budget
    ])


df = pd.DataFrame(rows, columns=[
    "Ministry", "Priority_Level", "Projects_Count", "Region_Impact",
    "Dev_Index", "Prev_Budget (Cr)", "GDP_Impact (%)", "Allocated_Budget (Cr)"
])
df.to_csv("Pministry_budget_1000k.csv", index=False)
print("Generated ministry_budget_10k.csv with 10,000 records.")


#this script generates a CSV file with 1,000,000 records of ministry budget data

