# Aventura na Tailândia — história ramificada. Gera data/trips/thailand.json
# Rodar na pasta do projeto:  python3 tools/story_thailand.py
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from story_dsl import *

ch = []

# ---------------------------------------------------------------- 1
ch.append(chapter("c1", "🛬", "Imigração em Bangkok", "Immigration", 
  {"sky": "day", "items": [["✈️", "fly"], ["🛄", "bob"], ["🛂", "pulse"]]},
  {
  "start": [
    N("Sawasdee! Eu sou o Professor Kiko 🎓🦜 e vou ser o seu professor de inglês nessa viagem. A gente aprende do jeito mais gostoso: vivendo cada situação. Depois de muitas horas de voo, vocês acabaram de pousar no aeroporto Suvarnabhumi, em Bangkok. Sente esse calor úmido? Bem-vindos ao Sudeste Asiático!"),
    N("Antes de pegar as malas, vem o momento que dá um frio na barriga: a imigração. Calma! Como bom professor, eu vou te explicar cada fala antes de você precisar dela. Primeiro, uma dica que vai fazer os tailandeses sorrirem pra você."),
    TIP("🙏", "O cumprimento tailandês", "Na Tailândia, o cumprimento tradicional é o wai: juntar as palmas das mãos na frente do peito e inclinar levemente a cabeça, dizendo \"Sawasdee\". Os tailandeses chamam o país de \"Terra dos Sorrisos\": sorrir resolve quase tudo.",
        dos=["Sorrir e falar com calma", "Dizer Sawasdee + khrap (homem) ou ka (mulher)"],
        donts=["Tocar na cabeça de alguém, nem de crianças: é a parte mais sagrada do corpo", "Apontar a sola dos pés para pessoas ou imagens de Buda"]),
    EX("Khrap ou ka?", "Em tailandês, quem fala coloca uma palavrinha de educação no fim da frase: homens dizem \"khrap\" e mulheres dizem \"ka\". É como um \"senhor/senhora\" carinhoso. Nas falas desta história, eu já coloco a sua.",
        [("Sawasdee {p}!", "Olá! (com educação)"), ("Khob khun {p}!", "Obrigado(a)! (com educação)")]),
    N("Chegou a sua vez no balcão. O oficial olha pra você…"),
    T("Oficial", "Sawasdee! Passport and arrival card, please.", "Olá! Passaporte e cartão de chegada, por favor."),
    C("Como você responde?", [
        O("Sawasdee {p}. Here you are.", "good", "Perfeito! O \"Sawasdee {p}\" é um carinho, e \"Here you are\" é o jeito educado de entregar algo.", pt="Olá. Aqui está."),
        O("Hello. Here.", "ok", "Funciona! Mas o toque tailandês encanta. Da próxima vez experimente \"Sawasdee {p}\".", pt="Olá. Aqui."),
        O("(Entregar o passaporte sem dizer nada)", "bad", "Ficar calado parece grosseiro. Uma palavrinha já muda tudo!", go="silent", lang="pt"),
    ]),
    GO("together"),
  ],
  "silent": [
    T("Oficial", "Hello? Can you say something, please?", "Olá? Pode dizer alguma coisa, por favor?"),
    G("Você", "you", "Oh, sorry! Sawasdee {p}. ___ you are.", "Here", ["Here", "There", "Where", "What"], "Ah, desculpe! Olá. Aqui está."),
    T("Oficial", "Thank you. Don't be nervous!", "Obrigado. Não fique nervoso!"),
    GO("together"),
  ],
  "together": [
    T("Oficial", "Are you traveling together?", "Vocês estão viajando juntos?"),
    G("Você", "you", "Yes, we are married. {She} is my ___.", "{spouse}", ["{spouse}", "sister", "friend", "boss"], "Sim, somos casados. {ElaPt} é {spousePt}."),
    T("Oficial", "What is the purpose of your visit?", "Qual é o motivo da sua visita?"),
    C("Vocês estão de férias. O que você diz?", [
        O("Tourism. We are here on vacation.", "good", "Isso! \"Tourism\" ou \"vacation\" é exatamente o que o oficial quer ouvir.", pt="Turismo. Estamos aqui de férias."),
        O("Business.", "bad", "Epa! \"Business\" quer dizer negócios. Olha o que acontece…", go="business", pt="Negócios."),
    ]),
    GO("hotel"),
  ],
  "business": [
    T("Oficial", "Business? Do you have a business visa?", "Negócios? Vocês têm visto de negócios?"),
    N("Ops! Dizer \"business\" sem ter visto de trabalho complica tudo. Vamos consertar com calma.", "oops"),
    C("Como você corrige?", [
        O("Sorry, my mistake! Tourism. We are on vacation.", "good", "Ufa! \"My mistake\" (erro meu) salva a situação.", pt="Desculpe, erro meu! Turismo. Estamos de férias."),
        O("Yes, business vacation.", "bad", "Isso confunde ainda mais. Seja simples: tourism, vacation.", go="business2", pt="Sim, férias de negócios."),
    ]),
    T("Oficial", "OK, tourism. No problem.", "OK, turismo. Sem problema."),
    GO("hotel"),
  ],
  "business2": [
    T("Oficial", "I don't understand. Tourism or business?", "Não entendi. Turismo ou negócios?"),
    Y("Tourism! Only tourism.", "Turismo! Só turismo."),
    T("Oficial", "OK. Tourism.", "OK. Turismo."),
    GO("hotel"),
  ],
  "hotel": [
    T("Oficial", "Where are you staying in Thailand?", "Onde vocês vão se hospedar na Tailândia?"),
    B("Nós vamos ficar em Bangkok e Phuket.", "We are staying in Bangkok and Phuket.", ["on", "stay"]),
    T("Oficial", "Can I see your hotel reservation, please?", "Posso ver a reserva do hotel, por favor?"),
    C("Onde está a sua reserva?", [
        O("Yes, here it is. It's printed.", "good", "Ótimo! Ter tudo impresso numa pastinha é a dica de ouro da imigração.", pt="Sim, aqui está. Está impressa."),
        O("It's on my phone. One moment, please.", "ok", "Também vale! Mas… olha a bateria do celular.", go="phone", pt="Está no meu celular. Um momento, por favor."),
    ]),
    GO("days"),
  ],
  "phone": [
    N("O celular está com 2% de bateria… e desliga! 😱 Respira. Isso acontece com todo mundo.", "oops"),
    C("E agora?", [
        O("Sorry, my phone died. I have a paper copy in my bag.", "good", "Salvou! \"My phone died\" é como se diz que o celular descarregou.", pt="Desculpe, meu celular descarregou. Tenho uma cópia em papel na bolsa."),
        O("No battery! No hotel! Help!", "bad", "Calma! O oficial é paciente, mas pânico não ajuda. Veja:", go="panic", pt="Sem bateria! Sem hotel! Socorro!"),
    ]),
    GO("days"),
  ],
  "panic": [
    T("Oficial", "Take a breath. Do you have a paper copy?", "Respire. Vocês têm uma cópia em papel?"),
    Y("Yes! Here it is. Sorry!", "Sim! Aqui está. Desculpe!"),
    GO("days"),
  ],
  "days": [
    T("Oficial", "How many days will you stay?", "Quantos dias vocês vão ficar?"),
    G("Você", "you", "We are staying ___ ten days.", "for", ["for", "since", "in", "during"], "Vamos ficar por dez dias."),
    EX("For + tempo", "Para dizer quanto tempo algo dura, use \"for\": for ten days (por dez dias), for two weeks (por duas semanas), for a month (por um mês).",
       [("We are staying for ten days.", "Vamos ficar por dez dias."), ("I lived there for a year.", "Eu morei lá por um ano.")]),
    T("Oficial", "Do you have a return ticket to Brazil?", "Vocês têm passagem de volta para o Brasil?"),
    Y("Yes, here is our return ticket.", "Sim, aqui está a nossa passagem de volta."),
    T("Oficial", "And do you have money for your trip? Cash or credit cards?", "E vocês têm dinheiro para a viagem? Em espécie ou cartões de crédito?"),
    C("O que você responde?", [
        O("Yes, we have cash and credit cards.", "good", "Perfeito. É uma pergunta comum: eles só querem saber se vocês conseguem se manter.", pt="Sim, temos dinheiro e cartões de crédito."),
        O("Why? Do you want my money?", "bad", "Nada de piadas na imigração! Os oficiais levam isso a sério.", go="joke", pt="Por quê? Você quer meu dinheiro?"),
    ]),
    GO("stamp"),
  ],
  "joke": [
    T("Oficial", "This is not a joke. Please answer the question.", "Isso não é brincadeira. Por favor, responda à pergunta."),
    TIP("⚠️", "Imigração não é lugar de piada", "Nunca brinque com o oficial sobre dinheiro, drogas, segurança ou a família real. A Tailândia tem leis muito rígidas sobre o Rei: nada de comentários, nem de brincadeira.", donts=["Piadas na imigração", "Comentários sobre o Rei ou a família real"]),
    Y("Sorry. Yes, we have cash and credit cards.", "Desculpe. Sim, temos dinheiro e cartões de crédito."),
    GO("stamp"),
  ],
  "stamp": [
    T("Oficial", "Everything looks good. Welcome to Thailand!", "Tudo certo. Bem-vindos à Tailândia!"),
    B("Muito obrigado. Tenha um bom dia!", "Thank you so much. Have a nice day!", ["much", "night"]),
    N("Carimbo no passaporte! 🎉 Agora é pegar as malas. Vocês vão para a esteira 7 e esperam… esperam… e a esteira para. Uma das malas não apareceu."),
    C("O que você faz?", [
        O("Ir ao balcão de bagagens e perguntar", "good", "Boa! O balcão de bagagem extraviada (baggage service) resolve isso todo dia.", go="lostbag", lang="pt"),
        O("Esperar mais um pouco", "ok", "Às vezes funciona! Vamos ver…", go="wait", lang="pt"),
    ]),
  ],
  "lostbag": [
    Y("Excuse me, my bag didn't arrive.", "Com licença, minha mala não chegou."),
    T("Atendente", "I'm sorry. Can I see your baggage tag?", "Sinto muito. Posso ver a etiqueta da bagagem?"),
    EX("Baggage tag", "Aquele adesivo com código de barras que colam no seu cartão de embarque ou passaporte é a baggage tag. Guarde até pegar a mala!", [("Here is my baggage tag.", "Aqui está a etiqueta da minha mala.")]),
    T("Atendente", "Your bag is on the next flight. We will deliver it to your hotel tonight.", "Sua mala está no próximo voo. Vamos entregá-la no seu hotel hoje à noite."),
    G("Você", "you", "Thank you! This is the ___ of our hotel.", "address", ["address", "name", "street", "number"], "Obrigado! Este é o endereço do nosso hotel."),
    END("mala-no-hotel", "Final: a mala vai chegar no hotel", "Você resolveu tudo em inglês, sem estresse. A mala chega à noite, e vocês já estão em Bangkok! 🛄"),
  ],
  "wait": [
    N("Cinco minutos depois… a esteira volta a girar e lá vem a mala, meio amassada, mas inteira! 😅"),
    G("Você", "you", "There it ___! That's our bag!", "is", ["is", "are", "was", "be"], "Lá está ela! Essa é a nossa mala!"),
    END("mala-apareceu", "Final: a mala apareceu", "Paciência também é uma habilidade de viajante. Malas na mão, Bangkok espera por vocês! 🧳"),
  ],
  }, "Cumprimento tailandês, imigração completa e o mistério da mala."))

