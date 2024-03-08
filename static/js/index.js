//const 정답 = "APPLE";

let index = 0;
let attempts = 0; // 몇번 시도했는가 변수
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료 되었습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:45vw; background-color:white; width=200px; height:100px";
    document.body.appendChild(div);
  };
  const nextLine = () => {
    if (attempts === 6) return gameover();
    attempts++;
    index = 0;
  };
  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    // await라는 구문을 사용하기위해 함수 앞에 async를 추가
    let 맞은_개수 = 0;
    const 응답 = await fetch("/answer"); // fetch는 자바스크립트에서 서버로 요청을 보낼 때 쓰는 함수
    console.log("응답", 응답);
    const 정답_객체 = await 응답.json();
    console.log("정답 객체", 정답_객체);
    const 정답 = 정답_객체.answer;
    console.log("정답", 정답);

    for (let i = 0; i < 5; i++) {
      // 정답 확인
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const keyboard = document.querySelector(
        `.keyboard-block[data-key='${입력한_글자}']`
      );
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        맞은_개수++;
        block.style.background = "#6AAA63";
        keyboard.style.background = "#6AAA63";
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#C9B458";
        keyboard.style.background = "#C9B458";
      }
      // includes -> 포함이 되어있는지 물어보는 함수 있으면 true 없으면 false
      else {
        block.style.background = "#787C7E";
        keyboard.style.background = "#787C7E";
      }
      block.style.color = "white";
    }
    if (맞은_개수 === 5) gameover();
    else nextLine();
  };
  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index--;
  };
  const startTimer = () => {
    const 시작_시간 = new Date();
    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }
    timer = setInterval(setTime, 1000);
  };
  const handleKeydown = (event) => {
    const key = event.key.toUpperCase(); // 소문자를 대문자로 바꿔줌
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );
    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      // 알파벳만 들어가게 keyCode a = 65 z = 90
      thisBlock.innerText = key;
      index++;
    }
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown);

  window.document.body.querySelectorAll("[data-key]").forEach((x) => {
    x.addEventListener("click", () => {
      console.log(x.dataset["key"]);
    });
  });
}

appStart();
