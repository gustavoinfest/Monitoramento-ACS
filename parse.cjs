const fs = require('fs');

const raw = `
Unidade Basica de Saude Boa Esperanca
ESF BOA ESPERANCA I
Cleuza Francisca de Paula 291 67 170 204 224 956
Edina Camilo de Souza 42 34 42 32 31 181
Eliane Luzia Granja 45 0 153 86 0 284
Erica Amancia de Campos Fonseca 289 0 454 273 0 1016
Lucimara Silva Goncalves 232 161 184 134 224 935
Simoni Comitre dos Santos 218 128 153 133 153 785
ESF BOA ESPERANCA II
Amalia Cardoso da Silva 86 86 140 139 7 458
Audrecimar Aparecida Bonifacio 0 68 173 111 153 505
Jandira Maria de Oliveira Almeida 303 71 251 159 315 1099
Maria Arlete Silva Santos Cardoso 66 97 253 190 128 734
Maria da Concaicao Damaceno 36 0 26 0 0 62
Osmilda Pereira da Silva Albuquerque 0 24 37 19 23 103
Unidade Basica de Saude Camping Club
EAP CAMPING CLUB
Amanda de Oliveira Miranda 0 391 601 463 564 2019
Cristiane Aparecida de Anhaia 201 0 253 226 331 1011
Unidade Basica de Saude Eduardo Gabriel Crivelaro
ESF EDUARDO G. CRIVELARO I
Edilene Alves da Silva 334 353 451 328 247 1713
Josielma de Jesus do Nascimento 392 169 453 335 336 1685
Rosidelma Dourado de Lima 600 390 541 541 454 2526
Selma Batista de Souza 364 302 444 381 418 1909
ESF EDUARDO G. CRIVELARO II
Ausirlei Maria Guerra 711 448 560 462 541 2722
Jane Anastacio da Silva 277 239 257 312 183 1268
Leila Ribeiro Dantas 137 10 64 64 0 275
Mirian Fruhling Pedroso 399 343 411 411 356 1920
Unidade Basica de Saude Endira Pichler Testolin
ESF ENDIRA PICHLER TESTOLIN
Aparecida Cordeiro da Cruz 33 17 22 2 27 101
Fabiano Belo de Araujo 96 106 154 143 2 501
Graciele Cardoso Soares Ferreira 0 0 181 117 21 319
Grasiele Maiara Pereira dos Santos 0 0 86 108 83 277
Iara Cristina Loeff 102 96 119 151 0 468
Unidade Basica de Saude Euclides Lazaro Uceda
ESF EUCLIDES LAZARO UCEDA I
Carlos Vilalba 149 105 212 77 191 734
Katia Roseli Araujo 0 110 147 128 149 534
Marilene Maciel da Costa 0 48 82 46 25 201
Marlene Secco 0 43 87 82 132 344
Rafaela Morassutti Assenco 225 98 241 179 179 922
ESF EUCLIDES LAZARO UCEDA II
Elizangela Lemes de Almeida 76 137 207 153 92 665
Janes Padilha de Oliveira Silva 128 141 173 143 32 617
Jocelia de Souza 0 88 180 156 139 563
Unidade Basica de Saude Fatima Aparecida Costa Franca
ESF JARDIM IBIRAPUERA I
Ines da Silva Sevinhago Sauer 32 32 121 72 41 298
Lidiaine Dellani dos Santos 7 23 31 59 0 120
Rosa Denis Trindade 14 7 41 40 50 152
Rosana Barbosa Malheiros 55 153 109 162 72 551
ESF JARDIM IBIRAPUERA II
Eliane Kerber dos Santos 414 297 370 333 256 1670
Gabriela Poter Ramos dos Santos 242 210 216 225 213 1106
Iago Sousa de Sousa 75 40 131 201 142 589
Leonardo Felipe Rosa Lacerda 58 40 73 70 78 319
Valter Gabriel Barroso Razera 18 33 20 29 0 100
Unidade Basica de Saude Gleba Mercedes Nucleo Campos Novos
EAP GLEBA MERCEDES C. NOVOS
Luzia Ferreira da Silva Rezende 49 73 46 23 101 292
Unidade Basica de Saude Jacarandas
ESF JACARANDAS I
Flavia Marieli Carneiro Feliz 15 0 53 82 62 212
Luiza Maria Rodrigues Vinci 38 47 133 87 114 419
Ramony Alves 125 119 146 129 114 633
Roseni Mamede de Souza 90 81 181 81 94 527
ESF JACARANDAS II
Antonia de Paula 134 124 153 142 0 553
Marilda Paulino Nonato 98 82 141 123 88 532
Unidade Basica de Saude Jardim America
EAP JARDIM AMERICA
Eliane Luiza Reimers 502 279 571 395 323 2070
Valdiceia Maria da Silva 0 360 452 319 96 1227
Unidade Basica de Saude Joacir Rodrigues
ESF JOACIR RODRIGUES I
Mara Fabiene Barbosa Martins 107 92 154 131 189 673
Mariza Nunes Chimenes 190 172 223 0 186 771
Marleide de Lima Silva Lucca 200 75 0 117 159 551
Mayara Cassimiro de Souza 118 81 84 119 190 592
Sonia Marlis Kill 146 146 378 308 213 1191
ESF JOACIR RODRIGUES II
Cirlei Braz Nardino 129 0 158 118 135 540
Daiane Rodrigues da Silva Deconto 0 86 138 146 135 505
Elza Soares dos Santos 0 125 217 199 148 689
Leilaine Pereira de Oliveira 0 27 88 57 18 190
Suellen Machado de Araujo 183 149 209 138 159 838
Unidade Basica de Saude Jose Marchezi Junior
ESF JOSE MARCHEZI JUNIOR I
Anderson Landmann Fenner 8 14 4 0 0 26
Esley Ribeiro Santos 78 58 49 11 0 196
Harisson Marcell Moraes Marinho 54 69 0 51 76 250
Vanessa Rodrigues de Almeida 0 8 6 11 7 32
Vera Helena Arenhardt 0 107 116 125 85 433
Unidade Basica de Saude Jose Ramos Pereira Zequinha
ESF JOSE R. P. ZEQUINHA I
Yale Gomes de Sa 133 132 112 122 141 640
Amanda Bezerra Rohling 119 90 100 163 31 503
Celma Ferreira Salli 111 134 93 143 71 552
Fabiana Machado Balke 137 93 0 0 0 230
Idelfonso Cordeiro Teles Junior 47 82 49 68 10 256
Maria do Carmo Theodoro 0 145 178 169 38 530
Priscyla dos Santos Ferreira 116 74 55 144 66 455
ESF JOSE R. P. ZEQUINHA II
Aurilene Rocha Pereira 163 124 211 204 185 887
Cleres da Conceicao Brito 0 115 101 120 4 340
Francielli Rodrigues de Jesus 0 48 71 52 0 171
Jony Jose Rossa 106 102 106 105 34 453
Mariete Aparecida Roldao 0 225 449 366 326 1366
Unidade Basica de Saude Juranil Marques dos Santos
ESF JARDIM PRIMAVERA I
Adriana Porto dos Santos 151 194 184 139 189 857
Eliane Aparecida Stolarski 0 75 116 140 116 447
Fatima Belarmina de Oliveira 0 113 194 106 92 505
Matildes dos Santos 179 98 170 190 188 825
Rozangela Maria Fideli 182 116 174 155 158 785
Silvana Pereira dos Santos 0 109 142 115 42 408
ESF JARDIM PRIMAVERA II
Deorlan Nunes de Sousa 154 0 170 207 0 531
Unidade Basica de Saude Manoel Lorentino dos Santos
ESF MANOEL L. DOS SANTOS I
Elison Lino Pedrolo 103 102 111 80 73 469
Joceli Souza Figueiredo 104 88 95 0 0 287
Marcia Lourenco de Novaes 0 117 123 180 175 595
Aline Aparecida da Silva 105 189 311 307 257 1169
Angelina Fatima Jezur da Silva 118 160 345 261 242 1126
Rosemeire Paes da Silva Neumann 34 94 159 112 98 497
Suzaine da Fonseca Locatelli 255 169 267 138 196 1025
ESF MANOEL L. DOS SANTOS II
Alyne Maria Paraencio de Souza 189 103 141 113 181 727
Silvana dos Santos 446 319 365 259 277 1666
Valdineia de Sousa Lima 230 197 272 234 187 1120
Unidade Basica de Saude Maria Vindilina
ESF MARIA VINDILINA
Angieli Silva dos Santos 251 180 277 262 244 1214
Douglas Ortega de Lima 20 32 73 47 43 215
Francisca Rogerio Silva Botelho 381 381 427 382 392 1963
Joceli Souza Figueiredo 0 0 0 0 7 7
Juliana da Silva Espindola 107 120 229 145 25 626
Marcos Paulo de Almeida 106 259 307 308 336 1316
Marise Aparecida Banin 441 304 0 430 466 1641
Roseli Amelia Isidoro 181 98 209 194 187 869
Unidade Basica de Saude Marilene Freitas Cervantes
ESF MARILENE F. CERVANTES I
Bernadete Trindade Furlaneto Santos 0 116 184 134 127 561
Douglas Santos Serpa 114 148 160 112 0 534
Marilene Guerra Bessa 7 104 134 113 0 358
Marinez Ferri Nogueira Rossetto 209 220 0 281 181 891
Meire Aparecida Guzi Santana 0 58 34 265 260 617
ESF MARILENE F. CERVANTES II
Ana Paula Maximiano 0 0 0 0 14 14
Cristiane Fernandes de Almeida 0 252 271 39 0 562
Maristela Borges de Sousa 0 126 0 195 141 462
Sonia Salete Carnezella 72 66 111 116 86 451
Valdma de Melo Rocha 0 180 317 38 0 535
Unidade Basica de Saude Menino Jesus
ESF MENINO JESUS I
Genilda da Silva Colaco 188 129 321 376 256 1270
Janete de Souza Almeida Cunha 506 227 315 442 472 1962
Marcia Aparecida Meneses de Souza 0 135 190 156 175 656
Robson Tadeu Altali Ourives 227 241 81 219 235 1003
ESF MENINO JESUS II
Alessandro Suzarte 180 123 121 102 148 674
Ida Aparecida Paiva da Silva 0 49 310 95 27 481
Mirian Ribeiro de Oliveira 239 182 297 312 457 1487
Roseli Maira Cotrin da Silva 0 297 527 481 527 1832
Rosimar Andrade da Silva 0 273 519 508 531 1831
Wender Chiarelli 167 126 256 212 208 969
Unidade Basica de Saude Oliveiras
ESF JARDIM DAS OLIVEIRAS I
Andre Luiz da Costa Joaseiro 91 107 119 60 111 488
Claudia Cristine Secolini Florencio 5 250 378 205 295 1133
Patricia Menezes Seguins Monteiro 89 59 135 52 33 368
Silvia Regina de Oliveira 1 0 0 0 0 1
Wladimir Pereira Reis 68 102 106 55 161 492
ESF JARDIM DAS OLIVEIRAS II
Daniele da Costa Joaseiro 62 6 52 0 0 120
Gleiciane da Silva 391 229 346 195 342 1503
Magna Cristina da Silva dos Santos 111 49 34 83 5 282
Unidade Basica de Saude Palmeiras
ESF JARDIM DAS PALMEIRAS I
Aline Oliveira Cortez 0 0 3 15 29 47
Lucimar de Goes Kovalski 97 117 107 119 209 649
Marcia Cristina Roque de Lima 159 76 150 161 133 679
Sirlene de Paula Ribeiro 106 53 134 114 114 521
ESF JARDIM DAS PALMEIRAS II
Andre Carlos de Oliveira Filho 21 7 44 12 35 119
Josiane Lobato Polli 47 0 0 0 73 120
Rian Teixeira 567 313 216 185 59 1340
Rogerio Silva Fernandes 116 77 138 122 0 453
Unidade Basica de Saude Ruy Fernando Barbosa
ESF RUY F. BARBOSA I
Antonia Claudia da Conceicao 0 133 268 126 69 596
Antonia Ferreira dos Santos 0 29 166 201 177 573
Marcia de Almeida 93 82 88 91 66 420
Rosi Maria Mildemberg Moraes 171 235 218 29 158 811
Silvia Regina de Oliveira 124 114 108 205 63 614
Unidade Basica de Saude Sabrina
ESF SABRINA I
Carina Lopes da Silva Rodrigues 340 211 367 311 287 1516
Catherine Emili Lopes 0 0 1 131 105 237
Felipe Linjardi da Silva 133 111 92 87 34 457
Irailde Nascimento Santos 197 222 213 177 115 924
Vanessa da Silva 120 131 216 220 253 940
ESF SABRINA II
Aline Fernanda Santos de Carvalho 140 179 190 188 212 909
Izamaria Jorge Soares 0 143 184 263 305 895
Samela Naiara dos Santos 0 182 268 242 214 906
Silmara Morais de Andrade 32 38 37 37 7 151
Sirlei de Oliveira Galvao 0 210 108 66 45 429
Unidade Basica de Saude Sao Cristovao
ESF SAO CRISTOVAO I
Celia de Barros Cavalcante 188 149 217 237 111 902
Gustavo Celso Alves 0 0 4 0 0 4
Joselina Maria Bezerra de Oliveira 315 272 132 155 285 1159
Liane Beatris Sauer 0 221 268 372 309 1170
Maria Valdeci Mendes dos Santos 270 164 251 316 0 1001
Marlete de Oliveira 214 138 144 183 76 755
Unidade Basica de Saude Sao Francisco
ESF SAO FRANCISCO I
Allana Layanne de Oliveira Silva Rocha 395 325 527 420 391 2058
Crislaine Agostinho Cardoso 269 160 212 301 273 1215
Marline Frota Ribeiro 45 59 110 162 150 526
Sidiney Alves da Silva 159 191 189 0 0 539
ESF SAO FRANCISCO II
Katia Fernanda Martins da Silva 0 343 287 371 186 1187
Katia Karoline Barbosa Neves 253 0 222 198 0 673
Liziane Maria Gebel 264 382 375 313 5 1339
Marcos Andrews dos Santos Ferreira 82 66 98 113 0 359
Sheila Adriana de Noronha Uliana 85 27 105 93 1 311
Unidade Basica de Saude Sebastiao de Matos
ESF SEBASTIAO DE MATOS I
Ana Maria Saucedo 18 312 67 0 0 397
Juliana de Santana Silva 25 97 128 147 101 498
Lilivan Oliveira Cortez 126 136 274 240 259 1035
Lucimere Costa da Silva Flores 0 42 158 138 145 483
Marinete da Rosa 51 271 286 347 280 1235
Valcirlene Valadares dos Santos Demarck 0 316 258 316 353 1243
ESF SEBASTIAO DE MATOS II
Ana Lucia Lopes da Silva de Oliveira 0 85 491 406 378 1360
Andressa Felix dos Santos da Silva 168 119 230 221 161 899
Antonio Carlos Ferraz 156 162 148 125 117 708
Daniela da Conceicao Batista 247 233 286 297 310 1373
Fernando Antonio Brito 195 0 206 197 19 617
Ricarnisot Lopes Tosin 117 74 128 117 112 548
`;

