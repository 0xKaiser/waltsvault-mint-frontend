import { ReactComponent as MintNumber2Backdrop } from 'assets/images/backdrops/img-mint-number-2-backdrop.svg';
import { ReactComponent as MintNumberBackdrop } from 'assets/images/backdrops/img-mint-number-backdrop.svg';

export default function Counter ({ style, maxCount, count, setCount }: { style:number, maxCount:number, count:number, setCount: ((state:any) => void)}) {

    const handleCounterIncrease = () => {
        if(count < maxCount) {
            setCount(count + 1);
        }
    }
    
    const handleCounterDecrease = () => {
        if(count > 0) {
            setCount(count - 1);
        }
    }

    return (
        <div className="flex">
            <span className="text-[94px] leading-[47px] cursor-pointer" onClick={() => handleCounterDecrease()}>
              -
            </span>
            <div className="flex w-[105px] h-[60px] items-center text-center justify-center mx-[16px]">
              {style === 0 ? <MintNumberBackdrop /> : <MintNumber2Backdrop />}
              <span className="absolute text-[64px] mt-[-4px] text-white">{count}</span>
            </div>
            <span className="text-[94px] leading-[47px] cursor-pointer" onClick={() => handleCounterIncrease()}>
              +
            </span>
          </div>
    )
}