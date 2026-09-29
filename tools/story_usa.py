# Aventura em Orlando (EUA) — história ramificada. Gera data/trips/usa.json
# Rodar na pasta do projeto:  python3 tools/story_usa.py
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from story_dsl import *

ch = []

# ---------------------------------------------------------------- 1
ch.append(chapter("c1", "🛂", "Imigração em Orlando", "Immigration",
  {"sky": "day", "items": [["✈️", "fly"], ["🦅", "fly"], ["🛂", "pulse"]]},
  {
  "start": [
    N("Hello, {name}! Aqui é o Professor Kiko 🎓🦜 de novo, agora rumo aos Estados Unidos! Vocês acabaram de pousar no aeroporto de Orlando, na Flórida: a terra dos parques temáticos. Mas antes da diversão, vem a imigração americana, que é bem séria. Deixa comigo que eu te preparo."),
    TIP("🇺🇸", "A imigração americana", "O oficial da imigração dos EUA é chamado de CBP officer. Ele faz perguntas curtas e diretas, e espera respostas curtas e verdadeiras. Não precisa falar difícil: frases simples funcionam melhor.",
        dos=["Responder só o que foi perguntado", "Ter reserva do hotel e passagem de volta à mão", "Tirar o boné e os óculos escuros no balcão"],
        donts=["Fazer piadas", "Falar demais ou inventar respostas", "Usar o celular na fila"]),
    N("Chegou a sua vez. O oficial chama com a mão: \"Next!\""),
    T("Oficial", "Good afternoon. How are you doing today?", "Boa tarde. Como vai você hoje?"),
    EX("How are you doing?", "Nos EUA, \"How are you doing?\" é só um cumprimento, como o nosso \"tudo bem?\". Ninguém quer ouvir a sua vida inteira! Responda curto e devolva a pergunta.",
       [("I'm good, thanks. How are you?", "Estou bem, obrigado. E você?"), ("Pretty good, thank you!", "Muito bem, obrigado!")]),
    C("Como você responde?", [
        O("I'm good, thank you. How are you?", "good", "Perfeito! Curto, educado e natural.", pt="Estou bem, obrigado. E você?"),
        O("Very tired. The flight was terrible and the food was cold…", "ok", "Hahaha, sincero! Mas ele só queria um \"I'm good\". Na imigração, quanto mais curto, melhor.", pt="Muito cansado. O voo foi terrível e a comida estava fria…"),
    ]),
    T("Oficial", "What's the purpose of your trip?", "Qual é o motivo da sua viagem?"),
    G("Você", "you", "We are here on ___.", "vacation", ["vacation", "business", "work", "school"], "Estamos aqui de férias."),
    T("Oficial", "How long are you staying?", "Quanto tempo vocês vão ficar?"),
    C("Vocês ficam duas semanas. O que você diz?", [
        O("Two weeks. We go back on the twentieth.", "good", "Isso! Tempo exato e a data de volta. O oficial adora respostas precisas.", pt="Duas semanas. Voltamos no dia vinte."),
        O("Maybe forever! Just kidding!", "bad", "Nãooo! \"Forever\" (para sempre) é a pior palavra possível aqui. Veja o que acontece…", go="forever", pt="Talvez para sempre! Brincadeira!"),
    ]),
    GO("hotel"),
  ],
  "forever": [
    T("Oficial", "Forever? That's not funny. Please step aside.", "Para sempre? Isso não tem graça. Por favor, aguarde ao lado."),
    N("Ops! Agora vocês vão para a salinha da \"secondary inspection\", uma entrevista extra. Não é o fim do mundo, mas custa uma hora de espera. 😬", "oops"),
    TIP("⚠️", "Nunca brinque com a imigração", "Nos EUA, qualquer brincadeira sobre ficar no país, trabalhar ilegalmente, armas ou bombas é levada a sério e pode acabar em entrevista longa ou até em entrada negada.", donts=["Brincar com \"ficar para sempre\"", "Brincar com bombas, armas ou drogas"]),
    T("Oficial 2", "Why did you say forever?", "Por que você disse para sempre?"),
    Y("I'm sorry, it was a bad joke. We are here on vacation for two weeks.", "Desculpe, foi uma piada ruim. Estamos aqui de férias por duas semanas."),
    T("Oficial 2", "Show me your return ticket, please.", "Me mostre a passagem de volta, por favor."),
    G("Você", "you", "Here is our return ___.", "ticket", ["ticket", "bill", "money", "key"], "Aqui está a nossa passagem de volta."),
    T("Oficial 2", "OK. No more jokes, please. You can go.", "OK. Sem mais piadas, por favor. Podem ir."),
    GO("hotel"),
  ],
  "hotel": [
    T("Oficial", "Where are you staying?", "Onde vocês vão se hospedar?"),
    B("Estamos hospedados num hotel perto dos parques.", "We're staying at a hotel near the parks.", ["in", "far"]),
    T("Oficial", "Who is traveling with you?", "Quem está viajando com você?"),
    G("Você", "you", "My ___ and our kids.", "{spouse}", ["{spouse}", "boss", "teacher", "friend"], "{spousePtCap} e nossos filhos."),
    T("Oficial", "Are you bringing any food, fruit or meat?", "Vocês estão trazendo comida, frutas ou carne?"),
    N("Hmm… lá na mala tem um pacote de pão de queijo congelado e uma goiabada que a sua mãe mandou. 🧀"),
    C("O que você responde?", [
        O("Yes, we have some cheese bread and guava paste.", "good", "Honestidade sempre! Declarar comida não dá problema: no máximo eles jogam fora.", go="declare", pt="Sim, temos pão de queijo e goiabada."),
        O("No, nothing.", "bad", "Hmm… vamos ver se os cachorros concordam. 🐶", go="beagle", pt="Não, nada."),
    ]),
  ],
  "declare": [
    T("Oficial", "Thank you for declaring. Go to the agriculture line, please.", "Obrigado por declarar. Vá para a fila da agricultura, por favor."),
    T("Fiscal", "Cheese bread and guava paste are OK. Welcome to the United States!", "Pão de queijo e goiabada estão liberados. Bem-vindos aos Estados Unidos!"),
    B("Muito obrigado. Tenha um ótimo dia!", "Thank you so much. Have a great day!", ["very", "night"]),
    END("declarou", "Final: tudo declarado", "Honestidade venceu! O pão de queijo passou, e Orlando espera por vocês. 🧀🇺🇸"),
  ],
  "beagle": [
    N("Na saída, um beagle simpático com colete verde cheira a sua mala… e senta do lado dela. 🐶 É o sinal!", "oops"),
    T("Fiscal", "Do you have any food in this bag?", "Você tem alguma comida nesta mala?"),
    G("Você", "you", "Oh, yes! Sorry, I ___. It's cheese bread.", "forgot", ["forgot", "forget", "forgotten", "remember"], "Ah, sim! Desculpe, eu esqueci. É pão de queijo."),
    T("Fiscal", "Next time, declare it. This is a warning. Have a nice trip.", "Da próxima vez, declare. Isto é uma advertência. Boa viagem."),
    EX("Declare", "Nos EUA, não declarar comida pode dar multa alta. Na dúvida, diga \"Yes, I have food\" e deixe o fiscal decidir.", [("I have some food to declare.", "Tenho comida para declarar.")]),
    END("aviso", "Final: levou uma advertência", "Ufa, só uma advertência! Lição aprendida: sempre declare a comida. 🐶"),
  ],
  }, "\"How are you doing?\", perguntas da imigração e o beagle farejador."))

