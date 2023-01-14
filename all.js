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
    const [inputTWVal, setInputTWVal] = useState(0); // 輸入要更換的金額 ipnut
    const [errorMessage, setErrorMessage] = useState(''); // 錯誤訊息
    const [currencies, setCurrencies] = useState(RATE_TABLE); // 所有幣別

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
                                計算
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
                                                    onClick={onCalculateTWD}
                                                >
                                                    更換
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-1/2">
                        <h2>交易紀錄</h2>3
                    </div>
                </div>
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
