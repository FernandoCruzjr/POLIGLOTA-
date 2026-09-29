# Aventura no Japão — parte 1 (capítulos c1 a c4)
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from story_dsl import *

CH = []

# ---------------------------------------------------------------- 1
CH.append(chapter("c1", "🛬", "Chegada em Tóquio", "Arrival in Tokyo",
  {"sky": "day", "items": [["✈️", "fly"], ["🗻", "float"], ["🚆", "drive"]]},
  {
  "start": [
    N("\"Konnichiwa\", {name}! 🎌 Boas-vindas ao Japão! Eu sou o Professor Kiko 🎓🦜, o seu guia e professor de inglês de bolso nesta aventura. Vocês acabaram de pousar em Tóquio depois de um voo looongo. Respira fundo: vai ser inesquecível!"),
    N("O plano é de uns 20 dias: começamos em Tóquio, subimos a serra até Hakone para ver o Monte Fuji, pegamos o trem-bala (shinkansen) para Kyoto, visitamos os cervos de Nara, comemos até rolar em Osaka, fazemos uma visita especial a Hiroshima e voltamos para Tóquio para as lembrancinhas. Ufa! 🗾"),
    EX("Inglês no Japão", "\"Konnichiwa\" quer dizer \"olá\" em japonês. Mas fica tranquilo: em aeroportos, estações e hotéis, os funcionários falam um inglês simples. Você fala inglês, e eu te ensino umas palavrinhas japonesas de gentileza pelo caminho. A primeira: \"Arigatou gozaimasu\", que é \"muito obrigado\".",
       [("Hello! Do you speak English?", "Olá! Você fala inglês?"), ("Thank you very much.", "Muito obrigado.")]),
    TIP("🛂", "A imigração japonesa", "No Japão, os visitantes estrangeiros deixam as impressões digitais dos dois indicadores numa maquininha e tiram uma foto no balcão. É rápido e todo mundo faz. Antes da viagem, dá para preencher o formulário online de chegada, que gera um QR code para a imigração e a alfândega.",
        dos=["Ter o passaporte e o endereço do hotel à mão", "Tirar o boné e os óculos para a foto", "Deixar o QR code aberto no celular"],
        donts=["Falar ao celular no balcão", "Deixar o formulário para a última hora"]),
    T("Oficial", "Hello. Passport, please. What is the purpose of your visit?", "Olá. Passaporte, por favor. Qual é o motivo da sua visita?"),
    C("Como você responde?", [
        O("Sightseeing. We are here on vacation.", "good", "Perfeito! Curto e claro. \"Sightseeing\" é passear e conhecer os lugares.", pt="Turismo. Estamos aqui de férias."),
        O("Sushi! A lot of sushi!", "ok", "Hahaha, o oficial quase sorriu! Mas a resposta esperada é \"Sightseeing\" ou \"Vacation\".", pt="Sushi! Muito sushi!"),
    ]),
    T("Oficial", "Please put your index fingers here.", "Por favor, coloque os dedos indicadores aqui."),
    G("Oficial", "them", "Now please look at the ___.", "camera", ["camera", "window", "floor", "ticket"], "Agora, por favor, olhe para a câmera."),
    T("Oficial", "Thank you. Welcome to Japan.", "Obrigado. Bem-vindos ao Japão."),
    N("Malas na mão, agora é a alfândega. Tem umas máquinas onde você escaneia o QR code do formulário online de chegada."),
    C("Você preencheu o formulário antes da viagem?", [
        O("Sim! Mostrar o QR code no celular", "good", "Organizado! Isso economiza um tempão.", go="qr", lang="pt"),
        O("Hmm… que QR code?", "ok", "Ops! Sem problema, tem outro jeito. Veja:", go="paper", lang="pt"),
    ]),
  ],
  "qr": [
    T("Fiscal", "Enjoy your stay in Japan!", "Aproveitem a estadia no Japão!"),
    GO("card"),
  ],
  "paper": [
    N("Vocês vão para a fila do balcão, a de quem não tem o QR code. {spousePtCap} te olha com aquela cara de \"eu te avisei\". 😅", "oops"),
    T("Fiscal", "No problem. Please fill out this form.", "Sem problema. Por favor, preencha este formulário."),
    Y("Sorry, can I borrow a pen, please?", "Desculpe, posso pegar uma caneta emprestada, por favor?"),
    GO("card"),
  ],
  "card": [
    N("Chegamos ao saguão! Antes de ir para a cidade, vamos comprar um cartão de transporte recarregável: você encosta no leitor da catraca e pronto, serve para trem, metrô e ônibus em muitas cidades."),
    B("Eu gostaria de comprar um cartão de transporte, por favor.", "I would like to buy a transit card, please.", ["sell", "bus"]),
    T("Atendente", "Sure. How much money would you like to put on it?", "Claro. Quanto dinheiro você quer colocar nele?"),
    EX("Put money on / top up", "Para carregar o cartão, diga \"put money on the card\" ou \"top up the card\". Depois dá para recarregar nas máquinas das estações.",
       [("Can I top up the card here?", "Posso recarregar o cartão aqui?"), ("I want to put money on my card.", "Quero colocar dinheiro no meu cartão.")]),
    T("Atendente", "Here you go. Just tap the card at the gate.", "Aqui está. É só encostar o cartão na catraca."),
    C("Agora, qual trem vai para a cidade?", [
        O("Excuse me, which train goes to Tokyo Station?", "good", "Isso! Perguntar é sempre o caminho mais curto.", go="train", pt="Com licença, qual trem vai para a Estação de Tóquio?"),
        O("Entrar no primeiro trem que aparecer", "bad", "Coragem não falta… mas direção, talvez. 🙈", go="wrong", lang="pt"),
    ]),
  ],
  "train": [
    T("Funcionário", "Take the train on platform two. It leaves in ten minutes.", "Pegue o trem na plataforma dois. Ele sai em dez minutos."),
    N("Você agradece com um \"Arigatou gozaimasu\" e uma leve inclinação da cabeça. O funcionário sorri e se inclina de volta. Primeira palavra japonesa: aprovada! 🙇"),
    END("chegou", "Final: rumo a Tóquio", "Imigração, alfândega, cartão e trem certinho! Pela janela, os prédios de Tóquio começam a aparecer. A aventura começou! 🗼"),
  ],
  "wrong": [
    N("Depois de uns minutos, as estações têm nomes estranhos e cada vez mais campo pela janela. Hmm… Tóquio não era para o outro lado? 🌾", "oops"),
    T("Passageira", "Oh, this train goes the other way. Get off at the next station and change.", "Ah, este trem vai para o outro lado. Desça na próxima estação e troque."),
    Y("Thank you so much! Which platform?", "Muito obrigado! Qual plataforma?"),
    END("volta", "Final: o passeio extra", "Um passeio extra pelo interior, mas vocês chegaram! Lição do dia: antes de embarcar, pergunte \"Which train goes to…?\". 😂🚆"),
  ],
  }, "Boas-vindas do Kiko, imigração com digitais, QR code da alfândega, cartão de transporte e o primeiro trem."))

