import "next-auth";
//credenciales 
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      token: string;
      user : {
        menus : []
      }
    };
    
  }
}
//menu
type menus = [{
  id: number;
  option: string;
  link : string
  icon :string
}];

interface Menu {
  id: number;
  option: string;
  link: string;
  icon: string;
}

interface DataRespon {
  data :{
  data : []
  message : string
  error: string
  status: number
  }
  
}