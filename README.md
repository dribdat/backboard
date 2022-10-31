# Challenges microsite

This is a one page application that shows challenges for a hackathon event using the remote API of [dribdat](https://github.com/dribdat/dribat).

You probably want to enable *Challenges* and *Previews* (opens modal dialog on click with navigation) in the options at the footer of the page. Use the handy *Share* link.

Demo: https://backboard.vercel.app/?&previews=1&challenges=1

## Usage

Deploy this application with any service that supports Vue.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world)

Put a `datapackage.json` file that you exported from dribdat into the **public** folder, or host it somewhere online.

Then configure your site with the following environment variables:

- `VUE_APP_DRIBDAT_URL` - fully qualified link to your dribdat event, or online hosted Data Package; e.g. https://meta.dribdat.cc/event/5
- `VUE_APP_GOOGLE_FORM_URL` (optional) - if you are using a Google Form to collect votes or feedback.
- `VUE_APP_HIDE_TOOLBAR` (optional) - to hide the row of buttons in the footer
- `BACKBOARD_ROOT` (optional) - if your deployment is not at the root, change it here (e.g. `/backboard`)

## Development

To run locally, install Node.js and Yarn, then to start a development server:

```
yarn serve
```

Created using Vue.js and CodeSandbox.

![](https://upload.wikimedia.org/wikipedia/commons/9/9a/Zh_Basketball_backboard_and_basket_bitmap_1940.svg)

_Players typically aim for the box in the backboard when making a shot in basketball._
