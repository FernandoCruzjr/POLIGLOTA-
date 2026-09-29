# Aventura no Japão (20 dias, 16 capítulos) — gera data/trips/japan.json
# Rodar na pasta do projeto:  python3 tools/story_japan.py
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from story_dsl import save_trip
import story_japan_part1 as p1, story_japan_part2 as p2, story_japan_part3 as p3, story_japan_part4 as p4

ch = p1.CH + p2.CH + p3.CH + p4.CH
assert [c["id"] for c in ch] == [f"c{i}" for i in range(1, 17)], [c["id"] for c in ch]
trip = {
  "id": "japan",
  "title": "Aventura no Japão",
  "titleEn": "Japan Adventure",
  "emoji": "🇯🇵",
  "intro": "20 dias de Tóquio a Hiroshima: konbini, lámen, metrô, izakaya, onsen, trem-bala, templos de Kyoto, cervos de Nara e comida de rua em Osaka.",
  "chapters": ch,
  "theme": "sakura",
  "route": "🛫 São Paulo → Tóquio",
  "boss": {"name": "O Ninja do Trem-Bala", "emoji": "🥷", "intro": "Shhh… O Ninja do Trem-Bala é rápido como o shinkansen! Mostre tudo o que você aprendeu no Japão antes que o trem parta!"},
}
root = os.path.join(os.path.dirname(__file__), "..", "data", "trips")
save_trip(trip, root)
for c in ch:
    kinds = {}
    for n in c["nodes"].values():
        kinds[n["type"]] = kinds.get(n["type"], 0) + 1
    print(c["id"], c["title"], len(c["nodes"]), "nós,", c["endings"], kinds.get("build", 0), "builds")
