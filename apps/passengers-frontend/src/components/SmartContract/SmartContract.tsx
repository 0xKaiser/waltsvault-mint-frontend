import useIsElementVisible from '@twl/common/hooks/useIsElementVisible';
import DynamicAnimatedText from 'components/DynamicAnimatedText';
import React from 'react';

const tab = '&emsp;&emsp;';
const SMART_CONTRACT_TEXT = `
contract GasGolf {<br>
<span>${tab}</span>// start - 50908 gas<br>
<span>${tab}</span>// use calldata - 49163 gas<br>
<span>${tab}</span>// load state variables to memory - 48952 gas<br>
<span>${tab}</span>// short circuit - 48634 gas<br>
<span>${tab}</span>// loop increments - 48244 gas<br>
<span>${tab}</span>// cache array length - 48209 gas<br>
<span>${tab}</span>// load array elements to memory - 48047 gas<br>
<span>${tab}</span>// uncheck i overflow/underflow - 47309 gas<br>
<span>${tab}</span><br>
<span>${tab}</span>uint public total;<br>
<span>${tab}</span><br>
<span>${tab}</span>// start - not gas optimized<br>
<span>${tab}</span>// function sumIfEvenAndLessThan99(uint[] memory nums) external {<br>
<span>${tab}</span>// <span>${tab}</span>for (uint i = 0; i < nums.length; i += 1) {<br>
<span>${tab}</span>// <span>${tab}${tab}</span>bool isEven = nums[i] % 2 == 0;<br>
<span>${tab}</span>// <span>${tab}${tab}</span>bool isLessThan99 = nums[i] < 99;<br>
<span>${tab}</span>// <span>${tab}${tab}</span>if (isEven && isLessThan99) {<br>
<span>${tab}</span>// <span>${tab}${tab}${tab}</span>total += nums[i];<br>
<span>${tab}</span>// <span>${tab}${tab}</span>}<br>
<span>${tab}</span>// <span>${tab}</span>}<br>
<span>${tab}</span>// }
`;

export default function SmartContract() {
  const [elementRef, isElementVisible] = useIsElementVisible({ threshold: 0.5 });
  return (
    <div className="body flex flex-col h-screen mx-8 sm:mx-20 justify-center" ref={elementRef}>
      <div>
        {isElementVisible && (
          <DynamicAnimatedText separator="<br>" isTextVisible lineAnimationDuration={0.1} stagger={0.1}>
            {SMART_CONTRACT_TEXT}
          </DynamicAnimatedText>
        )}
      </div>
    </div>
  );
}
