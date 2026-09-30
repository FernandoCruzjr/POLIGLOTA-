# Lista todas as palavras em inglês do app (para o dicionário de toque).
import json, glob, re, os
ROOT = os.path.join(os.path.dirname(__file__), "..")
KEYS = {"en", "text", "say", "titleEn", "sound", "end", "start"}
texts = []
def walk(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in KEYS and isinstance(v, str): texts.append(v)
            else: walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
files = glob.glob(os.path.join(ROOT, "data/trips/*.json")) + [os.path.join(ROOT, f) for f in ["data/phrases.json", "data/kids.json", "data/course.json", "data/patterns.json"]]
for f in files: walk(json.load(open(f)))
def tokens(t):
    for w in re.findall(r"[A-Za-z][A-Za-z'’]*", t.replace("’", "'")):
        w = w.lower().strip("'")
        if w: yield w
toks = sorted({w for t in texts for w in tokens(t)})
if __name__ == "__main__":
    print(len(toks))
