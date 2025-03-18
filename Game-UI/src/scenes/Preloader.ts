import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(400, 300, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(400, 300, 464, 32).setStrokeStyle(1, 0xffffff);

        const titleText = this.add.text(400, 100, "ChitkaraVerse", {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: "60px", // Larger font size for better emphasis
            color: "#ffffff", // White text color
            stroke: "#000000", // Black stroke for better readability
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: "#333333",
                blur: 4,
                stroke: true,
                fill: true,
            },
            align: "center",
        });
        titleText.setOrigin(0.5, 0.5); // Center the text based on its origin

        // Adding a subtitle or description below the title
        const subtitleText = this.add.text(
            400,
            180,
            "Welcome to an immersive journey!",
            {
                fontFamily: "Arial, sans-serif",
                fontSize: "24px",
                color: "#eeeeee",
                align: "center",
            }
        );
        subtitleText.setOrigin(0.5, 0.5);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");

        this.load.image("tiles", "0x72_DungeonTilesetII_v1.7.png");
        this.load.tilemapTiledJSON("dungeon", "dungeon.json");
        this.load.atlas("boy", "Player/boy/boy.png","Player/boy/boyatlas.json")
        this.load.atlas("fauna", "Player/fauna.png", "Player/fauna.json")
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.cameras.main.fadeOut(3000, 0, 0, 0);

        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
                this.scene.start("Game");
            }
        );
    }
}

