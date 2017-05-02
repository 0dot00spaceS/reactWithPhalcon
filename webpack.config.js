const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    entry: 'webpack-dev-server/client?http://localhost:8010',
    output: {
        filename: 'bundle.js',
        path: __dirname + 'server/public/js/',
        publicPath: 'http://localhost:8010/js'
    },
    module: {
        loaders: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "less-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|gif|jpg|svg)$/,
                loader: "url-loader"
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new BrowserSyncPlugin(
        {
            proxy: 'http://localhost:8080',
            files: [
                {
                    match: [
                        '**/*.php'
                    ],
                    fn: function(event, file) {
                        if (event === "change") {
                            const bs = require('browser-sync').get('bs-webpack-plugin');
                            bs.reload();
                        }
                    }
                }
            ]
        },
        {
            reload: false
        })
    ],
    devServer: {
      proxy: {
          '/': {
              target: {
                  host: "http://localhost",
                  protocol: "http:",
                  port: 8888
              },
              changeOrigin: true,
              secure: false
          }
      }
    }
}
