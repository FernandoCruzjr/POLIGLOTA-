# Área Kids: gera data/kids.json juntando tools/kids_src/*.json (bichos,
# cozinha, quarto, banheiro, sala) com números e cores gerados aqui.
# Rodar na pasta do projeto:  python3 tools/make_kids.py
import json, os

HERE = os.path.dirname(__file__)
src = lambda name: json.load(open(os.path.join(HERE, "kids_src", f"{name}.json")))["items"]

# ---------------------------------------------------------------- números
U = [("zero", "zero", "ZI-rou"), ("one", "um", "UÂN"), ("two", "dois", "TUU"), ("three", "três", "THRII"), ("four", "quatro", "FÓR"),
     ("five", "cinco", "FÁIV"), ("six", "seis", "SÍKS"), ("seven", "sete", "SÉ-ven"), ("eight", "oito", "ÊIT"), ("nine", "nove", "NÁIN")]
TEENS = [("ten", "dez", "TÉN"), ("eleven", "onze", "i-LÉ-ven"), ("twelve", "doze", "TUÉLV"), ("thirteen", "treze", "thâr-TIIN"),
         ("fourteen", "catorze", "for-TIIN"), ("fifteen", "quinze", "fif-TIIN"), ("sixteen", "dezesseis", "siks-TIIN"),
         ("seventeen", "dezessete", "se-ven-TIIN"), ("eighteen", "dezoito", "ei-TIIN"), ("nineteen", "dezenove", "nain-TIIN")]
TENS = {2: ("twenty", "vinte", "TUÉN-ti"), 3: ("thirty", "trinta", "THÂR-ti"), 4: ("forty", "quarenta", "FÓR-ti"), 5: ("fifty", "cinquenta", "FÍF-ti"),
        6: ("sixty", "sessenta", "SÍKS-ti"), 7: ("seventy", "setenta", "SÉ-ven-ti"), 8: ("eighty", "oitenta", "ÊI-ti"), 9: ("ninety", "noventa", "NÁIN-ti")}

def num(n):
    if n < 10: return U[n]
    if n < 20: return TEENS[n - 10]
    if n < 100:
        t, u = divmod(n, 10)
        en, pt, pr = TENS[t]
        if not u: return en, pt, pr
        ue, up, ur = U[u]
        return f"{en}-{ue}", f"{pt} e {up}", f"{pr} {ur}"
    if n == 100: return "one hundred", "cem", "UÂN RÂN-dred"

numbers = []
for n in range(0, 101):
    en, pt, pr = num(n)
    numbers.append({"n": n, "en": en, "pt": pt, "pron": pr, "say": f"I can count to {en}!" if n in (10, 20, 50, 100) else None})
HUND_PT = {2: "duzentos", 3: "trezentos", 4: "quatrocentos", 5: "quinhentos", 6: "seiscentos", 7: "setecentos", 8: "oitocentos", 9: "novecentos"}
for h in range(2, 10):
    en, _, pr = U[h]
    numbers.append({"n": h * 100, "en": f"{en} hundred", "pt": HUND_PT[h], "pron": f"{pr} RÂN-dred"})
numbers += [
    {"n": 1000, "label": "1,000", "en": "one thousand", "pt": "mil", "pron": "UÂN THÁU-zend", "say": "One thousand stars in the sky!", "sayPt": "Mil estrelas no céu!"},
    {"n": 10000, "label": "10,000", "en": "ten thousand", "pt": "dez mil", "pron": "TÉN THÁU-zend"},
    {"n": 1000000, "label": "1M", "en": "one million", "pt": "um milhão", "pron": "UÂN MÍ-li-on", "say": "I have one million ideas!", "sayPt": "Eu tenho um milhão de ideias!"},
]
ORD = [("first", "primeiro", "FÂRST"), ("second", "segundo", "SÉ-kond"), ("third", "terceiro", "THÂRD"), ("fourth", "quarto", "FÓRTH"),
       ("fifth", "quinto", "FÍFTH"), ("sixth", "sexto", "SÍKSTH"), ("seventh", "sétimo", "SÉ-venth"), ("eighth", "oitavo", "ÊITH"),
       ("ninth", "nono", "NÁINTH"), ("tenth", "décimo", "TÉNTH"), ("eleventh", "décimo primeiro", "i-LÉ-venth"), ("twelfth", "décimo segundo", "TUÉLFTH"),
       ("thirteenth", "décimo terceiro", "thâr-TIINTH"), ("fourteenth", "décimo quarto", "for-TIINTH"), ("fifteenth", "décimo quinto", "fif-TIINTH"),
       ("sixteenth", "décimo sexto", "siks-TIINTH"), ("seventeenth", "décimo sétimo", "se-ven-TIINTH"), ("eighteenth", "décimo oitavo", "ei-TIINTH"),
       ("nineteenth", "décimo nono", "nain-TIINTH"), ("twentieth", "vigésimo", "TUÉN-ti-eth")]
