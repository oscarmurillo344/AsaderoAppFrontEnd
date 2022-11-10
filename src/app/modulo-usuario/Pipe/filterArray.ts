import {Pipe,PipeTransform } from '@angular/core';


@Pipe({
    name:'convertir'
})

export class FilterArray implements PipeTransform{

    transform(value: any[]):any[] {
        if(value === null || value.length < -1)return value;
        let restult=[];
       restult = value.map((val,index)=> value.length-1 == index ? ` ${val.rolNombre}. ` : ` ${val.rolNombre}` )
        return restult;
    }

}