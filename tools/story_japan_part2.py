# Aventura no Japão — parte 2 (capítulos 5 a 8)
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from story_dsl import *

CH = []

# ---------------------------------------------------------------- 5
CH.append(chapter("c5", "🏮", "Izakaya em Shinjuku", "Izakaya in Shinjuku",
  {"sky": "night", "items": [["🏮", "sway"], ["🍢", "bob"], ["🍺", "pulse"]]},
  {
  "start": [
    N("Konbanwa, {name}! É o Professor Kiko 🎓🦜 falando de Shinjuku, à noite, com mil letreiros acesos. Hoje vocês vão a um izakaya: o boteco japonês, com petiscos, espetinhos e muita conversa. Bora?"),
    T("Garçom", "Welcome! How many people?", "Bem-vindos! Quantas pessoas?"),
    G("Você", "you", "___ people, please.", "Two", ["Two", "Too", "To", "Second"], "Duas pessoas, por favor."),
    TIP("🥢", "O otoshi", "Em muitos izakayas, chega um petisco pequeno logo no começo: é o \"otoshi\". Ele faz parte da taxa de mesa, que é cobrada por pessoa. Não é engano nem golpe: é o costume.",
        dos=["Aceitar e provar o otoshi", "Perguntar antes de entrar, se quiser saber se há taxa de mesa"],
        donts=["Achar que o garçom errou o pedido", "Reclamar da taxa na hora de pagar"]),
    C("Antes de pedir, chega um potinho com um petisco… que ninguém pediu. 🤔 O que você diz?", [
        O("Oh, thank you!", "good", "Isso! Agradecer e provar. O otoshi é uma pequena surpresa de boas-vindas.", pt="Ah, obrigado!"),
        O("Excuse me, we didn't order this!", "bad", "Hehe, calma! Veja a explicação do garçom.", go="otoshi", pt="Com licença, nós não pedimos isso!"),
    ]),
    GO("order"),
  ],
  "otoshi": [
    T("Garçom", "This is otoshi. It comes with the table charge.", "Isto é o otoshi. Ele vem com a taxa de mesa."),
    Y("Oh, I see. Thank you!", "Ah, entendi. Obrigado!"),
    GO("order"),
  ],
  "order": [
    EX("\"Sumimasen!\"", "O cardápio é um tablet na mesa, mas as fotos confundem? Chame alguém! No Japão, para chamar o garçom, você levanta a mão e diz \"Sumimasen!\" (com licença) em voz clara. Em inglês, \"Excuse me!\" também funciona. E, se não souber o nome do prato, é só apontar!",
       [("Excuse me!", "Com licença!"), ("This one, please.", "Este aqui, por favor."), ("Two of these, please.", "Dois destes, por favor.")]),
    C("Como você chama o garçom?", [
        O("Levantar a mão e dizer \"Sumimasen!\"", "good", "Perfeito! É exatamente assim que os japoneses fazem.", lang="pt"),
        O("Estalar os dedos e assobiar", "bad", "Nããão! Estalar os dedos ou assobiar é muito rude. Levante a mão e diga \"Sumimasen!\"", lang="pt"),
    ]),
    T("Garçom", "Are you ready to order?", "Vocês estão prontos para pedir?"),
    Y("Yes. Two beers and this one, please.", "Sim. Duas cervejas e este aqui, por favor."),
    T("Garçom", "Do you have any allergies?", "Vocês têm alguma alergia?"),
    C("{spousePtCap} tem alergia a camarão. O que você responde?", [
        O("Yes. My {spouse} is allergic to shrimp.", "good", "Muito bem! Avisar a alergia é essencial, e o garçom vai indicar outro prato.", go="allergy", pt="Sim. {spousePtCap} tem alergia a camarão."),
        O("No, no allergies!", "bad", "Hmm… e o camarão? Veja o que chega na mesa…", go="shrimp", pt="Não, nenhuma alergia!"),
    ]),
  ],
  "allergy": [
    T("Garçom", "OK. This dish has shrimp. I recommend the chicken skewers.", "OK. Este prato tem camarão. Eu recomendo os espetinhos de frango."),
    B("Eu tenho alergia a camarão.", "I am allergic to shrimp.", ["have", "fish"]),
    GO("pay"),
  ],
  "shrimp": [
    N("Chega um tempurá lindo… de camarão! {spousePtCap} arregala os olhos. 🍤😱", "oops"),
    Y("Sorry, my {spouse} is allergic to shrimp. Can we change this?", "Desculpe, {spousePt} tem alergia a camarão. Podemos trocar?"),
    T("Garçom", "Of course. Sorry! How about chicken skewers?", "Claro. Desculpe! Que tal espetinhos de frango?"),
    B("Eu tenho alergia a camarão.", "I am allergic to shrimp.", ["have", "fish"]),
    GO("pay"),
  ],
  "pay": [
    N("Espetinhos, cerveja gelada e um brinde: \"Kanpai!\" 🍻 Hora da conta."),
    Y("Excuse me! Can we have the check, please?", "Com licença! Pode trazer a conta, por favor?"),
    T("Garçom", "Please take this paper and pay at the register.", "Por favor, levem este papel e paguem no caixa."),
    G("Você", "you", "Can we pay ___?", "separately", ["separately", "separate", "apart", "alone"], "Podemos pagar separado?"),
    T("Garçom", "Sorry, one check per table, please.", "Desculpe, uma conta por mesa, por favor."),
    EX("Pagar no caixa", "Em muitos restaurantes japoneses, você leva o papelzinho da conta até o caixa, perto da saída. Dividir a conta nem sempre é possível: paguem juntos e acertem entre vocês depois.",
       [("Can we pay by card?", "Podemos pagar com cartão?"), ("Here you are.", "Aqui está.")]),
    C("Conta paga! E a gorjeta?", [
        O("Agradecer e sair sem deixar gorjeta", "good", "Isso! No Japão não se dá gorjeta. Um \"Arigatou gozaimasu\" já vale ouro.", lang="pt"),
        O("Deixar umas moedas na mesa", "bad", "Hehe, gentil… mas veja o que acontece!", go="tip", lang="pt"),
    ]),
    END("kanpai", "Final: kanpai!", "Otoshi provado, alergia avisada e conta paga no caixa. Vocês viraram frequentadores de izakaya! 🏮"),
  ],
  "tip": [
    T("Garçom", "Excuse me! You forgot your money!", "Com licença! Vocês esqueceram o dinheiro!"),
    N("O garçom correu atrás de vocês na rua para devolver as moedas! 😂 No Japão, gorjeta não faz parte da cultura, e o bom serviço já está incluído.", "oops"),
    END("moedas", "Final: as moedas voltaram", "Lição do dia: no Japão, não se deixa gorjeta. Um sorriso e um obrigado bastam. 🙇"),
  ],
  }, "Otoshi, \"Sumimasen!\", alergias, conta no caixa e nada de gorjeta."))