suffix = lambda n: "st" if n % 10 == 1 and n != 11 else "nd" if n % 10 == 2 and n != 12 else "rd" if n % 10 == 3 and n != 13 else "th"
for i, (en, pt, pr) in enumerate(ORD, start=1):
    numbers.append({"n": i, "label": f"{i}{suffix(i)}", "en": en, "pt": pt, "pron": pr, "ordinal": True,
                    "say": f"My birthday is on the {en}." if i <= 3 else None, "sayPt": f"Meu aniversário é no dia {i}." if i <= 3 else None})
for n, en, pt, pr in [(21, "twenty-first", "vigésimo primeiro", "TUÉN-ti FÂRST"), (22, "twenty-second", "vigésimo segundo", "TUÉN-ti SÉ-kond"),
                      (23, "twenty-third", "vigésimo terceiro", "TUÉN-ti THÂRD"), (30, "thirtieth", "trigésimo", "THÂR-ti-eth"),
                      (31, "thirty-first", "trigésimo primeiro", "THÂR-ti FÂRST")]:
    numbers.append({"n": n, "label": f"{n}{suffix(n)}", "en": en, "pt": pt, "pron": pr, "ordinal": True})
for label, en, pt, pr in [("½", "half", "metade", "RÉF"), ("⅓", "one third", "um terço", "UÂN THÂRD"), ("¼", "one quarter", "um quarto", "UÂN KUÓR-ter"),
                          ("12", "a dozen", "uma dúzia", "a DÂ-zen")]:
    numbers.append({"n": None, "label": label, "en": en, "pt": pt, "pron": pr, "say": "Half for me, half for you!" if en == "half" else None,
                    "sayPt": "Metade para mim, metade para você!" if en == "half" else None})
for it in numbers:
    if not it.get("say"): it["say"] = it["en"]
    it.setdefault("sayPt", None)

# ---------------------------------------------------------------- cores
C = {  # en: (pt masc, pt fem, pron, hex)
  "red": ("vermelho", "vermelha", "RÉD", "#E53935"), "blue": ("azul", "azul", "BLUU", "#1E63D6"), "yellow": ("amarelo", "amarela", "IÉ-lou", "#FDD835"),
  "green": ("verde", "verde", "GRIIN", "#2E9E4F"), "orange": ("laranja", "laranja", "Ó-rindj", "#FB8C00"), "purple": ("roxo", "roxa", "PÂR-pol", "#8E44AD"),
  "pink": ("rosa", "rosa", "PÍNK", "#F06292"), "brown": ("marrom", "marrom", "BRÁUN", "#795548"), "black": ("preto", "preta", "BLÉK", "#212121"),
  "white": ("branco", "branca", "UÁIT", "#FFFFFF"), "gray": ("cinza", "cinza", "GRÊI", "#9E9E9E"), "gold": ("dourado", "dourada", "GÔULD", "#D4A017"),
  "silver": ("prateado", "prateada", "SÍL-ver", "#C0C0C0"),
}
SHADES = [("light blue", "azul-claro", "LÁIT BLUU", "#81D4FA"), ("dark blue", "azul-escuro", "DÁRK BLUU", "#0D2A73"), ("navy blue", "azul-marinho", "NÊI-vi BLUU", "#1A237E"),
          ("sky blue", "azul-celeste", "SKÁI BLUU", "#4FC3F7"), ("light green", "verde-claro", "LÁIT GRIIN", "#A5D6A7"), ("dark green", "verde-escuro", "DÁRK GRIIN", "#1B5E20"),
          ("lime green", "verde-limão", "LÁIM GRIIN", "#C0E218"), ("olive green", "verde-oliva", "Ó-liv GRIIN", "#6B8E23"), ("turquoise", "turquesa", "TÂR-kuóiz", "#1ABC9C"),
          ("beige", "bege", "BÊIJ", "#E8D5B0"), ("cream", "creme", "KRIIM", "#FFF6D5"), ("violet", "violeta", "VÁI-o-let", "#7F00FF"), ("lilac", "lilás", "LÁI-lak", "#C8A2C8"),
          ("burgundy", "vinho", "BÂR-gân-di", "#800020"), ("coral", "coral", "KÓ-ral", "#FF7F50"), ("salmon", "salmão", "SÉ-mon", "#FA8072"), ("hot pink", "rosa-choque", "RÁT PÍNK", "#FF1493"),
          ("khaki", "cáqui", "KÉ-ki", "#C3B091"), ("light gray", "cinza-claro", "LÁIT GRÊI", "#D3D3D3"), ("dark gray", "cinza-escuro", "DÁRK GRÊI", "#4A4A4A")]
