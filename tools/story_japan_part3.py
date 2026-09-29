# Aventura no Japão — parte 3 (capítulos 9 a 12): Kyoto, Nara e Osaka.
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from story_dsl import *

CH = []

# ---------------------------------------------------------------- 9
CH.append(chapter("c9", "⛩️", "Templos de Kyoto", "Kyoto temples",
  {"sky": "day", "items": [["⛩️", "pulse"], ["🦊", "walk"], ["🍁", "float"]]},
  {
  "start": [
    N("Konnichiwa, {name}! Bem-vindos a Kyoto, a antiga capital do Japão, com mais de mil templos e santuários. Hoje o roteiro é espiritual: portões vermelhos, fontes de purificação e, à noite, o bairro de Gion. Respira fundo e anda devagar, que aqui ninguém tem pressa. 🍁"),
    TIP("⛩️", "Santuário ou templo?", "O portão vermelho, o torii, marca a entrada de um santuário xintoísta. Os templos budistas costumam ter portões grandes de madeira e incenso. Nos dois, vale a mesma regra de ouro: respeito e silêncio.",
        dos=["Fazer uma pequena reverência antes de passar pelo torii", "Andar pelas laterais do caminho: o centro é simbolicamente dos deuses"],
        donts=["Falar alto ou fazer bagunça", "Sentar ou pendurar-se nos portões para foto"]),
    N("Logo depois do portão tem uma fonte de pedra com conchas de bambu. É o temizuya, a fonte de purificação. Você fica na dúvida e pergunta a uma senhora japonesa com um educado \"Sumimasen\"."),
    Y("Excuse me, how do I use this fountain?", "Com licença, como eu uso esta fonte?"),
    T("Senhora", "First your left hand, then your right hand. Then rinse your mouth.", "Primeiro a mão esquerda, depois a direita. Depois enxágue a boca."),
    G("Senhora", "them", "Pour water in your hand. Don't ___ from the ladle.", "drink", ["drink", "eat", "wash", "cook"], "Coloque água na mão. Não beba direto da concha."),
    EX("Os passos da purificação", "A ordem é: 1) concha na mão direita, lava a esquerda; 2) troca de mão, lava a direita; 3) põe um pouco de água na palma e enxágua a boca, sem encostar a boca na concha; 4) deixa a concha em pé para a água escorrer pelo cabo. Se quiser, pule a parte da boca: lavar as mãos já está ótimo.",
       [("Left hand first.", "Primeiro a mão esquerda."), ("Don't touch the ladle with your mouth.", "Não encoste a boca na concha.")]),
    N("No salão principal, você joga uma moedinha na caixa de oferendas, faz duas reverências, bate palmas duas vezes, faz um pedido e termina com mais uma reverência. Do lado, tem uma barraquinha de omikuji: os papeizinhos da sorte!"),
    C("Quer tirar a sorte?", [
        O("Can I get a fortune, please?", "good", "Bora! Educado e direto. Vamos ver o que o destino diz…", go="fortune", pt="Posso pegar uma sorte, por favor?"),
        O("Pular a sorte e ir para Gion", "ok", "Tudo bem! Mas o omikuji é divertido… fica para a próxima.", go="gion", lang="pt"),
    ]),
  ],
  "fortune": [
    N("Você chacoalha uma caixinha, sai um palito com um número e a atendente te entrega o papel. Nele está escrito… \"kyo\": má sorte! 😱", "oops"),
    Y("Oh no! What does this mean?", "Ah, não! O que isso significa?"),
    T("Atendente", "It's bad luck. But don't worry! Tie it here and leave the bad luck behind.", "É má sorte. Mas não se preocupe! Amarre aqui e deixe a má sorte para trás."),
    EX("Omikuji", "Quando a sorte é ruim, a tradição é amarrar o papel num varal ou numa árvore do santuário, para a má sorte ficar ali. Se for boa sorte, muita gente leva para casa. E no fim, um \"Arigatou gozaimasu\" (muito obrigado) cai sempre bem.",
       [("Good luck!", "Boa sorte!"), ("Bad luck.", "Má sorte.")]),
    GO("gion"),
  ],
  "gion": [
    N("À noite, vocês chegam a Gion: casinhas de madeira, lanternas acesas… e, de repente, uma maiko (aprendiz de gueixa) passa apressada, com o quimono colorido e os tamancos fazendo toc-toc. 👘"),
    TIP("🏮", "Etiqueta em Gion", "As geiko e maiko são profissionais indo trabalhar, não atrações turísticas. Várias vielas de Gion são particulares, e há placas proibindo fotos nelas.",
        dos=["Dar espaço e deixá-las passar", "Obedecer às placas de proibido fotografar"],
        donts=["Correr atrás, tocar ou bloquear o caminho", "Entrar em vielas particulares"]),
    B("Posso tirar fotos aqui?", "Is it OK to take photos here?", ["make", "there"]),
    C("A maiko está passando bem na sua frente. O que você faz?", [
        O("Dar um passo para o lado e deixá-la passar", "good", "Perfeito! Respeito total. Ela até faz uma pequena reverência de agradecimento.", go="calm", lang="pt"),
        O("Wait! Photo, photo, please!", "bad", "Ai, ai, ai… correr atrás com o celular é justamente o que não se faz. Veja:", go="chase", pt="Espera! Foto, foto, por favor!"),
    ]),
  ],
  "calm": [
    N("Ela desaparece na esquina, e o momento fica guardado na memória, que é o melhor álbum. Vocês continuam passeando pela rua principal, que tem várias lojinhas de doces."),
    Y("That was beautiful. Let's walk to the river.", "Isso foi lindo. Vamos caminhar até o rio."),
    END("respeito", "Final: turista nota dez", "Purificação certinha, reverências no lugar e respeito em Gion. Kyoto aprovou vocês! ⛩️"),
  ],
  "chase": [
    N("Você sai correndo e entra numa viela estreita… e dá de cara com um senhor de braços cruzados, ao lado de uma placa com uma câmera riscada. 😬", "oops"),
    T("Morador", "Excuse me. No photos here. This is a private street.", "Com licença. Sem fotos aqui. Esta é uma rua particular."),
    Y("I'm so sorry. I didn't know. We'll leave now.", "Me desculpe. Eu não sabia. Já vamos sair."),
    EX("Pedindo desculpas", "Errou? Peça desculpas curto e saia com calma. \"Sumimasen\" em japonês ou \"I'm sorry\" em inglês resolvem quase tudo.",
       [("I'm so sorry.", "Me desculpe."), ("I didn't know.", "Eu não sabia.")]),
    END("rua-privada", "Final: a viela particular", "Susto passado e lição aprendida: em Gion, a maiko passa e a gente só admira de longe. 🏮"),
  ],
  }, "Fonte de purificação, reverências, omikuji e a etiqueta em Gion."))

