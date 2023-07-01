import pandas as pd
import random

df = pd.read_csv('/Users/rafaelribeiro/Documents/fugro_api/docs/file123.csv')

random_rows = df.sample(n=100)

random_rows.to_csv('random_rows.csv', index=False)

print(random_rows)
