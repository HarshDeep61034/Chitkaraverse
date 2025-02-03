// import debugDraw from "../../utils/debugDraw";
import debugDraw from "../../utils/debugDraw";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";

interface dataprop {
    roomId: number;
    user: { name: string; id: number };
    playerCoordinates: { x: number; y: number };
}

export class Game extends Scene {
    private keys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private Player: Phaser.Physics.Arcade.Sprite;
    private otherPlayers: Phaser.Physics.Arcade.Group;
    private playerPosition = { x: 0, y: 0 };
    private lastUpdatedTime = 0;
    private isMoving: boolean;

    constructor() {
        super("Game");
    }


    create() {
        // this.add.image(400, 300, "tiles");
        const map = this.make.tilemap({ key: "dungeon" });
        const tileset = map.addTilesetImage("dungeon", "tiles");
        if (tileset == null) {
            throw new Error("Tileset not found");
        }
        map.createLayer("ground", tileset);
        const walls = map.createLayer("walls", tileset);
        walls?.setCollisionByProperty({ collides: true });

        // graphic debugging
        // debugDraw(walls, this)

        // Create character animations
        this.createCharacterAnimations();

        // Create player sprite
        const boy = this.physics.add.sprite(200, 150, "idle_left_up.png");
        this.Player = boy;
        
        // Set a smaller hitbox (16x32 as mentioned)
        this.Player.body?.setSize(16, 32);
        // Center the hitbox
        this.Player.body?.setOffset(16, 16);
        
        // Start with idle animation
        this.Player.play('idle');
        
        this.cameras.main.startFollow(this.Player, true);

        this.keys = this.input?.keyboard?.createCursorKeys();
        this.physics.add.collider(this.Player, walls!);

        
        this.otherPlayers = this.physics.add.group();
        
        // this.physics.add.collider(this.Player, this.otherPlayers);

           // Set up event listeners
           this.setupEventListeners();

        EventBus.emit("current-scene-ready", this);
    }


    private setupEventListeners() {
        // Add new player
        EventBus.on("player-joined", (data: dataprop) => {
            this.addPlayer(data);
        });

        // Render pre-joined players
        EventBus.on("prejoined-players-context", (data: dataprop[]) => {
            data.forEach((playerData: dataprop) => this.addPlayer(playerData));
        });

        // Handle player movement from server
        EventBus.on("player-moved-server", (data: dataprop) => {
            const allPlayers =
                this.otherPlayers.getChildren() as Phaser.Physics.Arcade.Sprite[];
            const selectedPlayer = allPlayers.find(
                (p) => (p.getData("id") as number) === data.user.id
            );

            if (selectedPlayer) {
                const diffX = data.playerCoordinates.x - selectedPlayer.x;
                const diffY = data.playerCoordinates.y - selectedPlayer.y;

                selectedPlayer.setPosition(
                    data.playerCoordinates.x,
                    data.playerCoordinates.y
                );

                // console.log(diffX);
                    if(diffX  == 0){}
                    else if(diffX > 0){
                        selectedPlayer.anims.play('walk-right', true)
                    }
                    else{
                        selectedPlayer.anims.play('walk-left', true);
                    }
                    if(diffY == 0){}
                    else if(diffY > 0){
                        selectedPlayer.anims.play('walk-down', true);
                    }
                    else{
                        selectedPlayer.anims.play('walk-up', true)
                    }

            }
        });

        EventBus.on('player-stopped-server', (data: dataprop)=>{
            const allPlayers = this.otherPlayers.getChildren() as Phaser.Physics.Arcade.Sprite[];

            const selectedPlayer = allPlayers.find((p)=>p.getData("id") == data.user.id);

            selectedPlayer?.anims.play('idle');
        })
    }

    addPlayer(data: dataprop) {
        console.log("Adding new player:", data);
        const newPlayer = this.physics.add.sprite(
            data.playerCoordinates.x,
            data.playerCoordinates.y,
            "boy",
            "walk_left_up.png"
        );
        newPlayer.setData("id", data.user.id);
         // Set a smaller hitbox (16x32 as mentioned)
         newPlayer.body?.setSize(16, 32);
         // Center the hitbox
        newPlayer.body?.setOffset(16, 16);
        newPlayer.anims.play('idle');
        this.otherPlayers.add(newPlayer);
    }

