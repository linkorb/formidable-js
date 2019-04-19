# Formidable.js

### Usage

1. Add the following element to your HTML:

```html
<div
  class="formidable-form"
  data-url="https://example.com/my-form.xml"
  data-submit="https://example.com/my-post-endpoint"
  data-submit-format="json"
  data-css-framework="bootstrap4"
  data-step-mode="pages"
  data-submit-label="Submit form"
  data-next-label="Next step"
  data-previous-label="Previous step"
  data-success-url="/success"
  data-error-url="/error">
</div>
```
Availible element attributes:

Attribute                | Description
-------------------------|----------------------------------
data-url                 | URL for loading the XML via Ajax
data-script              | ID for loading the XML from a script element, i.e. `<script id="my-form" type="text/xmldata">`
data-submit              | HTTP POST endpoint that receives the submitted form
data-submit-format       | Specifies how to submit the form. Valid options `application/json` and `application/x-www-form-urlencoded` (used by default if that attribute is not specified)
data-css-framework       | Specifies if framework-specific classnames should be used. Valid options `bootstrap4` or `"null"` (default)
data-step-mode           | Indicates if the steps should be all rendered in a single screen (single) or toggled over multiple pages (pages)
data-success-url         | URL to redirect after successful form submission
data-error-url           | URL to redirect after failed form submission
data-next-label          | Text for "Next" button
data-previous-label      | Text for "Previous" button
data-submit-label        | Text for "Submit" button

XML sample:

```xml
<?xml version="1.0"?>
<form id="contact" title="Contact form">
  <step id="first" title="First step">
    <question id="firstname" title="First name" type="text" required="true" placeholder="What's ur firstname?" maxlength="30"/>
    <question id="lastname" title="Lastname" type="text" required="true" placeholder="What's your last name" maxlength="20"/>
  </step>
  <step id="second" title="Second step">
    <question id="source" title="How did you find us?" type="dropdown" required="true" placeholder="" maxlength="">
      <option value="advertisement" label="Ad"/>
      <option value="phonebook" label="Phone book"/>
      <option value="yelp" label="yelp"/>
      <option value="tripadvisor" label="tripadvisor"/>
      <option value="google" label="google"/>
    </question>
    <question id="message" title="What's your message to us?" type="textarea" required="true" placeholder="Looking forward to hearing from you!" maxlength="35"/>
  </step>
</form>
```

2. Add `formidable.js` script to your HTML:

```html
    <script src="formidable.js"></script>
```
You can also use the minified version, do the following steps to build it:

1. Install dependencies:
```sh
npm install
```

2. Run the command to build minified version:
```sh
npm run build
```
Generated bundle file will be created in `dist` directory.

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
