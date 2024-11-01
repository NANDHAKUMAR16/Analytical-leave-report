import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { Container, InputLabel, Typography } from '@mui/material';
import { FormControl, MenuItem, Select } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./App.css"

export default function App() {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState('');

  const handleDateChange = async (date) => {
    if (date) {
      const formattedDate = String(date.format('DD/MM/YYYY'));
      const response = await axios.get('http://localhost:5000/data');

      response.data.map((date) => {
        if (date[formattedDate]) {
          setData(date[formattedDate][0]);
        }
      });
      setSelectedDate(formattedDate); // Set date as formatted string
    } else {
      console.log('No date selected');
      setSelectedDate(null);
      setData(null); // Reset data if no date is selected
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const getChartData = () => {
    if (data && selectedDate && selectedYear && data[selectedYear]) {
      return Object.entries(data[selectedYear]).map(([dept, count], index) => ({
        department: dept.toUpperCase(),
        leaves: count,
        fill: index % 2 === 0 ? 'tomato' : 'teal',
      }));
    }
    return [];
  };

  const chartData = getChartData();
  const maxYValue = Math.max(...chartData.map(item => item.leaves), 0) + 5;

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        height: '100vh'
      }}
    >
      <div style={{ width: 'calc(100% + 100px)', maxWidth: '750px' }}>
        <Typography sx={{ fontSize: "22px", fontWeight: "600", textAlign: "center", fontFamily: "Poppins", margin: "15px 5px" }}> Analytical Attendance report</Typography>
        <div style={{ width: "400px", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", marginTop: "10px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                value={selectedDate ? dayjs(selectedDate, 'DD/MM/YYYY') : null}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
                slotProps={{
                  openPickerButton: {
                    color: 'primary',
                  },
                  inputAdornment: {
                    position: 'start',
                  },
                }}
                style={{ width: '100%' }} // Adjust width to match the Select
              />
            </DemoContainer>
          </LocalizationProvider>
          <FormControl style={{ width: "260px" }} margin="normal">
            <InputLabel>YEAR</InputLabel>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              label="Year"
              style={{ width: '100%' }} // Adjust width to match the TextField
            >
              <MenuItem key={1} value={1}>I</MenuItem>
              <MenuItem key={2} value={2}>II</MenuItem>
              <MenuItem key={3} value={3}>III</MenuItem>
              <MenuItem key={4} value={4}>IV</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ maxWidth: '100%', marginBottom: '20px', marginTop: "50px",border:chartData.length ? "2px solid" : "0px solid",padding:"10px",borderRadius:"5px",borderColor:"grey" }}>
          {chartData.length > 0 && (
            <div>
              <div style={{ minWidth: '600px' }}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" fontSize={14} />
                    <YAxis domain={[0, maxYValue]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leaves" label={{ position: 'top' }} fill="black" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