colors = []
for en, (m, f, pr, hx) in C.items():
    colors.append({"hex": hx, "en": en, "pt": m, "pron": pr, "say": f"My favorite color is {en}.", "sayPt": f"Minha cor favorita é {m}."})
for en, pt, pr, hx in SHADES:
    colors.append({"hex": hx, "en": en, "pt": pt, "pron": pr, "say": f"I like {en}.", "sayPt": f"Eu gosto de {pt}."})

# Coisas coloridas: (fonte, en do item, cor, gênero/número do nome em pt: m, f, mp, fp)
lib = {}
for name in ["cozinha", "quarto", "sala", "animais", "banheiro"]:
    for it in src(name):
        lib.setdefault(it["en"], it)
THINGS = """banana yellow f|apple red f|lemon yellow m|strawberry red m|cherry red f|grapes purple fp|watermelon green f|pineapple yellow m|kiwi green m
tomato red m|carrot orange f|broccoli green m|corn yellow m|eggplant purple f|lettuce green f|cucumber green m|pumpkin orange f|blueberry blue m
coconut brown m|avocado green m|olive green f|mushroom red m|chili pepper red f|pepper green m|potato brown f|egg white m|milk white m|coffee black m
chocolate brown m|cheese yellow m|butter yellow f|honey gold m|crown gold f|moon yellow f|star yellow f|sun yellow m|cloud white f
teddy bear brown m|pencil yellow m|plant green f|cactus green m|rose red f|sunflower yellow m|tulip pink f|clover green m|basketball orange f
tennis ball yellow f|pool ball black f|fire extinguisher red m|balloon red m|coin gold f|key gold f|bell gold f|trophy gold m|Christmas tree green f
frog green m|flamingo pink m|pig pink m|elephant gray m|swan white m|dolphin gray m|whale blue f|shark gray m|crab red m|lobster red f|ladybug red f
butterfly blue f|bear brown m|fox orange f|tiger orange m|crocodile green m|lizard green m|snake green f|turtle green f|chick yellow m|horse brown m
sheep white f|bat black m|spider black f|giraffe yellow f|dinosaur green m|unicorn white m|caterpillar green f|toilet white m|bathtub white f
sponge yellow f|rubber duck yellow m|lipstick red m|tooth white m|tongue pink f|bone white m|boots brown fp|jeans blue f
fire orange m|scissors red f|paintbrush brown m|rocket red m|ghost white m|alien green m|planet orange m|robot gray m|snail brown m|ant black f
koala gray m|penguin black m|panda white m|zebra white f|squirrel brown m|dove white f|eagle brown f|cow white f"""
extra_emoji = [("❤️", "red heart", "coração vermelho", "RÉD RÁRT"), ("🧡", "orange heart", "coração laranja", "Ó-rindj RÁRT"), ("💛", "yellow heart", "coração amarelo", "IÉ-lou RÁRT"),
               ("💚", "green heart", "coração verde", "GRIIN RÁRT"), ("💙", "blue heart", "coração azul", "BLUU RÁRT"), ("💜", "purple heart", "coração roxo", "PÂR-pol RÁRT"),
               ("🖤", "black heart", "coração preto", "BLÉK RÁRT"), ("🤍", "white heart", "coração branco", "UÁIT RÁRT"), ("🤎", "brown heart", "coração marrom", "BRÁUN RÁRT"),
               ("🟥", "red square", "quadrado vermelho", "RÉD SKUÉR"), ("🟧", "orange square", "quadrado laranja", "Ó-rindj SKUÉR"), ("🟨", "yellow square", "quadrado amarelo", "IÉ-lou SKUÉR"),
               ("🟩", "green square", "quadrado verde", "GRIIN SKUÉR"), ("🟦", "blue square", "quadrado azul", "BLUU SKUÉR"), ("🟪", "purple square", "quadrado roxo", "PÂR-pol SKUÉR"),
               ("🟫", "brown square", "quadrado marrom", "BRÁUN SKUÉR"), ("⬛", "black square", "quadrado preto", "BLÉK SKUÉR"), ("⬜", "white square", "quadrado branco", "UÁIT SKUÉR"),
               ("🔴", "red circle", "círculo vermelho", "RÉD SÂR-kol"), ("🟠", "orange circle", "círculo laranja", "Ó-rindj SÂR-kol"), ("🟡", "yellow circle", "círculo amarelo", "IÉ-lou SÂR-kol"),
               ("🟢", "green circle", "círculo verde", "GRIIN SÂR-kol"), ("🔵", "blue circle", "círculo azul", "BLUU SÂR-kol"), ("🟣", "purple circle", "círculo roxo", "PÂR-pol SÂR-kol"),
               ("🟤", "brown circle", "círculo marrom", "BRÁUN SÂR-kol"), ("🔺", "red triangle", "triângulo vermelho", "RÉD TRÁI-en-gol"), ("🔷", "blue diamond", "losango azul", "BLUU DÁI-mond"),
               ("🔶", "orange diamond", "losango laranja", "Ó-rindj DÁI-mond"), ("📕", "red book", "livro vermelho", "RÉD BÚK"), ("📗", "green book", "livro verde", "GRIIN BÚK"),
               ("📘", "blue book", "livro azul", "BLUU BÚK"), ("📙", "orange book", "livro laranja", "Ó-rindj BÚK"), ("🍏", "green apple", "maçã verde", "GRIIN É-pol")]