    changeScene() {
        this.scene.start("GameOver");
    }

    update(time: number) {
    
        if (this.keys?.down.isDown) {
            this.Player.anims.play("walk-down", true);
            this.Player.setVelocityY(70);
        } else if (this.keys?.up.isDown) {
            this.Player.anims.play("walk-up", true);
            this.Player.setVelocityY(-70);
        } else if (this.keys?.right.isDown) {
            this.Player.anims.play("walk-right", true);
            this.Player.setVelocityX(70);
        } else if (this.keys?.left.isDown) {
            this.Player.anims.play("walk-left", true);
            this.Player.setVelocityX(-70);
        } else {
            this.Player.anims.play("idle", true);
            this.Player.setVelocity(0, 0);
        }

        if (
            this.Player.x != this.playerPosition.x ||
            this.Player.y != this.playerPosition.y
        ) {
            if (time - this.lastUpdatedTime > 60) {
                this.isMoving = true;
                EventBus.emit("player-moved-client", {
                    x: this.Player.x,
                    y: this.Player.y,
                });
                this.lastUpdatedTime = time;
                console.log(time);
                this.playerPosition.x = this.Player.x;
                this.playerPosition.y = this.Player.y;
            }
        }
        else if(this.isMoving == true){
            EventBus.emit('player-stopped', {x: this.playerPosition.x, y: this.playerPosition.y});
            this.isMoving = false;
        }



        // new player joined
    }

    private createCharacterAnimations() {
        // Idle animations
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames("boy", {
                start: 1,
                end: 8, // Adjust to match the sequence of frames
                prefix: "idle_up.", // Prefix for the frames in the JSON
                suffix: ".png" // Suffix for the frames in the JSON
            }),
            frameRate: 10, // Frames per second
            repeat: -1 // Loop the animation (-1 for infinite looping)
        });

        this.anims.create({
            key: "walk-up",
            frames: this.anims.generateFrameNames("boy", {
                start: 1,
                end: 8, // Adjust to match the sequence of frames
                prefix: "walk_up.", // Prefix for the frames in the JSON
                suffix: ".png" // Suffix for the frames in the JSON
            }),
            frameRate: 10, // Frames per second
            repeat: -1 // Loop the animation (-1 for infinite looping)
        });

        // // Walking animations - each has 9 frames
        this.anims.create({
            key: "walk-down",
            frames: this.anims.generateFrameNames("boy", {
                start: 1,
                end: 8, // Adjust to match the sequence of frames
                prefix: "walk_down.", // Prefix for the frames in the JSON
                suffix: ".png" // Suffix for the frames in the JSON
            }),
            frameRate: 10, // Frames per second
            repeat: -1 
        });

        this.anims.create({
            key: "walk-left",
            frames: this.anims.generateFrameNames("boy", {
                start: 1,
                end: 8, // Adjust to match the sequence of frames
                prefix: "walk_left_down.", // Prefix for the frames in the JSON
                suffix: ".png" // Suffix for the frames in the JSON
            }),
            frameRate: 10, // Frames per second
            repeat: -1 
        });

        this.anims.create({
            key: "walk-right",
            frames: this.anims.generateFrameNames("boy", {
                start: 1,
                end: 8, // Adjust to match the sequence of frames
                prefix: "walk_right_down.", // Prefix for the frames in the JSON
                suffix: ".png" // Suffix for the frames in the JSON
            }),
            frameRate: 10, // Frames per second
            repeat: -1 
        });


        // this.anims.create({
        //     key: "walk-up",
        //     frames: this.anims.generateFrameNumbers("boy", {
        //         start: 9,
        //         end: 17  // 9 frames for walking up
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: "walk-side",
        //     frames: this.anims.generateFrameNumbers("boy", {
        //         start: 18,
        //         end: 26  // 9 frames for walking side
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // });

    }
}

