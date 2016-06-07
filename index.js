var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var permalinks = require('metalsmith-permalinks');
var metallic = require('metalsmith-metallic');
var each = require('metalsmith-each');
var assets = require('metalsmith-assets');
var parseGitHubLinks = require('./plugins/parse-github-links.js');
var generateMenu = require('./plugins/generate-menu.js');
var redoc = require('./plugins/slugify-files.js');
var slug = require('metalsmith-slug');
var ignore = require('metalsmith-ignore');
var headingsidentifier = require("metalsmith-headings-identifier");

Metalsmith(__dirname)
	.metadata({
		title: "Rocket.Chat Docs",
		description: "Rocket.Chat Docs",
		generator: "Metalsmith",
		url: "http://www.metalsmith.io/"
	})
	.source('./src')
	.destination('./build')
	.clean(true)
	.use(ignore([
		'.git/**/*',
		'.git*'
	]))
	.use(parseGitHubLinks())
	.use(redoc.slugifyFiles())
	.use(generateMenu())
	.use(markdown({
		smartypants: true,
		gfm: true,
		tables: true
	}))
	.use(metallic())
	.use(layouts({
		engine: 'handlebars',
		default: 'layout.html',
		directory: 'templates',
		partials: 'templates'
	}))
	.use(redoc.slugifyLinks())
	.use(headingsidentifier({
		linkTemplate: "<a class='myCustomHeadingsAnchorClass' href='#%s'><span></span></a>"
	}))
	.use(assets({
		source: './assets', // relative to the working directory
		destination: './assets' // relative to the build directory
	}))
	.build(function(err, files) {
		if (err) {
			throw err; }
	});