PLURAL_PT = {"verde": "verdes", "azul": "azuis", "marrom": "marrons", "roxa": "roxas", "vermelha": "vermelhas", "preta": "pretas", "amarela": "amarelas", "branca": "brancas"}
used = set(e for e, *_ in extra_emoji)
for line in THINGS.split("|"):
    parts = line.strip().split()
    g = parts[-1]; col = parts[-2]; noun = " ".join(parts[:-2])
    if g not in ("m", "f", "mp", "fp") or noun not in lib: continue
    it = lib[noun]
    if it["emoji"] in used or f"{col} {noun}" in {e[1] for e in extra_emoji}: continue
    used.add(it["emoji"])
    m, f, cpr, _ = C[col]
    adj = f if g.startswith("f") else m
    if g.endswith("p"): adj = PLURAL_PT.get(adj, adj + "s") if adj not in ("laranja", "rosa", "cinza") else adj
    pt_noun = it["pt"]
    plural = g.endswith("p") or noun in ("grapes", "jeans", "scissors", "boots")
    be = "are" if plural else "is"
    art = "Os" if g == "mp" else "As" if g == "fp" else "O" if g == "m" else "A"
    ser = "são" if g.endswith("p") else "é"
    colors.append({"emoji": it["emoji"], "en": f"{col} {noun}", "pt": f"{pt_noun} {adj}", "pron": f"{cpr} {it['pron']}",
                   "say": f"The {noun} {be} {col}.", "sayPt": f"{art} {pt_noun} {ser} {adj}."})
