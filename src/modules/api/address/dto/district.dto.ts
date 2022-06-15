import { IsString } from "class-validator";

export class DistrictDto{
    @IsString()
    name: string;

    @IsString()
    abbreviation: string;

    @IsString()
    zip: string;

    
}