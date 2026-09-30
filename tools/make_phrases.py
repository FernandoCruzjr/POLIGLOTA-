# Treino de fala: junta tools/phrases_src/*.json em data/phrases.json.
# Rodar na pasta do projeto:  python3 tools/make_phrases.py
import json, os
HERE = os.path.dirname(__file__)
ORDER = ["aeroporto", "imigracao", "hotel", "restaurante", "transporte", "direcoes", "passeios", "compras", "emergencias", "conversa"]
SHIELD = [
    ("Sorry, my English is not very good.", "Desculpe, meu inglês não é muito bom.", "SÓ-ri, mai ÍN-glix iz nót VÉ-ri GUD."),
    ("Can you speak slowly, please?", "Você pode falar devagar, por favor?", "kén iu SPÍK SLÔU-li, pliiz?"),
    ("Can you say that again, please?", "Pode repetir, por favor?", "kén iu SÊI dhét â-GUÉN, pliiz?"),
    ("How do you say this in English?", "Como se diz isso em inglês?", "ráu du iu SÊI dhis in ÍN-glix?"),
    ("Can you write it down, please?", "Pode escrever, por favor?", "kén iu RÁIT it DÁUN, pliiz?"),
    ("I don't understand. Can you show me?", "Não entendi. Pode me mostrar?", "ai dôunt ân-der-STÉND. kén iu XÔU mi?"),
    ("What does this word mean?", "O que significa esta palavra?", "uât dâz dhis UÂRD MÍN?"),
    ("One moment, please. I'm thinking.", "Um momento, por favor. Estou pensando.", "UÂN MÔU-ment, pliiz. aim THÍN-kin."),
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
cats.append({"id": "escudo", "name": "Frases-escudo", "emoji": "🛡️", "phrases": [{"id": f"escudo.{i}", "en": e, "pt": p, "pron": r, "sub": "Quando der branco", "level": 1} for i, (e, p, r) in enumerate(SHIELD)]})
json.dump({"situations": cats}, open(os.path.join(HERE, "..", "data", "phrases.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print(len(cats), sum(len(c["phrases"]) for c in cats))