# ---------------------------------------------------------------- 2
ch.append(chapter("c2", "🚗", "Carro alugado", "Car rental",
  {"sky": "day", "items": [["🚗", "drive"], ["🌴", "sway"], ["☀️", "spin"]]},
  {
  "start": [
    N("Em Orlando, quase todo mundo aluga carro: os parques são longe um do outro. Vocês vão até o balcão da locadora, o \"rental car counter\"."),
    T("Atendente", "Hi there! Do you have a reservation?", "Olá! Vocês têm reserva?"),
    Y("Yes, it's under the name {name}.", "Sim, está no nome de {name}."),
    EX("Under the name", "Para dizer em nome de quem está a reserva, use \"under the name\". Serve para hotel, restaurante e locadora.", [("A table under the name Silva.", "Uma mesa no nome de Silva.")]),
    T("Atendente", "Would you like to add full insurance? It's twenty-five dollars a day.", "Querem adicionar o seguro completo? São vinte e cinco dólares por dia."),
    C("O seguro do seu cartão já cobre. O que você diz?", [
        O("No, thank you. My credit card covers it.", "good", "Boa! Você sabia dos seus direitos e disse não com educação.", pt="Não, obrigado. Meu cartão de crédito cobre."),
        O("Yes, please. I want to be safe.", "good", "Também é uma escolha válida: tranquilidade para dirigir num país novo.", pt="Sim, por favor. Quero ficar tranquilo."),
        O("What? I don't understand. OK, yes, yes.", "bad", "Cuidado com o \"yes\" sem entender! Peça para repetir: \"Can you say that again, please?\"", pt="O quê? Não entendi. OK, sim, sim."),
    ]),
    T("Atendente", "The car has a full tank. Please return it full.", "O carro está com o tanque cheio. Por favor, devolvam cheio."),
    G("Você", "you", "OK, we will return it ___.", "full", ["full", "empty", "half", "fast"], "OK, vamos devolver cheio."),
    TIP("🚦", "Dirigir nos EUA", "Na Flórida, você pode virar à direita no sinal vermelho, depois de parar totalmente, se não houver placa \"No turn on red\". A velocidade é em milhas por hora (mph): 65 mph são uns 105 km/h.",
        dos=["Parar completamente na placa STOP", "Parar quando o ônibus escolar amarelo abrir a plaquinha de STOP"],
        donts=["Ultrapassar ônibus escolar parado", "Achar que 65 é km/h"]),
    N("Carro na mão! O GPS pergunta: pegar a estrada com pedágio (toll road), que é mais rápida, ou evitar pedágios?"),
    C("Qual caminho?", [
        O("Pegar a toll road", "good", "Rápido e prático! A maioria dos carros alugados já tem o pedágio automático.", go="toll", lang="pt"),
        O("Evitar pedágio e ir pelas ruas", "ok", "Mais demorado… mas tem surpresas no caminho!", go="drive", lang="pt"),
    ]),
  ],
  "toll": [
    N("Na toll road, o carro passa direto pela cabine: o SunPass cobra sozinho. Mas o ponteiro da gasolina… já está baixando? Hmm, melhor saber onde abastecer depois."),
    B("Onde fica o posto de gasolina mais próximo?", "Where is the nearest gas station?", ["far", "petrol"]),
    EX("Gas, não petrol", "Nos EUA, gasolina é \"gas\" e posto é \"gas station\". \"Petrol\" é inglês britânico.", [("We need gas.", "Precisamos de gasolina.")]),
    END("pedagio", "Final: pela toll road", "Chegaram rapidinho ao hotel. A estrada americana é enorme, mas você já está se virando! 🛣️"),
  ],
  "drive": [
    N("Pelas ruas, a fome aperta e vocês passam por um drive-thru. Lá, você fala com uma caixinha de som! 🍟"),
    T("Atendente (caixa de som)", "Welcome! What can I get for you?", "Bem-vindos! O que vai ser?"),
    EX("Can I get…?", "Nos EUA, o jeito natural de pedir é \"Can I get…?\" (Pode me ver…?). Soa educado e é o que todo mundo usa.", [("Can I get a number two, please?", "Pode me ver um número dois, por favor?"), ("Can I get a large Coke?", "Pode me ver uma Coca grande?")]),
    G("Você", "you", "Can I ___ two burgers and fries, please?", "get", ["get", "give", "take", "make"], "Pode me ver dois hambúrgueres e batata frita, por favor?"),
    T("Atendente (caixa de som)", "Anything else?", "Mais alguma coisa?"),
    Y("That's all, thank you.", "É só isso, obrigado."),
    T("Atendente (caixa de som)", "Pull up to the next window, please.", "Siga até a próxima janela, por favor."),
    END("drive-thru", "Final: drive-thru", "Hambúrguer na mão e inglês funcionando até pela caixinha de som! 🍔"),
  ],
  }, "Seguro, tanque cheio, regras de trânsito e o primeiro drive-thru."))

