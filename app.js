async function getStates(){
    let res = await fetch('https://cdn-api.co-vin.in/api/v2/admin/location/states')
    let data = await res.json()
    return data
}

let states={}
let statesSelector=document.querySelector("#state")

getStates()
.then(data=>{
    let temp=data.states
    for (x of temp){
        states[x.state_name]=x.state_id 
    }
})
.then(()=>{
    for (state of Object.keys(states)){
            let op=document.createElement('option')
            op.value=state
            op.innerText=state
            statesSelector.appendChild(op)
        }
})

async function getDistricts(stateCode){
    let res = await fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateCode}`)
    let data = await res.json()
    return data
}

let districtSelector=document.createElement('select')
districtSelector.id="district"
let districts={}
let selectedDistrict

statesSelector.addEventListener('input',()=>{
    districts={}
    document.querySelector(".selected-state").innerText=statesSelector.value
    if (selectedDistrict!==undefined){
        selectedDistrict=undefined
        document.querySelector(".selected-district").innerText='' 
    }
    getDistricts(states[statesSelector.value])
    .then((data)=>{
        let temp=data.districts
        console.log(temp,"hello1")
        for (x of temp){
            districts[x.district_name]=x.district_id 
        }
        selectedDistrict=districts[Object.keys(districts)[0]]
    })
    .then(()=>{
        console.log(districts,"hello2")
        if (document.querySelector("#district")==null){
            statesSelector.insertAdjacentElement('afterend',districtSelector)
        } 
        else{
            districtSelector.innerHTML=''
        }
        for (district of Object.keys(districts)){
            let dis=document.createElement('option')
            dis.value=district
            dis.innerText=district
            districtSelector.appendChild(dis)
        }
    })
       
})

districtSelector.addEventListener('input',()=>{
    selectedDistrict=districts[districtSelector.value]
    document.querySelector(".selected-district").innerText=districtSelector.value
})

monthDays={
    1:"31",
    2:"28",
    3:"31",
    4:"30",
    5:"31",
    6:"30",
    7:"31",
    8:"31",
    9:"30",
    10:"31",
    11:"30",
    12:"31"
}

// change this to three months currently
currMonths=[5,6,7]

async function getAppointments(districtCode,date){
    let res = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtCode}&date=${date}`)
    let data = await res.json()
    return data
}

let getAppointmentsForDate=function (){
    console.log(selectedDistrict,"hello3")
    console.log(typeof selectedDistrict!=='undefined')
    if(typeof selectedDistrict!=='undefined' && selectedDistrict!==''){
        date=this.innerText
        month=currMonths[parseInt(this.parentNode.classList[0].slice(-1))-1].toString()
        if (month.length===1){
            month="0"+month
        }
        year=2021
        dateStr=`${date}-${month}-${year}`
        console.log(dateStr,"hello4")
        getAppointments(selectedDistrict,dateStr)
        .then((data)=>{
            if(data["sessions"].length===0){
                document.querySelector(".result").innerText="Nothing found"
            }
        })
    }
}

let c=1
for (m of currMonths){
    let month=document.querySelector(`.month${c}`)
    for(let a=0;a<parseInt(monthDays[m]);a++){
        let day=document.createElement('div')
        day.innerText=a+1
        day.classList.add('box')
        month.appendChild(day)
        day.addEventListener('click',getAppointmentsForDate)
    }
    c+=1
}