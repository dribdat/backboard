# Backboard for Dribdat

This is a single page application (SPA) that shows the projects and challenges for a hackathon event using the remote API of [Dribdat](https://dribdat.cc). 

Project data is shown for a specific event, with flexible configuration options for displaying and sorting the results in different ways. You can seamlessly navigate using your mouse or keyboard between projects and challenges. More functionality is planned in the future, with the long-term goal of creating a more modern, decoupled frontend for Dribdat.

The Backboard has minimal formatting, tight margins, and is ideal for embedding into your webpage anonuncing the upcoming event or results. If you are developing a Vue.js app, you can even import the Challenges, Honeycomb and Previews components individually.

**Tip:** You may want to enable *Challenges* and *Previews* (opens a modal dialog with swipable navigation) in the options at the footer of the page. 
Use the handy *Share* link to get a URL with your config.

**Demo:** https://backboard.vercel.app/

## Installation

Deploy this application with any service that supports Node.js 

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fdribdat%2Fbackboard)

## Usage

Put a `datapackage.json` file that you exported from dribdat into the **public** folder - or just configure with a link to your dribdat event.

You can use the following environment variables:

- `VUE_APP_DRIBDAT_URL` - fully qualified link to your [Dribdat](https://dribdat.cc) event, or online hosted Data Package (\* see examples)
- `VUE_APP_DEFAULT_OPTS` (optional) - the default display settings - copy the part after ? from the Share link.
- `VUE_APP_HIDE_TOOLBAR` (optional) - makes the options toolbar in the footer unavailable.
- `VUE_APP_VOTE_FORM_URL` (optional) - link to a form where you are collecting votes or feedback, otherwise the Dribs Post feature will be used.
- `BACKBOARD_ROOT` (optional) - if your deployment is not at the root, change it here (e.g. `/backboard`)

\* Examples:

- https://meta.dribdat.cc/event/5
- https://meta.dribdat.cc/hackathon.json
- https://meta.dribdat.cc/api/project/top.json
- https://meta.dribdat.cc/api/event/current/datapackage.json

## Development

To run locally, install Node.js and Yarn, then to start a development server:

```
yarn install
yarn serve
```

## Credits

Created using Vue.js and CodeSandbox.

See also this earlier version: https://github.com/dribdat/dribdat2_frontend

## Why backboard?

![](https://upload.wikimedia.org/wikipedia/commons/9/9a/Zh_Basketball_backboard_and_basket_bitmap_1940.svg)

_Players typically aim for the box in the backboard when making a shot in basketball._

[MIT License](LICENSE)