# ---------------------------------------------------------------- 3
ch.append(chapter("c3", "🏨", "Check-in no hotel", "Hotel check-in",
  {"sky": "dusk", "items": [["🏨", "bob"], ["🌴", "sway"], ["🛎️", "pulse"]]},
  {
  "start": [
    N("Chegamos ao hotel! Palmeiras, piscina e aquele ar-condicionado gelado. Vamos fazer o check-in."),
    T("Recepcionista", "Welcome! Checking in?", "Bem-vindos! Check-in?"),
    Y("Yes, please. We have a reservation for five nights.", "Sim, por favor. Temos uma reserva para cinco noites."),
    T("Recepcionista", "Perfect. There is a resort fee of thirty dollars per night.", "Perfeito. Há uma taxa de resort de trinta dólares por noite."),
    EX("Tax not included", "Nos EUA, os preços quase nunca incluem imposto. E muitos hotéis cobram uma \"resort fee\" à parte. Sempre pergunte o valor final.", [("Is tax included?", "O imposto está incluído?"), ("What is the total?", "Qual é o total?")]),
    C("Você não sabia dessa taxa. O que faz?", [
        O("Oh, I didn't know. What does the resort fee include?", "good", "Ótima pergunta! Entender antes de reclamar é o jeito certo.", pt="Ah, eu não sabia. O que a taxa inclui?"),
        O("That's a robbery! I won't pay!", "bad", "Calma! Gritar não resolve. Veja:", go="angry", pt="Isso é um roubo! Não vou pagar!"),
    ]),
    GO("fee"),
  ],
  "angry": [
    T("Recepcionista", "I understand you're upset. The fee is in your reservation.", "Entendo que você esteja chateado. A taxa está na sua reserva."),
    N("Ela mostra a reserva… e a taxa estava lá, em letrinhas miúdas. 😅", "oops"),
    Y("Oh, I see. Sorry. What does it include?", "Ah, entendi. Desculpe. O que ela inclui?"),
    GO("fee"),
  ],
  "fee": [
    T("Recepcionista", "It includes Wi-Fi, parking and the shuttle to the parks.", "Inclui Wi-Fi, estacionamento e o transporte até os parques."),
    T("Recepcionista", "Would you like two queen beds or one king bed?", "Vocês preferem duas camas queen ou uma cama king?"),
    C("Vocês estão com as crianças. Qual quarto?", [
        O("Two queen beds, please.", "good", "Espaço para todo mundo! Queen é a cama de casal comum; king é a bem grandona.", pt="Duas camas queen, por favor."),
        O("One king bed, please. The kids sleep with us.", "good", "Aconchegante! Mas cuidado com os pés das crianças de madrugada. 😂", pt="Uma cama king, por favor. As crianças dormem com a gente."),
    ]),
    T("Recepcionista", "Your room is on the first floor, room 112.", "O seu quarto fica no primeiro andar, quarto 112."),
    TIP("🏢", "First floor = térreo", "Nos EUA, \"first floor\" é o térreo! O nosso primeiro andar é o \"second floor\" deles. E não existe \"ground floor\" no inglês americano do dia a dia.", dos=["First floor = térreo", "Second floor = nosso 1º andar"]),
    T("Recepcionista", "Breakfast is from seven to ten.", "O café da manhã é das sete às dez."),
    G("Você", "you", "Is ___ included?", "breakfast", ["breakfast", "lunch", "dinner", "dessert"], "O café da manhã está incluído?"),
    T("Recepcionista", "Yes, it's free for hotel guests.", "Sim, é grátis para hóspedes."),
    B("Onde podemos estacionar o carro?", "Where can we park the car?", ["stop", "garage"]),
    T("Recepcionista", "The parking lot is behind the building. Enjoy your stay!", "O estacionamento fica atrás do prédio. Aproveitem a estadia!"),
    END("hotel", "Final: chave na mão", "Quarto 112 no térreo, piscina lá fora e café incluído. Hora de descansar para o parque! 🏊"),
  ],
  }, "Taxas escondidas, tipos de cama e o \"first floor\" americano."))

