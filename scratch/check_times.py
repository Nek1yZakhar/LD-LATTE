import os
import time

for folder in ["data/raw", "data/processed", "output"]:
    print(f"\n--- {folder} ---")
    if os.path.exists(folder):
        for fname in os.listdir(folder):
            fpath = os.path.join(folder, fname)
            mtime = time.ctime(os.path.getmtime(fpath))
            size = os.path.getsize(fpath)
            print(f"{fname:<40} | {mtime} | {size} bytes")