# ---------------------------------------------------------------- 2
CH.append(chapter("c2", "🏪", "Konbini e lámen", "Convenience store and ramen",
  {"sky": "day", "items": [["🏪", "pulse"], ["🍙", "bob"], ["🍜", "float"]]},
  {
  "start": [
    N("Bom dia, {name}! Com o fuso horário bagunçado, vocês acordaram cedíssimo e com fome. Solução japonesa: o konbini, a loja de conveniência que fica aberta 24 horas e tem de tudo, até comida muito boa! 🏪"),
    N("Quando você entra, o funcionário grita \"Irasshaimase!\". É \"bem-vindo\" em japonês. Não precisa responder nada: um sorriso ou um aceno já basta."),
    EX("Onigiri", "O onigiri é um bolinho de arroz com recheio, embrulhado em alga. Vem num plástico com números 1, 2, 3 para abrir sem rasgar a alga. Para perguntar o recheio, use \"What's inside?\".",
       [("What's inside this one?", "O que tem dentro deste?"), ("Is this spicy?", "Isso é apimentado?")]),
    N("Você pega dois onigiris, e {spousePt} escolhe uma marmita de frango com arroz. No caixa:"),
    T("Caixa", "Would you like it heated?", "Quer que esquente?"),
    C("Ela está falando da marmita. O que você diz?", [
        O("Yes, please.", "good", "Isso! Eles esquentam no micro-ondas ali mesmo, na hora.", pt="Sim, por favor."),
        O("No, thank you.", "good", "Tudo bem também! Vocês podem comer depois.", pt="Não, obrigado."),
        O("Heat the onigiri too, please!", "ok", "Hahaha, dá até para pedir, mas onigiri normalmente se come frio mesmo! 🍙", pt="Esquente o onigiri também, por favor!"),
    ]),
    G("Caixa", "them", "Do you need ___?", "chopsticks", ["chopsticks", "keys", "tickets", "stamps"], "Você precisa de hashis?"),
    T("Caixa", "Do you need a bag?", "Você precisa de sacola?"),
    Y("No, thank you. I have a bag.", "Não, obrigado. Eu tenho uma sacola."),
    TIP("🗑️", "Cadê as lixeiras?", "No Japão quase não há lixeiras na rua, mas as ruas são limpíssimas! O costume é levar o lixo com você até o hotel ou jogar nas lixeiras que ficam perto dos konbinis. Comer andando na rua também não é muito comum.",
        dos=["Levar uma sacolinha para o seu lixo", "Separar garrafas, latas e restos"],
        donts=["Deixar lixo em bancos ou muretas", "Comer andando no meio da calçada"]),
    N("À noite, vocês encontram um restaurante de lámen minúsculo, com fila na porta. Bom sinal! Na entrada tem uma máquina cheia de botões e fotos."),
    C("O que você faz?", [
        O("Excuse me, how does this machine work?", "good", "Ótima pergunta! Veja:", go="machine", pt="Com licença, como funciona esta máquina?"),
        O("Entrar, sentar e esperar o garçom", "ok", "Hmm… o garçom não vem. Veja por quê:", go="wait", lang="pt"),
    ]),
  ],
  "machine": [
    T("Cliente", "Put in the money, press a button and give the ticket to the chef.", "Coloque o dinheiro, aperte um botão e entregue o tíquete ao cozinheiro."),
    GO("ramen"),
  ],
  "wait": [
    N("Vocês ficam sentados uns bons minutos… e ninguém aparece. O cozinheiro aponta para a máquina na porta. Ahh, é ali que se pede! 😅", "oops"),
    T("Cozinheiro", "Ticket, please. From the machine.", "Tíquete, por favor. Da máquina."),
    GO("ramen"),
  ],
  "ramen": [
    B("Qual botão é o lámen de porco?", "Which button is the pork ramen?", ["bottom", "chicken"]),
    N("Tíquete entregue, e em poucos minutos chegam duas tigelas fumegantes. 🍜"),
    EX("Pode fazer barulho!", "No Japão, sorver o macarrão fazendo barulho é normal: esfria o lámen e mostra que está gostoso. Antes de comer, diz-se \"Itadakimasu\". E atenção: no Japão não se dá gorjeta. Deixar dinheiro na mesa pode até confundir o funcionário.",
       [("This is delicious!", "Isso está delicioso!"), ("Can I have some water, please?", "Pode me dar um pouco de água, por favor?")]),
    C("Seu lámen acabou, mas ainda sobrou caldo. E agora?", [
        O("Excuse me, can I have extra noodles, please?", "good", "Esperto! Muitos lugares vendem uma porção extra de macarrão para o mesmo caldo.", go="more", pt="Com licença, pode me dar mais macarrão, por favor?"),
        O("Thank you. That was delicious!", "good", "Elogio sincero no fim da refeição sempre agrada!", go="done", pt="Obrigado. Estava delicioso!"),
    ]),
  ],
  "more": [
    T("Cozinheiro", "Extra noodles? One more ticket, please.", "Macarrão extra? Mais um tíquete, por favor."),
    END("refil", "Final: macarrão extra", "Barriga cheia duas vezes! Você dominou o konbini e a máquina do lámen no mesmo dia. 🍜🍜"),
  ],
  "done": [
    T("Cozinheiro", "Thank you very much!", "Muito obrigado!"),
    END("satisfeito", "Final: sem gorjeta, com sorriso", "Vocês saem sem deixar gorjeta, do jeitinho japonês, e com o sorriso do cozinheiro de brinde. 😋"),
  ],
  }, "Onigiri, \"Would you like it heated?\", falta de lixeiras e a máquina de tíquetes do lámen."))

