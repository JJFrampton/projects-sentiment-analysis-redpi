import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import { Tooltip, Cell, PieChart, Pie, AreaChart, Area, LineChart, Line  } from 'recharts';
import colors from '../utils/colors'
import { getSearch, parseStats } from '../connectors/api'

function Search() {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ error, setError ] = useState(null)
  const [ list, setList ] = useState([])
  const [ piData, setPiData ] = useState([])
  const [ labelData, setLabelData ] = useState([])
  const [ searchTerm, setSearchTerm ] = useState("")

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res = await getSearch(searchTerm);
      res = res.data
      setList(res)
      let {piDataParsed, labelDataParsed} = parseStats(res)
      setPiData(piDataParsed)
      setLabelData(labelDataParsed)
    } catch (e) {
      console.log(e.message)
    }
  }

  const COLORS = {
    neg: colors.red.hex,
    pos: colors.green.hex,
    neutral: colors.yellow.hex
  }

  return (
    <div className="Search">
      <form onSubmit={handleSubmit}>
        <input id="searchBox" type="text" placeholder="Search.." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
        <input type="submit" hidden />
      </form>
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
