export var api = {
    directive:{
        input:[
            {
                name:'customPalette',
                description: 'Set a custom palette for the color picker. Can recibe an Array of string or NgxColor'
            },
            {
                name:'colorsAnimation',
                description: 'Set the animation for the color circles.<br>Options: <ul><li>popup</li><li>slide-in</li><ul>'
            }
        ],
        output:[
            {
                name:'change',
                description: 'Gets triggered when the color is change by the user'
            },
        ]
    }
}