# ---------------------------------------------------------------- 4
ch.append(chapter("c4", "🍔", "Restaurante e gorjeta", "Restaurant and tipping",
  {"sky": "night", "items": [["🍔", "bob"], ["🥤", "float"], ["🍟", "wave"]]},
  {
  "start": [
    N("Noite de restaurante americano! Nos EUA, você não escolhe a mesa sozinho: espera na entrada pela recepcionista, a \"hostess\"."),
    T("Hostess", "Hi! How many?", "Oi! Quantas pessoas?"),
    G("Você", "you", "A table for ___, please.", "four", ["four", "for", "fourth", "forty"], "Uma mesa para quatro, por favor."),
    T("Garçom", "Hi guys, I'm Jake and I'll be your server tonight. Can I get you something to drink?", "Oi pessoal, eu sou o Jake e vou atender vocês hoje. Posso trazer algo para beber?"),
    EX("O garçom se apresenta", "Nos EUA, o garçom (server) diz o nome e cuida da sua mesa a noite toda. E um detalhe ótimo: água com gelo é de graça e o refrigerante costuma ter refil!", [("Can we have some water, please?", "Pode nos trazer água, por favor?"), ("Free refill", "Refil grátis")]),
    Y("Just water for now, please.", "Só água por enquanto, por favor."),
    N("O cardápio chega… e os pratos são ENORMES. Um prato americano alimenta duas pessoas brasileiras fácil. 😂"),
    C("O que vocês fazem?", [
        O("Can we share one dish?", "good", "Esperto! Dividir é normal nos EUA. Às vezes cobram uma pequena \"sharing fee\".", pt="Podemos dividir um prato?"),
        O("Pedir um prato para cada um", "ok", "Vale! Mas prepare-se para levar sobras para o hotel.", go="big", lang="pt"),
    ]),
    GO("steak"),
  ],
  "big": [
    N("Chegam quatro pratos gigantes. Vocês comem, comem… e ainda sobra metade! 🥩"),
    B("Pode me dar uma embalagem para isso?", "Can I get a box for this?", ["bag", "take"]),
    EX("To-go box", "Levar a sobra para casa é super normal nos EUA. Peça \"a box\" ou \"a to-go box\".", [("Can I get a to-go box?", "Pode me dar uma embalagem para viagem?")]),
    GO("steak"),
  ],
  "steak": [
    T("Garçom", "How would you like your steak?", "Como você quer o ponto da carne?"),
    G("Você", "you", "___, please.", "Medium", ["Medium", "Middle", "Half", "Normal"], "Ao ponto, por favor."),
    EX("Pontos da carne", "Rare = malpassado, medium = ao ponto, well done = bem passado.", [("Medium rare, please.", "Ao ponto para mal, por favor."), ("Well done, please.", "Bem passado, por favor.")]),
    N("Jantar delicioso! Agora, a parte que confunde todo brasileiro: a conta."),
    Y("Can we get the check, please?", "Pode nos trazer a conta, por favor?"),
    EX("Check ou bill?", "Nos EUA, a conta do restaurante é \"the check\". \"Bill\" também se entende, mas \"check\" é o mais americano.", [("Can we get the check?", "Pode trazer a conta?")]),
    TIP("💵", "A gorjeta (tip)", "Nos EUA, a gorjeta não é opcional na prática: o salário do garçom depende dela. O normal é 18% a 20% do valor antes do imposto. Muitas maquininhas já mostram as opções.",
        dos=["Deixar 18–20% em restaurantes com garçom", "Conferir se a gorjeta já veio incluída (\"gratuity included\")"],
        donts=["Não deixar nada: é visto como muito rude"]),
    C("A conta deu 80 dólares. Quanto de gorjeta?", [
        O("Deixar 16 dólares (20%)", "good", "Perfeito! Jake sorri de orelha a orelha. 😄", lang="pt"),
        O("Deixar 5 dólares", "ok", "Pouquinho… ele não vai reclamar, mas fica abaixo do normal.", lang="pt"),
        O("Não deixar gorjeta", "bad", "Ih… veja o que acontece.", go="notip", lang="pt"),
    ]),
    GO("bye"),
  ],
  "notip": [
    T("Garçom", "Excuse me, was everything OK with the service?", "Com licença, estava tudo bem com o atendimento?"),
    N("Ele achou que vocês não gostaram! Nos EUA, gorjeta zero é um recado de serviço péssimo.", "oops"),
    Y("Oh, sorry! Everything was great. I didn't know about the tip.", "Ah, desculpe! Estava tudo ótimo. Eu não sabia da gorjeta."),
    GO("bye"),
  ],
  "bye": [
    T("Garçom", "Thank you guys! Have a great night!", "Obrigado, pessoal! Tenham uma ótima noite!"),
    END("jantar", "Final: jantar americano", "Mesa pedida, carne no ponto e gorjeta entendida. Você jantou como um local! 🍔"),
  ],
  }, "Mesa para quatro, o server, porções gigantes, ponto da carne e gorjeta."))

# ---------------------------------------------------------------- 5
ch.append(chapter("c5", "🎢", "Parque temático", "Theme park",
  {"sky": "day", "items": [["🎢", "bob"], ["🎡", "spin"], ["🎈", "float"]]},
  {
  "start": [
    N("O grande dia! Parque temático, castelo, montanha-russa e muita fila. Nos EUA, fila é \"line\", e todo brinquedo mostra o tempo de espera."),
    T("Funcionário", "The wait time is sixty minutes.", "O tempo de espera é de sessenta minutos."),
    EX("Wait time e line", "\"Wait time\" é o tempo de espera. \"Line\" é a fila. \"Stand in line\" é ficar na fila.", [("How long is the line?", "Quanto tempo de fila?"), ("Where does the line start?", "Onde começa a fila?")]),
    TIP("📏", "Altura em polegadas", "A altura mínima dos brinquedos vem em inches (polegadas). 40 inches são cerca de 1 metro. A equipe mede as crianças na entrada.", dos=["1 inch = 2,5 cm", "40 inches ≈ 1 metro"]),
    C("Qual brinquedo primeiro?", [
        O("A montanha-russa radical", "good", "Coragem! Lá vamos nós! 🎢", go="coaster", lang="pt"),
        O("O brinquedo das crianças", "good", "Boa! Diversão para toda a família. 🧸", go="kids", lang="pt"),
    ]),
  ],
  "coaster": [
    T("Funcionário", "How many in your party?", "Quantas pessoas no seu grupo?"),
    Y("Two, please.", "Duas, por favor."),
    N("AAAAAAH! 🎢 A montanha-russa é incrível. Na saída, aparece a foto de vocês gritando na telinha…"),
    G("Você", "you", "How ___ is the photo?", "much", ["much", "many", "long", "old"], "Quanto custa a foto?"),
    T("Funcionário", "It's twenty dollars, or free with the photo pass.", "São vinte dólares, ou grátis com o passe de fotos."),
    GO("lost"),
  ],
  "kids": [
    T("Funcionário", "She needs to be at least forty inches tall. Let me measure her.", "Ela precisa ter pelo menos quarenta polegadas. Deixe-me medir."),
    Y("OK, thank you!", "OK, obrigado!"),
    T("Funcionário", "Perfect, she can ride! Have fun!", "Perfeito, ela pode ir! Divirtam-se!"),
    GO("lost"),
  ],
  "lost": [
    N("Na saída do brinquedo, no meio da multidão… cadê a sua filha de sete anos? 😱 Ela sumiu por um instante!", "oops"),
    TIP("🧒", "Criança perdida no parque", "Nos parques, a equipe (\"cast members\" ou \"team members\") é treinada para isso. Procure alguém de uniforme e diga que a criança se perdeu. Dica de ouro: antes de entrar, tire uma foto dos seus filhos com a roupa do dia.",
        dos=["Procurar um funcionário de uniforme", "Descrever idade e roupa"], donts=["Sair correndo sozinho pelo parque"]),
    C("O que você faz?", [
        O("Procurar um funcionário imediatamente", "good", "Isso! É o jeito mais rápido.", go="staff", lang="pt"),
        O("Sair correndo gritando o nome dela", "bad", "O desespero é natural… mas o parque é gigante.", go="run", lang="pt"),
    ]),
  ],
  "run": [
    N("Você corre, corre… e o parque é enorme demais. Ofegante, você finalmente para um funcionário.", "oops"),
    GO("staff"),
  ],
  "staff": [
    Y("Excuse me! I can't find my daughter!", "Com licença! Não consigo encontrar minha filha!"),
    T("Funcionário", "Don't worry, we'll help you. How old is she and what is she wearing?", "Não se preocupe, vamos ajudar. Quantos anos ela tem e o que está vestindo?"),
    B("Ela tem sete anos e está usando uma camiseta rosa.", "She is seven and she is wearing a pink T-shirt.", ["has", "red"]),
    EX("Ter X anos", "Em inglês, idade usa o verbo \"to be\": \"She is seven\", nunca \"She has seven\".", [("I am thirty years old.", "Eu tenho trinta anos."), ("He is five.", "Ele tem cinco anos.")]),
    T("Funcionário", "We found her! She's at the lost children center, eating ice cream.", "Encontramos! Ela está na central de crianças perdidas, tomando sorvete."),
    END("parque", "Final: reencontro com sorvete", "Que susto! Mas você explicou tudo em inglês e a equipe achou a pequena em minutos. 🍦💚"),
  ],
  }, "Filas, altura em polegadas, foto da montanha-russa e a criança perdida."))

