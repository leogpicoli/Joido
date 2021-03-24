import './styles/index.css';
import * as p5 from './lib/p5.js';

window.mobileCheck = function () {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

let backgroundController;
let gameController;
let animationsController;

let globalEnv = {
  isDevice: window.mobileCheck(),
  screenSizeFactor: 1
};

const BackgroundController = require('./background/background').default;
const GameController = require('./controllers/gameController').default;
const AnimationsController = require('./controllers/animationsController').default;

let p5Sketch = (sk) => {
  sk.setup = () => {
    globalEnv.screenSizeFactor = Math.sqrt(Math.pow(sk.windowWidth, 2) + Math.pow(sk.windowWidth, 2)) / Math.sqrt(1600 * 1600 + 900 * 900)
    animationsController = new AnimationsController();
    backgroundController = new BackgroundController();
    gameController = new GameController();
    sk.frameRate(120);
  }

  sk.draw = () => {
    backgroundController.updateAndDraw();
    gameController.updateAndDraw();
    animationsController.updateAndDraw();
  }

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);

    animationsController?.clearAnimations(true);
    backgroundController?.handleResize();
    gameController?.handleResize();
  }
}

const P5 = new p5(p5Sketch);
let isFullscreen = false;

window.onload = () => {
  setMenuBgColor();

  // close menu when click outside menu
  document.addEventListener("click", (event) => {
    let menuContainerDiv = document.getElementById("menu-container");
    let isMenuActive = menuContainerDiv.style.display != "none";
    let clickedOutsideMenu = true;
    for (let i = 0;i < event.path.length;i++) {
      let elem = event.path[i];
      if (elem.id == 'menu-container') {
        clickedOutsideMenu = false;
        break;
      }
    }
    if (isMenuActive && clickedOutsideMenu) {
      hideMenu();
      event.stopPropagation();
    }
  });
  document.getElementById("menu-icon").onclick = (event) => { 
    showMenu();
    event.stopPropagation();
  };
  document.getElementById("fullscreen-icon").onclick = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen({navigationUI: 'hide'}).then(() => {
        document.getElementById("fullscreen-icon").src = "./images/minimize.svg";
        isFullscreen = true;
      });
    } else {
      document.exitFullscreen().then(() => {
        document.getElementById("fullscreen-icon").src = "./images/fullscreen.svg";
        isFullscreen = false;
      });
    }
    isFullscreen = !isFullscreen;
  }
  document.getElementById("arrow-left-icon").onclick = (event) => {
    gameController.goToPrevLevel();
  };
  document.getElementById("arrow-right-icon").onclick = (event) => {
    gameController.goToNextLevel();
  }
  document.getElementById("retry-icon").onclick = (event) => {
    gameController.reloadLevel()
  }
  
  document.addEventListener('contextmenu', event => event.preventDefault());
  document.getElementById('menu-item-continue').onclick = () => {
    gameController.continueGame();
    hideMenu();
  };
  document.getElementById('menu-item-new').onclick = () => {
    gameController.startNewGame();
    hideMenu();
  }
  /*document.getElementById('menu-item-create').onclick = () => handleMenuItemClick('create');
  document.getElementById('menu-item-load').onclick = () => handleMenuItemClick('load');*/

  let colorPicker = document.getElementById('color-picker')
  colorPicker.addEventListener('input', () => {
    backgroundController.changeBackgroundColor(colorPicker.value);
    setMenuBgColor();
  });
}

function setMenuBgColor() {
  let menuContainerDiv = document.getElementById("menu-container");
  menuContainerDiv.style.backgroundColor = backgroundController.bgColor;
}

function hideMenu() {
  let menuContainerDiv = document.getElementById("menu-container");
  menuContainerDiv.style.opacity = 0;
  setTimeout(function () {
    menuContainerDiv.style.display = "none";
  }, 500)
}

function showMenu() {
  let menuContainerDiv = document.getElementById("menu-container");
  menuContainerDiv.style.display = "flex";
  setTimeout(function () {
    menuContainerDiv.style.opacity = 1;
  }, 50)
}

export {
  P5,
  backgroundController,
  animationsController,
  globalEnv
};