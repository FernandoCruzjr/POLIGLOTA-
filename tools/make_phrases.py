# Treino de fala: junta tools/phrases_src/*.json em data/phrases.json.
# Rodar na pasta do projeto:  python3 tools/make_phrases.py
import json, os
HERE = os.path.dirname(__file__)
ORDER = ["aeroporto", "imigracao", "hotel", "restaurante", "transporte", "direcoes", "passeios", "compras", "emergencias", "conversa"]
SHIELD = [
    ("Sorry, my English is not very good.", "Desculpe, meu inglês não é muito bom."),
    ("Can you speak slowly, please?", "Você pode falar devagar, por favor?"),
    ("Can you say that again, please?", "Pode repetir, por favor?"),
    ("How do you say this in English?", "Como se diz isso em inglês?"),
    ("Can you write it down, please?", "Pode escrever, por favor?"),
    ("I don't understand. Can you show me?", "Não entendi. Pode me mostrar?"),
    ("What does this word mean?", "O que significa esta palavra?"),
    ("One moment, please. I'm thinking.", "Um momento, por favor. Estou pensando."),
]
cats, seen = [], set()
for cid in ORDER:
    d = json.load(open(os.path.join(HERE, "phrases_src", f"{cid}.json")))
    assert len(d["phrases"]) == 50, cid
    for i, p in enumerate(d["phrases"]):
        assert p["en"] not in seen, p["en"]
        seen.add(p["en"])
        p["id"] = f"{cid}.{i}"
    cats.append({"id": cid, "name": d["name"], "emoji": d["emoji"], "phrases": d["phrases"]})
cats.append({"id": "escudo", "name": "Frases-escudo", "emoji": "🛡️", "phrases": [{"id": f"escudo.{i}", "en": e, "pt": p, "sub": "Quando der branco", "level": 1} for i, (e, p) in enumerate(SHIELD)]})
json.dump({"situations": cats}, open(os.path.join(HERE, "..", "data", "phrases.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print(len(cats), sum(len(c["phrases"]) for c in cats))