# ---------------------------------------------------------------- 2
ch.append(chapter("c2", "🛕", "Templo do Grande Palácio", "The Grand Palace",
  {"sky": "day", "items": [["🛕", "bob"], ["☀️", "spin"], ["🕊️", "fly"]]},
  {
  "start": [
    N("Bom dia! Hoje é dia do Grande Palácio e do templo do Buda de Esmeralda, o lugar mais sagrado da Tailândia. Mas antes de sair do hotel… vamos falar de roupa. 👕"),
    TIP("👖", "Roupa para templo", "Nos templos, homens e mulheres precisam cobrir ombros e joelhos. Nada de bermuda, regata, saia curta ou roupa transparente. Um lenço resolve os ombros.",
        dos=["Calça comprida ou saia longa", "Camiseta com manga"], donts=["Bermuda, regata, top", "Roupa muito justa ou transparente"]),
    C("O que você veste hoje?", [
        O("Calça comprida e camiseta com manga", "good", "Perfeito! Você vai entrar sem problemas.", lang="pt"),
        O("Bermuda e regata, está muito calor!", "bad", "Entendo o calor… mas veja o que acontece no portão.", go="shorts", lang="pt"),
    ]),
    T("Guarda", "Good morning! Welcome. Tickets are over there.", "Bom dia! Bem-vindos. Os ingressos são ali."),
    GO("tickets"),
  ],
  "shorts": [
    T("Guarda", "Sorry. You can't go in with shorts.", "Desculpe. Não pode entrar de bermuda."),
    G("Você", "you", "Oh, I'm sorry! Where can I ___ long pants?", "buy", ["buy", "sell", "eat", "drive"], "Ah, desculpe! Onde posso comprar uma calça comprida?"),
    T("Guarda", "There is a shop across the street.", "Tem uma loja do outro lado da rua."),
    T("Vendedora", "Hello! Elephant pants? Very comfortable!", "Olá! Calça de elefante? Muito confortável!"),
    Y("How much are these pants?", "Quanto custa esta calça?"),
    EX("Pants é plural!", "Em inglês, calça é \"pants\", sempre no plural (são duas pernas!). Por isso a pergunta é \"How much ARE these pants?\"",
       [("These pants are nice.", "Esta calça é bonita."), ("How much are these shoes?", "Quanto custam estes sapatos?")]),
    T("Vendedora", "Two hundred baht.", "Duzentos bahts."),
    Y("OK. I'll take them.", "OK. Vou levar."),
    N("Pronto: com a famosa calça de elefante 🐘, você volta ao templo com o visual de quem entendeu a cultura!"),
    GO("tickets"),
  ],
  "tickets": [
    Y("Two tickets, please. How much?", "Dois ingressos, por favor. Quanto custa?"),
    T("Bilheteira", "Five hundred baht each.", "Quinhentos bahts cada."),
    EX("Each = cada", "\"Each\" quer dizer \"cada\". Se o ingresso é 500 each, dois ingressos custam 1.000.",
       [("They are five hundred baht each.", "São quinhentos bahts cada."), ("One for each of us.", "Um para cada um de nós.")]),
    G("Você", "you", "So, one thousand for ___. Here you are.", "two", ["two", "each", "one", "three"], "Então, mil pelos dois. Aqui está."),
    N("Lá dentro, tudo brilha: telhados dourados, guardiões gigantes e mosaicos coloridos. Na porta do templo principal, todos estão tirando os sapatos. 👟"),
    TIP("👟", "Sapatos e pés", "Tire os sapatos antes de entrar em templos e casas. Sente com os pés dobrados para trás: nunca aponte a sola dos pés para o Buda ou para os monges.", dos=["Tirar os sapatos na entrada", "Falar baixo lá dentro"], donts=["Apontar os pés para o Buda", "Encostar em monges (principalmente mulheres)"]),
    C("Você quer tirar uma foto. O que pergunta?", [
        O("Excuse me, can we take photos here?", "good", "Isso! Em inglês, foto se \"tira\" com TAKE: take a photo.", pt="Com licença, podemos tirar fotos aqui?"),
        O("Excuse me, can we make photos here?", "ok", "Dá para entender, mas o certo é TAKE photos.", pt="Com licença, podemos fazer fotos aqui?"),
    ]),
    T("Guarda", "Outside, yes. Inside the temple, no photos, please.", "Do lado de fora, sim. Dentro do templo, sem fotos, por favor."),
    N("Lá dentro, você senta no chão para admirar o Buda de Esmeralda. Como você se senta?"),
    C("Escolha a posição:", [
        O("Com as pernas dobradas para trás, pés longe do Buda", "good", "Isso mesmo! Assim você demonstra respeito.", lang="pt"),
        O("Com as pernas esticadas, pés na direção do Buda", "bad", "Ai, ai! Olha o que acontece…", go="feet", lang="pt"),
    ]),
    GO("end"),
  ],
  "feet": [
    T("Senhora tailandesa", "Excuse me… please don't point your feet at the Buddha.", "Com licença… por favor, não aponte os pés para o Buda."),
    C("Como você responde?", [
        O("Oh, I'm so sorry! Thank you for telling me.", "good", "Perfeito. Pedir desculpas e agradecer mostra que você respeita a cultura.", pt="Ah, me desculpe! Obrigado por me avisar."),
        O("Why? It's just feet.", "bad", "Isso soa desrespeitoso. Para os budistas, os pés são a parte mais baixa e impura do corpo.", pt="Por quê? São só pés."),
    ]),
    GO("end"),
  ],
  "end": [
    B("Onde posso deixar meus sapatos?", "Where can I leave my shoes?", ["live", "shoe"]),
    END("templo", "Final: respeito no templo", "Vocês visitaram o lugar mais sagrado da Tailândia e aprenderam as regras de ouro dos templos. 🛕✨"),
  ],
  }, "Regras de roupa, ingressos, fotos e como se comportar diante do Buda."))

