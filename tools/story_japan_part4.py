# Aventura no Japão — parte 4 (capítulos 13 a 16)
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from story_dsl import *

CH = []

# ---------------------------------------------------------------- 13
CH.append(chapter("c13", "🏯", "Castelo de Osaka e achados e perdidos", "Osaka Castle and lost and found",
  {"sky": "day", "items": [["🏯", "bob"], ["🌸", "float"], ["👛", "pulse"]]},
  {
  "start": [
    N("Konnichiwa, {name}! Hoje o passeio é no Castelo de Osaka: muralhas de pedra gigantes, fosso com água em volta e uma torre branca com detalhes dourados. Parece cenário de filme de samurai! 🏯"),
    T("Funcionária", "Hello! Two adult tickets?", "Olá! Dois ingressos de adulto?"),
    Y("Yes, two adults, please.", "Sim, dois adultos, por favor."),
    T("Funcionária", "The museum is inside the tower. The view from the top floor is beautiful.", "O museu fica dentro da torre. A vista do último andar é linda."),
    N("Vocês sobem andar por andar e, lá no alto, a cidade inteira aparece. {spousePtCap} tira umas cem fotos. 📸"),
    N("Na volta, vocês pegam o trem para o hotel. Descem na estação, andam um pouquinho… e você bate no bolso. Cadê a carteira?! 😱", "oops"),
    N("Calma, respira. Você lembra: deixou a carteira no banco do trem. Estamos no Japão, e aqui a história costuma ter final feliz."),
    C("O que você faz?", [
        O("Ir até o balcão da estação e pedir ajuda", "good", "Isso! Os funcionários da estação são os melhores aliados.", go="station", lang="pt"),
        O("Correr atrás do trem pela plataforma", "bad", "Hahaha, o trem japonês não espera ninguém! Veja…", go="run", lang="pt"),
    ]),
  ],
  "run": [
    N("Você corre pela plataforma… mas o trem já foi embora, pontualíssimo como sempre. Um funcionário de uniforme se aproxima, preocupado. 🚆💨", "oops"),
    T("Funcionário", "Excuse me, is everything OK?", "Com licença, está tudo bem?"),
    Y("I'm sorry. I left my wallet on the train.", "Desculpe. Eu deixei minha carteira no trem."),
    T("Funcionário", "Don't worry. Please come to the station office with me.", "Não se preocupe. Por favor, venha comigo ao escritório da estação."),
    GO("station"),
  ],
  "station": [
    EX("Lost and found", "\"Lost and found\" é o setor de achados e perdidos. Para contar o que aconteceu, use \"I left… on the train\" (eu deixei… no trem) ou \"I lost my…\" (eu perdi meu…).",
       [("I left my wallet on the train.", "Eu deixei minha carteira no trem."), ("Where is the lost and found?", "Onde fica o achados e perdidos?")]),
    T("Funcionário", "Which train were you on? And what time?", "Em qual trem você estava? E a que horas?"),
    G("Você", "you", "We got off here about ten minutes ___.", "ago", ["ago", "before", "later", "after"], "Nós descemos aqui uns dez minutos atrás."),
    T("Funcionário", "Can you describe your wallet?", "Você pode descrever a sua carteira?"),
    B("É uma carteira pequena de couro marrom.", "It is a small brown leather wallet.", ["big", "bag"]),
    EX("Descrever objetos", "Em inglês, a ordem é: tamanho, cor, material e depois o objeto. \"A small black phone case\", \"a big blue backpack\".",
       [("It's a black phone with a green case.", "É um celular preto com capinha verde."), ("There is a Brazil sticker on it.", "Tem um adesivo do Brasil nele.")]),
    N("O funcionário faz uma ligação e fala rapidinho em japonês. Minutos depois, ele sorri."),
    T("Funcionário", "Good news! A passenger found it. It's at the last station.", "Boa notícia! Um passageiro encontrou. Está na última estação."),
    TIP("🇯🇵", "A cultura da honestidade", "No Japão, quem encontra algo perdido costuma entregar no balcão da estação ou no posto policial (koban). Carteiras voltam com o dinheiro dentro! Por isso, sempre vale a pena perguntar.",
        dos=["Procurar logo um funcionário da estação", "Anotar a linha, o horário e o vagão", "Levar o passaporte para retirar o objeto"],
        donts=["Achar que perdeu para sempre", "Abandonar o objeto dos outros: entregue ao balcão"]),
    C("Como você agradece?", [
        O("Thank you so much! You saved our day!", "good", "Lindo! E um \"Arigatou gozaimasu\" com uma pequena reverência deixa tudo perfeito.", go="happy", pt="Muito obrigado! Você salvou o nosso dia!"),
        O("Can you bring it to my hotel?", "ok", "Hmm, ele ajudou muito, mas é você quem vai buscar. Veja:", go="pickup", pt="Você pode levar até o meu hotel?"),
    ]),
  ],
  "pickup": [
    T("Funcionário", "Sorry, you need to go there. Please bring your passport.", "Desculpe, você precisa ir até lá. Por favor, leve seu passaporte."),
    Y("Of course. Thank you very much for your help.", "Claro. Muito obrigado pela sua ajuda."),
    GO("happy"),
  ],
  "happy": [
    N("Vocês vão até a última estação, mostram o passaporte e… lá está a carteira, com tudo dentro, até as moedinhas. 👛✨"),
    END("honestidade", "Final: carteira de volta", "Susto resolvido e uma lição sobre o Japão: aqui, a honestidade é regra. \"Arigatou gozaimasu\", passageiro desconhecido! 🙏"),
  ],
  }, "Castelo de Osaka, a carteira esquecida no trem e o achados e perdidos."))

