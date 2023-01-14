tailwind.config = {
    theme: {
        extend: {
            colors: {
                atrovirens: {
                    50: '#E4EAEA',
                    100: '#C3D0CF',
                    200: '#B2C3C1',
                    300: '#91A8A7',
                    400: '#708E8C',
                    500: '#4F7471',
                    600: '#3F5D5A',
                    700: '#2F4644',
                    800: '#202E2D',
                    900: '#182322',
                },
            },
        },
    },
};

const { useState, useEffect } = React;

const App = () => {
    // constant
    const RATE_TABLE = [
        { name: '日幣', rate: 4.43, TWD: 0 },
        { name: '美金', rate: 0.033, TWD: 0 },
        { name: '澳幣', rate: 0.047, TWD: 0 },
        { name: '韓幣', rate: 39.78, TWD: 0 },
        { name: '印尼幣', rate: 420.17, TWD: 0 },
    ];
    // state(data)
    const [currencies, setCurrencies] = useState(RATE_TABLE); // 所有幣別
    const [inputTWVal, setInputTWVal] = useState(0); // 輸入要更換的金額 ipnut
    const [errorMessage, setErrorMessage] = useState(''); // 錯誤訊息

    // 新增幣別功能
    const [newCurrency, setNewCurrency] = useState({ name: '', rate: 0, TWD: 0 }); // 新增幣別 input

    // 兌換紀錄估功能
    const [wallet, setWallet] = useState(5000);
    const [records, setRecords] = useState([]);

    // methods
    const onCalculateTWD = () => {
        // verification form
        const isEmpty = inputTWVal === '';
        const isPositiveInreger = /^[1-9]\d*$/g;
        if (isEmpty) {
            return setErrorMessage(`輸入框不得為空！`);
        }
        if (!isPositiveInreger.test(inputTWVal)) {
            setCurrencies(RATE_TABLE); //init
            return setErrorMessage(`請輸入正整數！`);
        } else {
            setErrorMessage('');
        }

        setCurrencies(prevState => {
            const calculatedCurrencies = prevState.map(item => {
                return {
                    ...item,
                    TWD: (inputTWVal * item.rate).toFixed(2),
                };
            });

            return calculatedCurrencies;
        });
    };
    const onAddCurrency = () => {
        // verification form
        const isEmpty = newCurrency.name === '' || newCurrency.rate === '' || newCurrency.rate === null; // 驗證 input 是否填寫正確
        const isDuplicate = currencies.some(item => item.name === newCurrency.name); // 檢核新增的幣別是否已經重複

        if (isEmpty) alert('欄位不得為空，或欄位填寫不正確！');
        if (isDuplicate) alert('該貨幣已存在！');

        setCurrencies([...currencies, newCurrency]);

        // reset input
        setNewCurrency({ name: '', rate: 0, TWD: 0 });
    };

    const onExchange = (currency, rate) => {
        // 檢核錢包金額是否足夠
        if (wallet < inputTWVal) {
            return alert('錢包金額不足！');
        }

        setWallet(wallet - inputTWVal);
        setRecords([...records, { TWD: inputTWVal, currency: currency, amount: inputTWVal * rate }]);
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="flex">
                    <div className="w-1/2">
                        <h2>更換幣別</h2>

                        <div className="flex mb-2">
                            <input
                                type="text"
                                name="input"
                                className="border border-solid border-slate-600 rounded px-2"
                                placeholder="請輸入台幣"
                                value={inputTWVal}
                                onChange={e => setInputTWVal(e.target.value)}
                            />
                            <button className="btn btn-sm btn-primary ml-1" type="button" onClick={onCalculateTWD}>
                                試算可更換金額
                            </button>
                        </div>
                        <span className="text-red-600">{errorMessage}</span>

                        <table className="table-auto border-collapse border border-slate-500">
                            <thead>
                                <tr>
                                    <th className="bg-slate-200 border border-slate-300 p-2">幣別</th>
                                    <th className="bg-slate-200 border border-slate-300 p-2">當前匯率</th>
                                    <th className="bg-slate-200 border border-slate-300 p-2">可更換台幣</th>
                                    <th className="bg-slate-200 border border-slate-300 p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currencies.map(({ name, rate, TWD }, index) => {
                                    return (
                                        <tr key={name}>
                                            <td className="border border-slate-300 p-2">{name}</td>
                                            <td className="border border-slate-300 p-2">{rate}</td>
                                            <td className="border border-slate-300 p-2">{TWD}</td>
                                            <td className="border border-slate-300 p-2">
                                                <button
                                                    className="btn btn-sm btn-primary ml-1"
                                                    type="button"
                                                    onClick={() => {
                                                        onExchange(name, rate);
                                                    }}
                                                >
                                                    更換
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td className="border border-slate-300 p-2">
                                        <input
                                            type="text"
                                            className="border border-solid border-slate-600 rounded px-2"
                                            placeholder="請輸入幣別"
                                            value={newCurrency.name}
                                            onChange={e => setNewCurrency({ ...newCurrency, name: e.target.value })}
                                        />
                                    </td>
                                    <td className="border border-slate-300 p-2">
                                        <input
                                            type="number"
                                            className="border border-solid border-slate-600 rounded px-2"
                                            placeholder="請輸入匯率"
                                            value={newCurrency.rate || 0}
                                            onChange={e => setNewCurrency({ ...newCurrency, rate: e.target.value })}
                                        />
                                    </td>
                                    <td className="border border-slate-300 p-2">-</td>
                                    <td className="border border-slate-300 p-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary ml-1"
                                            type="button"
                                            onClick={onAddCurrency}
                                        >
                                            新增
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="w-1/2">
                        <h2>交易紀錄</h2>
                        <hr></hr>
                        目前餘額：{wallet} 元
                        <div className={records.length !== 0 ? 'hidden' : 'text-center my-2'}>尚無兌換紀錄</div>
                        <div className={records.length === 0 ? 'hidden' : ''}>
                            <table className="table-auto border-collapse border border-slate-500">
                                <thead>
                                    <tr>
                                        <th className="bg-slate-200 border border-slate-300 p-2">花費台幣</th>
                                        <th className="bg-slate-200 border border-slate-300 p-2">兌換幣別</th>
                                        <th className="bg-slate-200 border border-slate-300 p-2">已兌換</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map(({ TWD, currency, amount }, index) => {
                                        return (
                                            <tr key={'record' + index}>
                                                <td className="border border-slate-300 p-2">{TWD}</td>
                                                <td className="border border-slate-300 p-2">{currency}</td>
                                                <td className="border border-slate-300 p-2">{amount}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
