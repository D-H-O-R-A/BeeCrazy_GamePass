import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import './App.css';
//import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, mainCharacter } from './images';

import { binanceLogo, dollarCoin, mainCharacter, background,iconBee,beePassIcon,dailyIcon,friendShip, nftMenu,minesMenu,bkpoints,boost,energy,minesSelected,friendShipSelect,nftMenuSelect } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ref,getDatabase,get, update } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYLnuwToPYKoQ_4fTT1tiy1Pi_L9TDqiU",
  authDomain: "beecrazy-gamepass.firebaseapp.com",
  projectId: "beecrazy-gamepass",
  storageBucket: "beecrazy-gamepass.appspot.com",
  messagingSenderId: "1008775025261",
  appId: "1:1008775025261:web:2ad9bef0240b4e8e5c2564",
  measurementId: "G-KGPVQ6ZJFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const db = getDatabase();

const App: React.FC = () => {

var getParameterByName = (name:string, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
} // obter parametros passados na url pelo href, como ?uid=uid_do_cliente&nameTelegram=name_telegram_do_cliente

const uid = getParameterByName('uid'); //uid para salvamento de dados no db
const nameTelegram = getParameterByName('nameTelegram'); //nome do telegram para indentificação na etapa 2 do projeto

var setDataScoreDB = (oldState:string|null|undefined) =>{
  console.log("db atualizado")
  if(uid != undefined && uid != null && uid != ""){
    update(ref(db, "/bot/" + uid), { score: getScore(), name:nameTelegram, oldState:oldState })
    .then(() => {
        console.log("Dados salvos com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao salvar os dados: ", error);
    });
  }
} //use update para fazer atualizações aos dados caso existam ou não no db

var getData = (uid:string|null|undefined) => {
  console.log("dados obtidos")
  if(uid != undefined && uid != null && uid != ""){
    get(ref(db, "/bot/" + uid))
    .then((snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.hasChild('score')){
          storageScore(snapshot.val().score)
        }
        if (snapshot.hasChild('oldState')){
          setDataStop(snapshot.val().oldState,true)
        }
        return true
      }
    })
  }
  return false;
} //obter histórico de dados no db caso exista ou não, sem o uid, não há salvamento de dados

  const [selected, setSelected] = useState("mines"); // Use useState to manage selected
  const profitPerHour = 126420; // ganhos por hora
  const pointsPerSecond = Math.floor(profitPerHour / 3600); //ganhos por segundo

  var setDataStop = (v:string, t:boolean) =>{
    if(t){
      localStorage.setItem('dataStop',v)
    }else{
      localStorage.removeItem('dataStop')
    }
  } //define e apaga o "dataStop", váriavel usada para calcular o tempo que o usuário esteve fora do game para deifnir os ganhos dele com base no score.

  var getScore = () =>{
    const stm = localStorage.getItem("storageScore");
    return stm ? parseInt(stm) : 0;
  } // obtem o score atual em localStorage após ser definido pela obtenção de dados do db ou pelo histórico do navegador caso seja um teste local ou não tenha sido passado o uid

  var storageScore = (a:number)=>{
    localStorage.setItem("storageScore",(a).toString()); 
    return getScore()
  } // define um valor para o score no localStorage

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  var oldData = localStorage.getItem("dataStop")
  var od = oldData != undefined || oldData != null ? parseInt(oldData) : 0
  if(od != 0){
    var secondsUnlog = (currentTimeInSeconds - od) * pointsPerSecond;
    getData(uid) //get history data
    storageScore(getScore() + secondsUnlog)
    setDataStop("",false)
    setDataScoreDB(null)
  }



  useEffect(() => {
    // usado para quando o usuário fechar a página do navegador ou sair do game, ele faz esse último salvamento de dados após sair.
    const handleBeforeUnload = () => {
      // Dados que você deseja salvar
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      setDataScoreDB(currentTimeInSeconds.toString())
      setDataStop(currentTimeInSeconds.toString(),true)
    };

    // Adiciona o listener para o evento beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Remove o listener quando o componente é desmontado
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  const levelNames = [
    "Soldado",    // From 0 to 4999 coins
    "Cabo",    // From 5000 coins to 24,999 coins
    "Sargento",      // From 25,000 coins to 99,999 coins
    "Subtenente",  // From 100,000 coins to 999,999 coins
    "Aspirante",   // From 1,000,000 coins to 2,000,000 coins
    "Tenente",      // From 2,000,000 coins to 10,000,000 coins
    "Capitão", // From 10,000,000 coins to 50,000,000 coins
    "Tn. Coronel",    // From 50,000,000 coins to 100,000,000 coins
    "Coronel", // From 100,000,000 coins to 1,000,000,000 coins
    "Gen. Brigada",// From 1,000,000,000 coins to 10,000,000,000 
    "Gen. Divisão", // From 10,000,000,000 coins to 100,000,000,000
    "Gen. Exército" // From 100,000,000,000 coins to Infinity
  ];

  const levelMinPoints = [
    0,        // Bronze
    5000,     // Silver
    25000,    // Gold
    100000,   // Platinum
    1000000,  // Diamond
    2000000,  // Epic
    10000000, // Legendary
    50000000, // Master
    100000000,// GrandMaster
    1000000000,// Lord
    10000000000,
    100000000000
  ];

  const limitClick = 5000
  var storageLimitPoints = () =>{
    const stm = localStorage.getItem("storageLimitPoints");
    return stm ? parseInt(stm) : 0;
  }

  const getCurrentUnixTimestamp = () => {
    return Math.floor(Date.now() / 1000);
  };

  const isDifference24Hours = (savedTimestamp:number) => {
    const currentTimestamp = getCurrentUnixTimestamp();
    const secondsIn24Hours = 24 * 60 * 60;
    const difference = currentTimestamp - savedTimestamp;

    return difference >= secondsIn24Hours;
  };

  var pointsPlus = () =>{
    const date = localStorage.getItem("storageLimitDataPoints")
    var d = date != undefined || date != null ? date : (Date.now() / 1000).toString()
    if(isDifference24Hours(parseInt(d))){
      localStorage.setItem("storageLimitPoints",(0).toString());
      localStorage.removeItem("storageLimitDataPoints") 
    }else{
      const stm = localStorage.getItem("storageLimitPoints");
      const sx = stm ? parseInt(stm) : 0;
      localStorage.setItem("storageLimitPoints",(sx+1).toString());
    }
  }

  const [levelIndex, setLevelIndex] = useState(0);
  const [points, setPoints] = useState(getScore());
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 11;
  //const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(storageLimitPoints() < limitClick){
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
      setTimeout(() => {
        card.style.transform = '';
      }, 100);
      setPoints(points + pointsToAdd);
      setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
      pointsPlus()
    }else{
      swal("Oops!", "Limit of 5000 clicks reached! Come back in 24h.", "error");
    }
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };



  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prevPoints => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  setInterval(()=>{
    //save points
    var point = document.getElementById("as")?.innerText
    var p = point != undefined ? parseInt(point.replace(/[.,]/g, '')) : 0
    var x = getScore() > p ? getScore() : p
    console.log(point,p,x)
    storageScore(x)
  },250)

  var changeLayout = (x:string) =>{
    setSelected(x)
    const elementWithId = document.getElementById('selected');

    // Seleciona o objeto com a classe .mine
    const elementWithClassMine = document.querySelector('.'+x);

    // Verifica se os elementos existem para evitar erros
    if (elementWithId && elementWithClassMine) {
      // Remove o id do primeiro objeto
      const idToRemove = elementWithId.id;
      elementWithId.id= "hidden";

      // Adiciona o id ao objeto com a classe .mine
      elementWithClassMine.id = idToRemove;
    }
  }

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl mines" id='selected'>
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <img src={iconBee} className='w-25 h-25' style={{height:"25px", width: "25px"}} />
            </div>
            <div>
              <p className="text-sm">{nameTelegram == null || nameTelegram == "" ? "Sandro" : nameTelegram} (CEO)</p>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-[12px]">BeeSoldier: {levelNames[levelIndex]}</p>
                  <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                </div>
                <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex items-center w-2/3 px-4 py-[2px] bg-[#43433b]/[0.0] max-w-64" style={{flex: 1, backgroundImage: `url(${bkpoints})`, backgroundSize: 'cover', backgroundPosition: 'center',}}>
              <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium">Profit per Day</p>
                <div className="flex items-center justify-center space-x-1">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                  <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <Settings className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[0px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[0px]"  style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="px-2 py-2 pl-4 pr-4 bg-[#f3ba2f] flex justify-between gap-2">
              <div className="bg-[#000000] rounded-lg px-4 py-2 w-full relative" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', }}>
                <div className="dot"></div>
                <img src={beePassIcon} alt="Daily Reward" className="mx-auto w-12 h-12" />
                <div className='d-flex flex-column align-items-start align-content-start flex-grow-1 p-0 px-3 text-start' style={{flex:1}}>
                <p className="text-[10px] text-center text-white mt-1">Bee Tokens Points</p>
                <p className="text-[20px] font-medium text-center text-white-400">{getScore()}</p>
                </div>
              </div>
              <div className="bg-[#000000] rounded-lg px-4 py-2 w-full relative" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', }}>
                <div className="dot"></div>
                <img src={dailyIcon} alt="Daily Points" className="mx-auto w-12 h-12" />
                <div className='d-flex flex-column align-items-start align-content-start flex-grow-1 p-0 px-3 text-start' style={{flex:1}}>
                <p className="text-[10px] text-center text-white mt-1">Last 24h Points</p>
                <p className="text-[20px] font-medium text-center text-white-400">{getScore() > (pointsPerSecond*86400) ? (getScore()-(pointsPerSecond*86400)) : getScore()}</p>
                </div>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p className="text-4xl text-white" id='as'>{points.toLocaleString()}</p>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center" style={{zIndex:"1"}}>
              <div
                className="w-80 h-100 p-4 rounded-full circle-outer"
                onClick={handleCardClick}
              >
                <div className="w-full h-full rounded-full circle-inner">
                  <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                </div>
              </div>
            </div>

            <div  style={{ width: '100%', padding: '10px 20px', backgroundColor: 'rgba(255, 255, 255, 0.0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',zIndex:"999999", position:"absolute", bottom:"70px" }}>
              <div style={{display:"flex",flexDirection:"column",flexWrap:"nowrap",justifyContent:"center",alignItems:"center"}}>
                <img src={energy} style={{width:"40px"}} alt="" />
                <p style={{fontSize:"16px"}} id='limitPointsScore'>{limitClick}/{limitClick-storageLimitPoints()}</p>
              </div>
              <div>
                <img src={boost} alt="" style={{width:"80px"}} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl nftMenu" id='hidden'>

      </div>

      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl friendShip" id='hidden'>

      </div>

      {/* Bottom fixed div */}
      <div className="px-2 py-1 fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-center items-center z-50 rounded-3xl text-xs">
        
        <div className="text-center text-[#85827d] w-1/5">
           <img onClick={() => changeLayout('mines')} src={selected == "mines" ? minesSelected : minesMenu} alt="" className={selected == "mines" ? 'h-16 mx-auto' : ' h-12 mx-auto' }/>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <img onClick={() => changeLayout('nftMenu')}  src={selected == "nftMenu" ? nftMenuSelect  : nftMenu } alt="" className={selected == "nftMenu" ? 'h-16 mx-auto' : ' h-12 mx-auto' }/>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <img onClick={() => changeLayout('friendShip')}  src={selected == "friendShip" ? friendShipSelect : friendShip} alt="" className={selected == "friendShip" ? 'h-16 mx-auto' : ' h-12 mx-auto' } />
        </div>

      </div>

      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {pointsToAdd}
        </div>
      ))}
    </div>
  );
};

export default App;
