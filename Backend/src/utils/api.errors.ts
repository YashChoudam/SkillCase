class ApiError extends Error {
    statusCode : number ;
    data : null ;
    errors : unknown[] ;
    success : boolean ;

    constructor(
        statusCode: number ,
        message: string = "Something went wrong",
        errors: unknown[] = [] ,
        stack?: string
    ){
        super(message) ;
        this.statusCode = statusCode ;
        this.data = null ;
        this.success = false ;
        this.errors = errors ;

        if(stack){
            this.stack = stack ;
        }
    }
}

export {ApiError} ;