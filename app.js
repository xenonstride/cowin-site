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

statesSelector.addEventListener('input',()=>{
    districts={}
    getDistricts(states[statesSelector.value])
    .then((data)=>{
        let temp=data.districts
        console.log(temp)
        for (x of temp){
            districts[x.district_name]=x.district_id 
        }
    })
    .then(()=>{
        console.log(districts)
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

currMonths=[5,6,7]

let c=1
for (m of currMonths){
    let month=document.querySelector(`.month${c}`)
    for(let a=0;a<parseInt(monthDays[m]);a++){
        let day=document.createElement('div')
        day.innerText=a+1
        day.classList.add('box')
        month.appendChild(day)
    }
    c+=1
}







