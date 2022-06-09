import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import { Tooltip, Cell, PieChart, Pie, AreaChart, Area, LineChart, Line  } from 'recharts';

const colors = {
  red: {
    hex: '#ffb3ba',
    rgb: '(255,179,186)'
  },
  pink: {
    hex: '#ffdfba',
    rgb: '(255,223,186)'
  },
  yellow: {
    hex: '#ffffba',
    rgb: '(255,255,186)'
  },
  green: {
    hex: '#baffc9',
    rgb: '(186,255,201)'
  },
  blue: {
    hex: '#bae1ff',
    rgb: '(186,225,255)'
  }
}

function Search() {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ error, setError ] = useState(null)
  const [ list, setList ] = useState([])
  const [ piData, setPiData ] = useState([])
  const [ labelData, setLabelData ] = useState([])
  const [ searchTerm, setSearchTerm ] = useState("")

  // const url = 'http://localhost:3001/api/comments/search/depp'
  // let q = "depp"
  function getURL(q) {
    console.log( `http://localhost:3001/${q}?clean=true` )
    return `http://localhost:3001/${q}?clean=true`
  }

  useEffect(() => {
    function listener(event) {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        let query = document.getElementById("searchBox").value
        // console.log(searchTerm) // NOTHING !
        //
        // ENCODING NOT WORKING
        axios.get( encodeURI(getURL(query)))
        .then(async (data) => {

          setList(data.data)

          let neg = { name: "neg", value: 0 }
          let pos = { name: "pos", value: 0 }
          let neutral = { name: "neutral", value: 0 }
          let labels = {}
          data.data.forEach((record) => {
            neg.value += record.neg
            pos.value += record.pos
            neutral.value += record.neutral

            if (!labels[record.label]) { labels[record.label] = { name: record.label, value: 0 } }
            labels[record.label].value += 1
          })

          neg.value = Math.floor(neg.value * 10)
          pos.value = Math.floor(pos.value * 10)
          neutral.value = Math.floor(neutral.value * 10)

          setPiData([ neg, pos, neutral ])
          setLabelData(Object.values(labels))
        })
        .catch((e) => {
          console.log(e.message)

        })
      }
    }
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    }
  }, [])

  useEffect(() => {
    axios.get(getURL("nintendo"))
      .then(async (data) => {

        setList(data.data)

        let neg = { name: "neg", value: 0 }
        let pos = { name: "pos", value: 0 }
        let neutral = { name: "neutral", value: 0 }
        let labels = {}
        data.data.forEach((record) => {
          neg.value += record.neg
          pos.value += record.pos
          neutral.value += record.neutral

          if (!labels[record.label]) { labels[record.label] = { name: record.label, value: 0 } }
          labels[record.label].value += 1
        })

        neg.value = Math.floor(neg.value * 10)
        pos.value = Math.floor(pos.value * 10)
        neutral.value = Math.floor(neutral.value * 10)

        setPiData([ neg, pos, neutral ])
        setLabelData(Object.values(labels))
      })
      .catch((e) => {
        console.log(e.message)
      })
  }, [])

  const COLORS = {
    neg: colors.red.hex,
    pos: colors.green.hex,
    neutral: colors.yellow.hex
  }

  return (
    <div className="Search">
      <input id="searchBox" type="text" placeholder="Search.." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
      <PieChart width={400} height={400}>
        <Pie data={piData} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" >
          {piData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Pie data={labelData} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label >
          {labelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <AreaChart width={400} height={400} data={list}>
        <Area type="monotone" dataKey="pos" stroke={colors.green.hex} fill={colors.green.hex} stackId="2" />
        <Area type="monotone" dataKey="neutral" stroke={colors.yellow.hex} fill={colors.yellow.hex} stackId="2" />
        <Area type="monotone" dataKey="neg" stroke={colors.red.hex} fill={colors.red.hex} stackId="2" />
      </AreaChart>
      <AreaChart width={400} height={400} data={list} stackOffset="expand">
        <Area type="monotone" dataKey="pos" stroke={colors.green.hex} fill={colors.green.hex} stackId="1" />
        <Area type="monotone" dataKey="neg" stroke={colors.red.hex} fill={colors.red.hex} stackId="1" />
        <Area type="monotone" dataKey="neutral" stroke={colors.yellow.hex} fill={colors.yellow.hex} stackId="1" />
      </AreaChart>
      <LineChart width={400} height={400} data={list}>
        <Line type="monotone" dataKey="pos" stroke={colors.green.hex} />
        <Line type="monotone" dataKey="neg" stroke={colors.red.hex} />
        <Line type="monotone" dataKey="neutral" stroke={colors.yellow.hex} />
      </LineChart>
    </div>
  );
}

export default Search;
