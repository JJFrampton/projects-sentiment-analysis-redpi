import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import { PieChart, Pie, AreaChart, Area, LineChart, Line  } from 'recharts';

function Search() {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ error, setError ] = useState(null)
  const [ list, setList ] = useState([])

  // const url = 'http://localhost:3001/api/comments/search/depp'
  let q = "depp"
  const url = `http://localhost:3001/${q}?clean=true`

  useEffect(() => {
    axios.get(url)
      .then((data) => {
        console.log("WORKING")
        console.log(data.data)
        setList(data.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  const graph = (
    <LineChart width={400} height={400} data={list}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  )

  return (
    <div className="Search">
      <PieChart width={400} height={400}>
        <Pie data={list} nameKey="label" dataKey="pos" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
        <Pie data={list} dataKey="label" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label />
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