# ---------------------------------------------------------------- 6
CH.append(chapter("c6", "🛍️", "Compras em Akihabara e Harajuku", "Shopping in Akihabara and Harajuku",
  {"sky": "day", "items": [["🛍️", "bob"], ["🎮", "pulse"], ["🍓", "float"]]},
  {
  "start": [
    N("Dia de compras! De manhã, Akihabara: o bairro dos eletrônicos, games e animes. À tarde, Harajuku: moda jovem, cores e doces. Prepara a mala… e o cartão! 🛍️"),
    N("Numa loja de eletrônicos gigante, você encontra uma câmera ótima para filmar as crianças."),
    T("Vendedor", "Hello! Can I help you?", "Olá! Posso ajudar?"),
    Y("Yes, please. How much is this camera?", "Sim, por favor. Quanto custa esta câmera?"),
    T("Vendedor", "It is on sale today. Are you a tourist? You can shop tax-free.", "Está em promoção hoje. Você é turista? Pode comprar sem imposto."),
    TIP("🛂", "Compras tax-free", "Turistas podem comprar sem o imposto de consumo em lojas com o aviso \"Tax-Free\", acima de um valor mínimo. Para isso, é preciso mostrar o passaporte original. Essas regras mudam de tempos em tempos: confira as regras atuais antes da viagem.",
        dos=["Levar o passaporte original nas compras", "Perguntar: \"Is this tax-free?\"", "Guardar os recibos"],
        donts=["Levar só uma foto do passaporte", "Abrir ou usar produtos lacrados antes de sair do Japão"]),
    C("O passaporte ficou no hotel… mas você tem uma foto no celular. O que faz?", [
        O("Sorry, I don't have my passport. I will come back later.", "good", "Honesto e prático! Sem o passaporte original, não tem tax-free.", pt="Desculpe, não estou com o passaporte. Volto mais tarde."),
        O("Can I show a photo of my passport?", "ok", "Boa tentativa! Mas a maioria das lojas precisa do passaporte original. Veja:", go="photo", pt="Posso mostrar uma foto do meu passaporte?"),
    ]),
    GO("harajuku"),
  ],
  "photo": [
    T("Vendedor", "Sorry, we need the real passport.", "Desculpe, precisamos do passaporte original."),
    N("Pois é: foto não vale. Vocês voltam ao hotel, pegam o passaporte… e aproveitam para descansar os pés. 😅", "oops"),
    B("Esta compra é livre de impostos?", "Is this purchase tax free?", ["price", "money"]),
    GO("harajuku"),
  ],
  "harajuku": [
    N("À tarde, Harajuku! {spousePtCap} amou uma camiseta, mas o tamanho parece pequeno."),
    EX("Tamanhos no Japão", "As roupas japonesas costumam ser menores que as brasileiras: um M de lá pode ser um P daqui. Sempre peça para provar!",
       [("Can I try this on?", "Posso experimentar?"), ("Do you have a bigger size?", "Vocês têm um tamanho maior?"), ("It's too small.", "Está pequeno demais.")]),
    G("{spousePtCap}", "them", "Do you have a ___ size?", "bigger", ["bigger", "big", "more", "tall"], "Vocês têm um tamanho maior?"),
    T("Vendedora", "Yes, here is a large. The fitting room is over there.", "Sim, aqui está um G. O provador fica ali."),
    N("Na rua, vocês encontram uma parede cheia de máquinas de brinquedo em cápsula! Gira a manivela, cai uma bolinha com uma surpresa. 🎁"),
    EX("Moedas no Japão", "Essas máquinas de cápsula aceitam só moedas. E muitas lojinhas pequenas ainda preferem dinheiro. Leve sempre algumas moedas e notas, além do cartão. No caixa, coloque o dinheiro na bandejinha, e não na mão da pessoa.",
       [("Do you take cards?", "Vocês aceitam cartão?"), ("Cash only?", "Só dinheiro?"), ("Where can I get change?", "Onde posso trocar dinheiro por moedas?")]),
    N("E para fechar, o famoso crepe de Harajuku: morango, chantilly e sorvete. 🍓 Vocês pedem um."),
    T("Atendente", "Here you are! Please eat it here.", "Aqui está! Por favor, coma aqui."),
    C("O que vocês fazem com o crepe?", [
        O("Comer ali perto da barraca", "good", "Isso! No Japão, comer andando pela rua não é bem-visto. Comam perto da barraca e joguem o papel no lixo de lá.", go="crepe", lang="pt"),
        O("Sair andando e comendo pela rua", "bad", "Hmm… a rua está lotada e não tem lixeira. Veja o que acontece!", go="walk", lang="pt"),
    ]),
  ],
  "crepe": [
    Y("Thank you! It's delicious!", "Obrigado! Está delicioso!"),
    B("Onde fica a lixeira, por favor?", "Where is the trash can please?", ["bin", "garbage"]),
    END("crepe", "Final: crepe com etiqueta", "Câmera escolhida, camiseta no tamanho certo e crepe comido do jeito japonês. Que dia! 🍓"),
  ],
  "walk": [
    N("No meio da multidão, o sorvete escorre na camiseta nova de {spousePt}… e vocês ficam com o papel melado na mão, sem lixeira à vista. 🍦😂", "oops"),
    TIP("🗑️", "Coma no lugar e leve o lixo", "No Japão, quase não há lixeiras nas ruas. O costume é comer perto de onde comprou, e usar o lixo do próprio lugar, ou levar o lixo com você até o hotel.",
        dos=["Comer perto da barraca", "Levar um saquinho para o lixo"], donts=["Comer andando na multidão", "Deixar lixo em qualquer canto"]),
    B("Onde fica a lixeira, por favor?", "Where is the trash can please?", ["bin", "garbage"]),
    END("melado", "Final: crepe na camiseta", "Camiseta lavada no hotel e lição aprendida: crepe se come parado, perto da barraca! 🍓"),
  ],
  }, "Tax-free com passaporte, tamanhos, máquinas de cápsula, moedas e o crepe de Harajuku."))

