export const signUp=(req,res)=>{
    try {
        const{user_name,gender,dob,firstname,lastname,email}=req.body;
    } catch (error) {
        console.log(error.message);
    }
}

export const signIn=(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error.message);
    }
}

export const updatePfp=(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error.message);
    }
}

export const logOut=(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error.message);
    }
}