# ---------------------------------------------------------------- 3
ch.append(chapter("c3", "🛺", "Tuk-tuk pela cidade", "Tuk-tuk ride",
  {"sky": "day", "items": [["🛺", "drive"], ["🏙️", "bob"], ["💨", "drive"]]},
  {
  "start": [
    N("Saindo do templo, o calor aperta. E aí aparece ele: o tuk-tuk, um triciclo colorido, barulhento e super divertido! 🛺 Mas atenção: tuk-tuk não tem taxímetro."),
    TIP("💰", "Combine o preço antes", "No tuk-tuk, o preço é combinado ANTES de subir. Negociar é normal, mas sempre com sorriso e bom humor. Outra opção é pedir um carro pelo aplicativo Grab, que mostra o preço antes.",
        dos=["Perguntar o preço antes de subir", "Negociar sorrindo"], donts=["Subir sem combinar", "Aceitar parar em lojas no caminho"]),
    T("Motorista", "Tuk-tuk! Where to?", "Tuk-tuk! Para onde?"),
    Y("To Khao San Road, please. How much?", "Para a Khao San Road, por favor. Quanto custa?"),
    T("Motorista", "Three hundred baht.", "Trezentos bahts."),
    C("O preço parece alto. O que você faz?", [
        O("That's too expensive. How about one hundred and fifty?", "good", "Negociador nato! Oferecer a metade e ir subindo é o jeito tailandês.", go="haggle", pt="Está caro demais. Que tal cento e cinquenta?"),
        O("OK, let's go!", "ok", "Vocês vão pagar mais, mas tudo bem: a corrida é divertida!", go="accept", pt="OK, vamos!"),
        O("No, thanks. We'll take a Grab.", "good", "Esperto! O Grab é o \"Uber\" do Sudeste Asiático.", go="grab", pt="Não, obrigado. Vamos pegar um Grab."),
    ]),
  ],
  "haggle": [
    T("Motorista", "Two hundred. Last price!", "Duzentos. Último preço!"),
    G("Você", "you", "OK, it's a ___! Two hundred.", "deal", ["deal", "price", "trip", "car"], "OK, fechado! Duzentos."),
    EX("It's a deal!", "\"It's a deal!\" ou só \"Deal!\" quer dizer \"Fechado!\" ou \"Combinado!\". Serve para qualquer negociação.",
       [("Deal!", "Fechado!"), ("Two for three hundred? Deal!", "Dois por trezentos? Fechado!")]),
    N("No meio do caminho, o motorista vira pra trás com um sorriso…"),
    T("Motorista", "My friend has a gem shop. Very cheap! We stop five minutes, OK?", "Meu amigo tem uma loja de pedras preciosas. Bem barato! A gente para cinco minutos, OK?"),
    C("O que você responde?", [
        O("No, thank you. Please go straight to Khao San Road.", "good", "Isso! Esse é um golpe clássico de turista. Recusar com educação resolve.", pt="Não, obrigado. Por favor, vá direto para a Khao San Road."),
        O("OK, five minutes.", "bad", "Hum… vamos ver o que tem nessa loja.", go="gems", pt="OK, cinco minutos."),
    ]),
    GO("arrive"),
  ],
  "gems": [
    T("Vendedor", "Special price only today! Real sapphire, very cheap!", "Preço especial só hoje! Safira de verdade, muito barata!"),
    N("\"Só hoje\", \"muito barato\", \"de verdade\"… Quando o vendedor insiste muito, desconfie! 🚩"),
    G("Você", "you", "No, thank you. We are just ___.", "looking", ["looking", "buying", "eating", "sleeping"], "Não, obrigado. Estamos só olhando."),
    EX("Just looking", "\"We're just looking\" (estamos só olhando) é a frase mágica para sair de qualquer loja sem comprar.", [("No, thanks. I'm just looking.", "Não, obrigado. Estou só olhando.")]),
    GO("arrive"),
  ],
  "accept": [
    N("O motorista acelera, costura entre carros e motos, e vocês gritam de emoção! 🎢"),
    G("Você", "you", "Can you drive more ___, please?", "slowly", ["slowly", "fast", "slow", "quick"], "Você pode dirigir mais devagar, por favor?"),
    EX("Slow ou slowly?", "\"Slow\" descreve coisas (a slow car, um carro lento). \"Slowly\" descreve o jeito de fazer (drive slowly, dirigir devagar).", [("Please speak slowly.", "Por favor, fale devagar.")]),
    T("Motorista", "OK, OK! Slowly!", "OK, OK! Devagar!"),
    GO("arrive"),
  ],
  "grab": [
    N("Você abre o app, digita \"Khao San Road\" e o preço aparece: 120 bahts, com ar-condicionado! ❄️ Três minutos depois, o carro chega."),
    T("Motorista", "Hello! Are you going to Khao San Road?", "Olá! Vocês vão para a Khao San Road?"),
    G("Você", "you", "Yes, that's ___! Thank you.", "right", ["right", "left", "good", "true"], "Sim, isso mesmo! Obrigado."),
    T("Motorista", "Is the air conditioning OK?", "O ar-condicionado está bom?"),
    Y("Yes, it's perfect. Thank you!", "Sim, está perfeito. Obrigado!"),
    B("Nós podemos pagar em dinheiro?", "Can we pay in cash?", ["with", "money"]),
    T("Motorista", "Yes, cash or card in the app. Here we are!", "Sim, dinheiro ou cartão no app. Chegamos!"),
    END("grab", "Final: o viajante esperto", "Com o app, vocês pagaram o preço justo e ainda andaram no ar-condicionado. ❄️ Da próxima vez, que tal experimentar o tuk-tuk?"),
  ],
  "arrive": [
    T("Motorista", "Here we are! Khao San Road!", "Chegamos! Khao San Road!"),
    N("Você só tem uma nota de 1.000 bahts…"),
    G("Você", "you", "Do you have ___ for a thousand?", "change", ["change", "money", "coins", "price"], "Você tem troco para mil?"),
    T("Motorista", "Yes, no problem.", "Sim, sem problema."),
    B("Obrigado! Tenha um bom dia!", "Thank you! Have a nice day!", ["good", "night"]),
    END("tuktuk", "Final: aventura de tuk-tuk", "Vocês sobreviveram ao trânsito de Bangkok no transporte mais famoso da Tailândia! 🛺💨"),
  ],
  }, "Negociar o preço, escapar de golpes ou chamar um carro por aplicativo."))

