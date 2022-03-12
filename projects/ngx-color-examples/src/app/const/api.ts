export var api = {
  directive: {
    input: [
      {
        name: "palette",
        description:
          "Set a custom palette for the color picker. Can recibe an Array of string or NgxColor",
      },
      {
        name: "colorsAnimation",
        description:
          "Set the animation for the color circles.<br>Options: <ul><li>popup</li><li>slide-in</li><ul>",
      },
      {
        name: "format",
        description:
          "Set output format.<br>Options: <ul><li>hex</li><li>rgba</li><li>hsla</li><ul>",
      },
      {
        name: "hideColorPicker",
        description: "Hide the option to see the sliders to choose a color",
      },
      {
        name: "hideTextInput",
        description: "Hide the text input",
      },
      {
        name: "colorPickerControls",
        description:
          "Set the controls for the color picker.<br>Options: <ul><li>default</li><li>only-alpha</li><li>no-alpha</li><ul>",
      },
      {
        name: "acceptLabel",
        description: "Set the label for the accept button",
      },
      {
        name: "cancelLabel",
        description: "Set the label for the cancel button",
      },
      {
        name: "overlayClassName",
        description: "Set the class for the overlay",
      },
      {
        name: "attachTo",
        description:
          "Set the element(ID) to append the overlay, Default is body",
      },
    ],
    output: [
      {
        name: "change",
        description: "Gets triggered when the color is changed.",
      },
      {
        name: "input",
        description: "Gets triggered when the color is changed by the user",
      },
      {
        name: "slider",
        description:
          "Gets triggered when the the alpha, hue or Lightness sliders are changed",
      },
    ],
  },
};