# ---------------------------------------------------------------- 7
CH.append(chapter("c7", "♨️", "Hakone: ryokan e onsen", "Hakone: ryokan and hot spring",
  {"sky": "dusk", "items": [["🗻", "pulse"], ["♨️", "float"], ["🌲", "sway"]]},
  {
  "start": [
    N("Saímos da agitação de Tóquio para as montanhas de Hakone! 🗻 Em dias limpos, dá para ver o Monte Fuji daqui. Hoje vocês dormem num ryokan, a pousada tradicional japonesa, com banho termal: o onsen."),
    N("Da janela do ônibus, as nuvens se abrem… e lá está ele, o Fuji, com o topo branquinho. {spousePtCap} fica sem palavras. Dica do Kiko: o Fuji é tímido e vive escondido nas nuvens, então aproveite quando ele aparecer!"),
    T("Recepcionista", "Welcome! Please take off your shoes here.", "Bem-vindos! Por favor, tirem os sapatos aqui."),
    TIP("🥿", "Sapatos e chinelos", "No ryokan, você tira os sapatos na entrada e usa os chinelos da casa. Mas atenção: no tatame (o piso de palha dos quartos), só se pisa de meia ou descalço!",
        dos=["Deixar os sapatos na entrada", "Tirar os chinelos antes de pisar no tatame"],
        donts=["Andar de sapato dentro do ryokan", "Pisar no tatame de chinelo"]),
    Y("Hello! We have a reservation under the name {name}.", "Olá! Temos uma reserva no nome de {name}."),
    T("Recepcionista", "Thank you. Dinner is at six or seven. Which time do you prefer?", "Obrigado. O jantar é às seis ou às sete. Que horário vocês preferem?"),
    G("Você", "you", "Seven o'clock, ___.", "please", ["please", "thanks", "sorry", "welcome"], "Às sete horas, por favor."),
    T("Recepcionista", "There is a yukata in your room. You can wear it at dinner and in the onsen area.", "Há um yukata no seu quarto. Vocês podem usá-lo no jantar e na área do onsen."),
    EX("O yukata", "O yukata é um roupão de algodão, tipo um quimono leve. Regra de ouro: o lado esquerdo sempre vai por cima do direito. O contrário é usado só em funerais!",
       [("How do I wear this?", "Como eu visto isto?"), ("Is this correct?", "Assim está certo?")]),
    N("Yukata vestido, é hora do onsen! Mas antes, uma pergunta importante…"),
    C("Você tem uma tatuagem no braço. O que faz?", [
        O("Excuse me. I have a tattoo. Can I use the onsen?", "good", "Excelente! Muitos onsens proíbem tatuagens, e perguntar antes evita constrangimento.", go="tattoo", pt="Com licença. Eu tenho uma tatuagem. Posso usar o onsen?"),
        O("Não tenho tatuagem, vou direto ao banho", "good", "Tudo certo! Então vamos conhecer as regras do banho.", go="bath", lang="pt"),
    ]),
  ],
  "tattoo": [
    T("Recepcionista", "Sorry, not in the big bath. But you can use our private bath.", "Desculpe, no banho grande não. Mas vocês podem usar o nosso banho privativo."),
    N("Banho privativo só para o casal! Às vezes, perguntar abre portas ainda melhores. 😉"),
    B("Posso usar o banho privativo agora?", "Can I use the private bath now?", ["big", "later"]),
    GO("bath"),
  ],
  "bath": [
    TIP("♨️", "As regras do onsen", "No onsen, todo mundo entra sem roupa, separado por sexo (exceto nos banhos privativos). Primeiro você se lava sentado no banquinho do chuveiro, e só depois entra na água quente.",
        dos=["Lavar o corpo todo antes de entrar", "Prender o cabelo comprido", "Deixar a toalhinha na cabeça ou na borda"],
        donts=["Entrar de roupa de banho", "Colocar a toalha dentro da água", "Nadar ou mergulhar a cabeça"]),
    C("Você entrou na área do banho. Qual é o primeiro passo?", [
        O("Sentar no banquinho e se lavar no chuveiro", "good", "Perfeito! Corpo limpo antes da água quente. Você parece um japonês! 🧼", lang="pt"),
        O("Pular direto na água com a toalha", "bad", "Splash! 😱 Veja o que acontece…", go="splash", lang="pt"),
    ]),
    GO("dinner"),
  ],
  "splash": [
    N("Um senhor japonês olha para você com cara de susto e aponta para o chuveiro e para a toalha na água. Ops! 😅", "oops"),
    T("Senhor", "Excuse me. Please wash first. And no towel in the water.", "Com licença. Por favor, lave-se primeiro. E nada de toalha na água."),
    Y("Oh, I'm so sorry! Thank you for telling me.", "Ah, me desculpe! Obrigado por me avisar."),
    GO("dinner"),
  ],
  "dinner": [
    N("Depois do banho, o jantar: vários pratinhos lindos, servidos no quarto ou num salão. Antes de comer, diga \"Itadakimasu\", o jeito japonês de agradecer pela comida. 🍱"),
    T("Funcionária", "While you eat, we will prepare your futon.", "Enquanto vocês comem, vamos preparar o seu futon."),
    Y("Thank you. Everything is beautiful!", "Obrigado. Está tudo lindo!"),
    END("futon", "Final: noite no futon", "Fuji avistado, onsen com etiqueta e sono gostoso no futon, direto no tatame. Hakone é paz pura! ♨️"),
  ],
  }, "Monte Fuji, ryokan, yukata, regras do onsen, tatuagens e o futon."))