# ---------------------------------------------------------------- 4
ch.append(chapter("c4", "🍜", "Mercado noturno", "Night market food",
  {"sky": "night", "items": [["🏮", "sway"], ["🍜", "bob"], ["🌙", "float"]]},
  {
  "start": [
    N("A noite chegou e o mercado noturno acende: lanternas vermelhas, fumaça de churrasquinho e cheiro de capim-limão. 🏮 Hora do jantar! Mas antes, duas dicas que salvam o estômago."),
    TIP("🌶️", "Pimenta e água", "A comida tailandesa pode ser MUITO apimentada, bem mais do que no Brasil. E beba só água engarrafada: a da torneira não é própria para beber.",
        dos=["Pedir \"not spicy\" ou \"mai phet\" (sem pimenta em tailandês)", "Água em garrafa lacrada"], donts=["Água da torneira", "Gelo em lugares muito simples, se tiver estômago sensível"]),
    T("Vendedora", "Sawasdee {p}! What would you like?", "Olá! O que você gostaria?"),
    C("O que você pede?", [
        O("Two pad thai, please.", "good", "O clássico! Macarrão de arroz frito com ovo, broto de feijão e amendoim.", pt="Dois pad thai, por favor."),
        O("What is that? Fried insects?", "ok", "Curioso! Vamos ver…", go="insects", pt="O que é aquilo? Insetos fritos?"),
    ]),
    GO("spicy"),
  ],
  "insects": [
    T("Vendedora", "Yes! Crickets. Very crunchy! You want to try one?", "Sim! Grilos. Muito crocantes! Quer provar um?"),
    C("Coragem?", [
        O("Sure, why not!", "good", "Que coragem! 🦗 Dizem que tem gosto de pipoca salgada.", pt="Claro, por que não!"),
        O("No, thank you! Maybe next time.", "good", "Resposta educada e simpática. Tudo certo!", pt="Não, obrigado! Talvez da próxima vez."),
    ]),
    Y("And two pad thai, please.", "E dois pad thai, por favor."),
    GO("spicy"),
  ],
  "spicy": [
    T("Vendedora", "Spicy?", "Apimentado?"),
    C("O que você responde?", [
        O("Not spicy, please. Mai phet!", "good", "Perfeito! Misturar o inglês com um \"mai phet\" tailandês faz a vendedora sorrir. 😄", pt="Sem pimenta, por favor. Mai phet!"),
        O("Yes, very spicy! I love pepper!", "bad", "Corajoso… mas pimenta tailandesa é outro nível. Veja:", go="fire", pt="Sim, bem apimentado! Adoro pimenta!"),
    ]),
    GO("allergy"),
  ],
  "fire": [
    N("Primeira garfada… 🔥🔥🔥 Seus olhos lacrimejam, a boca pega fogo!", "oops"),
    G("Você", "you", "Water! Can I have some ___, please?", "water", ["water", "pepper", "fire", "rice"], "Água! Pode me dar um pouco de água, por favor?"),
    T("Vendedora", "Thai spicy! Hahaha. Here, water and rice.", "Pimenta tailandesa! Hahaha. Aqui, água e arroz."),
    EX("Dica de sobrevivência", "Arroz, leite e pepino aliviam a pimenta mais do que água. E \"mai phet\" (sem pimenta) ou \"phet nit noi\" (só um pouquinho) são as palavras mágicas.", [("A little spicy, please.", "Um pouco apimentado, por favor.")]),
    GO("allergy"),
  ],
  "allergy": [
    N("Espera! O pad thai costuma vir com amendoim por cima, e {spousePt} tem alergia. Hora de avisar."),
    B("{ElaPt} é alérgic{aPt} a amendoim.", "{She} is allergic to peanuts.", ["allergy", "peanut"]),
    EX("Allergic to", "Para falar de alergia: \"I'm allergic to…\" (sou alérgico a…). Ex.: allergic to peanuts (amendoim), shrimp (camarão), milk (leite).", [("I'm allergic to shrimp.", "Sou alérgico a camarão.")]),
    T("Vendedora", "OK, no peanuts for one. Something to drink?", "OK, sem amendoim para um. Algo para beber?"),
    C("O que vocês bebem?", [
        O("Two bottles of water, no ice, please.", "good", "Perfeito para a segurança do estômago!", pt="Duas garrafas de água, sem gelo, por favor."),
        O("Two fresh coconuts, please.", "good", "Delícia! Coco fresco é seguro e refrescante. 🥥", pt="Dois cocos frescos, por favor."),
    ]),
    TIP("🥄", "Garfo e colher", "Na Tailândia, come-se com colher na mão direita e garfo na esquerda. O garfo só empurra a comida para a colher: não se leva o garfo à boca.", dos=["Colher na mão direita, garfo empurrando"]),
    T("Vendedora", "That's two hundred and forty baht.", "São duzentos e quarenta bahts."),
    G("Você", "you", "Here you are. It's ___!", "delicious", ["delicious", "dirty", "boring", "expensive"], "Aqui está. Está delicioso!"),
    END("mercado", "Final: jantar tailandês", "Barriga cheia, boca (talvez) pegando fogo e muitas palavras novas. Aroi mak! (muito gostoso, em tailandês) 🍜"),
  ],
  }, "Pedir comida, controlar a pimenta, avisar alergia e comer do jeito tailandês."))

