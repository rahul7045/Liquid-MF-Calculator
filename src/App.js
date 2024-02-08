import './App.css';
import React from 'react';
import * as XLSX from 'xlsx';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useDispatch} from 'react-redux'
import { useSelector } from 'react-redux';
import {addexcel} from './store/excelAction'


function App() {
  const dispatch = useDispatch();
  const [data, setData] = React.useState({})
  const [mfund, setMfund] = React.useState()
  const [mfundscheme, setMfundscheme] = React.useState()
  const [toggle, setToggle] = React.useState(false)
  const [amount, setAmount] = React.useState('')
  const [unit, setUnit] = React.useState('')
  const storeData = useSelector((state) => state.excelData.excelData);

  React.useEffect(()=>{
    setData(storeData)
  },[ storeData])

  const handleFileUpload = (e) => {
    e.preventDefault()
    const file = e.target.files[0];
    let resultData = {}, currentcode
    if (file) {

      const reader = new FileReader(file);
      reader.onload = (event) => {
        const data = XLSX.read(event.target.result, { type: 'binary' });
        const jsonData = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]]);
        jsonData.map((data) => {
          if (data['Scheme Code'].endsWith('Mutual Fund')) {
            resultData[data['Scheme Code']] = []
            currentcode = data['Scheme Code']
          } else {
            if (currentcode && !!data['Scheme Name']) {
              resultData[currentcode].push({
                "Scheme Code": data['Scheme Code'],
                "Scheme Name": data['Scheme Name'],
                "Net Asset Value": data['Net Asset Value']
              })
            }

          }
        })
        dispatch(addexcel(resultData))
      };
      reader.readAsBinaryString(file);
    }
  };

  const amountChangeHandler = (e) =>{
      setAmount(e.target.value)
      let nav = data[mfund].filter(x => x['Scheme Code'] == mfundscheme)
      setUnit(e.target.value / nav[0]['Net Asset Value'])
  }

  const unitChangeHandler = (e)=>{
        setUnit(e.target.value)
        let nav = data[mfund].filter(x => x['Scheme Code'] == mfundscheme)
        setAmount(e.target.value * nav[0]['Net Asset Value'])
  }
  

  return (
    <Box className='DesktopStyleBox' >
      <label style={{paddingTop:'10px'}} id ='file'>Please Upload Excel File</label>
      <input  id="file" type="file" accept=".xlsx" onChange={handleFileUpload} />
      <TextField sx={{paddingTop:'10px' , marginTop : '10px'}} id="amount" type='number' label="Amount" variant="outlined" disabled={toggle ? true : false} value={amount} onChange={amountChangeHandler} />
      <TextField sx={{paddingTop:'10px' , marginTop : '10px'}} id="unit" label="Unit" type='number' variant="outlined" disabled={toggle ? false : true} value={unit} onChange={unitChangeHandler} />
      <FormControl sx={{paddingTop:'10px', marginTop : '10px'}} fullWidth>
        <InputLabel id="mfund">Mutual Fund</InputLabel>
        <Select
          id="mfund"
          value={mfund}
          label="Mutual Fund"
          onChange={(e) => { setMfund(e.target.value) }}
        >{Object.keys(data).map(x => (<MenuItem value={x} >{x}</MenuItem>))}
        </Select>
      </FormControl>
      <FormControl sx={{paddingTop:'10px' , marginTop : '10px'}} fullWidth>
        <InputLabel id="mfundscheme">Mutual Fund Scheme</InputLabel>
        <Select
          labelId="mfundscheme"
          id="mfundscheme"
          value={mfundscheme}
          label="Mutual Fund"
          onChange={(e) => { setMfundscheme(e.target.value) }}
        >{mfund && data[mfund].map(x => <MenuItem value={x['Scheme Code']}>{x['Scheme Name']}</MenuItem>)}
        </Select>
      </FormControl>
      <ToggleButtonGroup
        sx={{paddingTop:'10px'}}
        color="primary"
        value={toggle}
        exclusive
        onChange={() => setToggle(!toggle)}
      >
        <ToggleButton value={true}>ON</ToggleButton>
        <ToggleButton value={false}>OFF</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default App;
