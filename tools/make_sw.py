"""Atualiza a lista de arquivos e a versão do sw.js (modo offline).

Rode sempre que mudar qualquer arquivo do app, antes de publicar:
    python3 tools/make_sw.py
A versão é um resumo (hash) do conteúdo: se nada mudou, ela não muda e os
aparelhos não baixam tudo de novo.
"""
import hashlib
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
INCLUDE_DIRS = ['css', 'js', 'data', 'img', 'icons']
INCLUDE_FILES = ['index.html', 'manifest.json']
SKIP_EXT = {'.map', '.md', '.py'}


def collect():
    files = list(INCLUDE_FILES)
    for d in INCLUDE_DIRS:
        for base, _, names in os.walk(os.path.join(ROOT, d)):
            for n in names:
                if os.path.splitext(n)[1] in SKIP_EXT or n.startswith('.'):
                    continue
                files.append(os.path.relpath(os.path.join(base, n), ROOT).replace(os.sep, '/'))
    return sorted(set(files))


def main():
    files = collect()
    h = hashlib.sha256()
    total = 0
    for f in files:
        with open(os.path.join(ROOT, f), 'rb') as fh:
            data = fh.read()
        total += len(data)
        h.update(f.encode())
        h.update(data)
    version = h.hexdigest()[:10]
    sw_path = os.path.join(ROOT, 'sw.js')
    with open(sw_path, encoding='utf-8') as fh:
        sw = fh.read()
    lst = json.dumps(['./'] + files, ensure_ascii=False, indent=2)
    sw = re.sub(r'// VERSION-START\n.*?\n// VERSION-END', f"// VERSION-START\nconst VERSION = '{version}';\n// VERSION-END", sw, flags=re.S)
    sw = re.sub(r'// PRECACHE-START\n.*?\n// PRECACHE-END', f'// PRECACHE-START\nconst PRECACHE = {lst};\n// PRECACHE-END', sw, flags=re.S)
    with open(sw_path, 'w', encoding='utf-8') as fh:
        fh.write(sw)
    print(f'sw.js: versão {version}, {len(files)} arquivos, {total / 1024 / 1024:.1f} MB para uso offline')


if __name__ == '__main__':
    main()
