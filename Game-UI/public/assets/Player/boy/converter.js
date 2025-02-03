const fs = require('fs');
const path = require('path');

// Path to the input JSON file
const inputJsonPath = path.join(__dirname, 'boy.json'); // Update with actual input file path
const outputJsonPath = path.join(__dirname, 'boyatlas.json'); // Update with desired output file path

// Read the input JSON
fs.readFile(inputJsonPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading input JSON:', err);
        return;
    }

    // Parse the input JSON
    const inputJson = JSON.parse(data);

    // Initialize the new structure
    const outputJson = {
        textures: []
    };

    // Process the frames
    const frames = inputJson.frames;
    const textureNames = Object.keys(frames);
    const spriteSheetFileName = 'boy.png'; // The sprite sheet (all frames are in this image)
    const spriteSheetWidth = 384; // Adjust this based on your sprite sheet width
    const spriteSheetHeight = 64; // Adjust this based on your sprite sheet height

    // Create the texture object
    let texture = {
        image: spriteSheetFileName,
        format: 'RGBA8888',
        size: {
            w: spriteSheetWidth,
            h: spriteSheetHeight
        },
        scale: 1,
        frames: []
    };

    textureNames.forEach(textureName => {
        const textureData = frames[textureName];
        const { x, y, w, h } = textureData.frame;
        const { x: spriteX, y: spriteY, w: spriteW, h: spriteH } = textureData.spriteSourceSize;

        // Generate the frame data
        const frame = {
            filename: textureName.split('/').pop(), // Use the frame name from the texture file
            rotated: false,
            trimmed: textureData.trimmed || false,
            sourceSize: {
                w: spriteW,
                h: spriteH
            },
            spriteSourceSize: {
                x: spriteX,
                y: spriteY,
                w: spriteW,
                h: spriteH
            },
            frame: {
                x: x,
                y: y,
                w: w,
                h: h
            }
        };

        // Add the frame to the texture's frames array
        texture.frames.push(frame);
    });

    // Push the texture object into the output JSON
    outputJson.textures.push(texture);

    // Write the output JSON
    fs.writeFile(outputJsonPath, JSON.stringify(outputJson, null, 2), (err) => {
        if (err) {
            console.error('Error writing output JSON:', err);
        } else {
            console.log('Output JSON successfully written to', outputJsonPath);
        }
    });
});