# ---------------------------------------------------------------- 14
CH.append(chapter("c14", "⛴️", "Hiroshima e Miyajima", "Hiroshima and Miyajima",
  {"sky": "sea", "items": [["⛩️", "float"], ["⛴️", "swim"], ["🕊️", "fly"]]},
  {
  "start": [
    N("Hoje vocês chegam a Hiroshima. Antes de tudo, uma visita que pede silêncio e respeito: o Parque Memorial da Paz. Aqui eu falo baixinho também. 🕊️"),
    TIP("🕊️", "Parque Memorial da Paz", "O parque lembra as vítimas da bomba atômica de 1945 e é um lugar dedicado à paz. As pessoas visitam em silêncio, deixam tsurus de papel (garças de origami) e fazem uma oração ou um minuto de reflexão.",
        dos=["Falar baixo e caminhar com calma", "Tirar fotos com respeito", "Ler as placas e ouvir com atenção"],
        donts=["Fazer poses engraçadas nas fotos", "Rir alto ou brincar perto dos memoriais"]),
    T("Guia voluntária", "Welcome. This park is a place to remember and to pray for peace.", "Bem-vindos. Este parque é um lugar para lembrar e rezar pela paz."),
    Y("Thank you for sharing this with us.", "Obrigado por compartilhar isso com a gente."),
    N("Vocês ficam um momento em silêncio diante da chama da paz. {spousePtCap} segura a sua mão. Hiroshima hoje é uma cidade viva, verde e cheia de esperança."),
    N("Depois, com o coração mais leve, vocês seguem para o porto. Próximo destino: a ilha de Miyajima, de balsa! ⛴️"),
    T("Funcionário do porto", "The ferry leaves every fifteen minutes. The trip is about ten minutes.", "A balsa sai a cada quinze minutos. A viagem leva uns dez minutos."),
    G("Você", "you", "What time does the next ferry ___?", "leave", ["leave", "leaves", "live", "leaving"], "A que horas sai a próxima balsa?"),
    N("Da balsa, vocês já veem: o grande portal vermelho (torii) que parece flutuar no mar. ⛩️🌊"),
    EX("Tide: a maré", "O torii de Miyajima parece flutuar na maré alta (high tide). Na maré baixa (low tide), dá para caminhar até ele pela areia! Pergunte o horário da maré no porto ou no hotel.",
       [("When is high tide today?", "Quando é a maré alta hoje?"), ("Can we walk to the gate at low tide?", "Podemos caminhar até o portal na maré baixa?")]),
    N("Na ilha, cervos passeiam tranquilos entre as lojinhas. Vocês querem ver o torii de pertinho."),
    C("O que vocês fazem?", [
        O("When is low tide today?", "good", "Ótima pergunta! Assim vocês planejam a caminhada até o portal.", go="tide", pt="Quando é a maré baixa hoje?"),
        O("Tirar os sapatos e entrar no mar agora mesmo", "bad", "Opa! A maré está alta e a água bate na cintura. Veja…", go="wet", lang="pt"),
    ]),
  ],
  "wet": [
    N("Você dá dois passos e a água já está no joelho. Um senhor japonês acena da areia, rindo gentilmente. 😅🌊", "oops"),
    T("Senhor", "The tide is high now. Come back in the afternoon!", "A maré está alta agora. Volte à tarde!"),
    Y("Oh, thank you! What time is low tide?", "Ah, obrigado! Que horas é a maré baixa?"),
    T("Senhor", "Around four o'clock.", "Por volta das quatro horas."),
    GO("tide"),
  ],
  "tide": [
    T("Atendente", "Low tide is around four. You can walk to the gate then.", "A maré baixa é por volta das quatro. Aí vocês podem caminhar até o portal."),
    N("Enquanto esperam, a fome bate. Hora de provar o famoso okonomiyaki estilo Hiroshima, feito em camadas com macarrão no meio! 🥞"),
    T("Cozinheiro", "Hiroshima style has noodles inside. Would you like an egg on top?", "O estilo Hiroshima tem macarrão dentro. Querem um ovo por cima?"),
    C("Vocês estão com muita fome. Como pedem?", [
        O("Yes, please! Can we share one? They look big.", "good", "Esperto! O okonomiyaki de Hiroshima é bem servido, e dividir é normal.", pt="Sim, por favor! Podemos dividir um? Parecem grandes."),
        O("Apontar para a foto do cardápio e sorrir", "ok", "Funciona! Apontar é super comum no Japão. Mas vamos treinar a frase também:", lang="pt"),
    ]),
    B("Nós queremos um com ovo, por favor.", "We would like one with egg, please.", ["want", "eggs"]),
    N("Antes de comer, vocês dizem \"Itadakimasu\", o \"bom apetite\" japonês. O cozinheiro sorri. 😊"),
    END("miyajima", "Final: paz e maré baixa", "Um dia de reflexão em Hiroshima e de encanto em Miyajima. Vocês caminharam até o torii na maré baixa e voltaram com o coração cheio. 🕊️⛩️"),
  ],
  }, "Visita respeitosa ao Parque da Paz, balsa, maré e okonomiyaki de Hiroshima."))

