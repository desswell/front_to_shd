import React, {useState} from "react";
import Plot from 'react-plotly.js';
import StyledInput from "../components/input";
import Select from "../components/select";
import Checkbox from "../components/checkbox";
import SelectMulti from "../components/select_checkbox";
import Button from "../components/Button";
import axios from 'axios';
import {DotLoader} from "react-spinners";

export function MainPage() {
    const [loader, setLoader] = useState(false)
    const [sigh, setSigh] = useState('time')
    const [param, setParam] = useState([])
    const [sighParam, setSighParam] = useState('Capacity usage(%)')
    const [window, setWindow] = useState('auto_interval')
    const [level, setLevel] = useState([])
    const [storagePool, setStoragePool] = useState(false)
    const [global, setGlobal] = useState(false)
    const [cloud, setCloud] = useState(false)
    const [interval, setInterval] = useState('Месяц')
    const [intervalNum, setIntervalNum] = useState(1)
    const [data, setData] = useState([
        {
            x: [1, 2, 3, 4],
            y: [10, 15, 13, 17],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
        },
        {
            x: [1, 2, 3, 4],
            y: [16, 5, 11, 9],
            type: 'bar',
            name: 'Bar Chart',
        },
    ])
    const handleChangeParam = (selected) => {
        setParam(selected);
    };
    const handleChangeLevel = (selected) => {
        setLevel(selected);
    };

    const handleClick = async () => {
        setLoader(true)
        await axios.post('', {
            param: param,
            sigh: sigh,
            target: sighParam,
            sp_flag: storagePool,
            select_window_type: window,
            dropdown_block: {
                find_global: global,
                interval: interval,
                interval_num: intervalNum
            },
            levels_list: level,
            use_cloud: cloud
        }).then((response) => {
            setData(response.data)
            setLoader(false)
        }).catch((error) => console.log(error))
    }

    return(
        <div className="main-page-container">
            <div className='graph'>
            <Plot
                data={data}
                layout={{ width: 600, height: '100%', title: 'График Plotly' }}
            />
            </div>
            <div>
                <div className="input-div">
                    <SelectMulti options={[
                        {key: 'System', cat: 'Array'},
                        {key: 'StoragePool1', cat: 'StoragePool1'},
                        {key: 'StoragePool2', cat: 'StoragePool2'},
                    ]} handleChange={handleChangeParam} title='Параметры' state={[{key: 'System', cat: 'Array'}]}/>
                </div>
                <div className="input-div">
                    <StyledInput children='Признаки' value={sigh} onChange={(event) => setSigh(event.target.value)}/>
                </div>
                <div className="input-div">
                    <StyledInput children='Целевые признаки' value={sighParam}
                                 onChange={(event) => setSighParam(event.target.value)}/>
                </div>
                <div className="input-div">
                    <Select children={[
                        {value: 'auto_interval', label: '1. Автоматический'},
                        {value: 'advanced_interval', label: '2. Ручной (продвинутый)'},
                    ]} title='Режим выбора окна' value={window} onChange={(event) => setWindow(event.target.value)}/>
                </div>
                {window==='advanced_interval' && <div>
                    <div className="input-div">
                        <Select children={[
                            {value: 'День', label: 'День'},
                            {value: 'Неделя', label: 'Неделя'},
                            {value: 'Месяц', label: 'Месяц'},
                            {value: 'Год', label: 'Год'},
                        ]} title='Интервал' value={interval} onChange={(event) => setInterval(event.target.value)}/>
                    </div>
                    <div className="input-div">
                        <StyledInput children='Количество интервалов' value={intervalNum} onChange={(event) => setIntervalNum(event.target.value)}/>
                    </div>
                </div>
                }
                <div className="input-div">
                    <SelectMulti options={[
                        {key: 'level0', cat: 'Уровень 1'},
                        {key: 'level1', cat: 'Уровень 2'},
                        {key: 'level2', cat: 'Уровень 3'},
                    ]} handleChange={handleChangeLevel} title='Предсказание для' state={[{key: 'level0', cat: 'Уровень 1'}]}/>
                </div>
                <div className="input-div">
                    <Checkbox title='Использовать для прогноза StoragePool' type='checkbox'
                              value={storagePool} onChange={(event) => setStoragePool(event.target.value)}/>
                </div>
                {window==='auto_interval' && <div className="input-div">
                    <Checkbox title='find_global' type='checkbox'
                              value={global} onChange={(event) => setGlobal(event.target.value)}/>
                </div>}
                <div className="input-div">
                    <Checkbox title='Облако точек' type='checkbox'
                              value={cloud} onChange={(event) => setCloud(event.target.value)}/>
                </div>
                <div className="input-div">
                    {!loader && <Button children='Визуализировать' onClick={handleClick}/>}
                    {loader && <DotLoader color='#5558FA'/>}
                </div>
            </div>
        </div>
    )
}
