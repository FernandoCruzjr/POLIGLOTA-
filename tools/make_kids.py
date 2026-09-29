# Área Kids: gera data/kids.json. Rodar: python3 tools/make_kids.py
import json, os

def A(emoji, en, pt, pron, sound):
    return {"emoji": emoji, "en": en, "pt": pt, "pron": pron, "sound": sound, "say": f"The {en} says: {sound}"}
def O(emoji, en, pt, pron, say=None):
    return {"emoji": emoji, "en": en, "pt": pt, "pron": pron, "say": say}

animals = [
  A("🐶", "dog", "cachorro", "DÓG", "Woof woof!"),
  A("🐱", "cat", "gato", "KÉT", "Meow!"),
  A("🐮", "cow", "vaca", "KÁU", "Moo!"),
  A("🐷", "pig", "porco", "PÍG", "Oink oink!"),
  A("🐑", "sheep", "ovelha", "XIIP", "Baa!"),
  A("🐴", "horse", "cavalo", "RÓRS", "Neigh!"),
  A("🐔", "chicken", "galinha", "TXÍ-kin", "Cluck cluck!"),
  A("🦆", "duck", "pato", "DÂK", "Quack quack!"),
  A("🐸", "frog", "sapo", "FRÓG", "Ribbit!"),
  A("🐦", "bird", "passarinho", "BÂRD", "Tweet tweet!"),
  A("🦉", "owl", "coruja", "ÁUL", "Hoot hoot!"),
  A("🐝", "bee", "abelha", "BII", "Buzz!"),
  A("🐍", "snake", "cobra", "SNÊIK", "Hiss!"),
  A("🐭", "mouse", "ratinho", "MÁUS", "Squeak!"),
  A("🐵", "monkey", "macaco", "MÂN-ki", "Ooh ooh ah ah!"),
  A("🦁", "lion", "leão", "LÁI-on", "Roar!"),
  A("🐯", "tiger", "tigre", "TÁI-guer", "Grrr!"),
  A("🐘", "elephant", "elefante", "É-le-fant", "Toot toot!"),
  A("🐻", "bear", "urso", "BÉR", "Grrr!"),
  A("🐺", "wolf", "lobo", "UÓLF", "Awoooo!"),
  A("🫏", "donkey", "burro", "DÔN-ki", "Hee-haw!"),
  A("🐐", "goat", "cabra", "GÔUT", "Maa!"),
  A("🐟", "fish", "peixe", "FÍX", "Blub blub!"),
  A("🐓", "rooster", "galo", "RUUS-ter", "Cock-a-doodle-doo!"),
]
colors = [
  ("#E53935", "red", "vermelho", "RÉD"), ("#1E63D6", "blue", "azul", "BLUU"), ("#FDD835", "yellow", "amarelo", "IÉ-lou"),
  ("#2E9E4F", "green", "verde", "GRIIN"), ("#FB8C00", "orange", "laranja", "Ó-rindj"), ("#8E44AD", "purple", "roxo", "PÂR-pol"),
  ("#F06292", "pink", "rosa", "PÍNK"), ("#795548", "brown", "marrom", "BRÁUN"), ("#212121", "black", "preto", "BLÉK"),
  ("#FFFFFF", "white", "branco", "UÁIT"), ("#9E9E9E", "gray", "cinza", "GRÊI"),
]
color_items = [{"hex": h, "en": en, "pt": pt, "pron": pr, "say": f"It's {en}!"} for h, en, pt, pr in colors]
nums = [("zero","zero","ZI-rou"),("one","um","UÂN"),("two","dois","TUU"),("three","três","THRII"),("four","quatro","FÓR"),("five","cinco","FÁIV"),
        ("six","seis","SÍKS"),("seven","sete","SÉ-ven"),("eight","oito","ÊIT"),("nine","nove","NÁIN"),("ten","dez","TÉN"),
        ("eleven","onze","i-LÉ-ven"),("twelve","doze","TUÉLV"),("thirteen","treze","thâr-TIIN"),("fourteen","catorze","for-TIIN"),
        ("fifteen","quinze","fif-TIIN"),("sixteen","dezesseis","siks-TIIN"),("seventeen","dezessete","se-ven-TIIN"),
        ("eighteen","dezoito","ei-TIIN"),("nineteen","dezenove","nain-TIIN"),("twenty","vinte","TUÉN-ti")]
num_items = [{"n": i, "en": en, "pt": pt, "pron": pr, "say": en} for i, (en, pt, pr) in enumerate(nums)]

