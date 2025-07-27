export default async function UpdateLocalstorageForOrder() {
        try{
                localStorage.setItem("orderConfirmed","true")
        }
        catch(error){
            console.log(error)
        }
}