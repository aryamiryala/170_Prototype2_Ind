title = "Coin Blast";

description = `
  [Tap] to Fire
  [Tap] Direction
`;

characters = [
  `
  l
  l
  l
    `, 
    `
  
   
  ll
  ll
rrllrr
rrllrr
rr  rr
`
];

const G = {
	WIDTH: 100,
	HEIGHT: 150, 
  COIN_SPEED_MIN: 0.5,
	COIN_SPEED_MAX: 1.0, 
  player_speed: 1.5,
  
  player_fire_rate: 4,
  player_gun_offset: 3,

  bullet_speed: 5
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  //isPlayingBgm: true,
  theme: 'dark'

};

/**
 * @typedef {{
* pos: Vector,
* firingCooldown: number,
* isFiringLeft: boolean
* }} Player
*/

/**
* @type { Player }
*/
let player;

/**
 * @typedef {{
* pos: Vector
* }} Bullet
*/

/**
* @type { Bullet [] }
*/
let bullets;


/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} Coin
  */
  
  /**
  * @type  { Coin [] }
  */
  let coins;

  // Direction variable for the player
  let playerDirection = 1; // 1 for right, -1 for left

  //timer for game
  let timer; 




function update() {
  if (!ticks) {
    coins = times(8, () => {
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, 30);
      return {
        pos: vec(posX, posY),
        speed: rnd(G.COIN_SPEED_MIN, G.COIN_SPEED_MAX),
      };
    });
    player = {
      pos: vec(G.WIDTH * 0.5, 145),
      firingCooldown: G.player_fire_rate,
      isFiringLeft: true
      
    };

    bullets = []
    score = 0;
    timer = 0;

  
    
  } //end of if(!ticks)

  // PLAYER ----------------

  player.pos.x += G.player_speed * playerDirection;
  // When player taps switch direction
  if (input.isJustPressed) {
    playerDirection *= -1;
  }

  // Ensure the player stays within the game boundaries
  player.pos.x = clamp(player.pos.x, 2, 97);
  if(player.pos.x == 2 || player.pos.x == 97)
  {
    playerDirection *= -1;
  }
  //cool down
  player.firingCooldown--; 
  //firing next shot
  if(player.firingCooldown <= 0){
    //create bullets if input pressed 
    if(input.isPressed){
      bullets.push({pos: vec(player.pos.x, player.pos.y)});

    }

    // Reset the firing cooldown
    player.firingCooldown = G.player_fire_rate;

  }

  // Updating and drawing bullets
  bullets.forEach((b) => {
    // Move the bullets upwards  
    b.pos.y -= G.bullet_speed;

    // Drawing
    color("red");
    box(b.pos, 1.7)

  });
  
  //text(bullets.length.toString(), 3, 10);
  


  // Update for Coin
  coins.forEach((c) => {
    // Move the coin downwards
    c.pos.y += c.speed;
    
    // Bring the coin back to top once it's past the bottom of the screen
    c.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
    // Randomize coin positions after wrapping
    if (c.pos.y <= 0){
      c.pos.x = rnd(0, G.WIDTH);
    }

    // Choose a color to draw
    color("yellow");
    // Draw the coin as a square of size 1
    char("a", c.pos);
   });

   //collision between player and coin: ends the game
   color("black");
   const PlayerCoinCollision = char("b", player.pos).isColliding.char.a;
   
   if (PlayerCoinCollision){
      end();
   }

   
  //remove irrelevant bullets and colliding bullets
  remove(bullets, (b) => {
    
    //collision between bullets and coin 
    const BulletCoinCollision = box(b.pos, 1.7).isColliding.char.a;

    if (BulletCoinCollision){
      //increase score 
      score++;
      color("yellow");
      particle(b.pos);
    
    }
    // Also another condition to remove the object
    return (BulletCoinCollision || b.pos.y > G.HEIGHT);
    
  });

    timer += 1 / 60;
    // Check if the timer has reached 30 seconds, if it did 
    // end the game
    if (timer >= 30) {
    
      end();

    }

    // Display the timer
    color("black");
    text(`Time:${Math.ceil(30 - timer)}`, G.WIDTH - 42, 10);
} //end update
