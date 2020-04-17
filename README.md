# Breakout

This Browser game was inspired and followed this tutorial:
>https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

## What I learned:
Javascript files can be condensed for production following these steps!
 
          * npm install --save-dev webpack webpack-cli
      ### Directory
          * |- package.json
            |- webpack.config.js
            |- /src
              |- index.js
            |- /dist
              |- index.html
      ### webpack.config.js
      Here is the webpack file I used to build my condensed production file.
          * 
            ```javascript
                const path = require('path')

                module.exports = {
                 entry: './src/index.js',
                 output: {
                 filename: 'bundle.js',
                 path: path.resolve(__dirname, 'dist')
                 }
                }
            ```
            * Bundling project in develop mode: npm run develop
            * production mode: npm run build