kitchen = [O("🧊","fridge","geladeira","FRÍDJ"), O("🔥","stove","fogão","STÔUV"), O("🚰","sink","pia","SÍNK"), O("🍽️","plate","prato","PLÊIT"),
           O("☕","cup","xícara","KÂP"), O("🥄","spoon","colher","SPUUN"), O("🍴","fork","garfo","FÓRK"), O("🔪","knife","faca","NÁIF"),
           O("🍳","pan","frigideira","PÉN"), O("🥛","glass","copo","GLÉS")]
bedroom = [O("🛏️","bed","cama","BÉD"), O("🧸","teddy bear","ursinho de pelúcia","TÉ-di BÉR"), O("🪟","window","janela","UÍN-dou"), O("💡","lamp","abajur","LÉMP"),
           O("⏰","alarm clock","despertador","a-LÁRM KLÓK"), O("👕","T-shirt","camiseta","TII-xârt"), O("🧦","socks","meias","SÓKS"), O("👟","shoes","sapatos","XUUZ"),
           O("📚","books","livros","BÚKS")]
bathroom = [O("🚽","toilet","vaso sanitário","TÓI-let"), O("🚿","shower","chuveiro","XÁU-er"), O("🛁","bathtub","banheira","BÉTH-tâb"), O("🪥","toothbrush","escova de dentes","TUUTH-brâx"),
            O("🧼","soap","sabonete","SÔUP"), O("🪞","mirror","espelho","MÍ-ror"), O("🧻","toilet paper","papel higiênico","TÓI-let PÊI-per"), O("🧴","shampoo","xampu","xem-PUU")]
living = [O("🛋️","sofa","sofá","SÔU-fa"), O("📺","TV","televisão","TII-VII"), O("🪑","chair","cadeira","TXÉR"), O("🚪","door","porta","DÓR"),
          O("🖼️","picture","quadro","PÍK-tcher"), O("🪴","plant","planta","PLÉNT"), O("📱","phone","celular","FÔUN"), O("🕰️","clock","relógio","KLÓK"),
          O("🎮","video game","videogame","VÍ-di-ou GUÊIM")]
PLURAL = {"socks", "shoes", "books"}
UNCOUNT = {"soap", "shampoo", "toilet paper"}
def room(items, where):
    for it in items:
        w = it["en"]
        if w in PLURAL: it["say"] = f"{w.capitalize()}. They're in the {where}."
        elif w in UNCOUNT: it["say"] = f"{w.capitalize()}. It's in the {where}."
        else:
            art = "An" if w[0] in "aeiou" else "A"
            it["say"] = f"{art} {w}. It's in the {where}."
    return items

cats = [
  {"id": "animais", "name": "Animais", "nameEn": "Animals", "emoji": "🦁", "color": "#FFB74D", "kind": "animal", "items": animals},
  {"id": "cores", "name": "Cores", "nameEn": "Colors", "emoji": "🎨", "color": "#BA68C8", "kind": "color", "items": color_items},
  {"id": "numeros", "name": "Números", "nameEn": "Numbers", "emoji": "🔢", "color": "#4FC3F7", "kind": "number", "items": num_items},
  {"id": "cozinha", "name": "Cozinha", "nameEn": "Kitchen", "emoji": "🍳", "color": "#FF8A65", "kind": "object", "room": True, "items": room(kitchen, "kitchen")},
  {"id": "quarto", "name": "Quarto", "nameEn": "Bedroom", "emoji": "🛏️", "color": "#9575CD", "kind": "object", "room": True, "items": room(bedroom, "bedroom")},
  {"id": "banheiro", "name": "Banheiro", "nameEn": "Bathroom", "emoji": "🛁", "color": "#4DD0E1", "kind": "object", "room": True, "items": room(bathroom, "bathroom")},
  {"id": "sala", "name": "Sala", "nameEn": "Living room", "emoji": "🛋️", "color": "#81C784", "kind": "object", "room": True, "items": room(living, "living room")},
]
for c in cats:
    for i, it in enumerate(c["items"]):
        it["id"] = f"{c['id']}.{i}"
        assert it["en"] and it["pt"] and it["pron"], it
out = os.path.join(os.path.dirname(__file__), "..", "data", "kids.json")
json.dump({"categories": cats}, open(out, "w"), ensure_ascii=False, indent=1)
print({c["id"]: len(c["items"]) for c in cats}, sum(len(c["items"]) for c in cats))
for c in cats[3:5]:
    print([it["say"] for it in c["items"]][:4])