# ---------------------------------------------------------------- 8
CH.append(chapter("c8", "🚄", "Trem-bala para Kyoto", "Bullet train to Kyoto",
  {"sky": "day", "items": [["🚄", "drive"], ["🗻", "pulse"], ["🍱", "bob"]]},
  {
  "start": [
    N("Hoje vocês pegam o famoso trem-bala, o shinkansen, rumo a Kyoto! 🚄 Ele passa dos 280 km/h e é conhecido pela pontualidade. Primeiro: comprar a passagem com assento reservado."),
    T("Atendente", "Hello. Where are you going?", "Olá. Para onde vocês vão?"),
    Y("Two reserved seats to Kyoto, please.", "Dois assentos reservados para Kyoto, por favor."),
    T("Atendente", "Window or aisle?", "Janela ou corredor?"),
    EX("Window e aisle", "\"Window seat\" é o assento na janela, e \"aisle seat\" é o do corredor. Dica do Kiko: indo de Tóquio para Kyoto, peça o lado direito do trem. Com céu limpo, dá para ver o Monte Fuji!",
       [("A window seat, please.", "Um assento na janela, por favor."), ("Can we sit together?", "Podemos sentar juntos?")]),
    G("Você", "you", "Can we sit ___, please?", "together", ["together", "alone", "near", "with"], "Podemos sentar juntos, por favor?"),
    T("Atendente", "Do you have big suitcases?", "Vocês têm malas grandes?"),
    TIP("🧳", "Malas grandes no trem-bala", "Em algumas linhas do shinkansen, malas muito grandes precisam de um assento especial reservado, com espaço para bagagem. As regras podem mudar: sempre avise no guichê e confira antes.",
        dos=["Avisar que tem mala grande ao comprar a passagem", "Enviar malas grandes de hotel para hotel, um serviço comum no Japão"],
        donts=["Embarcar com malão sem reserva", "Bloquear o corredor com a bagagem"]),
    C("Vocês têm duas malas enormes. O que você diz?", [
        O("Yes, we have two big suitcases.", "good", "Muito bem! O atendente reserva os assentos com espaço para as malas.", pt="Sim, temos duas malas grandes."),
        O("No, just small bags.", "bad", "Hmm… e aquelas duas malas gigantes? Veja o que acontece na plataforma.", go="bags", pt="Não, só bolsas pequenas."),
    ]),
    GO("platform"),
  ],
  "bags": [
    N("Na plataforma, o funcionário vê as malas enormes e vem conversar com vocês. 😬", "oops"),
    T("Funcionário", "Excuse me. These bags are very big. You need a special seat.", "Com licença. Estas malas são muito grandes. Vocês precisam de um assento especial."),
    Y("Oh, sorry! Where can I change my ticket?", "Ah, desculpe! Onde posso trocar a minha passagem?"),
    T("Funcionário", "At the ticket office. Don't worry, there is another train soon.", "No guichê. Não se preocupe, logo tem outro trem."),
    GO("platform"),
  ],
  "platform": [
    N("Na plataforma, o número de cada vagão está pintado no chão, e as pessoas fazem fila bem certinha. Vocês estão no vagão 7."),
    B("Onde fica a fila do vagão sete?", "Where is the line for car seven?", ["wait", "train"]),
    N("Antes de embarcar, vocês compram um ekiben: a marmita de estação, bonita e caprichada. 🍱 Comer no trem-bala é permitido e faz parte da diversão!"),
    N("O trem chega, e uma equipe de limpeza entra, arruma tudo em poucos minutos e ainda faz uma reverência na saída. Os bancos até giram para ficar de frente para o destino! 🙇"),
    N("Viagem começou. Tudo em silêncio… até que o celular de {spousePt} toca bem alto. 📱"),
    C("O que {spousePt} deve fazer?", [
        O("Ir até o espaço entre os vagões para atender", "good", "Isso! No trem japonês, ligações são feitas no espaço entre os vagões, e o celular fica no silencioso.", lang="pt"),
        O("Atender ali mesmo e falar alto", "bad", "Todo mundo olha em silêncio… 😳 No Japão, falar ao telefone dentro do vagão é falta de educação. Vá para o espaço entre os vagões!", lang="pt"),
    ]),
    N("Na hora de reclinar o banco, uma gentileza: peça licença a quem está atrás. Em japonês, um simples \"Sumimasen\" já ajuda."),
    Y("Excuse me, is it OK if I recline my seat?", "Com licença, tudo bem se eu reclinar o meu banco?"),
    T("Passageiro", "Sure, no problem.", "Claro, sem problema."),
    C("O trem chega a Kyoto exatamente no horário. O que você faz antes de descer?", [
        O("Recolher o lixo do ekiben e levar com você", "good", "Perfeito! Deixar o lugar limpo é parte da educação japonesa.", go="arrive", lang="pt"),
        O("Deixar a marmita vazia no banco", "bad", "Ih… a equipe de limpeza limpa, mas o costume é levar o seu lixo. Veja:", go="trash", lang="pt"),
    ]),
  ],
  "arrive": [
    Y("Wow, we arrived right on time!", "Uau, chegamos bem na hora!"),
    END("pontual", "Final: pontual como o shinkansen", "Assento reservado, silêncio no vagão e lixo recolhido. Kyoto, aí vamos nós! ⛩️"),
  ],
  "trash": [
    N("Um passageiro vê a marmita no banco e aponta gentilmente para as lixeiras perto da porta. 😅", "oops"),
    Y("Oh, sorry! Where is the trash can?", "Ah, desculpe! Onde fica a lixeira?"),
    T("Passageiro", "Near the door, between the cars.", "Perto da porta, entre os vagões."),
    END("lixo", "Final: lixo no lugar certo", "Chegaram a Kyoto no horário e aprenderam: no Japão, cada um leva o seu lixo. 🚄"),
  ],
  }, "Assento reservado, malas grandes, ekiben, silêncio no vagão e chegada pontual."))

ISLANDS = {'c5': ['🏮', '🍢'], 'c6': ['🛍️', '🎮'], 'c7': ['♨️', '🗻'], 'c8': ['🚄', '🍱']}
for c in CH: c["island"] = ISLANDS[c["id"]]