# ---------------------------------------------------------------- 15
CH.append(chapter("c15", "🌀", "Tufão, farmácia e imprevistos", "Typhoon, drugstore and surprises",
  {"sky": "night", "items": [["🌀", "spin"], ["☔", "sway"], ["💊", "pulse"]]},
  {
  "start": [
    N("{name}, viagem longa também tem imprevistos! Hoje de manhã, o celular apita: alerta de tufão chegando à região. 🌀 Nada de pânico: o Japão está muito preparado para isso."),
    T("Recepcionista", "A typhoon is coming tonight. Many trains may be canceled tomorrow.", "Um tufão está chegando hoje à noite. Muitos trens podem ser cancelados amanhã."),
    EX("Canceled e delayed", "\"Canceled\" é cancelado; \"delayed\" é atrasado; \"suspended\" é suspenso (parado por um tempo). São palavras que aparecem nos painéis das estações.",
       [("Is my train canceled?", "O meu trem foi cancelado?"), ("The train is delayed.", "O trem está atrasado.")]),
    N("E, para completar, {spousePt} acorda espirrando e com a garganta arranhando. 🤧 Que tal resolver uma coisa de cada vez?"),
    C("O que vocês fazem primeiro?", [
        O("Ir à farmácia comprar remédio para resfriado", "good", "Boa! Primeiro a saúde. As drogarias japonesas são enormes.", go="pharmacy", lang="pt"),
        O("Ir direto à estação ver os trens", "ok", "Também faz sentido. Mas não esqueça do resfriado!", go="station", lang="pt"),
    ]),
  ],
  "pharmacy": [
    N("Na drogaria, os remédios têm caixas cheias de letrinhas em japonês. Melhor pedir ajuda ao farmacêutico. \"Sumimasen!\" 💊"),
    T("Farmacêutico", "Hello. How can I help you?", "Olá. Como posso ajudar?"),
    G("Você", "you", "My {spouse} has a ___ and a sore throat.", "cold", ["cold", "coat", "cool", "code"], "{spousePtCap} está com resfriado e dor de garganta."),
    EX("Sintomas básicos", "Use \"I have…\" ou \"{She} has…\" para sintomas: \"a cold\" (resfriado), \"a fever\" (febre), \"a headache\" (dor de cabeça), \"a sore throat\" (dor de garganta).",
       [("{She} has a fever.", "{ElaPt} está com febre."), ("I have a headache.", "Estou com dor de cabeça.")]),
    T("Farmacêutico", "This medicine is for colds. Take it after meals, three times a day.", "Este remédio é para resfriado. Tome depois das refeições, três vezes ao dia."),
    Y("Thank you. Is it OK with other medicine?", "Obrigado. Pode tomar com outros remédios?"),
    T("Farmacêutico", "Yes. If the fever is high, please see a doctor.", "Sim. Se a febre ficar alta, por favor procure um médico."),
    GO("station"),
  ],
  "station": [
    N("Na estação, o painel está cheio de avisos em vermelho: vários trens cancelados. ☔"),
    B("O nosso trem para Tóquio foi cancelado?", "Is our train to Tokyo canceled?", ["for", "late"]),
    T("Funcionária", "Yes, it is canceled. You can get a refund or change to another day.", "Sim, está cancelado. Vocês podem pedir reembolso ou trocar para outro dia."),
    C("O que você responde?", [
        O("Can we change to the first train tomorrow?", "good", "Perfeito! Pedir uma alternativa é o mais prático.", pt="Podemos trocar para o primeiro trem de amanhã?"),
        O("This is terrible! I want to go now!", "bad", "Calma! Ninguém controla o tufão. Veja:", go="angry", pt="Isso é horrível! Eu quero ir agora!"),
    ]),
    GO("quake"),
  ],
  "angry": [
    T("Funcionária", "I'm very sorry. It's not safe to travel today.", "Sinto muito. Não é seguro viajar hoje."),
    N("A funcionária faz uma reverência de desculpas, mesmo sem culpa nenhuma. Você percebe que exagerou. 😅", "oops"),
    Y("I understand. Sorry. Can we change to tomorrow, please?", "Eu entendo. Desculpe. Podemos trocar para amanhã, por favor?"),
    GO("quake"),
  ],
  "quake": [
    T("Funcionária", "Of course. Here are your new tickets for tomorrow morning.", "Claro. Aqui estão as novas passagens para amanhã de manhã."),
    N("De noite, no hotel, o celular toca um som diferente e o quarto balança um pouquinho. Um pequeno terremoto! Em segundos, tudo para. 📳", "oops"),
    TIP("📳", "Alerta de terremoto", "Pequenos tremores são comuns no Japão, e os prédios são feitos para aguentar. Se o alerta tocar, mantenha a calma, proteja a cabeça, fique longe de janelas e siga as orientações dos funcionários.",
        dos=["Ficar calmo e proteger a cabeça", "Seguir as instruções do hotel ou da estação", "Saber onde ficam as saídas de emergência"],
        donts=["Correr para a rua durante o tremor", "Usar o elevador logo depois do tremor"]),
    T("Recepcionista (telefone)", "Everything is OK. There is no danger. Please stay in your room.", "Está tudo bem. Não há perigo. Por favor, fiquem no quarto."),
    END("imprevistos", "Final: imprevistos resolvidos", "Tufão, resfriado e até um tremorzinho: você resolveu tudo em inglês, com calma. Isso sim é viajante de verdade! 🌀💪"),
  ],
  }, "Alerta de tufão, trem cancelado, farmácia e o que fazer num terremoto."))

