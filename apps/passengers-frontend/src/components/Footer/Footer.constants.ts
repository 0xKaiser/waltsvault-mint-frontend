const tab = '&emsp;&emsp;';
export const SMART_CONTRACT_TEXT = `
event HighestBidIncreased(address bidder, uint amount);<br>
<span>${tab}</span>event AuctionEnded(address winner, uint amount);<br>
<span>${tab}</span><br>
<span>${tab}</span>constructor(<br>
<span>${tab}</span><span>${tab}</span>uint _biddingTime,<br>
<span>${tab}</span><span>${tab}</span>address payable _beneficiary<br>
<span>${tab}</span>) public {<br>
<span>${tab}</span><span>${tab}</span>beneficiary = _beneficiary;<br>
<span>${tab}</span><span>${tab}</span>auctionEndTime = now + _biddingTime;<br>
<span>${tab}</span>}<br>
<span>${tab}</span><br>
function confirmReceived()<br>
<span>${tab}</span><span>${tab}</span>public<br>
<span>${tab}</span><span>${tab}</span>onlyBuyer<br>
<span>${tab}</span><span>${tab}</span>inState(State.Locked)<br>
<span>${tab}</span>{<br>
<span>${tab}</span><span>${tab}</span> emit ItemReceived();<br>
<span>${tab}</span><span>${tab}</span> state = State.Inactive;<br>
<span>${tab}</span><span>${tab}</span> buyer.transfer(value);<br>
<span>${tab}</span><span>${tab}</span> seller.transfer(address(this).balance);<br>
<span>${tab}</span>}<br>
}
`;

export const LINK_CLASSES = 'body sm:button-large flex items-end pl-4 h-10';
// export const LINKS = [
//   {
//     text: 'discord',
//     to: SOCIAL_MEDIA.whiteList.discord,
//     icon: DISCORD_ICON,
//     IconPassenger: DISCORD_PASSENGER_ICON,
//     alt: 'discord icon',
//   },
//   {
//     text: 'twitter',
//     to: SOCIAL_MEDIA.whiteList.twitter,
//     icon: TWITTER_ICON,
//     IconPassenger: TWITTER_PASSENGER_ICON,
//     alt: 'twitter icon',
//   },
//   {
//     text: 'mail',
//     to: SOCIAL_MEDIA.whiteList.email,
//     icon: EMAIL_ICON,
//     IconPassenger: EMAIL_PASSENGER_ICON,
//     alt: 'mail icon',
//   },
// ];
export const INTERSECTION_OBSERVER_OPTIONS = {
  threshold: 0,
};
