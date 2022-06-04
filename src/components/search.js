import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import { Cell, PieChart, Pie, AreaChart, Area, LineChart, Line  } from 'recharts';

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

  // const url = 'http://localhost:3001/api/comments/search/depp'
  let q = "depp"
  const url = `http://localhost:3001/${q}?clean=true`

  useEffect(() => {
    axios.get(url)
      .then(async (data) => {

        setList(data.data)

        let neg = { name: "neg", value: 0 }
        let pos = { name: "pos", value: 0 }
        let neutral = { name: "neutral", value: 0 }
        data.data.forEach((record) => {
          console.log("RECORD : " + record)
          neg.value += record.neg
          pos.value += record.pos
          neutral.value += record.neutral
        })

        // function clean(data, len) {
        //   return new Promise((resolve, reject) => {
        //     try {
        //       data /= len
        //       data *= 100
        //       resolve(Math.floor(data))
        //     } catch(e) {
        //       reject(e)
        //     }
        //   })
        // }

        // neg.value = await clean(neg.value, data.data.length)
        // pos.value = await clean(pos.value, data.data.length)
        // neutral.value = await clean(neutral.value, data.data.length)
        
        neg.value = Math.floor(neg.value * 10)
        pos.value = Math.floor(pos.value * 10)
        neutral.value = Math.floor(neutral.value * 10)

        setPiData([ neg, pos, neutral ])
      })
      .catch((e) => {
        console.log(e.message)
      })
  }, [])
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="Search">
      <PieChart width={400} height={400}>
        <Pie data={piData} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label >
          {piData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
      </Pie>
      </PieChart>
      <AreaChart width={400} height={400} data={list}>
        <Area type="monotone" dataKey="pos" stroke="#8884d8" fill="#8884d8" stackId="2" />
        <Area type="monotone" dataKey="neutral" stroke="#ffc658" fill="#ffc658" stackId="2" />
        <Area type="monotone" dataKey="neg" stroke="#82ca9d" fill="#82ca9d" stackId="2" />
      </AreaChart>
      <AreaChart width={400} height={400} data={list} stackOffset="expand">
        <Area type="monotone" dataKey="pos" stroke="#8884d8" fill="#8884d8" stackId="1" />
        <Area type="monotone" dataKey="neg" stroke="#82ca9d" fill="#82ca9d" stackId="1" />
        <Area type="monotone" dataKey="neutral" stroke="#ffc658" fill="#ffc658" stackId="1" />
      </AreaChart>
      <LineChart width={400} height={400} data={list}>
        <Line type="monotone" dataKey="pos" stroke="#8884d8" />
        <Line type="monotone" dataKey="neg" stroke="#8774d8" />
        <Line type="monotone" dataKey="neutral" stroke="#8774d8" />
      </LineChart>
    </div>
  );
}

export default Search;
