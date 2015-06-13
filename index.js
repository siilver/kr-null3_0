var state = {
  moves:[],
  hod:0
  // side
  //gameId
  // playerId
};
window.addEventListener('load', function main1(){
  var gameField = document.querySelector('.field');
  var ulOfGames = document.querySelector('.existing-games');
  var createGameButton = document.querySelector('.createGame');
  var statusMessageFirst = document.querySelector('.startGame .status-message h2');
  var statusMessageSecond = document.querySelector('.mainGame .status-message');
  var startGameDiv = document.querySelector('.startGame');
  var h2Field = document.querySelector('h2');
  var ws0;    // веб сокет
  // var myId;  // id полученной игры
//  var myUserId;

  var mainGameField = document.querySelector('.mainGame');

  // Функция запроса
  function XHRSend(method, url, sendData, headers, func4){
    var i;
    var h = [];
    var request;
    request = new XMLHttpRequest();
    request.open(method, url);
    if (headers) {
      for (i = 0; i < headers.length; i++) {
        request.setRequestHeader(headers[i][0], headers[i][1]);
      }
      //request.setRequestHeader(headers[i])
    }
    console.log(request);
    if (func4){
      request.addEventListener('readystatechange', function(){
        if (request.readyState === 4 ){
          func4(request);
        }
      });

    }
    if (sendData){
      request.send(sendData);
    } else {
      request.send();
    }
  }
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
  // Добавление новых игр с веб сокета
  function addNewGameToUl(gameId){
    var newLi;
    newLi = document.createElement('li');
    newLi.id = gameId;
    newLi.textContent = gameId;
    newLi.addEventListener('click', function liListener(ev){
      var regToGame; // J1
      state.gameId = ev.target.textContent;
      console.log('GGGGAAAAME' + state.gameId);

      ws0.send(JSON.stringify({'register': state.gameId}));

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
    var requestFormStart;
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
    // N2 Обработка события startgame
    if (fromWs.action === 'startGame'){
      //myUserId = fromWs.id;
      state.playerId = fromWs.id;
      console.log('YAAAA ' + state.playerId);
      drawField();
      createGameButton.disabled = true;
      //statusMessageSecond.textContent = 'Ожидаем начала игры';
      h2Field.textContent = 'Ожидаем начала игры';
      ulOfGames.style.display = 'none';
      requestFormStart = JSON.stringify({'player': state.playerId, 'game': state.gameId});
      XHRSend('POST', gameUrls.gameReady, requestFormStart, [['Content-Type', 'application/json']], function(request){
        if(request.status===200) {
          console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD====DDDDDDDDDDDDDDDDDDDDDDDD');
          state.side  = JSON.parse(request.responseText).side;
          startGameDiv.style.display = 'none';
          mainGameField.style.display = 'inline-block';
        } else if (request.status===410){
          statusMessageFirst.textContent = 'Ошибка старта игры: другой игрок не ответил';
        } else {
          statusMessageFirst.textContent = 'Неизвестная ошибка старта игры';
        }
      } );

    }
    //f (fromWs.er)
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
          state.gameId = JSON.parse(crGameReq.response).yourId;
          console.log('ID МММММММММ' + state.gameId);
          //Отправить запрос на присоединиться к своей игре на сервер
          ws0.send(JSON.stringify({'register': state.gameId}));
          state.playerId = state.gameId;
         // ws0.send({'register': state.gameId});
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
  function clicker(e){
    var c;
    var m;
    var reqData;
    var cells = document.querySelectorAll('.cell');
    if (e.target.classList.contains('cell')){
      var cellIndex = Array.prototype.indexOf.call(document.querySelectorAll('.cell'), e.target);
      reqData = JSON.stringify({'move':(cellIndex+1)});
      XHRSend('POST', gameUrls.move, reqData, ([['Content-Type', 'application/json'], ['Game-ID', state.gameId], ['Player-ID', state.playerId]]), function(request){
          if(request.status===200){
            state.moves.push(JSON.parse(request.responseText).move);
            for(c=0; c<100;c++){
                cells[c].classList.remove('x');
                cells[c].classList.remove('o');
            }
            for (m=0; m<state.moves; m++){
              if (m%2===0){
                cells[(state.moves[m]-1)].classList.add('x');
              } else {
                cells[(state.moves[m]-1)].classList.add('0');
              }

            }
          }
        });

    }
  }
  createGameButton.addEventListener('click', crGame);
  gameField.addEventListener('click', clicker);




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