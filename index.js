window.addEventListener('load', function main1(){
  var ulOfGames = document.querySelector('.existing-games');
  var createGameButton = document.querySelector('.createGame');
  var ws0;
  function XRHSend(method, url, sendData, headers, func4){
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
    // Добавить li
    if (fromWs.action === 'add'){
     // console.log(event.data);
      addNewGameToUl(fromWs.id);
    }
    // Удалить li
    if (fromWs.action === 'remove'){
      // console.log(event.data);
      removeNewGamefromUl(fromWs.id);
    }
  }
  ws0 = new WebSocket(gameUrls.list);
  ws0.addEventListener('message', ws0listener);
 // ws0.send();

  //               СОЗДАНИЕ ИГРЫ
  function crGame(){
    var crGameReq;
    var myId;
    createGameButton.disabled = true;
  // Обработка клика по кнопке новая игра

    try {
      crGameReq = new XMLHttpRequest();
      crGameReq.open('POST', gameUrls.newGame);
      crGameReq.addEventListener('redystatechange', function startGameResponse(message){
        if (message.readyState === 4){

          myId = JSON.parse(crGameReq.response).yourid;
          console.log('ID МММММММММ' + myId);
        }
      });
      crGameReq.send();
    }
    catch (err){
      console.log(err);

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