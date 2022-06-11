import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import { ResponsiveContainer, Tooltip, Cell, PieChart, Pie, AreaChart, Area, LineChart, Line  } from 'recharts';
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

  const lineChartMargins = { top: 0, right: 30, left: 30, bottom: 30 }

  return (
    <div className="Search" style={{width: "100%"}}>
      <form onSubmit={handleSubmit}>
        <input id="searchBox" type="text" placeholder="Search.." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
        <input type="submit" hidden />
      </form>
      <div className="charts" style={{width: '100%', display: "flex", flexWrap: "wrap"}}>
        <ResponsiveContainer width="50%" height={400}
        >
          <PieChart>
            <Pie data={piData} dataKey="value" cx="50%" cy="50%" outerRadius="60%" fill="#8884d8" >
              {piData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Pie data={labelData} dataKey="value" cx="50%" cy="50%" innerRadius="65%" outerRadius="80%" fill="#82ca9d" label >
              {labelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer
          width="50%"
          height={400}
        >
          <AreaChart
            data={list}
            margin={lineChartMargins}
          >
            <Area type="monotone" dataKey="pos" stroke={colors.green.hex} fill={colors.green.hex} stackId="2" />
            <Area type="monotone" dataKey="neutral" stroke={colors.yellow.hex} fill={colors.yellow.hex} stackId="2" />
            <Area type="monotone" dataKey="neg" stroke={colors.red.hex} fill={colors.red.hex} stackId="2" />
          </AreaChart>
        </ResponsiveContainer>
        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <AreaChart data={list} stackOffset="expand"
            margin={lineChartMargins}
          >
            <Area type="monotone" dataKey="pos" stroke={colors.green.hex} fill={colors.green.hex} stackId="1" />
            <Area type="monotone" dataKey="neg" stroke={colors.red.hex} fill={colors.red.hex} stackId="1" />
            <Area type="monotone" dataKey="neutral" stroke={colors.yellow.hex} fill={colors.yellow.hex} stackId="1" />
          </AreaChart>
        </ResponsiveContainer>
        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <LineChart data={list}
            margin={lineChartMargins}
          >
            <Line type="monotone" dataKey="pos" stroke={colors.green.hex} />
            <Line type="monotone" dataKey="neg" stroke={colors.red.hex} />
            <Line type="monotone" dataKey="neutral" stroke={colors.yellow.hex} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Search;
