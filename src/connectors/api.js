import axios from 'axios';

function getURL(q) {
  q = encodeURIComponent(q)
  return `http://localhost:3001/${q}?clean=true`
}

function getSearch(searchTerm) {
  // let query = document.getElementById("searchBox").value
  console.log("SEARCHTERM") // NOTHING !
  console.log(searchTerm) // NOTHING !
  //
  // ENCODING NOT WORKING
  // axios.get( getURL(query) )
  return axios.get( getURL(searchTerm) )
}

function parseStats(data) {

  let neg = { name: "neg", value: 0 }
  let pos = { name: "pos", value: 0 }
  let neutral = { name: "neutral", value: 0 }
  let labels = {}
  data.forEach((record) => {
    neg.value += record.neg
    pos.value += record.pos
    neutral.value += record.neutral

    if (!labels[record.label]) { labels[record.label] = { name: record.label, value: 0 } }
    labels[record.label].value += 1
  })

  neg.value = Math.floor(neg.value * 10)
  pos.value = Math.floor(pos.value * 10)
  neutral.value = Math.floor(neutral.value * 10)

  return {
    piDataParsed: [ neg, pos, neutral ],
    labelDataParsed: Object.values(labels)
  }
}

export { getSearch, parseStats }
