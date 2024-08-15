# Creating a Notice Template

This documentation will walk through how to create a new **notice template**. For how to add notices to display on stream, see the section *Making Notices* in the main [readme](../readme.md).

## Prelimiary Information

Creating notice templates is basically the same as creating a small web page (`*.html` with associated `*.css` and `*.js` files) that is the base of the notice, including assets and animations. Things like colors, displayed text and numerical parameters can be made customisable. A customisable parameter will be declared in the `*.template` file and will need to be set from a javascript function that will recieve the custom parameters as a json object.

Since this is basically creating a web page, animations can be made as CSS animations and/or a background gif file, or video, or any other way.

## Basic template folder structure

For ease of developpement, it is suggested to put all of your template related files in a named folder inside of the `templates` folder of Fae Notices. This is the location the user will need to put them in as well. 

A typical template folder for an template named `example template` could look like this:
```
<Fae Notices folder>
    /templates
        /example_template
            example_template.template
            example_template.html
            example_template.css
            example_template.js
```
To note, you can add more folders and files than these shown here. An `assets` folder for images, a `src` folder for `*.js` files etc depending on your template's needs. Refering to your `*.css`/`*.js` file inside of the `*.html` one can be done with relative paths, using your main folder as the root folder.

## The *.template file

This file allows the dock to read and use your template. It is JSON formated. The base keys that are required are the following:
```json
{
    "version": "1.0",
    "html": "templates/example_template/example_template.html",
    "width": "600",
    "height": "200",
    "config": {}
}
```
- **version** is the template schema version. It should be set to `"1.0"`.
- **html** is the path to your template's `*.html` file in reference to Fae Notice's root folder. It should always be `templates/<your path here>`.
- **width** and **height** are the sizes of your template in pixels. 600x400 or 600x200 is suggested. This will inform the dashboard on how to display the previews.
- **config** is the dictionary in which you can set your own configuration/customisation entries.

### The **config** section

This section of the `*.template` file allows you to setup variables that the user can configure when making a notice from your template. It will generally include things such as the message to display, the color of the background, etc. 

The following data types are currently supported:

- **text**: can be used for message input and/or for other arbitrary text entries that may or may not be displayed on the notice itself.
```json
    "config": {
        "<parameter name>": {
            "type": "string",
            "value": "<default value>"
        }
    }
```
- **color**: can be used for any color input. Will generate a color picker on the dashboard side and return a hex coded color in the format `#F0F0F0`.
```json
    "config": {
        "<parameter name>": {
            "type": "color",
            "value": "#<default value>"
        }
    }
```
- **number**: can be used for any numerical input. *0.0 can be changed as the default value.*
```json
    "config": {
        "<parameter name>": {
            "type": "number",
            "value": 0.0
        }
    }
```
You will need to add to the `config` dictionary every entry you need to be configurable. The `<parameter name>` key will also be the label displayed to the user for that parameter.

Here is an exemple of a full `*.template` file with every type of configurable parameter. This example lets the user configure the message to display in a bubble. The bubble's background color and offset from the top of the page are also configurable.

```json
{
    "version": "1.0",
    "html": "templates/example_template/example_template.html",
    "width": "600",
    "height": "200",
    "config": {
        "message": {
            "type": "string",
            "value": "This is an example notice."
        },
        "bubble-color": {
            "type": "color",
            "value": "#6300c0"
        },
        "bubble-offset-top": {
            "type": "number",
            "value": 50
        }
    }
}
```

## The *.html and *.css files

The html file is a regular html5 page. You are free to do whatever you need to make your notice display the way you want including css and javascript. 

The only requirements for the *.html file is that you include the `template_utils.js` script and have a div in your `body` that has the id `main` and is your top level div for your template. Something like this:
```html
<!DOCTYPE html>
<head>
    <!-- regular html head with css includes -->
</head>
<body>
    <div id="main">
        <!-- your notice html here -->
    </div>
    <script src="../../src/template_utils.js"></script>
    <!-- your script includes here -->
</body>
</html>
```

Including the `template_utils.js` is done using the following tag somewhere, usualy at the end of your `body`.:
```html
<script src="../../src/template_utils.js"></script>
```
This script is responsible for preparing the config data recieved from the user and letting you use it as well as some other manipulations to enable previews to be scaled properly and to make available for use the duration that the notice will be shown on screen when using the carousel. This duration will be available as a css variable called `--animation-duration` in your document's root, equivalent to the css `:root{}`. You can use it with `var(--animation-duration)` to match your css animation speed to the display duration.

## The *.js file(s)

To be able to use your configurable parameters, your javascript file(s) must include a function called `configure` that accepts a JSON dictionary. This dictionary will be formated according to the `config` dictionary of the `*.template` file in a shorthand way with the `value` directly associated with the `parameter name`. Assuming the example `*.template` file from above, you would recieve the following:
```json
{
    "message": "This is the user's message",
    "bubble-color": "#c3c3c3",
    "bubble-offset-top": 100
}
```
This `configure` function will be called by `template_utils.js` on load and is expected to set up the notice properly according to the configuration data. In other words it needs to be written in such a way that it populates the message bubble, changes the colors and so on, as required by your design.