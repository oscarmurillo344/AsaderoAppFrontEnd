export class LoginUsuario{
    username: string;
    password: string;

    constructor(usuario:string,pass:string){
        this.username=usuario;
        this.password=pass;
    }
}