# ---------------------------------------------------------------- 16
CH.append(chapter("c16", "🛫", "Lembrancinhas e volta para casa", "Souvenirs and going home",
  {"sky": "dusk", "items": [["🎁", "bob"], ["✈️", "fly"], ["🧳", "walk"]]},
  {
  "start": [
    N("Último dia no Japão, {name}! 😢 Mas antes de voar, uma tradição japonesa deliciosa: o omiyage, as lembrancinhas para dividir com a família e os amigos. 🎁"),
    TIP("🎁", "Omiyage", "No Japão, quem viaja traz caixas de doces embrulhados um a um para dividir no trabalho e com a família. As lojas das estações e dos aeroportos são cheias delas, com embalagens lindas.",
        dos=["Contar quantas pessoas vão ganhar antes de comprar", "Olhar a data de validade dos doces", "Pedir sacolinhas extras para presentear"],
        donts=["Deixar tudo para o último minuto", "Esquecer do peso da mala!"]),
    T("Vendedora", "These cookies are very popular. There are twelve in a box.", "Estes biscoitos são muito populares. São doze em uma caixa."),
    G("Você", "you", "Can you ___ it as a gift, please?", "wrap", ["wrap", "rap", "wraps", "wrapping"], "Você pode embrulhar para presente, por favor?"),
    T("Vendedora", "Of course. Would you like extra bags for your friends?", "Claro. Gostaria de sacolinhas extras para os seus amigos?"),
    Y("Yes, three extra bags, please. Thank you!", "Sim, três sacolinhas extras, por favor. Obrigado!"),
    N("Chegando ao aeroporto, vocês vão ao balcão de check-in. As malas estão… hmm… bem mais gordinhas do que na ida. 🧳😅"),
    T("Atendente", "Your bag is four kilos overweight.", "A sua mala está quatro quilos acima do peso."),
    EX("Overweight", "\"Overweight\" é acima do peso; \"carry-on\" é a bagagem de mão; \"checked bag\" é a mala despachada. Pergunte sempre o limite antes de pagar.",
       [("What is the weight limit?", "Qual é o limite de peso?"), ("Can I move some things to my carry-on?", "Posso passar algumas coisas para a bagagem de mão?")]),
    C("O que você faz?", [
        O("Can I move some things to my carry-on?", "good", "Esperto! Vocês reorganizam as malas ali mesmo e resolvem.", go="repack", pt="Posso passar algumas coisas para a bagagem de mão?"),
        O("Sentar em cima da mala para ela pesar menos", "bad", "Hahaha! Kiko precisa te contar uma coisa sobre a física… 😂", go="sit", lang="pt"),
    ]),
  ],
  "sit": [
    N("Você senta na mala, fecha o zíper com força e coloca de volta na balança. O número… é exatamente o mesmo. 😂", "oops"),
    T("Atendente", "It's still overweight. You can pay a fee or move some items.", "Continua acima do peso. Você pode pagar uma taxa ou tirar alguns itens."),
    Y("OK, I'll move some things to my carry-on.", "OK, vou passar algumas coisas para a bagagem de mão."),
    GO("repack"),
  ],
  "repack": [
    N("Os biscoitos de omiyage vão para a mochila, e a mala passa no limite. Ufa! ✅"),
    T("Atendente", "Perfect. Here is your boarding pass. Boarding starts at gate 23.", "Perfeito. Aqui está o seu cartão de embarque. O embarque começa no portão 23."),
    B("Onde podemos comprar um último lanche?", "Where can we buy one last snack?", ["eat", "lunch"]),
    N("Claro que o último lanche foi no konbini do aeroporto: um onigiri e um chá gelado, como no primeiro dia. Fechando o ciclo! 🍙"),
    C("{spousePtCap} pergunta qual foi a sua parte preferida da viagem. O que você diz?", [
        O("Everything! But the people were the best part.", "good", "Que lindo! A gentileza dos japoneses marca qualquer viagem.", go="goodbye", pt="Tudo! Mas as pessoas foram a melhor parte."),
        O("The food, of course! I want ramen again!", "good", "Hahaha, justo! Ninguém esquece o lámen japonês. 🍜", go="goodbye", pt="A comida, claro! Quero lámen de novo!"),
    ]),
  ],
  "goodbye": [
    N("No portão, você olha pela janela o avião que vai levar vocês para casa. Em japonês, \"Arigatou gozaimashita\" é o obrigado por tudo que já passou. Obrigado, Japão! 🇯🇵"),
    END("sayonara", "Final: Aventura no Japão completa! 🇯🇵✈️🇧🇷",
        "Parabéns, {name}! Você completou a Aventura no Japão! 🎉 Foram vinte dias de trem-bala, templos, onsen, lámen e muito inglês. Você mostrou que dá para viajar sem travar. Agora, que tal jogar os capítulos de novo e descobrir outros caminhos e finais? O Professor Kiko espera você na próxima aventura! 🎓🦜🇯🇵✈️🇧🇷"),
  ],
  }, "Omiyage, embrulho para presente, mala acima do peso e o adeus ao Japão."))

ISLANDS = {'c13': ['🏯', '👛'], 'c14': ['⛩️', '🕊️'], 'c15': ['🌀', '💊'], 'c16': ['🛫', '🎁']}
for c in CH: c["island"] = ISLANDS[c["id"]]
