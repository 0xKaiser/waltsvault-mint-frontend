import React, {useEffect} from 'react'

import './counter.scss'

export default function Counter({ maxCount, count, setCount }) {

    const handleCounterIncrease = () => {
        if(count < maxCount) {
            setCount(count + 1);
        }
        else
            return
    }
    
    const handleCounterDecrease = () => {
        if(count > 1) {
            setCount(count - 1);
        }
        else
            return
    }

    useEffect(() => {
        if (count > maxCount)
            setCount(maxCount);
    }, [maxCount]);

    return (
        <div className="counter-container">
            <div className="counter">
                <button onClick={() => handleCounterDecrease()}>-</button>
                <h1>{count}</h1>
                <button onClick={() => handleCounterIncrease()}>+</button>
            </div>
        </div>
    )
}