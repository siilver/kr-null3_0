window.addEventListener('load', function main1(){
  var gameField = document.querySelector('.field');
  var ulOfGames = document.querySelector('.existing-games');
  var createGameButton = document.querySelector('.createGame');
  var statusMessageFirst = document.querySelector('.startGame .status-message h2');
  var statusMessageSecond = document.querySelector('.mainGame .status-message');
  var h2Field = document.querySelector('h2');
  var ws0;    // веб сокет
  var myId;  // id полученной игры
  var myUserId;
  var mainGameField = document.querySelector('.mainGame');
// Отрисовка поля
  function drawField(){
    var i;
    var cellField;
    var rowField;
    //mainGameField.style.display='inline-block';
    for(i = 100; i>0; i--){
      if (i % 10 === 0){
        rowField = document.createElement('div');
        rowField.classList.add('row');
        gameField.appendChild(rowField);
      }
    cellField = document.createElement('div');
    cellField.classList.add('cell');
    rowField.appendChild(cellField);
    }
  }

  function XHRSend(method, url, sendData, headers, func4){
    var i;
    var request;
    request = new XMLHttpRequest();
    request.open(method, url);
    if (headers) {
      for (i = 0; i < headers.length; i++) {
        request.setRequestHeader(headers[i][0], headers[i][1]);
      }
    }

    if (func4){
      request.addEventListener('readystatechange', func4());

    }
    if (sendData){
      request.send(sendData);
    } else {
      request.send();
    }
    if (request.readyState === 4){
      func4();
    }
  }
  // Добавление новых игр с веб сокета
  function addNewGameToUl(gameId){
    var newLi;
    newLi = document.createElement('li');
    newLi.id = gameId;
    newLi.textContent = gameId;
    newLi.addEventListener('click', function lilistener(ev){
      var regToGame; // J1
      ws0.send(JSON.stringify({'register': gameId}));

    });
    ulOfGames.appendChild(newLi);
    console.log('добавлен ' + gameId);
  }
  // Функция удаления
  function removeNewGamefromUl(gameId) {
    var delLi = document.getElementById(gameId);
    ulOfGames.removeChild(delLi);
    console.log('удален ' + gameId);
  }

  // функция обработки события веб сокeта ws0
  function ws0listener(event){
    var fromWs;
    fromWs = JSON.parse(event.data);
    console.log(fromWs);
    // Добавить li W1
    if (fromWs.action === 'add'){
     // console.log(event.data);
      addNewGameToUl(fromWs.id);
    }
    // Удалить li W2
    if (fromWs.action === 'remove'){
      // console.log(event.data);
      removeNewGamefromUl(fromWs.id);
    }
    // W3 Обработка приглашения
    if (fromWs.action === 'startGame'){
       console.log(event.data);
    }
    //if(event){console.log(event);}

    if (fromWs.action === 'startGame'){
      myUserId = fromWs.id;
      console.log('YAAAA ' + myUserId);
      drawField();
      createGameButton.disabled = true;
      //statusMessageSecond.textContent = 'Ожидаем начала игры';
      h2Field.textContent = 'Ожидаем начала игры';
      ulOfGames.style.display = 'none';

    }
  }
  ws0 = new WebSocket(gameUrls.list);
  ws0.addEventListener('message', ws0listener);
 // ws0.send();

  //               СОЗДАНИЕ ИГРЫ
  function crGame(){
    var crGameReq;
//    var statusMessageFirst = document.querySelector('.startGame > status-message');
    createGameButton.disabled = true;
  // Обработка клика по кнопке новая игра
  // отправить запрос на создание новой игры, получить свой айди C2,C3
    try {
     crGameReq = new XMLHttpRequest();
     //crGameReq.open('POST', (gameUrls.newGame));
      crGameReq.open('POST', gameUrls.newGame);
      crGameReq.addEventListener('readystatechange', function startGameResponse(message){
        if (crGameReq.readyState === 4){
         console.log(crGameReq);
          myId = JSON.parse(crGameReq.response).yourId;
          console.log('ID МММММММММ' + myId);
          //Отправить запрос на присоединиться к своей игре на сервер
          ws0.send(JSON.stringify({'register': myId}));
         // ws0.send({'register': myId});
        }
      });
      crGameReq.send();
   }
   catch (err){
     console.log('UUUUUUUUUUUUU' + err);
     statusMessageFirst.textContent = 'Ошибка создания игры';
     createGameButton.disabled = false;

    }
  }
  createGameButton.addEventListener('click', crGame);



});
/*
1. Пост для создания новой игры
  1.1 Создать Функция принимает на вход метод, урл, данные которые нужно отправить , заголовки, функцию когда запрос завершрн
  если запрос завершен - функия колбек
2. Вебсокет открытие сокета
3. Команда начать игры
в состоянии игры хранить список ходов(рекомендация), текущий игрок
Локалсторэдж не нужен
за какую сторону я играю
id игры, который получили от сервера и id игрока с которым играем
ставить х или  0 в поле только после ответа сервера

 var W0 = new WebSocket(gameUrls.list);
 W0.onmessage = function () {
 console.log('msg:', arguments);
 };
 W0.onclose = function () {
 console.log('Closed');
 }

 */