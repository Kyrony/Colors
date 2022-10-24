// function to turn the color hex into an RGB Value.
function hexToRgb(hex: string) {
  hex = hex.replace(/[^0-9A-F]/gi, '');
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  let rbg = {r:r/255, b:b/255, g:g/255}
  return rbg;
}

// Figma requires fonts to be loaded.
async function loadFonts() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
}

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {
  // This plugin will allow you to quickly generate your colors for a project.

  // This shows the HTML page in "ui.html".
  figma.showUI(__html__);
  // Resize the UI.
  figma.ui.resize(600, 400);

  loadFonts();
  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = msg => {
    // This is the callback function that will actually Generate the Color Squares
    if (msg.type === 'generate-colors') {
      const nodes: SceneNode[] = [];
      for (let i = 0; i < msg.colors.length; i++) {
        // Create Variables for Colors
        const colorFrame = figma.createFrame();
        const rect = figma.createRectangle();
        const text = figma.createText();
        const textColor = figma.createText();
        const currentColor = msg.colors[i].color;
        text.characters = msg.colors[i].name;
        textColor.characters = currentColor;
        textColor.fontName = { family: "Inter", style: "Regular" };
        
        // Adjust Rectangle colors
        const rgbColor = hexToRgb(currentColor)
        rect.fills = [{type: 'SOLID', color: {r: rgbColor.r, g: rgbColor.g, b: rgbColor.b}}];

        // Format the Frames and Color Splashes
        colorFrame.resize(200, 120);
        colorFrame.x = i * 220;
        rect.resize(200, 100);
        rect.y = 20;
        rect.cornerRadius = 10;
        rect.strokeWeight = 2;
        textColor.y = 70;
        textColor.fontSize = 24;
        textColor.paragraphIndent = 2;
        text.fontSize = 18;

        // Add everything to the scene
        colorFrame.appendChild(rect)
        colorFrame.appendChild(text)
        colorFrame.appendChild(textColor)
        figma.currentPage.appendChild(colorFrame);
        nodes.push(colorFrame);
      }
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  };

// If the plugins isn't run in Figma, run this code
}