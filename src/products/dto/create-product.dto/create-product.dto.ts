import { IsString } from 'class-validator';


export class CreateProductDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly brand: string;

    @IsString({each: true})
    readonly kemasans: string[];
}
