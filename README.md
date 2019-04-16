# Formidable.js

### Testing (using express.js as a static server)

1. Go to `sample` directory:
```sh
cd sample
```

2. Install `express` package:
```sh
npm i express
```

3. Run the server that serves the content from the `public` directory:
```sh
node server
```

4. Open `localhost:3000` in your browser.

You'll see the `index.html` page that contains two formidable forms.
The first one uses `data.xml` file, the second one uses data from `script` tag
defined in `index.html`. You can make any changes for public files and test it
after reloading the browser page.
