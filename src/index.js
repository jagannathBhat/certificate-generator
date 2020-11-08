const fs = require('fs')
const PDFDocument = require('pdfkit')
const SVGtoPDF = require('svg-to-pdfkit')
const { exit } = require('process')

const certificateSVGFile = '../example/template.svg' //SVG file of certificate design with dummy name.
const dir = './certs/' //Directory to which the generated certificates are to be saved.
const dummyName = 'dummyname' //Dummy name to be replaced.
const namesFilename = '../example/names.csv' //CSV file containing names to be put on certificate. One name per row.
const svgHeight = 540 // Height of page
const svgWidth = 960 // Width of page

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir)
}

if (!certificateSVGFile) {
	console.log('Please provide template file name')
	exit(0)
}

if (!namesFilename) {
	console.log('Please provide name of CSV file with all names')
	exit(0)
}

const namesFile = fs.readFileSync(namesFilename).toString()
let names = namesFile.split('\n')

names.map(name => {
	const data = fs.readFileSync(certificateSVGFile).toString()
	const doc = new PDFDocument({ size: [svgWidth, svgHeight] })
	let filename = name

	svg = data.replace(dummyName, name)

	SVGtoPDF(doc, svg, 0, 0)

	const stream = fs.createWriteStream(dir + filename + '.pdf')
	doc.pipe(stream)
	doc.end()
})
