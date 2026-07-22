//https://www.youtube.com/watch?v=9MfwYoWKKVE

const MyNums=[1,5,3,5,7]

const shoppingCart=[
    {
        ItemName:"Js course",
        price:2000
    },
    {
        ItemName:"Java course",
        price:3000
    },
    {
        ItemName:"Mobile course",
        price:1000
    },
    {
        ItemName:"Python course",
        price:4000
    }
]

const TotalPrices=shoppingCart.reduce((acc, item) => acc + item.price, 0)

console.log("Total course", TotalPrices)

let abc = [15, 16, 17, 18, 19].reduce((accumulator, currentValue) =>{ 
    console.log(`Acc: ${accumulator} and Curr: ${currentValue}`)
    return accumulator + currentValue;
    
},10);
console.log(abc)


function findSum(arr){
    let sum=0
    for(let i=0;i<arr.length;i++){
        sum=sum + arr[i]
    }
    return sum;
}
console.log("fun Sum",findSum(MyNums))

/*
const MyTotal=MyNums.reduce(function(Acc,Curr){
   
    console.log(`Acc: ${Acc} and Curr: ${Curr}`)
    // Acc: 0 and Curr: 1  
    // Acc: 1 and Curr: 5  
    // Acc: 6 and Curr: 3
    return Acc+Curr
},0)

console.log(MyTotal) */
// Arrow functions 
// const MyTotal= MyNums.reduce((Acc, Curr) => Acc+Curr, 0 )
// console.log(MyTotal)

/*== find Max number and Min ====*/

function findMax(arr){
    var maxNo=0;
    for(let i=0;i<arr.length;i++){
        if(arr[i] > maxNo){
            maxNo=arr[i]
        }
    }
return maxNo;
}
console.log("find max number: ",findMax(MyNums));
//----------
function min(arr){
    var smallest = arr[0];
    for(let i=1;i<arr.length;i++){
        if(arr[i] < smallest){
            smallest=arr[i]
        }
    }
    return smallest
}
console.log("Min=",min(arr))


const maxNumberHave=MyNums.reduce((acc,curr)=>{
    if(curr > acc){
        acc=curr;
    }
    return acc
},0)
console.log(maxNumberHave)


/*==most Important====*/

const inventory = [
    { name: "asparagus", type: "vegetables", quantity: 5 },
    { name: "bananas", type: "fruit", quantity: 0 },
    { name: "goat", type: "meat", quantity: 23 },
    { name: "cherries", type: "fruit", quantity: 5 },
    { name: "fish", type: "meat", quantity: 22 },
  ];


  const resultGroupBy= inventory.reduce(function(acc,curr){
        if(acc[curr.type]){
            acc[curr.type]=++ acc[curr.type];
        }else{
            acc[curr.type]=1;
        }
        return acc;
  },{})

  console.log("Inventory Result Group By",resultGroupBy)