# ---------------------------------------------------------------- 6
ch.append(chapter("c6", "🛍️", "Compras no outlet", "Outlet shopping",
  {"sky": "day", "items": [["🛍️", "bob"], ["👟", "wave"], ["🏷️", "sway"]]},
  {
  "start": [
    N("Nenhuma viagem a Orlando está completa sem o outlet! 🛍️ Lojas e mais lojas com desconto. Assim que vocês entram, uma vendedora aparece."),
    T("Vendedora", "Hi! Can I help you find anything?", "Oi! Posso ajudar a encontrar algo?"),
    C("Você só quer olhar. O que diz?", [
        O("I'm just looking, thank you.", "good", "Perfeito! É a frase mágica para olhar em paz.", pt="Só estou olhando, obrigado."),
        O("No.", "ok", "Funciona, mas soa seco. Acrescente \"thank you\" e um sorriso!", pt="Não."),
    ]),
    N("Você acha um tênis lindo. Mas o número… nos EUA é diferente!"),
    TIP("👟", "Tamanhos americanos", "Nos EUA, o tênis 40 brasileiro é mais ou menos o 8 (feminino 9). Roupa vem em S, M, L e XL, e costuma ser maior que a nossa. Sempre experimente!", dos=["Experimentar antes de comprar", "Perguntar \"What size is this?\""]),
    G("Você", "you", "Can I ___ this on?", "try", ["try", "put", "test", "wear"], "Posso experimentar?"),
    T("Vendedora", "Sure! The fitting room is over there.", "Claro! O provador fica ali."),
    T("Vendedora", "These are on sale. Forty-nine ninety-nine.", "Estes estão em promoção. Quarenta e nove e noventa e nove."),
    EX("Como se falam os preços", "Os americanos leem o preço em duas partes: $49.99 é \"forty-nine ninety-nine\". E $10.50 é \"ten fifty\".", [("It's twenty-nine ninety-nine.", "Custa 29,99."), ("That's fifteen fifty.", "Dá 15,50.")]),
    N("No caixa, o total aparece: 53 dólares e 49 centavos. Mas a etiqueta dizia 49,99!"),
    C("O que você faz?", [
        O("Is that with tax?", "good", "Exatamente! É o imposto sobre vendas, somado só no caixa.", pt="Isso é com imposto?"),
        O("You made a mistake!", "bad", "Calma, não foi erro… veja.", go="mistake", pt="Vocês erraram!"),
    ]),
    GO("pay"),
  ],
  "mistake": [
    T("Caixa", "No mistake, it's the sales tax. Seven percent here in Florida.", "Não é erro, é o imposto sobre vendas. Sete por cento aqui na Flórida."),
    N("Ah! Nos EUA, o imposto não vem na etiqueta: ele aparece só no caixa. 😅", "oops"),
    Y("Oh, I see. Sorry!", "Ah, entendi. Desculpe!"),
    GO("pay"),
  ],
  "pay": [
    T("Caixa", "Yes, it includes sales tax.", "Sim, inclui o imposto sobre vendas."),
    B("Qual é a política de devolução?", "What is the return policy?", ["back", "rule"]),
    T("Caixa", "You can return it within thirty days with the receipt.", "Pode devolver em até trinta dias com o recibo."),
    T("Caixa", "How would you like to pay?", "Como você quer pagar?"),
    G("Você", "you", "I'll pay ___ credit card.", "with", ["with", "in", "by the", "on"], "Vou pagar com cartão de crédito."),
    END("outlet", "Final: sacolas cheias", "Tênis novo, preço entendido e imposto sem susto. Compras de mestre! 👟"),
  ],
  }, "\"Just looking\", tamanhos, preços em duas partes e o imposto no caixa."))