# ---------------------------------------------------------------- 3
CH.append(chapter("c3", "🚇", "Metrô de Tóquio e Shibuya", "Tokyo subway and Shibuya",
  {"sky": "day", "items": [["🚇", "drive"], ["🚦", "pulse"], ["👮", "wave"]]},
  {
  "start": [
    N("Hoje o destino é Shibuya, o bairro do cruzamento mais famoso do mundo! Mas antes, o desafio: o mapa de trens e metrô de Tóquio, que parece um prato de espaguete colorido. 🍝🚇"),
    EX("Cores, letras e números", "Cada linha tem uma cor e uma letra, e cada estação tem um número. Assim, mesmo sem ler japonês, você se localiza. Para perguntar, use \"Which line goes to…?\".",
       [("Which line goes to Shibuya?", "Qual linha vai para Shibuya?"), ("Where do I change trains?", "Onde eu troco de trem?")]),
    N("Vocês procuram um funcionário da estação. Para chamar a atenção dele com educação, diga \"Sumimasen\", que é \"com licença\"."),
    Y("Sumimasen! Which line goes to Shibuya?", "Com licença! Qual linha vai para Shibuya?"),
    G("Funcionário", "them", "Take the ___ line. It's the loop line.", "green", ["green", "slow", "blue", "long"], "Pegue a linha verde. É a linha circular."),
    TIP("🤫", "Silêncio no trem", "Nos trens japoneses, quase ninguém fala alto e ninguém atende telefonema. No horário de pico, os vagões ficam lotadíssimos e todos entram em fila. Os assentos preferenciais são para idosos, gestantes, pessoas com deficiência e com crianças pequenas.",
        dos=["Deixar o celular no silencioso", "Levar a mochila na frente do corpo", "Fazer fila nas marcas do chão"],
        donts=["Falar ao telefone dentro do trem", "Ocupar o assento preferencial se alguém precisar"]),
    N("No meio do caminho, o celular toca. É a sua sogra, lá do Brasil! 📱"),
    C("O que você faz?", [
        O("Silenciar e mandar uma mensagem: \"Ligo depois!\"", "good", "Perfeito! Educado com a sogra e com o vagão inteiro.", lang="pt"),
        O("Atender e falar bem alto: \"OI, TUDO BEM?\"", "bad", "Todo o vagão virou para você em silêncio absoluto… 😳 No Japão, telefone no trem é só no silencioso.", lang="pt"),
    ]),
    T("Anúncio", "The next station is Shibuya. The doors on the right side will open.", "A próxima estação é Shibuya. As portas do lado direito vão abrir."),
    N("Vocês chegam! A estação de Shibuya tem dezenas de saídas. A dica é perguntar qual saída usar."),
    B("Qual saída é para o cruzamento?", "Which exit is for the crossing?", ["door", "cross"]),
    N("E lá está ele: o cruzamento de Shibuya! O sinal fecha para todos os carros e centenas de pessoas atravessam em todas as direções. Vocês tiram fotos, riem… e, depois de umas voltas, ninguém sabe mais onde está o hotel. 😬"),
    C("Estão perdidos. O que fazer?", [
        O("Procurar um koban (posto policial) e pedir ajuda", "good", "Isso! O koban é uma casinha de polícia de bairro, e os policiais ajudam muito com direções.", go="koban", lang="pt"),
        O("Seguir andando e confiar na intuição", "ok", "A intuição do brasileiro é forte… mas Tóquio é maior. 😂", go="lost", lang="pt"),
    ]),
  ],
  "koban": [
    T("Policial", "Hello. Can I help you?", "Olá. Posso ajudar?"),
    Y("Yes, please. We are lost. This is our hotel.", "Sim, por favor. Estamos perdidos. Este é o nosso hotel."),
    G("Você", "you", "Can you show me on the ___?", "map", ["map", "menu", "phone", "wall"], "Você pode me mostrar no mapa?"),
    T("Policial", "Go straight and turn left at the second corner. It's five minutes on foot.", "Siga reto e vire à esquerda na segunda esquina. São cinco minutos a pé."),
    END("koban", "Final: salvos pelo koban", "O policial ainda desenhou um mapinha para vocês! Guarde essa: no Japão, perdido é igual a koban. 👮🗺️"),
  ],
  "lost": [
    N("Meia hora depois, vocês passam pela terceira vez na frente da mesma loja de doces. 🍬 Até a vendedora já acena para vocês!", "oops"),
    Y("Excuse me, sorry. We are lost. Where is this hotel?", "Com licença, desculpe. Estamos perdidos. Onde fica este hotel?"),
    T("Vendedora", "Oh, it's near here! Come, I'll show you.", "Ah, é aqui perto! Venham, eu mostro para vocês."),
    END("ajuda", "Final: a gentileza japonesa", "A moça largou a loja por dois minutos só para levar vocês até a esquina certa. Da próxima vez, é só perguntar logo! 🍬"),
  ],
  }, "Cores das linhas, \"Which line goes to…?\", silêncio no trem, o cruzamento de Shibuya e o koban."))

