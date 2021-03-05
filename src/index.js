let dots_controller;
let bg_controller;
let current_level;
let game_animations;
let my_scale;
const KEY_SPACE = 32;
const MOUSE_RIGHT_BUTTON = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  my_scale = ((windowWidth + windowHeight)/(displayWidth + displayHeight));

  animations_controller = new AnimationsController();
  level_controller = new LevelController();
  bg_controller = new BackgroundController(100); 
}

function draw() {
  bg_controller.update_and_draw();
  level_controller.update_and_draw();
  animations_controller.update_and_draw();
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    level_controller.next_level();
  } 
  
  else if (keyCode === LEFT_ARROW) {
    level_controller.prev_level();
  }

  else if (keyCode === KEY_SPACE) {
    level_controller.print_level_created();
  }
}

function mousePressed(event) {
  if (event.button === MOUSE_RIGHT_BUTTON) {
    level_controller.reload_dots();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  my_scale = ((windowWidth + windowHeight)/(displayWidth + displayHeight));
  level_controller.handle_resize();
}

document.addEventListener('contextmenu', event => event.preventDefault());