# ---------------------------------------------------------------- 10
CH.append(chapter("c10", "👘", "Kimono e cerimônia do chá", "Kimono and tea ceremony",
  {"sky": "day", "items": [["👘", "sway"], ["🍵", "pulse"], ["🌸", "float"]]},
  {
  "start": [
    N("Hoje é dia de se vestir a caráter! Vocês reservaram uma loja de aluguel de quimono em Kyoto, e depois tem cerimônia do chá. {spousePtCap} mal pode esperar para escolher as cores. 🌸"),
    T("Atendente", "Welcome! Do you have a reservation?", "Bem-vindos! Vocês têm reserva?"),
    Y("Yes, for two people. It's under the name {name}.", "Sim, para duas pessoas. Está no nome de {name}."),
    T("Atendente", "Please choose a kimono. Then we will help you put it on.", "Por favor, escolham um quimono. Depois nós ajudamos a vestir."),
    N("Você escolhe um lindo, mas na prova ele fica apertado nos ombros."),
    G("Você", "you", "It's a little tight. Do you have a ___ size?", "bigger", ["bigger", "smaller", "shorter", "cheaper"], "Está um pouco apertado. Vocês têm um tamanho maior?"),
    EX("Tamanhos", "Para falar de roupa: \"tight\" é apertado, \"loose\" é folgado, \"a bigger size\" é um tamanho maior e \"a smaller size\" é um menor.",
       [("It's too loose.", "Está folgado demais."), ("This one fits well.", "Este serviu bem.")]),
    T("Atendente", "Would you like a hair set too? It's extra.", "Vocês querem arrumar o cabelo também? É cobrado à parte."),
    C("O que você responde?", [
        O("Yes, please. That sounds great!", "good", "Penteado com enfeite de flor combina demais com o quimono!", pt="Sim, por favor. Parece ótimo!"),
        O("No, thank you. Just the kimono.", "good", "Também está ótimo: educado e claro.", pt="Não, obrigado. Só o quimono."),
    ]),
    T("Atendente", "Please return the kimono by five o'clock.", "Por favor, devolvam o quimono até as cinco horas."),
    TIP("👘", "Usando quimono", "No quimono, o lado esquerdo fica por cima do direito. O contrário é usado para vestir os falecidos! A equipe da loja veste você, então é só confiar. E fique de olho no horário de devolução: atrasos costumam ter taxa.",
        dos=["Lado esquerdo por cima do direito", "Dar passinhos curtos com as sandálias", "Perguntar o horário de devolução"],
        donts=["Correr ou subir escadas com pressa", "Comer algo que suja perto do quimono alugado"]),
    N("Vestidos a caráter, vocês chegam a uma casa de chá tradicional. Tiram os sapatos, sentam no tatame e a mestra do chá prepara o matcha em silêncio, batendo com um pincel de bambu."),
    T("Mestra do chá", "Please eat the sweet first. Then I will serve the tea.", "Por favor, comam o docinho primeiro. Depois eu sirvo o chá."),
    N("O docinho japonês (wagashi) tem formato de flor. Aí chega a tigela de matcha: verde, espumoso… e bem amarguinho."),
    C("O que você faz com o chá?", [
        O("Agradecer, girar a tigela e beber em goles curtos", "good", "Isso! Etiqueta de mestre. Veja os detalhes:", go="tea", lang="pt"),
        O("Excuse me, can I have some sugar and milk?", "bad", "Hahaha! Açúcar no matcha da cerimônia? A mestra vai sorrir amarelo… 😅", go="sugar", pt="Com licença, pode me dar açúcar e leite?"),
    ]),
  ],
  "tea": [
    EX("Etiqueta do chá", "Faça uma pequena reverência, pegue a tigela com a mão direita e apoie na palma esquerda. Gire a tigela duas vezes no sentido horário, para não beber pela frente decorada. Beba em poucos goles; o último pode fazer um barulhinho, que mostra que você gostou. Antes de começar, diga \"Itadakimasu\".",
       [("Thank you for the tea.", "Obrigado pelo chá."), ("It's delicious.", "Está delicioso.")]),
    Y("It's delicious. Thank you for the tea.", "Está delicioso. Obrigado pelo chá."),
    T("Mestra do chá", "Thank you for coming. You did very well!", "Obrigada pela visita. Vocês se saíram muito bem!"),
    B("Obrigado pela linda cerimônia do chá.", "Thank you for the beautiful tea ceremony.", ["coffee", "party"]),
    END("cha-perfeito", "Final: mestres do chá", "Quimono, docinho e matcha na etiqueta certa. A mestra ficou orgulhosa! 🍵"),
  ],
  "sugar": [
    T("Mestra do chá", "Sorry, we don't use sugar. The sweet makes the tea taste softer.", "Desculpe, não usamos açúcar. O docinho deixa o chá mais suave."),
    N("Ahá! É por isso que o docinho vem antes: ele prepara a boca para o amargor do matcha.", "oops"),
    Y("Oh, I see. Let me try it.", "Ah, entendi. Deixa eu experimentar."),
    N("Você dá um gole e… surpresa! Com o doce ainda na boca, o chá fica macio e gostoso. Você termina com um \"Arigatou gozaimasu\" e uma reverência."),
    END("sem-acucar", "Final: o matcha sem açúcar", "Pediu açúcar, mas descobriu o segredo do docinho. Agora você entende o matcha! 😄"),
  ],
  }, "Tamanhos, aluguel de quimono e a etiqueta da cerimônia do chá."))

