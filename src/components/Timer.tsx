import { useTime } from "../hooks/useTime"

function Timer() {
    const time = useTime(1000)

    return (
        <header>
            <h1>{`${time.getDate()}`.padStart(2, "0")}.{`${time.getMonth()}`.padStart(2, "0")}.{time.getFullYear()}</h1>
            <h2>{`${time.getHours()}`.padStart(2, "0")}:{`${time.getMinutes()}`.padStart(2, "0")}:{`${time.getSeconds()}`.padStart(2, "0")}</h2>
        </header>
    )
}

export { Timer }