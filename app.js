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

let clearTable=()=>{
    let t=document.querySelector("#appointments")
    while(t.firstChild){
        t.removeChild(t.firstChild)
    }
}

statesSelector.addEventListener('input',()=>{
    clearTable()
    districts={}
    document.querySelector(".selected-state").innerText=statesSelector.value
    if (selectedDistrict!==undefined){
        selectedDistrict=undefined
        document.querySelector(".selected-district").innerText='Selected District : '
    }
    getDistricts(states[statesSelector.value])
    .then((data)=>{
        let temp=data.districts
        for (x of temp){
            districts[x.district_name]=x.district_id 
        }
        selectedDistrict=districts[Object.keys(districts)[0]]
        document.querySelector(".selected-district").innerText=Object.keys(districts)[0]
    })
    .then(()=>{
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
    clearTable()
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
currMonths=[5]

async function getAppointments(districtCode,date){
    let res = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtCode}&date=${date}`)
    let data = await res.json()
    return data
}

let data_elems=["pincode","name","fee_type","vaccine","available_capacity_dose1","available_capacity_dose2"]

let getAppointmentsForDate=function (){
    clearTable()
    if(typeof selectedDistrict!=='undefined' && selectedDistrict!=='Selected District : '){
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
            let allSessions=data["sessions"]
            if(allSessions.length===0){
                document.querySelector(".result").innerText="Nothing found"
            }
            else{
                let table=document.querySelector("#appointments")
                for (s of allSessions){
                    let row=document.createElement("tr")
                    for(e of data_elems){
                        let td=document.createElement('td')
                        if(e!=="name"){
                            td.innerText=s[e]
                        }
                        else{
                            td.innerText=`${s[e]}, ${s["block_name"]}`
                        }
                        if(e==="available_capacity_dose1" || e==="available_capacity_dose2"){
                            if (parseInt(s[e])<=0){
                                td.innerText="0"
                                td.classList.add("red")
                            }
                            else{
                                td.classList.add("green")
                            }
                        }
                        row.append(td)
                    }
                    table.append(row)
                }
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

// let checked
// for (b of document.querySelectorAll("input[name='avail']")){
//     b.addEventListener('click',()=>{
//         for (b of document.querySelectorAll("input[name='avail']")){
//             if (b.checked===true){
//                 checked=b.value
//                 break
//             }
//         }
//     })
// }