# ---------------------------------------------------------------- 4
CH.append(chapter("c4", "🏨", "Hotel em Tóquio", "Hotel in Tokyo",
  {"sky": "night", "items": [["🏨", "bob"], ["🩴", "sway"], ["🌙", "float"]]},
  {
  "start": [
    N("Hora de trocar de hotel! {name}, hoje vocês vão conhecer a hospedagem japonesa. Vocês chegam de manhã, mas o check-in é só à tarde. E agora, com as malas?"),
    T("Recepcionista", "Good morning. Check-in is from three p.m.", "Bom dia. O check-in é a partir das três da tarde."),
    G("Você", "you", "Can we ___ our bags here until then?", "leave", ["leave", "live", "lose", "sell"], "Podemos deixar as nossas malas aqui até lá?"),
    T("Recepcionista", "Of course. Here is your ticket for the bags.", "Claro. Aqui está o seu tíquete das malas."),
    EX("Leave / pick up", "Para deixar as malas, use \"leave our bags\". Para pegar de volta, \"pick up our bags\". Serve em hotel, estação e museu.",
       [("Can we leave our bags here?", "Podemos deixar as malas aqui?"), ("We want to pick up our bags.", "Queremos pegar as nossas malas.")]),
    N("À tarde, vocês voltam. Hoje é uma noite especial: vocês reservaram um hotel pequeno e prático, mas o hotel do lado é um hotel-cápsula, e {spousePt} quer muito experimentar… 🤔"),
    C("Onde vocês dormem hoje?", [
        O("Ficar no quartinho do hotel, juntos", "good", "Boa! O clássico \"business hotel\" japonês: pequeno, mas completinho.", go="business", lang="pt"),
        O("Experimentar o hotel-cápsula por uma noite", "good", "Aventura! Só que tem umas regrinhas…", go="capsule", lang="pt"),
    ]),
  ],
  "business": [
    T("Recepcionista", "Welcome! Your room is on the eighth floor. Breakfast is from seven.", "Bem-vindos! O quarto de vocês fica no oitavo andar. O café é a partir das sete."),
    N("Vocês abrem a porta e… o quarto é minúsculo! A cama ocupa quase tudo, e o banheiro parece uma cabine de avião. Mas tem pijama, chinelos, chaleira e uma privada cheia de botões. 🚽"),
    TIP("🩴", "Chinelos e sapatos", "No Japão, muitas casas, pousadas e alguns hotéis pedem para tirar o sapato na entrada. Os chinelos do quarto são para usar lá dentro, e há outros só para o banheiro.",
        dos=["Tirar o sapato onde houver chinelos na entrada", "Usar os chinelos de banheiro só no banheiro"],
        donts=["Pisar no quarto de sapato", "Sair do banheiro com os chinelos do banheiro"]),
    N("De noite, o ar-condicionado está gelado, e o controle remoto está todo em japonês. Hora de ligar para a recepção."),
    C("O que você diz?", [
        O("Hi, the remote is in Japanese. Could you help me, please?", "good", "Perfeito! \"Could you help me?\" é a frase coringa da viagem.", pt="Oi, o controle está em japonês. Você poderia me ajudar, por favor?"),
        O("Help! Help! It's very cold!", "ok", "Hahaha, a recepcionista achou que era uma emergência! Mais calma da próxima vez. 😂", pt="Socorro! Socorro! Está muito frio!"),
    ]),
    T("Recepcionista", "No problem. I'll come to your room right now.", "Sem problema. Vou até o seu quarto agora mesmo."),
    B("Como eu desligo o ar-condicionado?", "How do I turn off the air conditioner?", ["on", "open"]),
    END("quartinho", "Final: pequeno e perfeito", "Quarto quentinho, tudo limpo e organizado. Vocês dormem como pedras. \"Oyasumi nasai\": boa noite em japonês! 🌙"),
  ],
  "capsule": [
    T("Recepcionista", "Please take off your shoes and put them in this locker.", "Por favor, tirem os sapatos e coloquem neste armário."),
    T("Recepcionista", "Men and women sleep on different floors.", "Homens e mulheres dormem em andares diferentes."),
    N("Ops! Muitos hotéis-cápsula separam os andares por gênero. Então hoje o casal dorme separado. {spousePtCap} faz beicinho… 😅", "oops"),
    TIP("🛏️", "Regras do hotel-cápsula", "A cápsula é uma caminha num nicho, com luz, tomada e uma cortina. As malas grandes ficam em armários, e o silêncio é total, porque uma cortina não segura barulho nenhum!",
        dos=["Falar baixinho nos corredores", "Guardar a mala grande no armário"],
        donts=["Comer dentro da cápsula", "Fazer ligação dentro da cápsula"]),
    C("Você não acha a toalha. O que faz?", [
        O("Excuse me, where can I get a towel?", "good", "Isso! Curto e direto.", pt="Com licença, onde eu pego uma toalha?"),
        O("Ir de cápsula em cápsula procurando", "bad", "Nãooo! Abrir a cortina dos outros é a pior coisa que dá para fazer ali. Pergunte na recepção!", lang="pt"),
    ]),
    T("Recepcionista", "Towels are at the front desk. Here you go.", "As toalhas ficam na recepção. Aqui está."),
    B("A que horas é o check-out amanhã?", "What time do we check out tomorrow?", ["when", "today"]),
    END("capsula", "Final: noite na cápsula", "Você dormiu num casulo futurista! No café da manhã, {spousePt} jura que roncou menos que o vizinho. 😂🛏️"),
  ],
  }, "Deixar as malas, quartinho japonês, chinelos, hotel-cápsula e \"Could you help me?\"."))

ISLANDS = {"c1": ["🛬", "🗼"], "c2": ["🏪", "🍜"], "c3": ["🚇", "🚦"], "c4": ["🏨", "🩴"]}
for c in CH: c["island"] = ISLANDS[c["id"]]
