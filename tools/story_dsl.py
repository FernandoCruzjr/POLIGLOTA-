"""Mini-linguagem para escrever histórias ramificadas do Hi Family.

Cada capítulo é um conjunto de sequências nomeadas. Os nós de uma sequência
seguem em ordem; o último precisa ser GO(...) ou END(...). Opções de escolha
podem pular para outra sequência com go='nome' (sem go, seguem em frente).

Marcadores trocados conforme o jogador: {p} khrap/ka, {spouse} wife/husband,
{She} She/He, {spousePt} minha esposa/meu marido, {ElaPt} Ela/Ele,
{aPt} a/o (concordância do cônjuge), {name} nome do jogador.
"""
import json, os

def N(pt, mood='talk'): return {"type": "narration", "pt": pt, "mood": mood}
def T(speaker, en, pt): return {"type": "line", "who": "them", "speaker": speaker, "en": en, "pt": pt}
def Y(en, pt): return {"type": "line", "who": "you", "speaker": "Você", "en": en, "pt": pt}
def TIP(icon, title, pt, dos=(), donts=()): return {"type": "tip", "icon": icon, "title": title, "pt": pt, "dos": list(dos), "donts": list(donts)}
def EX(title, pt, examples=()): return {"type": "explain", "title": title, "pt": pt, "examples": [{"en": e, "pt": p} for e, p in examples]}
def O(text, tone, fb, go=None, pt=None, lang='en'):
    return {"text": text, "tone": tone, "fb": fb, "go": go, "pt": pt, "lang": lang}
def C(prompt, options): return {"type": "choice", "prompt": prompt, "options": options}
def G(speaker, who, en, answer, options, pt):
    return {"type": "gap", "who": who, "speaker": speaker, "en": en, "answer": answer, "options": options, "pt": pt}
def B(pt, en, extra=()): return {"type": "build", "pt": pt, "en": en, "extra": list(extra)}
def GO(label): return {"type": "goto", "to": label}
def END(ending, title, pt): return {"type": "end", "ending": ending, "title": title, "pt": pt}

def chapter(cid, emoji, title, title_en, scene, seqs, summary):
    nodes = {}
    labels = {}
    for label, items in seqs.items():
        ids = [f"{label}.{i}" for i in range(len(items))]
        labels[label] = ids[0]
        for i, node in enumerate(items):
            n = dict(node)
            nxt = ids[i + 1] if i + 1 < len(items) else None
            n["_next"] = nxt
            nodes[ids[i]] = n
    # resolve saltos
    out = {}
    for nid, n in nodes.items():
        t = n["type"]
        if t == "goto":
            continue
        nxt = n.pop("_next")
        def resolve(target, where):
            # segue gotos até um nó real
            seen = 0
            while target and nodes[target]["type"] == "goto":
                target = labels[nodes[target]["to"]]
                seen += 1
                assert seen < 20, where
            return target
        if t == "choice":
            for o in n["options"]:
                tgt = labels[o["go"]] if o["go"] else nxt
                assert tgt, f"{cid} {nid}: opção sem destino"
                o["next"] = resolve(tgt, nid)
                del o["go"]
            assert sum(o["tone"] == "good" for o in n["options"]) >= 1, f"{cid} {nid}: sem opção boa"
        elif t == "end":
            pass
        else:
            assert nxt, f"{cid} {nid}: sequência termina sem GO/END"
            n["next"] = resolve(nxt, nid)
        if t == "gap":
            assert "___" in n["en"] and n["answer"] in n["options"], f"{cid} {nid}: lacuna inválida"
        out[nid] = n
    start = labels["start"]
    # alcance e finais
    reach, stack = set(), [start]
    while stack:
        cur = stack.pop()
        if cur in reach: continue
        reach.add(cur)
        n = out[cur]
        if n["type"] == "choice": stack += [o["next"] for o in n["options"]]
        elif n["type"] != "end": stack.append(n["next"])
    unreached = set(out) - reach
    assert not unreached, f"{cid}: nós inalcançáveis {sorted(unreached)}"
    endings = sorted({n["ending"] for n in out.values() if n["type"] == "end"})
    return {"id": cid, "emoji": emoji, "title": title, "titleEn": title_en, "scene": scene,
            "summary": summary, "start": start, "endings": endings, "nodes": out}


ORDER = ["thailand", "usa"]

def save_trip(trip, root):
    """Grava data/trips/<id>.json e refaz o index.json com todos os destinos."""
    import glob
    json.dump(trip, open(os.path.join(root, f"{trip['id']}.json"), "w"), ensure_ascii=False, indent=1)
    trips = []
    for f in glob.glob(os.path.join(root, "*.json")):
        if f.endswith("index.json"):
            continue
        t = json.load(open(f))
        trips.append({"id": t["id"], "title": t["title"], "emoji": t["emoji"], "chapters": len(t["chapters"]),
                      "intro": t["intro"], "theme": t.get("theme", "ocean"), "boss": t.get("boss"), "route": t.get("route", "")})
    trips.sort(key=lambda t: ORDER.index(t["id"]) if t["id"] in ORDER else 99)
    json.dump({"trips": trips}, open(os.path.join(root, "index.json"), "w"), ensure_ascii=False, indent=1)