# ---------------------------------------------------------------- 7
ch.append(chapter("c7", "💊", "Farmácia e mercado", "Pharmacy and supermarket",
  {"sky": "day", "items": [["💊", "pulse"], ["🛒", "drive"], ["🥛", "bob"]]},
  {
  "start": [
    N("Depois de tanto sol, a cabeça dói e a criança está com o nariz escorrendo. Hora de ir a uma drugstore, a farmácia americana, que também vende de tudo: salgadinho, brinquedo, protetor solar…"),
    TIP("💊", "Remédio sem receita", "Nos EUA, remédios simples (dor de cabeça, alergia, resfriado) são \"over-the-counter\": você mesmo pega na prateleira. Os de receita ficam no balcão da \"pharmacy\", no fundo da loja.", dos=["Perguntar ao farmacêutico, é grátis", "Ler a dose para crianças na caixa"], donts=["Dar remédio de adulto para criança"]),
    Y("Excuse me, where can I find medicine for headaches?", "Com licença, onde encontro remédio para dor de cabeça?"),
    T("Atendente", "It's in aisle five.", "Fica no corredor cinco."),
    EX("Aisle", "\"Aisle\" é o corredor da loja ou do avião. O \"s\" é mudo: fala-se \"ail\".", [("Which aisle?", "Qual corredor?"), ("Aisle seven, on the left.", "Corredor sete, à esquerda.")]),
    T("Farmacêutico", "Take one pill every six hours.", "Tome um comprimido a cada seis horas."),
    G("Você", "you", "One pill ___ six hours. Got it.", "every", ["every", "each of", "all", "in"], "Um comprimido a cada seis horas. Entendi."),
    B("Isto é seguro para crianças?", "Is this safe for children?", ["safety", "kid"]),
    T("Farmacêutico", "Yes, this one is for kids. Check the dose by age.", "Sim, este é infantil. Confira a dose pela idade."),
    N("Resolvido! Agora, uma passadinha no supermercado para o café da manhã do dia seguinte."),
    C("O que vocês procuram primeiro?", [
        O("Leite", "good", "Clássico! Mas o leite americano é vendido de um jeito curioso…", go="milk", lang="pt"),
        O("Pão de queijo", "ok", "Hahaha, saudade de casa! Vamos tentar…", go="cheese", lang="pt"),
    ]),
  ],
  "milk": [
    N("O leite vem em galões enormes! 🥛 Um \"gallon\" tem quase 4 litros."),
    EX("Gallon", "1 gallon ≈ 3,8 litros. Também existe \"half gallon\" (≈ 1,9 L). \"Whole milk\" é o integral, \"skim milk\" é o desnatado.", [("A half gallon of whole milk, please.", "Meio galão de leite integral, por favor.")]),
    GO("pay"),
  ],
  "cheese": [
    Y("Excuse me, do you have Brazilian cheese bread?", "Com licença, vocês têm pão de queijo brasileiro?"),
    T("Funcionário", "Hmm, check the frozen section, aisle twelve.", "Hmm, veja na seção de congelados, corredor doze."),
    N("E não é que tinha?! Em Orlando, com tanto brasileiro, até pão de queijo aparece. 🧀"),
    GO("pay"),
  ],
  "pay": [
    T("Caixa", "Paper or plastic?", "Sacola de papel ou de plástico?"),
    Y("Paper, please.", "Papel, por favor."),
    G("Caixa", "them", "Do you want the ___?", "receipt", ["receipt", "recipe", "receive", "ticket"], "Você quer o recibo?"),
    EX("Receipt x recipe", "Cuidado: \"receipt\" (risíd) é recibo; \"recipe\" é receita de bolo! E receita médica é \"prescription\".", [("Can I have the receipt?", "Pode me dar o recibo?")]),
    END("farmacia", "Final: remédio e compras", "Dor de cabeça resolvida e café da manhã garantido. Você já se vira em qualquer loja! 🛒"),
  ],
  }, "Remédio sem receita, corredores, dose, galões de leite e o recibo."))

# ---------------------------------------------------------------- 8
ch.append(chapter("c8", "⛈️", "Tempestade e emergência", "Storm and emergency",
  {"sky": "night", "items": [["⛈️", "bob"], ["⚡", "pulse"], ["🚨", "spin"]]},
  {
  "start": [
    N("A Flórida é famosa pelas tempestades de verão: céu azul de manhã e, às quatro da tarde, trovões! ⛈️ Vocês estão na piscina do hotel quando o salva-vidas apita."),
    T("Salva-vidas", "Everybody out of the pool! There's lightning in the area.", "Todos para fora da piscina! Há raios na região."),
    TIP("⚡", "Raios na Flórida", "A Flórida é a capital dos raios nos EUA. Quando ouvir trovão, saia da água e procure um lugar coberto. E guarde: o número de emergência nos EUA é 911, para polícia, bombeiros e ambulância.", dos=["Sair da piscina ao primeiro trovão", "Emergência: ligar 911"], donts=["Ficar debaixo de árvores"]),
    C("O que você faz?", [
        O("Sair da piscina na hora com as crianças", "good", "Isso! Segurança em primeiro lugar.", lang="pt"),
        O("Só mais um mergulho…", "bad", "Nada disso! O salva-vidas não brinca.", go="pool", lang="pt"),
    ]),
    GO("slip"),
  ],
  "pool": [
    T("Salva-vidas", "Hey! Get out of the water now, please!", "Saia da água agora, por favor!"),
    N("Todo mundo olhando… 😳 Melhor obedecer.", "oops"),
    Y("Sorry! We're coming out.", "Desculpe! Já estamos saindo."),
    GO("slip"),
  ],
  "slip": [
    N("Correndo para se proteger, {spousePt} escorrega no chão molhado e torce o tornozelo! 😣", "oops"),
    C("O tornozelo inchou. O que vocês fazem?", [
        O("Ir a uma urgent care", "good", "Ótima escolha! Urgent care é uma clínica para casos que não são graves: mais rápida e mais barata que o hospital.", go="urgent", lang="pt"),
        O("Ligar para o 911", "ok", "O 911 é para emergências graves… mas vamos ver como é.", go="call", lang="pt"),
    ]),
  ],
  "call": [
    T("Atendente 911", "911, what's your emergency?", "911, qual é a sua emergência?"),
    EX("O que dizer no 911", "Fale três coisas: o que aconteceu, onde você está e se a pessoa está consciente. Fale devagar e responda às perguntas.", [("We are at the Palm Hotel, room 112.", "Estamos no Palm Hotel, quarto 112."), ("She is awake and breathing.", "Ela está acordada e respirando.")]),
    G("Você", "you", "My {spouse} hurt ___ ankle.", "{herPt}", ["{herPt}", "your", "our", "its"], "{spousePtCap} machucou o tornozelo."),
    T("Atendente 911", "Is it serious? Can {sheLow} walk?", "É grave? Consegue andar?"),
    Y("Yes, a little. It's not very serious.", "Sim, um pouco. Não é muito grave."),
    T("Atendente 911", "Then I recommend an urgent care. There's one two miles from your hotel.", "Então recomendo uma urgent care. Há uma a duas milhas do seu hotel."),
    GO("urgent"),
  ],
  "urgent": [
    T("Recepcionista", "Hi, what brings you in today?", "Oi, o que traz vocês aqui hoje?"),
    B("{ElaPt} escorregou e torceu o tornozelo.", "{She} slipped and twisted {herPt} ankle.", ["fell", "foot"]),
    T("Recepcionista", "Do you have health insurance?", "Vocês têm seguro-saúde?"),
    C("E o seguro viagem?", [
        O("Yes, we have travel insurance. Here is the card.", "good", "Perfeito! Seguro viagem é indispensável nos EUA: a saúde lá é caríssima.", pt="Sim, temos seguro viagem. Aqui está o cartão."),
        O("No, we don't have insurance.", "bad", "Ai, ai… veja o preço.", go="noins", pt="Não, não temos seguro."),
    ]),
    GO("doctor"),
  ],
  "noins": [
    T("Recepcionista", "OK. The visit is two hundred and fifty dollars, plus the X-ray.", "OK. A consulta é duzentos e cinquenta dólares, mais o raio-X."),
    TIP("🏥", "Saúde nos EUA é cara", "Nos EUA não existe SUS: uma ida ao hospital pode custar milhares de dólares. Nunca viaje para lá sem seguro viagem.", dos=["Contratar seguro viagem antes de ir"]),
    Y("OK… We will pay.", "OK… Vamos pagar."),
    GO("doctor"),
  ],
  "doctor": [
    T("Médico", "Good news: it's not broken. Just rest and ice for two days.", "Boa notícia: não quebrou. Só repouso e gelo por dois dias."),
    Y("Thank you, doctor!", "Obrigado, doutor!"),
    END("emergencia", "Final: só um susto", "Tempestade, escorregão e consulta, tudo resolvido em inglês. Você é um viajante preparado! 🩹"),
  ],
  }, "Raios na piscina, 911, urgent care e o seguro viagem."))

