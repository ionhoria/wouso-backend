const { Question, Session } = require('./models')

const setup = async () => {
  const exists = await Session.findOne({
    where: {
      name: 'Grand Quest'
    }
  })

  const qs = [
    {
      text: 'Rulează start-wouso si obține codul.'
    },
    {
      text:
        'Rulează executabilul de la  ~/inputs/hello. Asigură-te că-l rulezi cu drepturile corespunzătoare.'
    },
    {
      text:
        'Find out the password in ~/inputs/password. May the strings be with you.'
    },
    { text: 'Asamblează mesajul din ~/inputs/snowflakes/.' },
    { text: 'Găsește mesajul din ~/inputs/secret.pcap.' },
    {
      text:
        'În frunte cu Molotov, niște generali ruși protejează parola din ce în ce mai bine. Descoperă-i unul câte unul. (PS. Se zvonește că își fac veacul pe undeva prin /var/log)'
    },
    {
      text:
        'În ~/inputs/curl-7.34.0 găsești codul sursă al utilitarului curl (uso edition). Compilează și rulează cu parametrul --uso.'
    },
    {
      text:
        'În fișierul ~/inputs/mistletoe ai un md5 al unui rozător ascuns pe undeva. Caută-l bine bine, răscolește peste tot, că sigur îți va da răspunsul.'
    },
    { text: 'Investighează fișierul ~/inputs/breakthrough.pyc.' },
    {
      text:
        'Ai la dispoziție o listă cu toți dictatorii din istorie, într-o bază de date mongoDB. Avem nevoie de codul secret al celui care a condus pentru 42 de ani.'
    },
    {
      text:
        'The Betrayer, The Demon Hunter, The Lord of Shadows sau, pur și simplu, Illidan. Parola sa este răspunsul.'
    },
    {
      text:
        'Deschide cutia Pandorei. O găsești în ~/inputs/pandora. Indiciu: 5 caractere'
    },
    { text: 'Crack the hash in ~/inputs/crack.' },
    {
      text:
        'Decriptează mesajul din ~/inputs/rsa/secret folosind cheia din ~/inputs/rsa/key.'
    },
    { text: 'Găsește mesajul ascuns din ~/inputs/mandel.pgm.' },
    { text: 'Asigură-te că ~/input/l33t este într-adevăr leet.' },
    { text: 'Pune cap la cap fișierele imagine din ~/inputs/xplode/.' },
    {
      text:
        'În containerul LXC cu numele mac, în contul utilizatorului ubuntu (cu parola ubuntu) se găsește un executabil denumit receive-ip: este un server UDP pe care trebuie să-l porniți. Pentru a obține răspunsul secret conectează-te peste UDP folosind adresa IP sursă 4.3.2.1.'
    },
    {
      text:
        'E ceva ciudat cu imaginea din ~/inputs/wouso-background.jpg. Indiciu: Imaginea inițială o găsești [aici](http://swarm.cs.pub.ro/~vciurel/.wouso/breathe.jpg?fbclid=IwAR3Z9ON_6iGb3jU8ornrhRL75PGWaQtGHvcebC06ZrYNftexZbv530k3r94).'
    },
    {
      text:
        'Pornește serverul din ~/inputs/twinkle-server. Urmărește porturile UDP folosite. Indiciu: Începe cu nota C.'
    },
    {
      text:
        'Trimite un șir care reprezintă un script Brainfuck ce afișează numele tău de utilizator.'
    },
    {
      text:
        'Un spiriduș energic și curios a găsit un metal prețios necunoscut. Se spune că poate fi manevrat doar cu o tehnologie nouă, diferită de cele folosite curent. De asemenea, a găsit un scroll cu indicații de folosire a tehnologiei. Găsești ambele elemente în ~/inputs/arm-printer. Ajută-l să folosească scroll-ul cu indicații pentru a construi un alt metal care să poată fi îmbinat cu metalul prețios. Ustensilele necesare se găsesc în ~/packages/arm-2010q1/bin/.'
    },
    {
      text:
        'Măritul conducător are pentru tine o misiune! Vrea să îi aduci mesajul ascuns în inima Pământului! Pentru a duce la bun sfârșit misiunea, îți dăruiește piatra magică, Gardamus, și un pergament vechi. Trebuie să ajungi în nucleul Pământului. Odată ajuns acolo, trebuie să îndeplinești un ritual: * aruncă Gardamus-ul în foc * caută pe pereții Kallsys codul pentru harlequin_answer * scrie codul găsit în pergament * înfășoară pergamentul corespunzător * aruncă pergamentul în foc Pe peretele dinspre Dmesgaphison vei găsi mesajul cu care trebuie să te întorci la măritul conducător.'
    },
    {
      text:
        '~/inputs/enigma este formatat folosind ext3. Passphrase-ul este o sanie celebră.'
    },
    { text: 'CAFEBABE in ~/inputs/machine.' },
    {
      text:
        'Programul de voce al androidului conține porțiuni de cod care previn sintetizarea vocii. Repară, te rugăm, programul din ~/inputs/nopz și află ce vrea să ne comunice androidul.'
    },
    { text: 'alibaba in the kernel (major is 42, minor is 7)' },
    {
      text:
        'În directorul ~/inputs/ssl găsești o cheie publică RSA-256. Genereaz-o pe cea privată, și întreabă oracolul dacă e corectă.'
    },
    {
      text:
        "Fișierul ~/inputs/graph.dot conține descrierea unui graf în format GraphViz. Identifică drumul minim între nodurile '<' și '>'. Răspunsul va fi șirul dintre aceste caractere."
    },
    {
      text:
        'Programul robotului care trebuie să curețe zăpada nu funcționează. Robotul doar aprinde ledul de pornire și apoi se oprește. Avem nevoie de sprijinul tău ca să rezolvăm problema. Programul este în ~/inputs/call_main.'
    },
    {
      text:
        'La fiecare 42 de minute și 42 de secunde, se scrie un mesaj pe portul serial. Capturează mesajul.'
    },
    {
      text:
        'Directorul ~/inputs/v/ conține câteva module Verilog. Outputul de pe linia out, fără primul caracter, reprezintă răspunsul nivelului curent.'
    },
    {
      text:
        'Folosește "scrambler"-ul și spune-i "why did the multithreaded chicken cross the street". (major is 42, minor is 0)'
    }
  ]

  if (!exists) {
    const session = await Session.create({
      name: 'Grand Quest',
      start: '2018-12-24 18:00:00',
      end: '2019-01-06 21:00:00',
      guide:
        'Descarcă mașina virtuală de [aici](https://drive.google.com/open?id=1_oqwSYkldTfyPkojfCm5iWY1i9lUN3y9)[1]. Folosește contul wouso cu parola student; contul are drept de sudo.\n\nCopiază binarul de [aici](http://swarm.cs.pub.ro/~vciurel/.wouso/start-wouso)[2] în mașina virtuală în directorul /usr/bin. Ai grijă să îi dai drepturi de execuție.\n\nRulează comanda start-wouso.\n\nPentru clarificări, folosește Forumul Final Quest World of USO.\n\n[1] [Mașina virtuală](https://drive.google.com/open?id=1_oqwSYkldTfyPkojfCm5iWY1i9lUN3y9)\n\n[2] [Binarul start-wouso](http://swarm.cs.pub.ro/~vciurel/.wouso/start-wouso)'
    })
    qs.forEach(async (q, index) => {
      const question = await Question.create(q)
      await session.addQuestion(question, {
        through: { questionIndex: index }
      })
    })
  }
}

setup()