# ---------------------------------------------------------------- 5
ch.append(chapter("c5", "🏝️", "Chegada em Phuket", "Phuket resort",
  {"sky": "sea", "items": [["✈️", "fly"], ["🌴", "sway"], ["🏝️", "bob"]]},
  {
  "start": [
    N("Tchau, Bangkok! Um voo curtinho de uma hora e vocês chegam a Phuket, a ilha das praias de água azul. 🏝️ O resort tem cheiro de flores e música suave."),
    T("Recepcionista", "Sawasdee {p}! Welcome to Phuket. Do you have a reservation?", "Olá! Bem-vindos a Phuket. Vocês têm reserva?"),
    G("Você", "you", "Yes, we have a reservation ___ the name {name}.", "under", ["under", "on", "with", "in"], "Sim, temos uma reserva no nome {name}."),
    EX("Under the name", "Em inglês, a reserva fica \"under the name\" (literalmente, \"debaixo do nome\"). É assim em hotel e restaurante.", [("A table under the name Silva.", "Uma mesa no nome Silva.")]),
    T("Recepcionista", "Yes, five nights. Your room is on the third floor.", "Sim, cinco noites. O quarto de vocês fica no terceiro andar."),
    C("Vocês preferem não usar escadas. O que pede?", [
        O("Could we have a room on the ground floor, please?", "good", "Isso! \"Ground floor\" é o térreo.", pt="Poderíamos ter um quarto no térreo, por favor?"),
        O("Is there a room with a sea view?", "ok", "Sonhando alto! Vamos ver…", go="seaview", pt="Tem um quarto com vista para o mar?"),
    ]),
    T("Recepcionista", "Sorry, the ground floor is full. But there is an elevator, of course.", "Desculpe, o térreo está lotado. Mas tem elevador, claro."),
    Y("Perfect, thank you.", "Perfeito, obrigado."),
    GO("info"),
  ],
  "seaview": [
    T("Recepcionista", "Yes, we have one. It's eight hundred baht more per night.", "Sim, temos um. São oitocentos bahts a mais por noite."),
    C("Vale a pena?", [
        O("OK, we'll take it! It's a special trip.", "good", "Que maravilha! Acordar vendo o mar não tem preço. 🌅", go="upgrade", pt="OK, vamos ficar com ele! É uma viagem especial."),
        O("No, thank you. The normal room is fine.", "good", "Decisão sensata: sobra dinheiro para os passeios!", pt="Não, obrigado. O quarto normal está ótimo."),
    ]),
    GO("info"),
  ],
  "upgrade": [
    N("A recepcionista sorri, troca o cartão-chave e diz que a vista da varanda é a mais bonita do hotel. 🌊"),
    GO("info"),
  ],
  "info": [
    B("A que horas é o café da manhã?", "What time is breakfast?", ["when", "eat"]),
    T("Recepcionista", "From six thirty to ten thirty, by the pool.", "Das seis e meia às dez e meia, perto da piscina."),
    G("Você", "you", "And what is the Wi-Fi ___?", "password", ["password", "word", "key", "name"], "E qual é a senha do Wi-Fi?"),
    T("Recepcionista", "It's on your key card. Enjoy your stay!", "Está no seu cartão-chave. Aproveitem a estadia!"),
    TIP("👙", "Roupa de praia é para a praia", "Em Phuket todo mundo vai à praia, mas andar de biquíni ou sem camisa no lobby, nas lojas ou na rua é visto como falta de educação.", dos=["Usar uma saída de praia ou camiseta fora da piscina"], donts=["Andar de roupa de banho pela cidade"]),
    N("No quarto, vocês abrem as cortinas e… que calor! O ar-condicionado não liga. 🥵"),
    C("Você liga para a recepção. O que diz?", [
        O("Hi, this is room 305. The air conditioning isn't working.", "good", "Perfeito: diz quem é, qual o quarto e qual o problema.", pt="Olá, aqui é do quarto 305. O ar-condicionado não está funcionando."),
        O("Hello, I am broken. Help me!", "bad", "Hahaha, você disse \"eu estou quebrado\"! Vamos tentar de novo.", go="broken", pt="Alô, eu estou quebrado. Me ajude!"),
    ]),
    GO("fix"),
  ],
  "broken": [
    T("Recepcionista", "Sorry? Are you OK?", "Como? Você está bem?"),
    G("Você", "you", "Sorry! The air conditioning is ___.", "broken", ["broken", "happy", "hot", "open"], "Desculpe! O ar-condicionado está quebrado."),
    EX("Isn't working / is broken", "Para dizer que algo não funciona: \"The TV isn't working\" ou \"The shower is broken\". O sujeito é o objeto, não você!", [("The shower isn't working.", "O chuveiro não está funcionando.")]),
    GO("fix"),
  ],
  "fix": [
    T("Recepcionista", "I'm sorry! A technician will be there in ten minutes.", "Desculpe! Um técnico vai subir em dez minutos."),
    END("resort", "Final: bem-vindos ao paraíso", "Quarto resolvido, ar gelado e a praia esperando lá embaixo. Hora de descansar! 🏝️"),
  ],
  }, "Check-in no resort, pedidos especiais e resolver problemas no quarto."))

# ---------------------------------------------------------------- 6
ch.append(chapter("c6", "🛍️", "Feirinha de lembrancinhas", "Souvenir market",
  {"sky": "dusk", "items": [["🛍️", "bob"], ["🐘", "walk"], ["🏮", "sway"]]},
  {
  "start": [
    N("Fim de tarde na feirinha de Phuket: elefantes de madeira, ímãs de geladeira, sabonetes em forma de flor… hora de comprar lembrancinhas para a família no Brasil! 🎁"),
    TIP("😊", "A pechincha amigável", "Negociar faz parte, mas na Tailândia quem perde a calma \"perde a cara\" (lose face) e perde a simpatia do vendedor. Pechinche como uma brincadeira, sempre sorrindo.",
        dos=["Sorrir e brincar", "Pedir desconto por quantidade"], donts=["Gritar ou se irritar", "Ofender o produto"]),
    T("Vendedor", "Hello! Look, very nice! Elephant magnets, one hundred baht each.", "Olá! Olha, muito bonito! Ímãs de elefante, cem bahts cada."),
    C("Você quer levar cinco. Como pede desconto?", [
        O("If I buy five, can you give me a discount?", "good", "Excelente! Desconto por quantidade é a forma mais simpática de negociar.", pt="Se eu comprar cinco, você me dá um desconto?"),
        O("Too expensive! Are you crazy?", "bad", "Xiii… o sorriso do vendedor sumiu. Veja:", go="rude", pt="Caro demais! Você está louco?"),
    ]),
    GO("deal"),
  ],
  "rude": [
    T("Vendedor", "Sorry. No discount.", "Desculpe. Sem desconto."),
    N("Viu? Grosseria fecha portas. Mas dá para consertar com humor.", "oops"),
    C("Tente de novo:", [
        O("Sorry, I'm joking! Five for four hundred?", "good", "Salvou! Um sorriso e uma piada desarmam qualquer vendedor.", pt="Desculpe, estou brincando! Cinco por quatrocentos?"),
    ]),
    GO("deal"),
  ],
  "deal": [
    T("Vendedor", "OK, five for four hundred. Special price for you!", "OK, cinco por quatrocentos. Preço especial para você!"),
    G("Você", "you", "Great! Can I pay ___ card?", "by", ["by", "on", "in", "at"], "Ótimo! Posso pagar com cartão?"),
    T("Vendedor", "Sorry, cash only.", "Desculpe, só dinheiro."),
    B("Tem um caixa eletrônico aqui perto?", "Is there an ATM near here?", ["are", "bank"]),
    T("Vendedor", "Yes, next to the 7-Eleven.", "Sim, ao lado da 7-Eleven."),
    N("Você volta com o dinheiro, paga com uma nota de 500 e recebe o troco. Mas espera… veio só 50 bahts. 🤔"),
    C("O troco deveria ser 100. O que você diz?", [
        O("Excuse me, I think the change is wrong. I gave you five hundred.", "good", "Perfeito: educado, claro e sem acusar ninguém.", pt="Com licença, acho que o troco está errado. Eu te dei quinhentos."),
        O("(Não dizer nada e ir embora)", "ok", "Tudo bem evitar confusão, mas você perdeu 50 bahts. Conferir o troco é um direito seu!", go="leave", lang="pt"),
    ]),
    T("Vendedor", "Oh, sorry! My mistake. Here is fifty more.", "Ah, desculpe! Erro meu. Aqui estão mais cinquenta."),
    EX("Conferindo o troco", "Frases úteis: \"I think the change is wrong\" (acho que o troco está errado) e \"I gave you…\" (eu te dei…). Com calma e sorriso, sempre funciona.", [("I gave you a thousand.", "Eu te dei mil.")]),
    GO("bye"),
  ],
  "leave": [
    N("Tudo bem! Da próxima vez, lembre: \"I think the change is wrong\" resolve isso num segundo."),
    GO("bye"),
  ],
  "bye": [
    B("Você pode colocar numa sacola, por favor?", "Can you put them in a bag, please?", ["it", "on"]),
    END("feirinha", "Final: sacola cheia", "Lembrancinhas compradas, desconto conquistado e troco conferido. A família no Brasil vai amar! 🐘🎁"),
  ],
  }, "Pechinchar com simpatia, pagar em dinheiro e conferir o troco."))

