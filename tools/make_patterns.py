# Frases que se encaixam: tools/patterns_src.json -> data/patterns.json
import json, os
HERE = os.path.dirname(__file__)
d = json.load(open(os.path.join(HERE, "patterns_src.json")))
for f in d["frames"]:
    for i, e in enumerate(f["endings"]):
        e["id"] = f"{f['id']}.{i}"
json.dump(d, open(os.path.join(HERE, "..", "data", "patterns.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print(len(d["frames"]), sum(len(f["endings"]) for f in d["frames"]))