for e, en, pt, pr in extra_emoji:
    colors.append({"emoji": e, "en": en, "pt": pt, "pron": pr, "say": f"Look! A {en}." if not en.startswith(("orange",)) else f"Look! An {en}.", "sayPt": f"Olha! Um {pt}." if not pt.startswith(("maçã",)) else f"Olha! Uma {pt}."})

cats = [
  {"id": "animais", "name": "Animais", "nameEn": "Animals", "emoji": "🦁", "color": "#FFB74D", "kind": "animal", "items": src("animais")},
  {"id": "cores", "name": "Cores", "nameEn": "Colors", "emoji": "🎨", "color": "#BA68C8", "kind": "color", "items": colors},
  {"id": "numeros", "name": "Números", "nameEn": "Numbers", "emoji": "🔢", "color": "#4FC3F7", "kind": "number", "items": numbers},
  {"id": "cozinha", "name": "Cozinha", "nameEn": "Kitchen", "emoji": "🍳", "color": "#FF8A65", "kind": "object", "room": True, "items": src("cozinha")},
  {"id": "quarto", "name": "Quarto", "nameEn": "Bedroom", "emoji": "🛏️", "color": "#9575CD", "kind": "object", "room": True, "items": src("quarto")},
  {"id": "banheiro", "name": "Banheiro", "nameEn": "Bathroom", "emoji": "🛁", "color": "#4DD0E1", "kind": "object", "room": True, "items": src("banheiro")},
  {"id": "sala", "name": "Sala", "nameEn": "Living room", "emoji": "🛋️", "color": "#81C784", "kind": "object", "room": True, "items": src("sala")},
  {"id": "cumprimentos", "name": "Cumprimentos", "nameEn": "Greetings", "emoji": "👋", "color": "#FFD54F", "kind": "object", "group": "dia", "items": src("cumprimentos")},
  {"id": "verbos", "name": "Verbos", "nameEn": "Verbs", "emoji": "🏃", "color": "#4DB6AC", "kind": "object", "group": "dia", "items": src("verbos")},
  {"id": "emocoes", "name": "Emoções", "nameEn": "Feelings", "emoji": "😊", "color": "#F48FB1", "kind": "object", "group": "dia", "items": src("emocoes")},
  {"id": "horas", "name": "Horas", "nameEn": "Time", "emoji": "🕒", "color": "#90A4AE", "kind": "object", "group": "tempo", "items": src("horas")},
  {"id": "dias", "name": "Dias da semana", "nameEn": "Days of the week", "emoji": "📅", "color": "#7986CB", "kind": "object", "group": "tempo", "items": src("dias")},
  {"id": "meses", "name": "Meses", "nameEn": "Months", "emoji": "🗓️", "color": "#A1887F", "kind": "object", "group": "tempo", "items": src("meses")},
  {"id": "estacoes", "name": "Estações do ano", "nameEn": "Seasons", "emoji": "🍂", "color": "#FFB74D", "kind": "object", "group": "tempo", "items": src("estacoes")},
  {"id": "clima", "name": "Clima", "nameEn": "Weather", "emoji": "🌦️", "color": "#64B5F6", "kind": "object", "group": "natureza", "items": src("clima")},
  {"id": "natureza", "name": "Natureza", "nameEn": "Nature", "emoji": "🌳", "color": "#66BB6A", "kind": "object", "group": "natureza", "items": src("natureza")},
]
for c in cats:
    seen_en, seen_pic = set(), set()
    for i, it in enumerate(c["items"]):
        it["id"] = f"{c['id']}.{i}"
        assert it["en"] and it["pt"] and it["pron"], it
        pic = it.get("label") or it.get("emoji") or it.get("hex") or str(it.get("n"))
        key = (pic, it.get("ordinal"))
        assert it["en"] not in seen_en, (c["id"], it["en"])
        assert key not in seen_pic or c["kind"] == "number", (c["id"], pic, it["en"])
        seen_en.add(it["en"]); seen_pic.add(key)
out = os.path.join(HERE, "..", "data", "kids.json")
json.dump({"categories": cats}, open(out, "w"), ensure_ascii=False, separators=(",", ":"))
print({c["id"]: len(c["items"]) for c in cats}, "total", sum(len(c["items"]) for c in cats))