# ---------------------------------------------------------------- 7
ch.append(chapter("c7", "🚤", "Barco para as ilhas Phi Phi", "Phi Phi boat trip",
  {"sky": "sea", "items": [["🚤", "drive"], ["🐠", "swim"], ["🌊", "wave"]]},
  {
  "start": [
    N("O grande dia! Um barco rápido até as ilhas Phi Phi, com água cor de esmeralda e parada para mergulhar de snorkel. 🚤 O guia espera vocês no píer."),
    T("Guia", "Good morning! Voucher, please.", "Bom dia! O voucher, por favor."),
    G("Você", "you", "Good morning! Here it ___.", "is", ["is", "are", "am", "be"], "Bom dia! Aqui está."),
    T("Guia", "Thank you. Please take a life jacket. Everybody must wear one.", "Obrigado. Peguem um colete salva-vidas. Todo mundo precisa usar."),
    TIP("🪸", "Proteja o mar", "Nas ilhas Phi Phi é proibido tocar ou pisar nos corais, alimentar os peixes e jogar qualquer lixo no mar. As multas são altas!", dos=["Olhar sem tocar", "Usar protetor solar que não agride o mar"], donts=["Pisar nos corais", "Dar comida aos peixes", "Jogar lixo no mar"]),
    N("O barco acelera e o mar está agitado. Tchum! Tchum! Suas pernas balançam e o estômago começa a revirar… 🤢"),
    C("O que você faz?", [
        O("Excuse me, I feel seasick. Do you have anything for it?", "good", "Muito bem! Pedir ajuda cedo evita o pior.", pt="Com licença, estou enjoado. Você tem algo para isso?"),
        O("(Ficar quieto e aguentar)", "bad", "Ai, ai… vamos ver no que dá.", go="sick", lang="pt"),
    ]),
    T("Guia", "Yes, here is a pill. Look at the horizon and drink some water.", "Sim, aqui está um comprimido. Olhe para o horizonte e beba um pouco de água."),
    GO("snorkel"),
  ],
  "sick": [
    N("Cinco minutos depois… você precisa correr para a lateral do barco. 😵 O guia vem ajudar."),
    T("Guia", "Are you OK? Here, take this pill and look at the horizon.", "Você está bem? Aqui, tome este comprimido e olhe para o horizonte."),
    G("Você", "you", "Thank you. I feel ___ now.", "better", ["better", "good", "best", "well"], "Obrigado. Estou me sentindo melhor agora."),
    EX("Seasick", "\"Seasick\" é enjoo no mar; \"carsick\" é enjoo no carro; \"airsick\", no avião. E \"I feel better\" é \"estou melhor\".", [("I feel seasick.", "Estou enjoado (no mar)."), ("I feel better now.", "Estou melhor agora.")]),
    GO("snorkel"),
  ],
  "snorkel": [
    T("Guia", "We are here! Snorkeling time. Remember: don't touch the coral and don't feed the fish.", "Chegamos! Hora do snorkel. Lembrem: não toquem nos corais e não deem comida aos peixes."),
    G("Guia", "them", "Don't ___ the fish, please.", "feed", ["feed", "eat", "food", "give"], "Não alimentem os peixes, por favor."),
    N("Debaixo d'água é outro mundo: peixes-palhaço, peixes listrados, corais de todas as cores! 🐠🐟🐡"),
    C("Um peixe lindo nada na sua direção. O que você faz?", [
        O("Só observar e tirar uma foto de longe", "good", "Perfeito! Assim o mar continua lindo para os próximos visitantes.", lang="pt"),
        O("Oferecer um pedaço de biscoito", "bad", "Não pode! Comida humana faz mal aos peixes e desequilibra os corais.", go="cookie", lang="pt"),
    ]),
    GO("photo"),
  ],
  "cookie": [
    T("Guia", "No, no! Please, no food for the fish. It's bad for them.", "Não, não! Por favor, nada de comida para os peixes. Faz mal a eles."),
    Y("Oh, sorry! I didn't know.", "Ah, desculpe! Eu não sabia."),
    GO("photo"),
  ],
  "photo": [
    N("De volta ao barco, vocês param na famosa Maya Bay, a praia do filme \"A Praia\". O cenário é perfeito para uma foto."),
    B("Você poderia tirar uma foto nossa?", "Could you take a photo of us?", ["make", "we"]),
    T("Guia", "Of course! Say cheese!", "Claro! Digam \"xis\"!"),
    G("Você", "you", "What time do we go ___ to the hotel?", "back", ["back", "home", "return", "again"], "Que horas voltamos para o hotel?"),
    T("Guia", "At four o'clock.", "Às quatro horas."),
    END("ilhas", "Final: dia de esmeralda", "Peixes coloridos, praia de cinema e muito inglês na prática. Um dia para nunca esquecer! 🐠🏝️"),
  ],
  }, "Passeio de barco, enjoo no mar, snorkel e as regras para proteger os corais."))