# ---------------------------------------------------------------- 9
ch.append(chapter("c9", "⛽", "Posto de gasolina", "Gas station",
  {"sky": "dusk", "items": [["⛽", "pulse"], ["🚗", "drive"], ["🌵", "sway"]]},
  {
  "start": [
    N("Dia de devolver o carro… com o tanque cheio, lembra? Nos EUA, quase todo posto é self-service: você mesmo abastece. ⛽"),
    N("Você passa o cartão na bomba e ela pede: \"Enter ZIP code\". Hmm…"),
    EX("ZIP code", "O ZIP code é o CEP americano. Cartões estrangeiros não têm ZIP, então a bomba costuma recusar. A saída é pagar lá dentro, no caixa.", [("My card needs a ZIP code.", "Meu cartão pede um CEP.")]),
    C("O que você faz?", [
        O("Entrar e pagar no caixa", "good", "Isso! É o que os estrangeiros fazem.", go="inside", lang="pt"),
        O("Digitar 00000 e ver no que dá", "bad", "Hmm… vamos ver.", go="zeros", lang="pt"),
    ]),
  ],
  "zeros": [
    N("\"Card declined.\" Cartão recusado. 😅 Não tem jeito: é lá para dentro.", "oops"),
    GO("inside"),
  ],
  "inside": [
    T("Caixa", "Hi, how can I help you?", "Oi, como posso ajudar?"),
    G("Você", "you", "Pump number four, ___ dollars, please.", "forty", ["forty", "fourteen", "four", "fourty"], "Bomba número quatro, quarenta dólares, por favor."),
    EX("Forty ou fourteen?", "Cuidado com a pronúncia: forty (40) tem a força no começo, FÓR-ti. Fourteen (14) tem a força no fim, for-TÍIN. E \"forty\" não tem \"u\"!", [("Forty dollars.", "Quarenta dólares."), ("Fourteen dollars.", "Catorze dólares.")]),
    EX("Gallons e regular", "A gasolina é vendida em galões (≈ 3,8 L). A comum é \"regular\"; a aditivada é \"premium\". Carro alugado usa regular.", [("Regular, please.", "Comum, por favor.")]),
    N("Você abastece, mas o tanque encheu com só 32 dólares. Sobrou crédito! Volte ao caixa."),
    C("O que você diz?", [
        O("Hi, I paid forty but it was only thirty-two. Can I get my change?", "good", "Perfeito! \"Change\" é o troco.", pt="Oi, paguei quarenta mas deu só trinta e dois. Pode me dar o troco?"),
        O("Deixar pra lá", "ok", "Oito dólares são oito dólares! Da próxima vez, peça o troco: é normal.", lang="pt"),
    ]),
    N("Antes de pegar a estrada, as crianças precisam ir ao banheiro. 🚻"),
    B("Onde fica o banheiro?", "Where is the restroom?", ["bathroom", "toilet"]),
    EX("Restroom", "Em lugares públicos, os americanos dizem \"restroom\". Em casa é \"bathroom\". \"Toilet\" é o vaso sanitário e soa estranho para pedir banheiro.", [("Where is the restroom, please?", "Onde fica o banheiro, por favor?")]),
    T("Caixa", "It's in the back, on the right.", "Fica nos fundos, à direita."),
    END("posto", "Final: tanque cheio", "Tanque cheio, troco no bolso e banheiro encontrado. Pronto para devolver o carro! ⛽"),
  ],
  }, "ZIP code, pagar no caixa, forty x fourteen, troco e restroom."))

