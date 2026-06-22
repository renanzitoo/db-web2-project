const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_web2_project'
};

// 50 Games configuration (10 per category)
const gamesData = [
  {
    "id_jogo": 1,
    "id_categoria": 1,
    "appid": 730,
    "titulo": "Counter-Strike 2",
    "preco": 0,
    "lancamento": "2023-09-27",
    "desenvolvedor": "Valve",
    "distribuidora": "Valve",
    "youtubeId": "c80JyCol6a0",
    "descricao": "Há mais de duas décadas, o Counter-Strike oferece uma experiência competitiva de elite moldada por milhões de jogadores mundialmente. Jogue o próximo capítulo do FPS competitivo definitivo gratuitamente.",
    "conquistas": [
      {
        "nome": "Primeiro de Muitos",
        "desc": "Elimine o primeiro inimigo em uma partida oficial.",
        "pts": 10
      },
      {
        "nome": "Mestre das Granadas",
        "desc": "Elimine um inimigo com uma granada de fragmentação.",
        "pts": 20
      },
      {
        "nome": "Olho de Águia",
        "desc": "Consiga uma eliminação com um rifle de precisão sem usar a mira.",
        "pts": 30
      },
      {
        "nome": "Besta do Combate",
        "desc": "Vença 1.000 rodadas em partidas oficiais.",
        "pts": 50
      },
      {
        "nome": "Iniciando o Treinamento",
        "desc": "Conclua o percurso de treinamento inicial.",
        "pts": 10
      }
    ]
  },
  {
    "id_jogo": 2,
    "id_categoria": 1,
    "appid": 367520,
    "titulo": "Hollow Knight",
    "preco": 29.99,
    "lancamento": "2017-02-24",
    "desenvolvedor": "Team Cherry",
    "distribuidora": "Team Cherry",
    "youtubeId": "UAO2urG23S4",
    "descricao": "Forje o seu próprio caminho em Hollow Knight! Uma aventura de ação clássica em 2D por um vasto reino arruinado de insetos e heróis.",
    "conquistas": [
      {
        "nome": "Encantado",
        "desc": "Obtenha seu primeiro amuleto.",
        "pts": 10
      },
      {
        "nome": "Cavaleiro Falso",
        "desc": "Derrote o Cavaleiro Falso nos caminhos de esgoto.",
        "pts": 20
      },
      {
        "nome": "Fim dos Tempos",
        "desc": "Derrote o receptáculo puro no Panteão de Hallownest.",
        "pts": 50
      },
      {
        "nome": "Foco da Alma",
        "desc": "Adquira a habilidade de canalizar a Alma para curar-se.",
        "pts": 10
      },
      {
        "nome": "Mestre dos Amuletos",
        "desc": "Adquira todos os 40 amuletos de Hallownest.",
        "pts": 50
      }
    ]
  },
  {
    "id_jogo": 3,
    "id_categoria": 1,
    "appid": 271590,
    "titulo": "Grand Theft Auto V",
    "preco": 82.42,
    "lancamento": "2015-04-14",
    "desenvolvedor": "Rockstar North",
    "distribuidora": "Rockstar Games",
    "youtubeId": "QkkoHAzJnUs",
    "descricao": "Quando um jovem traficante, um assaltante de bancos aposentado e um psicopata aterrorizante se envolvem com o submundo do crime, o governo e a indústria do entretenimento, eles devem realizar golpes para sobreviver.",
    "conquistas": [
      {
        "nome": "Bem-vindo a Los Santos",
        "desc": "Recupere um carro e dispute uma corrida pelas ruas de Los Santos.",
        "pts": 10
      },
      {
        "nome": "Diamante Bruto",
        "desc": "Conclua o roubo da joalheria com sucesso.",
        "pts": 25
      },
      {
        "nome": "Viver ou Morrer em Los Santos",
        "desc": "Conclua a última missão principal.",
        "pts": 50
      },
      {
        "nome": "Subindo na Vida",
        "desc": "GTA Online: Alcance o nível 25.",
        "pts": 20
      },
      {
        "nome": "Criminoso de Carreira",
        "desc": "Alcance 100% de conclusão do jogo.",
        "pts": 100
      }
    ]
  },
  {
    "id_jogo": 4,
    "id_categoria": 1,
    "appid": 550,
    "titulo": "Left 4 Dead 2",
    "preco": 32.99,
    "lancamento": "2009-11-17",
    "desenvolvedor": "Valve",
    "distribuidora": "Valve",
    "youtubeId": "1_C1s1-Z3y8",
    "descricao": "Ambientado no apocalipse zumbi, Left 4 Dead 2 é a sequência muito aguardada do premiado jogo cooperativo de ação.",
    "conquistas": [
      {
        "nome": "Preço da Gasolina",
        "desc": "Colete todos os galões de combustível no shopping.",
        "pts": 15
      },
      {
        "nome": "Massacre de Zumbis",
        "desc": "Elimine 10.000 infectados comuns.",
        "pts": 30
      },
      {
        "nome": "Sobrevivência Absoluta",
        "desc": "Conclua uma campanha inteira na dificuldade Realista.",
        "pts": 50
      },
      {
        "nome": "Resgate de Helicóptero",
        "desc": "Sobreviva à campanha Centro de Convenções.",
        "pts": 20
      },
      {
        "nome": "Curandeiro Rápido",
        "desc": "Use um kit médico para curar outro sobrevivente com menos de 10 PV.",
        "pts": 15
      }
    ]
  },
  {
    "id_jogo": 5,
    "id_categoria": 1,
    "appid": 1172470,
    "titulo": "Apex Legends",
    "preco": 0,
    "lancamento": "2020-11-05",
    "desenvolvedor": "Respawn Entertainment",
    "distribuidora": "Electronic Arts",
    "youtubeId": "oQtHENM_GZU",
    "descricao": "Domine com estilo em Apex Legends, um jogo de tiro Battle Royale gratuito onde personagens lendários com habilidades poderosas batalham por fama e fortuna nas bordas da Fronteira.",
    "conquistas": [
      {
        "nome": "Lenda do Apex",
        "desc": "Vença uma partida oficial com 3 personagens diferentes.",
        "pts": 20
      },
      {
        "nome": "Totalmente Equipado",
        "desc": "Equipe uma arma dourada totalmente lendária em jogo.",
        "pts": 20
      },
      {
        "nome": "Campeão da Fronteira",
        "desc": "Alcance o nível de jogador 50.",
        "pts": 40
      },
      {
        "nome": "Primeiro de Muitos",
        "desc": "Marque a primeira eliminação em uma partida.",
        "pts": 10
      },
      {
        "nome": "Líder de Eliminações",
        "desc": "Torne-se o Líder de Eliminações em uma partida oficial.",
        "pts": 30
      }
    ]
  },
  {
    "id_jogo": 6,
    "id_categoria": 1,
    "appid": 782330,
    "titulo": "Doom Eternal",
    "preco": 149,
    "lancamento": "2020-03-20",
    "desenvolvedor": "id Software",
    "distribuidora": "Bethesda Softworks",
    "youtubeId": "2HOClc6ujj4",
    "descricao": "Os exércitos do inferno invadiram a Terra. Torne-se o Slayer em uma campanha épica para um jogador para cruzar dimensões eliminando demônios e deter a destruição da humanidade.",
    "conquistas": [
      {
        "nome": "Apocalipse Controlado",
        "desc": "Conclua a primeira missão da campanha.",
        "pts": 10
      },
      {
        "nome": "Caçador de Segredos",
        "desc": "Encontre todos os brinquedos colecionáveis na Terra.",
        "pts": 30
      },
      {
        "nome": "Portão de Slayer",
        "desc": "Conclua todos os Portões de Slayer da campanha principal.",
        "pts": 50
      },
      {
        "nome": "Mestre das Armas",
        "desc": "Domine todas as modificações de armas.",
        "pts": 40
      },
      {
        "nome": "Metal Pesado",
        "desc": "Adquira a Armadura de Slayer na Fortaleza do Destino.",
        "pts": 15
      }
    ]
  },
  {
    "id_jogo": 7,
    "id_categoria": 1,
    "appid": 814380,
    "titulo": "Sekiro: Shadows Die Twice",
    "preco": 274,
    "lancamento": "2019-03-21",
    "desenvolvedor": "FromSoftware",
    "distribuidora": "Activision",
    "youtubeId": "rXMX4YJ7LGP",
    "descricao": "Explore o Japão do final do período Sengoku no final do século XVI, um período brutal de constante conflito de vida e morte, enquanto você enfrenta inimigos maiores que a vida em um mundo escuro e distorcido.",
    "conquistas": [
      {
        "nome": "Lâmina Sagrada",
        "desc": "Receba a lâmina Kusabimaru de seu jovem senhor.",
        "pts": 15
      },
      {
        "nome": "Gyoubu Masataka Oniwa",
        "desc": "Derrote o lendário general a cavalo no portão do castelo.",
        "pts": 30
      },
      {
        "nome": "Sombra da Morte",
        "desc": "Desbloqueie todas as técnicas de shinobi.",
        "pts": 60
      },
      {
        "nome": "Ressurreição",
        "desc": "Retorne dos mortos pela primeira vez.",
        "pts": 10
      },
      {
        "nome": "Mestre da Prótese",
        "desc": "Aprimore todas as ferramentas de prótese ao limite.",
        "pts": 50
      }
    ]
  },
  {
    "id_jogo": 8,
    "id_categoria": 1,
    "appid": 220,
    "titulo": "Half-Life 2",
    "preco": 32.99,
    "lancamento": "2004-11-16",
    "desenvolvedor": "Valve",
    "distribuidora": "Valve",
    "youtubeId": "N7JtOO28CQU",
    "descricao": "O pé-de-cabra do cientista Gordon Freeman atinge o mundo novamente na sequência de ficção científica eleita o jogo da década por mais de 50 publicações.",
    "conquistas": [
      {
        "nome": "Arma de Gravidade",
        "desc": "Obtenha o Manipulador de Campo de Energia de Ponto Zero.",
        "pts": 10
      },
      {
        "nome": "Líder Rebelde",
        "desc": "Lidere um esquadrão de rebeldes pelas ruas de City 17.",
        "pts": 30
      },
      {
        "nome": "Destruidor de Portais",
        "desc": "Destrua o reator de energia do Citadel.",
        "pts": 50
      },
      {
        "nome": "Inserção Perigosa",
        "desc": "Escape do ataque da Combine na estação de trem.",
        "pts": 10
      },
      {
        "nome": "Não Pise na Areia!",
        "desc": "Cruze a praia sem tocar na areia infestado de formigas-leão.",
        "pts": 40
      }
    ]
  },
  {
    "id_jogo": 9,
    "id_categoria": 1,
    "appid": 601150,
    "titulo": "Devil May Cry 5",
    "preco": 99.9,
    "lancamento": "2019-03-08",
    "desenvolvedor": "Capcom",
    "distribuidora": "Capcom",
    "youtubeId": "K2t3jD-m2VI",
    "descricao": "O caçador de demônios definitivo está de volta com estilo no jogo que os fãs de ação estavam esperando.",
    "conquistas": [
      {
        "nome": "Estilo SSS",
        "desc": "Obtenha um ranking de estilo SSS em qualquer combo de combate.",
        "pts": 15
      },
      {
        "nome": "Caçador Lendário",
        "desc": "Conclua a campanha na dificuldade Filho de Sparda.",
        "pts": 40
      },
      {
        "nome": "Palácio Sangrento",
        "desc": "Conclua todos os andares do Palácio Sangrento.",
        "pts": 60
      },
      {
        "nome": "Quebra-Quedas",
        "desc": "Evite sofrer danos de queda recuperando-se no ar.",
        "pts": 10
      },
      {
        "nome": "Dono da Festa",
        "desc": "Colete todas as Orbes Azuis do jogo.",
        "pts": 30
      }
    ]
  },
  {
    "id_jogo": 10,
    "id_categoria": 1,
    "appid": 219150,
    "titulo": "Hotline Miami",
    "preco": 32.99,
    "lancamento": "2012-10-23",
    "desenvolvedor": "Dennaton Games",
    "distribuidora": "Devolver Digital",
    "youtubeId": "2N_y2S789vA",
    "descricao": "Hotline Miami é um jogo de ação de alta octanagem repleto de pura brutalidade, tiroteios violentos e combates corpo a corpo em uma Miami retro alternativa.",
    "conquistas": [
      {
        "nome": "Zoológico",
        "desc": "Desbloqueie todas as máscaras de animais no jogo.",
        "pts": 30
      },
      {
        "nome": "Combo Mestre",
        "desc": "Execute um combo de eliminação de 10x.",
        "pts": 20
      },
      {
        "nome": "Apenas Negócios",
        "desc": "Conclua a história principal da campanha.",
        "pts": 40
      },
      {
        "nome": "Estilo Karma",
        "desc": "Elimine um inimigo com uma arma arremessada na parede.",
        "pts": 15
      },
      {
        "nome": "Mestre das Armas",
        "desc": "Use todas as armas de fogo e corpo a corpo disponíveis no jogo.",
        "pts": 35
      }
    ]
  },
  {
    "id_jogo": 11,
    "id_categoria": 2,
    "appid": 1245620,
    "titulo": "Elden Ring",
    "preco": 229.9,
    "lancamento": "2022-02-25",
    "desenvolvedor": "FromSoftware",
    "distribuidora": "Bandai Namco",
    "youtubeId": "E3Huy2cdih0",
    "descricao": "O NOVO RPG DE AÇÃO E FANTASIA. Suba, Sem-luz, e seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias.",
    "conquistas": [
      {
        "nome": "Margit, o Agouro Caído",
        "desc": "Derrote Margit, o Agouro Caído na entrada de Castelo Tempesvéu.",
        "pts": 30
      },
      {
        "nome": "Lorde Prístino",
        "desc": "Alcance o final \"Lorde Prístino\".",
        "pts": 100
      },
      {
        "nome": "Espada Lendária",
        "desc": "Colete todas as armas lendárias das Terras Intermédias.",
        "pts": 50
      },
      {
        "nome": "Rennala da Lua Cheia",
        "desc": "Derrote a Rainha Rennala da Lua Cheia na Academia.",
        "pts": 35
      },
      {
        "nome": "Cadeia de Graça",
        "desc": "Ative 15 locais de Graça Perdida nas Terras Intermédias.",
        "pts": 15
      }
    ]
  },
  {
    "id_jogo": 12,
    "id_categoria": 2,
    "appid": 1091500,
    "titulo": "Cyberpunk 2077",
    "preco": 199.9,
    "lancamento": "2020-12-10",
    "desenvolvedor": "CD PROJEKT RED",
    "distribuidora": "CD PROJEKT RED",
    "youtubeId": "UnA7tepsc7s",
    "descricao": "Cyberpunk 2077 é um RPG de ação e aventura em mundo aberto se passando em Night City, uma megalópole obcecada por poder, glamour e modificações corporais.",
    "conquistas": [
      {
        "nome": "O Louco",
        "desc": "Torne-se um mercenário em Night City.",
        "pts": 15
      },
      {
        "nome": "Lenda de Night City",
        "desc": "Alcance a reputação máxima com a cidade de Night City.",
        "pts": 40
      },
      {
        "nome": "Estrela Cósmica",
        "desc": "Conclua a campanha com a ajuda da Panam e dos Aldecaldos.",
        "pts": 50
      },
      {
        "nome": "O Diabo",
        "desc": "Conclua a história ajudando a corporação Arasaka.",
        "pts": 40
      },
      {
        "nome": "Viajante do Ciberespaço",
        "desc": "Realize uma invasão rápida em um terminal de dados.",
        "pts": 15
      }
    ]
  },
  {
    "id_jogo": 13,
    "id_categoria": 2,
    "appid": 292030,
    "titulo": "The Witcher 3: Wild Hunt",
    "preco": 129.99,
    "lancamento": "2015-05-18",
    "desenvolvedor": "CD PROJEKT RED",
    "distribuidora": "CD PROJEKT RED",
    "youtubeId": "c0i88t0KmuQ",
    "descricao": "Você é Geralt de Rívia, um exterminador de monstros profissional. Diante de você, ergue-se um continente devastado pela guerra e infestado de monstros.",
    "conquistas": [
      {
        "nome": "Lilás e Groselha",
        "desc": "Encontre Yennefer de Vengerberg no pomar branco.",
        "pts": 15
      },
      {
        "nome": "O Profissional",
        "desc": "Conclua todos os contratos de monstros ativos no continente.",
        "pts": 50
      },
      {
        "nome": "Mestre do Gwent",
        "desc": "Vença o grande torneio de cartas Gwent em Novigrad.",
        "pts": 30
      },
      {
        "nome": "Geralt de Rívia",
        "desc": "Derrote Eredin, o rei da Caçada Selvagem.",
        "pts": 50
      },
      {
        "nome": "Alquimista",
        "desc": "Aprenda 12 fórmulas de poções ou elixires.",
        "pts": 20
      }
    ]
  },
  {
    "id_jogo": 14,
    "id_categoria": 2,
    "appid": 1086940,
    "titulo": "Baldur's Gate 3",
    "preco": 199.99,
    "lancamento": "2023-08-03",
    "desenvolvedor": "Larian Studios",
    "distribuidora": "Larian Studios",
    "youtubeId": "1T22jUttmEU",
    "descricao": "Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de companheirismo e traição, sacrifício e sobrevivência, e a atração do poder absoluto.",
    "conquistas": [
      {
        "nome": "Escape do Nautilus",
        "desc": "Sobreviva à queda do navio voador devorador de mentes.",
        "pts": 15
      },
      {
        "nome": "Lorde do Absoluto",
        "desc": "Derrote o cérebro ancião e domine o continente.",
        "pts": 60
      },
      {
        "nome": "Role um D20",
        "desc": "Consiga um sucesso crítico natural em um teste de dados.",
        "pts": 10
      },
      {
        "nome": "Salvando o Bosque",
        "desc": "Resolva a crise entre os druidas e os refugiados tieflings.",
        "pts": 25
      },
      {
        "nome": "Amigo dos Animais",
        "desc": "Use fala com animais para conversar com 5 criaturas.",
        "pts": 15
      }
    ]
  },
  {
    "id_jogo": 15,
    "id_categoria": 2,
    "appid": 377160,
    "titulo": "Fallout 4",
    "preco": 59.99,
    "lancamento": "2015-11-09",
    "desenvolvedor": "Bethesda Game Studios",
    "distribuidora": "Bethesda Softworks",
    "youtubeId": "GE2BkLqMef4",
    "descricao": "Como único sobrevivente do Vault 111, você entra em um mundo destruído pela guerra nuclear. Cada segundo é uma luta pela sobrevivência e cada escolha é sua.",
    "conquistas": [
      {
        "nome": "Fora do Vault",
        "desc": "Deixe o Vault 111 e encare os ermos do Commonwealth.",
        "pts": 10
      },
      {
        "nome": "Líder Local",
        "desc": "Estabeleça 3 assentamentos prósperos sob sua proteção.",
        "pts": 25
      },
      {
        "nome": "Arsenal Nuclear",
        "desc": "Dispare uma mini-nuke utilizando a arma Fat Man.",
        "pts": 20
      },
      {
        "nome": "Detetive Particular",
        "desc": "Resgate o detetive Nick Valentine em Diamond City.",
        "pts": 20
      },
      {
        "nome": "Guerreiro do Commonwealth",
        "desc": "Suba para o nível de personagem 25.",
        "pts": 30
      }
    ]
  },
  {
    "id_jogo": 16,
    "id_categoria": 2,
    "appid": 489830,
    "titulo": "Skyrim (The Elder Scrolls V)",
    "preco": 149,
    "lancamento": "2016-10-27",
    "desenvolvedor": "Bethesda Game Studios",
    "distribuidora": "Bethesda Softworks",
    "youtubeId": "JSRtYpKjVyU",
    "descricao": "Vencedor de mais de 200 prêmios de Jogo do Ano, Skyrim Special Edition dá vida à fantasia épica com detalhes impressionantes.",
    "conquistas": [
      {
        "nome": "Nascido do Dragão",
        "desc": "Absorva sua primeira alma de dragão nas ruínas.",
        "pts": 15
      },
      {
        "nome": "Mestre da Guilda",
        "desc": "Torne-se o líder da guilda dos ladrões em Riften.",
        "pts": 40
      },
      {
        "nome": "Alduin Defeated",
        "desc": "Derrote o dragão devorador de mundos em Sovngarde.",
        "pts": 50
      },
      {
        "nome": "Membro de Honra",
        "desc": "Junte-se aos Companheiros em Whiterun.",
        "pts": 15
      },
      {
        "nome": "Grito de Guerra",
        "desc": "Aprenda os três estágios de qualquer palavra de poder.",
        "pts": 25
      }
    ]
  },
  {
    "id_jogo": 17,
    "id_categoria": 2,
    "appid": 582010,
    "titulo": "Monster Hunter: World",
    "preco": 99.9,
    "lancamento": "2018-08-09",
    "desenvolvedor": "Capcom",
    "distribuidora": "Capcom",
    "youtubeId": "Ro6r15w526c",
    "descricao": "Bem-vindo ao Novo Mundo! Assuma o papel de um caçador e elimine monstros ferozes em um ecossistema vivo e funcional, usando a paisagem e seus diversos habitantes para obter vantagem.",
    "conquistas": [
      {
        "nome": "Primeira Caçada",
        "desc": "Conclua com sucesso sua primeira missão de caçada.",
        "pts": 10
      },
      {
        "nome": "Mestre das Armas",
        "desc": "Aprimore qualquer arma até o nível máximo.",
        "pts": 30
      },
      {
        "nome": "Pesquisador de Monstros",
        "desc": "Alcance o nível de pesquisa máximo de qualquer monstro gigante.",
        "pts": 40
      },
      {
        "nome": "Estrela da Quinta Frota",
        "desc": "Derrote o dragão ancião Nergigante.",
        "pts": 50
      },
      {
        "nome": "Chef Gourmet",
        "desc": "Coma uma refeição personalizada na Cantina.",
        "pts": 10
      }
    ]
  },
  {
    "id_jogo": 18,
    "id_categoria": 2,
    "appid": 1687950,
    "titulo": "Persona 5 Royal",
    "preco": 249,
    "lancamento": "2022-10-21",
    "desenvolvedor": "ATLUS",
    "distribuidora": "SEGA",
    "youtubeId": "QnDvGWDsSqI",
    "descricao": "Prepare-se para a premiada experiência de RPG definitiva com edições adicionais e roube corações em Tóquio!",
    "conquistas": [
      {
        "nome": "Ladrão de Fantasmas",
        "desc": "Desperte a sua Persona inicial pela primeira vez.",
        "pts": 15
      },
      {
        "nome": "Reabilitação Concluída",
        "desc": "Derrote a sombra do chefe do primeiro palácio.",
        "pts": 25
      },
      {
        "nome": "Mestre da Fusão",
        "desc": "Realize uma fusão de Persona avançada na Velvet Room.",
        "pts": 20
      },
      {
        "nome": "Justiça Poética",
        "desc": "Execute um ataque All-Out Attack de forma bem-sucedida.",
        "pts": 15
      },
      {
        "nome": "Estudante Exemplar",
        "desc": "Consiga a maior nota nas provas da escola.",
        "pts": 25
      }
    ]
  },
  {
    "id_jogo": 19,
    "id_categoria": 2,
    "appid": 374320,
    "titulo": "Dark Souls III",
    "preco": 249.9,
    "lancamento": "2016-04-11",
    "desenvolvedor": "FromSoftware",
    "distribuidora": "Bandai Namco",
    "youtubeId": "_zDZYrIUg30",
    "descricao": "Enquanto o fogo se apaga e o mundo cai em ruínas, a FromSoftware continua a criar RPGs de ação aclamados e que definiram o gênero.",
    "conquistas": [
      {
        "nome": "Iudex Gundyr",
        "desc": "Derrote Iudex Gundyr no cemitério das cinzas.",
        "pts": 15
      },
      {
        "nome": "Herdeiro do Fogo",
        "desc": "Acenda sua primeira fogueira de descanso.",
        "pts": 10
      },
      {
        "nome": "Link the Fire",
        "desc": "Alcance o final de acender a Primeira Chama.",
        "pts": 60
      },
      {
        "nome": "Lorde das Cenzas: Abissais",
        "desc": "Derrote os Vigilantes do Abismo no Forte do Farron.",
        "pts": 35
      },
      {
        "nome": "Fogueira Suprema",
        "desc": "Aprimore o Frasco de Estus ao nível máximo.",
        "pts": 40
      }
    ]
  },
  {
    "id_jogo": 20,
    "id_categoria": 2,
    "appid": 1328670,
    "titulo": "Mass Effect Legendary Edition",
    "preco": 249,
    "lancamento": "2021-05-14",
    "desenvolvedor": "BioWare",
    "distribuidora": "Electronic Arts",
    "youtubeId": "AOtJV-1JPhM",
    "descricao": "Uma pessoa é tudo o que impede a humanidade da maior ameaça de todos os tempos. Reviva a lenda do Comandante Shepard na aclamada trilogia Mass Effect.",
    "conquistas": [
      {
        "nome": "Medalha de Honra",
        "desc": "Conclua a história do primeiro Mass Effect na campanha.",
        "pts": 30
      },
      {
        "nome": "Missão Suicida",
        "desc": "Mantenha todo o seu esquadrão vivo durante a missão final de Mass Effect 2.",
        "pts": 50
      },
      {
        "nome": "Salvador da Galáxia",
        "desc": "Conclua a campanha lendária do terceiro jogo.",
        "pts": 40
      },
      {
        "nome": "Herói de Noveria",
        "desc": "Resolva a crise científica nas montanhas frias de Noveria.",
        "pts": 20
      },
      {
        "nome": "Aliado de Confiança",
        "desc": "Complete a missão de lealdade de qualquer membro da equipe.",
        "pts": 25
      }
    ]
  },
  {
    "id_jogo": 21,
    "id_categoria": 3,
    "appid": 1551360,
    "titulo": "Forza Horizon 5",
    "preco": 249,
    "lancamento": "2021-11-09",
    "desenvolvedor": "Playground Games",
    "distribuidora": "Xbox Game Studios",
    "youtubeId": "FYH9n37B7Yw",
    "descricao": "Sua aventura Horizon definitiva está esperando! Explore as paisagens de mundo aberto vibrantes e em constante evolução do México com ação de direção ilimitada e divertida.",
    "conquistas": [
      {
        "nome": "Bem-vindo ao México",
        "desc": "Chegue ao Festival Horizon no México.",
        "pts": 10
      },
      {
        "nome": "Estrela da Fama",
        "desc": "Entre na lista do Hall da Fama do Horizon Festival.",
        "pts": 40
      },
      {
        "nome": "Explorador Definitivo",
        "desc": "Descubra todas as estradas do México.",
        "pts": 30
      },
      {
        "nome": "Piloto de Drift",
        "desc": "Consiga 3 estrelas em qualquer zona de drift no México.",
        "pts": 20
      },
      {
        "nome": "Caçador de Relíquias",
        "desc": "Encontre e restaure o primeiro carro abandonado no celeiro.",
        "pts": 30
      }
    ]
  },
  {
    "id_jogo": 22,
    "id_categoria": 3,
    "appid": 805550,
    "titulo": "Assetto Corsa Competizione",
    "preco": 159,
    "lancamento": "2019-05-29",
    "desenvolvedor": "Kunos Simulazioni",
    "distribuidora": "505 Games",
    "youtubeId": "mZ-r6-h2y4o",
    "descricao": "Assetto Corsa Competizione é o jogo de corrida oficial da Blancpain GT Series. A extraordinária qualidade de simulação permite viver a atmosfera real do campeonato GT3.",
    "conquistas": [
      {
        "nome": "Primeira Volta Limpa",
        "desc": "Complete uma volta inteira em Monza sem sair da pista.",
        "pts": 15
      },
      {
        "nome": "Campeão GT3",
        "desc": "Vença o campeonato da Blancpain GT Series na dificuldade máxima.",
        "pts": 60
      },
      {
        "nome": "Mestre da Chuva",
        "desc": "Vença uma corrida no molhado com duração de pelo menos 1 hora.",
        "pts": 30
      },
      {
        "nome": "Super Licença",
        "desc": "Obtenha a classificação máxima de segurança em corridas online.",
        "pts": 40
      },
      {
        "nome": "Especialista em Setup",
        "desc": "Crie e salve uma configuração personalizada para Spa-Francorchamps.",
        "pts": 15
      }
    ]
  },
  {
    "id_jogo": 23,
    "id_categoria": 3,
    "appid": 1222680,
    "titulo": "Need for Speed Heat",
    "preco": 279,
    "lancamento": "2019-11-08",
    "desenvolvedor": "Ghost Games",
    "distribuidora": "Electronic Arts",
    "youtubeId": "9ewiJJe_nYI",
    "descricao": "Trabalhe de dia e arrisque tudo à noite no Need for Speed Heat, um jogo de corrida de rua emocionante, onde a lei desaparece quando o sol se põe.",
    "conquistas": [
      {
        "nome": "O Começo de Tudo",
        "desc": "Vença a sua primeira corrida ilegal diurna.",
        "pts": 10
      },
      {
        "nome": "Fora da Lei",
        "desc": "Escape de uma perseguição policial de nível de alerta 5 à noite.",
        "pts": 40
      },
      {
        "nome": "Garagem dos Sonhos",
        "desc": "Adquira e equipe 5 carros hiper-esportivos.",
        "pts": 30
      },
      {
        "nome": "Rei do Estilo",
        "desc": "Personalize totalmente o visual de qualquer carro da sua garagem.",
        "pts": 20
      },
      {
        "nome": "Veloz e Furioso",
        "desc": "Alcance a velocidade de 350 km/h ininterruptos.",
        "pts": 25
      }
    ]
  },
  {
    "id_jogo": 24,
    "id_categoria": 3,
    "appid": 690790,
    "titulo": "DiRT Rally 2.0",
    "preco": 75.49,
    "lancamento": "2019-02-26",
    "desenvolvedor": "Codemasters",
    "distribuidora": "EA Sports",
    "youtubeId": "3kXqM66Z_6c",
    "descricao": "DiRT Rally 2.0 desafia você a percorrer uma seleção de locais de rali icônicos de todo o mundo, nos veículos de rali mais potentes já fabricados.",
    "conquistas": [
      {
        "nome": "Rali da Suécia",
        "desc": "Complete um estágio na neve sem sofrer colisões graves.",
        "pts": 15
      },
      {
        "nome": "Mecânica Rápida",
        "desc": "Substitua um pneu furado em menos de 45 segundos durante o rali.",
        "pts": 15
      },
      {
        "nome": "Lenda do Rali",
        "desc": "Vença o campeonato principal da categoria R5.",
        "pts": 50
      },
      {
        "nome": "Equipe de Apoio",
        "desc": "Contrate e treine um engenheiro-chefe para sua equipe de rali.",
        "pts": 20
      },
      {
        "nome": "Sob Pressão",
        "desc": "Complete um estágio de rali à noite sob neblina densa.",
        "pts": 35
      }
    ]
  },
  {
    "id_jogo": 25,
    "id_categoria": 3,
    "appid": 2108330,
    "titulo": "F1 23",
    "preco": 359,
    "lancamento": "2023-06-16",
    "desenvolvedor": "Codemasters",
    "distribuidora": "EA Sports",
    "youtubeId": "XhP3Xh4LOf8",
    "descricao": "Pise fundo no acelerador no F1 23, o jogo oficial do Campeonato Mundial de Fórmula 1 da FIA de 2023.",
    "conquistas": [
      {
        "nome": "Pole Position",
        "desc": "Consiga o melhor tempo de classificação em qualquer GP oficial.",
        "pts": 15
      },
      {
        "nome": "Mestre de Mônaco",
        "desc": "Vença o GP de Mônaco com danos realistas ativos.",
        "pts": 40
      },
      {
        "nome": "Pódio do Paddock",
        "desc": "Consiga terminar no pódio jogando no modo Carreira de Piloto.",
        "pts": 25
      },
      {
        "nome": "Estratégia Perfeita",
        "desc": "Faça um pit stop perfeito em menos de 2.5 segundos.",
        "pts": 15
      },
      {
        "nome": "Campeão do Mundo",
        "desc": "Vença o Campeonato Mundial de Pilotos de F1.",
        "pts": 60
      }
    ]
  },
  {
    "id_jogo": 26,
    "id_categoria": 3,
    "appid": 378860,
    "titulo": "Project CARS 2",
    "preco": 149,
    "lancamento": "2017-09-22",
    "desenvolvedor": "Slightly Mad Studios",
    "distribuidora": "Bandai Namco",
    "youtubeId": "AszP22m6s6c",
    "descricao": "Project CARS 2 oferece a alma do automobilismo no jogo de corrida mais bonito, autêntico e tecnologicamente avançado do mundo.",
    "conquistas": [
      {
        "nome": "Primeiro Contrato",
        "desc": "Assine o seu primeiro contrato profissional no modo carreira.",
        "pts": 10
      },
      {
        "nome": "24 Horas de Le Mans",
        "desc": "Conclua a corrida das 24 Horas de Le Mans no circuito oficial.",
        "pts": 50
      },
      {
        "nome": "Especialista em Clima",
        "desc": "Vença uma corrida que transiciona de sol para nevasca extrema.",
        "pts": 25
      },
      {
        "nome": "Piloto Versátil",
        "desc": "Vença corridas em 3 disciplinas diferentes no modo carreira.",
        "pts": 25
      },
      {
        "nome": "Zero Absoluto",
        "desc": "Complete uma corrida na neve em Nürburgring Nordschleife.",
        "pts": 30
      }
    ]
  },
  {
    "id_jogo": 27,
    "id_categoria": 3,
    "appid": 228380,
    "titulo": "Wreckfest",
    "preco": 99,
    "lancamento": "2018-06-14",
    "desenvolvedor": "Bugbear",
    "distribuidora": "THQ Nordic",
    "youtubeId": "2N_y2S789vA",
    "descricao": "Espere batidas épicas, brigas lado a lado sobre a linha de chegada e novas formas de ver o metal retorcer no Wreckfest!",
    "conquistas": [
      {
        "nome": "Demolição Total",
        "desc": "Destrua completamente 10 oponentes em uma arena de derby.",
        "pts": 20
      },
      {
        "nome": "Sobrevivente do Cortador de Grama",
        "desc": "Vença uma corrida utilizando o cortador de grama contra carros.",
        "pts": 30
      },
      {
        "nome": "Campeão da Sucata",
        "desc": "Conclua o campeonato da carreira principal.",
        "pts": 40
      },
      {
        "nome": "Demolidor Raiz",
        "desc": "Destrua o carro de um oponente usando o ônibus escolar.",
        "pts": 25
      },
      {
        "nome": "Colecionador de Peças",
        "desc": "Melhore o motor de qualquer veículo para o nível A.",
        "pts": 20
      }
    ]
  },
  {
    "id_jogo": 28,
    "id_categoria": 3,
    "appid": 1307710,
    "titulo": "GRID Legends",
    "preco": 299,
    "lancamento": "2022-02-24",
    "desenvolvedor": "Codemasters",
    "distribuidora": "Electronic Arts",
    "youtubeId": "FYH9n37B7Yw",
    "descricao": "GRID Legends oferece automobilismo eletrizante lado a lado e ação emocionante em todo o mundo. Crie as corridas dos seus sonhos e dispute corridas multijogador ao vivo.",
    "conquistas": [
      {
        "nome": "Rumo à Glória",
        "desc": "Conclua o primeiro episódio do modo história \"Rumo à Glória\".",
        "pts": 10
      },
      {
        "nome": "Lenda das Pistas",
        "desc": "Vença uma corrida da classe GRID com o caminhão de corrida.",
        "pts": 30
      },
      {
        "nome": "Colecionador de Troféus",
        "desc": "Vença 50 corridas no modo carreira.",
        "pts": 40
      },
      {
        "nome": "Estrela do Show",
        "desc": "Complete todos os desafios de patrocinadores do grid.",
        "pts": 30
      },
      {
        "nome": "Ultrapassagem Tripla",
        "desc": "Ultrapasse 3 adversários em uma única curva.",
        "pts": 15
      }
    ]
  },
  {
    "id_jogo": 29,
    "id_categoria": 3,
    "appid": 646910,
    "titulo": "The Crew 2",
    "preco": 149,
    "lancamento": "2018-06-29",
    "desenvolvedor": "Ivory Tower",
    "distribuidora": "Ubisoft",
    "youtubeId": "OHvKmByyDu0",
    "descricao": "Aproveite a cena do automobilismo americano enquanto explora e domina a terra, o ar e o mar dos Estados Unidos em um dos mundos abertos mais marcantes já criados.",
    "conquistas": [
      {
        "nome": "Multitalentoso",
        "desc": "Substitua seu veículo em movimento de avião para barco.",
        "pts": 15
      },
      {
        "nome": "Costa a Costa",
        "desc": "Conclua a corrida de Hypercar de Nova York até São Francisco.",
        "pts": 40
      },
      {
        "nome": "Estrela em Ascensão",
        "desc": "Alcance a categoria de piloto Famoso.",
        "pts": 20
      },
      {
        "nome": "Fotógrafo da Estrada",
        "desc": "Tire uma foto no modo foto durante um salto de 100 metros.",
        "pts": 15
      },
      {
        "nome": "Garagem Completa",
        "desc": "Compre o seu primeiro avião e o seu primeiro barco de corrida.",
        "pts": 25
      }
    ]
  },
  {
    "id_jogo": 30,
    "id_categoria": 3,
    "appid": 365960,
    "titulo": "rFactor 2",
    "preco": 99,
    "lancamento": "2013-03-27",
    "desenvolvedor": "Studio 397",
    "distribuidora": "Studio 397",
    "youtubeId": "mZ-r6-h2y4o",
    "descricao": "rFactor 2 é um simulador de corrida de computadores realista e altamente expansível do Studio 397. Ele apresenta simulação física de ponta em pneus e pistas.",
    "conquistas": [
      {
        "nome": "Simulador Puro",
        "desc": "Complete uma corrida de 30 minutos sem nenhuma assistência ativa.",
        "pts": 20
      },
      {
        "nome": "Desgaste Realista",
        "desc": "Conclua uma prova de longa duração desgastando e trocando 3 conjuntos de pneus.",
        "pts": 30
      },
      {
        "nome": "Vitória de Prestígio",
        "desc": "Vença uma corrida oficial contra a IA no nível 100 de dificuldade.",
        "pts": 50
      },
      {
        "nome": "Volta Perfeita",
        "desc": "Consiga o tempo ideal em uma sessão de treinos livres.",
        "pts": 20
      },
      {
        "nome": "Simulador Profissional",
        "desc": "Vença uma corrida no modo multiplayer oficial.",
        "pts": 40
      }
    ]
  },
  {
    "id_jogo": 31,
    "id_categoria": 4,
    "appid": 620,
    "titulo": "Portal 2",
    "preco": 32.99,
    "lancamento": "2011-04-18",
    "desenvolvedor": "Valve",
    "distribuidora": "Valve",
    "youtubeId": "tax4e4hBBZc",
    "descricao": "O Portal 2 baseia-se na fórmula premiada de jogabilidade inovadora, história e música que rendeu ao Portal original mais de 70 distinções na indústria.",
    "conquistas": [
      {
        "nome": "Acordar",
        "desc": "Sobreviva ao teste de polidez do robô.",
        "pts": 15
      },
      {
        "nome": "Fuga com Sucesso",
        "desc": "Escape do laboratório com a ajuda do Wheatley.",
        "pts": 30
      },
      {
        "nome": "Apenas Amigos",
        "desc": "Termine todos os testes coop com o mesmo robô.",
        "pts": 40
      },
      {
        "nome": "Ciência Cooperativa",
        "desc": "Complete todas as câmaras de teste no modo cooperativo.",
        "pts": 40
      },
      {
        "nome": "Conservação de Energia",
        "desc": "Resolva a câmara 10 de Portal 2 disparando apenas 2 portais.",
        "pts": 35
      }
    ]
  },
  {
    "id_jogo": 32,
    "id_categoria": 4,
    "appid": 1426210,
    "titulo": "It Takes Two",
    "preco": 199,
    "lancamento": "2021-03-26",
    "desenvolvedor": "Hazelight",
    "distribuidora": "Electronic Arts",
    "youtubeId": "OHvKmByyDu0",
    "descricao": "Embarque na jornada mais louca da sua vida em It Takes Two, uma aventura de plataforma inovadora criada puramente para o jogo cooperativo.",
    "conquistas": [
      {
        "nome": "Melhor Juntos",
        "desc": "Complete o primeiro capítulo cooperativo da árvore.",
        "pts": 15
      },
      {
        "nome": "Megalomaniaco dos Minijogos",
        "desc": "Encontre e dispute todos os minijogos escondidos.",
        "pts": 45
      },
      {
        "nome": "Força da Amizade",
        "desc": "Complete a história e salve o relacionamento de May e Cody.",
        "pts": 50
      },
      {
        "nome": "Minijogo Mania",
        "desc": "Vença o seu parceiro em 10 minijogos diferentes.",
        "pts": 20
      },
      {
        "nome": "Passageiros da Viagem",
        "desc": "Encontre o Easter Egg da cabine telefônica espacial.",
        "pts": 25
      }
    ]
  },
  {
    "id_jogo": 33,
    "id_categoria": 4,
    "appid": 210970,
    "titulo": "The Witness",
    "preco": 74.99,
    "lancamento": "2016-01-26",
    "desenvolvedor": "Thekla, Inc.",
    "distribuidora": "Thekla, Inc.",
    "youtubeId": "tax4e4hBBZc",
    "descricao": "Você acorda, sozinho, em uma ilha estranha cheia de quebra-cabeças que irão desafiar e surpreender você.",
    "conquistas": [
      {
        "nome": "Primeiro Painel",
        "desc": "Resolva o quebra-cabeça de entrada do jardim fechado.",
        "pts": 10
      },
      {
        "nome": "Laser Ativo",
        "desc": "Ative o primeiro laser direcionado ao topo da montanha.",
        "pts": 25
      },
      {
        "nome": "O Desafio",
        "desc": "Resolva a sequência final de quebra-cabeças sob tempo limitado com música clássica.",
        "pts": 60
      },
      {
        "nome": "Perspectiva Correta",
        "desc": "Encontre o primeiro quebra-cabeça ambiental oculto na ilha.",
        "pts": 30
      },
      {
        "nome": "Conhecimento Profundo",
        "desc": "Decifre a gravação de áudio filosófica secreta.",
        "pts": 20
      }
    ]
  },
  {
    "id_jogo": 34,
    "id_categoria": 4,
    "appid": 736260,
    "titulo": "Baba Is You",
    "preco": 29.99,
    "lancamento": "2019-03-13",
    "desenvolvedor": "Hempuli Oy",
    "distribuidora": "Hempuli Oy",
    "youtubeId": "UAO2urG23S4",
    "descricao": "Baba Is You é um jogo de quebra-cabeça inovador no qual as regras que você deve seguir estão presentes como blocos físicos com os quais você pode interagir.",
    "conquistas": [
      {
        "nome": "A Regra é Clara",
        "desc": "Altere a sua primeira regra movendo os blocos de texto.",
        "pts": 10
      },
      {
        "nome": "Vencedor Baba",
        "desc": "Altere as regras do mapa para se tornar a própria bandeira de vitória.",
        "pts": 25
      },
      {
        "nome": "Mestre do Texto",
        "desc": "Conclua a área secreta do mapa \"Espaço\".",
        "pts": 40
      },
      {
        "nome": "Quebra de Paradigma",
        "desc": "Resolva o enigma onde \"BABA\" é \"WALL\".",
        "pts": 30
      },
      {
        "nome": "Desafio Cósmico",
        "desc": "Complete o mapa oculto da constelação.",
        "pts": 35
      }
    ]
  },
  {
    "id_jogo": 35,
    "id_categoria": 4,
    "appid": 1003590,
    "titulo": "Tetris Effect: Connected",
    "preco": 74.99,
    "lancamento": "2021-08-18",
    "desenvolvedor": "Monstars Inc.",
    "distribuidora": "Enhance",
    "youtubeId": "OHvKmByyDu0",
    "descricao": "Tetris Effect: Connected é Tetris como você nunca viu, ouviu ou sentiu antes — uma reinvenção viciante, única e visualmente deslumbrante de um dos jogos de quebra-cabeça mais populares de todos os tempos.",
    "conquistas": [
      {
        "nome": "Modo Zona",
        "desc": "Limpe 12 linhas consecutivas durante uma única ativação da Zona.",
        "pts": 20
      },
      {
        "nome": "Viajante Cósmico",
        "desc": "Conclua a campanha da Jornada Espacial.",
        "pts": 30
      },
      {
        "nome": "Tetris Definitivo",
        "desc": "Consiga uma pontuação de Rank S em qualquer fase de efeito.",
        "pts": 40
      },
      {
        "nome": "Mestre da Velocidade",
        "desc": "Limpe 40 linhas no modo Marathon em menos de 3 minutos.",
        "pts": 30
      },
      {
        "nome": "Ritmo Perfeito",
        "desc": "Complete um nível com 100% de precisão de batidas.",
        "pts": 25
      }
    ]
  },
  {
    "id_jogo": 36,
    "id_categoria": 4,
    "appid": 48110,
    "titulo": "Limbo",
    "preco": 34.99,
    "lancamento": "2011-08-02",
    "desenvolvedor": "Playdead",
    "distribuidora": "Playdead",
    "youtubeId": "tax4e4hBBZc",
    "descricao": "Sem saber o destino de sua irmã, um menino entra no Limbo. Um clássico de quebra-cabeças atmosférico e misterioso.",
    "conquistas": [
      {
        "nome": "Sombra na Floresta",
        "desc": "Encontre o primeiro ovo luminoso escondido no início da floresta.",
        "pts": 15
      },
      {
        "nome": "Caminho Correto",
        "desc": "Resolva o enigma do elevador magnético giratório.",
        "pts": 25
      },
      {
        "nome": "Não Vale Morrer",
        "desc": "Conclua o jogo inteiro em uma única sessão morrendo 5 vezes ou menos.",
        "pts": 60
      },
      {
        "nome": "Fuga da Aranha",
        "desc": "Escape da perseguição da aranha gigante na floresta.",
        "pts": 15
      },
      {
        "nome": "Gravidade Zero",
        "desc": "Resolva o quebra-cabeça da gravidade invertida no hotel.",
        "pts": 25
      }
    ]
  },
  {
    "id_jogo": 37,
    "id_categoria": 4,
    "appid": 304430,
    "titulo": "Inside",
    "preco": 74.99,
    "lancamento": "2016-07-07",
    "desenvolvedor": "Playdead",
    "distribuidora": "Playdead",
    "youtubeId": "tax4e4hBBZc",
    "descricao": "Perseguido e sozinho, um menino se vê arrastado para o centro de um projeto sombrio.",
    "conquistas": [
      {
        "nome": "Desconexão",
        "desc": "Desconecte o primeiro dispositivo de controle mental secreto.",
        "pts": 20
      },
      {
        "nome": "Profundezas do Aquário",
        "desc": "Resolva o enigma da criatura da água usando o submarino.",
        "pts": 30
      },
      {
        "nome": "Final Alternativo",
        "desc": "Encontre e desligue todas as esferas de energia para liberar o final secreto.",
        "pts": 50
      },
      {
        "nome": "Pesquisa Secreta",
        "desc": "Desbloqueie a sala do reator nuclear oculto no complexo.",
        "pts": 30
      },
      {
        "nome": "Respirando Fundo",
        "desc": "Cruze a área alagada sem se afogar.",
        "pts": 20
      }
    ]
  },
  {
    "id_jogo": 38,
    "id_categoria": 4,
    "appid": 257510,
    "titulo": "The Talos Principle",
    "preco": 89,
    "lancamento": "2014-12-11",
    "desenvolvedor": "Croteam",
    "distribuidora": "Devolver Digital",
    "youtubeId": "OHvKmByyDu0",
    "descricao": "The Talos Principle é um jogo filosófico de quebra-cabeça em primeira pessoa criado pela Croteam e escrito por Tom Jubert e Jonas Kyratzes.",
    "conquistas": [
      {
        "nome": "Sigilo de Bronze",
        "desc": "Resolva o quebra-cabeça e colete o primeiro sigilo de bronze.",
        "pts": 10
      },
      {
        "nome": "O Caminho de Elohim",
        "desc": "Suba até o topo da grande torre desafiando as ordens divinas.",
        "pts": 50
      },
      {
        "nome": "Eternidade Garantida",
        "desc": "Decida se tornar uma inteligência imortal no banco de dados.",
        "pts": 40
      },
      {
        "nome": "Sigilo de Ouro",
        "desc": "Resolva todos os quebra-cabeças de sigilos dourados.",
        "pts": 35
      },
      {
        "nome": "Estrela Oculta",
        "desc": "Encontre 10 estrelas secretas escondidas nos mundos.",
        "pts": 40
      }
    ]
  },
  {
    "id_jogo": 39,
    "id_categoria": 4,
    "appid": 1049410,
    "titulo": "Superliminal",
    "preco": 59.99,
    "lancamento": "2020-11-05",
    "desenvolvedor": "Pillow Castle",
    "distribuidora": "Pillow Castle",
    "youtubeId": "tax4e4hBBZc",
    "descricao": "Percepção é realidade. Superliminal é um quebra-cabeça em primeira pessoa baseado em perspectiva forçada e ilusões de ótica.",
    "conquistas": [
      {
        "nome": "Tamanho Importa",
        "desc": "Redimensione um objeto em pelo menos 100 vezes o seu tamanho inicial.",
        "pts": 15
      },
      {
        "nome": "Despertar",
        "desc": "Conclua o programa de terapia de sonhos do Dr. Glenn Pierce.",
        "pts": 35
      },
      {
        "nome": "Corrida do Sonho",
        "desc": "Termine o jogo no modo Speedrun em menos de 30 minutos.",
        "pts": 50
      },
      {
        "nome": "Perspectiva Invertida",
        "desc": "Ande pelo teto alterando a gravidade de uma sala.",
        "pts": 25
      },
      {
        "nome": "Sonho Lúcido",
        "desc": "Resolva o labirinto de portas idênticas.",
        "pts": 20
      }
    ]
  },
  {
    "id_jogo": 40,
    "id_categoria": 4,
    "appid": 1927720,
    "titulo": "Monument Valley",
    "preco": 19.99,
    "lancamento": "2022-07-12",
    "desenvolvedor": "ustwo games",
    "distribuidora": "ustwo games",
    "youtubeId": "OHvKmByyDu0",
    "descricao": "Manipule arquiteturas impossíveis e guie uma princesa silenciosa por um mundo incrivelmente belo.",
    "conquistas": [
      {
        "nome": "O Jardim",
        "desc": "Conclua o capítulo inicial da jornada geométrica.",
        "pts": 10
      },
      {
        "nome": "Geometria Sagrada",
        "desc": "Resolva o enigma do templo flutuante giratório.",
        "pts": 25
      },
      {
        "nome": "Perdão da Princesa",
        "desc": "Ajude Ida a devolver a última figura geométrica ao altar.",
        "pts": 40
      },
      {
        "nome": "Caminho Oculto",
        "desc": "Resolva o quebra-cabeça da ilusão de ótica da escada de Penrose.",
        "pts": 20
      },
      {
        "nome": "O Retorno",
        "desc": "Complete todos os níveis de Monument Valley: Forgotten Shores.",
        "pts": 35
      }
    ]
  },
  {
    "id_jogo": 41,
    "id_categoria": 5,
    "appid": 2114740,
    "titulo": "EA SPORTS FC 24",
    "preco": 359,
    "lancamento": "2023-09-29",
    "desenvolvedor": "EA Canada",
    "distribuidora": "Electronic Arts",
    "youtubeId": "XhP3Xh4LOf8",
    "descricao": "O EA SPORTS FC 24 traz para você o Jogo de Todo Mundo, a experiência mais autêntica de futebol de todos os tempos com HyperMotionV e PlayStyles.",
    "conquistas": [
      {
        "nome": "Chute de Bicicleta",
        "desc": "Marque um gol com um chute acrobático de bicicleta na área.",
        "pts": 25
      },
      {
        "nome": "Mestre do Ultimate",
        "desc": "Monte um esquadrão com entrosamento 100 no Ultimate Team.",
        "pts": 40
      },
      {
        "nome": "Subida de Divisão",
        "desc": "Consiga promoção no modo Rivais de Divisão.",
        "pts": 30
      },
      {
        "nome": "Estrela do Draft",
        "desc": "Consiga 4 vitórias seguidas em uma sessão de Draft Online.",
        "pts": 35
      },
      {
        "nome": "Carreira Lendária",
        "desc": "Seja contratado pelo Real Madrid ou Barcelona no modo Carreira.",
        "pts": 40
      }
    ]
  },
  {
    "id_jogo": 42,
    "id_categoria": 5,
    "appid": 252950,
    "titulo": "Rocket League",
    "preco": 0,
    "lancamento": "2015-07-07",
    "desenvolvedor": "Psyonix LLC",
    "distribuidora": "Epic Games",
    "youtubeId": "c80JyCol6a0",
    "descricao": "Futebol encontra caos veicular em Rocket League! Escolha entre diversos veículos equipados com foguetes para marcar gols acrobáticos inacreditáveis.",
    "conquistas": [
      {
        "nome": "Piloto Acrobático",
        "desc": "Marque um gol enquanto dirige pela parede da arena.",
        "pts": 15
      },
      {
        "nome": "Campeão da Copa",
        "desc": "Vença um campeonato de torneio oficial de 3 contra 3.",
        "pts": 35
      },
      {
        "nome": "Turbo Definitivo",
        "desc": "Mantenha o turbo ativo por 10 segundos ininterruptos.",
        "pts": 20
      },
      {
        "nome": "Dono da Bola",
        "desc": "Faça um gol aéreo tocando na bola acima da linha do gol.",
        "pts": 25
      },
      {
        "nome": "Mestre da Defesa",
        "desc": "Consiga 5 defesas difíceis na mesma partida.",
        "pts": 20
      }
    ]
  },
  {
    "id_jogo": 43,
    "id_categoria": 5,
    "appid": 2338770,
    "titulo": "NBA 2K24",
    "preco": 299,
    "lancamento": "2023-09-08",
    "desenvolvedor": "Visual Concepts",
    "distribuidora": "2K Games",
    "youtubeId": "XhP3Xh4LOf8",
    "descricao": "Experimente a cultura do basquete no NBA 2K24. Desfrute de bastante ação pura e opções ilimitadas de personalização do MyPLAYER no modo MyCAREER.",
    "conquistas": [
      {
        "nome": "Double-Double",
        "desc": "Consiga dois dígitos em duas estatísticas diferentes na partida.",
        "pts": 15
      },
      {
        "nome": "Anel do Campeonato",
        "desc": "Vença a série final da NBA jogando no modo franquia.",
        "pts": 45
      },
      {
        "nome": "Draft de Elite",
        "desc": "Seja escolhido no Top 5 da primeira rodada do Draft do MyCAREER.",
        "pts": 30
      },
      {
        "nome": "Triplo-Duplo",
        "desc": "Consiga dois dígitos em três estatísticas diferentes no MyCAREER.",
        "pts": 35
      },
      {
        "nome": "Salão da Fama",
        "desc": "Seja induzido ao Hall da Fama do Basquete no MyCAREER.",
        "pts": 50
      }
    ]
  },
  {
    "id_jogo": 44,
    "id_categoria": 5,
    "appid": 1588010,
    "titulo": "PGA Tour 2K23",
    "preco": 299,
    "lancamento": "2022-10-13",
    "desenvolvedor": "HB Studios",
    "distribuidora": "2K Games",
    "youtubeId": "OHvKmByyDu0",
    "descricao": "Vá para os campos de golfe com estilo no PGA Tour 2K23. Apresenta o novíssimo modo MyPLAYER, torneios de golfe licenciados e muito mais.",
    "conquistas": [
      {
        "nome": "Hole-in-One",
        "desc": "Acerte a bola no buraco com apenas uma tacada de saída.",
        "pts": 50
      },
      {
        "nome": "Campeão da FedExCup",
        "desc": "Vença o campeonato da FedExCup no modo carreira profissional.",
        "pts": 40
      },
      {
        "nome": "Abaixo do Par",
        "desc": "Complete um circuito inteiro com 3 tacadas abaixo do par.",
        "pts": 20
      },
      {
        "nome": "Tacada Perfeita",
        "desc": "Consiga uma pontuação de Eagle em um buraco de par 5.",
        "pts": 25
      },
      {
        "nome": "Campeão Major",
        "desc": "Vença o The Players Championship.",
        "pts": 45
      }
    ]
  },
  {
    "id_jogo": 45,
    "id_categoria": 5,
    "appid": 1948410,
    "titulo": "WWE 2K23",
    "preco": 349,
    "lancamento": "2023-03-14",
    "desenvolvedor": "Visual Concepts",
    "distribuidora": "2K Games",
    "youtubeId": "XhP3Xh4LOf8",
    "descricao": "WWE 2K23 é Ainda Mais Forte com recursos expandidos, gráficos deslumbrantes e o elenco definitivo de Superestrelas e Lendas da WWE.",
    "conquistas": [
      {
        "nome": "Showcase Master",
        "desc": "Complete todos os combates históricos no modo John Cena Showcase.",
        "pts": 35
      },
      {
        "nome": "Vitória Real Rumble",
        "desc": "Vença a luta do Royal Rumble de 30 homens entrando no número 1.",
        "pts": 45
      },
      {
        "nome": "Lenda da WrestleMania",
        "desc": "Vença um combate pelo cinturão mundial na WrestleMania.",
        "pts": 30
      },
      {
        "nome": "Rei do Ringue",
        "desc": "Vença uma luta de jaula de aço (Steel Cage) sem sofrer pin.",
        "pts": 25
      },
      {
        "nome": "Lenda do Royal Rumble",
        "desc": "Elimine 10 oponentes no mesmo Royal Rumble.",
        "pts": 35
      }
    ]
  },
  {
    "id_jogo": 46,
    "id_categoria": 5,
    "appid": 1904760,
    "titulo": "Tony Hawk's Pro Skater 1 + 2",
    "preco": 199,
    "lancamento": "2023-10-03",
    "desenvolvedor": "Vicarious Visions",
    "distribuidora": "Activision",
    "youtubeId": "c80JyCol6a0",
    "descricao": "Jogue os jogos de skate mais icônicos de todos os tempos em uma coleção épica, recriados do zero em alta definição.",
    "conquistas": [
      {
        "nome": "High Score",
        "desc": "Consiga 100.000 pontos em uma única corrida de skate de 2 minutos.",
        "pts": 20
      },
      {
        "nome": "O Grande 900",
        "desc": "Execute a manobra lendária \"The 900\" com Tony Hawk.",
        "pts": 30
      },
      {
        "nome": "Colecionador de Fitas",
        "desc": "Colete todas as fitas de vídeo secretas em todas as fases.",
        "pts": 40
      },
      {
        "nome": "Mestre do Combo",
        "desc": "Execute um combo de manobras de 500.000 pontos.",
        "pts": 35
      },
      {
        "nome": "Skatista do Ano",
        "desc": "Complete todos os objetivos de skate no mapa do Hangar.",
        "pts": 25
      }
    ]
  },
  {
    "id_jogo": 47,
    "id_categoria": 5,
    "appid": 2140330,
    "titulo": "Madden NFL 24",
    "preco": 359,
    "lancamento": "2023-08-18",
    "desenvolvedor": "EA Tiburon",
    "distribuidora": "Electronic Arts",
    "youtubeId": "XhP3Xh4LOf8",
    "descricao": "Experimente a tecnologia mais recente de jogabilidade SAPIEN no Madden NFL 24, com movimentos mais realistas e novas mecânicas de passe.",
    "conquistas": [
      {
        "nome": "Touchdown Aéreo",
        "desc": "Marque um touchdown após um passe longo de 50 jardas.",
        "pts": 20
      },
      {
        "nome": "Super Bowl Champion",
        "desc": "Vença a grande final do Super Bowl no modo franquia.",
        "pts": 50
      },
      {
        "nome": "Muralha Defensiva",
        "desc": "Consiga interceptar 3 passes na mesma partida.",
        "pts": 30
      },
      {
        "nome": "Passe de Ouro",
        "desc": "Complete 10 passes seguidos sem interceptações na partida.",
        "pts": 20
      },
      {
        "nome": "Campeão da NFL",
        "desc": "Vença o Super Bowl jogando com o Kansas City Chiefs.",
        "pts": 45
      }
    ]
  },
  {
    "id_jogo": 48,
    "id_categoria": 5,
    "appid": 2252570,
    "titulo": "Football Manager 2024",
    "preco": 299,
    "lancamento": "2023-11-06",
    "desenvolvedor": "Sports Interactive",
    "distribuidora": "SEGA",
    "youtubeId": "OHvKmByyDu0",
    "descricao": "Gerencie os maiores times de futebol do mundo e atinja o estrelato no Football Manager 2024, a edição mais completa da série.",
    "conquistas": [
      {
        "nome": "Subida de Divisão",
        "desc": "Consiga promoção da divisão de acesso para a liga principal do país.",
        "pts": 20
      },
      {
        "nome": "Tríplice Coroa",
        "desc": "Vença o campeonato nacional, a copa nacional e a copa continental na mesma temporada.",
        "pts": 60
      },
      {
        "nome": "Olho Clínico",
        "desc": "Contrate um jogador jovem promissor (Wonderkid) por um valor baixo.",
        "pts": 20
      },
      {
        "nome": "Inbatível",
        "desc": "Consiga uma sequência de 20 partidas invictas na liga.",
        "pts": 35
      },
      {
        "nome": "Descobridor de Talentos",
        "desc": "Contrate um olheiro nível mundial para sua comissão técnica.",
        "pts": 15
      }
    ]
  },
  {
    "id_jogo": 49,
    "id_categoria": 5,
    "appid": 1203620,
    "titulo": "DiRT 5",
    "preco": 109,
    "lancamento": "2020-11-05",
    "desenvolvedor": "Codemasters",
    "distribuidora": "EA Sports",
    "youtubeId": "3kXqM66Z_6c",
    "descricao": "Solte o freio no DIRT 5 - a experiência de corrida off-road mais ousada de todos os tempos, com uma carreira repleta de estrelas, tela dividida para quatro jogadores e muito mais.",
    "conquistas": [
      {
        "nome": "Derrapagem Estilosa",
        "desc": "Acumule 500 metros de drift contínuo no gelo.",
        "pts": 20
      },
      {
        "nome": "Lenda do Off-road",
        "desc": "Conclua a história principal do modo carreira narrada por lendas do automobilismo.",
        "pts": 40
      },
      {
        "nome": "Criador de Pistas",
        "desc": "Crie e publique uma arena customizada no modo Playground.",
        "pts": 30
      },
      {
        "nome": "Corrida na Lama",
        "desc": "Vença uma corrida de Rallycross sob chuva torrencial.",
        "pts": 20
      },
      {
        "nome": "Colecionador de Carros",
        "desc": "Adquira todos os veículos da classe Unlimited.",
        "pts": 30
      }
    ]
  },
  {
    "id_jogo": 50,
    "id_categoria": 5,
    "appid": 2290180,
    "titulo": "Riders Republic",
    "preco": 149,
    "lancamento": "2021-10-28",
    "desenvolvedor": "Ubisoft Annecy",
    "distribuidora": "Ubisoft",
    "youtubeId": "OHvKmByyDu0",
    "descricao": "Entre no enorme playground multijogador do Riders Republic! Pegue sua bike, esquis, snowboard ou wingsuit e explore um paraíso de esportes radicais em mundo aberto.",
    "conquistas": [
      {
        "nome": "Trilha Extrema",
        "desc": "Vença a corrida lendária de mountain bike Red Bull Rampage.",
        "pts": 25
      },
      {
        "nome": "Voo do Falcão",
        "desc": "Complete o desafio de voo raso com o wingsuit de foguete.",
        "pts": 35
      },
      {
        "nome": "Multidão Radical",
        "desc": "Participe de uma corrida em massa oficial contra 50 jogadores simultâneos.",
        "pts": 30
      },
      {
        "nome": "Lenda dos Alpes",
        "desc": "Complete o percurso lendário de wingsuit no Grand Teton.",
        "pts": 35
      },
      {
        "nome": "Truques no Ar",
        "desc": "Execute um salto com rotação de 1440 graus no snowboard.",
        "pts": 30
      }
    ]
  }
];