# ---------------------------------------------------------------- 11
CH.append(chapter("c11", "🦌", "Nara e os cervos", "Nara and the deer",
  {"sky": "day", "items": [["🦌", "walk"], ["🍘", "bob"], ["🌳", "sway"]]},
  {
  "start": [
    N("Bate-volta de trem até Nara! Aqui, centenas de cervos andam soltos pelo parque, pelas ruas e até na porta dos templos. Eles são considerados mensageiros sagrados e são muito… famintos. 🦌"),
    TIP("🦌", "Regras dos cervos", "Os cervos de Nara são selvagens, mesmo parecendo mansos. Só dê a eles os biscoitos próprios, vendidos nas barraquinhas do parque (shika senbei). Muitos cervos fazem uma reverência com a cabeça antes de ganhar o biscoito!",
        dos=["Guardar mapas, papéis e sacolas: eles comem papel", "Mostrar as mãos vazias quando o biscoito acabar"],
        donts=["Dar outra comida ou provocar os cervos", "Ficar balançando o biscoito no alto"]),
    Y("Excuse me, one pack of deer crackers, please.", "Com licença, um pacote de biscoitos para cervos, por favor."),
    T("Vendedora", "Here you are. Be careful, they can bite a little!", "Aqui está. Cuidado, eles podem dar uma mordidinha!"),
    N("Nem deu tempo de abrir o pacote: cinco cervos já estão em volta de você, olhando fixo. 👀"),
    C("O que você faz?", [
        O("Fazer uma reverência e dar um biscoito de cada vez", "good", "Muito bem! Olha só: o cervo faz uma reverência de volta! 🙇", go="bow", lang="pt"),
        O("Levantar o pacote bem alto e brincar com eles", "bad", "Xiii… provocar cervo faminto nunca termina bem. 😂", go="tease", lang="pt"),
    ]),
  ],
  "bow": [
    N("Você faz uma reverência, o cervo abaixa a cabeça também, e você entrega o biscoito. Que fofura! {spousePtCap} filma tudo para mandar para a família."),
    Y("Look! The deer is bowing to me!", "Olha! O cervo está fazendo reverência para mim!"),
    GO("temple"),
  ],
  "tease": [
    N("Os cervos perdem a paciência: um puxa a sua camisa com a boca, outro dá uma cabeçadinha e um terceiro… come metade do seu mapa! 🗺️", "oops"),
    Y("Hey! Not my map! OK, OK, here you go!", "Ei! Meu mapa não! Tá bom, tá bom, toma!"),
    EX("Acabou!", "Quando o biscoito acabar, mostre as duas mãos abertas e vazias, e os cervos entendem. Dá para falar também:",
       [("Sorry, no more crackers.", "Desculpa, acabaram os biscoitos."), ("All gone!", "Acabou tudo!")]),
    GO("temple"),
  ],
  "temple": [
    N("Agora, o Todai-ji: um templo de madeira gigantesco que guarda o Grande Buda, uma estátua de bronze com uns quinze metros de altura. Você fica de boca aberta!"),
    EX("Big, bigger, the biggest", "Para comparar tamanhos: \"big\" é grande, \"bigger\" é maior e \"the biggest\" é o maior de todos.",
       [("It's huge!", "É enorme!"), ("This is the biggest Buddha I've ever seen.", "Este é o maior Buda que eu já vi.")]),
    N("Lá dentro, tem uma coluna com um buraco na base, do tamanho da narina do Buda. Dizem que quem passa por ele tem sorte. As crianças passam fácil… os adultos, nem sempre! 😂"),
    N("Na saída, vocês querem uma foto juntos, com o templo ao fundo. Um casal simpático está passando."),
    C("Como você pede a foto?", [
        O("Excuse me, could you take a picture of us, please?", "good", "Perfeito! \"Could you…?\" é educadíssimo.", go="photo", pt="Com licença, você poderia tirar uma foto nossa, por favor?"),
        O("Esticar o braço e fazer uma selfie", "ok", "Funciona! Mas o templo inteiro não coube… e o inglês ficou de fora.", go="selfie", lang="pt"),
    ]),
  ],
  "photo": [
    T("Turista", "Sure! Which button do I press?", "Claro! Qual botão eu aperto?"),
    G("Você", "you", "Just press this ___. Thank you so much!", "button", ["button", "bottle", "screen", "door"], "É só apertar este botão. Muito obrigado!"),
    B("Você poderia tirar uma foto nossa, por favor?", "Could you take a picture of us, please?", ["make", "our"]),
    T("Turista", "One, two, three… smile!", "Um, dois, três… sorriam!"),
    END("foto-perfeita", "Final: a foto perfeita", "Cervos que fazem reverência, o Grande Buda e uma foto linda para a família. Nara foi um sonho! 🦌📸"),
  ],
  "selfie": [
    N("A selfie ficou com vocês dois, metade do telhado… e um cervo curioso lambendo a sua orelha. 😂"),
    Y("Let's ask someone next time!", "Da próxima vez, vamos pedir para alguém!"),
    END("selfie-cervo", "Final: selfie com cervo", "A foto não mostrou o templo, mas o cervo virou a estrela do álbum da família! 🤳🦌"),
  ],
  }, "Biscoitos para os cervos, o Grande Buda e como pedir uma foto."))

