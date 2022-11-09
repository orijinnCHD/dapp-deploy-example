import { useRef,useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Contract({ value , text }) {
  const spanEle = useRef(null);

  useEffect(() => {
    spanEle.current.classList.add("flash");
    const flash = setTimeout(() => {
      spanEle.current.classList.remove("flash");
    }, 300);
    return () => {
      clearTimeout(flash);
    };
  }, [value]);

// traitement des events

const [eventValue,setEventValue] =useState("");
const [oldEvents,setOldEvents] =useState("");

const { state: { contract } } = useEth();

  useEffect(()=>{
    (async function () {
      

      // les events passés
      let oldEvents= await contract.getPastEvents('valueChanged', {
         fromBlock: 0,
         toBlock: 'latest'
       });
       let oldies=[];
       oldEvents.forEach(event => {
           oldies.push(event.returnValues._val);
       });
       setOldEvents(oldies);
      

       // les events en cours
       await contract.events.valueChanged({fromBlock:"earliest"})
       .on('data', event => {
         let lesevents = event.returnValues._val;
         setEventValue(lesevents);
       })          
       .on('changed', changed => console.log(changed))
       .on('error', err => console.log(err))
       .on('connected', str => console.log(str))
   })();
  },[contract])
// contract est obligatoire ou voir ce quei se passe dans le context


  return (
    <code>
      {`contract SimpleStorage {
  uint256 value = `}

      <span className="secondary-color" ref={spanEle}>
        <strong>{value}</strong>
      </span>

    {`; 
  string greeter = `}

      <span className="secondary-color" ref={spanEle}>
        <strong>{text}</strong>
      </span>

      {`;

  function read() public view returns (uint256) {
    return value;
  }

  function write(uint256 newValue) public {
    value = newValue;
  }


  function setGreet(string calldata _greeter )public{

    greeter = _greeter;

  }

  function greet()external view returns (string memory){

      return greeter;

  }


}

Evenements  arriving : `} {eventValue} {`
 
Old events: `} {oldEvents}

{/* `} */}
    </code>
  );
}

export default Contract;