async function seed() {
  console.log('Connecting to MySQL with config:', { ...config, password: '****' });
  const db = await mysql.createConnection(config);

  try {
    console.log('Cleaning up existing database tables...');
    await db.query('SET FOREIGN_KEY_CHECKS = 0;');
    await db.query('TRUNCATE TABLE Usuario_Conquistas;');
    await db.query('TRUNCATE TABLE Conquistas;');
    await db.query('TRUNCATE TABLE Biblioteca;');
    await db.query('TRUNCATE TABLE Amigos;');
    await db.query('TRUNCATE TABLE Atividades;');
    await db.query('TRUNCATE TABLE Avaliacoes;');
    await db.query('TRUNCATE TABLE Carrinho;');
    await db.query('TRUNCATE TABLE Wishlist;');
    await db.query('TRUNCATE TABLE Screenshots_Jogos;');
    await db.query('TRUNCATE TABLE Videos_Jogos;');
    await db.query('TRUNCATE TABLE Jogos;');
    await db.query('TRUNCATE TABLE Categorias;');
    await db.query('TRUNCATE TABLE Usuarios;');
    await db.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('Seeding Categorias...');
    await db.query(`
      INSERT INTO Categorias (id_categoria, nome_categoria, descricao) VALUES
      (1, 'Ação', 'Jogos de combate rápido, tiro e adrenalina.'),
      (2, 'RPG', 'Role-playing games com histórias profundas e progressão de personagens.'),
      (3, 'Corrida', 'Simuladores de corrida e jogos de direção em alta velocidade.'),
      (4, 'Puzzle', 'Desafios intelectuais, quebra-cabeças e lógica.'),
      (5, 'Esportes', 'Simulações de esportes reais como futebol, basquete e afins.')
    `);

    console.log('Seeding Usuarios...');
    await db.query(`
      INSERT INTO Usuarios (id_usuario, nome, email, senha, avatar_url, saldo_carteira, data_cadastro) VALUES
      (1, 'Alice', 'alice@example.com', 'senha', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alice', 500.00, '2026-01-01 10:00:00'),
      (2, 'Bob', 'bob@example.com', 'senha', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Bob', 250.50, '2026-02-15 14:30:00'),
      (3, 'Charlie', 'charlie@example.com', 'senha', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Charlie', 20.00, '2026-03-20 18:45:00')
    `);

    console.log('Seeding 50 Jogos dynamically using Steam CDN...');
    for (const game of gamesData) {
      const capaUrl = `https://shared.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`;
      const bannerUrl = `https://shared.steamstatic.com/store_item_assets/steam/apps/${game.appid}/library_hero.jpg`;
      
      await db.query(`
        INSERT INTO Jogos (id_jogo, titulo, descricao, preco, data_lancamento, desenvolvedor, distribuidora, capa_url, banner_url, id_categoria)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        game.id_jogo, game.titulo, game.descricao, game.preco, game.lancamento,
        game.desenvolvedor, game.distribuidora, capaUrl, bannerUrl, game.id_categoria
      ]);
    }

    console.log('Seeding Videos & Screenshots for 50 games...');
    let ssId = 1;
    let videoId = 1;
    for (const game of gamesData) {
      // Seeding YouTube Trailer
      const ytUrl = `https://www.youtube.com/watch?v=${game.youtubeId}`;
      await db.query(`
        INSERT INTO Videos_Jogos (id_video, id_jogo, video_url)
        VALUES (?, ?, ?)
      `, [videoId++, game.id_jogo, ytUrl]);

      // Seeding 3 screenshots per game using predictable Steam CDN assets
      const ssUrl1 = `https://shared.steamstatic.com/store_item_assets/steam/apps/${game.appid}/capsule_616x353.jpg`;
      const ssUrl2 = `https://shared.steamstatic.com/store_item_assets/steam/apps/${game.appid}/library_600x900_2x.jpg`;
      const ssUrl3 = `https://shared.steamstatic.com/store_item_assets/steam/apps/${game.appid}/page_bg_generated_v6b.jpg`;
      
      await db.query(`
        INSERT INTO Screenshots_Jogos (id_screenshot, id_jogo, imagem_url, ordem)
        VALUES (?, ?, ?, 1)
      `, [ssId++, game.id_jogo, ssUrl1]);
      
      await db.query(`
        INSERT INTO Screenshots_Jogos (id_screenshot, id_jogo, imagem_url, ordem)
        VALUES (?, ?, ?, 2)
      `, [ssId++, game.id_jogo, ssUrl2]);
      
      await db.query(`
        INSERT INTO Screenshots_Jogos (id_screenshot, id_jogo, imagem_url, ordem)
        VALUES (?, ?, ?, 3)
      `, [ssId++, game.id_jogo, ssUrl3]);
    }

    console.log('Seeding Achievements...');
    let achId = 1;
    for (const game of gamesData) {
      for (const ach of game.conquistas) {
        const iconeUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${ach.nome}`;
        await db.query(`
          INSERT INTO Conquistas (id_conquista, id_jogo, nome_conquista, descricao, pontos, icone_url)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [achId++, game.id_jogo, ach.nome, ach.desc, ach.pts, iconeUrl]);
      }
    }

    console.log('Seeding Biblioteca...');
    await db.query(`
      INSERT INTO Biblioteca (id_usuario, id_jogo, data_aquisicao, horas_jogadas) VALUES
      (1, 1, '2026-01-05 18:20:00', 124.50),
      (1, 2, '2026-03-10 12:00:00', 45.20),
      (1, 11, '2026-04-12 11:30:00', 32.80),
      (2, 1, '2026-02-16 19:00:00', 12.00),
      (2, 21, '2026-04-01 10:15:00', 88.70),
      (2, 13, '2026-05-10 15:20:00', 142.10),
      (3, 31, '2026-05-01 22:30:00', 4.30),
      (3, 32, '2026-06-01 20:00:00', 16.50)
    `);

    console.log('Seeding Usuario_Conquistas...');
    await db.query(`
      INSERT INTO Usuario_Conquistas (id_usuario, id_conquista, data_desbloqueio) VALUES
      (1, 1, '2026-01-05 20:15:00'),
      (1, 2, '2026-01-10 15:40:00'),
      (1, 4, '2026-03-15 22:10:00'),
      (2, 1, '2026-02-17 11:20:00'),
      (2, 7, '2026-04-02 09:30:00'),
      (3, 10, '2026-05-02 23:10:00')
    `);

    console.log('Seeding Amigos...');
    await db.query(`
      INSERT INTO Amigos (id_amizade, id_usuario, id_amigo, status_amizade, data_solicitacao, data_aceite) VALUES
      (1, 1, 2, 'aceita', '2026-01-10 12:00:00', '2026-01-10 12:30:00'),
      (2, 1, 3, 'pendente', '2026-06-20 15:00:00', NULL),
      (3, 2, 3, 'aceita', '2026-03-01 10:00:00', '2026-03-02 11:00:00')
    `);

    console.log('Seeding Atividades...');
    await db.query(`
      INSERT INTO Atividades (id_atividade, id_usuario, id_jogo, tipo_atividade, descricao, visibilidade, data_hora) VALUES
      (1, 1, 11, 'conquista', 'Alice desbloqueou a conquista "Margit, o Agouro Caído" em Elden Ring!', 'publica', '2026-03-15 22:10:00'),
      (2, 2, 21, 'jogou', 'Bob jogou Forza Horizon 5 por mais 3.5 horas.', 'amigos', '2026-06-21 17:30:00'),
      (3, 1, 11, 'comprou', 'Alice adquiriu o jogo Elden Ring.', 'publica', '2026-03-10 12:00:00')
    `);

    console.log('Seeding Avaliacoes...');
    await db.query(`
      INSERT INTO Avaliacoes (id_avaliacao, id_usuario, id_jogo, nota, comentario, recomendaria, data_avaliacao) VALUES
      (1, 1, 11, 10, 'Jogo fenomenal! Desafiador e com uma exploração incrível de mundo aberto. Recomendo muito!', 1, '2026-03-20 15:30:00'),
      (2, 2, 21, 9, 'Gráficos fantásticos e jogabilidade super divertida. A ambientação no México é espetacular!', 1, '2026-04-10 18:20:00')
    `);

    console.log('Seeding Wishlist...');
    await db.query(`
      INSERT INTO Wishlist (id_usuario, id_jogo, data_adicao) VALUES
      (1, 12, '2026-02-01 14:00:00'),
      (1, 13, '2026-03-01 09:00:00'),
      (3, 11, '2026-04-15 11:30:00')
    `);

    console.log('Database seeded successfully with 50 games!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await db.end();
  }
}

seed();