const lines = raw.trim().split('\n');

let currentUnidade = '';
let currentEquipe = '';
const results = [];
let idCounter = 1;

for (const line of lines) {
  if (line.trim() === '') continue;
  if (line.startsWith('Unidade')) {
    currentUnidade = line.trim();
  } else if (line.startsWith('ESF ') || line.startsWith('EAP ')) {
    currentEquipe = line.trim();
  } else {
    // Process ACS
    const parts = line.split(' ');
    
    const numbers = [];
    let nameParts = [];
    
    for (const part of parts) {
      if (part.match(/^[0-9]+$/)) {
        numbers.push(parseInt(part.replace(/\./g, ''), 10));
      } else {
        nameParts.push(part);
      }
    }
    
    if (numbers.length >= 6) {
      const nome = nameParts.join(' ');
      const nums = numbers.slice(numbers.length - 6);
      
      results.push({
        id: idCounter.toString(),
        nome,
        unidade: currentUnidade,
        equipe: currentEquipe || currentUnidade, // fallback if no equipe
        producaoMensal: {
          "01/2026": nums[0],
          "02/2026": nums[1],
          "03/2026": nums[2],
          "04/2026": nums[3],
          "05/2026": nums[4]
        },
        total: nums[5]
      });
      idCounter++;
    }
  }
}

const dataTsContent = `import { ACS } from "./types";\n\nexport const mockACSData: ACS[] = ${JSON.stringify(results, null, 2)};\n`;
fs.writeFileSync('src/data.ts', dataTsContent);
console.log('Saved to src/data.ts with ' + results.length + ' entries.');