# ---------------------------------------------------------------- 12
CH.append(chapter("c12", "🐙", "Comida de rua em Osaka", "Osaka street food",
  {"sky": "night", "items": [["🐙", "swim"], ["🏮", "pulse"], ["🍢", "bob"]]},
  {
  "start": [
    N("Osaka! Aqui o lema é \"kuidaore\": comer até cair. 😋 Vocês estão em Dotonbori, a rua do canal cheia de letreiros gigantes, luzes piscando e barraquinhas de comida por todo lado."),
    TIP("🛗", "Escada rolante em Osaka", "Em Tóquio, quem fica parado na escada rolante fica à esquerda. Em Osaka, é o contrário: fica-se à direita, e a esquerda é para quem sobe andando! Na dúvida, copie quem está na sua frente.",
        dos=["Em Osaka, ficar parado à direita", "Comer perto da barraca onde comprou"],
        donts=["Sair andando e comendo pela rua lotada", "Deixar o lixo por aí: guarde até achar uma lixeira"]),
    N("Primeira parada: takoyaki, bolinhos de massa com pedacinhos de polvo, cobertos de molho e flocos de peixe seco que ficam \"dançando\" com o calor."),
    Y("Hi! One takoyaki, please. Six pieces.", "Oi! Um takoyaki, por favor. Seis bolinhos."),
    T("Vendedor", "Here you go. Be careful, it's very hot!", "Aqui está. Cuidado, está muito quente!"),
    C("O takoyaki acabou de sair da chapa. E aí?", [
        O("Esperar um pouco e assoprar antes de morder", "good", "Sábio! Por dentro ele é quase líquido e muito quente.", go="wait", lang="pt"),
        O("Colocar o bolinho inteiro na boca de uma vez", "bad", "Nãooo! Lava na boca! 🔥", go="hot", lang="pt"),
    ]),
  ],
  "hot": [
    N("Você enfia o bolinho inteiro na boca e… AAAH! Parece lava de vulcão! Você abana a boca, pula e faz umas caretas enquanto {spousePt} morre de rir. 🥵", "oops"),
    Y("Water, please! It's so hot!", "Água, por favor! Está muito quente!"),
    T("Vendedor", "Ha ha! Everybody does that the first time. Here, some water.", "Ha ha! Todo mundo faz isso na primeira vez. Tome, um pouco de água."),
    GO("food"),
  ],
  "wait": [
    N("Vocês ficam do ladinho da barraca, assopram e dão mordidinhas. Crocante por fora, cremoso por dentro. Uma delícia!"),
    Y("Wow, this is delicious!", "Nossa, isto está delicioso!"),
    GO("food"),
  ],
  "food": [
    EX("Delicioso!", "Para elogiar comida: \"delicious\" é delicioso, \"so good\" é muito bom. Em japonês, \"Oishii!\" é gostoso. E em Osaka, muita gente diz \"Ookini\" no lugar de obrigado!",
       [("This is so good!", "Isto está muito bom!"), ("What is this called?", "Como se chama isto?")]),
    N("Próxima parada: okonomiyaki, uma panqueca salgada de repolho feita na chapa na sua frente, com o que você quiser dentro."),
    T("Cozinheiro", "Pork, shrimp or squid?", "Porco, camarão ou lula?"),
    G("Você", "you", "Can I have one ___ shrimp, please?", "with", ["with", "for", "at", "on"], "Pode me dar um com camarão, por favor?"),
    B("Podemos comer aqui perto da barraca?", "Can we eat here near the stall?", ["walk", "there"]),
    N("Última parada: kushikatsu, espetinhos empanados e fritos. No balcão tem uma vasilha de molho que todo mundo usa. E uma plaquinha: \"No double dipping!\""),
    EX("No double dipping", "O molho é compartilhado, então só pode mergulhar o espetinho UMA vez, antes de morder. Quer mais molho? Use uma folha de repolho como colher.",
       [("Only dip once.", "Só mergulhe uma vez."), ("Use the cabbage.", "Use o repolho.")]),
    C("Você mordeu o espetinho e quer mais molho. O que faz?", [
        O("Pegar molho com a folha de repolho", "good", "Isso! O truque do repolho é a etiqueta oficial. 🥬", go="cabbage", lang="pt"),
        O("Mergulhar de novo o espetinho mordido", "bad", "Epa! Todo o balcão viu… 😳", go="double", lang="pt"),
    ]),
  ],
  "cabbage": [
    T("Cozinheiro", "Good job! You know the rules!", "Muito bem! Você conhece as regras!"),
    Y("Thank you! Everything was delicious.", "Obrigado! Estava tudo delicioso."),
    END("kuidaore", "Final: comer até cair", "Takoyaki, okonomiyaki e kushikatsu com etiqueta perfeita. Osaka te adotou! 🐙🍢"),
  ],
  "double": [
    T("Cozinheiro", "Oh! No double dipping, please. Use the cabbage for more sauce.", "Oh! Não mergulhe duas vezes, por favor. Use o repolho para pegar mais molho."),
    Y("Sorry! I didn't know. Thanks for telling me.", "Desculpe! Eu não sabia. Obrigado por me avisar."),
    N("O cozinheiro sorri e troca o molho. Você aprendeu do jeito mais constrangedor, mas nunca mais vai esquecer! 😅", "oops"),
    END("molho-duplo", "Final: o molho duplo", "Um vacilo no molho, mas a barriga ficou feliz. Da próxima vez, repolho neles! 🥬"),
  ],
  }, "Takoyaki quentíssimo, okonomiyaki, o molho do kushikatsu e a escada rolante de Osaka."))

ISLANDS = {'c9': ['⛩️', '🦊'], 'c10': ['👘', '🍵'], 'c11': ['🦌', '🛕'], 'c12': ['🐙', '🏮']}
for c in CH: c["island"] = ISLANDS[c["id"]]
