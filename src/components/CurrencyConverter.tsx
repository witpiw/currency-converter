import { If, Then, Else } from "react-if"
import { useState, useEffect } from "react"
import { IoMdSwap } from "react-icons/io"

import { useFetch } from "../hooks/useFetch"

type Currency = keyof Rates

function CurrencyConverter() {
    const { data, error } = useFetch<ApiResponse>("https://open.er-api.com/v6/latest/USD")
    const [firstCurrency, setFirstCurrency] = useState<Currency>("PLN")
    const [secondCurrency, setSecondCurrency] = useState<Currency>("USD")
    const [firstValue, setFirstValue] = useState<string>("0.00");
    const [secondValue, setSecondValue] = useState<string>("0.00");

    useEffect(() => {
        calculateCurrencies("first");
    }, [firstCurrency]);

    useEffect(() => {
        calculateCurrencies("second");
    }, [secondCurrency]);

    const calculateCurrencies = (change: "first" | "second") => {
        if (!data) return

        const exchangeRate = change == "first" ? data.rates[firstCurrency] : data.rates[secondCurrency]
        const value = Number.parseFloat(change == "first" ? firstValue : secondValue)
        const convertedValueToUSD = value / exchangeRate

        const convertedValue = (convertedValueToUSD * data.rates[change == "first" ? secondCurrency : firstCurrency]).toFixed(2)

        return change == "first" ? setSecondValue(convertedValue) : setFirstValue(convertedValue)
    }

    const swapCurrencies = () => {
        setFirstCurrency(secondCurrency)
        setSecondCurrency(firstCurrency)
        setFirstValue(secondValue)
        setSecondValue(firstValue)
    }

    const handleValueBlur = (value: string, whichValue: 'first' | 'second') => {
        if (value === "") {
            value = "0.00"
        }

        value = parseFloat(value).toFixed(2)
        whichValue == "first" ? setFirstValue(value) : setSecondValue(value)

        calculateCurrencies(whichValue)
    }

    const handleCurrencyChange = (value: string, whichCurrency: 'first' | 'second') => {
        whichCurrency == "first" ? setFirstCurrency(value as Currency) : setSecondCurrency(value as Currency)
    }

    return (
        <main>
            <If condition={!!error}>
                <Then>
                    <p>{error?.message || "Failed to fetch conversion rates"}</p>
                </Then>
            </If>
            <If condition={!data}>
                <Then>
                    <p>Loading...</p>
                </Then>
                <Else>
                    <div className="currency-container">
                        <input type="number" min={0} step="0.01" value={firstValue} onBlur={(e) => handleValueBlur(e.target.value, "first")} onChange={(e) => setFirstValue(e.target.value)} onFocus={(e) => e.target.select()} />
                        <select name="firstCurrency" value={firstCurrency} onChange={(e) => handleCurrencyChange(e.target.value, 'first')}>
                            {Object.keys(data?.rates || {}).map((currency, idx) => (
                                <option key={`first-${idx}`} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>
                    <button className="currency-swap" onClick={swapCurrencies}><IoMdSwap /></button>
                    <div className="currency-container">
                        <input type="number" min={0} step="0.01" value={secondValue} onBlur={(e) => handleValueBlur(e.target.value, "second")} onChange={(e) => setSecondValue(e.target.value)} onFocus={(e) => e.target.select()} />
                        <select name="secondCurrency" value={secondCurrency} onChange={(e) => handleCurrencyChange(e.target.value, 'second')}>
                            {Object.keys(data?.rates || {}).map((currency, idx) => (
                                <option key={`second-${idx}`} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>
                </Else>
            </If>
        </main>
    )
}

export { CurrencyConverter }