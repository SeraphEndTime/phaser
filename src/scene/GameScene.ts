import * as Phaser from 'phaser';
import Toast from 'phaser3-rex-plugins/templates/ui/toast/Toast';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude'
const BOMB = 'bomb'
const COUNT_STARS = 5;
export default class GameScene extends Phaser.Scene{
    
    constructor(){
        super('game-scene');
        
    }
    rexUI: UIPlugin;  
    toast;

    player:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;
    platforms:Phaser.Physics.Arcade.StaticGroup;
    stars:Phaser.Physics.Arcade.Group;
    gameOver:boolean = false;

    score:number = 0;

    scoreText:Phaser.GameObjects.Text;
    timerText:Phaser.GameObjects.Text;
    BestTimeText:Phaser.GameObjects.Text;
    modalRecordText:Phaser.GameObjects.Text;
    modalSesionText:Phaser.GameObjects.Text;

    modalRecord:number = 0;
    record:number = 0;

    curentLevel:number = 0
    level:Array<number> = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    unpresJump:boolean = false;
    jump:number = 0;
    bombs:Phaser.Physics.Arcade.Group;  
    
    timer:Phaser.Time.TimerEvent;

    preload(){
        //Загрузка ассетов
        this.load.image('sky', 'assets/sky.png');
		this.load.image(GROUND_KEY, 'assets/platform.png');
		this.load.image('star', 'assets/star.png');
		this.load.image(BOMB, 'assets/bomb.png');
        this.load.image('modal','assets/modal.png');
        //загрузка атласа персонажа
		this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		);
        
        
        
    }

    update(){
        //Управление персонажем
        
            if (this.cursors.left.isDown){
                //Добавляем горизонтальную скорость персонажу
                this.player.setVelocityX(-160);
                //Запускаеи анимацию бега в лево
                this.player.anims.play('left', true);
    
            } else if (this.cursors.right.isDown){
                //Добавляем горизонтальную скорость персонажу
                this.player.setVelocityX(160);
                //Анимация бега в право
                this.player.anims.play('right',true);
    
            } else
    
            {
                //Анимация IDLE
                this. player.setVelocityX(0);
                this.player.anims.play('turn');
            }
            if(this.player.body.touching.down) {
                this.jump = 2;
            }
            //Двойной прыжок если игрок в воздухе
            if (Phaser.Input.Keyboard.JustUp(this.cursors.up) && (this.jump > 0)){
                this.player.setVelocityY(-330); 
                this.jump--;
            }

           
            
            //Проверяем если игрок касаеться земли и нажата кнопка прыжка добавляем вертикальную скорось
            
            //Обновляем текс значение таймера
            this.timerText.setText(`Time: ${this.timer.getElapsedSeconds().toString().substr(0,4)}`);
            
        
    }

    create(){
        this.score = 0;
        this.curentLevel = 0;
        this.add.image(400, 300, 'sky');
    	
        //Получаем класс управления 
        this.cursors = this.input.keyboard.createCursorKeys();
        //добавляем игрока на сцену
        this.player =this.physics.add.sprite(100,450,DUDE_KEY);

        
        this.createPlatform();
        this.createPlayer();
        this.createtStars();
        this.createBombs();

        this.scoreText = this.add.text(16,16,'score: 0',{fontSize:'32px'});
        this.timerText = this.add.text(16,60,'time: 0',{fontSize:'32px'});
        this.BestTimeText = this.add.text(16,90, `Best time: ${this.level[this.curentLevel].toString().substr(0,5)}`,{fontSize:'32px'});
        
        this.timer =  this.time.addEvent({loop:true});
        this.toast =  this.rexUI.add.toast({
            x:400,
            y:300,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x260e04),
            text: this.add.text(0,0,"",{fontSize:"24px"}),
            space:{
                left:20,
                right:20,
                top:20,
                bottom:20
            },
            duration:{
                in:250,
                hold:3000,
                out:250
            }

        });
        
    }

    

    createBombs(){
        //Создаем группу для бомбы
        this.bombs = this.physics.add.group();
        //добавляем колизию к платформам
        this.physics.add.collider(this.bombs,this.platforms);
        //Тригер при касании бомбы и игрока
        this.physics.add.collider(this.bombs,this.player,(bomb,player)=>{
            //Создаем всплывающее окно
            
            
            
                    this.toast.showMessage(`GAME OVER\nLevel ${this.curentLevel+1}\n
                    TIME ${this.timer.getElapsedSeconds().toString().substr(0,5)}\n`);
               
                
                
            
               
            
            
            //Устанавливаем отенок для игрока
            this.player.setTint(0xFF0000);
            this.player.anims.play('turn');
            this.physics.pause();
            this.timer.paused= true;
            //Вывываем перезапуск через 4с
            this.time.delayedCall(4000,() => {
                this.physics.resume();
                this.scene.restart()})
           
        },null,this);
    }

    createPlayer(){
        
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: DUDE_KEY, frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        
    }

    createPlatform(){
        //Добавляем статические обьекты
        this.platforms = this.physics.add.staticGroup();

		this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
	
		this.platforms.create(600, 400, 'ground');
		this.platforms.create(50, 250, 'ground');
		this.platforms.create(750, 220, 'ground');
        //Добавляем колизию игроку с статическими обьектами
        this.physics.add.collider(this.player, this.platforms);
        
    }

    spawnBomb(){
        //Спавним бомбу в противоположной стороне
        let x = this.player.x < 400 ? Phaser.Math.Between(400,800) : Phaser.Math.Between(0,400)
        let bomb = this.bombs.create(x,16,BOMB);

        //Задаем колизию ко всем обьектам
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200,200),20)
    }

    createtStars(){
        //Если звезд больше 12 генерируем второй ряд на другой высоте
        if(COUNT_STARS > 12) {
           this.stars = this.physics.add.group({
               key: 'star',
               repeat: 11,
               setXY:{x:12, y:0,stepX:60},


           });
        let manyStar = this.physics.add.group({
            key: 'star',
            repeat: COUNT_STARS - 13,
            setXY:{x:12, y:400,stepX:70},


        });

         //Объединяем в одну групу
          this.stars.addMultiple(manyStar.children.getArray());
          
        } else {
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: COUNT_STARS -1,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        }
        
        
        this.stars.children.iterate((child)=>{
            console.log(child);
            //устанавливаем для каждой звезды вертикальное оотскакивание
            (child as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
        })
        //Добавляем колизию для звезд и платформ
        this.physics.add.collider(this.stars,this.platforms);
        //Тригер при пересечении игрока и звезд
        this.physics.add.overlap(this.player, this.stars, (player,star)=>{
            //скрываем звезду
            (star as Phaser.Physics.Arcade.Sprite).disableBody(true,true);
            //увеличиваем рекорд и меняем текст рекорда
            this.spawnBomb()
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            //Проверяем количество активных звезд если 0 спавним бомбу и звезды
            if (this.stars.countActive(true) === 0){
                //активируем звезды на рамдомной высоте
                
                if((this.level[this.curentLevel] == 0)) {
                    this.level[this.curentLevel] = this.timer.getElapsedSeconds();
                    
                } else if (this.level[this.curentLevel] > this.timer.getElapsedSeconds()) {
                    this.level[this.curentLevel] = this.timer.getElapsedSeconds();
                    
                }
                
                console.log(this.curentLevel);
                console.log(this.level);
                this.physics.pause();
                this.timer.paused = true;
                this.toast.showMessage(`COMPLETE\nLevel ${this.curentLevel+1}\n
                TIME ${this.timer.getElapsedSeconds().toString().substr(0,5)}\n
                BEST TIME ${this.level[this.curentLevel].toString().substr(0,5)}`);
                this.bombs.getChildren().map((bomb) => {bomb.destroy()});
                this.curentLevel++
                this.stars.children.iterate((child:Phaser.Physics.Arcade.Sprite)=>{
                    child.enableBody(true,child.x ,Phaser.Math.Between(0,300),true,true);
                }); 
                this.time.delayedCall(3000,()=>{
                    this.timer.reset({loop:true});
                    this.physics.resume();
                })
                
                
                
                
            }
        }, null, this);
    }
}   

