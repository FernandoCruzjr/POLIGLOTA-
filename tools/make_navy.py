"""Gera data/navy.json (área Marinha ⚓) a partir de tools/navy_vocab.py e tools/navy_exchange.py.

Uso: python3 tools/make_navy.py
Confere campos obrigatórios, ids repetidos e notas das opções do intercâmbio.
"""
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from navy_vocab import CATEGORIES  # noqa: E402
from navy_exchange import EXCHANGES  # noqa: E402

OUT = os.path.join(HERE, '..', 'data', 'navy.json')


def slug(text):
    t = unicodedata.normalize('NFD', text.lower())
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:40]


def build_vocab():
    cats = []
    seen = set()
    for c in CATEGORIES:
        words = []
        for w in c['words']:
            assert len(w) == 5 and all(w), f"palavra incompleta em {c['id']}: {w}"
            en, pt, pron, ex, ex_pt = w
            wid = f"{c['id']}.{slug(en)}"
            assert wid not in seen, f'id repetido: {wid}'
            seen.add(wid)
            words.append({'id': wid, 'en': en, 'pt': pt, 'pron': pron, 'ex': ex, 'exPt': ex_pt})
        cats.append({'id': c['id'], 'name': c['name'], 'emoji': c['emoji'], 'desc': c['desc'], 'words': words})
    return cats


def build_exchanges():
    out = []
    ids = set()
    for x in EXCHANGES:
        assert x['id'] not in ids, f"intercâmbio repetido: {x['id']}"
        ids.add(x['id'])
        steps = []
        for s in x['steps']:
            if s[0] == 'npc':
                steps.append({'who': 'npc', 'en': s[1], 'pt': s[2]})
                continue
            opts = []
            for o in s[2]:
                assert len(o) in (4, 6), f"opção mal formada em {x['id']}: {o}"
                opt = {'en': o[0], 'pt': o[1], 'score': o[2], 'fb': o[3]}
                assert opt['score'] in (0, 1, 2)
                if len(o) == 6:
                    opt['react'] = {'en': o[4], 'pt': o[5]}
                opts.append(opt)
            assert any(o['score'] == 2 for o in opts), f"sem resposta ótima em {x['id']}: {s[1]}"
            steps.append({'who': 'you', 'hint': s[1], 'options': opts})
        item = {k: x[k] for k in ('id', 'flag', 'country', 'navy', 'partner', 'role', 'accent', 'level', 'title', 'setting')}
        item['steps'] = steps
        item['keys'] = [{'en': en, 'pt': pt} for en, pt in x['keys']]
        out.append(item)
    return out


def main():
    data = {'version': 1, 'perDay': 10, 'categories': build_vocab(), 'exchanges': build_exchanges()}
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    n = sum(len(c['words']) for c in data['categories'])
    turns = sum(1 for x in data['exchanges'] for s in x['steps'] if s['who'] == 'you')
    print(f"data/navy.json: {len(data['categories'])} temas, {n} termos, {len(data['exchanges'])} intercâmbios, {turns} falas suas")


if __name__ == '__main__':
    main()