# ---------------------------------------------------------------- 10
ch.append(chapter("c10", "🛫", "Devolução do carro e voo", "Car return and flight",
  {"sky": "sea", "items": [["🛫", "fly"], ["🧳", "bob"], ["🇧🇷", "wave"]]},
  {
  "start": [
    N("Último dia. 🥲 Vocês devolvem o carro na locadora do aeroporto. Um funcionário dá a volta no carro com um tablet… e para numa porta."),
    T("Funcionário", "There's a scratch on this door.", "Há um arranhão nesta porta."),
    C("O arranhão já estava lá quando vocês pegaram. O que você faz?", [
        O("It was already there. I have a photo from the first day.", "good", "Genial! Fotografar o carro na retirada é a dica de ouro.", pt="Já estava aí. Tenho uma foto do primeiro dia."),
        O("It wasn't me!", "ok", "Pode até ser verdade… mas sem prova fica difícil. Sempre fotografe o carro na retirada!", pt="Não fui eu!"),
    ]),
    T("Funcionário", "OK, no problem. You're all set!", "OK, sem problema. Está tudo certo!"),
    EX("You're all set", "\"You're all set\" quer dizer \"está tudo pronto, pode ir\". Você vai ouvir em hotel, loja, locadora, aeroporto…", [("You're all set. Have a good one!", "Tudo certo. Tenha um bom dia!")]),
    N("No balcão da companhia aérea, hora de despachar as malas."),
    T("Atendente", "Can I see your passports, please?", "Posso ver os passaportes, por favor?"),
    G("Você", "you", "Here are our ___.", "passports", ["passports", "passport", "passes", "papers"], "Aqui estão nossos passaportes."),
    T("Atendente", "This bag is fifty-five pounds. The limit is fifty.", "Esta mala tem cinquenta e cinco libras. O limite é cinquenta."),
    EX("Pounds", "Nos EUA, peso é em libras (pounds, lbs). 50 pounds ≈ 23 kg, o limite comum da mala despachada.", [("It's fifty pounds.", "Tem cinquenta libras (≈ 23 kg).")]),
    C("A mala está pesada. O que fazer?", [
        O("Can I move some things to my carry-on?", "good", "Esperto! Tirar umas coisas para a bagagem de mão resolve sem pagar nada.", pt="Posso passar algumas coisas para a bagagem de mão?"),
        O("How much is the fee?", "ok", "Dá para pagar, mas costuma ser caro: uns cem dólares.", pt="Quanto é a taxa?"),
    ]),
    TIP("🛃", "Segurança (TSA)", "Na segurança do aeroporto americano (TSA), você tira sapatos, casaco e cinto, e coloca notebook e líquidos em bandejas separadas. Líquidos só em frascos de até 100 ml (3.4 oz).", dos=["Esvaziar a garrafa de água antes", "Notebook fora da mochila"], donts=["Levar garrafa cheia", "Fazer piada com bomba"]),
    T("Agente TSA", "Laptops out of the bag, please. Any liquids?", "Notebooks fora da mochila, por favor. Algum líquido?"),
    C("Você tem uma garrafa de água cheia na mochila.", [
        O("Just this water bottle. I'll throw it away.", "good", "Isso! Depois é só encher de novo na área de embarque.", pt="Só esta garrafa de água. Vou jogar fora."),
        O("No liquids.", "bad", "Esqueceu da garrafa? O raio-X não esquece…", go="bottle", pt="Nenhum líquido."),
    ]),
    GO("bye"),
  ],
  "bottle": [
    T("Agente TSA", "Is this your bag? There's a water bottle inside.", "Esta mochila é sua? Tem uma garrafa de água dentro."),
    N("A mochila foi para a revista manual. 🙈 Mais dez minutos de fila.", "oops"),
    Y("Oh, sorry! I forgot. You can throw it away.", "Ah, desculpe! Esqueci. Pode jogar fora."),
    GO("bye"),
  ],
  "bye": [
    T("Agente TSA", "You're good to go. Have a nice flight!", "Pode seguir. Bom voo!"),
    B("Tenha um ótimo dia!", "Have a great day!", ["night", "good"]),
    N("No avião, Orlando vai ficando pequenininha lá embaixo. Imigração, drive-thru, restaurante, parque, outlet, farmácia, tempestade… vocês viveram tudo isso em inglês! 🥹"),
    EX("Despedidas americanas", "Os americanos se despedem com carinho: \"Take care!\" (se cuida!), \"See you!\" e \"Have a good one!\".", [("Take care!", "Se cuida!"), ("Bye, Orlando!", "Tchau, Orlando!")]),
    END("volta", "Final: de volta para casa", "Parabéns! Vocês completaram a Aventura em Orlando. 🇺🇸✈️🇧🇷 Repita os capítulos para descobrir os outros caminhos!"),
  ],
  }, "Arranhão no carro, malas em libras, TSA e a despedida."))

ISLANDS = {'c1': ['🛂', '🦅'], 'c2': ['🚗', '🛣️'], 'c3': ['🏨', '🌴'], 'c4': ['🍔', '🥤'], 'c5': ['🎢', '🎡'],
           'c6': ['🛍️', '👟'], 'c7': ['💊', '🛒'], 'c8': ['⛈️', '🚨'], 'c9': ['⛽', '🚗'], 'c10': ['🛫', '🇧🇷']}
for c in ch:
    c["island"] = ISLANDS[c["id"]]

trip = {
  "id": "usa",
  "title": "Aventura em Orlando",
  "titleEn": "Orlando Adventure",
  "emoji": "🇺🇸",
  "intro": "Imigração americana, carro alugado, parques, outlet e gorjeta. As suas escolhas mudam a história, com dicas para viajar sem sustos nos EUA.",
  "chapters": ch,
  "theme": "sunset",
  "route": "🛫 São Paulo → Orlando",
  "boss": {"name": "O Agente Durão", "emoji": "🕵️", "intro": "O Agente Durão da imigração quer testar tudo o que você aprendeu nos EUA. Responda rápido e sem piadas!"},
}
root = os.path.join(os.path.dirname(__file__), "..", "data", "trips")
save_trip(trip, root)
for c in ch:
    kinds = {}
    for n in c["nodes"].values():
        kinds[n["type"]] = kinds.get(n["type"], 0) + 1
    print(c["id"], len(c["nodes"]), "nós,", len(c["endings"]), "finais", kinds)