# ---------------------------------------------------------------- 8
ch.append(chapter("c8", "💊", "Emergência: achar uma farmácia", "Finding a pharmacy",
  {"sky": "day", "items": [["🗺️", "bob"], ["💊", "pulse"], ["🧭", "spin"]]},
  {
  "start": [
    N("Passeando pelo centrinho de Phuket, alguém da família não está se sentindo bem. Nada grave, mas precisamos de uma farmácia. 💊 O que aconteceu?"),
    C("Escolha o problema:", [
        O("Queimadura de sol: o ombro está vermelho", "good", "Clássico de praia tropical! Vamos resolver.", go="sun", lang="pt"),
        O("Dor de barriga depois do jantar", "good", "Acontece com muitos viajantes. Vamos resolver.", go="stomach", lang="pt"),
    ]),
  ],
  "sun": [
    EX("Sunburn x sunscreen", "Cuidado para não trocar: \"sunburn\" é a queimadura de sol; \"sunscreen\" é o protetor solar.", [("I got a sunburn.", "Eu me queimei no sol."), ("Do you have sunscreen?", "Você tem protetor solar?")]),
    GO("ask"),
  ],
  "stomach": [
    EX("Dores em inglês", "Dor = \"ache\" junto com a parte do corpo: stomachache (dor de barriga), headache (dor de cabeça), toothache (dor de dente).", [("I have a stomachache.", "Estou com dor de barriga."), ("I have a headache.", "Estou com dor de cabeça.")]),
    GO("ask"),
  ],
  "ask": [
    TIP("✋", "Como chamar alguém na rua", "Para chamar a atenção de alguém, diga \"Excuse me\". Não aponte o dedo indicador para pessoas; para indicar algo, use a mão aberta. E para chamar alguém para perto, a palma fica virada para baixo.", dos=["Começar com Excuse me", "Apontar com a mão aberta"], donts=["Apontar o dedo para pessoas", "Estalar os dedos ou assobiar para chamar alguém"]),
    C("Você vê um senhor numa loja. Como começa?", [
        O("Excuse me, is there a pharmacy near here?", "good", "Perfeito: educado e direto.", pt="Com licença, tem uma farmácia aqui perto?"),
        O("Hey you! Pharmacy!", "bad", "Funciona em emergência, mas soa grosseiro. \"Excuse me\" abre portas!", pt="Ei, você! Farmácia!"),
    ]),
    T("Senhor", "Yes. Go straight, then turn left at the temple. The pharmacy is next to the bank.", "Sim. Siga em frente e vire à esquerda no templo. A farmácia fica ao lado do banco."),
    EX("Direções", "Go straight = siga em frente. Turn left = vire à esquerda. Turn right = vire à direita. Next to = ao lado de. Across from = em frente a (do outro lado).", [("Turn right at the corner.", "Vire à direita na esquina."), ("It's next to the bank.", "Fica ao lado do banco.")]),
    G("Você", "you", "So, go straight and turn ___ at the temple?", "left", ["left", "right", "back", "around"], "Então, seguir em frente e virar à esquerda no templo?"),
    T("Senhor", "Yes, that's right!", "Sim, isso mesmo!"),
    C("A farmácia chegou! O que você diz? (lembre do problema)", [
        O("I got a bad sunburn. Do you have aloe vera?", "good", "Isso! Babosa (aloe vera) alivia a queimadura.", go="pharmSun", pt="Eu me queimei muito no sol. Você tem babosa?"),
        O("I have a stomachache. Do you have something for it?", "good", "Isso! \"Something for it\" = algo para isso.", go="pharmStomach", pt="Estou com dor de barriga. Você tem algo para isso?"),
    ]),
  ],
  "pharmSun": [
    T("Farmacêutica", "Yes, this aloe vera gel is very good. Put it on three times a day.", "Sim, este gel de babosa é muito bom. Passe três vezes por dia."),
    G("Você", "you", "Thank you. And do you have ___? Ours is finished.", "sunscreen", ["sunscreen", "sunburn", "sunglasses", "sunset"], "Obrigado. E você tem protetor solar? O nosso acabou."),
    GO("numbers"),
  ],
  "pharmStomach": [
    T("Farmacêutica", "Yes. Take one pill after each meal, and drink a lot of water.", "Sim. Tome um comprimido depois de cada refeição e beba bastante água."),
    G("Você", "you", "One pill ___ each meal. Thank you!", "after", ["after", "before", "during", "without"], "Um comprimido depois de cada refeição. Obrigado!"),
    GO("numbers"),
  ],
  "numbers": [
    TIP("🚑", "Números de emergência na Tailândia", "Anote no celular: 1669 é a ambulância (emergência médica) e 1155 é a Polícia Turística, que fala inglês e ajuda turistas em qualquer situação.", dos=["Salvar 1669 e 1155 no celular", "Ter seguro-viagem"]),
    B("Nós precisamos de um médico.", "We need a doctor.", ["needs", "the"]),
    END("farmacia", "Final: problema resolvido", "Você pediu informação, entendeu as direções e explicou o problema na farmácia. Viajante preparado! 💪"),
  ],
  }, "Pedir direções, explicar o que sente na farmácia e números de emergência."))

# ---------------------------------------------------------------- 9
ch.append(chapter("c9", "🧳", "Check-out e táxi", "Check-out and taxi",
  {"sky": "day", "items": [["🧳", "bob"], ["🚕", "drive"], ["🏨", "float"]]},
  {
  "start": [
    N("Os dias em Phuket voaram! 🥲 Malas mais pesadas (culpa das lembrancinhas), pele bronzeada e hora de fazer o check-out."),
    Y("Good morning! We'd like to check out, please.", "Bom dia! Gostaríamos de fazer o check-out, por favor."),
    T("Recepcionista", "Good morning! Did you take anything from the minibar?", "Bom dia! Vocês consumiram algo do frigobar?"),
    C("Vocês tomaram duas águas e uma cerveja. O que diz?", [
        O("Yes, two waters and one beer.", "good", "Honestidade sempre! E você já aprendeu a contar as coisas em inglês.", pt="Sim, duas águas e uma cerveja."),
        O("No, nothing.", "bad", "Hum… a camareira confere o frigobar. Veja:", go="minibar", pt="Não, nada."),
    ]),
    GO("bill"),
  ],
  "minibar": [
    T("Recepcionista", "Housekeeping says two waters and one beer are missing.", "A arrumação disse que faltam duas águas e uma cerveja."),
    Y("Oh, sorry! I forgot. Yes, that's right.", "Ah, desculpe! Esqueci. Sim, é isso mesmo."),
    GO("bill"),
  ],
  "bill": [
    T("Recepcionista", "No problem. That's one hundred and eighty baht.", "Sem problema. São cento e oitenta bahts."),
    G("Você", "you", "Here you are. Can I have a ___, please?", "receipt", ["receipt", "recipe", "reception", "room"], "Aqui está. Pode me dar o recibo, por favor?"),
    EX("Receipt x recipe", "\"Receipt\" (ri-SIIT, o p é mudo!) é recibo ou nota fiscal. \"Recipe\" é receita de comida. Não confunda!", [("Can I have a receipt?", "Pode me dar um recibo?")]),
    TIP("💵", "Gorjeta para a camareira", "Gorjeta não é obrigatória na Tailândia, mas é muito apreciada. Deixar 20 a 50 bahts por dia no quarto para quem arruma é um gesto gentil.", dos=["Deixar o quarto organizado", "Gorjeta pequena para a arrumação"]),
    C("O voo é só às 18h. O que vocês fazem com as malas?", [
        O("Can we leave our bags here until three o'clock?", "good", "Ótimo! Quase todo hotel guarda as malas de graça.", go="storage", pt="Podemos deixar nossas malas aqui até as três horas?"),
        O("Can you call a taxi to the airport now, please?", "good", "Tudo bem ir cedo: aeroporto internacional pede antecedência.", go="taxi", pt="Você pode chamar um táxi para o aeroporto agora, por favor?"),
    ]),
  ],
  "storage": [
    T("Recepcionista", "Of course. Here is your ticket for the bags.", "Claro. Aqui está o seu tíquete das malas."),
    N("Vocês aproveitam a última manhã na praia. 🏖️ Às três, voltam para buscar as malas."),
    Y("Hi! Can we have our bags, please? Here is the ticket.", "Olá! Pode nos dar nossas malas, por favor? Aqui está o tíquete."),
    Y("And can you call a taxi to the airport, please?", "E você pode chamar um táxi para o aeroporto, por favor?"),
    GO("taxi"),
  ],
  "taxi": [
    T("Recepcionista", "Sure. The hotel taxi is six hundred baht, fixed price.", "Claro. O táxi do hotel custa seiscentos bahts, preço fixo."),
    C("O que você acha?", [
        O("OK, that's fine. Thank you.", "good", "Boa! Táxi de hotel com preço fixo é seguro e sem surpresas.", pt="OK, tudo bem. Obrigado."),
        O("Can he use the meter?", "ok", "Normalmente sim, mas táxi de hotel tem preço fixo, e isso é normal e seguro.", pt="Ele pode usar o taxímetro?"),
    ]),
    B("Quanto tempo leva até o aeroporto?", "How long does it take to the airport?", ["much", "is"]),
    T("Recepcionista", "About forty-five minutes. Thank you for staying with us!", "Uns quarenta e cinco minutos. Obrigado por ficarem conosco!"),
    G("Você", "you", "Thank you! We ___ everything.", "loved", ["loved", "love", "loving", "lovely"], "Obrigado! Nós amamos tudo."),
    END("checkout", "Final: despedida do paraíso", "Conta fechada, recibo na mão e táxi a caminho. Só falta o voo de volta! 🚕"),
  ],
  }, "Fechar a conta, frigobar, guardar malas e táxi para o aeroporto."))

# ---------------------------------------------------------------- 10
ch.append(chapter("c10", "🛫", "Voo de volta para casa", "Flight home",
  {"sky": "dusk", "items": [["🛫", "fly"], ["🧳", "bob"], ["🇧🇷", "float"]]},
  {
  "start": [
    N("Último capítulo! 🥹 No aeroporto de Phuket, vocês vão ao balcão da companhia aérea. A viagem de volta tem conexão, então é bom resolver tudo com calma."),
    T("Atendente", "Sawasdee {p}! Passports and tickets, please.", "Olá! Passaportes e passagens, por favor."),
    Y("Sawasdee {p}. Here they are.", "Olá. Aqui estão."),
    EX("Here it is x Here they are", "Uma coisa: \"Here it is\". Várias coisas: \"Here they are\". Para entregar qualquer coisa, \"Here you are\" sempre funciona.", [("Here are our passports.", "Aqui estão nossos passaportes.")]),
    T("Atendente", "Please put your bags on the scale. … Oh, this bag is three kilos overweight.", "Coloquem as malas na balança. … Ah, esta mala está três quilos acima do peso."),
    C("Culpa das lembrancinhas! O que você faz?", [
        O("Can I move some things to my carry-on?", "good", "Solução inteligente: passar coisas para a bagagem de mão.", pt="Posso passar algumas coisas para a bagagem de mão?"),
        O("How much is the extra fee?", "ok", "Vale saber o preço!", go="fee", pt="Quanto é a taxa extra?"),
        O("That's impossible! Your scale is wrong!", "bad", "Brigar com o atendente não muda a balança… 😅", go="argue", pt="Impossível! Sua balança está errada!"),
    ]),
    T("Atendente", "Of course. You can do it right here.", "Claro. Pode fazer aqui mesmo."),
    GO("seat"),
  ],
  "fee": [
    T("Atendente", "It's one thousand five hundred baht.", "São mil e quinhentos bahts."),
    C("E agora?", [
        O("Hmm, I'll move some things to my carry-on, then.", "good", "Economizou! Mil e quinhentos bahts ficam para o próximo passeio.", pt="Hmm, então vou passar algumas coisas para a bagagem de mão."),
        O("OK, I'll pay. Here is my card.", "ok", "Tudo bem, às vezes vale a pena pela praticidade.", pt="OK, vou pagar. Aqui está meu cartão."),
    ]),
    GO("seat"),
  ],
  "argue": [
    T("Atendente", "I'm sorry, the scale is correct. You can pay the fee or move some things.", "Sinto muito, a balança está certa. Você pode pagar a taxa ou tirar algumas coisas."),
    N("Lembra da \"Terra dos Sorrisos\"? Levantar a voz não funciona aqui. Respira e sorri. 😊", "oops"),
    Y("Sorry. I'll move some things to my carry-on.", "Desculpe. Vou passar algumas coisas para a bagagem de mão."),
    GO("seat"),
  ],
  "seat": [
    T("Atendente", "Would you like a window or an aisle seat?", "Vocês preferem assento na janela ou no corredor?"),
    C("Escolha o seu lugar:", [
        O("Window, please. We want to see Thailand one last time.", "good", "Que bonito! Uma última vista das ilhas lá de cima. 🌅", pt="Janela, por favor. Queremos ver a Tailândia uma última vez."),
        O("Aisle, please. It's easier to walk.", "good", "Escolha prática para um voo longo!", pt="Corredor, por favor. É mais fácil para caminhar."),
    ]),
    T("Atendente", "Here are your boarding passes. Boarding is at gate 4, at seven fifteen.", "Aqui estão os cartões de embarque. O embarque é no portão 4, às sete e quinze."),
    G("Você", "you", "Gate four at seven fifteen. And our bags go ___ to São Paulo?", "straight", ["straight", "right", "left", "back"], "Portão quatro às sete e quinze. E nossas malas vão direto para São Paulo?"),
    T("Atendente", "Yes, you pick them up in São Paulo. Have a safe flight!", "Sim, vocês pegam em São Paulo. Tenham um voo seguro!"),
    B("Tenham um voo seguro!", "Have a safe flight!", ["safety", "fly"]),
    N("Da janela do avião, as ilhas vão ficando pequenininhas. Vocês falaram inglês na imigração, no templo, no tuk-tuk, no mercado, no hotel, no barco e até na farmácia. Que orgulho! 🥹"),
    EX("Khob khun!", "Para se despedir da Tailândia, nada melhor que \"khob khun {p}\": obrigado(a) em tailandês. Pronuncia-se \"kóp kun\".", [("Khob khun {p}, Thailand!", "Obrigado(a), Tailândia!")]),
    END("volta", "Final: de volta para casa", "Parabéns! Vocês completaram a Aventura na Tailândia. 🇹🇭✈️🇧🇷 Agora é só repetir os capítulos para descobrir os outros caminhos… e planejar a próxima viagem!"),
  ],
  }, "Despachar as malas, excesso de peso, escolher o assento e a despedida."))

ISLANDS = {'c1': ['🛂', '✈️'], 'c2': ['🛕', '🙏'], 'c3': ['🛺', '🏙️'], 'c4': ['🏮', '🍜'], 'c5': ['🏝️', '🌴'], 'c6': ['🐘', '🛍️'], 'c7': ['🚤', '🐠'], 'c8': ['💊', '🧭'], 'c9': ['🧳', '🚕'], 'c10': ['🛫', '🇧🇷']}
for c in ch:
    c["island"] = ISLANDS[c["id"]]

trip = {
  "id": "thailand",
  "title": "Aventura na Tailândia",
  "titleEn": "Thailand Adventure",
  "emoji": "🇹🇭",
  "intro": "Bangkok, Phuket e as ilhas Phi Phi. Uma história narrada em que as suas escolhas mudam o caminho, com dicas culturais para viajar com respeito.",
  "chapters": ch,
}
root = os.path.join(os.path.dirname(__file__), "..", "data", "trips")
json.dump(trip, open(os.path.join(root, "thailand.json"), "w"), ensure_ascii=False, indent=1)
json.dump({"trips": [{"id": "thailand", "title": trip["title"], "emoji": trip["emoji"], "chapters": len(ch), "intro": trip["intro"]}]},
          open(os.path.join(root, "index.json"), "w"), ensure_ascii=False, indent=1)
for c in ch:
    kinds = {}
    for n in c["nodes"].values():
        kinds[n["type"]] = kinds.get(n["type"], 0) + 1
    print(c["id"], len(c["nodes"]), "nós,", len(c["endings"]), "finais", kinds)
